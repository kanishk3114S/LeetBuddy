import { GoogleGenAI } from "@google/genai";
import Contest from "../models/contest.model.js";

/**
 * Benchmark solve times (in seconds) by difficulty
 */
const DIFFICULTY_THRESHOLDS = {
  Easy: 12 * 60,    // > 12m is slow
  Medium: 25 * 60,  // > 25m is slow
  Hard: 40 * 60     // > 40m is slow
};

/**
 * Step A: Deterministically extracts bleeding contest questions using 3 strict rules
 * 
 * 1. Unsolved Walls: status !== "Accepted" && (failCount > 0 || errorCause)
 * 2. Unreached Q3/Q4 Ceilings: First "Not Attempted" question in each contest
 * 3. Slow / High-Tax Solves: status === "Accepted" && (failCount >= 1 || splitSeconds > threshold)
 */

export function extractBleedingQuestions(recentFiveContests = []) {
  if (!Array.isArray(recentFiveContests) || recentFiveContests.length === 0) {
    return [];
  }

  const bleedingQuestions = [];

  for (const contest of recentFiveContests) {
    const contestTitle = contest.contestTitle || "Contest";
    const questions = contest.questions || [];
    const t0 = contest.startTime || 0;
    let prevTime = t0;
    let firstUnreachedCaptured = false;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const isAccepted = q.status === "Accepted";
      const failCount = Number(q.failCount) || 0;
      const difficulty = q.difficulty || (i === 0 ? "Easy" : i === 3 ? "Hard" : "Medium");

      // Calculate split time
      let splitSeconds = 0;
      if (q.submittedAt && q.submittedAt > t0) {
        splitSeconds = Math.max(0, q.submittedAt - prevTime);
        prevTime = q.submittedAt;
      }

      const splitMinutes = Math.round(splitSeconds / 60);
      const threshold = DIFFICULTY_THRESHOLDS[difficulty] || 25 * 60;
      const isSlow = splitSeconds > threshold;

      // Rule 1: Unsolved Walls
      if (!isAccepted && (failCount > 0 || (q.errorCause && q.errorCause !== "None"))) {
        bleedingQuestions.push({
          contestTitle,
          title: q.title,
          titleSlug: q.titleSlug,
          difficulty,
          status: q.status || "Failed",
          errorCause: q.errorCause || "Wrong Answer",
          failCount,
          splitMinutes,
          language: q.language || "cpp",
          bleedType: "WALL",
          bleedReason: `Attempted with ${failCount} fail(s) (${q.errorCause || "Rejected"}) without solving`
        });
      }
      // Rule 2: Unreached Q3/Q4 Ceilings (Capture first Not Attempted question where progress halted)
      else if (!isAccepted && !firstUnreachedCaptured && (i === 2 || i === 3)) {
        firstUnreachedCaptured = true;
        bleedingQuestions.push({
          contestTitle,
          title: q.title,
          titleSlug: q.titleSlug,
          difficulty,
          status: "Not Attempted",
          errorCause: "Clock Expired / Starved",
          failCount: 0,
          splitMinutes: 0,
          language: q.language || "cpp",
          bleedType: "CEILING",
          bleedReason: `Unreached ceiling: clock expired before you could attempt ${q.difficulty} Q${i + 1}`
        });
      }
      // Rule 3: Slow / High-Tax Solves
      else if (isAccepted && (failCount >= 1 || isSlow)) {
        const penaltyMin = failCount * 5;
        const reasons = [];
        if (failCount > 0) reasons.push(`+${penaltyMin}m penalty (${failCount} fails)`);
        if (isSlow) reasons.push(`slow solve (${splitMinutes}m vs benchmark)`);

        bleedingQuestions.push({
          contestTitle,
          title: q.title,
          titleSlug: q.titleSlug,
          difficulty,
          status: "Accepted",
          errorCause: q.errorCause || (failCount > 0 ? "Penalty Bleed" : "Implementation Drag"),
          failCount,
          splitMinutes,
          language: q.language || "cpp",
          bleedType: "SLOW_SOLVE",
          bleedReason: `Solved with ${reasons.join(" and ")}`
        });
      }

    }
  }

  // Deduplicate by titleSlug if encountered across multiple events, prioritize most severe
  const uniqueMap = new Map();
  for (const bq of bleedingQuestions) {
    if (!uniqueMap.has(bq.titleSlug)) {
      uniqueMap.set(bq.titleSlug, bq);
    }
  }

  return Array.from(uniqueMap.values());
}

/**
 * Step B & C: Generate AI Remediation Blueprint via Google Gemini
 * 
 * @param {string} username - LeetCode username
 * @param {Object} options - { forceRefresh: boolean }
 * @returns {Promise<Object>} Remediation payload
 */
export async function generateContestRemediation(username, options = {}) {
  if (!username) {
    throw new Error("LeetCode username is required for contest AI remediation");
  }

  const cleanUsername = username.toLowerCase().trim();
  const contestDoc = await Contest.findOne({ leetcodeUsername: cleanUsername });

  if (!contestDoc) {
    throw new Error(`Contest record not found for username "${username}"`);
  }

  // 1. Check if cached remediation exists and is fresh (< 7 days old)
  const cached = contestDoc.aiDeepDiveRemediation;
  const isFresh = cached?.generatedAt && (Date.now() - new Date(cached.generatedAt).getTime()) < 7 * 24 * 3600 * 1000;

  if (!options.forceRefresh && isFresh && cached?.weakTopicDiagnoses?.length > 0) {
    return {
      source: "cache",
      ...cached.toObject?.() || cached
    };
  }

  // 2. Extract bleeding questions
  const recentFive = contestDoc.recentFiveContestsDeepDive || [];
  const bleedingList = extractBleedingQuestions(recentFive);

  if (bleedingList.length === 0) {
    return {
      source: "clean",
      generatedAt: new Date(),
      model: "system-heuristic",
      weakTopicDiagnoses: [
        {
          topic: "Flawless Contest Execution",
          whyUnderPressure: "Zero high-tax slow solves, penalty bleeds, or unreached ceilings detected in evaluated contests.",
          symptoms: ["Clean first-attempt submissions across all questions"],
          recommendedProblems: [
            {
              title: "Trapping Rain Water II",
              titleSlug: "trapping-rain-water-ii",
              difficulty: "Hard",
              targetSolveTime: "< 25 mins",
              focusNote: "Push your speed limit on Hard priority queue / BFS grid simulation."
            }
          ]
        }
      ],
      questionBlueprints: []
    };
  }

  // Cap at top 6 most critical bleeding questions to fit context and maintain high signal
  const priorityList = bleedingList.slice(0, 6);

  // 3. Call Google Gemini with structured JSON output
  const apiKey = process.env.GEMINI_API_KEY_FOR_CONTEST || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in backend environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const candidateModels = ["gemini-3.5-flash-lite", "gemini-3.8-flash"];

  const systemInstruction = `
You are the world-class competitive programming coach for 'LeetBuddy'.
You are analyzing a competitive programmer's high-cost "Bleeding Questions" from their last 5 rated LeetCode contests.
Bleeding questions represent rating lost either through:
- Hard Rejections (Time Limit Exceeded, Wrong Answer, Runtime Error).
- Unreached Ceilings (Clock expired before reaching Q3/Q4).
- High-Tax Slow Solves (Solved, but bled 5m–20m in wrong submissions or 35m+ slow implementation drag).


Your job is to generate a surgical, brutally specific, and technically rigorous AI Remediation Blueprint.

JSON RESPONSE SCHEMA:
{
  "weakTopicDiagnoses": [
    {
      "topic": "Specific Algorithmic Pattern (e.g. State-Machine DP / Rolling Prefix Invariant / Monotonic Stack)",
      "whyUnderPressure": "2-3 crisp sentences explaining the exact conceptual or cognitive failure under a 90-minute timer",
      "symptoms": [
        "Concise symptom 1 (e.g., Falling back to O(N^2) brute-force subarray checks when O(N) sliding window was required)",
        "Concise symptom 2 (e.g., Rushing edge-case submits without checking 64-bit integer overflow or single-element arrays)"
      ],
      "recommendedProblems": [
        {
          "title": "Exact LeetCode Problem Title",
          "titleSlug": "exact-leetcode-slug-lowercase-kebab-case",
          "difficulty": "Medium or Hard",
          "targetSolveTime": "< 20 mins or < 30 mins",
          "focusNote": "Specific directive on what algorithmic trick to drill to stop the contest leak"
        }
      ]
    }
  ],
  "questionBlueprints": [
    {
      "title": "Contest Problem Title",
      "titleSlug": "contest-problem-slug",
      "contestTitle": "Contest Name",
      "whyYouBled": "Direct 1-2 sentence statement of where rating bled (e.g., 'Solved in 45m with 3 Wrong Answers (+15m penalty) due to off-by-one errors on prefix boundaries')",
      "coreTrick": "The exact optimal mathematical or data-structure insight needed to solve this problem cleanly in under 15 minutes",
      "targetComplexity": "Target time and space complexity, e.g. O(N log N) time, O(1) space"
    }
  ]
}

STRICT TECHNICAL RULES:
- Recommend 2-3 weakTopicDiagnoses and 2 recommended problems per topic.
- In recommendedProblems, use REAL, famous LeetCode problem titles and valid kebab-case slugs (e.g. "subarray-sum-equals-k", "longest-valid-parentheses", "coin-change", "daily-temperatures", "course-schedule-ii").
- Provide 1 questionBlueprint for each provided bleeding question.
- Do NOT output generic advice like "practice more". Explain the actual technical trick (e.g. "Store prefix remainder in hash map modulo k", "Use monotonic decreasing deque to maintain window minimum in O(1)").
- Output valid raw JSON only.
`;

  const userPrompt = `
User: ${cleanUsername}
Current Rating: ${contestDoc.summary?.rating || 1850}
Attended Contests: ${contestDoc.summary?.attendedContestsCount || 5}

Bleeding Contest Questions from Last 5 Contests:
${JSON.stringify(priorityList, null, 2)}
`;

  let lastError = null;
  let parsedResult = null;
  let usedModel = "gemini-3.5-flash-lite";

  for (const modelName of candidateModels) {
    try {
      console.log(`[AI Contest Remediation] Calling Gemini (${modelName}) for ${cleanUsername}...`);
      const startTime = Date.now();
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `${systemInstruction}\n\n${userPrompt}`,
        config: {
          responseMimeType: "application/json"
        }
      });
      const duration = Date.now() - startTime;
      console.log(`[AI Contest Remediation] Received response in ${duration}ms from ${modelName}`);

      const text = response?.text?.trim() || "";
      const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
      parsedResult = JSON.parse(cleaned);
      usedModel = modelName;

      if (parsedResult?.weakTopicDiagnoses?.length > 0) {
        break;
      }
    } catch (err) {
      lastError = err;
      console.warn(`[AI Contest Remediation] Model ${modelName} failed:`, err.message);
    }
  }

  if (!parsedResult || !parsedResult.weakTopicDiagnoses) {
    throw new Error(`AI remediation generation failed: ${lastError?.message || "All models failed"}`);
  }

  // 4. Persist to MongoDB
  const remediationData = {
    generatedAt: new Date(),
    model: usedModel,
    weakTopicDiagnoses: parsedResult.weakTopicDiagnoses || [],
    questionBlueprints: parsedResult.questionBlueprints || []
  };

  await Contest.findOneAndUpdate(
    { leetcodeUsername: cleanUsername },
    { $set: { aiDeepDiveRemediation: remediationData } },
    { returnDocument: "after" }
  );

  return {
    source: "gemini",
    ...remediationData
  };
}

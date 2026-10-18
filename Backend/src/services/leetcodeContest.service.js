import mongoose from "mongoose";
import Contest from "../models/contest.model.js";

const LEETCODE_GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";

// Standard question difficulties by index in weekly/biweekly contests
const DEFAULT_DIFFICULTIES = ["Easy", "Medium", "Medium", "Hard"];

// Mapping LeetCode submission statusDisplay strings to schema enum values
function normalizeStatusDisplay(statusDisplay) {
  if (!statusDisplay) return "Not Attempted";
  const normalized = statusDisplay.trim();
  if (normalized === "Accepted") return "Accepted";
  if (normalized.includes("Wrong Answer")) return "Wrong Answer";
  if (normalized.includes("Time Limit")) return "Time Limit Exceeded";
  if (normalized.includes("Memory Limit")) return "Memory Limit Exceeded";
  if (normalized.includes("Runtime Error")) return "Runtime Error";
  if (normalized.includes("Compile Error")) return "Compile Error";
  return "Wrong Answer";
}

/**
 * Executes a GraphQL query against LeetCode's public endpoint.
 */
async function executeLeetCodeGraphQL(query, variables = {}) {
  const response = await fetch(LEETCODE_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Referer": "https://leetcode.com",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    },
    body: JSON.stringify({ query, variables })
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`LeetCode GraphQL request failed (${response.status}): ${errorText.slice(0, 150)}`);
  }

  return response.json();
}

function getStatusFromStatusCode(status) {
  switch (Number(status)) {
    case 10: return "Accepted";
    case 11: return "Wrong Answer";
    case 14: return "Time Limit Exceeded";
    case 15: return "Runtime Error";
    case 16: return "Memory Limit Exceeded";
    case 20: return "Compile Error";
    default: return "Wrong Answer";
  }
}

/**
 * Core GraphQL queries
 */
const CONTEST_DATA_QUERY = `
query getContestData($username: String!) {
  userContestRanking(username: $username) {
    attendedContestsCount
    rating
    globalRanking
    totalParticipants
    topPercentage
    badge {
      name
    }
  }
  userContestRankingHistory(username: $username) {
    attended
    trendDirection
    problemsSolved
    totalProblems
    finishTimeInSeconds
    rating
    ranking
    contest {
      title
      startTime
      titleSlug
    }
  }
}
`;

const CONTEST_QUESTIONS_QUERY = `
query contestQuestionList($contestSlug: String!) {
  contestQuestionList(contestSlug: $contestSlug) {
    title
    titleSlug
    questionId
  }
}
`;

const CONTEST_REPLAY_EVENTS_QUERY = `
query userContestReplayEvents($username: String!, $contestSlug: String!, $questionSlug: String!) {
  userContestReplayEvents(username: $username, contestSlug: $contestSlug, questionSlug: $questionSlug) {
    id
    eventType
    eventData
    timestamp
  }
}
`;

const RECENT_SUBMISSIONS_QUERY = `
query getRecentSubmissions($username: String!, $limit: Int!) {
  recentSubmissionList(username: $username, limit: $limit) {
    title
    titleSlug
    timestamp
    statusDisplay
    lang
  }
}
`;

/**
 * Fetches and normalizes live contest statistics and deep telemetry from LeetCode.
 * 
 * @param {string} username - LeetCode username
 * @returns {Promise<Object>} Normalized contest payload ready for DB persistence
 */
export async function fetchLeetCodeContestData(username) {
  if (!username || typeof username !== "string") {
    throw new Error("Valid LeetCode username is required");
  }

  const cleanUsername = username.trim();

  // Execute queries in parallel
  const [contestRes, submissionRes] = await Promise.allSettled([
    executeLeetCodeGraphQL(CONTEST_DATA_QUERY, { username: cleanUsername }),
    executeLeetCodeGraphQL(RECENT_SUBMISSIONS_QUERY, { username: cleanUsername, limit: 100 })
  ]);

  const contestPayload = contestRes.status === "fulfilled" ? contestRes.value?.data : null;
  const submissionsPayload = submissionRes.status === "fulfilled" ? submissionRes.value?.data : null;

  const rankingData = contestPayload?.userContestRanking || null;
  const rawHistory = contestPayload?.userContestRankingHistory || [];
  const recentSubmissions = submissionsPayload?.recentSubmissionList || [];

  // 1. Filter only attended contests (CRITICAL: LeetCode returns all past contests with attended: false)
  const attendedEntries = rawHistory
    .filter((entry) => Boolean(entry?.attended))
    .sort((a, b) => (Number(a?.contest?.startTime) || 0) - (Number(b?.contest?.startTime) || 0));

  // 2. Build chronological contest history with accurate deltas
  const contestHistory = [];
  let runningPeak = 1500;
  let runningLowest = attendedEntries.length > 0 ? Infinity : 1500;

  for (let i = 0; i < attendedEntries.length; i++) {
    const entry = attendedEntries[i];
    const prevRating = i === 0 ? 1500 : attendedEntries[i - 1].rating;
    const currentRating = Math.round(Number(entry.rating) || 1500);
    const delta = Math.round(currentRating - prevRating);

    runningPeak = Math.max(runningPeak, currentRating);
    runningLowest = Math.min(runningLowest, currentRating);

    const calculatedTrend = delta > 0 ? "UP" : delta < 0 ? "DOWN" : "NONE";
    const trendDirection = entry.trendDirection || calculatedTrend;

    contestHistory.push({
      contestTitle: entry.contest?.title || `Contest #${i + 1}`,
      startTime: Number(entry.contest?.startTime) || 0,
      rating: currentRating,
      ranking: Number(entry.ranking) || 0,
      problemsSolved: Number(entry.problemsSolved) || 0,
      totalProblems: Number(entry.totalProblems) || 4,
      finishTimeInSeconds: Number(entry.finishTimeInSeconds) || 0,
      trendDirection
    });
  }

  if (runningLowest === Infinity) runningLowest = 1500;

  // 3. Build Executive Summary
  const currentRating = rankingData?.rating
    ? Math.round(rankingData.rating)
    : (contestHistory.length > 0 ? contestHistory[contestHistory.length - 1].rating : 1500);

  const peakRatingValue = Math.max(runningPeak, currentRating);

  const summary = {
    attendedContestsCount: Number(rankingData?.attendedContestsCount ?? contestHistory.length),
    rating: currentRating,
    PeakRating: peakRatingValue,
    peakRating: peakRatingValue,
    lowestRating: runningLowest,
    globalRanking: Number(rankingData?.globalRanking || 0),
    totalParticipants: Number(rankingData?.totalParticipants || 0),
    topPercentage: rankingData?.topPercentage ? Number(rankingData.topPercentage.toFixed(2)) : 0,
    badge: rankingData?.badge?.name || null
  };

  // 4. Build Deep Telemetry for the Last 5 Attended Contests
  const recentFiveAttended = attendedEntries.slice(-5);
  const recentFiveContestsDeepDive = [];

  for (const entry of recentFiveAttended) {
    const contestTitle = entry.contest?.title || "Contest";
    const contestSlug = entry.contest?.titleSlug || contestTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const startTime = Number(entry.contest?.startTime) || 0;
    const ranking = Number(entry.ranking) || 0;
    const ratingAfter = Math.round(Number(entry.rating) || 1500);
    const problemsSolved = Number(entry.problemsSolved) || 0;
    const totalProblems = Number(entry.totalProblems) || 4;
    const finishTimeInSeconds = Number(entry.finishTimeInSeconds) || 0;

    // Delta relative to prior attended contest in full history
    const entryIndex = attendedEntries.indexOf(entry);
    const prevRating = entryIndex > 0 ? attendedEntries[entryIndex - 1].rating : 1500;
    const ratingDelta = Math.round(ratingAfter - prevRating);

    // Fetch official contest question metadata
    let contestQuestions = [];
    try {
      const qRes = await executeLeetCodeGraphQL(CONTEST_QUESTIONS_QUERY, { contestSlug });
      contestQuestions = qRes.data?.contestQuestionList || [];
    } catch (e) {
      console.warn(`[ContestSync] Could not fetch question list for ${contestSlug}:`, e.message);
    }

    const questions = [];

    for (let qIdx = 0; qIdx < totalProblems; qIdx++) {
      const qMeta = contestQuestions[qIdx] || {
        title: `${contestTitle} - Q${qIdx + 1}`,
        titleSlug: `${contestSlug}-q${qIdx + 1}`
      };

      let events = [];
      try {
        const evRes = await executeLeetCodeGraphQL(CONTEST_REPLAY_EVENTS_QUERY, {
          username: cleanUsername,
          contestSlug,
          questionSlug: qMeta.titleSlug
        });
        events = evRes.data?.userContestReplayEvents || [];
      } catch (e) {
        // Fallback gracefully
      }

      const submits = events.filter((e) => e.eventType === "5");
      const runs = events.filter((e) => e.eventType === "4");

      let lang = null;
      for (const e of events) {
        if (e.eventData && e.eventData.includes('"lang":')) {
          try {
            const parsed = JSON.parse(e.eventData);
            if (parsed.lang) {
              lang = parsed.lang;
              break;
            }
          } catch {}
        }
      }

      // Check for Accepted submission
      let acSubmit = null;
      for (const s of submits) {
        try {
          const d = JSON.parse(s.eventData || "{}");
          if (d?.result?.status === 10) {
            acSubmit = s;
            break;
          }
        } catch {}
      }

      if (acSubmit) {
        // Calculate fails before this Accepted submission
        const failsBeforeAc = [];
        for (const s of submits) {
          if (new Date(s.timestamp) < new Date(acSubmit.timestamp)) {
            try {
              const d = JSON.parse(s.eventData || "{}");
              if (d?.result?.status !== 10) {
                failsBeforeAc.push(d?.result?.status);
              }
            } catch {}
          }
        }

        const failCount = failsBeforeAc.length;
        const lastFailStatus = failCount > 0 ? failsBeforeAc[failsBeforeAc.length - 1] : null;

        questions.push({
          title: qMeta.title,
          titleSlug: qMeta.titleSlug,
          difficulty: DEFAULT_DIFFICULTIES[qIdx] || "Medium",
          status: "Accepted",
          failCount,
          language: lang || "cpp",
          submissionCode: null,
          errorCause: lastFailStatus ? getStatusFromStatusCode(lastFailStatus) : null,
          submittedAt: Math.round(new Date(acSubmit.timestamp).getTime() / 1000)
        });
      } else if (submits.length > 0) {
        // Unaccepted submissions -> Hard Reject / Brick Wall
        const lastSubmit = submits[submits.length - 1];
        let lastStatus = 11;
        try {
          const d = JSON.parse(lastSubmit.eventData || "{}");
          lastStatus = d?.result?.status || 11;
        } catch {}

        const statusStr = getStatusFromStatusCode(lastStatus);

        questions.push({
          title: qMeta.title,
          titleSlug: qMeta.titleSlug,
          difficulty: DEFAULT_DIFFICULTIES[qIdx] || "Medium",
          status: statusStr,
          failCount: submits.length,
          language: lang || "cpp",
          submissionCode: null,
          errorCause: statusStr,
          submittedAt: Math.round(new Date(lastSubmit.timestamp).getTime() / 1000)
        });
      } else {
        // Fallback: If LeetCode official record says it was solved, but replay events were empty (e.g. legacy/alternate UI)
        const isSolvedByOfficial = qIdx < problemsSolved;
        if (isSolvedByOfficial) {
          questions.push({
            title: qMeta.title,
            titleSlug: qMeta.titleSlug,
            difficulty: DEFAULT_DIFFICULTIES[qIdx] || "Medium",
            status: "Accepted",
            failCount: 0,
            language: lang || "cpp",
            submissionCode: null,
            errorCause: null,
            submittedAt: null
          });
        } else {
          // Untouched / Starved / Clock runout - user did not submit
          questions.push({
            title: qMeta.title,
            titleSlug: qMeta.titleSlug,
            difficulty: DEFAULT_DIFFICULTIES[qIdx] || "Medium",
            status: "Not Attempted",
            failCount: 0,
            language: null,
            submissionCode: null,
            errorCause: null,
            submittedAt: null
          });
        }
      }
    }

    // Mathematical reconciliation with finishTimeInSeconds:
    let knownAcceptedFails = questions.reduce(
      (acc, q) => acc + (q.status === "Accepted" ? q.failCount : 0),
      0
    );

    // If finishTimeInSeconds > 5400 (standard 90 min contest duration), true penalty minutes exist
    if (finishTimeInSeconds > 5400) {
      const minPenaltyNeeded = Math.ceil((finishTimeInSeconds - 5400) / 300);
      if (knownAcceptedFails < minPenaltyNeeded) {
        const missingFails = minPenaltyNeeded - knownAcceptedFails;
        // Allocate missing fails to the latest solved question that has 0 fails recorded
        const candidateQ = [...questions].reverse().find((q) => q.status === "Accepted");
        if (candidateQ) {
          candidateQ.failCount += missingFails;
          candidateQ.errorCause = candidateQ.errorCause || "Wrong Answer";
          knownAcceptedFails += missingFails;
        }
      }
    }

    // Synthesize timestamps for any Accepted question lacking submittedAt
    const rawCodingTime = Math.max(0, finishTimeInSeconds - (knownAcceptedFails * 300));
    questions.forEach((q, idx) => {
      if (q.status === "Accepted" && !q.submittedAt) {
        const solvedCount = questions.filter((x) => x.status === "Accepted").length;
        const fraction = (idx + 1) / Math.max(1, solvedCount);
        q.submittedAt = startTime + Math.round(rawCodingTime * fraction);
      }
    });

    recentFiveContestsDeepDive.push({
      contestTitle,
      startTime,
      ranking,
      ratingAfter,
      ratingDelta,
      problemsSolved,
      totalProblems,
      finishTimeInSeconds,
      questions
    });
  }

  return {
    leetcodeUsername: cleanUsername.toLowerCase(),
    summary,
    contestHistory,
    recentFiveContestsDeepDive,
    lastSyncedAt: new Date()
  };
}

/**
 * Synchronizes and persists LeetCode contest telemetry in MongoDB.
 *
 * @param {string} username - LeetCode username
 * @param {string|mongoose.Types.ObjectId|null} userId - Linked LeetBuddy user id
 * @returns {Promise<Object>} Persisted Contest document
 */
export async function syncContestData(username, userId = null) {
  if (!username) {
    throw new Error("LeetCode username is required to sync contest data");
  }

  const cleanUsername = username.toLowerCase().trim();

  try {
    const normalizedData = await fetchLeetCodeContestData(cleanUsername);

    // If MongoDB is connected, persist to DB
    if (mongoose.connection.readyState === 1) {
      const validUserId = userId && mongoose.Types.ObjectId.isValid(userId) ? userId : null;
      const updateQuery = { leetcodeUsername: cleanUsername };
      const updateDoc = {
        $set: {
          summary: normalizedData.summary,
          contestHistory: normalizedData.contestHistory,
          recentFiveContestsDeepDive: normalizedData.recentFiveContestsDeepDive,
          lastSyncedAt: new Date(),
          ...(validUserId ? { userId: validUserId } : {})
        }
      };

      const savedContest = await Contest.findOneAndUpdate(updateQuery, updateDoc, {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true
      });

      return savedContest;
    }

    return normalizedData;
  } catch (error) {
    console.error(`[ContestSync] Failed to sync contest data for ${username}:`, error.message);
    // Return a minimal fallback object without throwing unhandled exception to prevent crashing parent pipelines
    return {
      leetcodeUsername: cleanUsername,
      summary: {
        attendedContestsCount: 0,
        rating: 1500,
        PeakRating: 1500,
        peakRating: 1500,
        lowestRating: 1500,
        globalRanking: 0,
        totalParticipants: 0,
        topPercentage: 0,
        badge: null
      },
      contestHistory: [],
      recentFiveContestsDeepDive: [],
      lastSyncedAt: new Date(),
      error: error.message
    };
  }
}

/**
 * Retrieves cached contest telemetry from MongoDB or triggers a live sync if missing.
 *
 * @param {string} username - LeetCode username
 * @param {string|null} userId - Linked user id
 * @returns {Promise<Object>} Contest document
 */
export async function getContestData(username, userId = null) {
  if (!username) return null;

  const cleanUsername = username.toLowerCase().trim();

  if (mongoose.connection.readyState === 1) {
    const validUserId = userId && mongoose.Types.ObjectId.isValid(userId) ? userId : null;
    const existing = await Contest.findOne({
      $or: [
        { leetcodeUsername: cleanUsername },
        ...(validUserId ? [{ userId: validUserId }] : [])
      ]
    });

    if (existing) {
      // Check if existing document has real telemetry (failCount, errors, or timestamps)
      const hasRealDeepDive = existing.recentFiveContestsDeepDive?.some(
        (c) => c.questions?.some((q) => q.failCount > 0 || (q.status !== "Accepted" && q.status !== "Not Attempted") || q.submittedAt)
      );
      if (hasRealDeepDive) {
        return existing;
      }
    }
  }

  // Not yet cached or outdated blank deep dive telemetry: sync directly
  return syncContestData(cleanUsername, userId);
}

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
    }
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
    const startTime = Number(entry.contest?.startTime) || 0;
    const ranking = Number(entry.ranking) || 0;
    const ratingAfter = Math.round(Number(entry.rating) || 1500);
    const problemsSolved = Number(entry.problemsSolved) || 0;
    const totalProblems = Number(entry.totalProblems) || 4;

    // Delta relative to prior attended contest in full history
    const entryIndex = attendedEntries.indexOf(entry);
    const prevRating = entryIndex > 0 ? attendedEntries[entryIndex - 1].rating : 1500;
    const ratingDelta = Math.round(ratingAfter - prevRating);

    // Contest time window is standard 90 minutes (5400 seconds)
    const windowStart = startTime;
    const windowEnd = startTime + 5400;

    // Correlate recent submissions with this contest window
    const windowSubs = recentSubmissions.filter((s) => {
      const ts = Number(s?.timestamp) || 0;
      return ts >= windowStart && ts <= windowEnd;
    });

    // Group correlated submissions by question titleSlug
    const problemMap = new Map();
    for (const sub of windowSubs) {
      const key = sub.titleSlug || sub.title || "question";
      if (!problemMap.has(key)) {
        problemMap.set(key, []);
      }
      problemMap.get(key).push(sub);
    }

    const questions = [];

    // First: populate from matched real submissions
    for (const [slug, subs] of problemMap.entries()) {
      subs.sort((a, b) => Number(a.timestamp) - Number(b.timestamp));
      const hasAccepted = subs.some((s) => s.statusDisplay === "Accepted");
      const failSubs = subs.filter((s) => s.statusDisplay !== "Accepted");
      const latestSub = subs[subs.length - 1];

      const status = hasAccepted ? "Accepted" : normalizeStatusDisplay(latestSub.statusDisplay);
      const errorCause = hasAccepted ? null : (latestSub.statusDisplay || "Error");

      questions.push({
        title: latestSub.title || slug,
        titleSlug: slug,
        difficulty: DEFAULT_DIFFICULTIES[questions.length] || "Medium",
        status,
        failCount: failSubs.length,
        language: latestSub.lang || null,
        submissionCode: null,
        errorCause,
        submittedAt: Number(latestSub.timestamp) || null
      });
    }

    // Second: if older contest or submissions exceeded 100-limit, pad cleanly to totalProblems (4)
    while (questions.length < totalProblems) {
      const qIdx = questions.length;
      const isSolved = qIdx < problemsSolved;
      questions.push({
        title: `${contestTitle} - Q${qIdx + 1}`,
        titleSlug: `${contestTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-q${qIdx + 1}`,
        difficulty: DEFAULT_DIFFICULTIES[qIdx] || "Medium",
        status: isSolved ? "Accepted" : "Not Attempted",
        failCount: 0,
        language: null,
        submissionCode: null,
        errorCause: null,
        submittedAt: null
      });
    }

    recentFiveContestsDeepDive.push({
      contestTitle,
      startTime,
      ranking,
      ratingAfter,
      ratingDelta,
      problemsSolved,
      totalProblems,
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
      return existing;
    }
  }

  // Not yet cached: sync directly
  return syncContestData(cleanUsername, userId);
}

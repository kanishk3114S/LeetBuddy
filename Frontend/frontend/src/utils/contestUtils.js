/**
 * contestUtils.js — Pure Normalization & Telemetry Utility Module for LeetBuddy Contest Analysis
 * 
 * Ingests raw LeetCode contest payloads and outputs deterministic, pre-computed
 * data structures for the telemetry ribbons, performance matrices, and rating mountain chart.
 */

/**
 * Format finish time from seconds into human-readable duration (e.g. "14m 32s" or "1h 12m")
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatFinishTime(totalSeconds) {
  const sec = Number(totalSeconds) || 0;
  if (sec <= 0) return "N/A";

  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const remainingSec = sec % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m ${remainingSec}s`;
}

/**
 * Normalizes and extracts executive telemetry metrics for the top ribbon.
 * Handles nested backend response formats: { contest: { summary, ... } } or { summary, ... }.
 * 
 * @param {Object} rawContestDoc
 * @returns {Object} Executive overview metrics
 */
export function formatContestOverview(rawContestDoc) {
  if (!rawContestDoc) {
    return {
      currentRating: 1500,
      peakRating: 1500,
      lowestRating: 1500,
      attendedCount: 0,
      globalRanking: 0,
      globalRankingFormatted: "—",
      topPercentage: 0,
      topPercentageDisplay: "—",
      badge: "Unbadged",
      latestRatingDelta: 0,
      ratingDeltaDisplay: "0",
      ratingDeltaDirection: "NONE",
      lastSyncedAt: null
    };
  }

  const doc = rawContestDoc?.contest || rawContestDoc;
  const summary = doc?.summary || {};
  const history = Array.isArray(doc?.contestHistory) ? doc.contestHistory : [];

  const currentRating = Math.round(Number(summary.rating ?? (history.length > 0 ? history[history.length - 1].rating : 1500)));
  const peakRating = Math.round(Number(summary.PeakRating ?? summary.peakRating ?? currentRating));
  const lowestRating = Math.round(Number(summary.lowestRating ?? currentRating));
  const attendedCount = Number(summary.attendedContestsCount ?? history.length);
  const globalRanking = Number(summary.globalRanking || 0);
  const globalRankingFormatted = globalRanking > 0 ? `#${globalRanking.toLocaleString()}` : "—";

  const topPercent = typeof summary.topPercentage === "number" ? summary.topPercentage : 0;
  const topPercentageDisplay = topPercent > 0 ? `Top ${topPercent.toFixed(1)}%` : "—";

  const rawBadge = summary.badge || null;
  const badge = rawBadge && typeof rawBadge === "string" && rawBadge.trim().length > 0 ? rawBadge.trim() : "Unbadged";

  // Compute latest rating delta from the last two attended contests
  let latestRatingDelta = 0;
  let ratingDeltaDirection = "NONE";

  if (history.length >= 2) {
    const last = history[history.length - 1];
    const prev = history[history.length - 2];
    latestRatingDelta = Math.round((Number(last.rating) || 0) - (Number(prev.rating) || 0));
  } else if (history.length === 1) {
    latestRatingDelta = Math.round((Number(history[0].rating) || 0) - 1500);
  }

  if (latestRatingDelta > 0) {
    ratingDeltaDirection = "UP";
  } else if (latestRatingDelta < 0) {
    ratingDeltaDirection = "DOWN";
  }

  const ratingDeltaDisplay = latestRatingDelta > 0
    ? `+${latestRatingDelta}`
    : latestRatingDelta < 0
    ? `${latestRatingDelta}`
    : "0";

  return {
    currentRating,
    peakRating,
    lowestRating,
    attendedCount,
    globalRanking,
    globalRankingFormatted,
    topPercentage: topPercent,
    topPercentageDisplay,
    badge,
    latestRatingDelta,
    ratingDeltaDisplay,
    ratingDeltaDirection,
    lastSyncedAt: doc?.lastSyncedAt ? new Date(doc.lastSyncedAt) : null
  };
}

/**
 * Computes the 4-tier Rank Bracket Distribution Matrix across all attended contests.
 * 
 * Strict bracket criteria:
 * - Elite: ranking > 0 && ranking < 1000
 * - Contender: ranking >= 1000 && ranking <= 5000
 * - Competitor: ranking > 5000 && ranking <= 10000
 * - Participant: ranking > 10000
 * 
 * @param {Array} contestHistory
 * @returns {Object} Bracket distribution telemetry
 */
export function computeRankDistributionMatrix(contestHistory = []) {
  const history = Array.isArray(contestHistory) ? contestHistory : [];
  const total = history.length;

  let eliteCount = 0;
  let contenderCount = 0;
  let competitorCount = 0;
  let participantCount = 0;

  for (const item of history) {
    const rank = Number(item?.ranking) || 0;
    if (rank > 0 && rank < 1000) {
      eliteCount++;
    } else if (rank >= 1000 && rank <= 5000) {
      contenderCount++;
    } else if (rank > 5000 && rank <= 10000) {
      competitorCount++;
    } else if (rank > 10000) {
      participantCount++;
    }
  }

  const calcPercent = (count) => (total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0);

  const brackets = [
    {
      id: "elite",
      tier: "Tier 1",
      label: "Elite",
      range: "< 1,000",
      description: "Sub-1k Leaderboard",
      count: eliteCount,
      percentage: calcPercent(eliteCount),
      color: "#10b981", // emerald
      barClass: "bg-emerald-500",
      badgeClass: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-950/40 dark:border-emerald-800"
    },
    {
      id: "contender",
      tier: "Tier 2",
      label: "Contender",
      range: "1,000 – 5,000",
      description: "Top Tier Cohort",
      count: contenderCount,
      percentage: calcPercent(contenderCount),
      color: "#3b82f6", // blue
      barClass: "bg-blue-500",
      badgeClass: "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950/40 dark:border-blue-800"
    },
    {
      id: "competitor",
      tier: "Tier 3",
      label: "Competitor",
      range: "5,001 – 10,000",
      description: "Solid Placement",
      count: competitorCount,
      percentage: calcPercent(competitorCount),
      color: "#f59e0b", // amber
      barClass: "bg-amber-500",
      badgeClass: "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-950/40 dark:border-amber-800"
    },
    {
      id: "participant",
      tier: "Tier 4",
      label: "Participant",
      range: "> 10,000",
      description: "Field Placement",
      count: participantCount,
      percentage: calcPercent(participantCount),
      color: "#8b5cf6", // violet
      barClass: "bg-violet-500",
      badgeClass: "text-violet-700 bg-violet-50 border-violet-200 dark:text-violet-400 dark:bg-violet-950/40 dark:border-violet-800"
    }
  ];

  return {
    totalContests: total,
    brackets
  };
}

/**
 * Computes problem-solving lethality & solve ratio matrix (All Kills to 1/4 + 0/4 secondary metric).
 * 
 * Categories:
 * - 4/4 (All Kills / Full Clear): problemsSolved >= 4
 * - 3/4 (Strong Finish): problemsSolved === 3
 * - 2/4 (Standard Solve): problemsSolved === 2
 * - 1/4 (Single Solve): problemsSolved === 1
 * - 0/4 (Zero Solves): problemsSolved === 0
 * 
 * @param {Array} contestHistory
 * @returns {Object} Lethality & solve ratio matrix
 */
export function computeSolveEfficiencyMatrix(contestHistory = []) {
  const history = Array.isArray(contestHistory) ? contestHistory : [];
  const total = history.length;

  let allKillsCount = 0;
  let threeCount = 0;
  let twoCount = 0;
  let oneCount = 0;
  let zeroCount = 0;

  for (const item of history) {
    const solved = Number(item?.problemsSolved) || 0;
    if (solved >= 4) {
      allKillsCount++;
    } else if (solved === 3) {
      threeCount++;
    } else if (solved === 2) {
      twoCount++;
    } else if (solved === 1) {
      oneCount++;
    } else {
      zeroCount++;
    }
  }

  const calcPercent = (count) => (total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0);

  const tiers = [
    {
      id: "4/4",
      label: "4/4",
      title: "All Kills",
      solvedCount: 4,
      totalProblems: 4,
      count: allKillsCount,
      percentage: calcPercent(allKillsCount),
      isAllKills: true,
      color: "#10b981", // emerald
      accentBorder: "border-emerald-500/40 dark:border-emerald-400/40",
      pillClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
    },
    {
      id: "3/4",
      label: "3/4",
      title: "Strong Finish",
      solvedCount: 3,
      totalProblems: 4,
      count: threeCount,
      percentage: calcPercent(threeCount),
      isAllKills: false,
      color: "#3b82f6", // blue
      accentBorder: "border-neutral-200 dark:border-neutral-800",
      pillClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
    },
    {
      id: "2/4",
      label: "2/4",
      title: "Standard Solve",
      solvedCount: 2,
      totalProblems: 4,
      count: twoCount,
      percentage: calcPercent(twoCount),
      isAllKills: false,
      color: "#f59e0b", // amber
      accentBorder: "border-neutral-200 dark:border-neutral-800",
      pillClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
    },
    {
      id: "1/4",
      label: "1/4",
      title: "Single Solve",
      solvedCount: 1,
      totalProblems: 4,
      count: oneCount,
      percentage: calcPercent(oneCount),
      isAllKills: false,
      color: "#94a3b8", // slate
      accentBorder: "border-neutral-200 dark:border-neutral-800",
      pillClass: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20"
    }
  ];

  return {
    totalContests: total,
    tiers,
    zeroSolve: {
      id: "0/4",
      label: "0/4",
      title: "Zero Solves",
      solvedCount: 0,
      totalProblems: 4,
      count: zeroCount,
      percentage: calcPercent(zeroCount)
    }
  };
}

/**
 * Transforms chronological contest history into Recharts-ready time series data.
 * 
 * @param {Array} contestHistory
 * @returns {Array<Object>} Chart data points
 */
export function buildRatingMountainData(contestHistory = []) {
  if (!Array.isArray(contestHistory) || contestHistory.length === 0) {
    return [];
  }

  // Ensure chronological order
  const sorted = [...contestHistory].sort((a, b) => (Number(a.startTime) || 0) - (Number(b.startTime) || 0));

  return sorted.map((entry, index) => {
    const rawTime = Number(entry.startTime) || 0;
    const dateObj = rawTime > 0 ? new Date(rawTime * 1000) : new Date();

    const shortDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const fullDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const rating = Math.round(Number(entry.rating) || 1500);
    const prevRating = index > 0 ? Math.round(Number(sorted[index - 1].rating) || 1500) : 1500;
    const ratingDelta = rating - prevRating;

    const ranking = Number(entry.ranking) || 0;
    const problemsSolved = Number(entry.problemsSolved) || 0;
    const totalProblems = Number(entry.totalProblems) || 4;
    const finishTimeInSeconds = Number(entry.finishTimeInSeconds) || 0;

    return {
      index: index + 1,
      contestTitle: entry.contestTitle || `Contest #${index + 1}`,
      shortDate,
      fullDate,
      rating,
      ratingDelta,
      ratingDeltaFormatted: ratingDelta > 0 ? `+${ratingDelta}` : `${ratingDelta}`,
      ranking,
      rankingFormatted: ranking > 0 ? `#${ranking.toLocaleString()}` : "—",
      problemsSolved,
      totalProblems,
      solveDisplay: `${problemsSolved}/${totalProblems}`,
      finishTimeFormatted: formatFinishTime(finishTimeInSeconds),
      trendDirection: entry.trendDirection || (ratingDelta > 0 ? "UP" : ratingDelta < 0 ? "DOWN" : "NONE")
    };
  });
}

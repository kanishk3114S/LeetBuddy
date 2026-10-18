/**
 * LeetBuddy Contest Deep Dive Telemetry & Diagnostics Utilities
 *
 * Provides pure mathematical transformations for:
 * 1. Panic-Submit Tax (Pure Solve Time vs Penalty Bleed)
 * 2. 90-Minute Split-Time Autopsy & 5x4 Slow Solve Telemetry
 */


/**
 * Standard Split Benchmarks (in seconds) for 90-minute contests
 */
export const SPLIT_BENCHMARKS = {
  Q1: 8 * 60,   // 8 mins (Easy)
  Q2: 18 * 60,  // 18 mins (Medium)
  Q3: 30 * 60,  // 30 mins (Medium/Hard)
  Q4: 40 * 60   // 40 mins (Hard)
};

/**
 * Formats seconds into human-readable duration: "38m 20s" or "1h 12m"
 */
export function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '0m';
  const s = Math.round(seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (mins > 0 && secs > 0) {
    return `${mins}m ${secs}s`;
  }
  if (mins > 0) {
    return `${mins}m`;
  }
  return `${secs}s`;
}

/**
 * Formats epoch timestamp (seconds) into date string: "Oct 12, 2025"
 */
export function formatContestDate(epochSeconds) {
  if (!epochSeconds) return 'Recent';
  const d = new Date(epochSeconds * 1000);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Computes Section 1: The Panic-Submit Tax
 * Compares pure coding time vs penalty minutes across the last 5 contests.
 */
export function computePanicTaxTelemetry(recentFiveContests = [], contestHistory = []) {
  if (!recentFiveContests || !recentFiveContests.length) {
    return {
      contests: [],
      totals: {
        totalPenaltyMinutes: 0,
        totalAcceptedFails: 0,
        totalFails: 0,
        totalEstimatedRankLoss: 0,
        avgPenaltyPerContest: 0,
        cleanSolveRatio: 0
      },
      verdict: null
    };
  }

  let totalPenaltySec = 0;
  let totalAcceptedFails = 0;
  let totalFails = 0;
  let totalEstimatedRankLoss = 0;
  let maxPenaltyContest = null;

  const transformedContests = recentFiveContests.map((contest, idx) => {
    // Correlate finishTimeInSeconds with contestHistory if missing on deep dive object
    const matchedHistory = contestHistory.find(
      (h) => h.startTime === contest.startTime || h.contestTitle === contest.contestTitle
    );
    let finishTimeSeconds = contest.finishTimeInSeconds || matchedHistory?.finishTimeInSeconds || 0;

    const questions = contest.questions || [];
    let acceptedFails = 0;
    let contestFails = 0;

    questions.forEach((q) => {
      const fails = Number(q.failCount) || 0;
      contestFails += fails;
      if (q.status === 'Accepted') {
        acceptedFails += fails;
      }
    });

    // In LeetCode: only wrong submissions on ACCEPTED problems add +5 min penalty to the clock
    const penaltySeconds = acceptedFails * 300; // 5 mins = 300s
    const penaltyMinutes = acceptedFails * 5;

    // Fallback if finishTimeSeconds was unrecorded
    if (finishTimeSeconds === 0 && questions.length > 0) {
      const acceptedWithTime = questions.filter(
        (q) => q.status === 'Accepted' && q.submittedAt && q.submittedAt > contest.startTime
      );
      if (acceptedWithTime.length > 0) {
        const lastAc = Math.max(...acceptedWithTime.map((q) => q.submittedAt));
        finishTimeSeconds = Math.max(0, lastAc - contest.startTime) + penaltySeconds;
      }
    }

    const pureSolveTimeSeconds = Math.max(0, finishTimeSeconds - penaltySeconds);

    // Estimate rank position loss from penalty minutes
    const rank = contest.ranking || 0;
    const positionSensitivity = rank > 8000 ? 140 : rank > 3000 ? 95 : rank > 1000 ? 60 : 35;
    const estimatedRankLoss = Math.round(penaltyMinutes * positionSensitivity);

    totalPenaltySec += penaltySeconds;
    totalAcceptedFails += acceptedFails;
    totalFails += contestFails;
    totalEstimatedRankLoss += estimatedRankLoss;

    const penaltyPercentage = finishTimeSeconds > 0
      ? Math.min(100, Math.round((penaltySeconds / finishTimeSeconds) * 100))
      : 0;
    const purePercentage = Math.max(0, 100 - penaltyPercentage);

    const contestTaxObj = {
      id: idx,
      contestTitle: contest.contestTitle || `Contest #${idx + 1}`,
      startTime: contest.startTime,
      dateFormatted: formatContestDate(contest.startTime),
      ranking: rank,
      rankingFormatted: rank > 0 ? `#${rank.toLocaleString()}` : 'Unranked',
      ratingAfter: contest.ratingAfter,
      ratingDelta: contest.ratingDelta,
      problemsSolved: contest.problemsSolved,
      totalProblems: contest.totalProblems || 4,
      finishTimeSeconds,
      finishTimeFormatted: formatDuration(finishTimeSeconds),
      pureSolveTimeSeconds,
      pureSolveTimeFormatted: formatDuration(pureSolveTimeSeconds),
      penaltySeconds,
      penaltyMinutes,
      acceptedFails,
      contestFails,
      estimatedRankLoss,
      purePercentage,
      penaltyPercentage
    };

    if (!maxPenaltyContest || penaltyMinutes > maxPenaltyContest.penaltyMinutes) {
      maxPenaltyContest = contestTaxObj;
    }

    return contestTaxObj;
  });

  const totalPenaltyMinutes = Math.round(totalPenaltySec / 60);
  const avgPenaltyPerContest = Number((totalPenaltyMinutes / transformedContests.length).toFixed(1));

  // Compute Verdict Message
  let verdict = null;
  if (totalAcceptedFails > 0 && maxPenaltyContest) {
    verdict = {
      headline: `Avoidable Penalty Bleed: +${totalPenaltyMinutes}m Tax`,
      summary: `Across your last ${transformedContests.length} contests, you accumulated +${totalPenaltyMinutes}m in penalty tax across ${totalAcceptedFails} wrong submissions on solved problems—costing you an estimated ~${totalEstimatedRankLoss.toLocaleString()} rank positions.`,
      highlightContest: `In ${maxPenaltyContest.contestTitle}, you spent ${maxPenaltyContest.pureSolveTimeFormatted} coding and added +${maxPenaltyContest.penaltyMinutes}m in penalty tax (${maxPenaltyContest.acceptedFails} fails)—bleeding an estimated ~${maxPenaltyContest.estimatedRankLoss.toLocaleString()} positions.`
    };
  } else {
    verdict = {
      headline: `Flawless First-Attempt Execution (0m Penalty Tax)`,
      summary: `Zero penalty minutes incurred across all solved problems in your evaluated contests. Every point gained was pure solve speed.`,
      highlightContest: null
    };
  }

  return {
    contests: transformedContests,
    totals: {
      totalPenaltyMinutes,
      totalAcceptedFails,
      totalFails,
      totalEstimatedRankLoss,
      avgPenaltyPerContest
    },
    verdict
  };
}

/**
 * Computes Section 2: The 90-Minute Split-Time Autopsy & 5x4 Matrix
 */
export function computeSplitTimeMatrix(recentFiveContests = []) {
  if (!recentFiveContests || !recentFiveContests.length) {
    return [];
  }

  return recentFiveContests.map((contest, cIdx) => {
    const t0 = contest.startTime || 0;
    const questions = contest.questions || [];
    const totalProblems = contest.totalProblems || 4;

    // Track sequential timestamps for split calculations
    let prevTimestamp = t0;
    let lastAcceptedMinute = 0;

    const cells = Array.from({ length: totalProblems }).map((_, qIdx) => {
      const q = questions[qIdx] || {
        title: `${contest.contestTitle} - Q${qIdx + 1}`,
        titleSlug: `q${qIdx + 1}`,
        difficulty: qIdx === 0 ? 'Easy' : qIdx === 3 ? 'Hard' : 'Medium',
        status: 'Not Attempted',
        failCount: 0
      };

      const qLabel = `Q${qIdx + 1}`;
      const benchmarkSec = SPLIT_BENCHMARKS[qLabel] || 1200;
      const fails = Number(q.failCount) || 0;
      const isAccepted = q.status === 'Accepted';

      let splitSeconds = 0;
      let cumulativeSeconds = 0;

      if (q.submittedAt && q.submittedAt > t0) {
        splitSeconds = Math.max(0, q.submittedAt - prevTimestamp);
        cumulativeSeconds = Math.max(0, q.submittedAt - t0);
        prevTimestamp = q.submittedAt;
        if (isAccepted) {
          lastAcceptedMinute = Math.round(cumulativeSeconds / 60);
        }
      } else if (isAccepted) {
        // Fallback estimate if timestamps were unrecorded
        const estimatedPacing = [6 * 60, 16 * 60, 28 * 60, 40 * 60];
        splitSeconds = estimatedPacing[qIdx] || 600;
        cumulativeSeconds = splitSeconds;
        lastAcceptedMinute = Math.round(splitSeconds / 60);
      }

      // Categorize Engineering State
      let state = 'UNTOUCHED'; // 'CLEAN' | 'SLOW' | 'BRICK_WALL' | 'UNTOUCHED'
      let stateLabel = 'Not Attempted';
      let stateColor = 'slate';

      if (isAccepted) {
        if (fails === 0 && splitSeconds <= benchmarkSec * 1.25) {
          state = 'CLEAN';
          stateLabel = 'Clean Solve';
          stateColor = 'emerald';
        } else {
          state = 'SLOW';
          stateLabel = fails > 0 ? `Slow Solve (+${fails * 5}m)` : 'Slow Solve';
          stateColor = 'amber';
        }
      } else if (fails > 0 || q.status !== 'Not Attempted') {

        state = 'BRICK_WALL';
        stateLabel = q.errorCause || q.status || 'Failed Attempt';
        stateColor = 'rose';
      } else {
        state = 'UNTOUCHED';
        stateLabel = 'Starved / Clock Runout';
        stateColor = 'slate';
      }

      return {
        qIndex: qIdx,
        qLabel,
        title: q.title || `${contest.contestTitle} Q${qIdx + 1}`,
        titleSlug: q.titleSlug || '',
        difficulty: q.difficulty || (qIdx === 0 ? 'Easy' : qIdx === 3 ? 'Hard' : 'Medium'),
        status: q.status || 'Not Attempted',
        fails,
        errorCause: q.errorCause,
        language: q.language || 'C++',
        splitSeconds,
        splitFormatted: splitSeconds > 0 ? formatDuration(splitSeconds) : '--',
        cumulativeSeconds,
        benchmarkSec,
        state,
        stateLabel,
        stateColor,
        upsolveUrl: q.titleSlug ? `https://leetcode.com/problems/${q.titleSlug}` : null
      };
    });

    // Compute Dead Zone (Stall Time)
    // If contest ended with unfinished questions, calculate idle/stall minutes
    const deadZoneMinutes = Math.max(0, 90 - lastAcceptedMinute);
    const hasStall = contest.problemsSolved < totalProblems && lastAcceptedMinute > 0 && lastAcceptedMinute < 90;

    return {
      contestId: cIdx,
      contestTitle: contest.contestTitle,
      startTime: contest.startTime,
      dateFormatted: formatContestDate(contest.startTime),
      ranking: contest.ranking,
      ratingDelta: contest.ratingDelta,
      problemsSolved: contest.problemsSolved,
      totalProblems,
      cells,
      hasStall,
      lastAcceptedMinute,
      deadZoneMinutes
    };
  });
}

/**
 * Computes Section 3: Root-Cause Mistake Categorizer (Why You Choke Under Pressure)
 * Aggregates all failed submissions and implementation drags into 4 Diagnostic Buckets:
 * 1. Complexity Bottleneck (Time Limit Exceeded - TLE)
 * 2. Edge-Case & Greedy Panic (Wrong Answer - WA)
 * 3. Memory / Indexing Sloppiness (Runtime Error / MLE - RTE)
 * 4. Implementation Drag (Slow Splits on AC)
 */
export function computeRootCauseTelemetry(recentFiveContests = []) {
  if (!recentFiveContests || !recentFiveContests.length) {
    return {
      buckets: [],
      totalMistakes: 0,
      primaryChokeSlot: null,
      slotBreakdown: [],
      summaryVerdict: null
    };
  }

  let tleCount = 0;
  let waCount = 0;
  let rteCount = 0;
  let slowAcCount = 0;

  const slotStats = [
    { slot: 'Q1', label: 'Q1 (Easy)', fails: 0, tle: 0, wa: 0, rte: 0, slow: 0, unreached: 0 },
    { slot: 'Q2', label: 'Q2 (Medium)', fails: 0, tle: 0, wa: 0, rte: 0, slow: 0, unreached: 0 },
    { slot: 'Q3', label: 'Q3 (Medium/Hard)', fails: 0, tle: 0, wa: 0, rte: 0, slow: 0, unreached: 0 },
    { slot: 'Q4', label: 'Q4 (Hard)', fails: 0, tle: 0, wa: 0, rte: 0, slow: 0, unreached: 0 }
  ];

  recentFiveContests.forEach((contest) => {
    const t0 = contest.startTime || 0;
    const questions = contest.questions || [];
    let prevTimestamp = t0;

    questions.forEach((q, qIdx) => {
      if (qIdx >= 4) return;
      const fails = Number(q.failCount) || 0;
      const isAccepted = q.status === 'Accepted';
      const qLabel = `Q${qIdx + 1}`;
      const benchmarkSec = SPLIT_BENCHMARKS[qLabel] || 1200;

      let splitSeconds = 0;
      if (q.submittedAt && q.submittedAt > t0) {
        splitSeconds = Math.max(0, q.submittedAt - prevTimestamp);
        prevTimestamp = q.submittedAt;
      }

      // Check for Slow AC
      const isSlow = isAccepted && splitSeconds > benchmarkSec * 1.25;

      // Classify error cause
      const err = (q.errorCause || '').toLowerCase();
      const status = (q.status || '').toLowerCase();

      let isTle = err.includes('time limit') || status.includes('time limit');
      let isRte = err.includes('runtime') || status.includes('runtime') || err.includes('memory') || status.includes('memory');
      let isWa = !isTle && !isRte && (fails > 0 || status.includes('wrong') || err.includes('wrong'));

      if (fails > 0) {
        if (isTle) {
          tleCount += fails;
          slotStats[qIdx].tle += fails;
        } else if (isRte) {
          rteCount += fails;
          slotStats[qIdx].rte += fails;
        } else {
          waCount += fails;
          slotStats[qIdx].wa += fails;
        }
        slotStats[qIdx].fails += fails;
      }

      if (isSlow) {
        slowAcCount += 1;
        slotStats[qIdx].slow += 1;
      }

      if (!isAccepted && fails === 0) {
        slotStats[qIdx].unreached += 1;
      }
    });
  });

  const totalMistakes = tleCount + waCount + rteCount + slowAcCount;

  const pct = (cnt) => (totalMistakes > 0 ? Math.round((cnt / totalMistakes) * 100) : 0);

  const buckets = [
    {
      id: 'wa',
      key: 'EDGE_CASE_PANIC',
      title: 'Edge-Case & Greedy Panic',
      code: 'WA',
      label: 'Wrong Answer Submissions',
      count: waCount,
      percentage: pct(waCount),
      color: 'amber',
      accentBg: 'bg-amber-500/10',
      accentBorder: 'border-amber-500/20',
      accentText: 'text-amber-400',
      barColor: 'bg-amber-500',
      description: 'Premature submissions on unproven greedy assumptions or missed boundary cases (n = 1, duplicates, overflow).'
    },
    {
      id: 'tle',
      key: 'COMPLEXITY_BOTTLENECK',
      title: 'Complexity Bottleneck',
      code: 'TLE',
      label: 'Time Limit Exceeded',
      count: tleCount,
      percentage: pct(tleCount),
      color: 'rose',
      accentBg: 'bg-rose-500/10',
      accentBorder: 'border-rose-500/20',
      accentText: 'text-rose-400',
      barColor: 'bg-rose-500',
      description: 'Writing working O(N²) brute-force code, but freezing when optimizing to O(N log N), monotonic queues, or DP.'
    },
    {
      id: 'rte',
      key: 'MEMORY_INDEXING_SLOPPINESS',
      title: 'Memory & Indexing Sloppiness',
      code: 'RTE',
      label: 'Runtime / Memory Error',
      count: rteCount,
      percentage: pct(rteCount),
      color: 'purple',
      accentBg: 'bg-purple-500/10',
      accentBorder: 'border-purple-500/20',
      accentText: 'text-purple-400',
      barColor: 'bg-purple-500',
      description: 'Vector out-of-bounds indexing, base-case recursion stack overflow, or integer division by zero under time pressure.'
    },
    {
      id: 'slow',
      key: 'IMPLEMENTATION_DRAG',
      title: 'Implementation Drag',
      code: 'SLOW',
      label: 'Exceeded Split Benchmark',
      count: slowAcCount,
      percentage: pct(slowAcCount),
      color: 'blue',
      accentBg: 'bg-blue-500/10',
      accentBorder: 'border-blue-500/20',
      accentText: 'text-blue-400',
      barColor: 'bg-blue-500',
      description: 'Correct algorithmic logic identified, but implementation took > 25% longer than benchmark pacing.'
    }
  ];

  // Determine Primary Choke Slot
  let maxSlot = null;
  slotStats.forEach((s) => {
    const totalSlotDrag = s.fails + s.slow;
    if (!maxSlot || totalSlotDrag > (maxSlot.fails + maxSlot.slow)) {
      maxSlot = s;
    }
  });

  const totalSlotMistakes = maxSlot ? (maxSlot.fails + maxSlot.slow) : 0;
  const slotSharePct = totalMistakes > 0 ? Math.round((totalSlotMistakes / totalMistakes) * 100) : 0;

  let primaryChokeSlot = null;
  if (totalMistakes > 0 && maxSlot && totalSlotMistakes > 0) {
    const dominantType = maxSlot.wa >= maxSlot.tle && maxSlot.wa >= maxSlot.rte
      ? 'Wrong Answers (WA)'
      : maxSlot.tle >= maxSlot.rte
      ? 'Time Limit Exceeded (TLE)'
      : 'Runtime Errors (RTE)';

    primaryChokeSlot = {
      slot: maxSlot.slot,
      label: maxSlot.label,
      totalMistakes: totalSlotMistakes,
      sharePercentage: slotSharePct,
      dominantType,
      headline: `${maxSlot.slot} is your primary rating killer`,
      summary: `${slotSharePct}% of your contest mistake penalties (${totalSlotMistakes} incidents) concentrate on ${maxSlot.slot}, predominantly driven by ${dominantType}.`
    };
  } else {
    primaryChokeSlot = {
      slot: 'None',
      label: 'All Slots Clean',
      totalMistakes: 0,
      sharePercentage: 0,
      dominantType: 'Clean Solves',
      headline: 'Flawless Execution Across All Slots',
      summary: 'No penalty concentrations or diagnostic bottlenecks detected in recent contests.'
    };
  }

  return {
    buckets,
    totalMistakes,
    primaryChokeSlot,
    slotBreakdown: slotStats,
    dominantBucket: buckets.slice().sort((a, b) => b.count - a.count)[0]
  };
}

/**
 * Computes Section 5: The "Biological Clock" Split (Weekly vs Biweekly Performance)
 * Parses Weekly (Sunday 8:00 AM IST) vs Biweekly (Saturday 8:00 PM IST)
 */
export function computeCircadianSplitTelemetry(contestHistory = []) {
  if (!contestHistory || !contestHistory.length) {
    return {
      weekly: { count: 0, wins: 0, winRate: 0, avgDelta: 0, avgRank: 0, avgSolved: 0 },
      biweekly: { count: 0, wins: 0, winRate: 0, avgDelta: 0, avgRank: 0, avgSolved: 0 },
      diagnostic: null
    };
  }

  // Enrich with rating delta chronologically
  const enriched = contestHistory.map((c, i) => {
    const prev = i > 0 ? contestHistory[i - 1].rating : 1500;
    const delta = c.ratingDelta !== undefined ? c.ratingDelta : Math.round((c.rating || 1500) - prev);
    return { ...c, delta };
  });

  const isWeekly = (title = '') => {
    const t = title.toLowerCase();
    return t.includes('weekly') && !t.includes('biweekly');
  };

  const isBiweekly = (title = '') => {
    return title.toLowerCase().includes('biweekly');
  };

  const weeklies = enriched.filter((c) => isWeekly(c.contestTitle));
  const biweeklies = enriched.filter((c) => isBiweekly(c.contestTitle));

  const calculateFormatStats = (list) => {
    if (!list.length) {
      return { count: 0, wins: 0, winRate: 0, avgDelta: 0, avgRank: 0, avgSolved: 0, avgFinishTime: '0m' };
    }
    const wins = list.filter((c) => c.delta > 0).length;
    const totalDelta = list.reduce((a, b) => a + b.delta, 0);
    const totalRank = list.reduce((a, b) => a + (b.ranking || 0), 0);
    const totalSolved = list.reduce((a, b) => a + (b.problemsSolved || 0), 0);
    const totalFinish = list.reduce((a, b) => a + (b.finishTimeInSeconds || 0), 0);

    return {
      count: list.length,
      wins,
      winRate: Math.round((wins / list.length) * 100),
      avgDelta: Number((totalDelta / list.length).toFixed(1)),
      avgRank: Math.round(totalRank / list.length),
      avgSolved: Number((totalSolved / list.length).toFixed(1)),
      avgFinishTime: formatDuration(Math.round(totalFinish / list.length))
    };
  };

  const weeklyStats = calculateFormatStats(weeklies);
  const biweeklyStats = calculateFormatStats(biweeklies);

  // Diagnostic logic (minimal, crisp, 1-line verdict)
  let diagnostic = null;
  if (weeklyStats.count >= 2 && biweeklyStats.count >= 2) {
    const gap = Number((biweeklyStats.avgDelta - weeklyStats.avgDelta).toFixed(1));
    if (gap >= 8) {
      diagnostic = {
        type: 'BLEED',
        headline: 'Circadian Bleed Detected',
        text: `You average ${Math.abs(gap)} fewer rating points on Sunday mornings (Weekly) compared to Saturday evenings (Biweekly).`
      };
    } else if (gap <= -8) {
      diagnostic = {
        type: 'SURGE',
        headline: 'Morning Peak Detected',
        text: `You average ${Math.abs(gap)} higher rating points on Sunday mornings (Weekly) compared to Saturday evenings (Biweekly).`
      };
    } else {
      diagnostic = {
        type: 'BALANCED',
        headline: 'Balanced Circadian Rhythm',
        text: `High consistency across morning and evening slots (±${Math.abs(gap)} pts variance between formats).`
      };
    }
  }

  return {
    weekly: weeklyStats,
    biweekly: biweeklyStats,
    diagnostic
  };
}

/**
 * Computes Section 6: Rating Volatility, Tilt Tracker, Next-Badge Horizon & Career Ledger
 */
export function computeCareerLedgerTelemetry(contestDoc) {
  const contestHistory = contestDoc?.contestHistory || [];
  const summary = contestDoc?.summary || {};

  if (!contestHistory.length) {
    return {
      horizon: null,
      volatility: null,
      ledger: []
    };
  }

  // Enrich with delta and slug
  const enriched = contestHistory.map((c, i) => {
    const prev = i > 0 ? contestHistory[i - 1].rating : 1500;
    const delta = c.ratingDelta !== undefined ? c.ratingDelta : Math.round((c.rating || 1500) - prev);
    const slug = (c.contestTitle || '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return {
      ...c,
      delta,
      dateFormatted: formatContestDate(c.startTime),
      finishFormatted: formatDuration(c.finishTimeInSeconds),
      slug,
      url: `https://leetcode.com/contest/${slug}/`
    };
  });

  const currentRating = summary?.rating || enriched[enriched.length - 1].rating || 1500;

  // 1. Next-Badge Horizon
  let nextBadgeName = 'Knight';
  let nextBadgeTarget = 1850;
  let baseline = 1500;

  if (currentRating >= 1850) {
    nextBadgeName = 'Guardian';
    nextBadgeTarget = 2150;
    baseline = 1850;
  }

  const ptsNeeded = Math.max(0, nextBadgeTarget - currentRating);
  const progressPct = Math.min(100, Math.max(0, Math.round(((currentRating - baseline) / (nextBadgeTarget - baseline)) * 100)));

  const positiveGains = enriched.filter((c) => c.delta > 0);
  const avgPositiveGain = positiveGains.length > 0
    ? Number((positiveGains.reduce((a, b) => a + b.delta, 0) / positiveGains.length).toFixed(1))
    : 20;

  const estContestsNeeded = ptsNeeded > 0 ? Math.ceil(ptsNeeded / avgPositiveGain) : 0;

  const horizon = {
    currentRating,
    nextBadgeName,
    nextBadgeTarget,
    ptsNeeded,
    progressPct,
    estContestsNeeded,
    avgPositiveGain,
    globalStanding: summary?.globalRanking ? `#${summary.globalRanking.toLocaleString()}` : null,
    totalParticipants: summary?.totalParticipants ? summary.totalParticipants.toLocaleString() : '888,637',
    topPercent: summary?.topPercentage ? `${summary.topPercentage.toFixed(1)}%` : null
  };

  // 2. Momentum & Volatility
  const deltas = enriched.map((c) => c.delta);
  const upwardVelocity = Math.round((positiveGains.length / enriched.length) * 100);

  // Current Streak (ending at newest contest)
  let currentStreak = 0;
  for (let i = enriched.length - 1; i >= 0; i--) {
    if (enriched[i].delta > 0) currentStreak++;
    else break;
  }

  // All-time longest streak
  let longestStreak = 0;
  let tempStreak = 0;
  for (let i = 0; i < enriched.length; i++) {
    if (enriched[i].delta > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  // Peak spike & worst tilt
  const maxGain = deltas.length ? Math.max(...deltas) : 0;
  const bestContest = enriched.find((c) => c.delta === maxGain);
  const maxLoss = deltas.length ? Math.min(...deltas) : 0;
  const worstContest = enriched.find((c) => c.delta === maxLoss);

  // Standard deviation (sigma)
  const meanDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
  const variance = deltas.reduce((a, b) => a + Math.pow(b - meanDelta, 2), 0) / deltas.length;
  const stdDev = Number(Math.sqrt(variance).toFixed(1));
  const isSteady = stdDev <= 30;

  const volatility = {
    upwardVelocity,
    winsCount: positiveGains.length,
    totalCount: enriched.length,
    currentStreak,
    longestStreak,
    maxGain,
    bestContestTitle: bestContest?.contestTitle || 'Best Contest',
    maxLoss,
    worstContestTitle: worstContest?.contestTitle || 'Worst Contest',
    stdDev,
    isSteady,
    label: isSteady ? 'Steady Climber' : 'High-Variance Swinger',
    sublabel: isSteady ? `Consistent pacing (σ = ${stdDev})` : `Wide rating swings (σ = ${stdDev})`
  };

  // 3. Ledger (Sorted newest first)
  const ledger = enriched.slice().reverse();

  return {
    horizon,
    volatility,
    ledger
  };
}


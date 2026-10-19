import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  TrendingDown,
  TrendingUp,
  Clock,
  Zap,
  ShieldAlert,
  ArrowRight
} from 'lucide-react'

export default function PanicTaxSection({ panicData }) {
  const { contests, totals, verdict } = panicData || {
    contests: [],
    totals: {},
    verdict: null
  }

  // Max finish time across all 5 contests to scale the horizontal stacked bars (up to 90m = 5400s)
  const maxContestSeconds = useMemo(() => {
    if (!contests || !contests.length) return 5400
    const times = contests.map((c) => c.finishTimeSeconds || 0)
    return Math.max(5400, ...times)
  }, [contests])

  if (!contests || !contests.length) {
    return (
      <div
        id="section-panic-tax"
        className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <p className="text-sm font-mono text-neutral-500">
          No attended contest data available for penalty analysis.
        </p>
      </div>
    )
  }

  return (
    <section id="section-panic-tax" className="scroll-mt-28 space-y-5">
      {/* ── Section Title & Subtitle ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-1 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest">
              01 / PENALTY ANALYSIS
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              Last 5 Contests
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Where You Lose Points & Time
          </h2>
          <p className="mt-1 text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 max-w-3xl">
            In LeetCode contests, every wrong submission on a solved problem adds{' '}
            <strong className="text-neutral-800 dark:text-neutral-200">+5 minutes of penalty time</strong> to your
            clock. Submitting too early without testing boundary cases pushes your rank down.
          </p>
        </div>
      </div>

      {/* ── The Verdict Banner ───────────────────────────────────────── */}
      {verdict && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-rose-200 bg-rose-50/50 p-5 dark:border-rose-950/60 dark:bg-rose-950/20"
        >
          <div className="flex items-start gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500 text-white shadow-xs">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-extrabold uppercase tracking-wide text-rose-700 dark:text-rose-300">
                  {verdict.headline}
                </span>
                <span className="rounded bg-rose-200/60 dark:bg-rose-900/60 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-800 dark:text-rose-200">
                  ~{totals.totalEstimatedRankLoss.toLocaleString()} positions lost
                </span>
              </div>
              <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-rose-950 dark:text-rose-200">
                {verdict.summary}
              </p>
              {verdict.highlightContest && (
                <p className="mt-2 text-xs font-mono text-rose-800 dark:text-rose-400 border-t border-rose-200/60 dark:border-rose-900/40 pt-2">
                  ⚡ <strong>Biggest Time Loss:</strong> {verdict.highlightContest}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── 4 Executive Metric Chips ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900 shadow-2xs">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Total Penalty Time
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-black text-rose-600 dark:text-rose-400 tabular-nums">
              +{totals.totalPenaltyMinutes}m
            </span>
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              ({totals.totalAcceptedFails} fails)
            </span>
          </div>
          <span className="text-[10.5px] text-neutral-500 dark:text-neutral-400 mt-1 block">
            Added to your finish clocks
          </span>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900 shadow-2xs">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Estimated Rank Loss
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-black text-rose-600 dark:text-rose-400 tabular-nums">
              ~{totals.totalEstimatedRankLoss.toLocaleString()}
            </span>
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              spots
            </span>
          </div>
          <span className="text-[10.5px] text-neutral-500 dark:text-neutral-400 mt-1 block">
            Lost exclusively from penalty time
          </span>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900 shadow-2xs">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Avg Penalty Per Contest
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-black text-neutral-900 dark:text-neutral-100 tabular-nums">
              +{totals.avgPenaltyPerContest}m
            </span>
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              / contest
            </span>
          </div>
          <span className="text-[10.5px] text-neutral-500 dark:text-neutral-400 mt-1 block">
            Average penalty per contest
          </span>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900 shadow-2xs">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            Wrong Attempts
          </span>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-black text-neutral-900 dark:text-neutral-100 tabular-nums">
              {totals.totalFails}
            </span>
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              attempts
            </span>
          </div>
          <span className="text-[10.5px] text-neutral-500 dark:text-neutral-400 mt-1 block">
            {totals.totalAcceptedFails} on solved problems (+5m each) • {totals.totalFails - totals.totalAcceptedFails} on unsolved
          </span>
        </div>
      </div>

      {/* ── Pure Coding Time vs. Penalty Time Stacked Bars ─── */}
      <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-neutral-100 dark:border-neutral-800 gap-2">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Actual Coding Time vs. Penalty Time (+5m per wrong try)
            </h3>
            <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              See how much of your finish clock was spent solving problems versus waiting out penalty time
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[11px] font-mono shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-500" />
              <span className="text-neutral-600 dark:text-neutral-300">Pure Solve Time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[2px] bg-rose-500" />
              <span className="text-neutral-600 dark:text-neutral-300">Penalty Time (+5m/wrong try)</span>
            </div>
          </div>
        </div>

        {/* List of 5 Contests */}
        <div className="space-y-4">
          {contests.map((item) => {
            const pureWidth = (item.pureSolveTimeSeconds / maxContestSeconds) * 100
            const penaltyWidth = (item.penaltySeconds / maxContestSeconds) * 100
            const isPositive = item.ratingDelta > 0
            const isNegative = item.ratingDelta < 0

            return (
              <div
                key={item.id}
                className="rounded-lg border border-neutral-100 bg-neutral-50/60 p-3.5 dark:border-neutral-800/60 dark:bg-neutral-900/60 transition-colors hover:border-neutral-200 dark:hover:border-neutral-700"
              >
                {/* Contest Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs sm:text-[13px] text-neutral-900 dark:text-neutral-100">
                      {item.contestTitle}
                    </span>
                    <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                      • {item.dateFormatted}
                    </span>
                    <span className="rounded bg-neutral-200/70 px-1.5 py-0.2 font-mono text-[10px] font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                      {item.rankingFormatted}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Rating Delta Badge */}
                    <span
                      className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums ${
                        isPositive
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : isNegative
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                          : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                      }`}
                    >
                      {isPositive ? <TrendingUp className="h-3 w-3" /> : isNegative ? <TrendingDown className="h-3 w-3" /> : null}
                      {item.ratingDelta > 0 ? `+${item.ratingDelta}` : item.ratingDelta}
                    </span>

                    {/* Finish Clock */}
                    <span className="font-mono text-xs font-extrabold text-neutral-900 dark:text-neutral-100 tabular-nums">
                      {item.finishTimeFormatted}
                    </span>
                  </div>
                </div>

                {/* Stacked Bars */}
                <div className="relative h-6 w-full rounded-md bg-neutral-200/60 dark:bg-neutral-800 overflow-hidden flex shadow-inner">
                  {/* Pure Solve Segment */}
                  {pureWidth > 0 && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pureWidth}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full bg-emerald-500 dark:bg-emerald-600 flex items-center justify-start px-2 text-[10px] font-mono font-bold text-white whitespace-nowrap overflow-hidden"
                      title={`Pure Coding: ${item.pureSolveTimeFormatted} (${item.purePercentage}%)`}
                    >
                      {item.purePercentage >= 15 ? `${item.pureSolveTimeFormatted} coding` : ''}
                    </motion.div>
                  )}

                  {/* Penalty Segment */}
                  {penaltyWidth > 0 && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${penaltyWidth}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                      className="h-full bg-rose-500 dark:bg-rose-600 flex items-center justify-center px-1.5 text-[10px] font-mono font-black text-white whitespace-nowrap overflow-hidden"
                      title={`Penalty: +${item.penaltyMinutes}m (${item.acceptedFails} wrong tries)`}
                    >
                      +{item.penaltyMinutes}m
                    </motion.div>
                  )}
                </div>

                {/* Bottom Row Diagnostics */}
                <div className="mt-2 flex flex-wrap items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 gap-1.5">
                  <div className="flex items-center gap-2">
                    <span>
                      {item.problemsSolved}/{item.totalProblems} solved
                    </span>
                    <span>•</span>
                    <span className={item.acceptedFails > 0 ? 'text-rose-600 dark:text-rose-400 font-semibold' : ''}>
                      {item.acceptedFails > 0
                        ? `${item.acceptedFails} wrong tries (+${item.penaltyMinutes}m penalty)`
                        : '0 wrong tries (clean clock)'}
                    </span>
                  </div>

                  {item.acceptedFails > 0 && (
                    <span className="text-rose-600 dark:text-rose-400 font-bold">
                      ~{item.estimatedRankLoss.toLocaleString()} rank spots lost
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Clock,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MinusCircle,
  Hourglass,
  Flame,
  ArrowRight
} from 'lucide-react'

export default function SplitTimeAutopsySection({ matrixData }) {
  if (!matrixData || !matrixData.length) {
    return (
      <div
        id="section-split-times"
        className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900"
      >
        <p className="text-sm font-mono text-neutral-500">
          No question telemetry available for Split-Time Autopsy.
        </p>
      </div>
    )
  }

  return (
    <section id="section-split-times" className="scroll-mt-28 space-y-5">
      {/* ── Section Title & Subtitle ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-1 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
              02 / TELEMETRY
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
              Lap Splits & Pacing Telemetry
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            90-Minute Split-Time Autopsy & Slow Solve Matrix
          </h2>
          <p className="mt-1 text-xs sm:text-[13px] text-neutral-500 dark:text-neutral-400 max-w-3xl">
            A solved problem isn't always a victory. If Q2 takes 40 minutes with 3 wrong answers, that{' '}
            <strong className="text-neutral-800 dark:text-neutral-200">"Slow Solve"</strong> starved Q3 of time
            and added +15m penalty—ruining your rating trajectory before you even saw Q4.
          </p>
        </div>
      </div>

      {/* ── Engineering State Legend Bar ─────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/70 p-2.5 dark:border-emerald-950/60 dark:bg-emerald-950/20">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="block font-mono text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
              Clean Solve
            </span>
            <span className="block text-[9.5px] text-emerald-700 dark:text-emerald-400">
              AC with 0 fails & fast split
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/70 p-2.5 dark:border-amber-950/60 dark:bg-amber-950/20">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white">
            <AlertTriangle className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="block font-mono text-[11px] font-bold text-amber-800 dark:text-amber-300">
              Slow Solve
            </span>
            <span className="block text-[9.5px] text-amber-700 dark:text-amber-400">
              AC with penalty or pacing drag
            </span>
          </div>
        </div>


        <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50/70 p-2.5 dark:border-rose-950/60 dark:bg-rose-950/20">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 text-white">
            <XCircle className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="block font-mono text-[11px] font-bold text-rose-800 dark:text-rose-300">
              Hard Reject / Brick Wall
            </span>
            <span className="block text-[9.5px] text-rose-700 dark:text-rose-400">
              Attempted but TLE/WA/RTE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-100/70 p-2.5 dark:border-neutral-800 dark:bg-neutral-800/40">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-400 text-white dark:bg-neutral-600">
            <MinusCircle className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="block font-mono text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
              Untouched / Starved
            </span>
            <span className="block text-[9.5px] text-neutral-500 dark:text-neutral-400">
              Clock expired on earlier Qs
            </span>
          </div>
        </div>
      </div>

      {/* ── 5 Contests × 4 Questions Matrix ──────────────────────────── */}
      <div className="space-y-4">
        {matrixData.map((row) => (
          <div
            key={row.contestId}
            className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-xs"
          >
            {/* Contest Row Header */}
            <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 gap-2">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-xs sm:text-[13px] text-neutral-900 dark:text-neutral-100">
                  {row.contestTitle}
                </span>
                <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                  • {row.dateFormatted}
                </span>
                <span className="rounded bg-neutral-200/70 px-1.5 py-0.5 font-mono text-[10px] font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  Rank #{row.ranking?.toLocaleString() || 'Unranked'}
                </span>
                <span className="rounded bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                  {row.problemsSolved}/{row.totalProblems} Solved
                </span>
              </div>

              {/* Dead Zone Callout if user stalled */}
              {row.hasStall && (
                <div className="flex items-center gap-1.5 rounded bg-amber-500/10 px-2 py-0.5 font-mono text-[11px] font-bold text-amber-700 dark:text-amber-400 border border-amber-500/20">
                  <Hourglass className="h-3 w-3" />
                  <span>Dead Zone: {row.deadZoneMinutes}m clock starved after Q{row.problemsSolved}</span>
                </div>
              )}
            </div>

            {/* 4 Question Columns (Q1, Q2, Q3, Q4) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 dark:divide-neutral-800">
              {row.cells.map((cell) => {
                const isClean = cell.state === 'CLEAN'
                const isSlowSolve = cell.state === 'SLOW'
                const isBrickWall = cell.state === 'BRICK_WALL'

                const isUntouched = cell.state === 'UNTOUCHED'

                return (
                  <div
                    key={cell.qIndex}
                    className={`p-3.5 flex flex-col justify-between transition-colors ${
                      isClean
                        ? 'bg-emerald-50/20 dark:bg-emerald-950/10'
                        : isSlowSolve
                        ? 'bg-amber-50/30 dark:bg-amber-950/15'
                        : isBrickWall
                        ? 'bg-rose-50/30 dark:bg-rose-950/15'
                        : 'bg-neutral-50/30 dark:bg-neutral-900/40'
                    }`}
                  >
                    {/* Top: Slot & Difficulty */}
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-mono text-xs font-black text-neutral-900 dark:text-neutral-100">
                          {cell.qLabel}
                        </span>

                        <span
                          className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase ${
                            cell.difficulty === 'Easy'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                              : cell.difficulty === 'Hard'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}
                        >
                          {cell.difficulty}
                        </span>
                      </div>

                      {/* Question Title */}
                      <p className="text-[12px] font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                        {cell.title}
                      </p>

                      {/* State Badge */}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                            isClean
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : isSlowSolve
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                              : isBrickWall
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                              : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                          }`}
                        >
                          {isClean && <CheckCircle2 className="h-3 w-3" />}
                          {isSlowSolve && <AlertTriangle className="h-3 w-3" />}
                          {isBrickWall && <XCircle className="h-3 w-3" />}
                          {isUntouched && <MinusCircle className="h-3 w-3" />}
                          <span>{cell.stateLabel}</span>
                        </span>

                        {cell.fails > 0 && isSlowSolve && (
                          <span className="rounded bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 px-1 py-0.5 font-mono text-[9px] font-bold">
                            +{cell.fails * 5}m penalty
                          </span>
                        )}
                      </div>
                    </div>


                    {/* Bottom: Split Time, Attempt & 1-Click Upsolve */}
                    <div className="mt-3.5 pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center justify-between text-[11px] font-mono">
                      <div>
                        <div className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                          <Clock className="h-3 w-3" />
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {cell.splitFormatted}
                          </span>
                        </div>
                        <span className="text-[9.5px] text-neutral-400 dark:text-neutral-500 block">
                          {cell.fails > 0 ? `${cell.fails} fails` : isClean ? '1st attempt' : 'unsolved'}
                        </span>
                      </div>

                      {/* 1-Click Upsolve Link to LeetCode */}
                      {cell.upsolveUrl ? (
                        <a
                          href={cell.upsolveUrl}
                          target="_blank"
                          rel="noreferrer"
                          title="Open problem on LeetCode to upsolve"
                          className="flex items-center gap-1 rounded bg-neutral-100 hover:bg-neutral-200 px-2 py-1 text-[10px] font-mono font-bold text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300 transition-colors"
                        >
                          <span>Upsolve</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      ) : (
                        <span className="text-[10px] font-mono text-neutral-400">--</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

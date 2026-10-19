import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Zap,
  Clock,
  Bug,
  Cpu,
  Layers,
  ShieldAlert,
  HelpCircle,
  TrendingDown
} from 'lucide-react'

export default function RootCauseMistakeSection({ telemetry }) {
  if (!telemetry) return null

  const {
    buckets = [],
    totalMistakes = 0,
    primaryChokeSlot = null,
    slotBreakdown = [],
    dominantBucket = null
  } = telemetry

  const getBucketIcon = (code) => {
    switch (code) {
      case 'WA':
        return AlertTriangle
      case 'TLE':
        return Cpu
      case 'RTE':
        return Bug
      case 'SLOW':
        return Clock
      default:
        return Zap
    }
  }

  return (
    <section
      id="section-root-causes"
      className="scroll-mt-28 rounded-2xl border border-neutral-200/90 bg-white dark:border-neutral-800 dark:bg-neutral-900 shadow-xs transition-colors"
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                03 / MISTAKE BREAKDOWN
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="font-mono text-[10.5px] font-medium text-neutral-500 dark:text-neutral-400">
                {totalMistakes} Mistakes & Slow Solves
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Where You Lose Points & Time
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-300">
            <Layers className="h-3.5 w-3.5 text-neutral-400" />
            Last 5 Contests
          </span>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* ── Primary Time & Point Loss Banner ─────────────────────────────────── */}
        {primaryChokeSlot && primaryChokeSlot.slot !== 'None' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-rose-200/80 bg-rose-50/60 p-4 sm:p-5 dark:border-rose-900/40 dark:bg-rose-950/20"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-500 text-white shadow-xs">
                  <TrendingDown className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-rose-700 dark:text-rose-300 bg-rose-200/60 dark:bg-rose-900/60 px-2 py-0.5 rounded-md">
                      Biggest Time & Point Loss
                    </span>
                    <span className="font-mono text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                      {primaryChokeSlot.label}
                    </span>
                  </div>
                  <h3 className="mt-1 text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {primaryChokeSlot.headline}
                  </h3>
                  <p className="mt-0.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
                    {primaryChokeSlot.summary}
                  </p>
                </div>
              </div>

              {/* Slot Distribution Meters */}
              <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-rose-200/60 dark:border-rose-900/40 pt-3 lg:pt-0 lg:pl-5">
                {slotBreakdown.map((s) => {
                  const isChoke = s.slot === primaryChokeSlot.slot
                  const totalSlotIncidents = s.fails + s.slow
                  return (
                    <div
                      key={s.slot}
                      className={`flex flex-col items-center justify-center rounded-lg px-2.5 py-1.5 min-w-[62px] text-center border transition-all ${
                        isChoke
                          ? 'border-rose-400 bg-rose-100/80 dark:border-rose-700/80 dark:bg-rose-950/60 shadow-xs ring-1 ring-rose-400/30'
                          : 'border-neutral-200 bg-white/80 dark:border-neutral-800 dark:bg-neutral-900'
                      }`}
                    >

                      <span className="font-mono text-[10px] font-bold text-neutral-500 dark:text-neutral-400">
                        {s.slot}
                      </span>
                      <span
                        className={`font-mono text-sm font-extrabold ${
                          isChoke
                            ? 'text-rose-600 dark:text-rose-300'
                            : 'text-neutral-800 dark:text-neutral-200'
                        }`}
                      >
                        {totalSlotIncidents}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-400">
                        {totalSlotIncidents === 1 ? 'mistake' : 'mistakes'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/20">
            <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
              Clean Execution Across All Questions
            </h3>
            <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-400">
              No major time loss or wrong submissions detected across evaluated contests.
            </p>
          </div>
        )}

        {/* ── 4-Card Failure Breakdown Strip ─────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Common Mistakes (Share of Total)
            </span>
            <span className="font-mono text-[11px] text-neutral-400">
              Total: {totalMistakes} mistake{totalMistakes !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {buckets.map((bucket) => {
              const Icon = getBucketIcon(bucket.code)
              const isDominant = dominantBucket?.id === bucket.id && bucket.count > 0

              return (
                <motion.div
                  key={bucket.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                  className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all ${
                    isDominant
                      ? 'border-neutral-400/80 bg-neutral-50/80 dark:border-neutral-600 dark:bg-neutral-800/40 ring-1 ring-neutral-400/20'
                      : 'border-neutral-200/90 bg-neutral-50/40 dark:border-neutral-800 dark:bg-neutral-800/20'
                  }`}
                >
                  {/* Top Bar: Icon + Code Pill + Dominant Badge */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${bucket.accentBg} ${bucket.accentText}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isDominant && (
                          <span className="rounded-md border border-neutral-300 bg-neutral-900 px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase text-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                            Most Common
                          </span>
                        )}
                        <span
                          className={`rounded-md border ${bucket.accentBorder} ${bucket.accentBg} px-2 py-0.5 font-mono text-[10.5px] font-bold ${bucket.accentText}`}
                        >
                          {bucket.code}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
                      {bucket.title}
                    </h4>
                    <p className="mt-1 text-[11.5px] text-neutral-500 dark:text-neutral-400 leading-normal">
                      {bucket.description}
                    </p>
                  </div>

                  {/* Bottom Metrics & Progress Fill */}
                  <div className="mt-4 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60">
                    <div className="flex items-baseline justify-between mb-1.5">
                      <span className="font-mono text-xl font-extrabold text-neutral-900 dark:text-neutral-100">
                        {bucket.count}
                        <span className="ml-1 text-[11px] font-normal text-neutral-400">
                          {bucket.count === 1 ? 'time' : 'times'}
                        </span>
                      </span>
                      <span className={`font-mono text-sm font-bold ${bucket.accentText}`}>
                        {bucket.percentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                      <motion.div
                        className={`h-full ${bucket.barColor} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${bucket.percentage}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ── Slot-by-Slot Diagnostics Grid ────────────────────────────── */}
        <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/60">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Mistakes by Question
              </span>
            </div>
            <span className="font-mono text-[10.5px] text-neutral-400">
              Q1 (Easy) → Q4 (Hard)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {slotBreakdown.map((s, idx) => {
              const totalSlotEvents = s.fails + s.slow
              return (
                <div
                  key={s.slot}
                  className="rounded-lg border border-neutral-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900"
                >

                  <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100 dark:border-neutral-800">
                    <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {s.label}
                    </span>
                    <span
                      className={`font-mono text-[10.5px] font-bold px-1.5 py-0.5 rounded ${
                        totalSlotEvents > 0
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {totalSlotEvents > 0 ? `${totalSlotEvents} Mistakes / Slow` : 'Clean Solves'}
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Wrong Answers (WA):</span>
                      <span className={s.wa > 0 ? 'font-bold text-amber-500' : 'text-neutral-400'}>
                        {s.wa}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Time Limits (TLE):</span>
                      <span className={s.tle > 0 ? 'font-bold text-rose-500' : 'text-neutral-400'}>
                        {s.tle}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Runtime Errors (RTE):</span>
                      <span className={s.rte > 0 ? 'font-bold text-purple-500' : 'text-neutral-400'}>
                        {s.rte}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                      <span>Slow Solves:</span>
                      <span className={s.slow > 0 ? 'font-bold text-blue-500' : 'text-neutral-400'}>
                        {s.slow}
                      </span>
                    </div>
                    {s.unreached > 0 && (
                      <div className="flex items-center justify-between text-neutral-500 pt-1 border-t border-neutral-100 dark:border-neutral-800/60">
                        <span className="text-[10px]">Ran Out of Time:</span>
                        <span className="font-bold text-neutral-500">{s.unreached}x</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import {
  Clock,
  Sun,
  Moon,
  TrendingUp,
  TrendingDown,
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Zap
} from 'lucide-react'

export default function CircadianSplitSection({ data }) {
  if (!data) return null

  const { weekly, biweekly, diagnostic } = data

  return (
    <section
      id="section-biological-clock"
      className="scroll-mt-28 rounded-2xl border border-neutral-200/90 bg-white dark:border-neutral-800 dark:bg-neutral-900 shadow-xs transition-colors"
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                05 / TIME OF DAY
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="font-mono text-[10.5px] font-medium text-neutral-500 dark:text-neutral-400">
                Sunday Morning vs. Saturday Evening
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Morning (Weekly) vs. Evening (Biweekly) Performance
            </h2>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* ── 1-Line Diagnostic Banner ─────────────────────────────────── */}
        {diagnostic && (
          <div
            className={`rounded-xl border p-3.5 flex items-center gap-3 transition-colors ${
              diagnostic.type === 'EVENING_STRONGER' || diagnostic.type === 'BLEED'
                ? 'border-indigo-200 bg-indigo-50/70 text-indigo-900 dark:border-indigo-900/50 dark:bg-indigo-950/30 dark:text-indigo-200'
                : diagnostic.type === 'MORNING_STRONGER' || diagnostic.type === 'SURGE'
                ? 'border-amber-200 bg-amber-50/70 text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200'
                : 'border-emerald-200 bg-emerald-50/70 text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-200'
            }`}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                diagnostic.type === 'EVENING_STRONGER' || diagnostic.type === 'BLEED'
                  ? 'bg-indigo-500 text-white'
                  : diagnostic.type === 'MORNING_STRONGER' || diagnostic.type === 'SURGE'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-500 text-white'
              }`}
            >
              <Zap className="h-4 w-4" />
            </div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-mono text-xs font-bold">{diagnostic.headline}:</span>
              <span className="text-xs font-sans text-neutral-700 dark:text-neutral-300">
                {diagnostic.text}
              </span>
            </div>
          </div>
        )}

        {/* ── Side-by-Side Comparison Cards ────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Weekly (Sunday Morning) */}
          <div className="rounded-xl border border-neutral-200/90 bg-neutral-50/50 p-4 sm:p-5 dark:border-neutral-800 dark:bg-neutral-900/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200/70 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Sun className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                      Weekly Contests
                    </h3>
                    <span className="font-mono text-[10.5px] text-neutral-500 dark:text-neutral-400">
                      Sunday 8:00 AM IST
                    </span>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold rounded-md bg-white border border-neutral-200 px-2 py-0.5 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  {weekly.count} Contests
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-lg border border-neutral-200/70 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950/70">
                  <span className="font-mono text-[10px] font-bold uppercase text-neutral-400 block">
                    Rating Gain Rate
                  </span>
                  <span className="mt-1 font-mono text-xl font-extrabold text-neutral-900 dark:text-neutral-100 block">
                    {weekly.winRate}%
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {weekly.wins} gains in {weekly.count} contests
                  </span>
                </div>

                <div className="rounded-lg border border-neutral-200/70 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950/70">
                  <span className="font-mono text-[10px] font-bold uppercase text-neutral-400 block">
                    Avg Rating Change
                  </span>
                  <span
                    className={`mt-1 font-mono text-xl font-extrabold block ${
                      weekly.avgDelta >= 0 ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    {weekly.avgDelta >= 0 ? `+${weekly.avgDelta}` : weekly.avgDelta}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    per Sunday contest
                  </span>
                </div>

                <div className="rounded-lg border border-neutral-200/70 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950/70">
                  <span className="font-mono text-[10px] font-bold uppercase text-neutral-400 block">
                    Avg Problems Solved
                  </span>
                  <span className="mt-1 font-mono text-xl font-extrabold text-neutral-900 dark:text-neutral-100 block">
                    {weekly.avgSolved} / 4
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    per contest
                  </span>
                </div>

                <div className="rounded-lg border border-neutral-200/70 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950/70">
                  <span className="font-mono text-[10px] font-bold uppercase text-neutral-400 block">
                    Average Rank
                  </span>
                  <span className="mt-1 font-mono text-xl font-extrabold text-neutral-900 dark:text-neutral-100 block">
                    #{weekly.avgRank.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    across all contests
                  </span>
                </div>
              </div>
            </div>

            {/* Win Rate Progress Bar */}
            <div className="pt-2">
              <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${weekly.winRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Biweekly (Saturday Evening) */}
          <div className="rounded-xl border border-neutral-200/90 bg-neutral-50/50 p-4 sm:p-5 dark:border-neutral-800 dark:bg-neutral-900/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200/70 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <Moon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
                      Biweekly Contests
                    </h3>
                    <span className="font-mono text-[10.5px] text-neutral-500 dark:text-neutral-400">
                      Saturday 8:00 PM IST
                    </span>
                  </div>
                </div>

                <span className="font-mono text-xs font-bold rounded-md bg-white border border-neutral-200 px-2 py-0.5 text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  {biweekly.count} Contests
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-lg border border-neutral-200/70 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950/70">
                  <span className="font-mono text-[10px] font-bold uppercase text-neutral-400 block">
                    Rating Gain Rate
                  </span>
                  <span className="mt-1 font-mono text-xl font-extrabold text-neutral-900 dark:text-neutral-100 block">
                    {biweekly.winRate}%
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    {biweekly.wins} gains in {biweekly.count} contests
                  </span>
                </div>

                <div className="rounded-lg border border-neutral-200/70 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950/70">
                  <span className="font-mono text-[10px] font-bold uppercase text-neutral-400 block">
                    Avg Rating Change
                  </span>
                  <span
                    className={`mt-1 font-mono text-xl font-extrabold block ${
                      biweekly.avgDelta >= 0 ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    {biweekly.avgDelta >= 0 ? `+${biweekly.avgDelta}` : biweekly.avgDelta}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    per Saturday contest
                  </span>
                </div>

                <div className="rounded-lg border border-neutral-200/70 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950/70">
                  <span className="font-mono text-[10px] font-bold uppercase text-neutral-400 block">
                    Avg Problems Solved
                  </span>
                  <span className="mt-1 font-mono text-xl font-extrabold text-neutral-900 dark:text-neutral-100 block">
                    {biweekly.avgSolved} / 4
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    per contest
                  </span>
                </div>

                <div className="rounded-lg border border-neutral-200/70 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-950/70">
                  <span className="font-mono text-[10px] font-bold uppercase text-neutral-400 block">
                    Average Rank
                  </span>
                  <span className="mt-1 font-mono text-xl font-extrabold text-neutral-900 dark:text-neutral-100 block">
                    #{biweekly.avgRank.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    across all contests
                  </span>
                </div>
              </div>
            </div>

            {/* Win Rate Progress Bar */}
            <div className="pt-2">
              <div className="h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${biweekly.winRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

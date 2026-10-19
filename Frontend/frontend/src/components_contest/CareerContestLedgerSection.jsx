import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Flame,
  Activity,
  ExternalLink,
  Search,
  Filter,
  Award,
  ChevronRight
} from 'lucide-react'

export default function CareerContestLedgerSection({ data }) {
  if (!data) return null

  const { horizon, volatility, ledger = [] } = data
  const [filterType, setFilterType] = useState('ALL') // 'ALL' | 'WEEKLY' | 'BIWEEKLY' | 'GAINED' | 'LOST'
  const [searchQuery, setSearchQuery] = useState('')
  const [displayCount, setDisplayCount] = useState(15)

  // Filtered Ledger list
  const filteredLedger = useMemo(() => {
    return ledger.filter((c) => {
      const title = (c.contestTitle || '').toLowerCase()
      // Type filter
      if (filterType === 'WEEKLY' && (!title.includes('weekly') || title.includes('biweekly'))) return false
      if (filterType === 'BIWEEKLY' && !title.includes('biweekly')) return false
      if (filterType === 'GAINED' && c.delta <= 0) return false
      if (filterType === 'LOST' && c.delta >= 0) return false

      // Search filter
      if (searchQuery && !title.includes(searchQuery.toLowerCase().trim())) return false

      return true
    })
  }, [ledger, filterType, searchQuery])

  const visibleLedger = filteredLedger.slice(0, displayCount)

  return (
    <section
      id="section-career-ledger"
      className="scroll-mt-28 rounded-2xl border border-neutral-200/90 bg-white dark:border-neutral-800 dark:bg-neutral-900 shadow-xs transition-colors"
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 sm:p-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                06 / CONTEST HISTORY
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="font-mono text-[10.5px] font-medium text-neutral-500 dark:text-neutral-400">
                {ledger.length} Rated Contests
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Ratings, Consistency & All Past Contests
            </h2>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* ── Next-Badge Goal Bar ───────────────────────────────────── */}
        {horizon && (
          <div className="rounded-xl border border-neutral-200/90 bg-neutral-50/50 p-4 sm:p-5 dark:border-neutral-800 dark:bg-neutral-900/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-500" />
                <span className="font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Next Badge Goal: {horizon.nextBadgeName} ({horizon.nextBadgeTarget})
                </span>
                <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400">
                  {horizon.ptsNeeded > 0 ? `${horizon.ptsNeeded} pts needed` : 'Badge Reached!'}
                </span>
              </div>

              {horizon.globalStanding && (
                <div className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                  Global Rank: <strong className="text-neutral-800 dark:text-neutral-200">{horizon.globalStanding}</strong>
                  {horizon.topPercent && <span className="ml-1 text-emerald-500 font-bold">({horizon.topPercent})</span>}
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="relative h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden mb-2">
              <motion.div
                className="h-full bg-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${horizon.progressPct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              <span>
                Current: <strong className="text-neutral-900 dark:text-neutral-100">{horizon.currentRating}</strong> pts
              </span>
              <span>
                Est. ~{horizon.estContestsNeeded} winning contests (at your avg +{horizon.avgPositiveGain} gain)
              </span>
            </div>
          </div>
        )}

        {/* ── Consistency & Momentum 4-Chip Strip ───────────────────────── */}
        {volatility && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Chip 1: Consistency */}
            <div className="rounded-xl border border-neutral-200/80 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase text-neutral-400">
                  Consistency
                </span>
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              <span className="mt-1 font-mono text-xl font-extrabold text-neutral-900 dark:text-neutral-100 block">
                {volatility.upwardVelocity}%
              </span>
              <span className="text-[10.5px] font-mono text-neutral-500">
                {volatility.winsCount} of {volatility.totalCount} contests gained rating
              </span>
            </div>

            {/* Chip 2: Streak */}
            <div className="rounded-xl border border-neutral-200/80 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase text-neutral-400">
                  Current Win Streak
                </span>
                <Flame className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <span className="mt-1 font-mono text-xl font-extrabold text-amber-500 block">
                {volatility.currentStreak} in a row
              </span>
              <span className="text-[10.5px] font-mono text-neutral-500">
                All-time best: {volatility.longestStreak} consecutive gains
              </span>
            </div>

            {/* Chip 3: Best Gain / Biggest Drop */}
            <div className="rounded-xl border border-neutral-200/80 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase text-neutral-400">
                  Best Gain / Biggest Drop
                </span>
                <Activity className="h-3.5 w-3.5 text-indigo-500" />
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-lg font-black text-emerald-500">
                  +{volatility.maxGain}
                </span>
                <span className="font-mono text-sm text-neutral-400">/</span>
                <span className="font-mono text-lg font-black text-rose-500">
                  {volatility.maxLoss}
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 truncate block" title={volatility.bestContestTitle}>
                Best: {volatility.bestContestTitle}
              </span>
            </div>

            {/* Chip 4: Consistency Classifier */}
            <div className="rounded-xl border border-neutral-200/80 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase text-neutral-400">
                  Rating Consistency
                </span>
                <span className="font-mono text-[10px] text-neutral-400">σ = {volatility.stdDev}</span>
              </div>
              <span className="mt-1 font-mono text-sm font-bold text-neutral-900 dark:text-neutral-100 block">
                {volatility.label}
              </span>
              <span className="text-[10.5px] font-mono text-neutral-500 block">
                {volatility.sublabel}
              </span>
            </div>
          </div>
        )}

        {/* ── Career Contest Ledger Table ─────────────────────────────── */}
        <div className="rounded-xl border border-neutral-200/90 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden">
          {/* Table Controls (Filter Tabs & Search) */}
          <div className="p-3.5 border-b border-neutral-100 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 bg-neutral-50/50 dark:bg-neutral-900/50">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
              {[
                { id: 'ALL', label: `All (${ledger.length})` },
                { id: 'WEEKLY', label: 'Weekly' },
                { id: 'BIWEEKLY', label: 'Biweekly' },
                { id: 'GAINED', label: 'Rating Gained (▲)' },
                { id: 'LOST', label: 'Rating Lost (▼)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterType(tab.id)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                      : 'text-neutral-600 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:bg-neutral-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quick Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contest..."
                className="rounded-lg border border-neutral-200 bg-white pl-8 pr-3 py-1 font-mono text-[11px] text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-neutral-200/80 bg-neutral-100/60 text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950/60 dark:text-neutral-400">
                  <th className="px-4 py-2.5">Contest</th>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Solved</th>
                  <th className="px-4 py-2.5">Finish Time</th>
                  <th className="px-4 py-2.5">Rank</th>
                  <th className="px-4 py-2.5">Rating Change</th>
                  <th className="px-4 py-2.5">Rating After</th>
                  <th className="px-4 py-2.5 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {visibleLedger.map((c, idx) => {
                  const isPositive = c.delta > 0
                  const isNegative = c.delta < 0
                  return (
                    <tr
                      key={idx}
                      className="transition-colors hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40"
                    >
                      {/* Title */}
                      <td className="px-4 py-2.5 font-bold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                        {c.contestTitle}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-2.5 text-neutral-500 whitespace-nowrap">
                        {c.dateFormatted}
                      </td>

                      {/* Solved */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">
                          {c.problemsSolved}
                        </span>
                        <span className="text-neutral-400">/{c.totalProblems || 4}</span>
                      </td>

                      {/* Finish Time */}
                      <td className="px-4 py-2.5 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                        {c.finishFormatted || '--'}
                      </td>

                      {/* Rank */}
                      <td className="px-4 py-2.5 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                        #{c.ranking ? c.ranking.toLocaleString() : '--'}
                      </td>

                      {/* Rating Delta */}
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10.5px] font-bold ${
                            isPositive
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : isNegative
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              : 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
                          }`}
                        >
                          {isPositive ? `+${c.delta}` : c.delta}
                        </span>
                      </td>

                      {/* Post Rating */}
                      <td className="px-4 py-2.5 font-bold text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                        {c.rating}
                      </td>

                      {/* Link */}
                      <td className="px-4 py-2.5 text-right whitespace-nowrap">
                        <a
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                        >
                          <span>Open</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination / Expand Button */}
          {filteredLedger.length > displayCount && (
            <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 text-center bg-neutral-50/30 dark:bg-neutral-900/40">
              <button
                type="button"
                onClick={() => setDisplayCount((prev) => prev + 25)}
                className="font-mono text-xs font-bold text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
              >
                Show More Contests ({filteredLedger.length - displayCount} remaining) ↓
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

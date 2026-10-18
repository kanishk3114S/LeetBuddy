import { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts'
import {
  RotateCw,
  Trophy,
  TrendingUp,
  TrendingDown,
  Award,
  Activity,
  CheckCircle2,
  Target,
  Shield,
  Clock,
  ChevronRight,
  AlertCircle,
  Calendar,
  Layers,
  Zap
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme.js'
import Sidebar from '../components_dashboard/Sidebar.jsx'
import DashHeader from '../components_dashboard/DashHeader.jsx'
import {
  formatContestOverview,
  computeRankDistributionMatrix,
  computeSolveEfficiencyMatrix,
  buildRatingMountainData
} from '../utils/contestUtils.js'

/**
 * Custom Recharts Tooltip for the Contest Rating Mountain Chart
 */
function CustomContestTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null

  const data = payload[0].payload
  const isPositive = data.ratingDelta > 0
  const isNegative = data.ratingDelta < 0

  return (
    <div className="rounded-lg border border-neutral-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/95 min-w-[210px] select-none">
      {/* Header: Title and Date */}
      <div className="border-b border-neutral-100 pb-2 mb-2.5 dark:border-neutral-800">
        <p className="font-bold text-[13px] tracking-tight text-neutral-900 dark:text-neutral-100 truncate">
          {data.contestTitle}
        </p>
        <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mt-0.5">
          {data.fullDate}
        </p>
      </div>

      {/* Grid: Rating & Delta */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono">
            Rating
          </span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[14px] font-extrabold text-neutral-900 dark:text-neutral-100 tabular-nums">
              {data.rating.toLocaleString()}
            </span>
            <span
              className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded tabular-nums ${
                isPositive
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                  : isNegative
                  ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                  : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
              }`}
            >
              {data.ratingDeltaFormatted}
            </span>
          </div>
        </div>

        {/* Global Rank */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono">
            Placement
          </span>
          <span className="font-mono text-[12px] font-bold text-neutral-800 dark:text-neutral-200 tabular-nums">
            {data.rankingFormatted}
          </span>
        </div>

        {/* Solved Count & Finish Time */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-800">
          <span className="text-[11px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono">
            Solved
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[12px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {data.solveDisplay}
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              • {data.finishTimeFormatted}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 4-Segmented Visual Micro-Bar representing Q1 to Q4 problem solves
 */
function MicroSolveBlocks({ solvedCount, totalProblems = 4, isAllKills }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalProblems }).map((_, idx) => {
        const isSolved = idx < solvedCount
        return (
          <div
            key={idx}
            title={`Q${idx + 1}: ${isSolved ? 'Solved' : 'Unsolved'}`}
            className={`h-2.5 w-4 rounded-[2px] transition-all duration-200 ${
              isSolved
                ? isAllKills
                  ? 'bg-emerald-500 dark:bg-emerald-400 shadow-xs'
                  : 'bg-neutral-800 dark:bg-neutral-200'
                : 'bg-neutral-200 dark:bg-neutral-800'
            }`}
          />
        )
      })}
    </div>
  )
}

export default function ContestAnalysis() {
  const navigate = useNavigate()
  const { isDarkMode } = useTheme()
  const [activeNav, setActiveNav] = useState('contests')

  // Restore user info from localStorage
  const user = useMemo(() => ({
    email: localStorage.getItem('lb_email') || '',
    name: localStorage.getItem('lb_name') || ''
  }), [])

  // Profile stats state
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('lb_stats')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Contest data state
  const [contestDoc, setContestDoc] = useState(() => {
    try {
      const saved = localStorage.getItem('lb_contest')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [isSyncing, setIsSyncing] = useState(false)
  const [syncNotice, setSyncNotice] = useState(null)

  // Username resolution
  const username = useMemo(() => {
    return (
      contestDoc?.leetcodeUsername ||
      stats?.username ||
      stats?.profile?.username ||
      localStorage.getItem('lb_username') ||
      ''
    )
  }, [contestDoc, stats])

  // Fetch or sync contest data from backend API
  const loadContestData = useCallback(async (forced = false) => {
    if (!username) return

    try {
      if (forced) setIsSyncing(true)
      const authToken = localStorage.getItem('accessToken') || localStorage.getItem('lb_token')

      // Use sync endpoint if forced, otherwise get by username
      const endpoint = forced
        ? '/api/v1/contests/sync'
        : `/api/v1/contests/${encodeURIComponent(username)}`

      const res = await fetch(endpoint, {
        method: forced ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        ...(forced ? { body: JSON.stringify({ username }) } : {})
      })

      if (res.ok) {
        const payload = await res.json()
        const targetContest = payload.contest || payload
        setContestDoc(targetContest)
        try {
          localStorage.setItem('lb_contest', JSON.stringify(targetContest))
          window.dispatchEvent(new CustomEvent('lb_contest_updated', { detail: targetContest }))
        } catch (e) {
          console.warn('Failed to cache contest data', e)
        }
        if (forced) {
          setSyncNotice({ type: 'success', text: 'Contest telemetry refreshed' })
          setTimeout(() => setSyncNotice(null), 3000)
        }
      }
    } catch (err) {
      console.error('[ContestAnalysis] Error loading contest data:', err)
      if (forced) {
        setSyncNotice({ type: 'error', text: 'Failed to sync contest telemetry' })
        setTimeout(() => setSyncNotice(null), 3000)
      }
    } finally {
      if (forced) setIsSyncing(false)
    }
  }, [username])

  // Initial fetch if contestDoc is not yet loaded
  useEffect(() => {
    if (!contestDoc && username) {
      loadContestData(false)
    }
  }, [contestDoc, username, loadContestData])

  // Listen for real-time stats or contest updates from verification or background syncs
  useEffect(() => {
    const handleContestUpdated = (e) => {
      if (e.detail) setContestDoc(e.detail)
    }
    const handleStatsUpdated = (e) => {
      if (e.detail) {
        setStats(e.detail)
        if (e.detail.contest) setContestDoc(e.detail.contest)
      }
    }

    window.addEventListener('lb_contest_updated', handleContestUpdated)
    window.addEventListener('lb_stats_updated', handleStatsUpdated)

    return () => {
      window.removeEventListener('lb_contest_updated', handleContestUpdated)
      window.removeEventListener('lb_stats_updated', handleStatsUpdated)
    }
  }, [])

  // Pure data transformations via contestUtils
  const overview = useMemo(() => formatContestOverview(contestDoc), [contestDoc])
  const contestHistory = useMemo(() => contestDoc?.contestHistory || [], [contestDoc])
  const rankMatrix = useMemo(() => computeRankDistributionMatrix(contestHistory), [contestHistory])
  const solveMatrix = useMemo(() => computeSolveEfficiencyMatrix(contestHistory), [contestHistory])
  const mountainData = useMemo(() => buildRatingMountainData(contestHistory), [contestHistory])

  // Max and Min for chart bounds
  const { chartMin, chartMax } = useMemo(() => {
    if (!mountainData.length) return { chartMin: 1400, chartMax: 1800 }
    const ratings = mountainData.map((d) => d.rating)
    return {
      chartMin: Math.max(0, Math.min(...ratings) - 60),
      chartMax: Math.max(...ratings) + 60
    }
  }, [mountainData])

  // Badge tier styling
  const badgeStyle = useMemo(() => {
    const b = (overview.badge || '').toLowerCase()
    if (b.includes('guardian')) {
      return {
        bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
        dot: 'bg-rose-500'
      }
    }
    if (b.includes('knight')) {
      return {
        bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
        dot: 'bg-amber-500'
      }
    }
    return {
      bg: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700',
      dot: 'bg-neutral-400'
    }
  }, [overview.badge])

  // Unverified profile empty state
  if (!stats && !contestDoc) {
    return (
      <div className="flex h-screen overflow-hidden bg-neutral-50 font-sans dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
        <Sidebar active={activeNav} setActive={setActiveNav} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashHeader user={user} stats={stats} />
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="max-w-[420px] rounded-xl border border-neutral-200 bg-white p-7 text-center shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 mb-4">
                <Shield className="h-6 w-6 stroke-[1.8]" />
              </div>
              <h3 className="text-[17px] font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                LeetCode Profile Required
              </h3>
              <p className="mt-2 text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                Connect and verify your LeetCode profile on the Dashboard to unlock live contest telemetry, rating fluctuations, and leaderboard performance.
              </p>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="mt-5 w-full rounded-lg bg-neutral-900 py-2.5 text-[12px] font-extrabold text-white transition hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
              >
                Go to Dashboard ↗
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Verified user but 0 attended contests state
  if (overview.attendedCount === 0) {
    return (
      <div className="flex h-screen overflow-hidden bg-neutral-50 font-sans dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
        <Sidebar active={activeNav} setActive={setActiveNav} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashHeader user={user} stats={stats} />

          <div className="flex flex-1 flex-col items-center justify-center p-6">
            <div className="max-w-[460px] rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 mb-5">
                <Activity className="h-7 w-7 stroke-[1.7]" />
              </div>
              <h3 className="text-[18px] font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                No Rated Contest Telemetry Recorded
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                Account <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">@{username}</span> is connected, but no rated LeetCode Weekly or Biweekly contests have been completed yet.
              </p>
              <p className="mt-2 text-[12px] text-neutral-400 dark:text-neutral-500">
                Join an upcoming contest on LeetCode. Once rating calculations finalize (usually Wednesday post-contest), your full rating trajectory and telemetry will appear here.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={() => loadContestData(true)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-[12px] font-extrabold text-white transition hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
                >
                  <RotateCw className={`h-3.5 w-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync Contest Telemetry'}
                </button>
                <a
                  href="https://leetcode.com/contest/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-4 py-2.5 text-[12px] font-bold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800 transition"
                >
                  View LeetCode Contests <span className="text-xs">↗</span>
                </a>
              </div>

              {syncNotice && (
                <p className={`mt-3 text-[11px] font-mono ${syncNotice.type === 'error' ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {syncNotice.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 font-sans dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Navigation Sidebar */}
      <Sidebar active={activeNav} setActive={setActiveNav} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashHeader user={user} stats={stats} />

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* ─────────────────────────────────────────────────────────────
              1. TOP KPI TELEMETRY RIBBON
              ───────────────────────────────────────────────────────────── */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
            {/* Ribbon Header bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-neutral-100 dark:border-neutral-800 gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <div>
                  <h1
                    className="text-[16px] font-extrabold tracking-tight text-neutral-900 dark:text-white leading-none"
                    style={{ color: isDarkMode ? '#ffffff' : undefined }}
                  >
                    Contest Executive Telemetry
                  </h1>
                  <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                    Handle: @{username} • {overview.attendedCount} rated events evaluated
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                {syncNotice && (
                  <span className={`text-[11px] font-mono ${syncNotice.type === 'error' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {syncNotice.text}
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => navigate('/contest-analysis/deep-dive')}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-900 bg-neutral-900 px-3.5 py-1.5 font-mono text-[11.5px] font-bold text-white shadow-xs transition hover:bg-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
                >
                  <Activity className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Deep Dive Autopsy ↗</span>
                </button>
                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={() => loadContestData(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 font-mono text-[11px] font-bold text-neutral-700 shadow-2xs transition hover:bg-white hover:border-neutral-300 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  <RotateCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync Telemetry'}
                </button>
              </div>
            </div>


            {/* KPI Telemetry 5-Column Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {/* Tile 1: Current Contest Rating */}
              <div className="rounded-lg border border-neutral-200/80 bg-neutral-50/50 p-3.5 dark:border-neutral-800 dark:bg-neutral-950/40">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                  Current Rating
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono text-[22px] font-extrabold text-neutral-900 dark:text-white tabular-nums">
                    {overview.currentRating.toLocaleString()}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded tabular-nums ${
                      overview.ratingDeltaDirection === 'UP'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                        : overview.ratingDeltaDirection === 'DOWN'
                        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
                  >
                    {overview.ratingDeltaDisplay}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 block">
                  Latest contest delta
                </span>
              </div>

              {/* Tile 2: Peak Rating */}
              <div className="rounded-lg border border-neutral-200/80 bg-neutral-50/50 p-3.5 dark:border-neutral-800 dark:bg-neutral-950/40">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                  Peak Rating
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono text-[22px] font-extrabold text-neutral-900 dark:text-white tabular-nums">
                    {overview.peakRating.toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 block font-mono">
                  Floor: {overview.lowestRating.toLocaleString()}
                </span>
              </div>

              {/* Tile 3: Contests Attended */}
              <div className="rounded-lg border border-neutral-200/80 bg-neutral-50/50 p-3.5 dark:border-neutral-800 dark:bg-neutral-950/40">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                  Attended Contests
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono text-[22px] font-extrabold text-neutral-900 dark:text-white tabular-nums">
                    {overview.attendedCount}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 block">
                  All-time rated events
                </span>
              </div>

              {/* Tile 4: Global Rank & Percentile */}
              <div className="rounded-lg border border-neutral-200/80 bg-neutral-50/50 p-3.5 dark:border-neutral-800 dark:bg-neutral-950/40">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                  Global Rank
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-mono text-[22px] font-extrabold text-neutral-900 dark:text-white tabular-nums truncate">
                    {overview.globalRankingFormatted}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 mt-1 block font-semibold">
                  {overview.topPercentageDisplay}
                </span>
              </div>

              {/* Tile 5: Official LeetCode Badge */}
              <div className="col-span-2 md:col-span-3 lg:col-span-1 rounded-lg border border-neutral-200/80 bg-neutral-50/50 p-3.5 dark:border-neutral-800 dark:bg-neutral-950/40">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">
                  Contest Badge
                </span>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-mono font-extrabold border ${badgeStyle.bg}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${badgeStyle.dot}`} />
                    {overview.badge}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 block">
                  LeetCode official tier
                </span>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              2. THE DUAL PERFORMANCE MATRICES (2-Column Grid)
              ───────────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT CARD: Rank Placement Distribution Matrix */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  <h2 className="text-[14px] font-bold text-neutral-900 dark:text-white">
                    Leaderboard Placement Matrix
                  </h2>
                </div>
                <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                  {rankMatrix.totalContests} events
                </span>
              </div>

              {/* Table / List of 4 Brackets */}
              <div className="space-y-4">
                {rankMatrix.brackets.map((b) => (
                  <div key={b.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[12px]">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${b.badgeClass}`}>
                          {b.label}
                        </span>
                        <span className="text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">
                          {b.range}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-neutral-900 dark:text-white tabular-nums">
                          {b.count}
                        </span>
                        <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 w-12 text-right tabular-nums">
                          {b.percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Precision horizontal proportion bar */}
                    <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${b.barClass}`}
                        style={{ width: `${Math.max(b.percentage > 0 ? 2 : 0, b.percentage)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Footnote summary */}
              <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
                <span>Highest Density:</span>
                <span className="font-bold text-neutral-700 dark:text-neutral-300">
                  {rankMatrix.brackets.reduce((max, b) => (b.count > max.count ? b : max), rankMatrix.brackets[0])?.label}
                </span>
              </div>
            </div>

            {/* RIGHT CARD: Lethality & Solve Ratio Matrix */}
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  <h2 className="text-[14px] font-bold text-neutral-900 dark:text-white">
                    Problem Solving Lethality Matrix
                  </h2>
                </div>
                <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                  Q1–Q4 Solve Ratios
                </span>
              </div>

              {/* Telemetry Grid for Tiers */}
              <div className="space-y-3">
                {solveMatrix.tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`flex items-center justify-between rounded-lg border p-2.5 transition-all duration-200 ${
                      tier.isAllKills
                        ? 'border-emerald-500/40 bg-emerald-500/5 dark:border-emerald-500/30 dark:bg-emerald-500/5'
                        : 'border-neutral-200/80 bg-neutral-50/40 dark:border-neutral-800 dark:bg-neutral-950/30'
                    }`}
                  >
                    {/* Left: Micro-bars & Label */}
                    <div className="flex items-center gap-3">
                      <MicroSolveBlocks
                        solvedCount={tier.solvedCount}
                        totalProblems={4}
                        isAllKills={tier.isAllKills}
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-extrabold font-mono text-neutral-900 dark:text-neutral-100">
                            {tier.label}
                          </span>
                          <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            ({tier.title})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Exact count & hit-rate percentage */}
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-[13px] text-neutral-900 dark:text-neutral-100 tabular-nums">
                        {tier.count}
                      </span>
                      <span
                        className={`font-mono text-[11px] font-bold px-1.5 py-0.5 rounded w-14 text-center tabular-nums ${tier.pillClass}`}
                      >
                        {tier.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clean Secondary Footnote for 0/4 Zero Solves (so sum is 100%) */}
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                  <span>Zero Solves (0/4):</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tabular-nums font-semibold text-neutral-600 dark:text-neutral-400">
                    {solveMatrix.zeroSolve.count} contests
                  </span>
                  <span>({solveMatrix.zeroSolve.percentage}%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              3. LEETCODE-STYLE RATING MOUNTAIN CHART (Full-Width Card)
              ───────────────────────────────────────────────────────────── */}
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
            {/* Chart Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-4 border-b border-neutral-100 dark:border-neutral-800 gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <h2 className="text-[14px] font-bold text-neutral-900 dark:text-white">
                    Rating Trajectory Mountain
                  </h2>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Chronological fluctuation curve across all {mountainData.length} attended contests
                </p>
              </div>

              {/* Legend & Key Threshold Indicators */}
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="text-neutral-600 dark:text-neutral-400">Knight: 1850</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="text-neutral-600 dark:text-neutral-400">Guardian: 2150</span>
                </div>
              </div>
            </div>

            {/* Recharts Area Chart Container */}
            <div className="h-[320px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={mountainData}
                  margin={{ top: 12, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="contestRatingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={isDarkMode ? '#34d399' : '#10b981'}
                        stopOpacity={0.28}
                      />
                      <stop
                        offset="95%"
                        stopColor={isDarkMode ? '#34d399' : '#10b981'}
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={isDarkMode ? '#262626' : '#f0f0f0'}
                  />

                  <XAxis
                    dataKey="shortDate"
                    stroke={isDarkMode ? '#525252' : '#a3a3a3'}
                    tick={{ fontSize: 10, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={{ stroke: isDarkMode ? '#262626' : '#e5e5e5' }}
                    minTickGap={28}
                  />

                  <YAxis
                    domain={[chartMin, chartMax]}
                    stroke={isDarkMode ? '#525252' : '#a3a3a3'}
                    tick={{ fontSize: 10, fontFamily: 'monospace' }}
                    tickLine={false}
                    axisLine={{ stroke: isDarkMode ? '#262626' : '#e5e5e5' }}
                    orientation="right"
                  />

                  <Tooltip content={<CustomContestTooltip />} />

                  {/* Reference line for Knight (1850) if relevant in domain */}
                  {chartMax >= 1700 && (
                    <ReferenceLine
                      y={1850}
                      stroke="#f59e0b"
                      strokeDasharray="4 4"
                      label={{
                        value: 'Knight (1850)',
                        fill: '#f59e0b',
                        fontSize: 10,
                        fontFamily: 'monospace',
                        position: 'insideTopLeft'
                      }}
                    />
                  )}

                  {/* Reference line for Guardian (2150) if relevant in domain */}
                  {chartMax >= 2000 && (
                    <ReferenceLine
                      y={2150}
                      stroke="#ef4444"
                      strokeDasharray="4 4"
                      label={{
                        value: 'Guardian (2150)',
                        fill: '#ef4444',
                        fontSize: 10,
                        fontFamily: 'monospace',
                        position: 'insideTopLeft'
                      }}
                    />
                  )}

                  {/* The Crisp Mountain Curve */}
                  <Area
                    type="monotone"
                    dataKey="rating"
                    stroke={isDarkMode ? '#34d399' : '#059669'}
                    strokeWidth={2}
                    fill="url(#contestRatingGrad)"
                    dot={{
                      r: 2,
                      fill: isDarkMode ? '#34d399' : '#059669',
                      strokeWidth: 0
                    }}
                    activeDot={{
                      r: 5,
                      fill: isDarkMode ? '#34d399' : '#059669',
                      stroke: isDarkMode ? '#171717' : '#ffffff',
                      strokeWidth: 2
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

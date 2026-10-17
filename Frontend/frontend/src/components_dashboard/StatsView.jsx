import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  RotateCw,
  Check,
  AlertCircle,
  Flame,
  Zap,
  TrendingUp,
  Target,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react'
import { calculateRank } from '../utils/rankings.js'
import { analyzeTopics } from '../utils/topicData.js'
import { normalizeProfileData, formatGraphQLResponse } from '../utils/profileData.js'
import BadgeImage from '../components_profileAnalyses/BadgeImage.jsx'

const DIRECT_STATS_QUERY = `
query getUserFullStats($username: String!) {
  allQuestionsCount {
    difficulty
    count
  }
  matchedUser(username: $username) {
    profile {
      ranking
      userAvatar
      realName
      aboutMe
    }
    problemsSolvedBeatsStats {
      difficulty
      percentage
    }
    submitStatsGlobal {
      acSubmissionNum { difficulty count submissions }
      totalSubmissionNum { difficulty count submissions }
    }
    userCalendar {
      activeYears
      streak
      totalActiveDays
      submissionCalendar
    }
    activeBadge {
      id
      name
      displayName
      icon
    }
    badges {
      id
      name
      shortName
      displayName
      icon
      hoverText
      creationDate
      category
    }
    tagProblemCounts {
      fundamental { tagName problemsSolved }
      intermediate { tagName problemsSolved }
      advanced { tagName problemsSolved }
    }
  }
}
`

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// ── Year Heatmap Component ─────────────────────────────────────────────────
function ActivityHeatmap({ calendar, selectedYear }) {
  // Compute submissions for each day of the selectedYear
  const { monthData, yearTotalSubmissions } = useMemo(() => {
    const dayMap = {}
    let totalSubs = 0

    if (calendar && typeof calendar === 'object') {
      const entries = calendar instanceof Map ? Array.from(calendar.entries()) : Object.entries(calendar)
      for (const [key, count] of entries) {
        const ts = Number(key)
        if (isNaN(ts) || ts <= 0) continue
        const d = new Date(ts * 1000)
        if (d.getFullYear() === selectedYear) {
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
          const c = Number(count)
          dayMap[dateStr] = (dayMap[dateStr] || 0) + c
          totalSubs += c
        }
      }
    }

    // Build month-by-month grid
    const now = new Date()
    const months = []

    for (let m = 0; m < 12; m++) {
      const firstDayOfMonth = new Date(selectedYear, m, 1)
      const lastDayOfMonth = new Date(selectedYear, m + 1, 0)
      const startDayOfWeek = firstDayOfMonth.getDay() // 0 = Sun
      const totalDays = lastDayOfMonth.getDate()

      const weeks = []
      let currentWeek = new Array(startDayOfWeek).fill(null)

      for (let day = 1; day <= totalDays; day++) {
        const d = new Date(selectedYear, m, day)
        const dateStr = `${selectedYear}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const count = dayMap[dateStr] || 0
        const isFuture = d > now

        currentWeek.push({
          dateStr,
          day,
          count,
          isFuture
        })

        if (currentWeek.length === 7) {
          weeks.push(currentWeek)
          currentWeek = []
        }
      }

      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
          currentWeek.push(null)
        }
        weeks.push(currentWeek)
      }

      months.push({
        monthName: MONTH_NAMES[m],
        monthIndex: m,
        weeks
      })
    }

    return { monthData: months, yearTotalSubmissions: totalSubs }
  }, [calendar, selectedYear])

  const getCellColor = (day) => {
    if (!day) return 'opacity-0 pointer-events-none'
    if (day.isFuture) return 'bg-neutral-100 dark:bg-neutral-800/40 opacity-40'
    if (day.count === 0) return 'bg-neutral-200/60 dark:bg-neutral-800'
    if (day.count <= 2) return 'bg-emerald-200 dark:bg-emerald-950/80'
    if (day.count <= 4) return 'bg-emerald-400 dark:bg-emerald-800'
    if (day.count <= 7) return 'bg-emerald-500 dark:bg-emerald-600'
    return 'bg-emerald-600 dark:bg-emerald-500'
  }

  return {
    yearTotalSubmissions,
    renderHeatmap: (
      <div className="overflow-x-auto pb-2">
        <div className="min-w-[760px]">
          {/* Months Grid */}
          <div className="flex gap-2.5 items-start">
            {monthData.map((m) => (
              <div key={m.monthName} className="flex flex-col items-center">
                {/* Week Columns */}
                <div className="flex gap-[3px]">
                  {m.weeks.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px]">
                      {week.map((day, di) => (
                        <div
                          key={di}
                          title={day ? `${day.dateStr}: ${day.count} submission${day.count === 1 ? '' : 's'}` : ''}
                          className={`h-[11px] w-[11px] rounded-[2px] transition-transform hover:scale-125 ${getCellColor(day)}`}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                {/* Month Name */}
                <span className="mt-2 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                  {m.monthName}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-end gap-1.5 text-[11px] text-neutral-500 dark:text-neutral-400">
            <span>Less</span>
            <span className="h-[10px] w-[10px] rounded-[2px] bg-neutral-200/60 dark:bg-neutral-800" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-emerald-200 dark:bg-emerald-950/80" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-emerald-400 dark:bg-emerald-800" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-emerald-500 dark:bg-emerald-600" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-emerald-600 dark:bg-emerald-500" />
            <span>More</span>
          </div>
        </div>
      </div>
    )
  }
}

// ── Main StatsView (Dashboard Action Hub) ───────────────────────────────────
export default function StatsView({ stats, onStatsUpdate }) {
  const navigate = useNavigate()

  // 1. Normalize data structure to ensure 100% contract compatibility
  const profileData = useMemo(() => normalizeProfileData(stats), [stats])

  const username = profileData?.username || 'user'
  const s = profileData?.stats || {}
  const act = profileData?.activity || {}
  const badges = profileData?.badges || []
  const activeBadge = profileData?.activeBadge || badges[0]
  const profileMeta = profileData?.profile || {}
  const calendar = useMemo(() => profileData?.submissionCalendar || {}, [profileData?.submissionCalendar])

  // Refresh & Sync states
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [recentlyUpdated, setRecentlyUpdated] = useState(false)
  const [refreshNotice, setRefreshNotice] = useState(null)
  const [lastRefreshedAt, setLastRefreshedAt] = useState(() => new Date())

  // Countdown timer for cooldown
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 1 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  // Clear notice after 4 seconds
  useEffect(() => {
    if (!refreshNotice) return
    const timer = setTimeout(() => setRefreshNotice(null), 4000)
    return () => clearTimeout(timer)
  }, [refreshNotice])

  const [lastSyncedLabel, setLastSyncedLabel] = useState('Just now')

  useEffect(() => {
    const updateLabel = () => {
      if (!lastRefreshedAt) {
        setLastSyncedLabel('Live Sync')
        return
      }
      const diffSec = Math.floor((Date.now() - lastRefreshedAt.getTime()) / 1000)
      if (diffSec < 60) {
        setLastSyncedLabel('Just now')
      } else {
        const diffMin = Math.floor(diffSec / 60)
        setLastSyncedLabel(`${diffMin}m ago`)
      }
    }

    updateLabel()
    const interval = setInterval(updateLabel, 30000)
    return () => clearInterval(interval)
  }, [lastRefreshedAt])

  const handleRefresh = async () => {
    if (isRefreshing || cooldown > 0) return

    setIsRefreshing(true)
    setRefreshNotice(null)

    try {
      const authToken = localStorage.getItem('accessToken') || localStorage.getItem('lb_token')
      let refreshedData = null

      // 1. First attempt: Dedicated Backend Refresh Endpoint (/api/leetcode/refresh)
      try {
        const res = await fetch('/api/leetcode/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
          },
          body: JSON.stringify({ username })
        })

        if (res.ok) {
          const result = await res.json()
          if (result?.profile) {
            refreshedData = {
              username: result.username || username,
              profile: result.profile
            }
          }
          if (result?.contest) {
            try {
              localStorage.setItem('lb_contest', JSON.stringify(result.contest))
              window.dispatchEvent(new CustomEvent('lb_contest_updated', { detail: result.contest }))
            } catch (e) {
              console.warn('LocalStorage contest save error', e)
            }
          }
        } else if (res.status === 429) {
          const errRes = await res.json()
          const waitSec = errRes.cooldownSeconds || 10
          setCooldown(waitSec)
          setRefreshNotice({ type: 'warning', text: errRes.error || `Cooldown active: wait ${waitSec}s` })
          setIsRefreshing(false)
          return
        }
      } catch (backendErr) {
        console.warn('Backend refresh failed, trying proxy fallback:', backendErr)
      }

      // 2. Fallback: Query /leetcode-proxy directly with full data formatting
      if (!refreshedData) {
        const proxyRes = await fetch('/leetcode-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: DIRECT_STATS_QUERY,
            variables: { username }
          })
        })

        if (proxyRes.ok) {
          const gqlData = await proxyRes.json()
          const matchedUser = gqlData?.data?.matchedUser
          if (matchedUser) {
            const formatted = formatGraphQLResponse(matchedUser, gqlData?.data?.allQuestionsCount || [])
            refreshedData = { username, profile: formatted }
          }
        }
      }

      if (refreshedData) {
        setCooldown(12)
        setLastRefreshedAt(new Date())
        setRecentlyUpdated(true)
        setTimeout(() => setRecentlyUpdated(false), 3000)

        // Update localStorage and trigger global notification
        localStorage.setItem('lb_stats', JSON.stringify(refreshedData))
        if (onStatsUpdate) {
          onStatsUpdate(refreshedData)
        }
        window.dispatchEvent(new CustomEvent('lb_stats_updated', { detail: refreshedData }))

        const points = refreshedData.profile?.stats?.leetBuddyPoints ?? 0
        const solved = refreshedData.profile?.stats?.totalSolved ?? 0

        setRefreshNotice({
          type: 'success',
          text: `Synced! ${solved} solved (${points.toLocaleString()} pts)`
        })
      } else {
        setRefreshNotice({ type: 'error', text: 'Could not fetch fresh data. Please try again.' })
      }
    } catch (err) {
      console.error('Refresh error:', err)
      setRefreshNotice({ type: 'error', text: 'Failed to sync with LeetCode. Check connection.' })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Available active years from calendar or default to current year
  const currentYear = new Date().getFullYear()
  const activeYears = act.activeYears
  const availableYears = useMemo(() => {
    if (activeYears && activeYears.length > 0) {
      return [...activeYears].sort((a, b) => b - a)
    }
    return [currentYear]
  }, [activeYears, currentYear])

  const [selectedYear, setSelectedYear] = useState(availableYears[0] || currentYear)

  const { yearTotalSubmissions, renderHeatmap } = ActivityHeatmap({
    calendar,
    selectedYear
  })

  // ── Topic Mastery Analysis with Normalized Profile Contract ─────────────
  const analyzedTopics = useMemo(() => {
    return analyzeTopics(profileData)
  }, [profileData])

  const weakTopics = useMemo(() => {
    return analyzedTopics.filter((t) => t.tierType === 'weak')
  }, [analyzedTopics])

  const proficientTopics = useMemo(() => {
    return analyzedTopics.filter((t) => t.tierType === 'strong')
  }, [analyzedTopics])

  // Top 3 priority focus areas: prioritize foundational & intermediate weak areas
  const topFocusTopics = useMemo(() => {
    return [...weakTopics]
      .sort((a, b) => {
        const catScore = { fundamental: 3, intermediate: 2, advanced: 1 }
        const aScore = catScore[a.category] || 1
        const bScore = catScore[b.category] || 1
        if (aScore !== bScore) return bScore - aScore
        return a.volume - b.volume
      })
      .slice(0, 3)
  }, [weakTopics])

  const masteryPercentage = useMemo(() => {
    const total = analyzedTopics.length
    if (!total) return 0
    return Math.round((proficientTopics.length / total) * 100)
  }, [analyzedTopics.length, proficientTopics.length])

  // ── 7-Day Velocity & Recent Activity Calendar Calculations ───────────────
  const { sevenDaySubmissions, sevenDayActiveDays, last7DaysList, recentActiveDays } = useMemo(() => {
    if (!calendar || Object.keys(calendar).length === 0) {
      return { sevenDaySubmissions: 0, sevenDayActiveDays: 0, last7DaysList: [], recentActiveDays: [] }
    }

    const entries = calendar instanceof Map ? Array.from(calendar.entries()) : Object.entries(calendar)
    const dayMap = {}
    const activeDates = []

    for (const [key, count] of entries) {
      const ts = Number(key)
      if (isNaN(ts) || ts <= 0) continue
      const d = new Date(ts * 1000)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const c = Number(count)
      dayMap[dateStr] = (dayMap[dateStr] || 0) + c
      activeDates.push({ date: d, dateStr, count: c, timestamp: ts })
    }

    activeDates.sort((a, b) => b.timestamp - a.timestamp)
    const recentActiveDays = activeDates.slice(0, 5)

    const today = new Date()
    const last7DaysList = []
    let sevenDaySubmissions = 0
    let sevenDayActiveDays = 0

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const count = dayMap[dateStr] || 0
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
      if (count > 0) {
        sevenDaySubmissions += count
        sevenDayActiveDays += 1
      }
      last7DaysList.push({
        dateStr,
        dayName,
        count,
        isToday: i === 0
      })
    }

    return {
      sevenDaySubmissions,
      sevenDayActiveDays,
      last7DaysList,
      recentActiveDays
    }
  }, [calendar])

  const max7DayCount = useMemo(() => {
    const counts = last7DaysList.map((d) => d.count)
    return Math.max(...counts, 1)
  }, [last7DaysList])

  const currentRank = calculateRank(s?.leetBuddyPoints ?? 3250)

  return (
    <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
      {/* ── Top Header Bar ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Profile Group */}
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          {/* 1. Profile Photo */}
          <div className="relative shrink-0">
            {profileMeta?.userAvatar ? (
              <img
                src={profileMeta.userAvatar}
                alt={username}
                className="h-12 w-12 sm:h-13 sm:w-13 rounded-full border-2 border-neutral-200 object-cover shadow-xs dark:border-neutral-700"
              />
            ) : (
              <div className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-neutral-900 text-base font-bold text-white shadow-xs dark:bg-neutral-100 dark:text-neutral-900">
                {username.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* 2. Grindmaster Badge */}
          <div
            className="shrink-0 flex items-center justify-center transition-transform hover:scale-105"
            title={`Tier ${currentRank.tier}: ${currentRank.title}`}
          >
            <BadgeImage tier={currentRank.tier || 7} size="md" />
          </div>

          {/* 3. Name & Tier Info */}
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 truncate">
                @{username}
              </h2>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                Verified
              </span>
              <span
                className="rounded-md px-2 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-wide shrink-0 border shadow-xs"
                style={{
                  backgroundColor: `${currentRank.color}15`,
                  borderColor: `${currentRank.color}35`,
                  color: currentRank.color,
                }}
              >
                {currentRank.title}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
              {profileMeta?.realName || 'LeetCode Competitive Programmer'} • Rank #{profileMeta?.ranking?.toLocaleString() || 'N/A'}
            </p>
          </div>
        </div>

        {/* Right Side: Refresh Button + LeetBuddy Score Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-start sm:self-auto">
          {/* 🔄 Optimized Refresh Button */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing || cooldown > 0}
            title={cooldown > 0 ? `Please wait ${cooldown}s before refreshing again` : "Sync latest stats from LeetCode GraphQL"}
            className={`
              relative flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs font-semibold
              transition-all duration-200 select-none shadow-xs group
              ${isRefreshing
                ? 'border-neutral-300 bg-neutral-100 text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-500 cursor-not-allowed'
                : cooldown > 0
                ? 'border-neutral-200 bg-neutral-50 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-500 cursor-not-allowed'
                : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700 active:scale-95 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-neutral-700 dark:hover:bg-neutral-800'
              }
            `}
          >
            <RotateCw
              className={`h-4 w-4 shrink-0 transition-transform duration-500 ${
                isRefreshing ? 'animate-spin text-emerald-500' : 'text-neutral-500 group-hover:text-emerald-500 dark:text-neutral-400'
              }`}
            />
            <div className="flex flex-col items-start text-left leading-tight">
              <span className="font-bold text-[12px] text-neutral-900 dark:text-neutral-100">
                {isRefreshing ? 'Syncing...' : cooldown > 0 ? `Wait ${cooldown}s` : 'Refresh'}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                {isRefreshing ? 'GraphQL query' : lastSyncedLabel || 'Live Sync'}
              </span>
            </div>

            {/* Success Pulse Dot */}
            {recentlyUpdated && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            )}
          </button>

          {/* LeetBuddy Points Badge */}
          <div className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-right shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
            <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              LeetBuddy Score
            </p>
            <p className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
              {(s?.leetBuddyPoints || 0).toLocaleString()} <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">pts</span>
            </p>
          </div>
        </div>
      </div>

      {/* Optional Refresh Status Banner */}
      {refreshNotice && (
        <div
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold shadow-xs transition-all animate-in fade-in slide-in-from-top-1 ${
            refreshNotice.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : refreshNotice.type === 'warning'
              ? 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
              : 'bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800'
          }`}
        >
          {refreshNotice.type === 'success' ? (
            <Check className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          )}
          <span>{refreshNotice.text}</span>
        </div>
      )}

      {/* ── Daily Action Grid (4 Key Metrics) ──────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Active Streak */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4.5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Active Streak
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
              <Flame className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
              {act?.currentStreak || 0}
            </span>
            <span className="font-mono text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              days
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-neutral-500 dark:text-neutral-400">Total Active</span>
            <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
              {act?.totalActiveDays || 0} days
            </span>
          </div>
        </div>

        {/* Card 2: Priority Weak Topics */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4.5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Weak Topics
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Zap className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-rose-600 dark:text-rose-400">
              {weakTopics.length}
            </span>
            <span className="font-mono text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              areas
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-neutral-500 dark:text-neutral-400">Criteria</span>
            <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
              &lt;5 solved / &lt;40% acc
            </span>
          </div>
        </div>

        {/* Card 3: 7-Day Velocity */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4.5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              7-Day Velocity
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
              {sevenDaySubmissions}
            </span>
            <span className="font-mono text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              subs
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-neutral-500 dark:text-neutral-400">Weekly Consistency</span>
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
              {sevenDayActiveDays} of 7 days
            </span>
          </div>
        </div>

        {/* Card 4: Topic Mastery Index */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-4.5 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Topic Mastery
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Target className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
              {masteryPercentage}%
            </span>
            <span className="font-mono text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              proficient
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <span className="text-neutral-500 dark:text-neutral-400">Mastered Tier</span>
            <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
              {proficientTopics.length} / {analyzedTopics.length} topics
            </span>
          </div>
        </div>
      </div>

      {/* ── Today's Priority Focus (Targeted Practice Action) ─────────── */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[16px] font-bold text-neutral-900 dark:text-neutral-100">
                Today's Priority Focus
              </h3>
              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-600 dark:text-rose-400">
                {weakTopics.length} weak areas
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              High-leverage topics where volume deficit or low accuracy limits your competitive rating
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/topic-mastery')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700/80 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            <span>Open Topic Mastery</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* 3 Actionable Weak Topic Cards */}
        {topFocusTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {topFocusTopics.map((topic) => (
              <div
                key={topic.name}
                className="flex flex-col justify-between rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-extrabold text-[15px] text-neutral-900 dark:text-neutral-100 truncate">
                      {topic.name}
                    </span>
                    <span className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase font-bold tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                      {topic.category}
                    </span>
                  </div>

                  <div className="mb-3">
                    <span className="inline-block rounded-md bg-rose-500/10 px-2 py-1 font-mono text-[11px] font-semibold text-rose-700 dark:text-rose-400">
                      {topic.tierReason}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    {topic.diagnostic}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-200/70 dark:border-neutral-800/80 flex items-center justify-between gap-2">
                  <div className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="font-bold text-neutral-900 dark:text-neutral-200">{topic.volume}</span> solved • <span className="font-bold text-neutral-900 dark:text-neutral-200">{topic.accuracy}%</span> acc
                  </div>
                  <a
                    href={topic.practiceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white active:scale-95 transition-all duration-150 shadow-2xs"
                  >
                    <span>Practice</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-6 text-center dark:border-neutral-800 dark:bg-neutral-950/40">
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              🎉 No critical weak topics detected!
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              You've satisfied minimum volume and accuracy across active categories. Check Developing topics in Topic Mastery.
            </p>
          </div>
        )}
      </div>

      {/* ── Activity & Consistency Section (GitHub Heatmap) ────────────── */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-colors">
        {/* Header with Year Selector */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-[16px] font-bold text-neutral-900 dark:text-neutral-100">
              Activity & Consistency
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Submission frequency and discipline calendar
            </p>
          </div>

          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            aria-label="Select Year"
            className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-1 font-mono text-xs font-bold text-neutral-900 outline-none cursor-pointer transition hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:border-neutral-500"
          >
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Stat Pills & Badges Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3.5 mb-6">
          {/* Active Streak */}
          <div className="flex items-center gap-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/70 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-lg">
              🔥
            </span>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                ACTIVE STREAK
              </p>
              <p className="text-[17px] font-extrabold text-orange-600 dark:text-orange-400">
                {act?.currentStreak || 0} Days
              </p>
            </div>
          </div>

          {/* Active Days */}
          <div className="flex items-center gap-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/70 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-lg">
              📅
            </span>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                ACTIVE DAYS
              </p>
              <p className="text-[17px] font-extrabold text-blue-600 dark:text-blue-400">
                {act?.totalActiveDays || 0} Days
              </p>
            </div>
          </div>

          {/* Year Submissions */}
          <div className="flex items-center gap-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/70 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-lg">
              ✅
            </span>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                YEAR {selectedYear}
              </p>
              <p className="text-[17px] font-extrabold text-emerald-600 dark:text-emerald-400">
                {yearTotalSubmissions.toLocaleString()} Submissions
              </p>
            </div>
          </div>

          {/* Badges Box */}
          <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                {badges.length} Badges Earned
              </span>
              <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400">🏅</span>
            </div>
            {/* Badges Icons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {badges.slice(0, 6).map((b, i) => (
                <img
                  key={i}
                  src={b.icon}
                  alt={b.name}
                  title={b.name}
                  className="h-7 w-7 rounded-full object-contain shrink-0 bg-neutral-900/5 dark:bg-white/5 p-0.5"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              ))}
            </div>
            {activeBadge && (
              <div className="mt-1">
                <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  MOST RECENT BADGE
                </span>
                <span className="font-bold text-xs text-orange-600 dark:text-orange-400 truncate block">
                  {activeBadge.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contribution Heatmap */}
        {renderHeatmap}
      </div>

      {/* ── 7-Day Velocity & Recent Activity (Action Pulse) ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: 7-Day Velocity Rhythm */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-bold text-neutral-900 dark:text-neutral-100">
                7-Day Velocity
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Submissions pace over the past 7 days
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              {sevenDaySubmissions} total
            </span>
          </div>

          {/* Mini Daily Bars */}
          <div className="grid grid-cols-7 gap-2 items-end pt-3 h-32">
            {last7DaysList.map((day) => {
              const heightPct = day.count > 0 ? Math.max(18, Math.round((day.count / max7DayCount) * 100)) : 8
              return (
                <div key={day.dateStr} className="flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer">
                  <span className="font-mono text-[10px] font-bold text-neutral-500 dark:text-neutral-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {day.count > 0 ? day.count : '-'}
                  </span>
                  <div className="w-full max-w-[28px] h-20 rounded-lg bg-neutral-100 dark:bg-neutral-800/80 flex items-end overflow-hidden p-0.5 group-hover:ring-1 group-hover:ring-emerald-500/40 transition-all">
                    <div
                      className={`w-full rounded-md transition-all duration-300 group-hover:brightness-110 ${
                        day.count > 0
                          ? day.isToday
                            ? 'bg-emerald-500'
                            : 'bg-neutral-900 dark:bg-neutral-200'
                          : 'bg-transparent'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`${day.dateStr}: ${day.count} submissions`}
                    />
                  </div>
                  <span
                    className={`font-mono text-[10px] uppercase font-bold transition-colors ${
                      day.isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'
                    }`}
                  >
                    {day.dayName}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Recent Activity Log */}
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[15px] font-bold text-neutral-900 dark:text-neutral-100">
                Recent Activity Log
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Latest problem-solving sessions from your calendar
              </p>
            </div>
            <span className="font-mono text-[11px] text-neutral-400">
              Last 5 active days
            </span>
          </div>

          {recentActiveDays.length > 0 ? (
            <div className="space-y-2.5">
              {recentActiveDays.map((item, idx) => (
                <div
                  key={item.dateStr || idx}
                  className="flex items-center justify-between rounded-xl border border-neutral-100 bg-neutral-50/70 px-3.5 py-2.5 dark:border-neutral-800/60 dark:bg-neutral-950/40 transition-all duration-150 hover:bg-neutral-100/90 dark:hover:bg-neutral-900/90"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                        {new Date(item.timestamp * 1000).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                        {item.count} submission{item.count === 1 ? '' : 's'} recorded
                      </p>
                    </div>
                  </div>
                  <span className="rounded bg-neutral-200/60 px-2 py-0.5 font-mono text-[10px] font-bold text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    +{item.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-xs text-neutral-400 font-mono">
              No recent submissions recorded yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

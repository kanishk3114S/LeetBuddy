import { useState, useMemo } from 'react'
import { calculateRank } from '../utils/rankings.js'
import BadgeImage from '../components_profileAnalyses/BadgeImage.jsx'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// ── Year Heatmap Component ─────────────────────────────────────────────────
function ActivityHeatmap({ calendar, selectedYear }) {
  // Compute submissions for each day of the selectedYear
  const { monthData, yearTotalSubmissions } = useMemo(() => {
    const dayMap = {}
    let totalSubs = 0

    if (calendar) {
      const entries = calendar instanceof Map ? Array.from(calendar.entries()) : Object.entries(calendar)
      for (const [key, count] of entries) {
        const ts = Number(key)
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
    if (day.count <= 2) return 'bg-[#9be9a8] dark:bg-[#1e4620]'
    if (day.count <= 4) return 'bg-[#40c463] dark:bg-[#2e7d32]'
    if (day.count <= 7) return 'bg-[#30a14e] dark:bg-[#388e3c]'
    return 'bg-[#216e39] dark:bg-[#4caf50]'
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
            <span className="h-[10px] w-[10px] rounded-[2px] bg-[#9be9a8] dark:bg-[#1e4620]" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-[#40c463] dark:bg-[#2e7d32]" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-[#30a14e] dark:bg-[#388e3c]" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-[#216e39] dark:bg-[#4caf50]" />
            <span>More</span>
          </div>
        </div>
      </div>
    )
  }
}

// ── Difficulty Progress Card ──────────────────────────────────────────────
function DifficultyBreakdown({ stats, allQuestionsCount, beatsStats }) {
  const easySolved = stats?.easySolved || 0
  const medSolved = stats?.mediumSolved || 0
  const hardSolved = stats?.hardSolved || 0
  const totalSolved = stats?.totalSolved || 0

  const totalAll = allQuestionsCount?.all || 4082
  const totalEasy = allQuestionsCount?.easy || 971
  const totalMed = allQuestionsCount?.medium || 2128
  const totalHard = allQuestionsCount?.hard || 983

  const pct = totalAll > 0 ? ((totalSolved / totalAll) * 100).toFixed(1) : 0

  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-colors">
      <h3 className="text-[15px] font-bold text-neutral-900 dark:text-neutral-100 mb-4">
        Solved Problems
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Left: Circular Donut Ring */}
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 pb-4 md:pb-0 md:pr-4">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                className="text-neutral-200 dark:text-neutral-800"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * Number(pct)) / 100}
                strokeLinecap="round"
                className="text-emerald-500 transition-all duration-1000"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-[22px] font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
                {totalSolved}
              </span>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                /{totalAll} Solved
              </p>
            </div>
          </div>
          <span className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            {pct}% Complete
          </span>
        </div>

        {/* Right 3: Easy, Medium, Hard Progress Bars */}
        <div className="md:col-span-3 space-y-3.5">
          {/* Easy */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Easy</span>
              <div className="flex items-center gap-2">
                {beatsStats?.easy > 0 && (
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Beats {beatsStats.easy.toFixed(1)}%
                  </span>
                )}
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {easySolved} <span className="font-normal text-neutral-500 dark:text-neutral-400">/{totalEasy}</span>
                </span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${Math.min(100, (easySolved / totalEasy) * 100)}%` }}
              />
            </div>
          </div>

          {/* Medium */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-500 dark:text-amber-400">Medium</span>
              <div className="flex items-center gap-2">
                {beatsStats?.medium > 0 && (
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    Beats {beatsStats.medium.toFixed(1)}%
                  </span>
                )}
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {medSolved} <span className="font-normal text-neutral-500 dark:text-neutral-400">/{totalMed}</span>
                </span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-700"
                style={{ width: `${Math.min(100, (medSolved / totalMed) * 100)}%` }}
              />
            </div>
          </div>

          {/* Hard */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-500 dark:text-rose-400">Hard</span>
              <div className="flex items-center gap-2">
                {beatsStats?.hard > 0 && (
                  <span className="rounded bg-rose-500/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                    Beats {beatsStats.hard.toFixed(1)}%
                  </span>
                )}
                <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                  {hardSolved} <span className="font-normal text-neutral-500 dark:text-neutral-400">/{totalHard}</span>
                </span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div
                className="h-full rounded-full bg-rose-500 transition-all duration-700"
                style={{ width: `${Math.min(100, (hardSolved / totalHard) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main StatsView Component ───────────────────────────────────────────────
export default function StatsView({ stats }) {
  const profileData = stats?.profile || {}
  const username = stats?.username || 'user'

  const s = profileData?.stats || {}
  const act = profileData?.activity || {}
  const badges = profileData?.badges || []
  const activeBadge = profileData?.activeBadge || badges[0]
  const allQ = profileData?.allQuestionsCount || {}
  const beats = profileData?.beatsStats || {}

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
  const [topicFilter, setTopicFilter] = useState('all')

  const { yearTotalSubmissions, renderHeatmap } = ActivityHeatmap({
    calendar: profileData?.submissionCalendar,
    selectedYear
  })

  // Filter topics
  const rawTopics = profileData?.topics
  const filteredTopics = useMemo(() => {
    const list = (rawTopics || []).filter(t => t.problemsSolved > 0)
    if (topicFilter !== 'all') {
      return list.filter(t => t.category === topicFilter).sort((a, b) => b.problemsSolved - a.problemsSolved)
    }
    return list.sort((a, b) => b.problemsSolved - a.problemsSolved)
  }, [rawTopics, topicFilter])

  const maxTopicSolved = filteredTopics[0]?.problemsSolved || 1

  const currentRank = calculateRank(s?.leetBuddyPoints ?? 3250)

  return (
    <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
      {/* ── Top Header Bar ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Profile Group: Photo + Space + Grindmaster Badge + Space + Name (Zero overlapping) */}
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          {/* 1. Profile Photo */}
          <div className="relative shrink-0">
            {profileData?.profile?.userAvatar ? (
              <img
                src={profileData.profile.userAvatar}
                alt={username}
                className="h-12 w-12 sm:h-13 sm:w-13 rounded-full border-2 border-neutral-200 object-cover shadow-xs dark:border-neutral-700"
              />
            ) : (
              <div className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-neutral-900 text-base font-bold text-white shadow-xs dark:bg-neutral-100 dark:text-neutral-900">
                {username.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          {/* 2. Space AND the Grindmaster Badge (Separate element with dedicated space, no overlap) */}
          <div
            className="shrink-0 flex items-center justify-center transition-transform hover:scale-105"
            title={`Tier ${currentRank.tier}: ${currentRank.title}`}
          >
            <BadgeImage tier={currentRank.tier || 7} size="md" />
          </div>

          {/* 3. Space AND then Profile Name */}
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
              {profileData?.profile?.realName || 'LeetCode Competitive Programmer'} • Rank #{profileData?.profile?.ranking?.toLocaleString() || 'N/A'}
            </p>
          </div>
        </div>

        {/* LeetBuddy Points Badge - Clean Neutral Theme */}
        <div className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-right shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
          <p className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            LeetBuddy Score
          </p>
          <p className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
            {(s?.leetBuddyPoints || 0).toLocaleString()} <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">pts</span>
          </p>
        </div>
      </div>

      {/* ── Activity & Streak Section ──────────────────────────────────── */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-colors">
        {/* Header with Year Selector */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-bold text-neutral-900 dark:text-neutral-100">
            Activity & Streak
          </h3>

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
          <div className="flex items-center gap-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/70 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-950/40">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-lg">
              🔥
            </span>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                ACTIVE STREAK
              </p>
              <p className="text-[17px] font-extrabold text-[#ea580c] dark:text-[#f97316]">
                {act?.currentStreak || 0} Days
              </p>
            </div>
          </div>

          {/* Active Days */}
          <div className="flex items-center gap-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/70 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-950/40">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-lg">
              📅
            </span>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                ACTIVE DAYS
              </p>
              <p className="text-[17px] font-extrabold text-[#2563eb] dark:text-[#3b82f6]">
                {act?.totalActiveDays || 0} Days
              </p>
            </div>
          </div>

          {/* Year Submissions */}
          <div className="flex items-center gap-3.5 rounded-xl border border-neutral-200/80 bg-neutral-50/70 px-4 py-3.5 dark:border-neutral-800 dark:bg-neutral-950/40">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-lg">
              ✅
            </span>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                YEAR {selectedYear}
              </p>
              <p className="text-[17px] font-extrabold text-[#16a34a] dark:text-[#22c55e]">
                {yearTotalSubmissions.toLocaleString()} Submissions
              </p>
            </div>
          </div>

          {/* Badges Box */}
          <div className="rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-950/40">
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
                <span className="font-bold text-xs text-[#ea580c] dark:text-[#f97316] truncate block">
                  {activeBadge.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contribution Heatmap */}
        {renderHeatmap}
      </div>

      {/* ── Solved Problems (Circular Donut + Breakdown) ────────────────── */}
      <DifficultyBreakdown
        stats={s}
        allQuestionsCount={allQ}
        beatsStats={beats}
      />

      {/* ── Submissions & Acceptance Stats ──────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-colors">
          <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">Total Submissions</p>
          <p className="mt-1 text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
            {(s?.totalSubmissions || 0).toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-colors">
          <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">Accepted Submissions</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {(s?.acceptedSubmissions || 0).toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-colors">
          <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">Acceptance Rate</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-500 dark:text-amber-400">
            {s?.acceptanceRate || 0}%
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200/80 bg-white p-4 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-colors">
          <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">Best Performing Day</p>
          <p className="mt-1 text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            {act?.bestPerformingDay?.submissionCount || 0} <span className="text-xs font-normal text-neutral-500">subs</span>
          </p>
          {act?.bestPerformingDay?.date && (
            <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              {new Date(act.bestPerformingDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>

      {/* ── Topic Performance ──────────────────────────────────────────── */}
      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900/90 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[15px] font-bold text-neutral-900 dark:text-neutral-100">
              Topic Performance
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Solved questions mapped across 41 competitive programming topics
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 rounded-lg border border-neutral-200 p-1 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800/60 text-xs">
            {['all', 'fundamental', 'intermediate', 'advanced'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setTopicFilter(cat)}
                className={`rounded px-2.5 py-1 capitalize font-medium transition ${
                  topicFilter === cat
                    ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 font-bold shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Topics List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          {filteredTopics.map((t) => {
            const pct = Math.round((t.problemsSolved / maxTopicSolved) * 100)
            const catBadgeColor =
              t.category === 'fundamental'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : t.category === 'intermediate'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'

            return (
              <div key={t.tagName} className="flex items-center gap-3">
                <span className="w-36 truncate text-xs font-medium text-neutral-900 dark:text-neutral-100">
                  {t.tagName}
                </span>
                <span className={`rounded px-1.5 py-0.2 font-mono text-[10px] capitalize shrink-0 ${catBadgeColor}`}>
                  {t.category[0]}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-neutral-900 dark:bg-neutral-100 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  {t.problemsSolved}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

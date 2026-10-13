import { useState, useMemo } from 'react'

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// ── Year Heatmap Component ─────────────────────────────────────────────────
function ActivityHeatmap({ calendar, selectedYear, isDarkMode }) {
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
    if (day.isFuture) return 'bg-[#f1f3f0] dark:bg-[#1a211c] opacity-40'
    if (day.count === 0) return 'bg-[#ebedf0] dark:bg-[#1f2822]'
    if (day.count <= 2) return 'bg-[#9be9a8] dark:bg-[#234c26]'
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
                <span className="mt-2 font-mono text-[11px] text-[#71787f] dark:text-[#8d988e]">
                  {m.monthName}
                </span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-end gap-1.5 text-[11px] text-[#71787f] dark:text-[#8d988e]">
            <span>Less</span>
            <span className="h-[10px] w-[10px] rounded-[2px] bg-[#ebedf0] dark:bg-[#1f2822]" />
            <span className="h-[10px] w-[10px] rounded-[2px] bg-[#9be9a8] dark:bg-[#234c26]" />
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
    <div className="rounded-[12px] border border-[#dce0dc] bg-white p-5 shadow-sm dark:border-[#2d3730] dark:bg-[#1a211d]">
      <h3 className="text-[15px] font-bold text-[#171a1d] dark:text-[#edf2ed] mb-4">
        Solved Problems
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        {/* Left: Circular Donut Ring */}
        <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#e3e5e1] dark:border-[#2d3730] pb-4 md:pb-0 md:pr-4">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                className="text-[#ebedf0] dark:text-[#28322a]"
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
                className="text-[#22c55e] transition-all duration-1000"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-[22px] font-extrabold tracking-tight text-[#171a1d] dark:text-[#edf2ed]">
                {totalSolved}
              </span>
              <p className="text-[10px] text-[#71787f] dark:text-[#8d988e] font-mono">
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
              <span className="font-bold text-[#22c55e]">Easy</span>
              <div className="flex items-center gap-2">
                {beatsStats?.easy > 0 && (
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Beats {beatsStats.easy.toFixed(1)}%
                  </span>
                )}
                <span className="font-mono font-bold text-[#171a1d] dark:text-[#edf2ed]">
                  {easySolved} <span className="font-normal text-[#71787f] dark:text-[#8d988e]">/{totalEasy}</span>
                </span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#ebedf0] dark:bg-[#28322a]">
              <div
                className="h-full rounded-full bg-[#22c55e] transition-all duration-700"
                style={{ width: `${Math.min(100, (easySolved / totalEasy) * 100)}%` }}
              />
            </div>
          </div>

          {/* Medium */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#f59e0b]">Medium</span>
              <div className="flex items-center gap-2">
                {beatsStats?.medium > 0 && (
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    Beats {beatsStats.medium.toFixed(1)}%
                  </span>
                )}
                <span className="font-mono font-bold text-[#171a1d] dark:text-[#edf2ed]">
                  {medSolved} <span className="font-normal text-[#71787f] dark:text-[#8d988e]">/{totalMed}</span>
                </span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#ebedf0] dark:bg-[#28322a]">
              <div
                className="h-full rounded-full bg-[#f59e0b] transition-all duration-700"
                style={{ width: `${Math.min(100, (medSolved / totalMed) * 100)}%` }}
              />
            </div>
          </div>

          {/* Hard */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#ef4444]">Hard</span>
              <div className="flex items-center gap-2">
                {beatsStats?.hard > 0 && (
                  <span className="rounded bg-red-500/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-red-600 dark:text-red-400">
                    Beats {beatsStats.hard.toFixed(1)}%
                  </span>
                )}
                <span className="font-mono font-bold text-[#171a1d] dark:text-[#edf2ed]">
                  {hardSolved} <span className="font-normal text-[#71787f] dark:text-[#8d988e]">/{totalHard}</span>
                </span>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#ebedf0] dark:bg-[#28322a]">
              <div
                className="h-full rounded-full bg-[#ef4444] transition-all duration-700"
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
  const topics = profileData?.topics || []
  const allQ = profileData?.allQuestionsCount || {}
  const beats = profileData?.beatsStats || {}

  // Available active years from calendar or default to current year
  const currentYear = new Date().getFullYear()
  const availableYears = useMemo(() => {
    if (act?.activeYears && act.activeYears.length > 0) {
      return [...act.activeYears].sort((a, b) => b - a)
    }
    return [currentYear]
  }, [act?.activeYears, currentYear])

  const [selectedYear, setSelectedYear] = useState(availableYears[0] || currentYear)
  const [topicFilter, setTopicFilter] = useState('all')

  const { yearTotalSubmissions, renderHeatmap } = ActivityHeatmap({
    calendar: profileData?.submissionCalendar,
    selectedYear
  })

  // Filter topics
  const filteredTopics = useMemo(() => {
    let list = topics.filter(t => t.problemsSolved > 0)
    if (topicFilter !== 'all') {
      list = list.filter(t => t.category === topicFilter)
    }
    return list.sort((a, b) => b.problemsSolved - a.problemsSolved)
  }, [topics, topicFilter])

  const maxTopicSolved = filteredTopics[0]?.problemsSolved || 1

  return (
    <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
      {/* ── Top Header Bar ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {profileData?.profile?.userAvatar ? (
            <img
              src={profileData.profile.userAvatar}
              alt={username}
              className="h-12 w-12 rounded-full border border-[#dce0dc] object-cover dark:border-[#38443b]"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#171a1d] text-base font-bold text-white dark:bg-[#c5ef75] dark:text-[#172011]">
              {username.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold tracking-tight text-[#171a1d] dark:text-[#edf2ed]">
                @{username}
              </h2>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                Verified
              </span>
            </div>
            <p className="text-xs text-[#71787f] dark:text-[#8d988e]">
              {profileData?.profile?.realName || 'LeetCode Competitive Programmer'} • Rank #{profileData?.profile?.ranking?.toLocaleString() || 'N/A'}
            </p>
          </div>
        </div>

        {/* LeetBuddy Points Badge */}
        <div className="rounded-xl border border-lime-500/30 bg-lime-500/10 px-4 py-2.5 text-right">
          <p className="font-mono text-[10px] uppercase tracking-wider text-lime-600 dark:text-lime-400">
            LeetBuddy Score
          </p>
          <p className="text-2xl font-extrabold tracking-tight text-[#171a1d] dark:text-[#c5ef75]">
            {(s?.leetBuddyPoints || 0).toLocaleString()} <span className="text-xs font-normal">pts</span>
          </p>
        </div>
      </div>

      {/* ── Activity & Streak Section (Matching Screenshot) ────────────── */}
      <div className="rounded-[12px] border border-[#dce0dc] bg-white p-5 shadow-sm dark:border-[#2d3730] dark:bg-[#1a211d]">
        {/* Header with Year Selector */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-bold text-[#171a1d] dark:text-[#edf2ed]">
            Activity & Streak
          </h3>

          {/* Year Dropdown */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            aria-label="Select Year"
            className="rounded-lg border border-[#dce0dc] bg-[#fbfdfa] px-3 py-1 font-mono text-xs font-bold text-[#171a1d] outline-none cursor-pointer transition hover:border-lime-500 dark:border-[#38443b] dark:bg-[#151c17] dark:text-[#edf2ed]"
          >
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Stat Pills & Badges Row */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3.5 mb-6">
          {/* Active Streak */}
          <div className="flex items-center gap-3.5 rounded-[10px] border border-[#e3e5e1] bg-[#fafbf9] px-4 py-3.5 dark:border-[#2d3730] dark:bg-[#141a16]">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500/10 text-lg">
              🔥
            </span>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#71787f] dark:text-[#8d988e]">
                ACTIVE STREAK
              </p>
              <p className="text-[17px] font-extrabold text-[#ea580c] dark:text-[#f97316]">
                {act?.currentStreak || 0} Days
              </p>
            </div>
          </div>

          {/* Active Days */}
          <div className="flex items-center gap-3.5 rounded-[10px] border border-[#e3e5e1] bg-[#fafbf9] px-4 py-3.5 dark:border-[#2d3730] dark:bg-[#141a16]">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-lg">
              📅
            </span>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#71787f] dark:text-[#8d988e]">
                ACTIVE DAYS
              </p>
              <p className="text-[17px] font-extrabold text-[#2563eb] dark:text-[#3b82f6]">
                {act?.totalActiveDays || 0} Days
              </p>
            </div>
          </div>

          {/* Year Submissions */}
          <div className="flex items-center gap-3.5 rounded-[10px] border border-[#e3e5e1] bg-[#fafbf9] px-4 py-3.5 dark:border-[#2d3730] dark:bg-[#141a16]">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-lg">
              ✅
            </span>
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#71787f] dark:text-[#8d988e]">
                YEAR {selectedYear}
              </p>
              <p className="text-[17px] font-extrabold text-[#16a34a] dark:text-[#22c55e]">
                {yearTotalSubmissions.toLocaleString()} Submissions
              </p>
            </div>
          </div>

          {/* Badges Box */}
          <div className="rounded-[10px] border border-[#e3e5e1] bg-[#fafbf9] p-3 dark:border-[#2d3730] dark:bg-[#141a16]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#171a1d] dark:text-[#edf2ed]">
                {badges.length} Badges Earned
              </span>
              <span className="font-mono text-[10px] text-[#71787f] dark:text-[#8d988e]">🏅</span>
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
                <span className="block font-mono text-[9px] uppercase tracking-wider text-[#71787f] dark:text-[#8d988e]">
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
        <div className="rounded-[10px] border border-[#dce0dc] bg-white p-4 dark:border-[#2d3730] dark:bg-[#1a211d]">
          <p className="font-mono text-[11px] text-[#71787f] dark:text-[#8d988e]">Total Submissions</p>
          <p className="mt-1 text-2xl font-extrabold text-[#171a1d] dark:text-[#edf2ed]">
            {(s?.totalSubmissions || 0).toLocaleString()}
          </p>
        </div>

        <div className="rounded-[10px] border border-[#dce0dc] bg-white p-4 dark:border-[#2d3730] dark:bg-[#1a211d]">
          <p className="font-mono text-[11px] text-[#71787f] dark:text-[#8d988e]">Accepted Submissions</p>
          <p className="mt-1 text-2xl font-extrabold text-[#22c55e]">
            {(s?.acceptedSubmissions || 0).toLocaleString()}
          </p>
        </div>

        <div className="rounded-[10px] border border-[#dce0dc] bg-white p-4 dark:border-[#2d3730] dark:bg-[#1a211d]">
          <p className="font-mono text-[11px] text-[#71787f] dark:text-[#8d988e]">Acceptance Rate</p>
          <p className="mt-1 text-2xl font-extrabold text-[#f59e0b]">
            {s?.acceptanceRate || 0}%
          </p>
        </div>

        <div className="rounded-[10px] border border-[#dce0dc] bg-white p-4 dark:border-[#2d3730] dark:bg-[#1a211d]">
          <p className="font-mono text-[11px] text-[#71787f] dark:text-[#8d988e]">Best Performing Day</p>
          <p className="mt-1 text-2xl font-extrabold text-[#a855f7]">
            {act?.bestPerformingDay?.submissionCount || 0} <span className="text-xs font-normal text-[#71787f]">subs</span>
          </p>
          {act?.bestPerformingDay?.date && (
            <p className="text-[11px] font-mono text-[#71787f] dark:text-[#8d988e]">
              {new Date(act.bestPerformingDay.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>

      {/* ── Topic Performance ──────────────────────────────────────────── */}
      <div className="rounded-[12px] border border-[#dce0dc] bg-white p-5 shadow-sm dark:border-[#2d3730] dark:bg-[#1a211d]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-[15px] font-bold text-[#171a1d] dark:text-[#edf2ed]">
              Topic Performance
            </h3>
            <p className="text-xs text-[#71787f] dark:text-[#8d988e]">
              Solved questions mapped across 41 competitive programming topics
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 rounded-lg border border-[#e3e5e1] p-1 bg-[#fafbf9] dark:border-[#2d3730] dark:bg-[#141a16] text-xs">
            {['all', 'fundamental', 'intermediate', 'advanced'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setTopicFilter(cat)}
                className={`rounded px-2.5 py-1 capitalize font-medium transition ${
                  topicFilter === cat
                    ? 'bg-[#171a1d] text-white dark:bg-[#c5ef75] dark:text-[#172011]'
                    : 'text-[#71787f] hover:text-[#171a1d] dark:text-[#8d988e] dark:hover:text-white'
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
                : 'bg-red-500/10 text-red-600 dark:text-red-400'

            return (
              <div key={t.tagName} className="flex items-center gap-3">
                <span className="w-36 truncate text-xs font-medium text-[#171a1d] dark:text-[#edf2ed]">
                  {t.tagName}
                </span>
                <span className={`rounded px-1.5 py-0.2 font-mono text-[10px] capitalize shrink-0 ${catBadgeColor}`}>
                  {t.category[0]}
                </span>
                <div className="flex-1 h-1.5 rounded-full bg-[#ebedf0] dark:bg-[#28322a] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-lime-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-8 text-right font-mono text-xs font-bold text-[#171a1d] dark:text-[#edf2ed]">
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

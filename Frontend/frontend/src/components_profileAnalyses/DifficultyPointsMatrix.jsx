import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { calculateRank, RANKS_LIST } from '../utils/rankings.js'
import { Zap, Target, TrendingUp } from 'lucide-react'
import { useTheme } from '../hooks/useTheme.js'

// Custom Recharts Tooltip for the Donut Chart
function CustomPieTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="rounded-xl border border-neutral-200 bg-white/95 text-neutral-900 shadow-xl backdrop-blur-md p-3 dark:border-neutral-800 dark:bg-neutral-950/95 dark:text-white">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">{data.name}</span>
        </div>
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
          Solved: <strong className="font-mono text-neutral-900 dark:text-white">{data.value.toLocaleString()}</strong> ({data.percentage}%)
        </p>
        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
          Total in Pool: {data.total.toLocaleString()}
        </p>
      </div>
    )
  }
  return null
}

export default function DifficultyPointsMatrix({ stats }) {
  const { isDarkMode } = useTheme()

  const diffColors = useMemo(() => ({
    Easy: isDarkMode ? '#34d399' : '#10b981',
    Medium: isDarkMode ? '#fbbf24' : '#f59e0b',
    Hard: isDarkMode ? '#f87171' : '#ef4444'
  }), [isDarkMode])

  // Normalize data from backend res.json()
  const data = useMemo(() => {
    const profile = stats?.profile || stats || {}
    const s = profile.stats || {}
    const all = profile.allQuestionsCount || {}
    const beats = profile.beatsStats || []

    const totalSolved = s.totalSolved ?? 482
    const easySolved = s.easySolved ?? 180
    const mediumSolved = s.mediumSolved ?? 242
    const hardSolved = s.hardSolved ?? 60

    const easyTotal = all.easy ?? 820
    const mediumTotal = all.medium ?? 1720
    const hardTotal = all.hard ?? 760
    const totalQuestions = all.all ?? (easyTotal + mediumTotal + hardTotal)

    const totalSubmissions = s.totalSubmissions ?? 1040
    const acceptedSubmissions = s.acceptedSubmissions ?? 728
    const efficiencyScore = totalSubmissions > 0
      ? Number(((acceptedSubmissions / totalSubmissions) * 100).toFixed(1))
      : 70.0

    const leetBuddyPoints = s.leetBuddyPoints ?? 3250
    const currentRank = calculateRank(leetBuddyPoints)
    const nextRank = RANKS_LIST.find(r => r.tier === currentRank.tier + 1) || null

    let progressPercent = 100
    let pointsToNext = 0
    if (nextRank) {
      const tierRange = nextRank.minPoints - currentRank.minPoints
      const earnedInTier = Math.max(0, leetBuddyPoints - currentRank.minPoints)
      progressPercent = Math.min(100, Math.max(0, Math.round((earnedInTier / tierRange) * 100)))
      pointsToNext = Math.max(0, nextRank.minPoints - leetBuddyPoints)
    }

    // Helper to find beats stats
    const getBeats = (diff) => {
      if (Array.isArray(beats)) {
        const found = beats.find(b => b.difficulty?.toLowerCase() === diff.toLowerCase())
        return found ? Number(found.percentage).toFixed(1) : null
      } else if (beats && typeof beats === 'object') {
        return beats[diff.toLowerCase()] ? Number(beats[diff.toLowerCase()]).toFixed(1) : null
      }
      return null
    }

    const pieData = [
      {
        name: 'Easy',
        value: easySolved,
        total: easyTotal,
        percentage: totalSolved > 0 ? ((easySolved / totalSolved) * 100).toFixed(1) : 0,
        color: diffColors.Easy,
        beats: getBeats('Easy') || '88.4'
      },
      {
        name: 'Medium',
        value: mediumSolved,
        total: mediumTotal,
        percentage: totalSolved > 0 ? ((mediumSolved / totalSolved) * 100).toFixed(1) : 0,
        color: diffColors.Medium,
        beats: getBeats('Medium') || '92.1'
      },
      {
        name: 'Hard',
        value: hardSolved,
        total: hardTotal,
        percentage: totalSolved > 0 ? ((hardSolved / totalSolved) * 100).toFixed(1) : 0,
        color: diffColors.Hard,
        beats: getBeats('Hard') || '79.5'
      }
    ]

    return {
      totalSolved,
      totalQuestions,
      easySolved,
      mediumSolved,
      hardSolved,
      easyTotal,
      mediumTotal,
      hardTotal,
      totalSubmissions,
      acceptedSubmissions,
      efficiencyScore,
      leetBuddyPoints,
      currentRank,
      nextRank,
      progressPercent,
      pointsToNext,
      pieData
    }
  }, [stats, diffColors])

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-100">
              Difficulty & Points Matrix
            </h2>
            <p className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
              The "Engine" View: Volume, Efficiency & LeetBuddy Progression
            </p>
          </div>
        </div>

        {/* Global Efficiency Score Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-850 px-3 py-1.5">
          <Target className="h-3.5 w-3.5 text-emerald-500" />
          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">
            Efficiency:
          </span>
          <span className="font-mono text-xs font-black text-neutral-900 dark:text-neutral-100">
            {data.efficiencyScore}%
          </span>
        </div>
      </div>

      {/* ── Main 3-Column Engine Grid ── */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Column 1: Donut Chart with Center Total Solved (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-neutral-50/80 p-4 dark:border-neutral-800/60 dark:bg-neutral-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-1">
            Difficulty Ratio Distribution
          </span>

          {/* Interactive Recharts Donut */}
          <div className="relative h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={92}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {data.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 font-mono">
                {data.totalSolved.toLocaleString()}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Solved / {data.totalQuestions.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Donut Legend Cards */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800/60 text-center">
            {data.pieData.map((d) => (
              <div key={d.name} className="space-y-0.5">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {d.name}
                  </span>
                </div>
                <div className="font-mono text-xs font-black text-neutral-900 dark:text-neutral-100">
                  {d.value} <span className="text-[10px] font-normal text-neutral-500 dark:text-neutral-400">({d.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Breakdown Bars & Beats Percentiles (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-neutral-50/80 p-4 space-y-4 dark:border-neutral-800/60 dark:bg-neutral-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
            Category Breakdown & Pool Beats
          </span>

          <div className="space-y-3.5 flex-1 flex flex-col justify-center">
            {data.pieData.map((d) => {
              const solvedRatio = Math.round((d.value / d.total) * 100)
              return (
                <div key={d.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: d.color }} />
                      {d.name}
                    </span>
                    <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                      <strong className="text-neutral-900 dark:text-neutral-100">{d.value}</strong> / {d.total} ({solvedRatio}%)
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.min(100, Math.max(4, solvedRatio))}%`,
                        backgroundColor: d.color
                      }}
                    />
                  </div>

                  {/* Beats Percentile Pill */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                    <span>Pool coverage: {solvedRatio}%</span>
                    <span className="text-emerald-600 dark:text-emerald-500 font-bold">Beats {d.beats}%</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Efficiency Formula Card */}
          <div className="rounded-lg border border-neutral-200 bg-white p-2.5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-mono text-neutral-500 dark:text-neutral-400">
                Accepted Submissions
              </span>
              <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100">
                {data.acceptedSubmissions.toLocaleString()} / {data.totalSubmissions.toLocaleString()}
              </span>
            </div>
            <div className="mt-1 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
              Formula: (Accepted / Total) × 100 = <strong className="text-emerald-600 dark:text-emerald-500 font-bold">{data.efficiencyScore}%</strong>
            </div>
          </div>
        </div>

        {/* Column 3: LeetBuddy Point Progression & Milestones (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-neutral-50/80 p-4 space-y-3.5 dark:border-neutral-800/60 dark:bg-neutral-950/40 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Point Progression
              </span>
              <span
                className="rounded px-1.5 py-0.5 text-[9px] font-mono font-bold"
                style={{
                  backgroundColor: `${data.currentRank.color}20`,
                  color: data.currentRank.color
                }}
              >
                Tier {data.currentRank.tier}
              </span>
            </div>

            {/* Current Score Display */}
            <div className="mt-2">
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-neutral-900 dark:text-neutral-100">
                {data.leetBuddyPoints.toLocaleString()}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono ml-1">pts</span>
            </div>
          </div>

          {/* Next Milestone Track */}
          <div className="space-y-1.5 rounded-lg border border-neutral-200 bg-white p-3 shadow-xs dark:border-neutral-800 dark:bg-neutral-900/60">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-700 dark:text-neutral-300 font-bold flex items-center gap-1 truncate">
                <TrendingUp className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                {data.nextRank ? (
                  <span>Next: <strong className="text-neutral-900 dark:text-neutral-100">{data.nextRank.title}</strong></span>
                ) : (
                  <span className="text-amber-500 font-bold">Max Rank Reached 👑</span>
                )}
              </span>
              <span className="font-mono text-xs font-bold text-neutral-700 dark:text-neutral-400">
                {data.progressPercent}%
              </span>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${data.progressPercent}%`,
                  backgroundColor: data.currentRank.color
                }}
              />
            </div>

            {data.nextRank && (
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono text-right">
                {data.pointsToNext.toLocaleString()} pts to Tier {data.nextRank.tier}
              </p>
            )}
          </div>

          {/* Points Breakdown Coefficients */}
          <div className="space-y-1 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 border-t border-neutral-200/60 dark:border-neutral-800/60 pt-2.5">
            <div className="flex justify-between">
              <span>Easy ({data.easySolved} × 5)</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-bold">+{data.easySolved * 5} pts</span>
            </div>
            <div className="flex justify-between">
              <span>Medium ({data.mediumSolved} × 15)</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-bold">+{data.mediumSolved * 15} pts</span>
            </div>
            <div className="flex justify-between">
              <span>Hard ({data.hardSolved} × 30)</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-bold">+{data.hardSolved * 30} pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

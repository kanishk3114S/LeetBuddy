import { useState, useMemo } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import { Network, Sparkles } from 'lucide-react'
import { useTheme } from '../hooks/useTheme.js'
import { analyzeTopics } from '../utils/topicData.js'

// Semantic theme tokens for tier categories across light/dark modes
const TIER_TOKENS = {
  strong: {
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/30',
    text: 'text-emerald-600 dark:text-emerald-400'
  },
  medium: {
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 dark:border-amber-500/30',
    text: 'text-amber-600 dark:text-amber-400'
  },
  weak: {
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 dark:border-rose-500/30',
    text: 'text-rose-600 dark:text-rose-400'
  }
}

// Primary 8 topic clusters for the Radar Matrix
const MAJOR_CLUSTERS = [
  { name: 'Arrays', match: ['array', 'arrays'] },
  { name: 'Strings', match: ['string', 'strings'] },
  { name: 'Trees', match: ['tree', 'binary tree', 'trees'] },
  { name: 'Graphs', match: ['graph', 'graphs', 'graph theory'] },
  { name: 'Dynamic Programming', match: ['dynamic programming', 'dp'] },
  { name: 'Greedy', match: ['greedy'] },
  { name: 'Math', match: ['math', 'mathematics'] },
  { name: 'Heap', match: ['heap', 'priority queue', 'heap (priority queue)', 'heap-priority-queue'] }
]

// Custom Recharts Tooltip for Radar Chart
function CustomRadarTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const d = payload[0].payload
    const tierStyle = TIER_TOKENS[d.tierType] || TIER_TOKENS.medium
    return (
      <div className="rounded-xl border border-neutral-200 bg-white/95 text-neutral-900 shadow-xl backdrop-blur-md p-3 dark:border-neutral-800 dark:bg-neutral-950/95 dark:text-white transition-all">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-neutral-900 dark:text-white">{d.topic}</span>
          <span className={`rounded px-1.5 py-0.5 text-[9px] font-mono font-bold border ${tierStyle.badge}`}>
            {d.tag}
          </span>
        </div>
        <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-300">
          Mastery Score: <strong className="font-mono text-neutral-900 dark:text-white">{d.masteryScore}/100</strong>
        </p>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
          Solved: {d.volume} • Acc: {d.accuracy}% • Fail: {d.failureRate}%
        </p>
      </div>
    )
  }
  return null
}

export default function TopicMasteryMatrix({ stats }) {
  // Pure dynamic evaluation strictly based on real profile telemetry
  const topicData = useMemo(() => {
    const profile = stats?.profile || stats || {}
    const evaluatedAll = analyzeTopics(profile)

    return MAJOR_CLUSTERS.map(cluster => {
      // Find matching topic from the evaluated real-data list
      const matched = evaluatedAll.find(t =>
        cluster.match.some(m =>
          t.name.toLowerCase() === m ||
          t.slug.toLowerCase() === m ||
          t.slug.toLowerCase().replace(/[^a-z0-9]/g, '') === m.replace(/[^a-z0-9]/g, '')
        )
      )

      if (matched) {
        return {
          topic: cluster.name,
          volume: matched.volume,
          accuracy: matched.accuracy,
          failureRate: matched.failureRate,
          totalAttempts: matched.totalAttempts,
          triesPerSolve: matched.triesPerSolve,
          hardSolved: matched.hardSolved,
          mediumSolved: matched.mediumSolved,
          easySolved: matched.easySolved,
          tag: matched.tag,
          tierType: matched.tierType,
          tagIcon: matched.tagIcon,
          diagnostic: matched.diagnostic,
          masteryScore: matched.masteryScore
        }
      }

      // If user has zero verified solves in this cluster
      return {
        topic: cluster.name,
        volume: 0,
        accuracy: 0,
        failureRate: 100,
        totalAttempts: 0,
        triesPerSolve: 0,
        hardSolved: 0,
        mediumSolved: 0,
        easySolved: 0,
        tag: 'Weak Topic',
        tierType: 'weak',
        tagIcon: '🔴',
        diagnostic: 'Zero verified solves in this topic cluster. Unattempted topic gap.',
        masteryScore: 0
      }
    })
  }, [stats])

  const [selectedTopic, setSelectedTopic] = useState(() => topicData[0]?.topic || 'Arrays')

  const { isDarkMode } = useTheme()

  // Theme-aware radar chart stroke and fill variables
  const radarStroke = isDarkMode ? '#818cf8' : '#6366f1'
  const radarFill = isDarkMode ? '#818cf8' : '#6366f1'
  const gridStroke = isDarkMode ? '#334155' : '#cbd5e1'
  const tickFill = isDarkMode ? '#94a3b8' : '#64748b'

  // Active inspected topic
  const activeDetail = topicData.find(t => t.topic === selectedTopic) || topicData[0]
  const activeTierStyle = TIER_TOKENS[activeDetail.tierType] || TIER_TOKENS.medium

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
            <Network className="h-4 w-4 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-100">
              Topic Mastery Breakdown
            </h2>
            <p className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
              The "Radar Matrix": Spider Chart Across 8 Major Algorithmic Clusters (Pure Real-Data Evaluation)
            </p>
          </div>
        </div>

        {/* Legend Pills */}
        <div className="flex items-center gap-2 text-[10px] font-mono flex-wrap">
          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
            🟢 Proficient (≥70)
          </span>
          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">
            🟡 Developing (40-69)
          </span>
          <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20">
            🔴 Critical Weakness (&lt;40)
          </span>
        </div>
      </div>

      {/* ── 2-Column Layout: Radar Spider Chart + Deep Inspection Panel ── */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Interactive Recharts Spider Chart (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-neutral-50/80 p-4 dark:border-neutral-800/60 dark:bg-neutral-950/40">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Multi-Axis Radar Matrix (Mastery 0 - 100)
            </span>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
              Click any node to inspect
            </span>
          </div>

          <div className="relative h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={topicData} outerRadius="75%">
                <PolarGrid stroke={gridStroke} strokeOpacity={isDarkMode ? 0.35 : 0.6} />
                <PolarAngleAxis
                  dataKey="topic"
                  tick={{ fill: tickFill, fontSize: 11, fontFamily: 'monospace' }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: tickFill, fontSize: 9 }}
                  stroke={gridStroke}
                  strokeOpacity={0.4}
                />
                <Radar
                  name="Mastery"
                  dataKey="masteryScore"
                  stroke={radarStroke}
                  fill={radarFill}
                  fillOpacity={isDarkMode ? 0.3 : 0.22}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomRadarTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Select Topic Pills with Micro-Interactions */}
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-neutral-200 dark:border-neutral-800/60">
            {topicData.map((t) => (
              <button
                key={t.topic}
                type="button"
                onClick={() => setSelectedTopic(t.topic)}
                className={`
                  flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-mono transition-all duration-200 cursor-pointer hover:-translate-y-0.5 active:scale-95
                  ${selectedTopic === t.topic
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold shadow-xs'
                    : 'bg-white text-neutral-700 border border-neutral-200 hover:border-neutral-400 shadow-xs dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800'
                  }
                `}
              >
                <span>{t.tagIcon}</span>
                <span>{t.topic}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Deep Topic Drill-Down & Metrics Card (6 Cols) */}
        <div className="lg:col-span-6 flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-neutral-50/80 p-5 space-y-4 dark:border-neutral-800/60 dark:bg-neutral-950/40">
          {/* Header of Active Inspected Topic */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-neutral-800/60">
            <div>
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block font-bold">
                Inspected Topic Cluster
              </span>
              <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-200 tracking-tight mt-0.5 flex items-center gap-2">
                <span>{activeDetail.topic}</span>
              </h3>
            </div>

            <div className={`rounded-lg px-3 py-1 font-mono text-xs font-bold border shadow-xs transition-colors ${activeTierStyle.badge}`}>
              {activeDetail.tagIcon} {activeDetail.tag}
            </div>
          </div>

          {/* Metric Trio: Volume, Accuracy, Attempts */}
          <div className="grid grid-cols-3 gap-3">
            {/* Metric 1: Volume */}
            <div className="rounded-xl border border-neutral-200 bg-white p-3 text-center shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs">
              <span className="font-mono text-[10px] uppercase text-neutral-500 dark:text-neutral-400 block font-bold">
                Problems Solved
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-neutral-900 dark:text-neutral-200 mt-1 block">
                {activeDetail.volume}
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                Across practice &amp; contests
              </span>
            </div>

            {/* Metric 2: Accuracy & Failure Rate */}
            <div className="rounded-xl border border-neutral-200 bg-white p-3 text-center shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs">
              <span className="font-mono text-[10px] uppercase text-neutral-500 dark:text-neutral-400 block font-bold">
                Accuracy Rate
              </span>
              <span className={`text-xl sm:text-2xl font-black font-mono mt-1 block ${activeTierStyle.text}`}>
                {activeDetail.accuracy}%
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                {activeDetail.failureRate}% failure rate
              </span>
            </div>

            {/* Metric 3: Total Attempts */}
            <div className="rounded-xl border border-neutral-200 bg-white p-3 text-center shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xs">
              <span className="font-mono text-[10px] uppercase text-neutral-500 dark:text-neutral-400 block font-bold">
                Total Attempts
              </span>
              <span className="text-xl sm:text-2xl font-black font-mono text-neutral-900 dark:text-neutral-200 mt-1 block">
                {activeDetail.totalAttempts}
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                {activeDetail.volume > 0 ? `${(activeDetail.totalAttempts / activeDetail.volume).toFixed(1)} tries / solve` : '0 attempts'}
              </span>
            </div>
          </div>

          {/* Difficulty Distribution within this specific topic */}
          <div className="rounded-xl border border-neutral-200 bg-white p-3.5 space-y-2 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
              Difficulty Distribution in {activeDetail.topic}
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2 text-center">
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block font-bold">
                  Easy
                </span>
                <span className="text-sm font-black font-mono text-neutral-900 dark:text-neutral-200">
                  {activeDetail.easySolved}
                </span>
              </div>

              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2 text-center">
                <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 block font-bold">
                  Medium
                </span>
                <span className="text-sm font-black font-mono text-neutral-900 dark:text-neutral-200">
                  {activeDetail.mediumSolved}
                </span>
              </div>

              <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-2 text-center">
                <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400 block font-bold">
                  Hard
                </span>
                <span className="text-sm font-black font-mono text-neutral-900 dark:text-neutral-200">
                  {activeDetail.hardSolved}
                </span>
              </div>
            </div>
          </div>

          {/* Topic Diagnostic Takeaway */}
          <div className="rounded-xl border border-neutral-200 bg-white p-3.5 flex items-start gap-2.5 text-xs shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
            <Sparkles className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-mono text-[10px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block font-bold">
                Pattern Diagnostic
              </strong>
              <p className="text-neutral-700 dark:text-neutral-400 text-xs leading-relaxed mt-0.5">
                {activeDetail.diagnostic}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

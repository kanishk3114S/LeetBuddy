import { useState, useMemo } from 'react'
import Sidebar from '../components_dashboard/Sidebar.jsx'
import DashHeader from '../components_dashboard/DashHeader.jsx'
import TopicMasteryMatrix from '../components_profileAnalyses/TopicMasteryMatrix.jsx'
import TopicDirectory from '../components_topicMastery/TopicDirectory.jsx'
import { analyzeTopics } from '../utils/topicData.js'
import { AlertTriangle } from 'lucide-react'

export default function TopicMastery() {
  const [activeNav, setActiveNav] = useState('topic-mastery')

  const [stats] = useState(() => {
    try {
      const saved = localStorage.getItem('lb_stats')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Restore user info from localStorage
  const user = {
    email: localStorage.getItem('lb_email') || '',
    name: localStorage.getItem('lb_name') || '',
  }

  // Process all 41 topics with updated strict classification criteria
  const allTopics = useMemo(() => {
    const profile = stats?.profile || stats || {}
    return analyzeTopics(profile)
  }, [stats])

  // Aggregate executive metrics across the 3 sections
  const summary = useMemo(() => {
    const weakList = allTopics.filter(t => t.tierType === 'weak')
    const mediumList = allTopics.filter(t => t.tierType === 'medium')
    const strongList = allTopics.filter(t => t.tierType === 'strong')

    const avgMastery = Math.round(
      allTopics.reduce((acc, t) => acc + t.masteryScore, 0) / Math.max(1, allTopics.length)
    )

    return {
      weakCount: weakList.length,
      mediumCount: mediumList.length,
      strongCount: strongList.length,
      avgMastery,
      topWeakness: weakList[0]?.name || 'Dynamic Programming',
      topStrength: strongList[0]?.name || 'Trees'
    }
  }, [allTopics])

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 font-[Manrope,Arial,sans-serif] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Sidebar with Topic Mastery active */}
      <Sidebar active={activeNav} setActive={setActiveNav} />

      {/* Main Page Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashHeader user={user} stats={stats} />

        {/* Scrollable Content View */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* ── Page Header Banner & Stat Scorecards ── */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                    ◈
                  </span>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
                    Topic Mastery Platform
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                  Algorithmic competency analysis, spider chart radar breakdown, and diagnostic triage across 41 competitive programming topics.
                </p>
              </div>

              {/* Weakness Alert Badge */}
              <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/80 px-3.5 py-2 text-xs font-mono font-bold text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300 shrink-0 self-start sm:self-auto">
                <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
                <span>Primary Gap: {summary.topWeakness}</span>
              </div>
            </div>

            {/* 4 Scorecard Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Card 1: Global Mastery Index */}
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
                <span className="font-mono text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Mastery Index
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-neutral-900 dark:text-neutral-100">
                    {summary.avgMastery}%
                  </span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    Score
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${summary.avgMastery}%` }}
                  />
                </div>
              </div>

              {/* Card 2: Critical Weaknesses */}
              <div className="rounded-xl border border-rose-200 bg-white p-4 shadow-xs dark:border-rose-950/60 dark:bg-neutral-900 transition-colors">
                <span className="font-mono text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 block tracking-wider flex items-center gap-1">
                  <span>🔴</span> Critical Weaknesses
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-rose-600 dark:text-rose-400">
                    {summary.weakCount}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Topics
                  </span>
                </div>
                <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-2 truncate">
                  Solved &lt; 5 OR Acc &lt; 40%
                </p>
              </div>

              {/* Card 3: Developing Topics */}
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
                <span className="font-mono text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block tracking-wider flex items-center gap-1">
                  <span>🟡</span> Developing Topics
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-amber-600 dark:text-amber-400">
                    {summary.mediumCount}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Topics
                  </span>
                </div>
                <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-2 truncate">
                  40% ≤ Acc &lt; 70%
                </p>
              </div>

              {/* Card 4: Dominant Strengths */}
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block tracking-wider flex items-center gap-1">
                  <span>🟢</span> Proficient Strengths
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {summary.strongCount}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    Topics
                  </span>
                </div>
                <p className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 mt-2 truncate">
                  Solved ≥ 5 &amp; Acc ≥ 70%
                </p>
              </div>
            </div>
          </div>

          {/* ── Container 1: The Topic Mastery Matrix (Radar Spider Chart across 8 major clusters) ── */}
          <TopicMasteryMatrix stats={stats} />

          {/* ── Container 2: Topic Directory (Dedicated Weak, Developing, Proficient tabs) ── */}
          <TopicDirectory topics={allTopics} />
        </div>
      </div>
    </div>
  )
}

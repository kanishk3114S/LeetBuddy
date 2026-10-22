import { useState, useMemo } from 'react'
import {
  Search,
  ArrowUpDown,
  ExternalLink,
  BarChart3,
  Flame,
  Sparkles,
  TrendingUp,
  ShieldAlert
} from 'lucide-react'

const CATEGORY_STYLES = {
  fundamental: 'bg-sky-500/10 text-sky-700 border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-400 dark:border-sky-500/30',
  intermediate: 'bg-violet-500/10 text-violet-700 border-violet-500/20 dark:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/30',
  advanced: 'bg-fuchsia-500/10 text-fuchsia-700 border-fuchsia-500/20 dark:bg-fuchsia-500/15 dark:text-fuchsia-400 dark:border-fuchsia-500/30'
}

function TopicCardItem({ topic }) {
  const isWeak = topic.tierType === 'weak'
  const isDeveloping = topic.tierType === 'medium'

  const categoryClass = CATEGORY_STYLES[topic.category] || CATEGORY_STYLES.fundamental

  // Dynamic theme-aware classes
  const tierClasses = isWeak
    ? {
        card: 'border-rose-200/90 bg-rose-50/20 hover:border-rose-300 dark:border-rose-900/40 dark:bg-rose-950/10 dark:hover:border-rose-800/60',
        badge: 'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30',
        bar: 'bg-rose-500',
        accText: 'text-rose-600 dark:text-rose-400',
        reasonBadge: 'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40',
        btn: 'bg-rose-600 hover:bg-rose-700 text-white dark:bg-rose-600 dark:hover:bg-rose-500',
        actionLabel: 'Immediate Focus',
        Icon: ShieldAlert
      }
    : isDeveloping
    ? {
        card: 'border-neutral-200 bg-white hover:border-amber-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-amber-800/60',
        badge: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
        bar: 'bg-amber-500',
        accText: 'text-amber-600 dark:text-amber-400',
        reasonBadge: 'bg-amber-500/10 text-amber-700 border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40',
        btn: 'bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-600 dark:hover:bg-amber-500',
        actionLabel: 'Drill Target',
        Icon: TrendingUp
      }
    : {
        card: 'border-neutral-200 bg-white hover:border-emerald-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-800/60',
        badge: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
        bar: 'bg-emerald-500',
        accText: 'text-emerald-600 dark:text-emerald-400',
        reasonBadge: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40',
        btn: 'bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-100 dark:hover:bg-neutral-200 dark:text-neutral-900',
        actionLabel: 'Verified Mastery',
        Icon: Sparkles
      }

  const { Icon } = tierClasses

  return (
    <div
      className={`
        flex flex-col justify-between rounded-xl border p-4.5 transition-all duration-200 group shadow-xs hover:-translate-y-0.5 hover:shadow-md
        ${tierClasses.card}
      `}
    >
      <div>
        {/* Card Header: Category & Tier Tag */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className={`font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${categoryClass}`}>
            {topic.category}
          </span>

          <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${tierClasses.badge}`}>
            <span>{topic.tagIcon}</span>
            <span>{topic.tag}</span>
          </span>
        </div>

        {/* Topic Title & Acceptance Rate */}
        <div className="flex items-baseline justify-between gap-2 mt-1">
          <h3 className="text-base font-black tracking-tight text-neutral-900 dark:text-neutral-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {topic.name}
          </h3>
          <div className="text-right font-mono shrink-0">
            <span className={`text-xs font-black ${tierClasses.accText}`}>
              {topic.accuracy}%
            </span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 ml-1">acc</span>
          </div>
        </div>

        {/* Mastery Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 mt-2 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${tierClasses.bar}`}
            style={{ width: `${Math.max(6, Math.min(100, topic.accuracy))}%` }}
          />
        </div>

        {/* Classification Criteria Trigger Pill */}
        {topic.tierReason && (
          <div className="mt-2.5">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${tierClasses.reasonBadge}`}>
              <Icon className="h-3 w-3 shrink-0" />
              <span className="truncate">{topic.tierReason}</span>
            </span>
          </div>
        )}

        {/* Quantitative Stats Row: Solved, Failure Rate, Velocity */}
        <div className="grid grid-cols-3 gap-2 mt-3 py-2.5 px-3 rounded-lg bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-800/60 font-mono text-center">
          <div>
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block font-bold">
              Solved
            </span>
            <span className="text-xs font-black text-neutral-900 dark:text-neutral-200">
              {topic.volume}
            </span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block font-bold">
              Failure Rate
            </span>
            <span className={`text-xs font-black ${isWeak ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-900 dark:text-neutral-200'}`}>
              {topic.failureRate}%
            </span>
          </div>
          <div>
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block font-bold">
              Velocity
            </span>
            <span className="text-xs font-black text-neutral-900 dark:text-neutral-200">
              {topic.triesPerSolve > 0 ? `${topic.triesPerSolve}x` : '—'}
            </span>
          </div>
        </div>

        {/* Difficulty Distribution Badges */}
        <div className="flex items-center gap-1.5 mt-2.5 text-[10px] font-mono">
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 font-bold border border-emerald-500/20 dark:border-emerald-500/30">
            E: {topic.easySolved}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 font-bold border border-amber-500/20 dark:border-amber-500/30">
            M: {topic.mediumSolved}
          </span>
          <span className="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 font-bold border border-rose-500/20 dark:border-rose-500/30">
            H: {topic.hardSolved}
          </span>
        </div>

        {/* Algorithmic Diagnostic Note */}
        <p className="mt-3 text-[11.5px] leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-3">
          {topic.diagnostic}
        </p>
      </div>

      {/* Card Footer: Practice Button */}
      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
        <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
          {isWeak && <Flame className="h-3 w-3 text-rose-500" />}
          <span>{tierClasses.actionLabel}</span>
        </span>

        <a
          href={topic.practiceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`
            inline-flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg transition-all shadow-xs active:scale-95
            ${tierClasses.btn}
          `}
        >
          <span>Practice</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  )
}

export default function TopicDirectory({ topics = [] }) {
  const [searchTerm, setSearchTerm] = useState('')
  // ONLY 3 tier sections allowed: 'weak' | 'medium' | 'strong' (default to 'weak')
  const [activeTierFilter, setActiveTierFilter] = useState('weak')
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all') // 'all' | 'fundamental' | 'intermediate' | 'advanced'
  const [sortBy, setSortBy] = useState('weakest') // 'weakest' | 'highest' | 'solved' | 'accuracy' | 'alpha'

  // Counts for the 3 tier buttons
  const counts = useMemo(() => {
    return {
      weak: topics.filter(t => t.tierType === 'weak').length,
      medium: topics.filter(t => t.tierType === 'medium').length,
      strong: topics.filter(t => t.tierType === 'strong').length,
      fundamental: topics.filter(t => t.category === 'fundamental').length,
      intermediate: topics.filter(t => t.category === 'intermediate').length,
      advanced: topics.filter(t => t.category === 'advanced').length
    }
  }, [topics])

  // Filtered & Sorted list for the ACTIVE tier only (lightweight, avoids heavy DOM)
  const filteredTopics = useMemo(() => {
    return topics
      .filter(t => {
        // Strict Tier Filter (only the selected tier: weak, medium, or strong)
        if (t.tierType !== activeTierFilter) {
          return false
        }
        // Search filter
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase()
          const nameMatch = t.name.toLowerCase().includes(q)
          const diagMatch = t.diagnostic.toLowerCase().includes(q)
          const catMatch = t.category.toLowerCase().includes(q)
          const reasonMatch = t.tierReason?.toLowerCase().includes(q)
          if (!nameMatch && !diagMatch && !catMatch && !reasonMatch) return false
        }
        // Category filter
        if (activeCategoryFilter !== 'all' && t.category !== activeCategoryFilter) {
          return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'weakest') return a.masteryScore - b.masteryScore
        if (sortBy === 'highest') return b.masteryScore - a.masteryScore
        if (sortBy === 'solved') return b.volume - a.volume
        if (sortBy === 'accuracy') return b.accuracy - a.accuracy
        if (sortBy === 'failure') return b.failureRate - a.failureRate
        if (sortBy === 'alpha') return a.name.localeCompare(b.name)
        return 0
      })
  }, [topics, searchTerm, activeTierFilter, activeCategoryFilter, sortBy])

  // Active section metadata configuration
  const activeSectionInfo = useMemo(() => {
    if (activeTierFilter === 'weak') {
      return {
        title: 'Weak Topics',
        icon: '🔴',
        count: counts.weak,
        rule: 'Volume < 5 OR Mastery < 40 OR Failure > 50%',
        badgeClass: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20',
        note: 'High-priority triage. Critical gaps with inadequate solve volume, high failure rate, or low mastery.'
      }
    }
    if (activeTierFilter === 'medium') {
      return {
        title: 'Developing Topics',
        icon: '🟡',
        count: counts.medium,
        rule: 'Volume ≥ 5 AND 40 ≤ Mastery < 70',
        badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
        note: 'Active progression. Solid foundations in place; target drills to elevate accuracy and reduce failure rate.'
      }
    }
    return {
      title: 'Proficient Topics',
      icon: '🟢',
      count: counts.strong,
      rule: 'Volume ≥ 15 AND Mastery ≥ 70',
      badgeClass: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
      note: 'Demonstrated mastery. High first-attempt consistency, low failure rate, and algorithmic fluency.'
    }
  }, [activeTierFilter, counts])

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
      {/* ── Header & Title ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-neutral-100 dark:border-neutral-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              <BarChart3 className="h-4 w-4 text-emerald-500" />
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-200">
              Topic Directory
            </h2>
          </div>
          <p className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
            Select a tier below: Weak, Developing, or Proficient topics.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 dark:text-neutral-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search topic or concept..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition focus:border-neutral-400 focus:bg-white dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-neutral-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Filter Controls Row: ONLY Weak, Developing, and Proficient Buttons ── */}
      <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Tier Status Filters (No 'All Sections' button to keep app lightweight) */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTierFilter('weak')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold ${
              activeTierFilter === 'weak'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20'
            }`}
          >
            <span>🔴</span>
            <span>Weak ({counts.weak})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTierFilter('medium')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold ${
              activeTierFilter === 'medium'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            <span>🟡</span>
            <span>Developing ({counts.medium})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTierFilter('strong')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold ${
              activeTierFilter === 'strong'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
            }`}
          >
            <span>🟢</span>
            <span>Proficient ({counts.strong})</span>
          </button>
        </div>

        {/* Secondary: Category Filter & Sort Dropdown */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          {/* Category Select */}
          <select
            value={activeCategoryFilter}
            onChange={(e) => setActiveCategoryFilter(e.target.value)}
            className="rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-bold text-neutral-800 outline-none transition hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
          >
            <option value="all">All Categories</option>
            <option value="fundamental">Fundamental ({counts.fundamental})</option>
            <option value="intermediate">Intermediate ({counts.intermediate})</option>
            <option value="advanced">Advanced ({counts.advanced})</option>
          </select>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-2.5 py-1 dark:border-neutral-700 dark:bg-neutral-800">
            <ArrowUpDown className="h-3 w-3 text-neutral-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-neutral-800 outline-none dark:text-neutral-200 cursor-pointer"
            >
              <option value="weakest">Weakest First</option>
              <option value="highest">Highest Mastery</option>
              <option value="failure">Highest Failure Rate</option>
              <option value="solved">Most Solved</option>
              <option value="accuracy">Highest Accuracy</option>
              <option value="alpha">A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Active Section Header Banner ── */}
      <div className="mt-5 p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm">{activeSectionInfo.icon}</span>
          <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
            {activeSectionInfo.title}
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${activeSectionInfo.badgeClass}`}>
            Rule: {activeSectionInfo.rule}
          </span>
        </div>
        <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
          {activeSectionInfo.note}
        </span>
      </div>

      {/* ── Active Tier Cards Grid ── */}
      {filteredTopics.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-neutral-200 p-8 text-center dark:border-neutral-800">
          <p className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
            No topics found matching your search in {activeSectionInfo.title}.
          </p>
          {(searchTerm || activeCategoryFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setActiveCategoryFilter('all')
              }}
              className="mt-2 text-xs font-mono text-indigo-600 dark:text-indigo-400 underline font-semibold"
            >
              Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTopics.map(topic => (
            <TopicCardItem key={topic.name} topic={topic} />
          ))}
        </div>
      )}
    </div>
  )
}

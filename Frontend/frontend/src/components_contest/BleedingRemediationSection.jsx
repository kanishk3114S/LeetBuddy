import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ExternalLink,
  RotateCw,
  Target,
  ArrowUpRight,
  Flame,
  BookOpen
} from 'lucide-react'

export default function BleedingRemediationSection({ username, initialRemediation }) {
  const [remediation, setRemediation] = useState(initialRemediation || null)
  const [isLoading, setIsLoading] = useState(!initialRemediation && !!username)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [errorNotice, setErrorNotice] = useState(null)

  // Fetch remediation on mount or username change if not passed initially
  const fetchRemediation = useCallback(async (forceRefresh = false) => {
    if (!username) return

    try {
      if (forceRefresh) {
        setIsRegenerating(true)
      } else {
        setIsLoading(true)
      }
      setErrorNotice(null)

      const authToken = localStorage.getItem('accessToken') || localStorage.getItem('lb_token')
      const endpoint = `/api/v1/contests/${encodeURIComponent(username)}/remediation${
        forceRefresh ? '?refresh=true' : ''
      }`

      const res = await fetch(endpoint, {
        method: forceRefresh ? 'POST' : 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        }
      })

      if (res.ok) {
        const data = await res.json()
        setRemediation(data.remediation)
      } else {
        const errData = await res.json().catch(() => ({}))
        setErrorNotice(errData.error || 'Failed to fetch AI remediation')
      }
    } catch (err) {
      console.error('Failed to load AI remediation:', err)
      setErrorNotice('Network error while reaching AI engine')
    } finally {
      setIsLoading(false)
      setIsRegenerating(false)
    }
  }, [username])

  useEffect(() => {
    if (!initialRemediation && username) {
      fetchRemediation(false)
    } else if (initialRemediation) {
      setRemediation(initialRemediation)
    }
  }, [initialRemediation, username, fetchRemediation])

  const weakTopics = remediation?.weakTopicDiagnoses || []
  const blueprints = remediation?.questionBlueprints || []

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      case 'hard':
        return 'text-rose-500 bg-rose-500/10 border-rose-500/20'
      case 'medium':
      default:
        return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    }
  }

  return (
    <section
      id="section-bleeding-remediation"
      className="scroll-mt-28 rounded-2xl border border-neutral-200/90 bg-white dark:border-neutral-800 dark:bg-neutral-900 shadow-xs transition-colors"
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 border-b border-neutral-200/80 dark:border-neutral-800/80">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                04 / AI Remediation
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="font-mono text-[10.5px] font-medium text-neutral-500 dark:text-neutral-400">
                Weak Topics & Sister Practice
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
              Bleeding-Question Remediation Pipeline
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            disabled={isRegenerating || isLoading}
            onClick={() => fetchRemediation(true)}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/80 px-3 py-1 font-mono text-[11px] font-bold text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/80 disabled:opacity-50"
          >
            <RotateCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? 'Regenerating...' : 'Regenerate Analysis'}</span>
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-7">
        {errorNotice && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-mono text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400">
            {errorNotice}
          </div>
        )}

        {/* ── Loading Skeleton ─────────────────────────────────────────── */}
        {isLoading && !remediation && (
          <div className="space-y-4 py-8 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500 animate-bounce mb-3">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="font-heading text-sm font-bold text-neutral-800 dark:text-neutral-200">
              Synthesizing Algorithmic Remediation Blueprint...
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto font-sans">
              Scanning your last 5 contests for TLEs, penalty bleed, and unreached ceilings to extract high-yield practice directives.
            </p>
          </div>
        )}

        {/* ── Main Remediation Content ─────────────────────────────────── */}
        {remediation && (
          <>
            {/* PART 1: Contest Weak-Topic Diagnoses */}
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
                    Contest Weak-Topic Diagnoses & Practice Prescription
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Specific algorithmic patterns breaking down under the 90-minute contest timer
                  </p>
                </div>
                <span className="font-mono text-[11px] text-neutral-400 hidden sm:inline-block">
                  {weakTopics.length} Diagnosed Bottleneck{weakTopics.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {weakTopics.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex flex-col justify-between rounded-xl border border-neutral-200/90 bg-neutral-50/50 p-5 dark:border-neutral-800 dark:bg-neutral-900/90"
                  >
                    <div>
                      {/* Topic Header */}
                      <div className="flex items-start justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-white font-mono text-[11px] font-bold">
                            {idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                            {item.topic}
                          </h4>
                        </div>
                        <span className="shrink-0 rounded-md border border-neutral-200 bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                          High Tax
                        </span>
                      </div>

                      {/* Why Under Pressure */}
                      <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans mb-3">
                        {item.whyUnderPressure}
                      </p>

                      {/* Symptoms List */}
                      {item.symptoms && item.symptoms.length > 0 && (
                        <div className="mb-4 rounded-lg border border-neutral-200/70 bg-white/80 p-3 dark:border-neutral-800 dark:bg-neutral-950/80">
                          <span className="block font-mono text-[10px] font-bold uppercase text-neutral-400 mb-1.5">
                            Observed Contest Failure Symptoms:
                          </span>
                          <ul className="space-y-1 text-[11.5px] text-neutral-600 dark:text-neutral-300 font-sans">
                            {item.symptoms.map((symptom, sIdx) => (
                              <li key={sIdx} className="flex items-start gap-1.5">
                                <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                                <span>{symptom}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Curated Sister Problems Prescription */}
                    <div className="border-t border-neutral-200/70 pt-3 dark:border-neutral-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                          <Target className="h-3 w-3 text-emerald-500" />
                          Curated Sister Problems:
                        </span>
                        <span className="text-[10px] font-mono text-neutral-400">
                          Target Drills
                        </span>
                      </div>

                      <div className="space-y-2">
                        {item.recommendedProblems?.map((prob, pIdx) => (
                          <a
                            key={pIdx}
                            href={`https://leetcode.com/problems/${prob.titleSlug}/`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-neutral-200/80 bg-white p-2.5 transition hover:border-neutral-400 hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold border ${getDifficultyColor(
                                  prob.difficulty
                                )}`}
                              >
                                {prob.difficulty}
                              </span>
                              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {prob.title}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                              <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded">
                                {prob.targetSolveTime || '< 20 mins'}
                              </span>
                              <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* PART 2: Question-by-Question Method to Solve Blueprints */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-neutral-100">
                    Question-by-Question Blueprint & Upsolve Hub
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Optimal algorithmic method, complexity targets, and ratings-bleed autopsy for each problem
                  </p>
                </div>
                <span className="font-mono text-[11px] text-neutral-400 hidden sm:inline-block">
                  {blueprints.length} Blueprint{blueprints.length !== 1 ? 's' : ''} Generated
                </span>
              </div>

              <div className="space-y-3">
                {blueprints.map((bp, bIdx) => (
                  <div
                    key={bIdx}
                    className="rounded-xl border border-neutral-200/90 bg-white p-4 transition-all hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900/90 dark:hover:border-neutral-700"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 mt-0.5">
                          <Flame className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                              {bp.contestTitle || 'Contest'}
                            </span>
                            <span className="text-neutral-300 dark:text-neutral-700">•</span>
                            <span className="font-mono text-[10px] font-bold text-neutral-500 dark:text-neutral-400">
                              Bleed Question #{bIdx + 1}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                            {bp.title}
                          </h4>
                        </div>
                      </div>

                      {/* Upsolve CTA Link Button */}
                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                        <a
                          href={`https://leetcode.com/problems/${bp.titleSlug}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-900 bg-neutral-900 px-3 py-1.5 font-mono text-xs font-bold text-white transition hover:bg-neutral-800 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 shadow-2xs"
                        >
                          <span>Upsolve on LeetCode</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    {/* Why You Bled Card */}
                    <div className="mt-3.5 rounded-lg border border-rose-100 bg-rose-50/50 p-2.5 dark:border-rose-950/60 dark:bg-rose-950/20">
                      <span className="font-mono text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                        Why You Bled Rating:
                      </span>
                      <p className="mt-0.5 text-xs text-neutral-700 dark:text-neutral-300 font-sans">
                        {bp.whyYouBled}
                      </p>
                    </div>

                    {/* Core Trick & Method */}
                    <div className="mt-3 grid grid-cols-1 lg:grid-cols-3 gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="lg:col-span-2">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mb-1">
                          <BookOpen className="h-3 w-3 text-indigo-500" />
                          Core Trick / Optimal Method:
                        </span>
                        <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
                          {bp.coreTrick}
                        </p>
                      </div>

                      {/* Target Complexity Pill */}
                      <div className="flex flex-col justify-center rounded-lg border border-neutral-200 bg-neutral-50/70 p-2.5 dark:border-neutral-800 dark:bg-neutral-950/80">
                        <span className="font-mono text-[10px] font-bold uppercase text-neutral-400">
                          Target Complexity:
                        </span>
                        <span className="mt-0.5 font-mono text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                          {bp.targetComplexity || 'O(N log N) time • O(1) space'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

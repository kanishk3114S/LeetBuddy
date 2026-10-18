import {
  Clock,
  Compass,
  ArrowRight,
  Target,
  Zap
} from 'lucide-react'

export default function UpcomingSectionsBlueprint() {
  return (
    <div className="space-y-8 pt-4">
      {/* ── Section 05: Contest Rating Bleed vs Practice Gap ─────────── */}
      <section
        id="section-pressure-gap"
        className="scroll-mt-28 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 p-6 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-200/60 dark:border-neutral-800/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                05 / RATING GAP
              </span>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Contest Rating Bleed vs. Practice Gap
              </h3>
            </div>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 font-mono text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
            Coming Up Next ⏳
          </span>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl font-sans">
          Answers why you can solve 2,000-rated problems on Tuesday afternoon without sweat, but freeze on 1,750-rated Mediums on Sunday morning. Directly cross-references untimed Topic Mastery data against 90-minute contest pressure limits.
        </p>
      </section>

      {/* ── Section 06: Sister-Problem Upsolving Sprints ─────────────── */}
      <section
        id="section-upsolve-sprints"
        className="scroll-mt-28 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/40 p-6 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-200/60 dark:border-neutral-800/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                06 / RECOVERY SPRINTS
              </span>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">
                Sister-Problem Upsolving Sprints
              </h3>
            </div>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 font-mono text-[10px] font-bold text-neutral-600 dark:text-neutral-400">
            Practice Integration 🎯
          </span>
        </div>

        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-3xl font-sans">
          Automated weekly sprint queue: generates 3 targeted post-contest recovery drills with countdown timers to cement the algorithmic patterns you bled rating on before the next contest begins.
        </p>
      </section>
    </div>
  )
}


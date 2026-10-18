import { motion } from 'framer-motion'
import {
  Timer,
  LayoutGrid,
  AlertTriangle,
  Clock,
  Sparkles,
  Trophy,
  Check
} from 'lucide-react'

export const DEEP_DIVE_SECTIONS = [
  {
    id: 'section-panic-tax',
    step: '01',
    label: 'Panic Tax',
    sublabel: 'Solve vs. Penalty Bleed',
    icon: Timer,
    status: 'ACTIVE'
  },
  {
    id: 'section-split-times',
    step: '02',
    label: 'Split Times',
    sublabel: '5×4 Telemetry Matrix',
    icon: LayoutGrid,
    status: 'ACTIVE'
  },
  {
    id: 'section-root-causes',
    step: '03',
    label: 'Root Causes',
    sublabel: 'TLE / WA / RTE Engine',
    icon: AlertTriangle,
    status: 'ACTIVE'
  },
  {
    id: 'section-bleeding-remediation',
    step: '04',
    label: 'Remediation',
    sublabel: 'AI Weak Topics & Drills',
    icon: Sparkles,
    status: 'ACTIVE'
  },
  {
    id: 'section-biological-clock',
    step: '05',
    label: 'Bio Clock',
    sublabel: 'Weekly vs. Biweekly',
    icon: Clock,
    status: 'ACTIVE'
  },
  {
    id: 'section-career-ledger',
    step: '06',
    label: 'Ledger',
    sublabel: 'Horizon & History Table',
    icon: Trophy,
    status: 'ACTIVE'
  }
]



export default function DeepDiveStepperHeader({ activeSectionId, onSelectSection }) {
  const activeIndex = DEEP_DIVE_SECTIONS.findIndex((s) => s.id === activeSectionId)
  const currentStepIndex = activeIndex >= 0 ? activeIndex : 0

  const handleStepClick = (sectionId) => {
    if (onSelectSection) {
      onSelectSection(sectionId)
    } else {
      const el = document.getElementById(sectionId)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  // Calculate progress bar fill percentage (from node 0 to node 5)
  const progressPercent = (currentStepIndex / (DEEP_DIVE_SECTIONS.length - 1)) * 100

  return (
    <div className="sticky top-0 z-20 w-full border-b border-neutral-200 bg-white/90 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        {/* Top Kicker & Active Section Name */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Contest Deep Dive Telemetry
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="font-mono text-[11px] text-neutral-600 dark:text-neutral-300 font-semibold">
              Section {DEEP_DIVE_SECTIONS[currentStepIndex].step}: {DEEP_DIVE_SECTIONS[currentStepIndex].label}
            </span>
          </div>

          <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500 hidden sm:inline-block">
            {currentStepIndex + 1} of 6 Milestones
          </span>
        </div>

        {/* ── 0 ──── 0 ──── 0 ──── 0 ──── 0 ──── 0 Connected Interactive Stepper ── */}
        <div className="relative flex items-center justify-between py-1 overflow-x-auto no-scrollbar">
          {/* Background Track Line */}
          <div className="absolute left-6 right-6 top-[18px] h-[2px] bg-neutral-200 dark:bg-neutral-800 -z-0" />

          {/* Animated Active Progress Fill Line */}
          <motion.div
            className="absolute left-6 top-[18px] h-[2px] bg-neutral-900 dark:bg-neutral-100 -z-0"
            initial={{ width: '0%' }}
            animate={{ width: `calc(${progressPercent}% * 0.92)` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />

          {/* Stepper Nodes */}
          {DEEP_DIVE_SECTIONS.map((section, idx) => {
            const isActive = section.id === activeSectionId
            const isCompleted = idx < currentStepIndex
            const Icon = section.icon

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => handleStepClick(section.id)}
                className="group relative z-10 flex flex-col items-center focus:outline-none cursor-pointer shrink-0 px-2 sm:px-3"
              >
                {/* Node Pill / Circle (0) */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-200
                      ${
                        isActive
                          ? 'border-neutral-900 bg-neutral-900 text-white shadow-md dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
                          : isCompleted
                          ? 'border-neutral-900 bg-neutral-100 text-neutral-900 dark:border-neutral-100 dark:bg-neutral-800 dark:text-neutral-100'
                          : 'border-neutral-300 bg-white text-neutral-400 group-hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-500 dark:group-hover:border-neutral-500'
                      }
                    `}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 stroke-[2.5]" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </motion.div>

                  {/* Pulsing ring around active node */}
                  {isActive && (
                    <span className="absolute -inset-1 rounded-full border border-neutral-900/30 dark:border-neutral-100/30 animate-ping pointer-events-none" />
                  )}
                </div>

                {/* Node Label Below Circle */}
                <div className="mt-1.5 flex flex-col items-center text-center">
                  <span
                    className={`
                      font-mono text-[11px] font-bold tracking-tight transition-colors whitespace-nowrap
                      ${
                        isActive
                          ? 'text-neutral-900 dark:text-white'
                          : isCompleted
                          ? 'text-neutral-700 dark:text-neutral-300'
                          : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'
                      }
                    `}
                  >
                    {section.step} {section.label}
                  </span>
                  <span className="text-[9.5px] text-neutral-400 dark:text-neutral-500 hidden md:inline-block whitespace-nowrap">
                    {section.sublabel}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

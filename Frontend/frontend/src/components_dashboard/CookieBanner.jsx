import { useState, useEffect } from 'react'
import { ShieldCheck, X } from 'lucide-react'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('lb_cookie_consent')
      if (!consent) {
        // Small delay so it smoothly appears without jumping during initial render
        const timer = setTimeout(() => setShow(true), 800)
        return () => clearTimeout(timer)
      }
    } catch {
      // Ignore localStorage access restrictions
    }
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem('lb_cookie_consent', 'accepted')
    } catch (e) {
      console.warn('Could not save cookie consent', e)
    }
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      role="region"
      aria-label="Cookie and storage notice"
      className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-md z-40 no-print transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-xl border border-neutral-200/90 bg-white/95 p-4 shadow-xl backdrop-blur-md dark:border-neutral-800/90 dark:bg-neutral-900/95 transition-colors">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400 mt-0.5">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-neutral-900 dark:text-neutral-100 leading-tight">
              Privacy & Storage
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              LeetBuddy uses local storage to keep your session active, remember your theme, and cache your LeetCode stats. No third-party ad tracking.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-lg bg-neutral-900 px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-2xs hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white transition cursor-pointer"
          >
            Got it
          </button>
          <button
            type="button"
            onClick={handleAccept}
            title="Dismiss notice"
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition cursor-pointer"
            aria-label="Dismiss cookie notice"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

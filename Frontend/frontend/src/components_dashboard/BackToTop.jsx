import { useState, useEffect, useCallback } from 'react'
import { ArrowUp } from 'lucide-react'

export default function BackToTop({ scrollContainerId = 'main-content' }) {
  const [visible, setVisible] = useState(false)

  const handleScroll = useCallback(() => {
    let scrolled = 0
    if (scrollContainerId) {
      const container = document.getElementById(scrollContainerId)
      if (container) {
        scrolled = container.scrollTop
      }
    }
    if (!scrolled) {
      scrolled = window.scrollY || document.documentElement.scrollTop
    }
    setVisible(scrolled > 300)
  }, [scrollContainerId])

  useEffect(() => {
    let container = null
    if (scrollContainerId) {
      container = document.getElementById(scrollContainerId)
      if (container) {
        container.addEventListener('scroll', handleScroll, { passive: true })
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
      window.removeEventListener('scroll', handleScroll)
    }
  }, [scrollContainerId, handleScroll])

  const scrollToTop = () => {
    if (scrollContainerId) {
      const container = document.getElementById(scrollContainerId)
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={scrollToTop}
      title="Back to top"
      aria-label="Scroll back to top"
      className="
        fixed bottom-6 right-6 z-30 flex h-9 w-9 items-center justify-center
        rounded-full border border-neutral-200/90 bg-white/90 text-neutral-600
        shadow-lg backdrop-blur-md transition-all duration-200
        hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900
        dark:border-neutral-700/80 dark:bg-neutral-800/90 dark:text-neutral-300
        dark:hover:border-neutral-600 dark:hover:bg-neutral-700 dark:hover:text-white
        no-print cursor-pointer animate-fade-in
      "
    >
      <ArrowUp className="h-4 w-4 stroke-[2.2]" />
    </button>
  )
}

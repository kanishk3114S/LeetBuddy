import { useState, useEffect } from 'react'

export default function ScrollProgress({ containerId = 'main-content' }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calculateProgress = () => {
      let currentProgress = 0
      const container = containerId ? document.getElementById(containerId) : null

      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container
        const total = scrollHeight - clientHeight
        if (total > 0) {
          currentProgress = (scrollTop / total) * 100
        }
      } else {
        const scrollTop = window.scrollY || document.documentElement.scrollTop
        const scrollHeight = document.documentElement.scrollHeight
        const clientHeight = document.documentElement.clientHeight
        const total = scrollHeight - clientHeight
        if (total > 0) {
          currentProgress = (scrollTop / total) * 100
        }
      }

      setProgress(Math.min(100, Math.max(0, currentProgress)))
    }

    const container = containerId ? document.getElementById(containerId) : null
    if (container) {
      container.addEventListener('scroll', calculateProgress, { passive: true })
    }
    window.addEventListener('scroll', calculateProgress, { passive: true })

    return () => {
      if (container) {
        container.removeEventListener('scroll', calculateProgress)
      }
      window.removeEventListener('scroll', calculateProgress)
    }
  }, [containerId])

  if (progress <= 0) return null

  return (
    <div
      aria-hidden="true"
      className="sticky top-0 left-0 right-0 z-40 h-[2.5px] w-full bg-transparent no-print pointer-events-none"
    >
      <div
        className="h-full bg-emerald-500 transition-all duration-150 ease-out dark:bg-emerald-400"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

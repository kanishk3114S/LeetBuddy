import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components_dashboard/Sidebar.jsx'
import DashHeader from '../components_dashboard/DashHeader.jsx'

export default function ContestDeepDive() {
  const [activeNav, setActiveNav] = useState('contest-deep-dive')

  // Restore user info from localStorage
  const user = useMemo(() => ({
    email: localStorage.getItem('lb_email') || '',
    name: localStorage.getItem('lb_name') || ''
  }), [])

  // Profile stats state
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('lb_stats')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Listen for real-time stats updates
  useEffect(() => {
    const handleStatsUpdated = (e) => {
      if (e.detail) setStats(e.detail)
    }
    window.addEventListener('lb_stats_updated', handleStatsUpdated)
    return () => window.removeEventListener('lb_stats_updated', handleStatsUpdated)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 font-[Manrope,Arial,sans-serif] dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Navigation Sidebar */}
      <Sidebar active={activeNav} setActive={setActiveNav} />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashHeader user={user} stats={stats} />

        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {/* Blank Workspace Container */}
          <div className="min-h-[75vh] rounded-xl border border-dashed border-slate-200 dark:border-slate-800/80 flex items-center justify-center p-8 transition-colors bg-slate-50/50 dark:bg-neutral-900/30">
            <span className="font-mono text-xs text-slate-400 dark:text-slate-600 tracking-wide select-none">
              // Deep Dive Telemetry Workspace — Ready for Phase 2 Integration
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

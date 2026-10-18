import { useState, useEffect } from 'react'
import Sidebar from '../components_dashboard/Sidebar.jsx'
import DashHeader from '../components_dashboard/DashHeader.jsx'
import ProgressMountain from '../components_profileAnalyses/ProgressMountain.jsx'
import DifficultyPointsMatrix from '../components_profileAnalyses/DifficultyPointsMatrix.jsx'
import BehavioralConsistencyAnalysis from '../components_profileAnalyses/BehavioralConsistencyAnalysis.jsx'

export default function ProfileAnalysis() {
  const [activeNav, setActiveNav] = useState('profile-analysis')

  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('lb_stats')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Listen for real-time stats updates from refresh or verification
  useEffect(() => {
    const handleStatsUpdated = (e) => {
      if (e.detail) {
        setStats(e.detail)
      }
    }
    window.addEventListener('lb_stats_updated', handleStatsUpdated)
    return () => window.removeEventListener('lb_stats_updated', handleStatsUpdated)
  }, [])

  // Restore user info from localStorage
  const user = {
    email: localStorage.getItem('lb_email') || '',
    name: localStorage.getItem('lb_name') || '',
  }

  // Use actual verified LeetBuddy points, checking both nested and flat shapes
  const leetBuddyPoints = stats?.profile?.stats?.leetBuddyPoints ?? stats?.stats?.leetBuddyPoints ?? 3250

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 font-sans dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar active={activeNav} setActive={setActiveNav} />

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashHeader user={user} stats={stats} />

        {/* Content View with Core Profile Analytics Containers */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Container 1: Progress Mountain & Floating Hero Card */}
          <ProgressMountain leetBuddyPoints={leetBuddyPoints} stats={stats} />

          {/* Container 2: Difficulty & Points Matrix (The "Engine" View) */}
          <DifficultyPointsMatrix stats={stats} />

          {/* Container 3: Behavioral & Consistency Analysis (Temporal Patterns) */}
          <BehavioralConsistencyAnalysis stats={stats} />
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import Sidebar from '../components_dashboard/Sidebar.jsx'
import DashHeader from '../components_dashboard/DashHeader.jsx'
import VerifyFlow from '../components_dashboard/VerifyFlow.jsx'
import StatsView from '../components_dashboard/StatsView.jsx'

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('dashboard')
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('lb_stats')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [isHydrating, setIsHydrating] = useState(!stats)

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

  // Auto-hydrate verified profile directly from MongoDB if stats not in localStorage
  useEffect(() => {
    if (stats) {
      setIsHydrating(false)
      return
    }

    const authToken = localStorage.getItem('accessToken') || localStorage.getItem('lb_token')
    if (!authToken) {
      setIsHydrating(false)
      return
    }

    let isMounted = true
    fetch('/api/leetcode/profile', {
      headers: { Authorization: `Bearer ${authToken}` },
      credentials: 'include'
    })
      .then(res => (res.ok ? res.json() : null))
      .then(payload => {
        if (!isMounted) return
        if (payload?.profile) {
          const profileStats = {
            username: payload.username || payload.user?.leetcode?.username,
            profile: payload.profile
          }
          setStats(profileStats)
          try {
            localStorage.setItem('lb_stats', JSON.stringify(profileStats))
            if (payload.username || payload.user?.leetcode?.username) {
              localStorage.setItem('lb_username', payload.username || payload.user?.leetcode?.username)
            }
          } catch (e) {
            console.warn('Failed to cache hydrated stats', e)
          }
        }
      })
      .catch(err => console.warn('[Dashboard] Could not auto-hydrate profile from DB:', err))
      .finally(() => {
        if (isMounted) setIsHydrating(false)
      })

    return () => {
      isMounted = false
    }
  }, [stats])

  // Restore user from localStorage
  const user = {
    email: localStorage.getItem('lb_email') || '',
    name: localStorage.getItem('lb_name') || '',
  }

  const handleVerified = (data) => {
    setStats(data)
    try {
      localStorage.setItem('lb_stats', JSON.stringify(data))
    } catch (e) {
      console.error('Failed to cache stats in localStorage', e)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 font-sans dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar active={activeNav} setActive={setActiveNav} />

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashHeader user={user} stats={stats} />

        {/* Content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {isHydrating ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
            </div>
          ) : stats ? (
            <StatsView stats={stats} onStatsUpdate={handleVerified} />
          ) : (
            <VerifyFlow onVerified={handleVerified} />
          )}
        </div>
      </div>
    </div>
  )
}

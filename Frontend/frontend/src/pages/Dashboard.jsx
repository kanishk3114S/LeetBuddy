import { useState } from 'react'
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
    <div className="flex h-screen overflow-hidden bg-[#f4f6f2] font-[Manrope,Arial,sans-serif] dark:bg-[#131815] transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar active={activeNav} setActive={setActiveNav} />

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashHeader user={user} />

        {/* Content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {stats ? (
            <StatsView stats={stats} />
          ) : (
            <VerifyFlow onVerified={handleVerified} />
          )}
        </div>
      </div>
    </div>
  )
}

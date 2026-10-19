import { useState, useEffect } from 'react'
import { LogOut, Menu } from 'lucide-react'
import ConfirmationModal from './ConfirmationModal.jsx'
import MobileNavDrawer from './MobileNavDrawer.jsx'

export default function DashHeader({ user, stats }) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [lastUpdatedText, setLastUpdatedText] = useState('')

  const avatarUrl = stats?.profile?.profile?.userAvatar || stats?.profile?.userAvatar || stats?.userAvatar || user?.avatar

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'U'

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  })()

  // Last updated sync relative time tracking
  useEffect(() => {
    const computeRelativeTime = () => {
      let syncIso = localStorage.getItem('lb_last_synced_at')
      if (!syncIso && stats) {
        syncIso = new Date().toISOString()
        try {
          localStorage.setItem('lb_last_synced_at', syncIso)
        } catch {}
      }

      if (!syncIso) {
        setLastUpdatedText('')
        return
      }

      const syncDate = new Date(syncIso)
      const diffSec = Math.floor((Date.now() - syncDate.getTime()) / 1000)

      if (diffSec < 60) {
        setLastUpdatedText('Just now')
      } else if (diffSec < 3600) {
        const m = Math.floor(diffSec / 60)
        setLastUpdatedText(`${m}m ago`)
      } else if (diffSec < 86400) {
        const h = Math.floor(diffSec / 3600)
        setLastUpdatedText(`${h}h ago`)
      } else {
        setLastUpdatedText(syncDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
      }
    }

    computeRelativeTime()
    const interval = setInterval(computeRelativeTime, 30000)

    const handleSyncCompleted = () => computeRelativeTime()
    window.addEventListener('lb_sync_completed', handleSyncCompleted)
    window.addEventListener('lb_stats_updated', handleSyncCompleted)

    return () => {
      clearInterval(interval)
      window.removeEventListener('lb_sync_completed', handleSyncCompleted)
      window.removeEventListener('lb_stats_updated', handleSyncCompleted)
    }
  }, [stats])

  const handleLogout = async () => {
    try {
      const authToken = localStorage.getItem('accessToken') || localStorage.getItem('lb_token')
      await fetch('/api/auth/logout', {
        method: 'GET',
        headers: {
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        credentials: 'include'
      })
    } catch (e) {
      console.warn('Backend logout call skipped/error:', e)
    }

    // Preserve local UI layout preferences
    const savedTheme = localStorage.getItem('theme') || localStorage.getItem('leetbuddy-theme')
    const sidebarPinned = localStorage.getItem('lb_sidebar_pinned')
    const cookieConsent = localStorage.getItem('lb_cookie_consent')

    // Clear all user credentials, tokens, and cached stats
    localStorage.removeItem('lb_stats')
    localStorage.removeItem('lb_contest')
    localStorage.removeItem('lb_hero_card')
    localStorage.removeItem('lb_username')
    localStorage.removeItem('lb_email')
    localStorage.removeItem('lb_name')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('lb_token')
    localStorage.removeItem('lb_profile_analysis')
    localStorage.removeItem('lb_last_synced_at')

    if (savedTheme) localStorage.setItem('theme', savedTheme)
    if (sidebarPinned) localStorage.setItem('lb_sidebar_pinned', sidebarPinned)
    if (cookieConsent) localStorage.setItem('lb_cookie_consent', cookieConsent)

    // Fire events to notify active components immediately
    window.dispatchEvent(new CustomEvent('lb_stats_updated', { detail: null }))
    window.dispatchEvent(new CustomEvent('lb_contest_updated', { detail: null }))
    window.dispatchEvent(new CustomEvent('lb_hero_card_updated', { detail: null }))

    // Redirect to auth page
    window.location.href = '/auth'
  }

  return (
    <>
      <header className="
        flex h-[60px] items-center justify-between border-b border-neutral-200
        bg-white px-4 sm:px-6 dark:border-neutral-800 dark:bg-neutral-900
        transition-colors duration-300 no-print
      ">
        {/* Left: Mobile hamburger + greeting */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileNavOpen(true)}
            className="md:hidden rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white transition cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <p className="text-[11px] sm:text-[12px] text-neutral-500 dark:text-neutral-400">
              {greeting}
            </p>
            <h2 className="text-[14px] sm:text-[15px] font-bold tracking-[-0.4px] text-neutral-900 dark:text-neutral-100 leading-tight truncate max-w-[170px] sm:max-w-none">
              {user?.name || user?.email || 'Welcome'}
            </h2>
          </div>
        </div>

        {/* Right: status + updated date + logout button + avatar */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Connected</span>
            {lastUpdatedText && (
              <>
                <span className="text-neutral-300 dark:text-neutral-700">•</span>
                <span title="Last time profile data was synchronized">Updated {lastUpdatedText}</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsLogoutModalOpen(true)}
            title="Log out and re-verify profile"
            className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-1 font-mono text-[11px] font-semibold text-neutral-600 shadow-2xs transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:border-rose-900/60 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 cursor-pointer"
          >
            <LogOut className="h-3 w-3 stroke-[2]" />
            <span className="hidden xs:inline">Log Out</span>
          </button>

          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Profile Avatar"
              className="h-8 w-8 rounded-full border border-neutral-200 object-cover dark:border-neutral-700 shrink-0"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-[12px] font-bold text-white dark:bg-neutral-100 dark:text-neutral-900 shrink-0">
              {initials}
            </div>
          )}
        </div>
      </header>

      {/* Confirmation Modal for Log Out */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Log out of LeetBuddy?"
        description="Are you sure you want to log out? Your verified LeetCode profile will remain safe, but you will need to sign in again to access your dashboard."
        confirmText="Log Out"
        cancelText="Cancel"
        danger={true}
      />

      {/* Mobile Drawer Navigation */}
      <MobileNavDrawer
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        user={user}
        stats={stats}
        onLogoutClick={() => setIsLogoutModalOpen(true)}
      />
    </>
  )
}

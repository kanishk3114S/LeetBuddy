import { LogOut } from 'lucide-react'

export default function DashHeader({ user, stats }) {
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

    if (savedTheme) localStorage.setItem('theme', savedTheme)
    if (sidebarPinned) localStorage.setItem('lb_sidebar_pinned', sidebarPinned)

    // Fire events to notify active components immediately
    window.dispatchEvent(new CustomEvent('lb_stats_updated', { detail: null }))
    window.dispatchEvent(new CustomEvent('lb_contest_updated', { detail: null }))
    window.dispatchEvent(new CustomEvent('lb_hero_card_updated', { detail: null }))

    // Redirect to auth page
    window.location.href = '/auth'
  }

  return (
    <header className="
      flex h-[60px] items-center justify-between border-b border-neutral-200
      bg-white px-6 dark:border-neutral-800 dark:bg-neutral-900
      transition-colors duration-300
    ">
      {/* Left: greeting */}
      <div>
        <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
          {greeting}
        </p>
        <h2 className="text-[15px] font-bold tracking-[-0.4px] text-neutral-900 dark:text-neutral-100 leading-tight">
          {user?.name || user?.email || 'Welcome'}
        </h2>
      </div>

      {/* Right: status + logout button + avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
            Connected
          </span>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          title="Log out and re-verify profile"
          className="flex items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 font-mono text-[11px] font-semibold text-neutral-600 shadow-2xs transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:border-rose-900/60 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 cursor-pointer"
        >
          <LogOut className="h-3 w-3 stroke-[2]" />
          <span>Log Out</span>
        </button>

        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile Avatar"
            className="h-8 w-8 rounded-full border border-neutral-200 object-cover dark:border-neutral-700"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-[12px] font-bold text-white dark:bg-neutral-100 dark:text-neutral-900">
            {initials}
          </div>
        )}
      </div>
    </header>
  )
}


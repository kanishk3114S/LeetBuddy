import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { X, LogOut } from 'lucide-react'
import ThemeToggle from './ThemeToggle.jsx'

export default function MobileNavDrawer({
  isOpen,
  onClose,
  user,
  stats,
  onLogoutClick
}) {
  const navigate = useNavigate()
  const location = useLocation()

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: '⌘', path: '/dashboard' },
    { id: 'profile-analysis', label: 'Profile Insights', icon: '◔', path: '/profile-analysis' },
    { id: 'topic-mastery', label: 'Topic Mastery', icon: '◈', path: '/topic-mastery' },
    { id: 'contests', label: 'Contest Analysis', icon: '⌁', path: '/contest-analysis' },
    { id: 'contest-deep-dive', label: 'Deep Dive', icon: '⌖', path: '/contest-analysis/deep-dive' },
    { id: 'weakness', label: 'Weakness AI', icon: '✦', path: '/weakness-ai', badge: 'AI' }
  ]

  const handleNavClick = (path) => {
    onClose()
    if (location.pathname !== path) {
      navigate(path)
    }
  }

  const username = stats?.username || stats?.profile?.username || user?.name || user?.email || 'User'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-xs no-print"
      onClick={onClose}
    >
      <div
        className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 shadow-2xl transition-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex h-[60px] items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <span className="flex h-[26px] w-[26px] shrink-0 items-end justify-center gap-[2px] rounded-[7px] border-2 border-neutral-900 p-0.5 dark:border-neutral-100 shadow-sm">
              <i className="h-[5px] w-[2.5px] rounded-sm bg-neutral-900 dark:bg-neutral-100" />
              <i className="h-[10px] w-[2.5px] rounded-sm bg-neutral-900 dark:bg-neutral-100" />
              <i className="h-[7px] w-[2.5px] rounded-sm bg-neutral-900 dark:bg-neutral-100" />
            </span>
            <span className="font-heading text-[15px] font-extrabold tracking-[-0.4px] text-neutral-900 dark:text-neutral-100">
              LeetBuddy
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 dark:hover:bg-neutral-800 dark:hover:text-neutral-200 transition"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Identity Snippet */}
        <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-950/30">
          <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
            Connected Account
          </p>
          <p className="text-[13px] font-bold text-neutral-900 dark:text-neutral-100 truncate mt-0.5">
            {username}
          </p>
        </div>

        {/* Nav Items List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[10px] font-mono uppercase tracking-[1.3px] text-neutral-400">
            Navigation
          </p>

          {NAV_ITEMS.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.id === 'contests' && location.pathname === '/contest-analysis') ||
              (item.id === 'contest-deep-dive' && location.pathname.includes('deep-dive'))

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.path)}
                className={`
                  flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-all
                  ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-sm dark:bg-neutral-100 dark:text-neutral-900'
                      : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[16px] w-5 text-center">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded px-1.5 py-0.2 font-mono text-[9px] font-bold uppercase ${
                      isActive
                        ? 'bg-white/20 text-white dark:bg-black/10 dark:text-neutral-900'
                        : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer with ThemeToggle and Log Out */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-neutral-600 dark:text-neutral-400">
              Interface Theme
            </span>
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={() => {
              onClose()
              if (onLogoutClick) onLogoutClick()
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 py-2 font-mono text-[11px] font-semibold text-neutral-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 dark:border-neutral-800 dark:bg-neutral-800/80 dark:text-neutral-400 dark:hover:border-rose-900/60 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition"
          >
            <LogOut className="h-3.5 w-3.5 stroke-[2]" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}

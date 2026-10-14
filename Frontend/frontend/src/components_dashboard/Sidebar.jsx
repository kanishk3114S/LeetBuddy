import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'

export default function Sidebar({ active, setActive }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(() => {
    try {
      return localStorage.getItem('lb_sidebar_pinned') === 'true'
    } catch {
      return false
    }
  })

  const togglePin = () => {
    setIsPinned((prev) => {
      const next = !prev
      try {
        localStorage.setItem('lb_sidebar_pinned', String(next))
      } catch (e) {
        console.error('Failed to save sidebar pin state', e)
      }
      return next
    })
  }

  const isExpanded = isHovered || isPinned

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: '⌘', path: '/dashboard' },
    { id: 'profile-analysis', label: 'Profile Insights', icon: '◔', path: '/profile-analysis' },
    { id: 'contests', label: 'Contest', icon: '⌁', badge: 'Soon', disabled: true },
    { id: 'weakness', label: 'Weakness', icon: '✦', badge: 'Soon', disabled: true },
  ]

  const currentActive = active || (
    location.pathname.startsWith('/profile') ? 'profile-analysis' : 'dashboard'
  )

  const handleNavClick = (item) => {
    if (item.disabled) return
    if (setActive) setActive(item.id)
    if (item.path && location.pathname !== item.path) {
      navigate(item.path)
    }
  }

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative flex h-screen flex-col border-r border-neutral-200
        bg-white dark:border-neutral-800 dark:bg-neutral-900
        transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        shrink-0 z-30 select-none
        ${isExpanded ? 'w-[240px] shadow-xl dark:shadow-2xl' : 'w-[68px]'}
      `}
    >
      {/* ── Brand Section ────────────────────────────────────────────── */}
      <div className="flex h-[60px] items-center px-4 border-b border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="flex items-center gap-3 min-w-[200px]">
          {/* Logo Icon */}
          <span className="flex h-[28px] w-[28px] shrink-0 items-end justify-center gap-[2px] rounded-[8px] border-2 border-neutral-900 p-1 dark:border-neutral-100 shadow-sm">
            <i className="h-[6px] w-[3px] rounded-sm bg-neutral-900 dark:bg-neutral-100" />
            <i className="h-[12px] w-[3px] rounded-sm bg-neutral-900 dark:bg-neutral-100" />
            <i className="h-[8px] w-[3px] rounded-sm bg-neutral-900 dark:bg-neutral-100" />
          </span>

          {/* Brand Name Text (Fades in when expanded) */}
          <div
            className={`
              flex items-center justify-between flex-1 transition-all duration-200
              ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}
            `}
          >
            <span className="text-[15px] font-extrabold tracking-[-0.5px] text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
              LeetBuddy
            </span>
            <button
              type="button"
              onClick={togglePin}
              title={isPinned ? 'Unpin sidebar' : 'Pin sidebar open'}
              className="rounded p-1 text-[11px] text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"
            >
              {isPinned ? '📌' : '⊞'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Navigation Section ────────────────────────────────────────── */}
      <nav className="flex-1 px-2.5 py-4 space-y-1 overflow-x-hidden overflow-y-auto">
        {/* Section Label */}
        <div
          className={`
            px-2.5 mb-2 transition-all duration-200
            ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 my-0 overflow-hidden'}
          `}
        >
          <span className="font-mono text-[10px] uppercase tracking-[1.3px] text-neutral-400 dark:text-neutral-500">
            Overview
          </span>
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = currentActive === item.id
          return (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={() => handleNavClick(item)}
              className={`
                group relative flex w-full items-center rounded-[9px] py-2.5 transition-all duration-200
                ${isExpanded ? 'px-3 justify-start' : 'px-0 justify-center'}
                ${item.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${isActive
                  ? 'bg-neutral-900 text-white shadow-sm dark:bg-neutral-100 dark:text-neutral-900 font-bold'
                  : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                }
              `}
            >
              {/* Active left indicator bar for collapsed mode */}
              {isActive && !isExpanded && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-neutral-900 dark:bg-neutral-100" />
              )}

              {/* Icon */}
              <span className="text-[17px] shrink-0 w-6 flex items-center justify-center">
                {item.icon}
              </span>

              {/* Label & Badges (Visible on expansion) */}
              <div
                className={`
                  flex items-center justify-between flex-1 ml-2.5 overflow-hidden transition-all duration-200
                  ${isExpanded ? 'opacity-100 max-w-[150px]' : 'opacity-0 max-w-0 pointer-events-none'}
                `}
              >
                <span className="text-[13px] whitespace-nowrap truncate">
                  {item.label}
                </span>

                {item.badge && (
                  <span
                    className={`
                      ml-2 rounded px-1.5 py-0.5 font-mono text-[9px] font-extrabold uppercase shrink-0
                      ${isActive
                        ? 'bg-white/20 text-white dark:bg-black/10 dark:text-neutral-900'
                        : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Floating Tooltip (Shown ONLY when collapsed on individual hover) */}
              {!isExpanded && (
                <div className="absolute left-[72px] top-1/2 -translate-y-1/2 z-50 hidden rounded-md bg-neutral-900 px-2.5 py-1 text-xs font-semibold text-white shadow-lg group-hover:block dark:bg-neutral-100 dark:text-neutral-900 whitespace-nowrap pointer-events-none">
                  {item.label}
                  {item.badge && <span className="ml-1.5 text-[10px] opacity-75">({item.badge})</span>}
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Footer Section ───────────────────────────────────────────── */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 p-3 flex items-center justify-between overflow-hidden">
        <div
          className={`
            flex items-center gap-2 transition-all duration-200
            ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}
          `}
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
            Copilot v1.0
          </span>
        </div>

        {/* Theme Toggle Button */}
        <div className={`transition-all duration-200 ${!isExpanded ? 'mx-auto' : ''}`}>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}

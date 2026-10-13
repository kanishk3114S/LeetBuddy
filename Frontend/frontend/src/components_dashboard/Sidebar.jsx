import { useState } from 'react'
import { useTheme } from '../hooks/useTheme.js'
import ThemeToggle from './ThemeToggle.jsx'

export default function Sidebar({ active, setActive }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setIsPinned] = useState(false)

  const isExpanded = isHovered || isPinned

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Dashboard', icon: '⌘', badge: 'Active' },
    { id: 'contests', label: 'Contests', icon: '⌁', badge: 'Soon', disabled: true },
    { id: 'weakness', label: 'Weakness AI', icon: '✦', badge: 'Soon', disabled: true },
    { id: 'settings', label: 'Settings', icon: '⚙', badge: null, disabled: true },
  ]

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative flex h-screen flex-col border-r border-[#e3e5e1]
        bg-[#fafaf8] dark:border-[#2d3730] dark:bg-[#161c18]
        transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        shrink-0 z-30 select-none
        ${isExpanded ? 'w-[240px] shadow-xl dark:shadow-2xl' : 'w-[68px]'}
      `}
    >
      {/* ── Brand Section ────────────────────────────────────────────── */}
      <div className="flex h-[62px] items-center px-4 border-b border-[#e3e5e1] dark:border-[#2d3730] overflow-hidden">
        <div className="flex items-center gap-3 min-w-[200px]">
          {/* Logo Icon */}
          <span className="flex h-[28px] w-[28px] shrink-0 items-end justify-center gap-[2px] rounded-[8px] border-2 border-[#171a1d] p-1 dark:border-[#edf2ed] shadow-sm">
            <i className="h-[6px] w-[3px] rounded-sm bg-[#171a1d] dark:bg-[#edf2ed]" />
            <i className="h-[12px] w-[3px] rounded-sm bg-[#171a1d] dark:bg-[#edf2ed]" />
            <i className="h-[8px] w-[3px] rounded-sm bg-[#171a1d] dark:bg-[#edf2ed]" />
          </span>

          {/* Brand Name Text (Fades in when expanded) */}
          <div
            className={`
              flex items-center justify-between flex-1 transition-all duration-200
              ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}
            `}
          >
            <span className="text-[15px] font-extrabold tracking-[-0.5px] text-[#171a1d] dark:text-[#edf2ed] whitespace-nowrap">
              LeetBuddy
            </span>
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              title={isPinned ? 'Unpin sidebar' : 'Pin sidebar open'}
              className="rounded p-1 text-[11px] text-[#9ba4a0] hover:text-[#171a1d] dark:hover:text-white transition"
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
          <span className="font-mono text-[10px] uppercase tracking-[1.3px] text-[#9ba4a0] dark:text-[#5a6660]">
            Overview
          </span>
        </div>

        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              onClick={() => !item.disabled && setActive(item.id)}
              className={`
                group relative flex w-full items-center rounded-[9px] py-2.5 transition-all duration-200
                ${isExpanded ? 'px-3 justify-start' : 'px-0 justify-center'}
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isActive
                  ? 'bg-[#171a1d] text-white shadow-sm dark:bg-[#c5ef75] dark:text-[#172011] font-bold'
                  : 'text-[#4f5955] hover:bg-[#eef0ec] dark:text-[#9fb8a8] dark:hover:bg-[#1f2822]'
                }
              `}
            >
              {/* Active left indicator bar for collapsed mode */}
              {isActive && !isExpanded && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-[#171a1d] dark:bg-[#c5ef75]" />
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
                        ? 'bg-white/20 text-white dark:bg-black/15 dark:text-[#172011]'
                        : 'bg-[#e3e5e1] text-[#71787f] dark:bg-[#2d3730] dark:text-[#8d988e]'
                      }
                    `}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Floating Tooltip (Shown ONLY when collapsed on individual hover) */}
              {!isExpanded && (
                <div className="absolute left-[72px] top-1/2 -translate-y-1/2 z-50 hidden rounded-md bg-[#171a1d] px-2.5 py-1 text-xs font-semibold text-white shadow-lg group-hover:block dark:bg-[#edf2ed] dark:text-[#171a1d] whitespace-nowrap pointer-events-none">
                  {item.label}
                  {item.badge && <span className="ml-1.5 text-[10px] opacity-75">({item.badge})</span>}
                </div>
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Footer Section ───────────────────────────────────────────── */}
      <div className="border-t border-[#e3e5e1] dark:border-[#2d3730] p-3 flex items-center justify-between overflow-hidden">
        <div
          className={`
            flex items-center gap-2 transition-all duration-200
            ${isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'}
          `}
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] text-[#9ba4a0] dark:text-[#5a6660] whitespace-nowrap">
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

import { useState } from 'react'
import { calculateRank, RANKS_LIST } from '../utils/rankings.js'
import BadgeImage from './BadgeImage.jsx'
import HeroCard from './HeroCard.jsx'

// Helper to format concise points range for display below each mountain bar
const getPointsRangeLabel = (tier) => {
  switch (tier) {
    case 1: return '0 - 500'
    case 2: return '501 - 1k'
    case 3: return '1k - 1.5k'
    case 4: return '1.5k - 2k'
    case 5: return '2k - 2.5k'
    case 6: return '2.5k - 3k'
    case 7: return '3k - 4k'
    case 8: return '4k - 5k'
    case 9: return '5k - 7k'
    case 10: return '7k - 10k'
    case 11: return '10k+'
    default: return ''
  }
}

// Helper to format exact points range for tooltips
const getFullPointsRange = (rank) => {
  if (rank.maxPoints === Infinity || !rank.maxPoints) {
    return `${rank.minPoints.toLocaleString()}+ pts`
  }
  return `${rank.minPoints.toLocaleString()} - ${rank.maxPoints.toLocaleString()} pts`
}

// Cute Climber SVG Component (Proportionally scaled for ladder chart)
function ClimberAvatar({ rankColor = '#2563eb' }) {
  return (
    <div className="relative flex flex-col items-center select-none pointer-events-none animate-bounce" style={{ animationDuration: '2.5s' }}>
      {/* Hand-drawn style 'you are here' arrow & text callout */}
      <div className="absolute -top-7 -left-18 sm:-left-20 flex items-center gap-1 whitespace-nowrap z-10 pointer-events-none">
        <span
          className="font-mono text-[11px] sm:text-[12px] font-extrabold tracking-tight rotate-[-8deg] drop-shadow-sm select-none"
          style={{ color: rankColor }}
        >
          you are here
        </span>
        <svg
          width="18"
          height="14"
          viewBox="0 0 32 24"
          fill="none"
          className="rotate-[-8deg] shrink-0"
        >
          <path
            d="M2 18 C 10 4, 20 6, 28 14"
            stroke={rankColor}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M22 14 L 28 14 L 27 8"
            stroke={rankColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Climber Character (Stick-figure / backpack adventurer) */}
      <svg
        width="20"
        height="26"
        viewBox="0 0 40 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Head */}
        <circle cx="20" cy="10" r="6.5" stroke={rankColor} strokeWidth="2.5" fill="currentColor" className="text-white dark:text-neutral-900" />
        {/* Climbing Cap */}
        <path d="M14 8 C14 4, 26 4, 26 8 Z" fill={rankColor} />
        <circle cx="23" cy="7" r="1.8" fill="#FFFFFF" />

        {/* Body Spine */}
        <line x1="20" y1="16.5" x2="20" y2="29" stroke={rankColor} strokeWidth="2.5" strokeLinecap="round" />

        {/* Climber Backpack */}
        <rect x="11" y="18" width="6.5" height="9.5" rx="2" fill={rankColor} opacity="0.85" />

        {/* Arms */}
        <path d="M20 19 L27 17 L30 22" stroke={rankColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 19 L15 23" stroke={rankColor} strokeWidth="2.2" strokeLinecap="round" />

        {/* Climbing Flag */}
        <line x1="30" y1="12" x2="30" y2="26" stroke="#9ca3af" strokeWidth="1.5" />
        <polygon points="30,12 37,14.5 30,17" fill={rankColor} />

        {/* Legs */}
        <path d="M20 29 L15 37 L12 43" stroke={rankColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 29 L25 35 L27 43" stroke={rankColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="43" r="2.2" fill={rankColor} />
        <circle cx="27" cy="43" r="2.2" fill={rankColor} />
      </svg>
    </div>
  )
}

export default function ProgressMountain({ leetBuddyPoints = 0, stats = null, className = '' }) {
  const currentRank = calculateRank(leetBuddyPoints)
  const [hoveredTier, setHoveredTier] = useState(null)

  // Find next tier for progression calculations
  const nextRank = RANKS_LIST.find((r) => r.tier === currentRank.tier + 1) || null

  // Calculate percentage toward next tier
  let progressPercent = 100
  let pointsToNext = 0

  if (nextRank) {
    const tierRange = nextRank.minPoints - currentRank.minPoints
    const pointsEarnedInTier = Math.max(0, leetBuddyPoints - currentRank.minPoints)
    progressPercent = Math.min(100, Math.max(0, Math.round((pointsEarnedInTier / tierRange) * 100)))
    pointsToNext = Math.max(0, nextRank.minPoints - leetBuddyPoints)
  }

  // Active tier being hovered or fallback to user's current rank
  const activeInspection = hoveredTier
    ? RANKS_LIST.find((r) => r.tier === hoveredTier)
    : currentRank

  return (
    <div className={`w-full space-y-5 select-none ${className}`}>
      {/* ── Top Overview Dashboard Card (Full Width, Clean Light/Dark) ─ */}
      <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
        {/* Subtle ambient rank glow */}
        <div
          className="absolute -right-6 -top-6 h-28 w-28 rounded-full blur-2xl opacity-20 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: currentRank.color }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Header Row: Badge + Rank Title */}
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="relative shrink-0">
              <BadgeImage tier={currentRank.tier} size="lg" />
              <span
                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black text-black shadow-xs border border-white dark:border-neutral-900"
                style={{ backgroundColor: currentRank.color }}
              >
                {currentRank.tier}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Current Rank
                </span>
                <span
                  className="rounded px-1.5 py-0.2 text-[9px] font-bold font-mono"
                  style={{
                    backgroundColor: `${currentRank.color}20`,
                    color: currentRank.color,
                  }}
                >
                  Tier {currentRank.tier} of 11
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-black tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight mt-0.5">
                {currentRank.title}
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                Score: <strong className="font-mono text-neutral-900 dark:text-neutral-100">{Number(leetBuddyPoints || 0).toLocaleString()}</strong> pts
              </p>
            </div>
          </div>

          {/* Right Section: Hero Card Pill (Shifted Right with Clean Spacing) + Progress Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 md:ml-auto">
            <div className="shrink-0">
              <HeroCard stats={stats} rank={currentRank} />
            </div>

            {/* Progress to Next Rank */}
            <div className="w-full sm:w-64 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500 dark:text-neutral-400 truncate">
                {nextRank ? (
                  <>Next: <strong className="text-neutral-800 dark:text-neutral-200">{nextRank.title}</strong></>
                ) : (
                  <span className="font-bold text-amber-500">Max Rank Reached 👑</span>
                )}
              </span>

              <span className="font-mono font-bold text-neutral-600 dark:text-neutral-300">
                {nextRank ? `${progressPercent}%` : '100%'}
              </span>
            </div>

            {/* Progress Bar Track */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: currentRank.color,
                }}
              />
            </div>

            {nextRank && (
              <p className="text-[10px] text-neutral-400 dark:text-neutral-500 text-right font-mono">
                {pointsToNext.toLocaleString()} pts to unlock Tier {nextRank.tier}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* ── Main Mountain Climbing Ladder Chart (Full Width, Height Unchanged) ─── */}
      <div className="relative rounded-xl border border-neutral-200 bg-white p-4 sm:p-5 shadow-xs dark:border-neutral-800 dark:bg-neutral-900 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Progress Mountain
            </h3>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
              Points range indicated below each tier. Hover over any bar to see points needed.
            </p>
          </div>

          {/* Active Inspection Pill */}
          <div
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 border text-[10px] font-bold transition-all"
            style={{
              borderColor: `${activeInspection.color}40`,
              backgroundColor: `${activeInspection.color}15`,
              color: activeInspection.color,
            }}
          >
            <BadgeImage tier={activeInspection.tier} size="xs" />
            <span>Tier {activeInspection.tier}: {activeInspection.title}</span>
          </div>
        </div>

        {/* ── 11 Mountain Bars System (1.5x Taller Bars, Strictly Even Gap, Same Container Height) ── */}
        <div className="relative pt-14 sm:pt-16 pb-2 overflow-x-auto">
          {/* Bars Row: CSS Grid ensures mathematically 100% EVEN distance between every bar */}
          <div className="min-w-[500px] sm:min-w-0 w-full h-[190px] grid grid-cols-11 gap-2 sm:gap-2.5 px-1 items-end">
            {RANKS_LIST.map((rank) => {
              const isCurrent = rank.tier === currentRank.tier
              const isAchieved = rank.tier < currentRank.tier
              const isLocked = rank.tier > currentRank.tier
              const isHovered = hoveredTier === rank.tier

              // Points needed to reach this specific tier from user's current points
              const pointsNeeded = Math.max(0, rank.minPoints - Number(leetBuddyPoints || 0))

              // Strictly even progression (1.5x taller: 21% to 88%, step delta = +6.7% per tier)
              const stepHeightPercent = 21 + (rank.tier - 1) * 6.7

              return (
                <div
                  key={rank.tier}
                  onMouseEnter={() => setHoveredTier(rank.tier)}
                  onMouseLeave={() => setHoveredTier(null)}
                  className="relative flex flex-col items-center justify-end h-full w-full group cursor-pointer"
                >
                  {/* Floating Tooltip on Hover: Anchored directly above each bar with ample headroom, never cut off */}
                  {isHovered && (
                    <div
                      className="absolute z-40 flex flex-col items-center whitespace-nowrap rounded-lg border bg-white dark:bg-neutral-950 px-2.5 py-1.5 text-center text-neutral-900 dark:text-white shadow-xl pointer-events-none transition-all duration-150"
                      style={{
                        borderColor: rank.color,
                        bottom: isCurrent
                          ? `calc(${stepHeightPercent}% + 46px)`
                          : `calc(${stepHeightPercent}% + 14px)`
                      }}
                    >
                      <div className="flex items-center gap-1 font-bold text-[10px]" style={{ color: rank.color }}>
                        <span>T{rank.tier}</span>
                        <span>•</span>
                        <span>{rank.title}</span>
                      </div>

                      {/* Explicit Points Range in Tooltip */}
                      <span className="font-mono text-[9px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {getFullPointsRange(rank)}
                      </span>

                      {/* Prominent Points Needed Badge: e.g. [1,500 pts] */}
                      <div className="mt-1">
                        {isLocked ? (
                          <span
                            className="rounded px-1.5 py-0.2 font-mono text-[9px] font-black tracking-tight"
                            style={{
                              backgroundColor: `${rank.color}25`,
                              color: rank.color,
                            }}
                          >
                            [{pointsNeeded.toLocaleString()} pts needed]
                          </span>
                        ) : isCurrent ? (
                          <span className="rounded px-1.5 py-0.2 font-mono text-[8px] font-bold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
                            [Current Rank]
                          </span>
                        ) : (
                          <span className="rounded px-1.5 py-0.2 font-mono text-[8px] font-bold bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                            [Achieved ✓]
                          </span>
                        )}
                      </div>

                      {/* Tooltip Down Arrow */}
                      <div
                        className="absolute -bottom-1 h-1.5 w-1.5 rotate-45 border-r border-b bg-white dark:bg-neutral-950"
                        style={{ borderColor: rank.color }}
                      />
                    </div>
                  )}

                  {/* Climber Avatar on Top of the Active Bar */}
                  {isCurrent && (
                    <div
                      className="absolute z-20 flex flex-col items-center pointer-events-none transition-all duration-300"
                      style={{ bottom: `${stepHeightPercent}%` }}
                    >
                      <ClimberAvatar rankColor={rank.color} />
                    </div>
                  )}

                  {/* ── Vertical Step Bar (1.5x Taller, Uniform width, strictly equal gap) ── */}
                  <div
                    className={`
                      w-full rounded-t-lg transition-all duration-200 ease-out border relative flex flex-col items-center overflow-hidden
                      ${isCurrent
                        ? 'border scale-100 shadow-sm'
                        : isHovered
                        ? 'scale-[1.03] shadow-md'
                        : 'border-transparent opacity-85 hover:opacity-100'
                      }
                    `}
                    style={{
                      height: `${stepHeightPercent}%`,
                      borderColor: isCurrent || isHovered ? rank.color : 'transparent',
                      background: isCurrent
                        ? `linear-gradient(180deg, ${rank.color}55 0%, ${rank.color}20 100%)`
                        : isHovered
                        ? `linear-gradient(180deg, ${rank.color}40 0%, ${rank.color}15 100%)`
                        : isAchieved
                        ? 'linear-gradient(180deg, rgba(140, 150, 160, 0.25) 0%, rgba(140, 150, 160, 0.08) 100%)'
                        : 'linear-gradient(180deg, rgba(140, 150, 160, 0.12) 0%, rgba(140, 150, 160, 0.03) 100%)',
                      boxShadow: isCurrent
                        ? `0 0 12px ${rank.color}40`
                        : isHovered
                        ? `0 0 8px ${rank.color}30`
                        : 'none',
                    }}
                  >
                    {/* Top Edge Highlight */}
                    <div
                      className="h-1 w-full rounded-t-lg transition-opacity duration-300 shrink-0"
                      style={{
                        backgroundColor: isCurrent || isHovered ? rank.color : 'transparent',
                        opacity: isCurrent || isHovered ? 0.95 : 0.3,
                      }}
                    />

                    {/* Tier Rank Badge Displayed Inside the Bar */}
                    <div className="pt-1 sm:pt-1.5 flex items-center justify-center shrink-0">
                      <div
                        className={`transition-all duration-200 ${
                          isCurrent
                            ? 'scale-110 drop-shadow-md opacity-100'
                            : isHovered
                            ? 'scale-110 drop-shadow-md opacity-100'
                            : isAchieved
                            ? 'opacity-85 group-hover:opacity-100'
                            : 'opacity-40 grayscale-[35%] group-hover:opacity-90 group-hover:grayscale-0'
                        }`}
                      >
                        <BadgeImage
                          tier={rank.tier}
                          size="xs"
                          className="pointer-events-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Bottom Mountain Base Axis Ground Line */}
          <div className="h-[1.5px] w-full rounded-full bg-neutral-200 dark:bg-neutral-800" />

          {/* Bottom Labels: CSS Grid ensures mathematically 100% EVEN distance below bars */}
          <div className="min-w-[500px] sm:min-w-0 w-full grid grid-cols-11 gap-2 sm:gap-2.5 px-1 mt-3 sm:mt-3.5">
            {RANKS_LIST.map((rank) => {
              const isCurrent = rank.tier === currentRank.tier
              const isHovered = hoveredTier === rank.tier

              return (
                <div
                  key={rank.tier}
                  onMouseEnter={() => setHoveredTier(rank.tier)}
                  onMouseLeave={() => setHoveredTier(null)}
                  className="flex flex-col items-center text-center cursor-pointer group"
                >
                  {/* Points Range: Mentioned clearly in bottom area */}
                  <span
                    className={`font-mono text-[9px] sm:text-[10px] font-extrabold tracking-tight transition-all whitespace-nowrap ${
                      isCurrent
                        ? 'font-black scale-105'
                        : isHovered
                        ? 'opacity-100 font-extrabold'
                        : 'opacity-75 text-neutral-500 dark:text-neutral-400'
                    }`}
                    style={{ color: isCurrent || isHovered ? rank.color : undefined }}
                  >
                    {getPointsRangeLabel(rank.tier)}
                  </span>

                  {/* Tier Number & Title */}
                  <span
                    className={`text-[9px] sm:text-[10.5px] font-bold truncate max-w-[56px] sm:max-w-[64px] transition-colors mt-0.5 ${
                      isCurrent ? 'font-black' : 'text-neutral-400 dark:text-neutral-500'
                    }`}
                    style={{ color: isCurrent ? rank.color : undefined }}
                    title={`${rank.title} (Tier ${rank.tier}): ${getFullPointsRange(rank)}`}
                  >
                    T{rank.tier}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

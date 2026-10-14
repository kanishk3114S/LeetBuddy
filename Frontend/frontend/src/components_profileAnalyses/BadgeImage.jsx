import { useState } from 'react'
import { RANKS_LIST } from '../utils/rankings.js'

const SIZE_MAP = {
  xs: 'w-5 h-5 sm:w-6 sm:h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
  xl: 'w-16 h-16',
}

export default function BadgeImage({ tier = 1, size = 'md', className = '' }) {
  const [imgError, setImgError] = useState(false)
  const clampedTier = Math.max(1, Math.min(11, Number(tier) || 1))
  const rankInfo = RANKS_LIST.find((r) => r.tier === clampedTier) || RANKS_LIST[0]

  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md

  // If real image loads, use individual clean transparent PNG
  if (!imgError) {
    return (
      <div className={`relative shrink-0 flex items-center justify-center ${sizeClass} ${className}`}>
        <img
          src={`/badges/tier-${clampedTier}.png`}
          alt={`${rankInfo.title} Badge`}
          title={`Tier ${clampedTier}: ${rankInfo.title}`}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:scale-105"
        />
      </div>
    )
  }

  // High-fidelity vector SVG fallback
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-full ${sizeClass} ${className}`}
      title={`${rankInfo.title} (Tier ${clampedTier})`}
      style={{
        filter: `drop-shadow(0 2px 6px ${rankInfo.color}50)`,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke={rankInfo.color}
          strokeWidth="3.5"
          strokeDasharray="4 2"
          className="opacity-80"
        />
        <path
          d="M50 14 L80 28 V54 C80 72 50 86 50 86 C50 86 20 72 20 54 V28 Z"
          fill="#161b22"
          stroke={rankInfo.color}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M50 24 L70 35 V52 C70 64 50 75 50 75 C50 75 30 64 30 52 V35 Z"
          fill={`${rankInfo.color}30`}
          stroke={rankInfo.color}
          strokeWidth="1.5"
        />
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fill="#FFFFFF"
          fontWeight="900"
          fontSize={clampedTier >= 10 ? '20' : '24'}
          fontFamily="monospace"
        >
          {clampedTier}
        </text>
      </svg>
    </div>
  )
}

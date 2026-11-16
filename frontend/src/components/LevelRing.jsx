import { clampPercent } from '../lib/format'

export default function LevelRing({ level = 1, percent = 0, size = 136, stroke = 9 }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const progress = clampPercent(percent)
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--c-line)"
          strokeWidth={stroke}
          opacity="0.6"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--c-accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 640ms cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-muted">
          Уровень
        </span>
        <span className="font-display text-[34px] font-semibold leading-none text-ink">{level}</span>
        <span className="mt-1 text-[10px] font-medium text-muted">{Math.round(progress)}%</span>
      </div>
    </div>
  )
}

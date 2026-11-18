import { clampPercent } from '../lib/format'

/**
 * Segmented progress bar used for XP / level meters (Figma: 20 small blocks).
 */
export default function SegmentBar({
  value = 0,
  segments = 20,
  tone = 'var(--c-positive)',
  empty = 'var(--c-raised)',
  height = 8,
  className = '',
  label,
}) {
  const percent = clampPercent(value)
  const total = Math.max(1, Math.round(segments))
  const filled = Math.round((percent / 100) * total)

  return (
    <div
      className={`flex w-full items-center gap-[3px] ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className="flex-1"
          style={{
            height,
            borderRadius: 'calc(var(--radius-sm, 12px) * 0.25)',
            backgroundColor: index < filled ? tone : empty,
            transition: 'background-color 320ms ease',
          }}
        />
      ))}
    </div>
  )
}

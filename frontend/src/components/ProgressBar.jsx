import { clampPercent } from '../lib/format'

export default function ProgressBar({
  value = 0,
  height = 'h-1.5',
  className = '',
  tone = 'accent',
  background = 'var(--c-line)',
}) {
  const percent = clampPercent(value)

  const fill =
    tone === 'positive'
      ? 'var(--c-positive)'
      : tone === 'warning'
        ? 'var(--c-warning)'
        : tone === 'negative'
          ? 'var(--c-negative)'
          : 'var(--c-accent)'

  return (
    <div
      className={`w-full overflow-hidden rounded-full ${height} ${className}`}
      style={{ backgroundColor: background }}
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${percent}%`,
          background: fill,
          transition: 'width 520ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      />
    </div>
  )
}

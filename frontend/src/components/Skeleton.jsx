export default function Skeleton({ className = '', rounded = 'radius-theme' }) {
  return (
    <div
      className={`animate-pulse ${rounded} ${className}`}
      style={{ backgroundColor: 'var(--c-raised)' }}
    />
  )
}

export default function Skeleton({ className = '', rounded = 'rounded-xl' }) {
  return (
    <div
      className={`animate-pulse ${rounded} ${className}`}
      style={{ backgroundColor: 'var(--c-raised)' }}
    />
  )
}

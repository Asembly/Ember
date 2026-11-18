export default function EmptyState({ icon: Icon, title, hint, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 px-6 py-12 text-center ${className}`}
      style={{
        border: 'var(--border-width, 1px) solid var(--c-line)',
        borderRadius: 'var(--radius)',
      }}
    >
      {Icon ? (
        <div
          className="flex h-11 w-11 items-center justify-center"
          style={{
            borderRadius: 'calc(var(--radius-sm, 12px) * 0.95)',
            backgroundColor: 'var(--c-accent-soft)',
            color: 'var(--c-accent)',
          }}
        >
          <Icon size={20} />
        </div>
      ) : null}

      <div className="max-w-xs space-y-1">
        <p className="text-[12.5px] font-semibold text-ink">{title}</p>
        {hint ? <p className="text-[11px] leading-relaxed text-muted">{hint}</p> : null}
      </div>

      {action}
    </div>
  )
}

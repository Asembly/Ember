export default function EmptyState({ icon: Icon, title, hint, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl px-6 py-12 text-center ${className}`}
      style={{ border: '1px dashed var(--c-line)' }}
    >
      {Icon ? (
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'var(--c-accent-soft)', color: 'var(--c-accent)' }}
        >
          <Icon size={21} />
        </div>
      ) : null}

      <div className="max-w-xs space-y-1">
        <p className="text-[13px] font-semibold text-ink">{title}</p>
        {hint ? <p className="text-[12px] leading-relaxed text-muted">{hint}</p> : null}
      </div>

      {action}
    </div>
  )
}

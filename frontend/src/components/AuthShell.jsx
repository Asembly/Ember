import { AlertIcon, SparkIcon } from './icons'

export default function AuthShell({ eyebrow, title, subtitle, children, footer, error }) {
  return (
    <div
      className="flex h-full w-full items-center justify-center overflow-y-auto px-5 py-10"
      style={{ backgroundColor: 'var(--c-canvas)' }}
    >
      <div className="w-full max-w-[420px]">
        <div className="mb-5 flex items-center gap-2.5">
          <span
            className="flex h-10 w-10 items-center justify-center"
            style={{
              borderRadius: '0.85rem',
              backgroundColor: 'var(--c-accent)',
              color: 'var(--c-accent-ink)',
            }}
          >
            <SparkIcon size={19} />
          </span>
          <div className="leading-tight">
            <p className="display text-[19px] font-semibold tracking-tight text-ink">Talis</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              {eyebrow}
            </p>
          </div>
        </div>

        <div className="card p-6">
          <h1 className="display text-[21px] font-semibold leading-tight text-ink">{title}</h1>
          <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{subtitle}</p>

          {children}

          {error ? (
            <p
              className="mt-4 flex items-start gap-2 border px-3 py-2 text-[11.5px] font-medium leading-snug"
              style={{
                borderColor: 'color-mix(in srgb, var(--c-negative) 32%, transparent)',
                borderRadius: '0.65rem',
                backgroundColor: 'color-mix(in srgb, var(--c-negative) 12%, transparent)',
                color: 'var(--c-negative)',
              }}
              role="alert"
            >
              <AlertIcon size={14} className="mt-0.5 shrink-0" />
              {error}
            </p>
          ) : null}
        </div>

        {footer ? <div className="mt-4 text-center text-[12px] text-muted">{footer}</div> : null}
      </div>
    </div>
  )
}

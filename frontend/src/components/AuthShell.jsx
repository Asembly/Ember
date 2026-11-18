import { AlertIcon } from './icons'

export default function AuthShell({ eyebrow, title, subtitle, children, footer, error }) {
  return (
    <div className="h-full w-full overflow-y-auto" style={{ backgroundColor: 'var(--c-canvas)' }}>
      <div className="flex min-h-full items-center justify-center px-5 py-10">
        <div className="w-full max-w-[430px]">
          <div className="mb-6 text-center">
            <p className="display text-[34px] font-extrabold leading-none tracking-tight text-ink">
              talis
            </p>
            <p
              className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em]"
              style={{ color: 'var(--c-accent)' }}
            >
              Расти в своём ритме
            </p>
          </div>

          <div className="card card-lg p-7">
            {eyebrow ? (
              <span className="chip chip-accent h-5 px-2 text-[8.5px] font-semibold uppercase tracking-[0.08em]">
                {eyebrow}
              </span>
            ) : null}

            <h1 className="display mt-3 text-[22px] font-semibold leading-tight text-ink">{title}</h1>
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted">{subtitle}</p>

            {children}

            {error ? (
              <p
                className="mt-4 flex items-start gap-2 px-3 py-2 text-[11px] font-medium leading-snug"
                style={{
                  borderRadius: 'var(--radius-sm, 12px)',
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

          {footer ? (
            <div className="mt-5 text-center text-[11.5px] text-muted">{footer}</div>
          ) : null}

          <p className="mt-6 text-center text-[9.5px] uppercase tracking-[0.16em] text-muted">
            Не спринт. Приключение.
          </p>
        </div>
      </div>
    </div>
  )
}

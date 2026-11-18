import { useEffect } from 'react'
import { CloseIcon } from './icons'

export default function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}) {
  useEffect(() => {
    if (!open) return undefined

    const handleKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', handleKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) return null

  const width = size === 'lg' ? 'max-w-3xl' : size === 'sm' ? 'max-w-sm' : 'max-w-xl'

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-8 sm:px-6 sm:py-12"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 animate-fade-in"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--c-canvas) 82%, transparent)',
          backdropFilter: 'blur(6px)',
        }}
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      <div
        className={`card card-lg relative z-10 w-full ${width} animate-fade-up shadow-theme`}
        style={{ backgroundColor: 'var(--c-surface)', borderColor: 'var(--c-line)' }}
      >
        <div
          className="flex items-start justify-between gap-4 px-6 py-4"
          style={{ borderBottom: '1px solid var(--c-line)' }}
        >
          <div className="min-w-0">
            <h2 className="section-title text-[15px] text-ink">{title}</h2>
            {subtitle ? <p className="mt-1 text-[11px] text-muted">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-icon shrink-0"
            onClick={onClose}
            aria-label="Закрыть"
          >
            <CloseIcon size={15} />
          </button>
        </div>

        <div className="px-6 py-5">{children}</div>

        {footer ? (
          <div
            className="flex items-center justify-end gap-2 px-6 py-4"
            style={{ borderTop: '1px solid var(--c-line)' }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

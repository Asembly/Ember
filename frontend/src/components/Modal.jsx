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
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-6 py-10"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 animate-fade-in"
        style={{ backgroundColor: 'rgba(8, 5, 11, 0.68)', backdropFilter: 'blur(4px)' }}
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      <div className={`card relative z-10 w-full ${width} animate-fade-up shadow-theme`}>
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div className="min-w-0">
            <h2 className="section-title text-[15px] text-ink">{title}</h2>
            {subtitle ? <p className="mt-1 text-[11.5px] text-muted">{subtitle}</p> : null}
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
          <div className="flex items-center justify-end gap-2 border-t border-line px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

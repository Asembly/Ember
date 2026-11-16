import { AlertIcon, CheckIcon, CloseIcon, InfoIcon } from './icons'
import { useToastStore } from '../stores/toastStore'

const TONES = {
  success: { icon: CheckIcon, color: 'var(--c-positive)' },
  error: { icon: AlertIcon, color: 'var(--c-negative)' },
  default: { icon: InfoIcon, color: 'var(--c-accent)' },
}

export default function Toasts() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)

  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[60] flex w-80 flex-col gap-2">
      {toasts.map((toast) => {
        const meta = TONES[toast.tone] || TONES.default
        const Icon = meta.icon

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex animate-toast-in items-start gap-2.5 radius-theme border border-theme border-line px-3.5 py-3 shadow-theme"
            style={{ backgroundColor: 'var(--c-raised)' }}
          >
            <Icon size={16} className="mt-0.5 shrink-0" style={{ color: meta.color }} />
            <p className="min-w-0 flex-1 text-[12.5px] leading-snug text-ink">{toast.message}</p>
            <button
              type="button"
              className="shrink-0 radius-theme p-0.5 text-muted transition hover:text-ink"
              onClick={() => dismiss(toast.id)}
              aria-label="Скрыть"
            >
              <CloseIcon size={12} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

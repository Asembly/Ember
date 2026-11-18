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
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(320px,calc(100vw-2rem))] flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => {
        const meta = TONES[toast.tone] || TONES.default
        const Icon = meta.icon

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex animate-toast-in items-start gap-2.5 px-3.5 py-3 shadow-theme"
            style={{
              borderRadius: 'var(--radius-sm, 12px)',
              border: '1px solid var(--c-line)',
              backgroundColor: 'var(--c-raised)',
              color: 'var(--c-ink)',
            }}
          >
            <Icon size={16} className="mt-0.5 shrink-0" style={{ color: meta.color }} />
            <p className="min-w-0 flex-1 text-[11.5px] leading-snug">{toast.message}</p>
            <button
              type="button"
              className="shrink-0 rounded p-0.5 text-muted transition hover:text-ink"
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

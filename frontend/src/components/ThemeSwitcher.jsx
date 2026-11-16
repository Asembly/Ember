import { useEffect, useRef, useState } from 'react'
import { CheckIcon, ChevronDownIcon, PaletteIcon } from './icons'
import { themeList } from '../config/themes'
import { useThemeStore } from '../stores/themeStore'

export default function ThemeSwitcher() {
  const currentThemeId = useThemeStore((state) => state.currentThemeId)
  const setTheme = useThemeStore((state) => state.setTheme)

  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)

  const active = themeList.find((theme) => theme.id === currentThemeId) || themeList[0]
  const activeAccent = active.colors['--c-accent']

  useEffect(() => {
    if (!open) return undefined

    const handlePointer = (event) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(event.target)) setOpen(false)
    }

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  return (
    <div className="relative no-drag" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => setOpen((previous) => !previous)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Тема оформления: ${active.label}`}
        title="Тема оформления"
      >
        <PaletteIcon size={13} />
        <span className="hidden text-[11.5px] sm:inline">{active.label}</span>
        <span
          className="h-3 w-3 shrink-0"
          style={{ borderRadius: '999px', backgroundColor: activeAccent }}
          aria-hidden="true"
        />
        <ChevronDownIcon
          size={11}
          className={`shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Тема оформления"
          className="absolute right-0 z-40 mt-2 w-60 overflow-hidden p-1.5"
          style={{
            border: 'var(--border-width, 1px) solid var(--c-line)',
            borderRadius: 'var(--radius, 8px)',
            backgroundColor: 'var(--c-surface)',
            boxShadow: 'var(--shadow, none)',
          }}
        >
          <p
            className="px-2 pb-1.5 pt-1 text-[9.5px] font-semibold uppercase tracking-[0.14em]"
            style={{ color: 'var(--c-muted)' }}
          >
            Тема оформления
          </p>

          {themeList.map((theme) => {
            const selected = theme.id === currentThemeId

            return (
              <button
                key={theme.id}
                type="button"
                role="menuitemradio"
                aria-checked={selected}
                onClick={() => {
                  setTheme(theme.id)
                  setOpen(false)
                  triggerRef.current?.focus()
                }}
                className="flex w-full items-center gap-2.5 px-2 py-2 text-left transition"
                style={{
                  borderRadius: 'calc(var(--radius, 8px) * 0.65)',
                  color: selected ? 'var(--c-ink)' : 'var(--c-muted)',
                  backgroundColor: selected ? 'var(--c-accent-soft)' : 'transparent',
                }}
              >
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center"
                  style={{
                    border: '1px solid var(--c-line)',
                    borderRadius: 'calc(var(--radius, 8px) * 0.45)',
                    backgroundColor: theme.colors['--c-canvas'],
                  }}
                  aria-hidden="true"
                >
                  <span
                    className="h-2 w-2"
                    style={{
                      borderRadius: '999px',
                      backgroundColor: theme.colors['--c-accent'],
                    }}
                  />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-medium">{theme.label}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-muted">
                    {theme.hint}
                  </span>
                </span>

                {selected ? (
                  <CheckIcon size={12} style={{ color: 'var(--c-accent)' }} />
                ) : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

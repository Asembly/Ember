import { useEffect, useRef, useState } from 'react'
import { PaletteIcon, CheckIcon } from './icons'
import { THEMES, useThemeStore } from '../stores/themeStore'

const GROUPS = [
  { mode: 'dark', title: 'Тёмные' },
  { mode: 'light', title: 'Светлые' },
]

export default function ThemeSwitcher() {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)

  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const active = THEMES.find((item) => item.id === theme) || THEMES[0]

  useEffect(() => {
    if (!open) return undefined

    const handlePointer = (event) => {
      if (!rootRef.current) return
      if (!rootRef.current.contains(event.target)) setOpen(false)
    }
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false)
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
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => setOpen((previous) => !previous)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Тема оформления: ${active.label}`}
        title="Тема оформления"
      >
        <PaletteIcon size={13} />
        <span
          className="h-3 w-3"
          style={{
            borderRadius: '999px',
            backgroundColor: active.swatch,
          }}
        />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Тема оформления"
          className="absolute right-0 z-40 mt-2 w-48 overflow-hidden p-1.5"
          style={{
            border: '1px solid var(--c-line)',
            borderRadius: '0.7rem',
            backgroundColor: 'var(--c-surface)',
            boxShadow: '0 12px 28px -18px var(--c-shadow-lg)',
          }}
        >
          {GROUPS.map((group) => {
            const items = THEMES.filter((item) => item.mode === group.mode)
            if (items.length === 0) return null

            return (
              <div key={group.mode} className="py-1 first:pt-0 last:pb-0">
                <p
                  className="px-2 pb-1 pt-1 text-[9.5px] font-semibold uppercase tracking-[0.14em]"
                  style={{ color: 'var(--c-muted)' }}
                >
                  {group.title}
                </p>

                {items.map((item) => {
                  const selected = item.id === theme

                  return (
                    <button
                      key={item.id}
                      type="button"
                      role="menuitemradio"
                      aria-checked={selected}
                      onClick={() => {
                        setTheme(item.id)
                        setOpen(false)
                      }}
                      className="flex w-full items-center gap-2.5 px-2 py-1.5 text-left text-[12px] font-medium transition"
                      style={{
                        borderRadius: '0.45rem',
                        color: selected ? 'var(--c-ink)' : 'var(--c-muted)',
                        backgroundColor: selected ? 'var(--c-accent-soft)' : 'transparent',
                      }}
                    >
                      <span
                        className="h-3 w-3 shrink-0"
                        style={{
                          border: '1px solid var(--c-line)',
                          borderRadius: '999px',
                          backgroundColor: item.swatch,
                        }}
                      />
                      <span className="flex-1 truncate">{item.label}</span>
                      {selected ? (
                        <CheckIcon size={12} style={{ color: 'var(--c-accent)' }} />
                      ) : null}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

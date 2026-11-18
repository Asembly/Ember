import { CheckIcon } from './icons'
import { themeList } from '../config/themes'
import { useThemeStore } from '../stores/themeStore'

/**
 * Theme picker.
 *
 * `sidebar` (default) renders the "Твоя атмосфера" card used in the sidebar:
 * the active theme as a filled row, the rest as quiet options.
 * `compact` renders a row of swatches for narrow screens.
 */
export default function ThemeSwitcher({ compact = false }) {
  const currentThemeId = useThemeStore((state) => state.currentThemeId)
  const setTheme = useThemeStore((state) => state.setTheme)

  const active = themeList.find((theme) => theme.id === currentThemeId) || themeList[0]
  const others = themeList.filter((theme) => theme.id !== active.id)

  if (compact) {
    return (
      <div className="flex items-center gap-1" role="group" aria-label="Тема оформления">
        {themeList.map((theme) => {
          const selected = theme.id === currentThemeId

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => setTheme(theme.id)}
              aria-pressed={selected}
              aria-label={`Тема ${theme.label}`}
              title={theme.label}
              className="flex h-7 w-7 items-center justify-center transition"
              style={{
                borderRadius: '999px',
                backgroundColor: theme.colors['--c-accent'],
                boxShadow: selected
                  ? '0 0 0 2px var(--c-canvas), 0 0 0 3.5px var(--c-ink)'
                  : 'none',
                opacity: selected ? 1 : 0.6,
              }}
            >
              {selected ? (
                <CheckIcon size={12} style={{ color: theme.colors['--c-accent-ink'] }} />
              ) : null}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="px-2">
      <p className="eyebrow mb-2 font-semibold">Твоя атмосфера</p>

      <div
        className="p-2"
        style={{ borderRadius: 'var(--radius)', backgroundColor: 'var(--c-raised)' }}
        role="group"
        aria-label="Тема оформления"
      >
        <button
          type="button"
          onClick={() => setTheme(active.id)}
          aria-pressed="true"
          className="flex h-9 w-full items-center justify-between px-3 text-[11.5px] font-bold transition"
          style={{
            borderRadius: 'calc(var(--radius-sm, 12px) * 0.9)',
            backgroundColor: 'var(--c-hero)',
            color: 'var(--c-hero-ink)',
          }}
        >
          <span>{active.label}</span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5"
              style={{ borderRadius: '999px', backgroundColor: 'var(--c-accent)' }}
              aria-hidden="true"
            />
            <CheckIcon size={13} />
          </span>
        </button>

        {others.length > 0 ? (
          <div className="mt-1 flex items-stretch gap-1">
            {others.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setTheme(theme.id)}
                aria-pressed="false"
                className="flex h-8 flex-1 items-center justify-center gap-1.5 px-1 text-[10.5px] font-medium transition hover:text-ink"
                style={{ borderRadius: 'calc(var(--radius-sm, 12px) * 0.8)', color: 'var(--c-muted)' }}
                title={theme.hint}
              >
                <span
                  className="h-1.5 w-1.5 shrink-0"
                  style={{ borderRadius: '999px', backgroundColor: theme.colors['--c-accent'] }}
                  aria-hidden="true"
                />
                <span className="truncate">{theme.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}

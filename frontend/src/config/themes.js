/**
 * Theme registry.
 *
 * A theme has two token groups:
 *  - colors: surface/ink/accents (--c-*)
 *  - design: shape, depth, density and typography (--radius*, --shadow, ...)
 *
 * Both groups are written to <html> as CSS custom properties. Every theme
 * defines the same keys, so switching only overwrites values.
 */
export const themes = {
  ember: {
    id: 'ember',
    label: 'Ember',
    hint: 'Графит, лиловый свет, острые акценты',
    scheme: 'dark',
    colors: {
      '--c-canvas': '#18181B',
      '--c-sidebar': '#27272A',
      '--c-surface': '#27272A',
      '--c-raised': '#3F3F46',
      '--c-sunken': '#1F2937',
      '--c-line': '#3F3F46',
      '--c-ink': '#FFF7ED',
      '--c-muted': '#9CA3AF',
      '--c-accent': '#A78BFA',
      '--c-accent-strong': '#C4B5FD',
      '--c-accent-soft': 'rgba(167, 139, 250, 0.16)',
      '--c-accent-ink': '#18181B',
      '--c-positive': '#D9F99D',
      '--c-negative': '#F87171',
      '--c-warning': '#FDBA74',
      '--c-cta': '#D9F99D',
      '--c-cta-ink': '#18181B',
      '--c-hero': '#FDBA74',
      '--c-hero-ink': '#18181B',
      '--c-glow': 'rgba(167, 139, 250, 0.12)',
      '--c-glow-2': 'rgba(253, 186, 116, 0.08)',
      '--c-shadow': 'rgba(0, 0, 0, 0.35)',
      '--c-shadow-lg': 'rgba(0, 0, 0, 0.55)',
    },
    design: {
      '--radius': '16px',
      '--radius-sm': '12px',
      '--radius-lg': '24px',
      '--shadow': 'none',
      '--spacing': '0.85rem',
      '--border-width': '1px',
      '--font-family': "'Onest', 'Segoe UI', system-ui, sans-serif",
      '--font-display': "'Unbounded', 'Onest', system-ui, sans-serif",
    },
  },

  midnight: {
    id: 'midnight',
    label: 'Midnight',
    hint: 'Глубокий космос, мягкие формы',
    scheme: 'dark',
    colors: {
      '--c-canvas': '#0B1020',
      '--c-sidebar': '#101A33',
      '--c-surface': '#111A33',
      '--c-raised': '#1B2745',
      '--c-sunken': '#0A1124',
      '--c-line': '#24345C',
      '--c-ink': '#EAF2FF',
      '--c-muted': '#93A4C8',
      '--c-accent': '#5B8CFF',
      '--c-accent-strong': '#8FB2FF',
      '--c-accent-soft': 'rgba(91, 140, 255, 0.18)',
      '--c-accent-ink': '#08101F',
      '--c-positive': '#7DE2C3',
      '--c-negative': '#FF8A8A',
      '--c-warning': '#FCD34D',
      '--c-cta': '#7DE2C3',
      '--c-cta-ink': '#08101F',
      '--c-hero': '#5B8CFF',
      '--c-hero-ink': '#06101F',
      '--c-glow': 'rgba(91, 140, 255, 0.16)',
      '--c-glow-2': 'rgba(125, 226, 195, 0.08)',
      '--c-shadow': 'rgba(3, 8, 20, 0.55)',
      '--c-shadow-lg': 'rgba(3, 8, 20, 0.75)',
    },
    design: {
      '--radius': '20px',
      '--radius-sm': '14px',
      '--radius-lg': '28px',
      '--shadow': '0 8px 24px rgba(0, 0, 0, 0.45)',
      '--spacing': '0.95rem',
      '--border-width': '1px',
      '--font-family': "'Nunito', 'Segoe UI', system-ui, sans-serif",
      '--font-display': "'Comfortaa', 'Nunito', system-ui, sans-serif",
    },
  },

  forest: {
    id: 'forest',
    label: 'Forest',
    hint: 'Тихая бумага, серифы, мягкий свет',
    scheme: 'dark',
    colors: {
      '--c-canvas': '#0D1512',
      '--c-sidebar': '#121C17',
      '--c-surface': '#14201B',
      '--c-raised': '#1E2E26',
      '--c-sunken': '#0A1210',
      '--c-line': '#2C4036',
      '--c-ink': '#F2F5EE',
      '--c-muted': '#9FB5A8',
      '--c-accent': '#52C184',
      '--c-accent-strong': '#7FD6A5',
      '--c-accent-soft': 'rgba(82, 193, 132, 0.18)',
      '--c-accent-ink': '#08130D',
      '--c-positive': '#B7E4C7',
      '--c-negative': '#E58F7B',
      '--c-warning': '#E9C46A',
      '--c-cta': '#B7E4C7',
      '--c-cta-ink': '#0C1A12',
      '--c-hero': '#E9C46A',
      '--c-hero-ink': '#1A1710',
      '--c-glow': 'rgba(82, 193, 132, 0.12)',
      '--c-glow-2': 'rgba(233, 196, 106, 0.08)',
      '--c-shadow': 'rgba(0, 0, 0, 0.4)',
      '--c-shadow-lg': 'rgba(0, 0, 0, 0.6)',
    },
    design: {
      '--radius': '8px',
      '--radius-sm': '6px',
      '--radius-lg': '14px',
      '--shadow': '0 2px 8px rgba(0, 0, 0, 0.24)',
      '--spacing': '0.75rem',
      '--border-width': '1px',
      '--font-family': "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
      '--font-display': "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
    },
  },
}

export const DEFAULT_THEME_ID = 'ember'

export const themeList = Object.values(themes)

export function isThemeId(id) {
  return Object.prototype.hasOwnProperty.call(themes, id)
}

export function getTheme(themeId) {
  return isThemeId(themeId) ? themes[themeId] : themes[DEFAULT_THEME_ID]
}

function writeTokens(target, tokens) {
  for (const [name, value] of Object.entries(tokens)) {
    target.style.setProperty(name, value)
  }
}

/**
 * Writes both token groups to the document root. Returns the resolved theme
 * so callers can inspect what was applied.
 */
export function applyTheme(themeId, root) {
  const theme = getTheme(themeId)
  const target = root || (typeof document !== 'undefined' ? document.documentElement : null)

  if (!target) return theme

  writeTokens(target, theme.colors)
  writeTokens(target, theme.design)

  target.style.colorScheme = theme.scheme || 'dark'
  if (target.dataset) target.dataset.theme = theme.id

  return theme
}

export default themes

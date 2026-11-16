/**
 * Theme registry.
 *
 * A theme has two token groups:
 *  - colors: surface/ink/accent palette (--c-*)
 *  - design: shape, depth, density and typography (--radius, --shadow, ...)
 *
 * Both groups are written to <html> as CSS custom properties. Every theme
 * defines the same keys, so switching only overwrites values.
 */
export const themes = {
  glacier: {
    id: 'glacier',
    label: 'Glacier',
    hint: 'Лёд, сталь, холодный синий',
    scheme: 'dark',
    colors: {
      '--c-canvas': '#0f1318',
      '--c-sidebar': '#0b0e12',
      '--c-surface': '#1a2028',
      '--c-raised': '#232b35',
      '--c-line': '#2f3944',
      '--c-ink': '#eaf2f8',
      '--c-muted': '#8fa3b4',
      '--c-accent': '#3db3ff',
      '--c-accent-strong': '#6cc8ff',
      '--c-accent-soft': 'rgba(61, 179, 255, 0.15)',
      '--c-accent-ink': '#04141f',
      '--c-positive': '#86c79b',
      '--c-negative': '#e08a8a',
      '--c-warning': '#e2bd76',
      '--c-glow': 'rgba(61, 179, 255, 0.13)',
      '--c-glow-2': 'rgba(120, 200, 255, 0.09)',
      '--c-shadow': 'rgba(0, 0, 0, 0.35)',
      '--c-shadow-lg': 'rgba(0, 0, 0, 0.55)',
    },
    design: {
      '--radius': '4px',
      '--shadow': '0 4px 0 var(--c-line)',
      '--spacing': '0.65rem',
      '--border-width': '2px',
      '--font-family':
        "'Bahnschrift', 'Arial Narrow', 'Roboto Condensed', 'Segoe UI', sans-serif",
    },
  },
  ember: {
    id: 'ember',
    label: 'Ember',
    hint: 'Уголь, резкие углы, тяжёлый шрифт',
    scheme: 'dark',
    colors: {
      '--c-canvas': '#121212',
      '--c-sidebar': '#0e0e0e',
      '--c-surface': '#1f1f1f',
      '--c-raised': '#2a2a2a',
      '--c-line': '#383838',
      '--c-ink': '#f5f2ef',
      '--c-muted': '#a6a099',
      '--c-accent': '#ff4500',
      '--c-accent-strong': '#ff6a33',
      '--c-accent-soft': 'rgba(255, 69, 0, 0.15)',
      '--c-accent-ink': '#160d08',
      '--c-positive': '#86c79b',
      '--c-negative': '#e08a8a',
      '--c-warning': '#e2bd76',
      '--c-glow': 'rgba(255, 69, 0, 0.13)',
      '--c-glow-2': 'rgba(255, 120, 40, 0.09)',
      '--c-shadow': 'rgba(0, 0, 0, 0.35)',
      '--c-shadow-lg': 'rgba(0, 0, 0, 0.55)',
    },
    design: {
      '--radius': '4px',
      '--shadow': '0 4px 0 var(--c-line)',
      '--spacing': '0.65rem',
      '--border-width': '2px',
      '--font-family':
        "'Bahnschrift', 'Arial Narrow', 'Roboto Condensed', 'Segoe UI', sans-serif",
    },
  },

  midnight: {
    id: 'midnight',
    label: 'Midnight',
    hint: 'Мягкие формы, глубокая синева',
    scheme: 'dark',
    colors: {
      '--c-canvas': '#0b1020',
      '--c-sidebar': '#070b17',
      '--c-surface': '#121a2e',
      '--c-raised': '#1a243c',
      '--c-line': '#27344f',
      '--c-ink': '#e9eefc',
      '--c-muted': '#95a3c2',
      '--c-accent': '#5b8cff',
      '--c-accent-strong': '#7aa4ff',
      '--c-accent-soft': 'rgba(91, 140, 255, 0.16)',
      '--c-accent-ink': '#08101f',
      '--c-positive': '#82c8ab',
      '--c-negative': '#e08d99',
      '--c-warning': '#e0be78',
      '--c-glow': 'rgba(91, 140, 255, 0.15)',
      '--c-glow-2': 'rgba(130, 170, 255, 0.1)',
      '--c-shadow': 'rgba(0, 0, 0, 0.4)',
      '--c-shadow-lg': 'rgba(0, 0, 0, 0.6)',
    },
    design: {
      '--radius': '16px',
      '--shadow': '0 8px 24px rgba(0, 0, 0, 0.5)',
      '--spacing': '0.95rem',
      '--border-width': '1px',
      '--font-family':
        "'Nunito', 'Comfortaa', 'Varela Round', 'Segoe UI', system-ui, sans-serif",
    },
  },

  forest: {
    id: 'forest',
    label: 'Forest',
    hint: 'Бумага, лёгкие тени, антиква',
    scheme: 'dark',
    colors: {
      '--c-canvas': '#0d1512',
      '--c-sidebar': '#080f0c',
      '--c-surface': '#14201b',
      '--c-raised': '#1c2b24',
      '--c-line': '#2b3e34',
      '--c-ink': '#e9f1eb',
      '--c-muted': '#98ada1',
      '--c-accent': '#52c184',
      '--c-accent-strong': '#71d6a0',
      '--c-accent-soft': 'rgba(82, 193, 132, 0.15)',
      '--c-accent-ink': '#06130c',
      '--c-positive': '#7fd6a5',
      '--c-negative': '#de8f8f',
      '--c-warning': '#ddc079',
      '--c-glow': 'rgba(82, 193, 132, 0.14)',
      '--c-glow-2': 'rgba(120, 200, 150, 0.09)',
      '--c-shadow': 'rgba(0, 0, 0, 0.38)',
      '--c-shadow-lg': 'rgba(0, 0, 0, 0.58)',
    },
    design: {
      '--radius': '8px',
      '--shadow': '0 2px 8px rgba(0, 0, 0, 0.14)',
      '--spacing': '0.8rem',
      '--border-width': '1px',
      '--font-family':
        "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif",
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

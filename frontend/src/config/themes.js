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
    pickme: {
        id: 'pickme',
        label: 'Pick Me',
        hint: 'Розовый, милый и мягкий',
        scheme: 'light',
        colors: {
            // --- Фоны: все в розовых оттенках ---
            '--c-canvas': '#FFF0F5',        // Лавандово-розовый (очень светлый)
            '--c-sidebar': '#FFE4EC',       // Розовый сайдбар (чуть темнее фона)
            '--c-surface': '#FFFFFF',       // Белые карточки (чтобы текст читался)
            '--c-raised': '#FFD1DC',        // Пудрово-розовый для инпутов
            '--c-sunken': '#FFB6C1',        // Светло-розовый для вложенных элементов
            '--c-line': '#FFC0CB',          // Розовые границы (Pink)

            // --- Текст ---
            '--c-ink': '#5D2A42',           // Тёмно-бордовый (контрастный, но мягкий)
            '--c-muted': '#9B6A7C',         // Приглушенный розово-серый

            // --- Акценты (Розовый на розовом) ---
            '--c-accent': '#FF69B4',        // Яркий хот-пинк (Hot Pink) для акцентов
            '--c-accent-strong': '#FF1493', // Насыщенный (Deep Pink)
            '--c-accent-soft': 'rgba(255, 105, 180, 0.15)',
            '--c-accent-ink': '#FFFFFF',    // Белый текст на ярком розовом

            // --- CTA (Кнопки) ---
            '--c-cta': '#FF85A2',           // Нежный розовый для кнопок
            '--c-cta-ink': '#5D2A42',       // Тёмный текст на кнопке

            // --- Hero (Баннер) ---
            '--c-hero': '#FFB6C1',          // Светло-розовый (Light Pink)
            '--c-hero-ink': '#FFFFFF',      // Тёмный текст

            // --- Статусы ---
            '--c-positive': '#FFB7C5',      // Розово-зеленый (условно)
            '--c-negative': '#E63946',      // Красный (чтобы ошибки было видно)
            '--c-warning': '#FFDAB9',       // Персиковый

            // --- Тени ---
            '--c-glow': 'rgba(255, 105, 180, 0.2)',
            '--c-glow-2': 'rgba(255, 182, 193, 0.3)',
            '--c-shadow': 'rgba(93, 42, 66, 0.08)',
            '--c-shadow-lg': 'rgba(93, 42, 66, 0.12)',
        },
        design: {
            '--radius': '20px',            // Очень круглые, милые углы
            '--radius-sm': '12px',
            '--radius-lg': '28px',
            '--shadow': '0 4px 16px rgba(93, 42, 66, 0.08)', // Мягкая тень
            '--spacing': '0.9rem',
            '--border-width': '1px',
            '--font-family': "'Comfortaa', 'Nunito', system-ui, sans-serif", // Округлый шрифт
            '--font-display': "'Comfortaa', 'Nunito', system-ui, sans-serif",
        },
    },
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

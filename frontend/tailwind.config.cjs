/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--c-canvas)',
        sidebar: 'var(--c-sidebar)',
        surface: 'var(--c-surface)',
        raised: 'var(--c-raised)',
        sunken: 'var(--c-sunken)',
        line: 'var(--c-line)',
        ink: 'var(--c-ink)',
        muted: 'var(--c-muted)',
        accent: {
          DEFAULT: 'var(--c-accent)',
          strong: 'var(--c-accent-strong)',
          soft: 'var(--c-accent-soft)',
          ink: 'var(--c-accent-ink)',
        },
        positive: 'var(--c-positive)',
        negative: 'var(--c-negative)',
        warning: 'var(--c-warning)',
        cta: 'var(--c-cta)',
        hero: 'var(--c-hero)',
      },
      fontFamily: {
        sans: ['var(--font-family, Onest, system-ui, sans-serif)'],
        display: ['var(--font-display, Unbounded, system-ui, sans-serif)'],
        mono: ['Cascadia Mono', 'Consolas', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        xl: 'var(--radius-sm, 12px)',
        '2xl': 'var(--radius, 16px)',
        '3xl': 'var(--radius-lg, 24px)',
        '4xl': 'calc(var(--radius-lg, 24px) + 8px)',
      },
      boxShadow: {
        panel: 'var(--shadow, none)',
        pop: 'var(--shadow, none)',
        soft: 'var(--shadow, none)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'toast-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.22s ease-out both',
        'toast-in': 'toast-in 0.22s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const THEMES = [
  { id: 'rose', label: 'Слива', hint: 'тёмная', swatch: '#d9b4cc', mode: 'dark' },
  { id: 'mint', label: 'Мята', hint: 'тёмная', swatch: '#a9cbb8', mode: 'dark' },
  { id: 'lilac', label: 'Сирень', hint: 'тёмная', swatch: '#bcb1d4', mode: 'dark' },
  { id: 'cream', label: 'Крем', hint: 'светлая', swatch: '#d3b49a', mode: 'light' },
  { id: 'mist', label: 'Мятная', hint: 'светлая', swatch: '#a3c7b4', mode: 'light' },
  { id: 'haze', label: 'Лаванда', hint: 'светлая', swatch: '#b7aad4', mode: 'light' },
]

export const DEFAULT_THEME = 'rose'

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: DEFAULT_THEME,
      setTheme: (theme) => {
        if (!THEMES.some((item) => item.id === theme)) return
        set({ theme })
      },
    }),
    {
      name: 'talis.theme',
      partialize: (state) => ({ theme: state.theme }),
      // drop persisted ids from older palettes (sky, sand)
      migrate: (persisted) => {
        const theme = persisted?.theme
        return { theme: THEMES.some((item) => item.id === theme) ? theme : DEFAULT_THEME }
      },
      version: 2,
    },
  ),
)

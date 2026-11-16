import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_THEME_ID, isThemeId } from '../config/themes'

export const useThemeStore = create(
  persist(
    (set) => ({
      currentThemeId: DEFAULT_THEME_ID,

      setTheme(id) {
        if (!isThemeId(id)) return
        set({ currentThemeId: id })
      },
    }),
    {
      name: 'talis.theme',
      version: 3,
      partialize: (state) => ({ currentThemeId: state.currentThemeId }),
      // Old versions persisted `theme` ids from the retired static palettes.
      migrate: (persisted) => {
        const candidate = persisted?.currentThemeId ?? persisted?.theme
        return {
          currentThemeId: isThemeId(candidate) ? candidate : DEFAULT_THEME_ID,
        }
      },
      // Validate even when the persisted version already matches.
      merge: (persisted, current) => ({
        ...current,
        currentThemeId: isThemeId(persisted?.currentThemeId)
          ? persisted.currentThemeId
          : DEFAULT_THEME_ID,
      }),
    },
  ),
)

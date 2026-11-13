import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * TaskResponseDto does not expose tags, so the link task -> tag ids is kept
 * locally after a successful creation and reused to render chips / filters.
 */
export const useTaskTagStore = create(
  persist(
    (set, get) => ({
      map: {},

      assign(taskId, tagIds) {
        if (taskId == null) return
        const ids = Array.isArray(tagIds) ? tagIds.map(Number).filter(Number.isFinite) : []
        set({ map: { ...get().map, [taskId]: ids } })
      },

      remove(taskId) {
        if (!(taskId in get().map)) return
        const next = { ...get().map }
        delete next[taskId]
        set({ map: next })
      },

      forTask(taskId) {
        return get().map[taskId] || []
      },
    }),
    {
      name: 'talis.taskTags',
      partialize: (state) => ({ map: state.map }),
    },
  ),
)

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getErrorMessage } from '../api/client'
import { sessionApi, taskApi } from '../api/endpoints'
import { parseServerDate } from '../lib/format'
import { useProfileStore } from './profileStore'
import { useTaskStore } from './taskStore'

function sortSessions(sessions) {
  return [...sessions].sort((first, second) => {
    const firstDate = parseServerDate(first.createdAt)?.getTime() ?? 0
    const secondDate = parseServerDate(second.createdAt)?.getTime() ?? 0
    if (secondDate !== firstDate) return secondDate - firstDate
    return (second.id ?? 0) - (first.id ?? 0)
  })
}

function withoutTask(activeByTask, taskId) {
  if (!(taskId in activeByTask)) return activeByTask
  const next = { ...activeByTask }
  delete next[taskId]
  return next
}

export const useSessionStore = create(
  persist(
    (set, get) => ({
      status: 'idle',
      error: null,
      sessions: [],
      activeByTask: {},
      busyTaskId: null,

      async fetchSessions(force = false) {
        if (!force && get().status === 'loading') return
        set({ status: 'loading', error: null })

        try {
          const { data } = await sessionApi.list()
          set({ sessions: sortSessions(Array.isArray(data) ? data : []), status: 'ready' })
        } catch (error) {
          set({ status: 'error', error: getErrorMessage(error) })
        }
      },

      async start(taskId) {
        set({ busyTaskId: taskId })

        try {
          const { data } = await taskApi.startTimer(taskId)
          const startedAt = data?.createdAt || new Date().toISOString()

          set({
            activeByTask: {
              ...get().activeByTask,
              [taskId]: { sessionId: data?.id ?? null, startedAt },
            },
            error: null,
          })

          useTaskStore.getState().applyStatus(taskId, 'IN_PROGRESS')
          return data
        } finally {
          set({ busyTaskId: null })
        }
      },

      async stop(taskId) {
        set({ busyTaskId: taskId })

        try {
          const { data } = await taskApi.stopTimer(taskId)
          const activeByTask = withoutTask(get().activeByTask, taskId)
          set({ activeByTask, error: null })

          if (data?.id != null) {
            const rest = get().sessions.filter((session) => session.id !== data.id)
            set({ sessions: sortSessions([data, ...rest]) })
          }

          await Promise.allSettled([
            useTaskStore.getState().fetchTasks(),
            useProfileStore.getState().refresh(),
            get().fetchSessions(true),
          ])

          return data
        } catch (error) {
          if (error?.response?.status === 404 || error?.response?.status === 409) {
            set({ activeByTask: withoutTask(get().activeByTask, taskId) })
          }
          set({ error: getErrorMessage(error) })
          throw error
        } finally {
          set({ busyTaskId: null })
        }
      },

      dropTask(taskId) {
        set({ activeByTask: withoutTask(get().activeByTask, taskId) })
      },

      hasActive(taskId) {
        return Boolean(get().activeByTask[taskId])
      },

      clearError() {
        set({ error: null })
      },
    }),
    {
      name: 'talis.activeTimers',
      partialize: (state) => ({ activeByTask: state.activeByTask }),
    },
  ),
)

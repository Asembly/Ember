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

const ZONED_TIMESTAMP = /(?:Z|[+-]\d{2}:?\d{2})$/i

function hasExplicitZone(value) {
  return typeof value === 'string' && ZONED_TIMESTAMP.test(value.trim())
}

/**
 * The API serialises LocalDateTime without an offset. Parsing that value as a
 * browser-local date shifts a freshly started timer by the server/browser
 * timezone delta (3 hours for Europe/Moscow against a UTC container). The live
 * timer only needs a client-side anchor; the backend still owns the final
 * duration, so trust the server value only when it carries an explicit zone.
 */
function resolveStartedAt(serverValue) {
  return hasExplicitZone(serverValue) ? serverValue : new Date().toISOString()
}

function resolveRestoredStartedAt(serverValue) {
  if (typeof serverValue === 'number' && Number.isFinite(serverValue)) {
    return new Date(serverValue).toISOString()
  }

  return resolveStartedAt(serverValue)
}

function normalizeActiveTimers(activeByTask) {
  if (!activeByTask || typeof activeByTask !== 'object') return {}

  const next = {}

  for (const [taskId, timer] of Object.entries(activeByTask)) {
    if (!timer || typeof timer !== 'object') continue

    // Legacy entries were built from the server's zone-less timestamp and
    // cannot be mapped safely to the browser clock. Re-anchor them instead of
    // showing an hours-long offset.
    next[taskId] = hasExplicitZone(timer.startedAt)
      ? timer
      : { ...timer, startedAt: new Date().toISOString() }
  }

  return next
}

// Invalidates an in-flight active-session sync when the user starts/stops a
// timer, so a late response cannot overwrite fresher local state. Logout is
// covered by the profile-id check inside fetchActiveSession.
let activeSyncRequest = 0

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

      async fetchActiveSession(profileId) {
        const targetProfileId = profileId ?? useProfileStore.getState().profileId
        if (targetProfileId == null) return null

        const requestId = ++activeSyncRequest

        try {
          const { data } = await sessionApi.active(targetProfileId)
          const currentProfileId = useProfileStore.getState().profileId

          if (
            requestId !== activeSyncRequest ||
            Number(currentProfileId) !== Number(targetProfileId)
          ) {
            return null
          }

          if (data?.taskId == null) {
            set({ activeByTask: {}, error: null })
            return null
          }

          set({
            activeByTask: {
              [data.taskId]: {
                sessionId: data.sessionId ?? null,
                startedAt: resolveRestoredStartedAt(data.startedAt),
              },
            },
            error: null,
          })

          return data
        } catch (error) {
          if (requestId !== activeSyncRequest) return null

          if (error?.response?.status === 404) {
            set({ activeByTask: {}, error: null })
            return null
          }

          set({ error: getErrorMessage(error) })
          return null
        }
      },

      async start(taskId) {
        activeSyncRequest += 1
        set({ busyTaskId: taskId })

        try {
          const { data } = await taskApi.startTimer(taskId)
          const startedAt = resolveStartedAt(data?.createdAt)

          set({
            activeByTask: {
              ...get().activeByTask,
              [taskId]: { sessionId: data?.id ?? null, startedAt },
            },
            error: null,
          })

          useTaskStore.getState().applyStatus(taskId, 'IN_PROGRESS')
          return data
        } catch (error) {
          // Another task already owns the profile's active session. Pull it
          // into the UI so the user can stop it instead of being stuck.
          if (error?.response?.status === 409) {
            await get().fetchActiveSession(useProfileStore.getState().profileId)
          }
          throw error
        } finally {
          set({ busyTaskId: null })
        }
      },

      async stop(taskId) {
        activeSyncRequest += 1
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
        activeSyncRequest += 1
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
      version: 1,
      partialize: (state) => ({ activeByTask: state.activeByTask }),
      migrate: (persisted) => ({
        ...persisted,
        activeByTask: normalizeActiveTimers(persisted?.activeByTask),
      }),
      merge: (persisted, current) => ({
        ...current,
        activeByTask: normalizeActiveTimers(persisted?.activeByTask),
      }),
    },
  ),
)

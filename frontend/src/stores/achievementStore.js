import { create } from 'zustand'
import { buildAchievementStats, evaluateAchievements } from '../lib/achievements'
import { getErrorMessage } from '../api/client'
import { useProfileStore } from './profileStore'
import { useSessionStore } from './sessionStore'
import { useTaskStore } from './taskStore'

function computeSnapshot() {
  const profileState = useProfileStore.getState()
  const taskState = useTaskStore.getState()
  const sessionState = useSessionStore.getState()

  const stats = buildAchievementStats({
    tasks: taskState.tasks || [],
    sessions: sessionState.sessions || [],
    profile: profileState.profile,
    attributes: profileState.attributes || [],
  })

  const items = evaluateAchievements(stats)

  return {
    stats,
    items,
    unlockedCount: items.filter((item) => item.unlocked).length,
    total: items.length,
  }
}

const EMPTY_STATS = {
  stats: null,
  items: [],
  unlockedCount: 0,
  total: 0,
}

let inFlight = null

export const useAchievementStore = create((set, get) => ({
  status: 'idle',
  error: null,
  ...EMPTY_STATS,

  recompute() {
    set(computeSnapshot())
  },

  async load({ force = false } = {}) {
    if (inFlight && !force) return inFlight

    const profileState = useProfileStore.getState()

    set({ status: 'loading', error: null })

    inFlight = (async () => {
      try {
        if (profileState.status !== 'ready') {
          await profileState.init()
        }

        const ready = useProfileStore.getState()
        if (ready.status !== 'ready') {
          throw new Error(ready.error || 'Профиль недоступен.')
        }

        const profileId = ready.profileId
        const jobs = []

        if (force || useTaskStore.getState().status !== 'ready') {
          jobs.push(useTaskStore.getState().fetchAll(profileId))
        }
        if (force || useSessionStore.getState().status !== 'ready') {
          jobs.push(useSessionStore.getState().fetchSessions(force))
        }

        await Promise.allSettled(jobs)

        set({ ...computeSnapshot(), status: 'ready', error: null })
      } catch (error) {
        set({ status: 'error', error: getErrorMessage(error) })
      } finally {
        inFlight = null
      }
    })()

    return inFlight
  },

  refresh() {
    return get().load({ force: true })
  },

  clearError() {
    set({ error: null })
  },
}))

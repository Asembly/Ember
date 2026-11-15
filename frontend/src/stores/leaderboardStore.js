import { create } from 'zustand'
import { getErrorMessage } from '../api/client'
import { profileApi } from '../api/endpoints'

const PAGE_SIZE = 10

function extractList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  return []
}

function normalizeUser(user) {
  if (!user || typeof user !== 'object') return null

  return {
    ...user,
    id: user.id ?? user.profileId ?? null,
    nickname: String(user.nickname || '').trim() || 'Без имени',
    level: Number(user.level) || 1,
    currentXp: Number(user.currentXp) || 0,
  }
}

function appendUnique(current, batch) {
  const seen = new Set(current.map((user) => user.id).filter((id) => id != null))
  const next = []

  for (const user of batch) {
    if (user.id != null) {
      if (seen.has(user.id)) continue
      seen.add(user.id)
    }

    next.push(user)
  }

  return [...current, ...next]
}

/**
 * Leaderboard is paginated by the backend: page 0 is the first page.
 * `page` always stores the last successfully loaded page, so the next
 * "load more" request asks for `page + 1`.
 */
export const useLeaderboardStore = create((set, get) => ({
  users: [],
  page: 0,
  hasMore: true,
  isLoading: false,
  error: null,

  async fetchLeaderboard(reset = false) {
    if (get().isLoading) return null
    if (!reset && !get().hasMore) return null

    const targetPage = reset ? 0 : get().page + 1

    set({
      isLoading: true,
      error: null,
      ...(reset ? { users: [], page: 0, hasMore: true } : {}),
    })

    try {
      const response = await profileApi.getLeaderboard(targetPage, PAGE_SIZE)
      const raw = extractList(response?.data)
      const batch = raw.map(normalizeUser).filter(Boolean)
      const users = appendUnique(reset ? [] : get().users, batch)

      set({
        users,
        page: targetPage,
        hasMore: raw.length >= PAGE_SIZE,
        isLoading: false,
        error: null,
      })

      return users
    } catch (error) {
      set({ isLoading: false, error: getErrorMessage(error) })
      return null
    }
  },

  refresh() {
    return get().fetchLeaderboard(true)
  },

  clearError() {
    set({ error: null })
  },
}))

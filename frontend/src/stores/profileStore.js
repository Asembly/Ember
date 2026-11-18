import { create } from 'zustand'
import { getErrorMessage } from '../api/client'
import { profileApi } from '../api/endpoints'

function normalizeAttributes(data) {
  return (Array.isArray(data) ? data : []).map((item) => ({
    ...item,
    id: item?.attributeId ?? item?.id ?? null,
    level: Number(item?.level) || 0,
    currentXp: Number(item?.currentXp) || 0,
    nextLevelUp: Number(item?.nextLevelUp) || 0,
  }))
}

/**
 * Attributes are a secondary resource: their failure must not block the
 * profile itself, so the request degrades to an empty list.
 */
async function loadAttributes(profileId) {
  if (profileId == null) return []

  try {
    const { data } = await profileApi.attributes(profileId)
    return normalizeAttributes(data)
  } catch {
    return []
  }
}

export const useProfileStore = create((set, get) => ({
  status: 'idle',
  error: null,
  profileId: null,
  profile: null,
  attributes: [],

  /**
   * The backend resolves the profile from the JWT (`GET /profile/get/me`), so
   * the client no longer guesses it from the global profile list or nickname.
   */
  async init() {
    if (get().status === 'loading') return
    set({ status: 'loading', error: null })

    try {
      const { data: profile } = await profileApi.me()

      if (profile?.id == null) {
        set({ profileId: null, profile: null, attributes: [], status: 'empty', error: null })
        return
      }

      const attributes = await loadAttributes(profile.id)

      set({
        profileId: profile.id,
        profile,
        attributes,
        status: 'ready',
        error: null,
      })
    } catch (error) {
      // No profile for the account yet: show the explicit empty state instead
      // of falling back to another user's profile.
      if (error?.response?.status === 404) {
        set({ status: 'empty', error: null, profileId: null, profile: null, attributes: [] })
        return
      }

      set({ status: 'error', error: getErrorMessage(error) })
    }
  },

  async refresh() {
    if (!get().profileId) return

    try {
      const { data: profile } = await profileApi.me()
      const attributes = await loadAttributes(profile?.id ?? get().profileId)

      set({
        profileId: profile?.id ?? get().profileId,
        profile,
        attributes,
      })
    } catch (error) {
      set({ error: getErrorMessage(error) })
    }
  },

  async refreshAttributes() {
    const { profileId, attributes } = get()
    if (!profileId) return

    try {
      const { data } = await profileApi.attributes(profileId)
      set({ attributes: normalizeAttributes(data) })
    } catch (error) {
      set({ error: getErrorMessage(error) })
      if (!attributes.length) set({ attributes: [] })
    }
  },

  clearError() {
    set({ error: null })
  },
}))

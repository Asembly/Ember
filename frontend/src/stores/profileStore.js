import { create } from 'zustand'
import { getErrorMessage, readAuth } from '../api/client'
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

async function loadProfileBundle(profileId) {
  const [profileResult, attributesResult] = await Promise.allSettled([
    profileApi.byId(profileId),
    profileApi.attributes(profileId),
  ])

  if (profileResult.status === 'rejected') {
    throw profileResult.reason
  }

  return {
    profile: profileResult.value.data,
    attributes:
      attributesResult.status === 'fulfilled' ? normalizeAttributes(attributesResult.value.data) : [],
  }
}

/**
 * There is no /users/me endpoint, so the list of profiles is matched against the
 * nickname captured at sign-in. Falls back to the first profile.
 */
function pickProfile(profiles) {
  const nickname = readAuth()?.nickname
  if (!nickname) return profiles[0]

  const needle = String(nickname).trim().toLowerCase()
  const match = profiles.find(
    (profile) => String(profile?.nickname || '').trim().toLowerCase() === needle,
  )

  return match || profiles[0]
}

export const useProfileStore = create((set, get) => ({
  status: 'idle',
  error: null,
  profiles: [],
  profileId: null,
  profile: null,
  attributes: [],

  async init() {
    if (get().status === 'loading') return
    set({ status: 'loading', error: null })

    try {
      const { data } = await profileApi.list()
      const profiles = Array.isArray(data) ? data : []

      if (profiles.length === 0) {
        set({ profiles: [], profileId: null, profile: null, attributes: [], status: 'empty' })
        return
      }

      const chosen = pickProfile(profiles)
      const bundle = await loadProfileBundle(chosen.id)

      set({
        profiles,
        profileId: chosen.id,
        profile: bundle.profile,
        attributes: bundle.attributes,
        status: 'ready',
        error: null,
      })
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error) })
    }
  },

  async refresh() {
    const { profileId } = get()
    if (!profileId) return

    try {
      const bundle = await loadProfileBundle(profileId)
      set({ profile: bundle.profile, attributes: bundle.attributes })
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

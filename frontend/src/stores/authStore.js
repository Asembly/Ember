import { create } from 'zustand'
import { authApi } from '../api/endpoints'
import { clearAuth, getErrorMessage, readAuth, saveAuth } from '../api/client'
import { useAchievementStore } from './achievementStore'
import { usePomodoroStore } from './pomodoroStore'
import { useProfileStore } from './profileStore'
import { useSessionStore } from './sessionStore'
import { useTaskStore } from './taskStore'
import { useTaskTagStore } from './taskTagStore'

function decodeJwt(token) {
  try {
    const part = String(token || '').split('.')[1]
    if (!part) return null

    const normalized = part.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    const binary = window.atob(padded)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    return null
  }
}

function identityFromToken(token) {
  const claims = decodeJwt(token)
  const email = claims?.sub || claims?.email || null
  const claimNickname = claims?.nickname || claims?.name || null
  const emailNickname = email ? String(email).split('@')[0] : null

  return {
    email: email ? String(email) : null,
    nickname: claimNickname ? String(claimNickname) : emailNickname,
  }
}

function isExpired(token) {
  const claims = decodeJwt(token)
  if (!claims?.exp) return false
  return Number(claims.exp) * 1000 <= Date.now() + 5000
}

function resetWorkspace() {
  useProfileStore.setState({
    status: 'idle',
    error: null,
    profileId: null,
    profile: null,
    attributes: [],
  })
  useTaskStore.setState({
    status: 'idle',
    error: null,
    profileId: null,
    tasks: [],
    actions: [],
    tags: [],
    pendingTaskId: null,
  })
  useSessionStore.setState({
    status: 'idle',
    error: null,
    sessions: [],
    historyProfileId: null,
    activeByTask: {},
    busyTaskId: null,
  })
  useTaskTagStore.setState({ map: {} })
  usePomodoroStore.setState({
    phase: 'focus',
    taskId: null,
    endsAt: null,
    remainingMs: null,
    pomodoros: 0,
    busy: false,
    error: null,
  })
  useAchievementStore.setState({
    status: 'idle',
    error: null,
    stats: null,
    items: [],
    unlockedCount: 0,
    total: 0,
  })
}

const stored = readAuth()
const initialToken = stored?.access_token && !isExpired(stored.access_token) ? stored.access_token : null

export const useAuthStore = create((set, get) => ({
  status: initialToken ? 'authenticated' : 'anonymous',
  user: initialToken ? identityFromToken(initialToken) : null,
  error: null,
  busy: false,

  getAccessToken() {
    return readAuth()?.access_token || null
  },

  isAuthenticated() {
    return get().status === 'authenticated'
  },

  async login({ email, password }) {
    if (get().busy) return false
    set({ busy: true, error: null })

    try {
      const { data } = await authApi.login({ email: String(email).trim(), password })
      const identity = identityFromToken(data?.access_token)
      const tokens = saveAuth(data, {
        nickname: identity.nickname,
        email: identity.email,
      })

      if (!tokens?.access_token) {
        throw new Error('Сервер не вернул токен доступа')
      }

      resetWorkspace()
      set({
        status: 'authenticated',
        user: identityFromToken(tokens.access_token),
        error: null,
        busy: false,
      })
      return true
    } catch (error) {
      set({ busy: false, error: getErrorMessage(error) })
      throw error
    }
  },

  async register({ nickname, email, password }) {
    if (get().busy) return false
    set({ busy: true, error: null })

    try {
      const payload = {
        nickname: String(nickname).trim(),
        email: String(email).trim(),
        password,
        role: 'USER',
      }
      const { data } = await authApi.register(payload)
      const tokens = saveAuth(data, {
        nickname: payload.nickname,
        email: payload.email,
      })

      if (!tokens?.access_token) {
        throw new Error('Сервер не вернул токен доступа')
      }

      resetWorkspace()
      set({
        status: 'authenticated',
        user: identityFromToken(tokens.access_token) || { email: payload.email, nickname: payload.nickname },
        error: null,
        busy: false,
      })
      return true
    } catch (error) {
      set({ busy: false, error: getErrorMessage(error) })
      throw error
    }
  },

  logout() {
    clearAuth()
    resetWorkspace()
    set({ status: 'anonymous', user: null, error: null, busy: false })
  },

  handleUnauthorized() {
    clearAuth()
    resetWorkspace()
    set({ status: 'anonymous', user: null, busy: false })
  },

  clearError() {
    set({ error: null })
  },
}))

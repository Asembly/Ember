import axios from 'axios'

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://192.168.0.180:8080/api/v1').replace(
    /\/+$/,
    '',
)

export const AUTH_STORAGE_KEY = 'talis.auth'

function normalizeTokens(payload) {
    if (!payload || typeof payload !== 'object') return null

    const accessToken =
        payload.access_token || payload.accessToken || payload.token || payload.jwt || null
    const refreshToken = payload.refresh_token || payload.refreshToken || null

    if (!accessToken && !refreshToken) return null

    return { access_token: accessToken, refresh_token: refreshToken }
}

export function readAuth() {
    try {
        const raw = window.localStorage.getItem(AUTH_STORAGE_KEY)
        if (!raw) return null

        const parsed = JSON.parse(raw)
        const tokens = normalizeTokens(parsed)
        if (!tokens) return null

        return {
            ...tokens,
            nickname: parsed.nickname || null,
            email: parsed.email || null,
        }
    } catch {
        return null
    }
}

export function saveAuth(payload, extra = {}) {
    const tokens = normalizeTokens(payload)
    if (!tokens) return null

    const previous = readAuth()
    const next = {
        ...tokens,
        nickname: extra.nickname || previous?.nickname || null,
        email: extra.email || previous?.email || null,
    }

    try {
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(next))
    } catch {
        /* localStorage may be unavailable — the session still works in memory */
    }

    return next
}

export function clearAuth() {
    try {
        window.localStorage.removeItem(AUTH_STORAGE_KEY)
    } catch {
        /* noop */
    }
}

export function getAccessToken() {
    return readAuth()?.access_token || null
}

const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
})

let unauthorizedHandler = null

export function setUnauthorizedHandler(handler) {
    unauthorizedHandler = typeof handler === 'function' ? handler : null
}

client.interceptors.request.use((config) => {
    const token = getAccessToken()
    const url = String(config.url || '')

    if (token && !url.includes('/auth/')) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

client.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status
        const url = String(error?.config?.url || '')
        const isAuthCall = url.includes('/auth/')

        if (status === 401 && !isAuthCall && !error?.config?.__skipAuthRedirect) {
            clearAuth()
            if (unauthorizedHandler) unauthorizedHandler()
        }

        return Promise.reject(error)
    },
)

export function getErrorMessage(error) {
    if (!error) return 'Неизвестная ошибка'

    const response = error.response
    if (response) {
        const payload = response.data
        const serverMessage =
            (payload && typeof payload === 'object' && (payload.message || payload.error || payload.detail)) ||
            (typeof payload === 'string' && payload.trim() ? payload.trim() : null)

        if (serverMessage) return String(serverMessage)

        const status = response.status
        if (status === 400) return 'Некорректные данные'
        if (status === 401) return 'Требуется вход в аккаунт'
        if (status === 403) return 'Неверная почта или пароль'
        if (status === 404) return 'Запись не найдена'
        if (status === 409) return 'Такая запись уже существует'
        if (status >= 500) return 'Сервер вернул ошибку'
        return `Запрос отклонён (${status})`
    }

    if (error.code === 'ECONNABORTED') return 'Сервер не ответил вовремя'
    if (error.message === 'Network Error') return 'Сервер недоступен'
    return error.message || 'Неизвестная ошибка'
}

export default client

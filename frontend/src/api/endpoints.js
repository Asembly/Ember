import client from './client'

/**
 * The backend both declares `spring.mvc.servlet.path: /api/v1` and maps
 * AuthenticationController to `/api/v1/auth`, so the real auth prefix depends on
 * the deployment. Try the servlet-relative path first, then the doubled one.
 */
const AUTH_PREFIXES = ['/auth', '/api/v1/auth']

async function authRequest(path, { method = 'post', data, headers } = {}) {
    let lastError = null

    for (const prefix of AUTH_PREFIXES) {
        try {
            return await client.request({ url: `${prefix}${path}`, method, data, headers })
        } catch (error) {
            const status = error?.response?.status
            if (status === 404 || status === 405) {
                lastError = error
                continue
            }
            throw error
        }
    }

    throw lastError || new Error('Authentication endpoint is unreachable')
}

export const authApi = {
    login: (payload) => client.post('/auth/authenticate', payload),
    register: (payload) => client.post('/auth/register', payload),
    refresh: (refreshToken) =>
        client.post('/auth/refresh-token', null, {
            headers: refreshToken ? { Authorization: `Bearer ${refreshToken}` } : undefined,
        }),
}

export const profileApi = {
    // The signed-in user's profile. `/profile/get` returns every profile and
    // must not be used to pick "the current one".
    me: () => client.get('/profile/get/me'),
    attributes: (id) => client.get(`/profile/get/${id}/attribute`),
    getLeaderboard: (page = 0, limit = 10) =>
        client.get('/profile/get/leaderboard', { params: { page, limit } }),
}

export const taskApi = {
    list: () => client.get('/task/get'),
    listByProfile: (profileId) => client.get(`/task/get/profile/${profileId}`),
    byId: (id) => client.get(`/task/get/${id}`),
    create: (payload) => client.post('/task/create', payload),
    complete: (id) => client.patch(`/task/${id}/status/done`),
    cancel: (id) => client.patch(`/task/${id}/status/cancel`),
    changeDifficulty: (id, difficulty) =>
        client.patch(`/task/${id}/difficulty`, { id, difficulty }),
    startTimer: (id) => client.post(`/task/${id}/timer/start`),
    stopTimer: (id) => client.patch(`/task/${id}/timer/stop`),
}

export const sessionApi = {
    // Session history is scoped to the signed-in profile: `/session/get` returns
    // every user's sessions and must not be used by the client.
    history: (profileId) => client.get(`/session/get/history/${profileId}`),
    byId: (id) => client.get(`/session/get/${id}`),
    active: (profileId) => client.get(`/session/get/active/${profileId}`),
}

export const actionApi = {
    list: () => client.get('/action/get'),
    create: (payload) => client.post('/action/create', payload),
}

export const tagApi = {
    list: () => client.get('/tag/get'),
    byId: (id) => client.get(`/tag/get/${id}`),
    create: (payload) => client.post('/tag/create', payload),
}

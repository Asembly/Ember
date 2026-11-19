import { create } from 'zustand'
import { getErrorMessage } from '../api/client'
import { actionApi, tagApi, taskApi } from '../api/endpoints'
import { parseServerDate } from '../lib/format'

function normalizeTask(task) {
  if (!task || typeof task !== 'object') return null

  return {
    ...task,
    potentialXp: Number(task.potentialXp) || 0,
    // The backend now returns the task -> tag ids link directly.
    tagsId: Array.isArray(task.tagsId)
      ? task.tagsId.map(Number).filter(Number.isFinite)
      : [],
  }
}

function normalizeTasks(data) {
  return (Array.isArray(data) ? data : []).map(normalizeTask).filter(Boolean)
}

function sortTasks(tasks) {
  return [...tasks].sort((first, second) => {
    const firstDate = parseServerDate(first.createdAt)?.getTime() ?? 0
    const secondDate = parseServerDate(second.createdAt)?.getTime() ?? 0
    if (secondDate !== firstDate) return secondDate - firstDate
    return (second.id ?? 0) - (first.id ?? 0)
  })
}

export const useTaskStore = create((set, get) => ({
  status: 'idle',
  error: null,
  profileId: null,
  tasks: [],
  actions: [],
  tags: [],
  pendingTaskId: null,

  async fetchAll(profileId) {
    if (get().status === 'loading') return
    set({ status: 'loading', error: null })

    try {
      const [tasksResult, actionsResult, tagsResult] = await Promise.allSettled([
        profileId != null
          ? taskApi.listByProfile(profileId)
          : Promise.resolve({ data: [] }),
        actionApi.list(),
        tagApi.list(),
      ])

      if (tasksResult.status === 'rejected') {
        throw tasksResult.reason
      }

      const tasks = normalizeTasks(tasksResult.value?.data)
      const actions =
        actionsResult.status === 'fulfilled' ? (actionsResult.value.data ?? []) : []
      let tags = tagsResult.status === 'fulfilled' ? (tagsResult.value.data ?? []) : []

      if (profileId != null) {
        tags = tags.filter((tag) => tag.profileId === profileId)
      }

      set({
        profileId: profileId ?? null,
        tasks: sortTasks(tasks),
        actions,
        tags,
        status: 'ready',
        error: null,
      })
    } catch (error) {
      set({ status: 'error', error: getErrorMessage(error) })
    }
  },

  async fetchTasks(profileId) {
    const targetProfileId = profileId ?? get().profileId
    if (targetProfileId == null) return

    try {
      const { data } = await taskApi.listByProfile(targetProfileId)
      set({ tasks: sortTasks(normalizeTasks(data)) })
    } catch (error) {
      set({ error: getErrorMessage(error) })
    }
  },

  async createTask(payload) {
    const { data } = await taskApi.create(payload)
    const task = normalizeTask(data)

    if (task?.id != null) {
      set({ tasks: [task, ...get().tasks.filter((item) => item.id !== task.id)] })
      return task
    }

    await get().fetchTasks()
    return null
  },

  async changeDifficulty(id, difficulty) {
    set({ pendingTaskId: id })

    try {
      const { data } = await taskApi.changeDifficulty(id, difficulty)
      const updated = normalizeTask(data)

      if (updated?.id != null) {
        set({ tasks: get().tasks.map((task) => (task.id === id ? updated : task)) })
        return updated
      }

      set({
        tasks: get().tasks.map((task) =>
          task.id === id ? { ...task, difficulty } : task,
        ),
      })
      return null
    } finally {
      set({ pendingTaskId: null })
    }
  },

  async completeTask(id) {
    set({ pendingTaskId: id })

    try {
      const { data } = await taskApi.complete(id)
      const updated = normalizeTask(data)

      if (updated?.id != null) {
        set({ tasks: get().tasks.map((task) => (task.id === id ? updated : task)) })
        return updated
      }

      await get().fetchTasks()
      return null
    } finally {
      set({ pendingTaskId: null })
    }
  },

  async cancelTask(id) {
    set({ pendingTaskId: id })

    try {
      const { data } = await taskApi.cancel(id)
      const updated = normalizeTask(data)

      if (updated?.id != null) {
        set({ tasks: get().tasks.map((task) => (task.id === id ? updated : task)) })
        return updated
      }

      await get().fetchTasks()
      return null
    } finally {
      set({ pendingTaskId: null })
    }
  },

  async createAction(payload) {
    const { data } = await actionApi.create(payload)

    if (data?.id != null) {
      set({ actions: [...get().actions.filter((item) => item.id !== data.id), data] })
      return data
    }

    const response = await actionApi.list()
    set({ actions: response.data ?? [] })
    return null
  },

  async createTag(payload) {
    const { data } = await tagApi.create(payload)

    if (data?.id != null) {
      set({ tags: [...get().tags.filter((item) => item.id !== data.id), data] })
      return data
    }

    const response = await tagApi.list()
    const tags = (response.data ?? []).filter((tag) => tag.profileId === payload.profileId)
    set({ tags })
    return null
  },

  applyStatus(id, status) {
    set({
      tasks: get().tasks.map((task) => (task.id === id ? { ...task, status } : task)),
    })
  },

  clearError() {
    set({ error: null })
  },
}))

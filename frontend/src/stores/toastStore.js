import { create } from 'zustand'

let counter = 0

export const useToastStore = create((set, get) => ({
  toasts: [],

  push(message, tone = 'default') {
    const text = String(message || '').trim()
    if (!text) return
    const id = ++counter
    set({ toasts: [...get().toasts, { id, message: text, tone }] })

    window.setTimeout(() => {
      get().dismiss(id)
    }, 4200)
  },

  dismiss(id) {
    set({ toasts: get().toasts.filter((toast) => toast.id !== id) })
  },
}))

export function notify(message, tone = 'default') {
  useToastStore.getState().push(message, tone)
}

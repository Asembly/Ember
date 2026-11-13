import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getErrorMessage } from '../api/client'
import { useSessionStore } from './sessionStore'
import { notify } from './toastStore'

export const FOCUS_PRESETS = [15, 25, 50]
export const SHORT_MINUTES = 5
export const LONG_MINUTES = 15
export const LONG_EVERY = 4

export const PHASES = {
  focus: { id: 'focus', label: 'Фокус', tone: 'accent' },
  short: { id: 'short', label: 'Короткий перерыв', tone: 'positive' },
  long: { id: 'long', label: 'Длинный перерыв', tone: 'positive' },
}

export function phaseMinutes(phase, focusMinutes) {
  if (phase === 'short') return SHORT_MINUTES
  if (phase === 'long') return LONG_MINUTES
  return Number(focusMinutes) > 0 ? Number(focusMinutes) : 25
}

export function phaseDurationMs(phase, focusMinutes) {
  return phaseMinutes(phase, focusMinutes) * 60 * 1000
}

function minutesLabel(minutes) {
  return `${minutes} мин`
}

async function closeSession(taskId) {
  if (taskId == null) return

  const sessions = useSessionStore.getState()
  if (!sessions.hasActive(taskId)) return

  try {
    await sessions.stop(taskId)
  } catch (error) {
    const status = error?.response?.status
    if (status !== 404 && status !== 409) throw error
  }
}

export const usePomodoroStore = create(
  persist(
    (set, get) => ({
      phase: 'focus',
      focusMinutes: 25,
      taskId: null,
      endsAt: null,
      remainingMs: null,
      pomodoros: 0,
      busy: false,
      error: null,

      selectTask(taskId) {
        const nextId = taskId == null ? null : Number(taskId)
        if (nextId === get().taskId) return
        set({ taskId: nextId, remainingMs: null, endsAt: null, error: null })
      },

      setFocusMinutes(minutes) {
        const value = Number(minutes)
        if (!Number.isFinite(value) || value <= 0) return
        set({ focusMinutes: value, remainingMs: null })

        if (get().endsAt != null) {
          set({ endsAt: Date.now() + phaseDurationMs(get().phase, value) })
        }
      },

      async start() {
        const { taskId, phase, focusMinutes, remainingMs, busy, endsAt } = get()
        if (busy || endsAt != null) return

        if (phase === 'focus' && taskId == null) {
          notify('Выберите задачу для сессии', 'error')
          return
        }

        const duration = phaseDurationMs(phase, focusMinutes)
        const left = remainingMs != null && remainingMs > 0 ? Math.min(remainingMs, duration) : duration

        set({ busy: true, error: null })

        try {
          if (phase === 'focus') {
            const sessions = useSessionStore.getState()
            if (!sessions.hasActive(taskId)) {
              await sessions.start(taskId)
            }
          }

          set({ endsAt: Date.now() + left, remainingMs: null })
        } catch (error) {
          const message = getErrorMessage(error)
          set({ error: message, endsAt: null })
          notify(message, 'error')
        } finally {
          set({ busy: false })
        }
      },

      async pause() {
        const { endsAt, phase, taskId, busy } = get()
        if (busy || endsAt == null) return

        const left = Math.max(0, endsAt - Date.now())
        set({ endsAt: null, remainingMs: left, busy: true })

        try {
          if (phase === 'focus' && taskId != null) await closeSession(taskId)
        } catch (error) {
          notify(getErrorMessage(error), 'error')
        } finally {
          set({ busy: false })
        }
      },

      async stop() {
        const { phase, taskId, busy } = get()
        if (busy) return

        set({ endsAt: null, remainingMs: null, busy: true })

        try {
          if (phase === 'focus' && taskId != null) await closeSession(taskId)
        } catch (error) {
          notify(getErrorMessage(error), 'error')
        } finally {
          set({ busy: false })
        }
      },

      async complete() {
        const { phase, taskId, pomodoros, focusMinutes, busy, endsAt } = get()
        if (busy || endsAt == null) return

        set({ busy: true, endsAt: null, remainingMs: null })

        try {
          if (phase === 'focus') {
            try {
              await closeSession(taskId)
            } catch (error) {
              notify(getErrorMessage(error), 'error')
            }

            const done = pomodoros + 1
            const nextPhase = done % LONG_EVERY === 0 ? 'long' : 'short'

            set({ pomodoros: done, phase: nextPhase })
            notify(
              `Фокус завершён. ${PHASES[nextPhase].label} — ${minutesLabel(
                phaseMinutes(nextPhase, focusMinutes),
              )}.`,
              'success',
            )
          } else {
            set({ phase: 'focus' })
            notify('Перерыв закончился — можно вернуться к фокусу.', 'default')
          }
        } catch (error) {
          const message = getErrorMessage(error)
          set({ error: message })
          notify(message, 'error')
        } finally {
          set({ busy: false })
        }
      },

      async skip() {
        const { phase, focusMinutes, busy } = get()
        if (busy) return

        if (phase === 'focus') {
          await get().stop()
          const nextPhase = 'short'
          set({ phase: nextPhase, remainingMs: null })
          notify(`Перерыв — ${minutesLabel(phaseMinutes(nextPhase, focusMinutes))}.`, 'default')
          return
        }

        set({ phase: 'focus', remainingMs: null })
      },

      tick() {
        const { endsAt, busy } = get()
        if (endsAt == null || busy) return
        if (Date.now() < endsAt) return
        void get().complete()
      },

      resetProgress() {
        set({ pomodoros: 0, phase: 'focus', endsAt: null, remainingMs: null })
      },

      clearError() {
        set({ error: null })
      },
    }),
    {
      name: 'talis.pomodoro',
      partialize: (state) => ({
        phase: state.phase,
        focusMinutes: state.focusMinutes,
        taskId: state.taskId,
        endsAt: state.endsAt,
        remainingMs: state.remainingMs,
        pomodoros: state.pomodoros,
      }),
    },
  ),
)

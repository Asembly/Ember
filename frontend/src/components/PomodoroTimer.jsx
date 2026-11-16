import { useEffect, useMemo, useState } from 'react'
import ProgressBar from './ProgressBar'
import { PlayIcon, StopIcon, TimerIcon } from './icons'
import { formatClock, plural } from '../lib/format'
import { usePomodoroStore, FOCUS_PRESETS, LONG_EVERY, PHASES, phaseDurationMs, phaseMinutes } from '../stores/pomodoroStore'
import { useSessionStore } from '../stores/sessionStore'
import { useTaskStore } from '../stores/taskStore'

const OPEN_STATUSES = new Set(['OPEN', 'IN_PROGRESS'])

export default function PomodoroTimer() {
  const phase = usePomodoroStore((state) => state.phase)
  const focusMinutes = usePomodoroStore((state) => state.focusMinutes)
  const taskId = usePomodoroStore((state) => state.taskId)
  const endsAt = usePomodoroStore((state) => state.endsAt)
  const remainingMs = usePomodoroStore((state) => state.remainingMs)
  const pomodoros = usePomodoroStore((state) => state.pomodoros)
  const busy = usePomodoroStore((state) => state.busy)

  const start = usePomodoroStore((state) => state.start)
  const pause = usePomodoroStore((state) => state.pause)
  const stop = usePomodoroStore((state) => state.stop)
  const skip = usePomodoroStore((state) => state.skip)
  const tick = usePomodoroStore((state) => state.tick)
  const selectTask = usePomodoroStore((state) => state.selectTask)
  const setFocusMinutes = usePomodoroStore((state) => state.setFocusMinutes)

  const tasks = useTaskStore((state) => state.tasks)
  const activeByTask = useSessionStore((state) => state.activeByTask)

  const [now, setNow] = useState(() => Date.now())

  const activeTasks = useMemo(
    () => tasks.filter((task) => OPEN_STATUSES.has(task.status)),
    [tasks],
  )

  const running = endsAt != null
  const duration = phaseDurationMs(phase, focusMinutes)
  const left = running ? Math.max(0, endsAt - now) : remainingMs != null ? remainingMs : duration
  const percent = duration > 0 ? ((duration - left) / duration) * 100 : 0
  const phaseMeta = PHASES[phase] || PHASES.focus
  const isFocus = phase === 'focus'
  const sessionActive = taskId != null && Boolean(activeByTask?.[taskId])
  const paused = !running && remainingMs != null
  const selectedTask = activeTasks.find((task) => task.id === taskId)

  useEffect(() => {
    tick()
  }, [tick])

  useEffect(() => {
    if (endsAt == null) return undefined

    setNow(Date.now())
    const interval = window.setInterval(() => {
      setNow(Date.now())
      tick()
    }, 300)

    return () => window.clearInterval(interval)
  }, [endsAt, tick])

  useEffect(() => {
    if (running) return

    if (taskId != null) {
      if (activeTasks.some((task) => task.id === taskId)) return
      if (activeByTask?.[taskId]) return
      if (!activeTasks.length) return
      selectTask(activeTasks[0].id)
      return
    }

    const ids = Object.keys(activeByTask || {})
    const activeId = ids.length ? Number(ids[0]) : null

    if (activeId != null && activeTasks.some((task) => task.id === activeId)) {
      selectTask(activeId)
      return
    }

    if (activeTasks.length) selectTask(activeTasks[0].id)
  }, [activeTasks, activeByTask, running, taskId, selectTask])

  const hint = running
    ? isFocus
      ? 'Сессия пишется в историю'
      : 'Перерыв не влияет на статистику'
    : paused
      ? 'Пауза · оставшееся время сохранено'
      : isFocus
        ? `${phaseMinutes(phase, focusMinutes)} мин фокуса · сессия попадёт в историю`
        : `Перерыв ${phaseMinutes(phase, focusMinutes)} мин`

  return (
    <section className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center radius-theme"
            style={{ backgroundColor: 'var(--c-accent-soft)', color: 'var(--c-accent)' }}
          >
            <TimerIcon size={15} />
          </span>
          <div>
            <p className="eyebrow">Помидор</p>
            <h2 className="section-title mt-0.5">Таймер сессии</h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1.5 radius-theme px-2.5 py-[3px] text-[10.5px] font-semibold"
            style={{
              backgroundColor: isFocus
                ? 'var(--c-accent-soft)'
                : 'color-mix(in srgb, var(--c-positive) 14%, transparent)',
              color: isFocus ? 'var(--c-accent)' : 'var(--c-positive)',
            }}
          >
            {phaseMeta.label}
          </span>
          {sessionActive ? (
            <span
              className="inline-flex items-center gap-1.5 radius-theme px-2.5 py-[3px] text-[10.5px] font-semibold"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--c-positive) 14%, transparent)',
                color: 'var(--c-positive)',
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: 'var(--c-positive)' }}
              />
              Сессия идёт
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,190px)_minmax(0,1fr)] md:items-center">
        <div>
          <p className="mono-time text-[36px] leading-none text-ink">{formatClock(left)}</p>
          <p className="mt-1.5 text-[10.5px] text-muted">{hint}</p>
          <ProgressBar className="mt-3" value={percent} />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {FOCUS_PRESETS.map((minutes) => {
              const active = Number(focusMinutes) === minutes
              return (
                <button
                  key={minutes}
                  type="button"
                  className="radius-theme border px-2.5 py-[3px] text-[10.5px] font-semibold transition"
                  style={{
                    borderColor: active ? 'var(--c-accent)' : 'var(--c-line)',
                    backgroundColor: active ? 'var(--c-accent-soft)' : 'transparent',
                    color: active ? 'var(--c-accent)' : 'var(--c-muted)',
                  }}
                  onClick={() => setFocusMinutes(minutes)}
                  disabled={running || !isFocus}
                  aria-pressed={active}
                >
                  {minutes} мин
                </button>
              )
            })}
            <span className="ml-1 text-[10.5px] text-muted">
              {pomodoros} {plural(pomodoros, 'помидор', 'помидора', 'помидоров')}
            </span>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <select
              className="input h-[34px] min-w-0 flex-1 cursor-pointer py-0 pr-6 text-[11.5px] font-medium"
              value={taskId ?? ''}
              onChange={(event) =>
                selectTask(event.target.value === '' ? null : Number(event.target.value))
              }
              disabled={running}
              aria-label="Задача для сессии"
              title="Задача для сессии"
            >
              <option value="">
                {activeTasks.length ? 'Выберите задачу' : 'Нет активных задач'}
              </option>
              {activeTasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </select>

            <div className="flex flex-wrap items-center gap-2">
              {running ? (
                <>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => pause()}
                    disabled={busy}
                  >
                    Пауза
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => stop()}
                    disabled={busy}
                    title="Остановить без сохранения помидора"
                  >
                    <StopIcon size={11} />
                    Стоп
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => start()}
                    disabled={busy || (isFocus && taskId == null)}
                  >
                    <PlayIcon size={11} />
                    {paused ? 'Продолжить' : isFocus ? 'Старт' : 'Начать перерыв'}
                  </button>
                  {paused || left < duration ? (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => stop()}
                      disabled={busy}
                      title="Сбросить таймер"
                    >
                      Сброс
                    </button>
                  ) : null}
                </>
              )}
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => skip()}
                disabled={busy}
                title={isFocus ? 'Перейти к перерыву' : 'К фокусу'}
              >
                {isFocus ? 'Перерыв' : 'К фокусу'}
              </button>
            </div>
          </div>

          <p className="text-[10.5px] text-muted">
            {selectedTask
              ? `Задача: ${selectedTask.name}`
              : 'Выберите задачу — помидор запишет сессию в историю'}
            {' · '}
            длинный перерыв после {LONG_EVERY} помидоров
          </p>
        </div>
      </div>
    </section>
  )
}

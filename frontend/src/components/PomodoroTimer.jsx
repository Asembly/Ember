import { useEffect, useMemo, useState } from 'react'
import { PlayIcon, StopIcon, TimerIcon } from './icons'
import { formatClock, plural } from '../lib/format'
import { usePomodoroStore, FOCUS_PRESETS, LONG_EVERY, PHASES, phaseDurationMs, phaseMinutes } from '../stores/pomodoroStore'
import { useSessionStore } from '../stores/sessionStore'
import { useTaskStore } from '../stores/taskStore'

const OPEN_STATUSES = new Set(['OPEN', 'IN_PROGRESS'])
const RING_SIZE = 176
const RING_STROKE = 5

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

  const radius = (RING_SIZE - RING_STROKE) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, percent)) / 100) * circumference
  const cycleDots = Math.max(0, pomodoros % LONG_EVERY)
  const dots = Array.from({ length: LONG_EVERY }).map((_, index) => index < cycleDots)

  return (
    <section
      className="p-5"
      style={{
        borderRadius: 'var(--radius-lg, 24px)',
        backgroundColor: 'var(--c-accent)',
        color: 'var(--c-accent-ink)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <h2 className="display text-[15px] font-medium leading-tight">Время для фокуса</h2>
        <span
          className="inline-flex h-6 shrink-0 items-center px-2.5 text-[8.5px] font-semibold uppercase tracking-[0.08em]"
          style={{
            borderRadius: 'calc(var(--radius-sm, 12px) * 0.8)',
            backgroundColor: 'color-mix(in srgb, var(--c-accent) 55%, var(--c-accent-ink))',
            color: 'var(--c-ink)',
          }}
        >
          {phaseMeta.label}
        </span>
      </div>

      {sessionActive ? (
        <span
          className="mt-2 inline-flex h-6 items-center gap-1.5 px-2.5 text-[9px] font-semibold"
          style={{
            borderRadius: 'calc(var(--radius-sm, 12px) * 0.8)',
            backgroundColor: 'var(--c-positive)',
            color: 'var(--c-cta-ink)',
          }}
        >
          <span className="dot" style={{ backgroundColor: 'var(--c-cta-ink)' }} />
          Сессия идёт
        </span>
      ) : null}

      <div
        className="mt-3 flex items-stretch gap-1 p-1"
        style={{
          borderRadius: 'calc(var(--radius-sm, 12px) * 0.9)',
          backgroundColor: 'color-mix(in srgb, var(--c-accent) 62%, var(--c-accent-ink))',
        }}
        role="group"
        aria-label="Длительность фокуса"
      >
        {FOCUS_PRESETS.map((minutes) => {
          const active = Number(focusMinutes) === minutes

          return (
            <button
              key={minutes}
              type="button"
              className="flex-1 text-[11px] font-semibold transition disabled:opacity-45"
              style={{
                height: 30,
                borderRadius: 'calc(var(--radius-sm, 12px) * 0.7)',
                backgroundColor: active ? 'var(--c-hero-ink)' : 'transparent',
                color: active ? 'var(--c-ink)' : 'var(--c-accent-ink)',
              }}
              onClick={() => setFocusMinutes(minutes)}
              disabled={running || !isFocus}
              aria-pressed={active}
            >
              {minutes} мин
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-col items-center">
        <div className="relative" style={{ width: RING_SIZE, height: RING_SIZE }}>
          <svg width={RING_SIZE} height={RING_SIZE} className="-rotate-90" aria-hidden="true">
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={radius}
              fill="none"
              stroke="color-mix(in srgb, var(--c-accent-ink) 22%, transparent)"
              strokeWidth={RING_STROKE}
            />
            <circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={radius}
              fill="none"
              stroke="var(--c-accent-ink)"
              strokeWidth={RING_STROKE}
              strokeLinecap="butt"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{ transition: 'stroke-dashoffset 300ms linear' }}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="display text-[42px] font-bold leading-none tracking-tight">
              {formatClock(left)}
            </span>
            <span className="mt-2 text-[10px] font-medium" style={{ opacity: 0.78 }}>
              осталось из {phaseMinutes(phase, focusMinutes)} минут
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2" aria-hidden="true">
          {dots.map((filled, index) => (
            <span
              key={index}
              style={{
                width: 9,
                height: 9,
                borderRadius: 999,
                backgroundColor: filled
                  ? 'var(--c-accent-ink)'
                  : 'color-mix(in srgb, var(--c-accent-ink) 28%, transparent)',
              }}
            />
          ))}
        </div>
      </div>

      <p className="mt-3 truncate text-center text-[13px] font-bold">
        {selectedTask ? selectedTask.name : 'Задача не выбрана'}
      </p>
      <p className="mt-1 text-center text-[9.5px] leading-snug" style={{ opacity: 0.76 }}>
        {hint}
        {sessionActive ? ' · сессия сохранена' : ''}
      </p>

      <select
        className="input mt-3 w-full cursor-pointer text-[11px] font-medium"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--c-accent-ink) 10%, transparent)',
          borderColor: 'color-mix(in srgb, var(--c-accent-ink) 22%, transparent)',
          color: 'var(--c-accent-ink)',
        }}
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

      <div className="mt-2 flex items-center gap-2">
        {running ? (
          <>
            <button
              type="button"
              className="btn btn-contrast flex-1"
              onClick={() => pause()}
              disabled={busy}
            >
              Пауза
            </button>
            <button
              type="button"
              className="btn btn-icon"
              onClick={() => stop()}
              disabled={busy}
              title="Остановить без сохранения помидора"
              aria-label="Остановить таймер"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--c-accent-ink) 12%, transparent)',
                color: 'var(--c-accent-ink)',
                borderColor: 'color-mix(in srgb, var(--c-accent-ink) 26%, transparent)',
              }}
            >
              <StopIcon size={13} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-contrast flex-1"
              onClick={() => start()}
              disabled={busy || (isFocus && taskId == null)}
            >
              <PlayIcon size={11} />
              {paused ? 'Продолжить' : isFocus ? 'Старт' : 'Начать перерыв'}
            </button>
            {paused || left < duration ? (
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => stop()}
                disabled={busy}
                title="Сбросить таймер"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--c-accent-ink)',
                  borderColor: 'color-mix(in srgb, var(--c-accent-ink) 26%, transparent)',
                }}
              >
                Сброс
              </button>
            ) : null}
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => skip()}
              disabled={busy}
              title={isFocus ? 'Перейти к перерыву' : 'К фокусу'}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--c-accent-ink)',
                borderColor: 'color-mix(in srgb, var(--c-accent-ink) 26%, transparent)',
              }}
            >
              {isFocus ? 'Перерыв' : 'К фокусу'}
            </button>
          </>
        )}
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[9px]" style={{ opacity: 0.7 }}>
        <TimerIcon size={10} />
        {pomodoros} {plural(pomodoros, 'помидор', 'помидора', 'помидоров')} · длинный перерыв после{' '}
        {LONG_EVERY}
      </p>
    </section>
  )
}

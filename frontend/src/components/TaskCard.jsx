import TaskTimer from './TaskTimer'
import {
  CalendarIcon,
  CheckIcon,
  CloseIcon,
  ClockIcon,
  PlayIcon,
  StopIcon,
} from './icons'
import {
  DIFFICULTY_META,
  DIFFICULTY_ORDER,
  difficultyMeta,
  statusMeta,
} from '../lib/meta'
import { deadlineLabel, formatDateTime, formatXp } from '../lib/format'

const TONE_COLOR = {
  negative: 'var(--c-negative)',
  warning: 'var(--c-warning)',
  muted: 'var(--c-muted)',
}

function markerStyle(status) {
  if (status === 'DONE') {
    return {
      borderColor: 'color-mix(in srgb, var(--c-positive) 55%, transparent)',
      backgroundColor: 'color-mix(in srgb, var(--c-positive) 18%, transparent)',
      color: 'var(--c-positive)',
    }
  }

  if (status === 'IN_PROGRESS') {
    return {
      borderColor: 'color-mix(in srgb, var(--c-accent) 55%, transparent)',
      backgroundColor: 'var(--c-accent-soft)',
      color: 'var(--c-accent)',
    }
  }

  if (status === 'CANCELED') {
    return {
      borderColor: 'color-mix(in srgb, var(--c-negative) 45%, transparent)',
      backgroundColor: 'color-mix(in srgb, var(--c-negative) 14%, transparent)',
      color: 'var(--c-negative)',
    }
  }

  return {
    borderColor: 'color-mix(in srgb, var(--c-muted) 55%, transparent)',
    backgroundColor: 'transparent',
    color: 'var(--c-muted)',
  }
}

export default function TaskCard({
  task,
  activeTimer,
  pending = false,
  onStart,
  onStop,
  onDone,
  onCancel,
  onDifficultyChange,
}) {
  const status = statusMeta(task.status)
  const difficulty = difficultyMeta(task.difficulty)
  const closed = task.status === 'DONE' || task.status === 'CANCELED'
  const running = Boolean(activeTimer)
  const deadline = deadlineLabel(task.deadline)
  const finishedLabel = closed
    ? `${task.status === 'DONE' ? 'Завершена' : 'Отменена'} ${formatDateTime(task.finishedAt, '')}`.trim()
    : null
  const marker = markerStyle(task.status)

  return (
    <article
      className="card card-hover flex flex-col gap-3 p-4"
      style={{
        borderRadius: 'var(--radius)',
        backgroundColor: running
          ? 'color-mix(in srgb, var(--c-surface) 92%, var(--c-accent))'
          : 'var(--c-surface)',
        borderColor: running
          ? 'color-mix(in srgb, var(--c-accent) 30%, transparent)'
          : 'transparent',
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border"
          style={{
            borderRadius: 'calc(var(--radius-sm, 12px) * 0.5)',
            borderColor: marker.borderColor,
            backgroundColor: marker.backgroundColor,
            color: marker.color,
          }}
          aria-hidden="true"
        >
          {task.status === 'DONE' ? <CheckIcon size={12} /> : null}
          {task.status === 'IN_PROGRESS' ? <PlayIcon size={10} /> : null}
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`line-clamp-2 text-[13.5px] font-medium leading-snug ${
                closed ? 'text-muted' : 'text-ink'
              }`}
            >
              {task.name}
            </h3>

            {!closed ? (
              <span
                className="shrink-0 text-[11.5px] font-bold"
                style={{ color: 'var(--c-positive)' }}
                title="Потенциальный опыт"
              >
                +{formatXp(task.potentialXp)} XP
              </span>
            ) : null}
          </div>

          {task.description ? (
            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              {task.description}
            </p>
          ) : null}

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className={status.chip}>{status.label}</span>
            <span className={difficulty.chip}>{difficulty.label}</span>

            {deadline ? (
              <span
                className="chip"
                style={{ color: TONE_COLOR[deadline.tone] || 'var(--c-muted)' }}
              >
                <CalendarIcon size={10} />
                {deadline.text}
              </span>
            ) : null}

            {task.scheduledAt ? (
              <span className="chip">
                <ClockIcon size={10} />
                {formatDateTime(task.scheduledAt)}
              </span>
            ) : null}

            {(task.tags || []).map((tag) => (
              <span key={`tag-${tag.id}`} className="chip" title={tag.name}>
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: tag.hex }}
                  aria-hidden="true"
                />
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-3"
        style={{ borderTop: '1px solid color-mix(in srgb, var(--c-ink) 9%, transparent)' }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="inline-flex h-7 items-center px-2"
            style={{ borderRadius: 'calc(var(--radius-sm, 12px) * 0.75)', backgroundColor: 'var(--c-sunken)' }}
          >
            <TaskTimer
              startedAt={activeTimer?.startedAt}
              active={running}
              className="text-[12px] font-semibold"
            />
          </span>

          {!closed && !running ? (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onStart?.(task)}
              disabled={pending}
            >
              <PlayIcon size={10} />
              Начать
            </button>
          ) : null}

          {!closed && running ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onStop?.(task)}
              disabled={pending}
            >
              <StopIcon size={10} />
              Остановить
            </button>
          ) : null}

          {closed ? (
            <span className="truncate text-[10px]" style={{ color: 'var(--c-muted)' }}>
              {finishedLabel || 'Закрыта'}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5">
          {!closed ? (
            <select
              className="input h-8 w-[104px] cursor-pointer py-0 pr-5 text-[10.5px] font-semibold"
              value={DIFFICULTY_META[task.difficulty] ? task.difficulty : ''}
              onChange={(event) => onDifficultyChange?.(task, event.target.value)}
              disabled={pending}
              aria-label="Сложность"
              title="Сложность"
            >
              {!DIFFICULTY_META[task.difficulty] ? <option value="">—</option> : null}
              {DIFFICULTY_ORDER.map((key) => (
                <option key={key} value={key}>
                  {DIFFICULTY_META[key].label}
                </option>
              ))}
            </select>
          ) : null}

          {!closed ? (
            <>
              <button
                type="button"
                className="btn btn-ghost btn-icon !h-8 !min-h-[2rem] !w-8"
                onClick={() => onCancel?.(task)}
                disabled={pending}
                title="Отменить задачу"
                aria-label="Отменить задачу"
              >
                <CloseIcon size={13} />
              </button>
              <button
                type="button"
                className="btn btn-primary btn-icon !h-8 !min-h-[2rem] !w-8"
                onClick={() => onDone?.(task)}
                disabled={pending}
                title="Завершить задачу"
                aria-label="Завершить задачу"
              >
                <CheckIcon size={13} />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </article>
  )
}

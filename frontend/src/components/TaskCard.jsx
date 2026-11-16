import TaskTimer from './TaskTimer'
import {
  BoltIcon,
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

  return (
    <article className="card card-hover flex flex-col gap-3.5 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 radius-theme border px-2.5 py-[3px] text-[10.5px] font-semibold ${status.chip}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </span>

            {running ? (
              <span
                className="inline-flex items-center gap-1.5 radius-theme px-2.5 py-[3px] text-[10.5px] font-semibold"
                style={{ backgroundColor: 'var(--c-accent-soft)', color: 'var(--c-accent)' }}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ backgroundColor: 'var(--c-accent)' }} />
                Сессия
              </span>
            ) : null}
          </div>

          <h3 className="mt-2.5 line-clamp-1 text-[14.5px] font-semibold text-ink">{task.name}</h3>

          {task.description ? (
            <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted">
              {task.description}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <div
            className="flex items-center gap-1.5 radius-theme border border-line px-2.5 py-1.5"
            style={{ backgroundColor: 'var(--c-raised)' }}
            title="Потенциальный опыт"
          >
            <BoltIcon size={13} style={{ color: 'var(--c-accent)' }} />
            <span className="text-[13px] font-semibold text-ink">{formatXp(task.potentialXp)}</span>
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-muted">
              XP
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={`inline-flex items-center gap-1.5 radius-theme border px-2.5 py-[3px] text-[10.5px] font-semibold ${difficulty.chip}`}
        >
          {difficulty.label}
        </span>

        {deadline ? (
          <span
            className="inline-flex items-center gap-1.5 radius-theme border border-line px-2.5 py-[3px] text-[10.5px] font-medium"
            style={{ color: TONE_COLOR[deadline.tone] || 'var(--c-muted)' }}
          >
            <CalendarIcon size={11} />
            {deadline.text}
          </span>
        ) : null}

        {task.scheduledAt ? (
          <span className="inline-flex items-center gap-1.5 radius-theme border border-line px-2.5 py-[3px] text-[10.5px] font-medium text-muted">
            <ClockIcon size={11} />
            {formatDateTime(task.scheduledAt)}
          </span>
        ) : null}

        {(task.tags || []).map((tag) => (
          <span
            key={`tag-${tag.id}`}
            className="inline-flex items-center gap-1.5 border px-2.5 py-[2px] text-[10.5px] font-bold"
            style={{
              borderColor: 'var(--c-ink)',
              borderWidth: 'var(--border-width, 1px)',
              borderRadius: 'var(--radius, 8px)',
              backgroundColor: tag.hex,
              color: '#141018',
            }}
            title={tag.name}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#141018' }} />
            {tag.name}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2.5 border-t border-line pt-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center gap-2 radius-theme border border-line px-2.5 py-1.5"
            style={{ backgroundColor: 'var(--c-canvas)' }}
          >
            <TaskTimer startedAt={activeTimer?.startedAt} active={running} className="text-[13px] font-semibold" />
          </div>

          {!closed && !running ? (
            <button type="button" className="btn btn-primary btn-sm" onClick={() => onStart?.(task)} disabled={pending}>
              <PlayIcon size={11} />
              Начать сессию
            </button>
          ) : null}

          {!closed && running ? (
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => onStop?.(task)} disabled={pending}>
              <StopIcon size={11} />
              Остановить
            </button>
          ) : null}

          {closed ? (
            <span className="text-[10.5px] text-muted">{finishedLabel || 'Закрыта'}</span>
          ) : null}
        </div>

        <div className="flex items-center gap-1.5">
          {!closed ? (
            <select
              className="input h-[30px] w-[124px] cursor-pointer py-0 pr-6 text-[10.5px] font-semibold"
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
                className="btn btn-ghost btn-icon"
                onClick={() => onCancel?.(task)}
                disabled={pending}
                title="Отменить задачу"
                aria-label="Отменить задачу"
              >
                <CloseIcon size={13} />
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onDone?.(task)}
                disabled={pending}
              >
                <CheckIcon size={12} />
                Готово
              </button>
            </>
          ) : null}
        </div>
      </div>
    </article>
  )
}

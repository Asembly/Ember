import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BalanceRadar from '../components/BalanceRadar'
import LevelRing from '../components/LevelRing'
import PomodoroTimer from '../components/PomodoroTimer'
import SegmentBar from '../components/SegmentBar'
import EmptyState from '../components/EmptyState'
import {
  ArrowRightIcon,
  BoltIcon,
  CheckIcon,
  ClockIcon,
  PlayIcon,
  TargetIcon,
  TrophyIcon,
} from '../components/icons'
import { useProfileStore } from '../stores/profileStore'
import { useSessionStore } from '../stores/sessionStore'
import { useTaskStore } from '../stores/taskStore'
import { buildAchievementStats, evaluateAchievements } from '../lib/achievements'
import { attributeLabel, difficultyMeta } from '../lib/meta'
import {
  clampPercent,
  dayKey,
  deadlineLabel,
  formatDuration,
  formatNumber,
  formatXp,
  parseServerDate,
  percentOf,
  plural,
  startOfDay,
} from '../lib/format'

const WEEKDAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

const TASK_VIEWS = [
  { id: 'ALL', label: 'Все задачи' },
  { id: 'ACTIVE', label: 'В работе' },
  { id: 'DONE', label: 'Завершённые' },
]

const ATTRIBUTE_TONES = [
  'var(--c-accent)',
  'var(--c-warning)',
  'var(--c-positive)',
  'var(--c-accent-strong)',
]

function statusMarker(status) {
  if (status === 'DONE') {
    return {
      background: 'color-mix(in srgb, var(--c-positive) 20%, transparent)',
      borderColor: 'color-mix(in srgb, var(--c-positive) 55%, transparent)',
      color: 'var(--c-positive)',
      icon: <CheckIcon size={12} />,
    }
  }

  if (status === 'IN_PROGRESS') {
    return {
      background: 'var(--c-accent-soft)',
      borderColor: 'color-mix(in srgb, var(--c-accent) 55%, transparent)',
      color: 'var(--c-accent)',
      icon: <PlayIcon size={11} />,
    }
  }

  if (status === 'CANCELED') {
    return {
      background: 'color-mix(in srgb, var(--c-negative) 14%, transparent)',
      borderColor: 'color-mix(in srgb, var(--c-negative) 45%, transparent)',
      color: 'var(--c-negative)',
      icon: null,
    }
  }

  return {
    background: 'transparent',
    borderColor: 'color-mix(in srgb, var(--c-muted) 55%, transparent)',
    color: 'var(--c-muted)',
    icon: null,
  }
}

function StatCard({ label, value, hint, tone, icon }) {
  return (
    <div className="card flex flex-col gap-2.5 p-3.5" style={{ borderRadius: 'var(--radius)' }}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] leading-snug" style={{ color: 'var(--c-muted)' }}>
          {label}
        </p>
        {icon ? <span className="shrink-0" style={{ color: tone }}>{icon}</span> : null}
      </div>

      <p className="stat-value truncate" style={{ color: tone }}>
        {value}
      </p>
      {hint ? (
        <p className="line-clamp-1 text-[10px]" style={{ color: 'var(--c-muted)' }}>
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export default function Dashboard() {
  const profile = useProfileStore((state) => state.profile)
  const attributes = useProfileStore((state) => state.attributes)
  const tasks = useTaskStore((state) => state.tasks)
  const sessions = useSessionStore((state) => state.sessions)

  const [taskView, setTaskView] = useState('ALL')

  const stats = useMemo(
    () => buildAchievementStats({ tasks, sessions, profile, attributes }),
    [tasks, sessions, profile, attributes],
  )
  const achievements = useMemo(() => evaluateAchievements(stats), [stats])

  const doneTasks = stats.doneTasks
  const activeTasks = tasks.filter(
    (task) => task.status === 'OPEN' || task.status === 'IN_PROGRESS',
  ).length
  const unlocked = achievements.filter((achievement) => achievement.unlocked).length
  const closest = useMemo(
    () =>
      achievements
        .filter((achievement) => !achievement.unlocked)
        .sort((first, second) => second.percent - first.percent)[0] || null,
    [achievements],
  )

  const levelPercent = clampPercent(percentOf(profile?.currentXp, profile?.nextLevelUp))
  const level = Number(profile?.level) || 1
  const remainingXp = Math.max(
    0,
    Number(profile?.nextLevelUp ?? 0) - Number(profile?.currentXp ?? 0),
  )

  const week = useMemo(() => {
    const today = startOfDay(new Date())
    const days = []

    for (let index = 6; index >= 0; index -= 1) {
      const day = new Date(today.getTime() - index * 24 * 60 * 60 * 1000)
      const next = new Date(day.getTime() + 24 * 60 * 60 * 1000)
      let minutes = 0

      sessions.forEach((session) => {
        const start = parseServerDate(session.createdAt)
        if (!start) return
        if (start >= day && start < next) {
          minutes += Number(session.durationInMin) || 0
        }
      })

      days.push({
        key: dayKey(day),
        label: WEEKDAYS[day.getDay()],
        minutes,
        today: index === 0,
      })
    }

    return days
  }, [sessions])

  const weekTotal = week.reduce((sum, day) => sum + day.minutes, 0)
  const weekPeak = Math.max(1, ...week.map((day) => day.minutes))

  const streak = useMemo(() => {
    const activeDays = new Set(
      sessions
        .filter((session) => (Number(session.durationInMin) || 0) > 0)
        .map((session) => dayKey(session.createdAt)),
    )
    if (activeDays.size === 0) return 0

    let cursor = new Date()
    if (!activeDays.has(dayKey(cursor))) {
      cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000)
    }

    let count = 0
    while (activeDays.has(dayKey(cursor))) {
      count += 1
      cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000)
    }
    return count
  }, [sessions])

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (taskView === 'ACTIVE') return task.status === 'OPEN' || task.status === 'IN_PROGRESS'
      if (taskView === 'DONE') return task.status === 'DONE' || task.status === 'CANCELED'
      return true
    })

    return filtered.slice(0, 5)
  }, [tasks, taskView])

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start xl:gap-6">
      <div className="min-w-0 space-y-4">
        <section
          className="relative overflow-hidden p-6 sm:p-7"
          style={{
            backgroundColor: 'var(--c-hero)',
            color: 'var(--c-hero-ink)',
            borderRadius: 'var(--radius-lg, 24px)',
          }}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <span
                className="inline-flex h-6 items-center px-2.5 text-[8.5px] font-semibold uppercase tracking-[0.08em]"
                style={{
                  borderRadius: 'calc(var(--radius-sm, 12px) * 0.8)',
                  backgroundColor: 'var(--c-negative)',
                  color: 'var(--c-hero-ink)',
                }}
              >
                Твой новый уровень начинается здесь
              </span>

              <h2 className="display mt-4 text-[26px] font-bold leading-8 sm:text-[30px] sm:leading-10">
                Каждый день —
                <br />
                на уровень выше
              </h2>

              <p className="mt-3 text-[11.5px] font-medium" style={{ opacity: 0.82 }}>
                {profile?.nickname ?? 'Профиль'} · {level} {plural(level, 'уровень', 'уровня', 'уровней')} ·{' '}
                {formatXp(profile?.currentXp)} / {formatXp(profile?.nextLevelUp)} XP
              </p>
              <p className="mt-1 text-[10.5px]" style={{ opacity: 0.66 }}>
                Три приоритета. Один шаг к лучшей версии себя.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-5 sm:pr-2">
              <LevelRing
                level={level}
                percent={levelPercent}
                size={148}
                stroke={10}
                track="color-mix(in srgb, var(--c-hero-ink) 18%, transparent)"
                fill="var(--c-hero-ink)"
                ink="var(--c-hero-ink)"
                muted="color-mix(in srgb, var(--c-hero-ink) 72%, transparent)"
              />
            </div>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Активные"
            value={activeTasks}
            hint={plural(activeTasks, 'задача в работе', 'задачи в работе', 'задач в работе')}
            tone="var(--c-accent)"
            icon={<TargetIcon size={14} />}
          />
          <StatCard
            label="Выполнено"
            value={doneTasks}
            hint={`из ${tasks.length} ${plural(tasks.length, 'задачи', 'задачи', 'задач')}`}
            tone="var(--c-positive)"
            icon={<CheckIcon size={14} />}
          />
          <StatCard
            label="Время в фокусе"
            value={formatDuration(stats.totalMinutes)}
            hint={`${sessions.length} ${plural(sessions.length, 'сессия', 'сессии', 'сессий')}`}
            tone="var(--c-warning)"
            icon={<ClockIcon size={14} />}
          />
          <StatCard
            label="Достижения"
            value={`${unlocked}/${achievements.length}`}
            hint={`${Math.round((unlocked / Math.max(1, achievements.length)) * 100)}% коллекции`}
            tone="var(--c-accent-strong)"
            icon={<TrophyIcon size={14} />}
          />
        </div>

        <section className="card card-lg p-5">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="section-title">Мои задачи</h2>
            <span className="chip chip-accent h-5 px-2 text-[10px] font-semibold">
              {tasks.length}
            </span>

            <Link to="/tasks" className="btn btn-primary btn-sm ml-auto">
              Все задачи
              <ArrowRightIcon size={12} />
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-1" role="group" aria-label="Фильтр задач">
            {TASK_VIEWS.map((view) => (
              <button
                key={view.id}
                type="button"
                className="tab"
                aria-pressed={taskView === view.id}
                onClick={() => setTaskView(view.id)}
              >
                {view.label}
              </button>
            ))}

          </div>

          <div className="mt-2">
            {visibleTasks.length === 0 ? (
              <div className="pt-2">
                <EmptyState
                  icon={TargetIcon}
                  title="Задач пока нет"
                  hint="Создайте первую задачу на странице «Задачи»."
                  action={
                    <Link to="/tasks" className="btn btn-secondary btn-sm">
                      Перейти к задачам
                    </Link>
                  }
                />
              </div>
            ) : (
              <ul>
                {visibleTasks.map((task) => {
                  const marker = statusMarker(task.status)
                  const difficulty = difficultyMeta(task.difficulty)
                  const deadline = deadlineLabel(task.deadline)
                  const running = task.status === 'IN_PROGRESS'

                  return (
                    <li key={task.id} className="relative">
                      <Link
                        to="/tasks"
                        className="row-hover flex min-h-[62px] items-center gap-3 py-2.5 pl-4 pr-2 transition"
                        style={{
                          borderRadius: 'var(--radius-sm, 12px)',
                          backgroundColor: running ? 'var(--c-raised)' : 'transparent',
                        }}
                      >
                        {running ? (
                          <span
                            className="absolute left-0 top-1/2 h-9 w-[3px] -translate-y-1/2"
                            style={{
                              borderRadius: 'calc(var(--radius-sm, 12px) * 0.2)',
                              backgroundColor: 'var(--c-accent)',
                            }}
                            aria-hidden="true"
                          />
                        ) : null}

                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center border"
                          style={{
                            borderRadius: 'calc(var(--radius-sm, 12px) * 0.5)',
                            borderColor: marker.borderColor,
                            backgroundColor: marker.background,
                            color: marker.color,
                          }}
                          aria-hidden="true"
                        >
                          {marker.icon}
                        </span>

                        <div className="min-w-0 flex-1">
                          <p
                            className={`line-clamp-1 text-[13.5px] font-medium ${
                              task.status === 'DONE' ? 'text-muted line-through' : 'text-ink'
                            }`}
                          >
                            {task.name}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                            <span className="chip h-5 px-2 text-[9.5px]">
                              {difficulty.label}
                            </span>
                            {(task.tags || []).slice(0, 2).map((tag) => (
                              <span key={tag.id} className="chip h-5 px-2 text-[9.5px]">
                                {tag.name}
                              </span>
                            ))}
                            {deadline ? (
                              <span
                                className="text-[9.5px]"
                                style={{
                                  color:
                                    deadline.tone === 'negative'
                                      ? 'var(--c-negative)'
                                      : deadline.tone === 'warning'
                                        ? 'var(--c-warning)'
                                        : 'var(--c-muted)',
                                }}
                              >
                                {deadline.text}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <span
                          className="shrink-0 text-[11.5px] font-bold"
                          style={{ color: 'var(--c-positive)' }}
                        >
                          +{formatXp(task.potentialXp)} XP
                        </span>

                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center"
                          style={{ color: running ? 'var(--c-accent)' : 'var(--c-muted)' }}
                          aria-hidden="true"
                        >
                          <ArrowRightIcon size={14} />
                        </span>
                      </Link>

                      <div className="surface-divider ml-4" />
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </section>

        <section className="card card-lg p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="section-title">Твой ритм</h2>
              <p className="mt-1 text-[11.5px]" style={{ color: 'var(--c-muted)' }}>
                Фокус за последние 7 дней
              </p>
            </div>
            <span className="chip h-6 px-2.5 text-[10px] font-semibold">Неделя</span>
          </div>

          <div className="mt-5 flex items-stretch gap-4">
            <div className="flex min-w-0 flex-1 items-end justify-between gap-2">
              {week.map((day) => {
                const height = Math.max(6, Math.round((day.minutes / weekPeak) * 100))

                return (
                  <div key={day.key} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div
                      className="relative w-full max-w-[44px] overflow-hidden"
                      style={{
                        height: 64,
                        borderRadius: 'calc(var(--radius-sm, 12px) * 0.7)',
                        backgroundColor: 'var(--c-sunken)',
                      }}
                      title={`${day.label}: ${formatDuration(day.minutes)}`}
                    >
                      <span
                        className="absolute bottom-0 left-0 right-0"
                        style={{
                          height: `${height}%`,
                          borderRadius: 'calc(var(--radius-sm, 12px) * 0.7)',
                          backgroundColor: day.today
                            ? 'var(--c-positive)'
                            : day.minutes > 0
                              ? 'var(--c-accent)'
                              : 'transparent',
                        }}
                      />
                    </div>
                    <span
                      className="text-[9.5px] font-semibold"
                      style={{ color: day.today ? 'var(--c-positive)' : 'var(--c-muted)' }}
                    >
                      {day.label}
                    </span>
                  </div>
                )
              })}
            </div>

            <div
              className="flex w-[150px] shrink-0 flex-col justify-center gap-1 pl-4"
              style={{ borderLeft: '1px solid var(--c-line)' }}
            >
              <p className="display text-[20px] font-bold leading-tight text-ink">
                {formatDuration(weekTotal)}
              </p>
              <p className="text-[10.5px]" style={{ color: 'var(--c-muted)' }}>
                за неделю
              </p>
              <p className="mt-1 text-[10.5px] font-semibold" style={{ color: 'var(--c-positive)' }}>
                {streak > 0
                  ? `${streak} ${plural(streak, 'день', 'дня', 'дней')} в ритме`
                  : 'Начни серию'}
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-4">
        <PomodoroTimer />

        <section className="card card-lg p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="section-title">Твой прогресс</h2>
            <span className="chip h-5 px-2 text-[9.5px] font-semibold">ур. {level}</span>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div
              className="flex h-16 w-16 shrink-0 flex-col items-center justify-center"
              style={{
                borderRadius: 'calc(var(--radius, 16px) * 1.2)',
                backgroundColor: 'var(--c-positive)',
                color: 'var(--c-cta-ink)',
              }}
            >
              <span className="display text-[28px] font-bold leading-none">{level}</span>
              <span className="mt-1 text-[7px] font-bold uppercase tracking-[0.12em]">Уровень</span>
            </div>

            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold text-ink">
                {profile?.nickname ?? 'Профиль'}
              </p>
              <p className="mt-1 text-[10.5px]" style={{ color: 'var(--c-muted)' }}>
                До уровня {level + 1} — {formatXp(remainingXp)} XP
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between text-[10.5px]">
            <span style={{ color: 'var(--c-muted)' }}>
              {formatNumber(profile?.currentXp)} / {formatNumber(profile?.nextLevelUp)} XP
            </span>
            <span className="font-bold" style={{ color: 'var(--c-positive)' }}>
              {Math.round(levelPercent)}%
            </span>
          </div>

          <SegmentBar
            className="mt-2"
            value={levelPercent}
            segments={20}
            tone="var(--c-positive)"
            empty="var(--c-raised)"
            height={8}
            label="Опыт до следующего уровня"
          />

          <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.16em] text-muted">
            Атрибуты
          </p>

          {attributes.length === 0 ? (
            <p className="mt-3 text-[11px]" style={{ color: 'var(--c-muted)' }}>
              Атрибуты появятся вместе с первым действием.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {attributes.slice(0, 4).map((attribute, index) => {
                const percent = clampPercent(
                  percentOf(attribute.currentXp, attribute.nextLevelUp || 1),
                )
                const tone = ATTRIBUTE_TONES[index % ATTRIBUTE_TONES.length]

                return (
                  <li key={attribute.id ?? attribute.name ?? index}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[11.5px]" style={{ color: 'var(--c-muted)' }}>
                        {attributeLabel(attribute.name) || `Атрибут ${index + 1}`}
                      </span>
                      <span className="shrink-0 text-[11px] font-bold" style={{ color: tone }}>
                        {Number(attribute.level) || 0}
                      </span>
                    </div>
                    <div
                      className="mt-1.5 h-[5px] w-full overflow-hidden"
                      style={{ borderRadius: 999, backgroundColor: 'var(--c-raised)' }}
                    >
                      <div
                        style={{
                          width: `${percent}%`,
                          height: '100%',
                          borderRadius: 999,
                          backgroundColor: tone,
                          transition: 'width 420ms ease',
                        }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          <Link
            to="/achievements"
            className="mt-5 flex items-center gap-3 p-3 transition hover:opacity-90"
            style={{ borderRadius: 'var(--radius)', backgroundColor: 'var(--c-raised)' }}
          >
            <span
              className="flex h-14 w-14 shrink-0 items-center justify-center"
              style={{
                borderRadius: 'calc(var(--radius-sm, 12px) * 1.2)',
                backgroundColor: 'var(--c-warning)',
                color: 'var(--c-hero-ink)',
              }}
            >
              <TrophyIcon size={22} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px] font-bold text-ink">
                {closest ? closest.name : 'Все достижения открыты'}
              </span>
              <span className="mt-0.5 block text-[10px]" style={{ color: 'var(--c-muted)' }}>
                {closest ? 'Следующая цель' : 'Коллекция собрана'}
              </span>
            </span>

            <span
              className="inline-flex h-6 shrink-0 items-center px-2 text-[9px] font-semibold"
              style={{
                borderRadius: 'calc(var(--radius-sm, 12px) * 0.8)',
                backgroundColor: 'var(--c-positive)',
                color: 'var(--c-cta-ink)',
              }}
            >
              {unlocked}/{achievements.length}
            </span>
          </Link>
        </section>

        <section className="card card-lg p-5">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Колесо баланса</h2>
            <span className="text-[10px]" style={{ color: 'var(--c-muted)' }}>
              {attributes.length} {plural(attributes.length, 'атрибут', 'атрибута', 'атрибутов')}
            </span>
          </div>

          {attributes.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                icon={BoltIcon}
                title="Нет атрибутов"
                hint="Атрибуты появятся вместе с профилем."
              />
            </div>
          ) : (
            <div className="mt-3 flex justify-center">
              <div className="w-full max-w-[260px]">
                <BalanceRadar attributes={attributes} size={260} />
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

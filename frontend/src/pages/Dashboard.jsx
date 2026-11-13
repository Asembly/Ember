import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import BalanceRadar from '../components/BalanceRadar'
import LevelRing from '../components/LevelRing'
import PomodoroTimer from '../components/PomodoroTimer'
import ProgressBar from '../components/ProgressBar'
import EmptyState from '../components/EmptyState'
import {
  ArrowRightIcon,
  BoltIcon,
  CheckIcon,
  ClockIcon,
  FlameIcon,
  SparkIcon,
  TargetIcon,
  TrophyIcon,
} from '../components/icons'
import { useProfileStore } from '../stores/profileStore'
import { useSessionStore } from '../stores/sessionStore'
import { useTaskStore } from '../stores/taskStore'
import { buildAchievementStats, evaluateAchievements } from '../lib/achievements'
import { difficultyMeta, statusMeta } from '../lib/meta'
import {
  clampPercent,
  formatDuration,
  formatNumber,
  formatXp,
  percentOf,
  plural,
} from '../lib/format'

function StatTile({ icon, label, value, hint, tint }) {
  return (
    <div className="card flex items-center gap-3.5 p-4">
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${tint}1f`, color: tint }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="mt-0.5 text-[19px] font-semibold leading-none text-ink">{value}</p>
        {hint ? <p className="mt-1 line-clamp-1 text-[10.5px] text-muted">{hint}</p> : null}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const profile = useProfileStore((state) => state.profile)
  const attributes = useProfileStore((state) => state.attributes)
  const tasks = useTaskStore((state) => state.tasks)
  const sessions = useSessionStore((state) => state.sessions)

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

  const levelPercent = clampPercent(percentOf(profile?.currentXp, profile?.nextLevelUp))
  const recent = tasks.slice(0, 4)

  return (
    <div className="space-y-5">
      <section className="card p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <LevelRing level={profile?.level ?? 1} percent={levelPercent} size={132} stroke={9} />

          <div className="min-w-0 flex-1">
            <p className="eyebrow">Профиль</p>
            <h1 className="page-title mt-1 truncate">{profile?.nickname ?? 'Профиль'}</h1>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <SparkIcon size={12} style={{ color: 'var(--c-accent)' }} />
                {formatXp(profile?.currentXp)} / {formatXp(profile?.nextLevelUp)} XP
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FlameIcon size={12} style={{ color: 'var(--c-warning)' }} />
                {doneTasks} {plural(doneTasks, 'задача', 'задачи', 'задач')} завершено
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon size={12} style={{ color: 'var(--c-positive)' }} />
                {formatDuration(stats.totalMinutes)} в сессиях
              </span>
            </div>

            <div className="mt-4 max-w-md">
              <ProgressBar value={levelPercent} height="h-1.5" />
              <div className="mt-1.5 flex items-center justify-between text-[10.5px] text-muted">
                <span>Уровень {profile?.level ?? 1}</span>
                <span>
                  Осталось{' '}
                  {formatXp(
                    Math.max(
                      0,
                      Number(profile?.nextLevelUp ?? 0) - Number(profile?.currentXp ?? 0),
                    ),
                  )}{' '}
                  XP
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={<TargetIcon size={18} />}
          label="Активные"
          value={activeTasks}
          hint={plural(activeTasks, 'задача в работе', 'задачи в работе', 'задач в работе')}
          tint="var(--c-accent)"
        />
        <StatTile
          icon={<CheckIcon size={18} />}
          label="Завершено"
          value={doneTasks}
          hint={stats.canceledTasks > 0 ? `${stats.canceledTasks} отменено` : 'Без отмен'}
          tint="var(--c-positive)"
        />
        <StatTile
          icon={<BoltIcon size={18} />}
          label="Время сессий"
          value={formatNumber(stats.totalMinutes, 0)}
          hint={`${plural(sessions.length, 'сессия', 'сессии', 'сессий')} · ${formatDuration(stats.totalMinutes)}`}
          tint="var(--c-warning)"
        />
        <StatTile
          icon={<TrophyIcon size={18} />}
          label="Достижения"
          value={`${unlocked}/${achievements.length}`}
          hint={`${Math.round((unlocked / Math.max(1, achievements.length)) * 100)}% коллекции`}
          tint="var(--c-accent-strong)"
        />
      </section>

      <PomodoroTimer />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Колесо баланса</h2>
            <span className="text-[10.5px] text-muted">
              {attributes.length} {plural(attributes.length, 'атрибут', 'атрибута', 'атрибутов')}
            </span>
          </div>

          {attributes.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={BoltIcon}
                title="Нет атрибутов"
                hint="Атрибуты появятся вместе с профилем."
              />
            </div>
          ) : (
            <div className="mt-3 flex justify-center">
              <div className="w-full max-w-[330px]">
                <BalanceRadar attributes={attributes} />
              </div>
            </div>
          )}
        </section>

        <section className="card flex flex-col p-5">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Последние задачи</h2>
            <Link
              to="/tasks"
              className="inline-flex items-center gap-1 text-[10.5px] font-semibold transition"
              style={{ color: 'var(--c-accent)' }}
            >
              Все задачи
              <ArrowRightIcon size={12} />
            </Link>
          </div>

          {recent.length === 0 ? (
            <div className="mt-4 flex-1">
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
            <ul className="mt-3 space-y-1.5">
              {recent.map((task) => {
                const status = statusMeta(task.status)
                const difficulty = difficultyMeta(task.difficulty)

                return (
                  <li
                    key={task.id}
                    className="flex items-center gap-3 rounded-xl px-2.5 py-2 transition hover:bg-accent-soft"
                  >
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${status.dot}`} />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-[12px] font-medium text-ink">{task.name}</p>
                      <p className="mt-0.5 text-[10px] text-muted">
                        {status.label} · {difficulty.label}
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-[10.5px] font-semibold"
                      style={{ color: 'var(--c-accent)' }}
                    >
                      {formatXp(task.potentialXp)}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

import { useEffect, useMemo, useState } from 'react'
import AchievementCard, { AchievementProgressSummary } from '../components/AchievementCard'
import ProgressBar from '../components/ProgressBar'
import { AlertIcon, ClockIcon, RefreshIcon, SparkIcon, TrophyIcon } from '../components/icons'
import { useAchievementStore } from '../stores/achievementStore'
import { useProfileStore } from '../stores/profileStore'
import { clampPercent, formatDuration, formatXp, percentOf, plural } from '../lib/format'

const FILTERS = [
  { id: 'ALL', label: 'Все' },
  { id: 'UNLOCKED', label: 'Полученные' },
  { id: 'LOCKED', label: 'В процессе' },
]

export default function Achievements() {
  const status = useAchievementStore((state) => state.status)
  const error = useAchievementStore((state) => state.error)
  const items = useAchievementStore((state) => state.items)
  const stats = useAchievementStore((state) => state.stats)
  const unlockedCount = useAchievementStore((state) => state.unlockedCount)
  const total = useAchievementStore((state) => state.total)

  const profile = useProfileStore((state) => state.profile)

  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    useAchievementStore.getState().load()
  }, [])

  const visible = useMemo(() => {
    if (filter === 'UNLOCKED') return items.filter((item) => item.unlocked)
    if (filter === 'LOCKED') return items.filter((item) => !item.unlocked)
    return items
  }, [items, filter])

  const closest = useMemo(() => {
    return (
      items
        .filter((item) => !item.unlocked)
        .sort((first, second) => second.percent - first.percent)[0] || null
    )
  }, [items])

  const levelPercent = clampPercent(percentOf(profile?.currentXp, profile?.nextLevelUp))
  const doneTasks = stats?.doneTasks ?? 0
  const totalMinutes = stats?.totalMinutes ?? 0

  return (
    <div className="space-y-4">
      <section
        className="border-4 p-5"
        style={{
          borderColor: 'var(--c-ink)',
          borderRadius: '1.5rem',
          backgroundColor: 'var(--c-surface)',
          boxShadow: '6px 6px 0 var(--c-ink)',
        }}
      >
        <div className="flex flex-wrap items-start gap-4">
          <div
            className="flex h-14 w-14 shrink-0 -rotate-6 items-center justify-center border-4"
            style={{
              borderColor: 'var(--c-ink)',
              borderRadius: '1rem',
              backgroundColor: 'var(--c-accent)',
              color: 'var(--c-accent-ink)',
              boxShadow: '3px 3px 0 var(--c-ink)',
            }}
          >
            <TrophyIcon size={26} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="page-title">Достижения</h2>
              <AchievementProgressSummary unlocked={unlockedCount} total={total} />
            </div>

            <p className="mt-1 text-[12px] leading-relaxed text-muted">
              Прогресс считается по вашим задачам, сессиям и уровню профиля.
            </p>

            <div className="mt-3">
              <ProgressBar value={total > 0 ? (unlockedCount / total) * 100 : 0} height="h-2.5" />
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted">
              Уровень
            </span>
            <span className="stat-value">{profile?.level ?? 0}</span>
            <span className="text-[10.5px] text-muted">
              {formatXp(profile?.currentXp)} / {profile?.nextLevelUp ? formatXp(profile.nextLevelUp) : '—'}
            </span>
            <div className="w-[132px]">
              <ProgressBar value={levelPercent} height="h-1.5" />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
          {[
            { icon: TrophyIcon, label: 'Получено', value: `${unlockedCount} из ${total}` },
            { icon: SparkIcon, label: 'Задач закрыто', value: doneTasks },
            {
              icon: ClockIcon,
              label: 'Время в сессиях',
              value: totalMinutes > 0 ? formatDuration(totalMinutes) : '—',
            },
          ].map((card) => {
            const Icon = card.icon

            return (
              <div
                key={card.label}
                className="flex items-center gap-2.5 border-2 px-3 py-2"
                style={{
                  borderColor: 'var(--c-ink)',
                  borderRadius: '0.9rem',
                  backgroundColor: 'var(--c-canvas)',
                }}
              >
                <Icon size={15} />
                <div className="min-w-0">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted">
                    {card.label}
                  </p>
                  <p className="truncate text-[13px] font-bold">{card.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {closest ? (
        <section
          className="flex flex-wrap items-center gap-3 border-4 px-4 py-3"
          style={{
            borderColor: 'var(--c-ink)',
            borderRadius: '1.2rem',
            backgroundColor: 'var(--c-accent-soft)',
            boxShadow: '4px 4px 0 var(--c-ink)',
          }}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted">
            Ближайшая цель
          </span>
          <span className="text-[12.5px] font-bold">{closest.name}</span>
          <span className="text-[11.5px] text-muted">
            {closest.current} / {closest.goal} {closest.unit}
          </span>
          <div className="min-w-[110px] flex-1">
            <ProgressBar value={closest.percent} height="h-1.5" />
          </div>
          <span className="text-[11px] font-bold">{closest.percent}%</span>
        </section>
      ) : null}

      <div className="flex flex-wrap items-center gap-1.5">
        {FILTERS.map((item) => {
          const active = filter === item.id

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={active}
              className="border-2 px-3 py-1.5 text-[11px] font-bold transition"
              style={{
                borderColor: 'var(--c-ink)',
                borderRadius: '999px',
                backgroundColor: active ? 'var(--c-accent)' : 'transparent',
                color: active ? 'var(--c-accent-ink)' : 'var(--c-muted)',
                boxShadow: active ? '2px 2px 0 var(--c-ink)' : 'none',
              }}
            >
              {item.label}
            </button>
          )
        })}

        <button
          type="button"
          className="btn btn-ghost btn-sm ml-auto"
          onClick={() => useAchievementStore.getState().refresh()}
          disabled={status === 'loading'}
        >
          <RefreshIcon size={12} />
          {status === 'loading' ? 'Обновляем…' : 'Обновить'}
        </button>
      </div>

      {error ? (
        <div
          className="flex items-start gap-2 border-2 px-3 py-2 text-[11.5px] font-semibold"
          style={{
            borderColor: 'var(--c-ink)',
            borderRadius: '0.9rem',
            backgroundColor: 'var(--c-accent-soft)',
            color: 'var(--c-negative)',
          }}
          role="alert"
        >
          <AlertIcon size={14} className="mt-0.5 shrink-0" />
          {error}
        </div>
      ) : null}

      {status === 'loading' && items.length === 0 ? (
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-[132px] animate-pulse border-2"
              style={{
                borderColor: 'var(--c-line)',
                borderRadius: '1rem',
                backgroundColor: 'var(--c-surface)',
              }}
            />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <div
          className="border-4 px-5 py-8 text-center"
          style={{
            borderColor: 'var(--c-ink)',
            borderRadius: '1.5rem',
            backgroundColor: 'var(--c-surface)',
            boxShadow: '6px 6px 0 var(--c-ink)',
          }}
        >
          <p className="text-[13px] font-bold">
            {filter === 'UNLOCKED' ? 'Пока ничего не получено' : 'Всё уже открыто'}
          </p>
          <p className="mt-1 text-[11.5px] text-muted">
            {filter === 'UNLOCKED'
              ? 'Закройте первую задачу, чтобы получить достижение.'
              : `Открыто ${unlockedCount} ${plural(unlockedCount, 'достижение', 'достижения', 'достижений')}.`}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {visible.map((achievement) => (
            <AchievementCard key={achievement.code} achievement={achievement} />
          ))}
        </div>
      )}
    </div>
  )
}

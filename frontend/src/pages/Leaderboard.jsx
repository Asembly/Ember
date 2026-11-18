import { useEffect, useMemo } from 'react'
import EmptyState from '../components/EmptyState'
import Skeleton from '../components/Skeleton'
import { AlertIcon, CrownIcon, RefreshIcon } from '../components/icons'
import { useLeaderboardStore } from '../stores/leaderboardStore'
import { formatXp, plural } from '../lib/format'

function initialOf(nickname) {
  return String(nickname || '').trim().charAt(0).toUpperCase() || '?'
}

function rankStyle(rank) {
  if (rank === 1) {
    return { backgroundColor: 'var(--c-cta)', color: 'var(--c-cta-ink)' }
  }

  if (rank <= 3) {
    return { backgroundColor: 'var(--c-accent-soft)', color: 'var(--c-accent)' }
  }

  return { backgroundColor: 'var(--c-sunken)', color: 'var(--c-muted)' }
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Загружаем рейтинг">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="card flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-8 w-8 shrink-0" rounded="radius-theme-sm" />
          <Skeleton className="h-10 w-10 shrink-0" rounded="radius-theme-sm" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3 w-32" rounded="radius-theme-sm" />
            <Skeleton className="h-1.5 w-40" rounded="radius-theme-sm" />
          </div>
          <Skeleton className="h-4 w-14 shrink-0" rounded="radius-theme-sm" />
        </div>
      ))}
    </div>
  )
}

export default function Leaderboard() {
  const users = useLeaderboardStore((state) => state.users)
  const hasMore = useLeaderboardStore((state) => state.hasMore)
  const isLoading = useLeaderboardStore((state) => state.isLoading)
  const error = useLeaderboardStore((state) => state.error)
  const fetchLeaderboard = useLeaderboardStore((state) => state.fetchLeaderboard)

  useEffect(() => {
    fetchLeaderboard(true)
  }, [fetchLeaderboard])

  const initialLoading = isLoading && users.length === 0
  const topXp = useMemo(
    () => Math.max(1, ...users.map((user) => Number(user.currentXp) || 0)),
    [users],
  )

  return (
    <div className="space-y-4">
      <section className="card card-lg flex flex-wrap items-center gap-4 p-5">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center"
          style={{
            borderRadius: 'calc(var(--radius-sm, 12px) * 1.05)',
            backgroundColor: 'var(--c-accent)',
            color: 'var(--c-accent-ink)',
          }}
        >
          <CrownIcon size={22} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="page-title">Топ игроков</h2>
            {users.length > 0 ? (
              <span className="chip chip-accent h-5 px-2 text-[9.5px] font-semibold">
                {users.length} {plural(users.length, 'участник', 'участника', 'участников')}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
            Участники отсортированы по уровню и опыту — сверху самые продвинутые.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => fetchLeaderboard(true)}
          disabled={isLoading}
        >
          <RefreshIcon size={12} className={isLoading ? 'animate-spin' : ''} />
          Обновить
        </button>
      </section>

      {initialLoading ? (
        <LeaderboardSkeleton />
      ) : users.length === 0 ? (
        error ? (
          <EmptyState
            icon={AlertIcon}
            title="Не удалось загрузить рейтинг"
            hint={error}
            action={
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fetchLeaderboard(true)}
                disabled={isLoading}
              >
                <RefreshIcon size={12} className={isLoading ? 'animate-spin' : ''} />
                Повторить
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={CrownIcon}
            title="Рейтинг пока пуст"
            hint="Как только появятся первые профили, они займут свои места в списке."
          />
        )
      ) : (
        <div className="space-y-2">
          {error ? (
            <div
              className="flex flex-wrap items-center gap-2 px-4 py-2.5 text-[11.5px]"
              style={{
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'color-mix(in srgb, var(--c-negative) 12%, transparent)',
                color: 'var(--c-negative)',
              }}
              role="alert"
            >
              <AlertIcon size={13} className="shrink-0" />
              <span className="min-w-0 flex-1">{error}</span>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => fetchLeaderboard(false)}
                disabled={isLoading}
              >
                Повторить
              </button>
            </div>
          ) : null}

          <ol className="space-y-2" aria-label="Рейтинг участников">
            {users.map((user, index) => {
              const rank = index + 1
              const share = Math.min(100, ((Number(user.currentXp) || 0) / topXp) * 100)
              const isTop = rank <= 3

              return (
                <li key={user.id ?? `rank-${rank}`}>
                  <article
                    className="card card-hover flex items-center gap-3 px-3.5 py-3"
                    style={{
                      borderColor: isTop
                        ? `color-mix(in srgb, var(--c-accent) ${rank === 1 ? 30 : 18}%, transparent)`
                        : 'transparent',
                      backgroundColor:
                        rank === 1
                          ? 'color-mix(in srgb, var(--c-surface) 94%, var(--c-accent))'
                          : 'var(--c-surface)',
                    }}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center text-[11.5px] font-bold"
                      style={{
                        borderRadius: 'calc(var(--radius-sm, 12px) * 0.75)',
                        ...rankStyle(rank),
                      }}
                      aria-label={`Место ${rank}`}
                    >
                      {rank}
                    </span>

                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center text-[13px] font-bold"
                      style={{
                        borderRadius: 'calc(var(--radius-sm, 12px) * 0.9)',
                        backgroundColor:
                          rank === 1 ? 'var(--c-accent)' : 'color-mix(in srgb, var(--c-ink) 7%, transparent)',
                        color: rank === 1 ? 'var(--c-accent-ink)' : 'var(--c-ink)',
                      }}
                      aria-hidden="true"
                    >
                      {initialOf(user.nickname)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-[12.5px] font-semibold text-ink">
                          {user.nickname}
                        </p>
                        <span className="chip h-5 px-2 text-[9px] font-semibold">
                          {user.level} {plural(user.level, 'уровень', 'уровня', 'уровней')}
                        </span>
                      </div>

                      <div
                        className="mt-1.5 h-[4px] w-full max-w-[220px] overflow-hidden"
                        style={{ borderRadius: 999, backgroundColor: 'var(--c-raised)' }}
                        aria-hidden="true"
                      >
                        <div
                          style={{
                            width: `${share}%`,
                            height: '100%',
                            borderRadius: 999,
                            backgroundColor: rank === 1 ? 'var(--c-cta)' : 'var(--c-accent)',
                          }}
                        />
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[12.5px] font-bold" style={{ color: 'var(--c-positive)' }}>
                        {formatXp(user.currentXp)}
                      </p>
                      <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-muted">
                        XP
                      </p>
                    </div>
                  </article>
                </li>
              )
            })}
          </ol>

          <div className="flex flex-col items-center gap-2 pt-1">
            {hasMore ? (
              <button
                type="button"
                className="btn btn-secondary w-full sm:w-auto"
                onClick={() => fetchLeaderboard(false)}
                disabled={isLoading}
              >
                <RefreshIcon size={13} className={isLoading ? 'animate-spin' : ''} />
                {isLoading ? 'Загружаем…' : 'Загрузить еще'}
              </button>
            ) : (
              <p className="text-[10.5px] text-muted">Это все участники рейтинга.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

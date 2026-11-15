import { useEffect } from 'react'
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
    return { backgroundColor: 'var(--c-accent)', color: 'var(--c-accent-ink)' }
  }

  if (rank <= 3) {
    return { backgroundColor: 'var(--c-accent-soft)', color: 'var(--c-accent)' }
  }

  return { backgroundColor: 'var(--c-raised)', color: 'var(--c-muted)' }
}

function cardStyle(rank) {
  if (rank > 3) return undefined

  return {
    borderColor: `color-mix(in srgb, var(--c-accent) ${rank === 1 ? 38 : 22}%, var(--c-line))`,
    backgroundColor: `color-mix(in srgb, var(--c-surface) ${rank === 1 ? 94 : 97}%, var(--c-accent))`,
  }
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-2.5" aria-busy="true" aria-label="Загружаем рейтинг">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="card flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-7 w-7 shrink-0" rounded="rounded-lg" />
          <Skeleton className="h-9 w-9 shrink-0" rounded="rounded-lg" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Skeleton className="h-3 w-32" rounded="rounded-md" />
            <Skeleton className="h-2.5 w-20" rounded="rounded-md" />
          </div>
          <Skeleton className="h-3 w-14 shrink-0" rounded="rounded-md" />
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

  return (
    <div className="space-y-4">
      <section className="card flex flex-wrap items-center gap-3.5 px-4 py-3.5 sm:px-5">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: 'var(--c-accent-soft)', color: 'var(--c-accent)' }}
        >
          <CrownIcon size={18} />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="section-title">Топ игроков</h2>
            {users.length > 0 ? (
              <span className="chip">
                {users.length} {plural(users.length, 'участник', 'участника', 'участников')}
              </span>
            ) : null}
          </div>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-muted">
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
        <div className="space-y-2.5">
          {error ? (
            <div
              className="card flex flex-wrap items-center gap-2 px-4 py-2.5 text-[11.5px]"
              style={{
                borderColor: 'color-mix(in srgb, var(--c-negative) 30%, var(--c-line))',
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

          <ol className="space-y-2.5" aria-label="Рейтинг участников">
            {users.map((user, index) => {
              const rank = index + 1

              return (
                <li key={user.id ?? `rank-${rank}`}>
                  <article
                    className="card card-hover flex items-center gap-3 px-4 py-3"
                    style={cardStyle(rank)}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11.5px] font-semibold"
                      style={rankStyle(rank)}
                      aria-label={`Место ${rank}`}
                    >
                      {rank}
                    </span>

                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[13px] font-semibold"
                      style={
                        rank === 1
                          ? { backgroundColor: 'var(--c-accent)', color: 'var(--c-accent-ink)' }
                          : { backgroundColor: 'var(--c-accent-soft)', color: 'var(--c-accent)' }
                      }
                      aria-hidden="true"
                    >
                      {initialOf(user.nickname)}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-semibold text-ink">
                        {user.nickname}
                      </p>
                      <p className="mt-0.5 text-[10.5px] text-muted">
                        {user.level} {plural(user.level, 'уровень', 'уровня', 'уровней')}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="mono-time text-[12.5px] font-semibold text-ink">
                        {formatXp(user.currentXp)}
                      </p>
                      <p className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted">
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

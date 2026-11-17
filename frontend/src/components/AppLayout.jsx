import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import ThemeSwitcher from './ThemeSwitcher'
import Toasts from './Toasts'
import {
  AlertIcon,
  ArrowRightIcon,
  CrownIcon,
  DashboardIcon,
  HistoryIcon,
  RefreshIcon,
  SparkIcon,
  TasksIcon,
  TrophyIcon,
} from './icons'
import { useAuthStore } from '../stores/authStore'
import { useProfileStore } from '../stores/profileStore'
import { useSessionStore } from '../stores/sessionStore'
import { useTaskStore } from '../stores/taskStore'
import { formatXp, percentOf, plural } from '../lib/format'

const NAV_ITEMS = [
  { to: '/', label: 'Обзор', icon: DashboardIcon, end: true },
  { to: '/tasks', label: 'Задачи', icon: TasksIcon },
  { to: '/achievements', label: 'Достижения', icon: TrophyIcon },
  { to: '/leaderboard', label: 'Лидерборд', icon: CrownIcon },
  { to: '/history', label: 'История', icon: HistoryIcon },
]

const PAGE_META = {
  '/': { eyebrow: 'Панель', title: 'Обзор' },
  '/tasks': { eyebrow: 'Работа', title: 'Задачи' },
  '/achievements': { eyebrow: 'Прогресс', title: 'Достижения' },
  '/leaderboard': { eyebrow: 'Рейтинг', title: 'Лидерборд' },
  '/history': { eyebrow: 'Активность', title: 'История' },
}

function capitalize(value) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function LogoutButton({ variant = 'sidebar' }) {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  if (variant === 'sidebar') {
    return (
      <button
        type="button"
        className="btn btn-ghost btn-sm w-full justify-between"
        onClick={handleLogout}
      >
        Выйти
        <ArrowRightIcon size={12} className="rotate-180" />
      </button>
    )
  }

  return (
    <button
      type="button"
      className="btn btn-ghost btn-icon"
      onClick={handleLogout}
      aria-label="Выйти"
    >
      <ArrowRightIcon size={14} className="rotate-180" />
    </button>
  )
}

function BootScreen() {
  return (
    <div
      className="flex h-full items-center justify-center px-6"
      style={{ backgroundColor: 'var(--c-canvas)' }}
    >
      <div className="w-full max-w-sm text-center">
        <div
          className="mx-auto flex h-12 w-12 animate-pulse items-center justify-center"
          style={{
            borderRadius: 'var(--radius, 8px)',
            backgroundColor: 'var(--c-accent)',
            color: 'var(--c-accent-ink)',
          }}
        >
          <SparkIcon size={22} />
        </div>
        <p className="mt-5 text-[12.5px] font-medium text-ink">Загружаем профиль…</p>
        <p className="mt-1.5 text-[11.5px] text-muted">Подключаемся к серверу Talis.</p>
      </div>
    </div>
  )
}

export default function AppLayout() {
  const location = useLocation()

  const status = useProfileStore((state) => state.status)
  const error = useProfileStore((state) => state.error)
  const profile = useProfileStore((state) => state.profile)
  const profileId = useProfileStore((state) => state.profileId)
  const init = useProfileStore((state) => state.init)

  const tasks = useTaskStore((state) => state.tasks)
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    if (status !== 'ready' || profileId == null) return
    useTaskStore.getState().fetchAll(profileId)
    useSessionStore.getState().fetchSessions()
    useSessionStore.getState().fetchActiveSession(profileId)
  }, [status, profileId])

  if (status === 'idle' || status === 'loading') {
    return <BootScreen />
  }

  if (status === 'empty') {
    return (
      <div
        className="flex h-full items-center justify-center px-6"
        style={{ backgroundColor: 'var(--c-canvas)' }}
      >
        <div className="card w-full max-w-sm px-7 py-8 text-center">
          <div
            className="mx-auto flex h-11 w-11 items-center justify-center"
            style={{
              borderRadius: 'var(--radius, 8px)',
              backgroundColor: 'var(--c-accent-soft)',
              color: 'var(--c-accent)',
            }}
          >
            <AlertIcon size={19} />
          </div>
          <h1 className="mt-4 text-[14px] font-semibold text-ink">Профиль не найден</h1>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">
            Для аккаунта {user?.email || 'пользователя'} профиль ещё не создан на сервере.
          </p>
          <div className="mt-6 space-y-2">
            <button type="button" className="btn btn-primary w-full" onClick={() => init()}>
              <RefreshIcon size={13} />
              Повторить
            </button>
            <LogoutButton />
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error' || !profile) {
    return (
      <div
        className="flex h-full items-center justify-center px-6"
        style={{ backgroundColor: 'var(--c-canvas)' }}
      >
        <div className="card w-full max-w-sm px-7 py-8 text-center">
          <div
            className="mx-auto flex h-11 w-11 items-center justify-center"
            style={{
              borderRadius: 'var(--radius, 8px)',
              backgroundColor: 'color-mix(in srgb, var(--c-negative) 14%, transparent)',
              color: 'var(--c-negative)',
            }}
          >
            <AlertIcon size={19} />
          </div>
          <h1 className="mt-4 text-[14px] font-semibold text-ink">
            Не удалось загрузить профиль
          </h1>
          <p className="mt-2 break-words text-[12px] leading-relaxed text-muted">
            {error || 'Сервер не ответил на запрос.'}
          </p>
          <div className="mt-6 space-y-2">
            <button type="button" className="btn btn-primary w-full" onClick={() => init()}>
              <RefreshIcon size={13} />
              Повторить
            </button>
            <LogoutButton />
          </div>
        </div>
      </div>
    )
  }

  const meta = PAGE_META[location.pathname] || PAGE_META['/']
  const today = capitalize(
    new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }).format(
      new Date(),
    ),
  )

  const nickname = profile.nickname || user?.nickname || 'Профиль'
  const level = Number(profile.level) || 1
  const currentXp = Number(profile.currentXp) || 0
  const nextLevelUp = Number(profile.nextLevelUp) || 0
  const percent = percentOf(currentXp, nextLevelUp)
  const initial = nickname.trim().charAt(0).toUpperCase() || 'T'
  const activeCount = tasks.filter(
    (task) => task.status === 'OPEN' || task.status === 'IN_PROGRESS',
  ).length

  return (
    <div className="flex h-full" style={{ backgroundColor: 'var(--c-canvas)' }}>
      <aside
        className="flex w-[248px] shrink-0 flex-col border-r px-3.5 py-5"
        style={{
          borderColor: 'var(--c-line)',
          borderWidth: 'var(--border-width, 1px)',
          backgroundColor: 'var(--c-sidebar)',
        }}
      >
        <div className="flex items-center gap-2.5 px-1.5">
          <span
            className="flex h-8 w-8 items-center justify-center"
            style={{
              borderRadius: 'var(--radius, 8px)',
              backgroundColor: 'var(--c-accent)',
              color: 'var(--c-accent-ink)',
            }}
          >
            <SparkIcon size={16} />
          </span>
          <div className="leading-tight">
            <p className="display text-[16px] font-semibold tracking-tight text-ink">Talis</p>
            <p className="mt-0.5 text-[9.5px] font-medium uppercase tracking-[0.16em] text-muted">
              {new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short' }).format(
                new Date(),
              )}
            </p>
          </div>
        </div>

        <p className="mt-6 px-2.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted">
          Навигация
        </p>

        <nav className="mt-2 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon

            return (
              <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
                <Icon size={15} />
                <span className="flex-1">{item.label}</span>
                {item.to === '/tasks' && activeCount > 0 ? (
                  <span
                    className="px-1.5 py-0.5 text-[10px] font-semibold"
                    style={{
                      borderRadius: 'var(--radius, 8px)',
                      backgroundColor: 'var(--c-accent-soft)',
                      color: 'var(--c-accent)',
                    }}
                  >
                    {activeCount}
                  </span>
                ) : null}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="card p-3.5">
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-8 w-8 items-center justify-center text-[12px] font-semibold"
                style={{
                  borderRadius: 'var(--radius, 8px)',
                  backgroundColor: 'var(--c-accent-soft)',
                  color: 'var(--c-accent)',
                }}
              >
                {initial}
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[12px] font-semibold text-ink">{nickname}</p>
                <p className="mt-0.5 text-[10px] text-muted">
                  {level} {plural(level, 'уровень', 'уровня', 'уровней')}
                </p>
              </div>
            </div>

            <div
              className="mt-3 h-1.5 overflow-hidden rounded-full"
              style={{ backgroundColor: 'var(--c-line)' }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${percent}%`, backgroundColor: 'var(--c-accent)' }}
              />
            </div>
            <p className="mt-1.5 text-[10px] text-muted">
              {formatXp(currentXp)} / {formatXp(nextLevelUp) || '—'} XP
            </p>
          </div>

          <LogoutButton />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="flex h-[60px] shrink-0 items-center gap-4 border-b px-6"
          style={{
            borderColor: 'var(--c-line)',
            borderWidth: 'var(--border-width, 1px)',
            backgroundColor: 'var(--c-surface)',
          }}
        >
          <div className="min-w-0">
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted">
              {meta.eyebrow}
            </p>
            <h1 className="display truncate text-[16px] font-semibold leading-tight text-ink">
              {meta.title}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-[11px] text-muted sm:inline">{today}</span>
            <ThemeSwitcher />
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          <Outlet />
        </main>
      </div>

      <Toasts />
    </div>
  )
}

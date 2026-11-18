import { useEffect } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import ThemeSwitcher from './ThemeSwitcher'
import Toasts from './Toasts'
import ProgressBar from './ProgressBar'
import {
  AlertIcon,
  ArrowRightIcon,
  CrownIcon,
  DashboardIcon,
  FlameIcon,
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
        className="btn btn-ghost btn-sm w-full justify-between px-2"
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
      title="Выйти"
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
          className="mx-auto flex h-14 w-14 animate-pulse items-center justify-center"
          style={{
            borderRadius: 'var(--radius, 16px)',
            backgroundColor: 'var(--c-accent)',
            color: 'var(--c-accent-ink)',
          }}
        >
          <SparkIcon size={24} />
        </div>
        <p className="display mt-5 text-[15px] font-semibold text-ink">Загружаем профиль…</p>
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
            className="mx-auto flex h-12 w-12 items-center justify-center"
            style={{
              borderRadius: 'var(--radius-sm, 12px)',
              backgroundColor: 'var(--c-accent-soft)',
              color: 'var(--c-accent)',
            }}
          >
            <AlertIcon size={20} />
          </div>
          <h1 className="display mt-4 text-[15px] font-semibold text-ink">Профиль не найден</h1>
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
            className="mx-auto flex h-12 w-12 items-center justify-center"
            style={{
              borderRadius: 'var(--radius-sm, 12px)',
              backgroundColor: 'color-mix(in srgb, var(--c-negative) 16%, transparent)',
              color: 'var(--c-negative)',
            }}
          >
            <AlertIcon size={20} />
          </div>
          <h1 className="display mt-4 text-[15px] font-semibold text-ink">
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
        className="hidden w-64 shrink-0 flex-col overflow-y-auto px-3 py-5 lg:flex"
        style={{ backgroundColor: 'var(--c-sidebar)' }}
      >
        <div className="flex items-start justify-between px-2">
          <div>
            <p
              className="display text-[34px] font-extrabold leading-none tracking-tight"
              style={{ color: 'var(--c-ink)' }}
            >
              talis
            </p>
            <p
              className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em]"
              style={{ color: 'var(--c-accent)' }}
            >
              Расти в своём ритме
            </p>
          </div>

          <span
            className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center"
            style={{
              borderRadius: 'calc(var(--radius-sm, 12px) * 0.9)',
              backgroundColor: 'color-mix(in srgb, var(--c-accent) 18%, transparent)',
              color: 'var(--c-accent)',
            }}
            aria-hidden="true"
          >
            <FlameIcon size={17} />
          </span>
        </div>

        <p className="eyebrow mt-7 px-2 font-semibold">Твоё пространство</p>

        <nav className="mt-2 flex flex-col gap-1" aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon

            return (
              <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
                <Icon size={18} />
                <span className="flex-1">{item.label}</span>
                {item.to === '/tasks' && activeCount > 0 ? (
                  <span className="nav-badge">{activeCount}</span>
                ) : null}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-auto pt-8">
          <div
            className="px-4 py-4"
            style={{
              borderRadius: 'var(--radius-lg, 24px)',
              backgroundColor: 'color-mix(in srgb, var(--c-accent) 16%, var(--c-canvas))',
            }}
          >
            <span
              className="inline-flex h-6 items-center px-2.5 text-[9px] font-semibold uppercase tracking-[0.1em]"
              style={{
                borderRadius: 'calc(var(--radius-sm, 12px) * 0.8)',
                backgroundColor: 'var(--c-positive)',
                color: 'var(--c-cta-ink)',
              }}
            >
              Твой темп — ок
            </span>
            <p className="mt-3 text-[13px] font-bold leading-5 text-ink">Маленькие шаги.</p>
            <p className="text-[13px] font-bold leading-5 text-ink">Большой прогресс.</p>
            <p className="mt-2.5 text-[11px] leading-relaxed" style={{ color: 'var(--c-muted)' }}>
              Каждая задача даёт XP. {activeCount > 0 ? `Сейчас в работе: ${activeCount}.` : ''}
            </p>
          </div>

          <div className="mt-4">
            <ThemeSwitcher />
          </div>

          <div
            className="mt-3 p-3.5"
            style={{ borderRadius: 'var(--radius)', backgroundColor: 'var(--c-raised)' }}
          >
            <div className="flex items-center gap-2.5">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center text-[13px] font-bold"
                style={{
                  borderRadius: 'calc(var(--radius-sm, 12px) * 0.8)',
                  backgroundColor: 'var(--c-accent-soft)',
                  color: 'var(--c-accent)',
                }}
              >
                {initial}
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-[12px] font-semibold text-ink">{nickname}</p>
                <p className="mt-0.5 text-[10px] text-muted">
                  {level} {plural(level, 'уровень', 'уровня', 'уровней')}
                </p>
              </div>
              <LogoutButton variant="icon" />
            </div>

            <div className="mt-3">
              <ProgressBar value={percent} height="h-1.5" tone="positive" />
            </div>
            <p className="mt-1.5 text-[10px] text-muted">
              {formatXp(currentXp)} / {formatXp(nextLevelUp) || '—'} XP
            </p>
          </div>

          <div className="mt-4 px-2">
            <div className="surface-divider" />
            <p className="mt-3 text-[10px] leading-relaxed text-muted">Твоё пространство роста</p>
            <p className="mt-0.5 text-[11px] font-semibold" style={{ color: 'var(--c-accent)' }}>
              Не спринт. Приключение.
            </p>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header
          className="flex h-16 shrink-0 items-center gap-3 px-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: 'var(--c-canvas)', borderBottom: '1px solid var(--c-line)' }}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="hidden text-[12px] text-muted md:inline">Моё пространство</span>
            <span className="hidden text-[12px] text-muted md:inline" aria-hidden="true">
              /
            </span>
            <h1 className="display truncate text-[13.5px] font-semibold leading-tight text-ink">
              {meta.title}
            </h1>
          </div>

          <span className="chip ml-1 hidden h-6 items-center px-2.5 text-[9px] font-semibold uppercase tracking-[0.1em] sm:inline-flex">
            {today}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <span
              className="inline-flex h-7 items-center px-3 text-[10px] font-semibold uppercase tracking-[0.06em]"
              style={{
                borderRadius: 'calc(var(--radius-sm, 12px) * 0.85)',
                backgroundColor: 'var(--c-cta)',
                color: 'var(--c-cta-ink)',
              }}
              title={`Уровень ${level}`}
            >
              {level} ур.
            </span>

            <div className="lg:hidden">
              <ThemeSwitcher compact />
            </div>

            <div className="lg:hidden">
              <LogoutButton variant="icon" />
            </div>
          </div>
        </header>

        <nav
          className="flex shrink-0 items-center gap-1 overflow-x-auto px-3 py-2 lg:hidden"
          style={{ backgroundColor: 'var(--c-sidebar)' }}
          aria-label="Основная навигация"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className="nav-link shrink-0 !h-9 !px-3 text-[12px]"
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto w-full max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>

      <Toasts />
    </div>
  )
}

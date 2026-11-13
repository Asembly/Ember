import { useMemo, useState } from 'react'
import EmptyState from '../components/EmptyState'
import {
  ArrowRightIcon,
  CalendarIcon,
  ClockIcon,
  HistoryIcon,
  TimerIcon,
} from '../components/icons'
import { useSessionStore } from '../stores/sessionStore'
import {
  formatClock,
  formatDayLabel,
  formatDuration,
  formatTime,
  isToday,
  parseServerDate,
  plural,
  startOfDay,
} from '../lib/format'

const RANGES = [
  { id: 'ALL', label: 'Всё время', days: null },
  { id: '7', label: '7 дней', days: 7 },
  { id: '30', label: '30 дней', days: 30 },
]

function sessionStart(session) {
  return session.createdAt ? parseServerDate(session.createdAt) : null
}

export default function History() {
  const sessions = useSessionStore((state) => state.sessions)
  const busy = useSessionStore((state) => state.status === 'loading')

  const [range, setRange] = useState('ALL')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const filtered = useMemo(() => {
    const now = Date.now()
    const rangeDays = RANGES.find((item) => item.id === range)?.days ?? null
    const minTime = rangeDays ? now - rangeDays * 24 * 60 * 60 * 1000 : null
    const minMs = from ? startOfDay(new Date(`${from}T00:00:00`)).getTime() : null
    const maxMs = to ? startOfDay(new Date(`${to}T00:00:00`)).getTime() + 24 * 60 * 60 * 1000 : null

    return sessions.filter((session) => {
      const start = sessionStart(session)
      if (!start || Number.isNaN(start.getTime())) return false
      const time = start.getTime()
      if (minTime != null && time < minTime) return false
      if (minMs != null && time < minMs) return false
      if (maxMs != null && time >= maxMs) return false
      return true
    })
  }, [sessions, range, from, to])

  const groups = useMemo(() => {
    const map = new Map()

    filtered.forEach((session) => {
      const start = sessionStart(session)
      const key = start ? `${start.getFullYear()}-${start.getMonth()}-${start.getDate()}` : 'unknown'
      if (!map.has(key)) {
        map.set(key, { key, date: start, items: [] })
      }
      map.get(key).items.push(session)
    })

    return Array.from(map.values()).sort((a, b) => {
      const aTime = a.date ? a.date.getTime() : 0
      const bTime = b.date ? b.date.getTime() : 0
      return bTime - aTime
    })
  }, [filtered])

  const totalMinutes = filtered.reduce(
    (sum, session) => sum + (Number(session.durationInMin) || 0),
    0,
  )
  const todayMinutes = filtered
    .filter((session) => isToday(sessionStart(session)))
    .reduce((sum, session) => sum + (Number(session.durationInMin) || 0), 0)
  const average = filtered.length > 0 ? totalMinutes / filtered.length : 0
  const filtersActive = range !== 'ALL' || Boolean(from) || Boolean(to)

  return (
    <div className="space-y-4">
      <section className="card p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-wrap items-end gap-6">
            <div>
              <p className="eyebrow">Всего в сессиях</p>
              <p className="stat-value mt-1 text-ink">{formatDuration(totalMinutes)}</p>
            </div>
            <div>
              <p className="eyebrow">Сессий</p>
              <p className="stat-value mt-1 text-ink">{filtered.length}</p>
            </div>
            <div>
              <p className="eyebrow">Средняя</p>
              <p className="stat-value mt-1 text-ink">{formatDuration(average)}</p>
            </div>
            <div>
              <p className="eyebrow">Сегодня</p>
              <p className="stat-value mt-1" style={{ color: 'var(--c-accent)' }}>
                {formatDuration(todayMinutes)}
              </p>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <div className="w-[132px]">
              <label className="label" htmlFor="history-from">
                С даты
              </label>
              <input
                id="history-from"
                type="date"
                value={from}
                onChange={(event) => setFrom(event.target.value)}
                className="input w-full text-[11.5px]"
              />
            </div>
            <div className="w-[132px]">
              <label className="label" htmlFor="history-to">
                По дату
              </label>
              <input
                id="history-to"
                type="date"
                value={to}
                onChange={(event) => setTo(event.target.value)}
                className="input w-full text-[11.5px]"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line pt-3.5">
          {RANGES.map((item) => {
            const active = range === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setRange(item.id)}
                aria-pressed={active}
                className="rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition"
                style={{
                  borderColor: active ? 'transparent' : 'var(--c-line)',
                  backgroundColor: active ? 'var(--c-accent)' : 'transparent',
                  color: active ? 'var(--c-accent-ink)' : 'var(--c-muted)',
                }}
              >
                {item.label}
              </button>
            )
          })}

          {filtersActive ? (
            <button
              type="button"
              className="ml-auto inline-flex items-center gap-1.5 text-[10.5px] font-semibold"
              style={{ color: 'var(--c-accent)' }}
              onClick={() => {
                setRange('ALL')
                setFrom('')
                setTo('')
              }}
            >
              Сбросить фильтры
              <ArrowRightIcon size={11} />
            </button>
          ) : null}
        </div>
      </section>

      {groups.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title={busy ? 'Загружаем сессии' : 'Сессий пока нет'}
          hint={
            filtersActive
              ? 'Для выбранного периода записей не найдено.'
              : 'Запустите таймер на любой задаче — сессия появится здесь.'
          }
        />
      ) : (
        <div className="space-y-3">
          {groups.map((group) => {
            const dayMinutes = group.items.reduce(
              (sum, session) => sum + (Number(session.durationInMin) || 0),
              0,
            )

            return (
              <section key={group.key} className="card overflow-hidden">
                <header
                  className="flex items-center justify-between gap-3 border-b border-line px-5 py-3"
                  style={{ backgroundColor: 'var(--c-raised)' }}
                >
                  <div className="flex items-center gap-2.5">
                    <CalendarIcon size={13} style={{ color: 'var(--c-accent)' }} />
                    <h2 className="text-[12.5px] font-semibold text-ink">
                      {group.date ? formatDayLabel(group.date) : 'Без даты'}
                    </h2>
                    {group.date && isToday(group.date) ? (
                      <span
                        className="rounded-full px-2 py-[2px] text-[9.5px] font-semibold uppercase tracking-[0.12em]"
                        style={{ backgroundColor: 'var(--c-accent-soft)', color: 'var(--c-accent)' }}
                      >
                        Сегодня
                      </span>
                    ) : null}
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-[10.5px] text-muted">
                    <span>
                      {group.items.length} {plural(group.items.length, 'сессия', 'сессии', 'сессий')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-ink">{formatDuration(dayMinutes)}</span>
                  </span>
                </header>

                <ul>
                  {group.items.map((session) => {
                    const start = sessionStart(session)
                    const end = session.endTime ? parseServerDate(session.endTime) : null
                    const minutes = Number(session.durationInMin) || 0

                    return (
                      <li
                        key={session.id}
                        className="flex items-center gap-3 border-b border-line px-5 py-3 last:border-b-0"
                      >
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: 'var(--c-accent-soft)', color: 'var(--c-accent)' }}
                        >
                          <TimerIcon size={14} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-medium text-ink">
                            {start ? formatTime(start) : '—'}
                            {end ? ` — ${formatTime(end)}` : ''}
                          </p>
                          <p className="mt-0.5 text-[10.5px] text-muted">
                            {minutes > 0
                              ? formatClock(minutes * 60 * 1000)
                              : 'Менее минуты'}{' '}
                            · сессия #{session.id}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-[12px] font-semibold text-ink">
                            {minutes} {plural(minutes, 'минута', 'минуты', 'минут')}
                          </p>
                          <p className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-muted">
                            <ClockIcon size={9} />
                            зачтено
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

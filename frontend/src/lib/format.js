const MONTHS_GENITIVE = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

const pad = (value) => String(value).padStart(2, '0')

export function parseServerDate(value) {
  if (!value) return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value
  }
  const raw = String(value).trim()
  if (!raw) return null
  const withT = raw.includes('T') ? raw : raw.replace(' ', 'T')
  const safe = withT.replace(/(\.\d{3})\d+$/, '$1')
  const date = new Date(safe)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDate(value) {
  const date = parseServerDate(value)
  if (!date) return '—'
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`
}

export function formatTime(value) {
  const date = parseServerDate(value)
  if (!date) return '—'
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function formatDateTime(value, fallback = '—') {
  const date = parseServerDate(value)
  if (!date) return fallback
  return `${formatDate(date)}, ${formatTime(date)}`
}

export function formatDayLabel(value) {
  const date = parseServerDate(value)
  if (!date) return '—'
  return `${date.getDate()} ${MONTHS_GENITIVE[date.getMonth()]} ${date.getFullYear()}`
}

export function formatDuration(totalMinutes) {
  const minutes = Math.max(0, Math.round(Number(totalMinutes) || 0))
  if (minutes < 60) return `${minutes} мин`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest > 0 ? `${hours} ч ${rest} мин` : `${hours} ч`
}

export function formatClock(ms) {
  const totalSeconds = Math.max(0, Math.floor((Number(ms) || 0) / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${pad(minutes)}:${pad(seconds)}`
}

export function formatNumber(value, maximumFractionDigits = 1) {
  const number = Number(value)
  if (!Number.isFinite(number)) return '0'
  return number.toLocaleString('ru-RU', { maximumFractionDigits })
}

export function formatXp(value) {
  return formatNumber(value, 1)
}

export function toLocalInputValue(value) {
  const date = parseServerDate(value)
  if (!date) return ''
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`
}

export function fromLocalInput(value) {
  if (!value) return null
  return value.length === 16 ? `${value}:00` : value
}

export function clampPercent(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.min(100, Math.max(0, number))
}

export function percentOf(value, total) {
  const denominator = Number(total)
  if (!Number.isFinite(denominator) || denominator <= 0) return 0
  return clampPercent((Number(value) || 0) / denominator * 100)
}

export function plural(count, one, few, many) {
  const number = Math.abs(Math.trunc(Number(count) || 0))
  const mod100 = number % 100
  const mod10 = number % 10
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}

export function isSameDay(first, second) {
  const a = parseServerDate(first)
  const b = parseServerDate(second)
  if (!a || !b) return false
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function startOfDay(value) {
  const date = parseServerDate(value) || new Date()
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function dayKey(value) {
  const date = parseServerDate(value)
  if (!date) return 'unknown'
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function isToday(value) {
  return isSameDay(value, new Date())
}

export function daysUntil(value) {
  const target = parseServerDate(value)
  if (!target) return null
  const MS_PER_DAY = 24 * 60 * 60 * 1000
  return Math.ceil((startOfDay(target).getTime() - startOfDay(new Date()).getTime()) / MS_PER_DAY)
}

export function deadlineLabel(value) {
  const date = parseServerDate(value)
  if (!date) return null
  const days = daysUntil(date)
  if (days === null) return null
  if (days < 0) {
    const overdue = Math.abs(days)
    return { text: `Просрочено на ${overdue} ${plural(overdue, 'день', 'дня', 'дней')}`, tone: 'negative' }
  }
  if (days === 0) return { text: `Сегодня, ${formatTime(date)}`, tone: 'warning' }
  if (days === 1) return { text: `Завтра, ${formatTime(date)}`, tone: 'warning' }
  if (days <= 7) {
    return { text: `Через ${days} ${plural(days, 'день', 'дня', 'дней')}`, tone: 'muted' }
  }
  return { text: formatDate(date), tone: 'muted' }
}

export function elapsedMs(startedAt, now = Date.now()) {
  const start = parseServerDate(startedAt)
  if (!start) return 0
  return Math.max(0, now - start.getTime())
}

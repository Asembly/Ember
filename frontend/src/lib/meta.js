export const STATUS_META = {
  OPEN: {
    label: 'Открыта',
    dot: 'bg-sky-400',
    chip: 'bg-sky-400/10 text-sky-200 border-sky-400/20',
  },
  IN_PROGRESS: {
    label: 'В работе',
    dot: 'bg-amber-400',
    chip: 'bg-amber-400/10 text-amber-200 border-amber-400/20',
  },
  DONE: {
    label: 'Завершена',
    dot: 'bg-emerald-400',
    chip: 'bg-emerald-400/10 text-emerald-200 border-emerald-400/20',
  },
  CANCELED: {
    label: 'Отменена',
    dot: 'bg-rose-400',
    chip: 'bg-rose-400/10 text-rose-200 border-rose-400/20',
  },
}

export const STATUS_ORDER = ['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELED']

export const STATUS_FILTERS = [
  { id: 'ALL', label: 'Все' },
  { id: 'OPEN', label: 'Открытые' },
  { id: 'IN_PROGRESS', label: 'В работе' },
  { id: 'DONE', label: 'Завершённые' },
  { id: 'CANCELED', label: 'Отменённые' },
]

export function statusMeta(status) {
  return (
    STATUS_META[status] || {
      label: status || 'Неизвестно',
      dot: 'bg-slate-400',
      chip: 'bg-slate-400/10 text-slate-200 border-slate-400/20',
    }
  )
}

export const DIFFICULTY_META = {
  EASY: {
    label: 'Лёгкая',
    multiplier: 0.1,
    chip: 'bg-emerald-400/10 text-emerald-200 border-emerald-400/20',
  },
  MEDIUM: {
    label: 'Средняя',
    multiplier: 0.5,
    chip: 'bg-sky-400/10 text-sky-200 border-sky-400/20',
  },
  HARD: {
    label: 'Сложная',
    multiplier: 0.75,
    chip: 'bg-amber-400/10 text-amber-200 border-amber-400/20',
  },
  EXTRA_HARD: {
    label: 'Очень сложная',
    multiplier: 0.8,
    chip: 'bg-orange-400/10 text-orange-200 border-orange-400/20',
  },
  INSANE: {
    label: 'Безумная',
    multiplier: 1,
    chip: 'bg-fuchsia-400/10 text-fuchsia-200 border-fuchsia-400/20',
  },
}

export const DIFFICULTY_ORDER = ['EASY', 'MEDIUM', 'HARD', 'EXTRA_HARD', 'INSANE']

export const DIFFICULTY_FILTERS = [
  { id: 'ALL', label: 'Любая сложность' },
  { id: 'EASY', label: 'Лёгкая' },
  { id: 'MEDIUM', label: 'Средняя' },
  { id: 'HARD', label: 'Сложная' },
  { id: 'EXTRA_HARD', label: 'Очень сложная' },
  { id: 'INSANE', label: 'Безумная' },
]

export function difficultyMeta(difficulty) {
  return (
    DIFFICULTY_META[difficulty] || {
      label: difficulty || 'Неизвестно',
      multiplier: 0,
      chip: 'bg-slate-400/10 text-slate-200 border-slate-400/20',
    }
  )
}

export const TAG_COLORS = {
  WHITE: '#f4f1f6',
  RED: '#f2888f',
  BLACK: '#2b2331',
  GRAY: '#a8a1b4',
  YELLOW: '#f2d489',
  GREEN: '#9fdcb4',
  PURPLE: '#c5b1f5',
  BLUE: '#a6c8f2',
  BROWN: '#c9a98c',
  PINK: '#f6b5d2',
}

export const TAG_COLOR_ORDER = [
  'PINK',
  'RED',
  'YELLOW',
  'GREEN',
  'BLUE',
  'PURPLE',
  'BROWN',
  'GRAY',
  'WHITE',
  'BLACK',
]

export const TAG_COLOR_LABELS = {
  WHITE: 'Белый',
  RED: 'Красный',
  BLACK: 'Чёрный',
  GRAY: 'Серый',
  YELLOW: 'Жёлтый',
  GREEN: 'Зелёный',
  PURPLE: 'Фиолетовый',
  BLUE: 'Синий',
  BROWN: 'Коричневый',
  PINK: 'Розовый',
}

export function tagColorHex(color) {
  return TAG_COLORS[color] || TAG_COLORS.PINK
}

export const ATTRIBUTE_LABELS = {
  Strength: 'Сила',
  Intelligence: 'Интеллект',
  Agility: 'Ловкость',
  Stamina: 'Выносливость',
}

export const ATTRIBUTE_ORDER = ['Strength', 'Intelligence', 'Agility', 'Stamina']

export const ATTRIBUTE_COLORS = {
  Strength: '#f5b0a8',
  Intelligence: '#a9c6f5',
  Agility: '#a9e3c2',
  Stamina: '#f3d39a',
}

const ATTRIBUTE_FALLBACK_COLORS = ['#f7b6d3', '#c5b1f5', '#a9c6f5', '#a8e6c9', '#f3d39a', '#f5b0a8']

export function attributeLabel(name) {
  if (!name) return '—'
  return ATTRIBUTE_LABELS[name] || name
}

export function attributeColor(name, index = 0) {
  if (name && ATTRIBUTE_COLORS[name]) return ATTRIBUTE_COLORS[name]
  return ATTRIBUTE_FALLBACK_COLORS[index % ATTRIBUTE_FALLBACK_COLORS.length]
}

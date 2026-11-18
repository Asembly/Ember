export const STATUS_META = {
  OPEN: {
    label: 'Открыта',
    dot: 'dot dot-open',
    chip: 'chip chip-accent',
  },
  IN_PROGRESS: {
    label: 'В работе',
    dot: 'dot dot-progress',
    chip: 'chip chip-warning',
  },
  DONE: {
    label: 'Завершена',
    dot: 'dot dot-done',
    chip: 'chip chip-positive',
  },
  CANCELED: {
    label: 'Отменена',
    dot: 'dot dot-canceled',
    chip: 'chip chip-negative',
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
      dot: 'dot dot-muted',
      chip: 'chip',
    }
  )
}

export const DIFFICULTY_META = {
  EASY: {
    label: 'Лёгкая',
    multiplier: 0.1,
    chip: 'chip chip-positive',
  },
  MEDIUM: {
    label: 'Средняя',
    multiplier: 0.5,
    chip: 'chip chip-accent',
  },
  HARD: {
    label: 'Сложная',
    multiplier: 0.75,
    chip: 'chip chip-warning',
  },
  EXTRA_HARD: {
    label: 'Очень сложная',
    multiplier: 0.8,
    chip: 'chip chip-warning',
  },
  INSANE: {
    label: 'Безумная',
    multiplier: 1,
    chip: 'chip chip-negative',
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
      chip: 'chip',
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

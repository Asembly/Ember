import { clampPercent, percentOf } from './format'

export const ACHIEVEMENTS = [
  {
    code: 'FIRST_BLOOD',
    name: 'Первая кровь',
    description: 'Завершить первую задачу',
    metric: 'doneTasks',
    goal: 1,
    unit: 'задач',
    icon: 'spark',
  },
  {
    code: 'WORKAHOLIC',
    name: 'Трудоголик',
    description: 'Завершить 10 задач',
    metric: 'doneTasks',
    goal: 10,
    unit: 'задач',
    icon: 'flame',
  },
  {
    code: 'LEGEND',
    name: 'Легенда',
    description: 'Завершить 25 задач',
    metric: 'doneTasks',
    goal: 25,
    unit: 'задач',
    icon: 'crown',
  },
  {
    code: 'VETERAN',
    name: 'Ветеран',
    description: 'Достичь 5 уровня профиля',
    metric: 'profileLevel',
    goal: 5,
    unit: 'ур.',
    icon: 'shield',
  },
  {
    code: 'MASTER',
    name: 'Мастер',
    description: 'Достичь 10 уровня профиля',
    metric: 'profileLevel',
    goal: 10,
    unit: 'ур.',
    icon: 'star',
  },
  {
    code: 'STRONG_SIDE',
    name: 'Сильная сторона',
    description: 'Прокачать любой атрибут до 5 уровня',
    metric: 'maxAttributeLevel',
    goal: 5,
    unit: 'ур.',
    icon: 'bolt',
  },
  {
    code: 'HOUR_IN_SADDLE',
    name: 'Час в седле',
    description: 'Накопить 60 минут в сессиях',
    metric: 'totalMinutes',
    goal: 60,
    unit: 'мин',
    icon: 'clock',
  },
  {
    code: 'MARATHONER',
    name: 'Марафонец',
    description: 'Накопить 600 минут в сессиях',
    metric: 'totalMinutes',
    goal: 600,
    unit: 'мин',
    icon: 'road',
  },
  {
    code: 'HARMONY',
    name: 'Гармония',
    description: 'Поднять все атрибуты минимум до 2 уровня',
    metric: 'minAttributeLevel',
    goal: 2,
    unit: 'ур.',
    icon: 'balance',
  },
  {
    code: 'DISCIPLINE',
    name: 'Дисциплина',
    description: 'Завершить 5 задач без единой отменённой',
    metric: 'disciplineScore',
    goal: 5,
    unit: 'задач',
    icon: 'check',
  },
]

export function buildAchievementStats({ tasks = [], sessions = [], profile = null, attributes = [] }) {
  const doneTasks = tasks.filter((task) => task.status === 'DONE').length
  const canceledTasks = tasks.filter((task) => task.status === 'CANCELED').length
  const totalMinutes = sessions.reduce((sum, session) => sum + (Number(session.durationInMin) || 0), 0)
  const levels = attributes.map((attribute) => Number(attribute.level) || 0)
  const maxAttributeLevel = levels.length ? Math.max(...levels) : 0
  const minAttributeLevel = levels.length ? Math.min(...levels) : 0

  return {
    doneTasks,
    canceledTasks,
    totalMinutes,
    profileLevel: Number(profile?.level) || 0,
    maxAttributeLevel,
    minAttributeLevel,
    disciplineScore: canceledTasks === 0 ? doneTasks : 0,
  }
}

export function evaluateAchievements(stats) {
  return ACHIEVEMENTS.map((achievement) => {
    const current = Math.max(0, Math.floor(Number(stats?.[achievement.metric]) || 0))
    const percent = percentOf(current, achievement.goal)
    return {
      ...achievement,
      current,
      percent: clampPercent(percent),
      unlocked: current >= achievement.goal,
    }
  })
}

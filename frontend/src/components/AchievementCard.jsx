import ProgressBar from './ProgressBar'
import { AchievementIcon, CheckIcon, LockIcon } from './icons'
import { plural } from '../lib/format'

const ICON_TINT = {
  spark: '#f7b6d3',
  flame: '#f5a97f',
  crown: '#f3d39a',
  shield: '#a9c6f5',
  star: '#f3d39a',
  bolt: '#c5b1f5',
  clock: '#a9e3c2',
  road: '#a8e6c9',
  balance: '#a9c6f5',
  check: '#f5b0a8',
}

export default function AchievementCard({ achievement }) {
  const tint = ICON_TINT[achievement.icon] || 'var(--c-accent)'
  const unlocked = achievement.unlocked

  return (
    <article
      className="card flex flex-col gap-3 p-4 transition duration-200 hover:-translate-y-0.5"
      style={{
        backgroundColor: unlocked ? 'var(--c-raised)' : 'var(--c-surface)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
          style={{
            borderColor: unlocked ? `${tint}55` : 'var(--c-line)',
            backgroundColor: unlocked ? `${tint}1f` : 'var(--c-canvas)',
            color: unlocked ? tint : 'var(--c-muted)',
          }}
        >
          <AchievementIcon name={achievement.icon} size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 text-[13px] font-semibold text-ink">
            {achievement.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-muted">
            {achievement.description}
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between gap-2 text-[10.5px]">
          <span className="font-medium text-muted">
            {achievement.current} / {achievement.goal} {achievement.unit}
          </span>
          {unlocked ? (
            <span
              className="inline-flex items-center gap-1 font-semibold"
              style={{ color: 'var(--c-positive)' }}
            >
              <CheckIcon size={11} />
              Получено
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 font-medium text-muted">
              <LockIcon size={10} />
              {achievement.percent}%
            </span>
          )}
        </div>

        <div className="mt-2">
          <ProgressBar
            value={unlocked ? 100 : achievement.percent}
            tone={unlocked ? 'positive' : 'accent'}
            height="h-1"
          />
        </div>
      </div>
    </article>
  )
}

export function AchievementProgressSummary({ unlocked, total }) {
  return (
    <span className="text-[11.5px] font-medium text-muted">
      {unlocked} из {total} {plural(total, 'достижение', 'достижения', 'достижений')}
    </span>
  )
}

import ProgressBar from './ProgressBar'
import { AchievementIcon, CheckIcon, LockIcon } from './icons'
import { plural } from '../lib/format'

const ICON_TONE = {
  spark: 'var(--c-accent)',
  flame: 'var(--c-warning)',
  crown: 'var(--c-positive)',
  shield: 'var(--c-accent-strong)',
  star: 'var(--c-warning)',
  bolt: 'var(--c-accent)',
  clock: 'var(--c-positive)',
  road: 'var(--c-positive)',
  balance: 'var(--c-accent)',
  check: 'var(--c-negative)',
}

export default function AchievementCard({ achievement }) {
  const tone = ICON_TONE[achievement.icon] || 'var(--c-accent)'
  const unlocked = achievement.unlocked

  return (
    <article
      className="card card-hover flex flex-col gap-3 p-4"
      style={{
        borderRadius: 'var(--radius)',
        backgroundColor: unlocked
          ? 'color-mix(in srgb, var(--c-surface) 92%, var(--c-accent))'
          : 'var(--c-surface)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center"
          style={{
            borderRadius: 'calc(var(--radius-sm, 12px) * 0.9)',
            backgroundColor: unlocked
              ? 'color-mix(in srgb, var(--c-accent) 18%, transparent)'
              : 'var(--c-raised)',
            color: unlocked ? tone : 'var(--c-muted)',
          }}
        >
          <AchievementIcon name={achievement.icon} size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-1 text-[12.5px] font-semibold text-ink">
            {achievement.name}
          </h3>
          <p className="mt-0.5 line-clamp-2 text-[10.5px] leading-relaxed text-muted">
            {achievement.description}
          </p>
        </div>

        {unlocked ? (
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center"
            style={{
              borderRadius: 'calc(var(--radius-sm, 12px) * 0.7)',
              backgroundColor: 'var(--c-positive)',
              color: 'var(--c-cta-ink)',
            }}
            aria-label="Получено"
          >
            <CheckIcon size={12} />
          </span>
        ) : null}
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between gap-2 text-[10.5px]">
          <span className="font-medium text-muted">
            {achievement.current} / {achievement.goal} {achievement.unit}
          </span>
          {unlocked ? (
            <span className="inline-flex items-center gap-1 font-semibold" style={{ color: 'var(--c-positive)' }}>
              <CheckIcon size={10} />
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
    <span className="chip chip-positive h-5 px-2 text-[9.5px] font-semibold">
      {unlocked} из {total} {plural(total, 'достижение', 'достижения', 'достижений')}
    </span>
  )
}

import { ATTRIBUTE_LABELS, ATTRIBUTE_ORDER } from '../lib/meta'

const MIN_RATIO = 0.06
const MIN_SCALE = 3
const MAX_TICK_SCALE = 6

function polar(cx, cy, radius, angle) {
  return {
    x: cx + Math.cos(angle) * radius,
    y: cy + Math.sin(angle) * radius,
  }
}

function polygonPoints(cx, cy, radius, angles) {
  return angles
    .map((angle) => {
      const point = polar(cx, cy, radius, angle)
      return `${point.x.toFixed(2)},${point.y.toFixed(2)}`
    })
    .join(' ')
}

function labelAnchor(cos) {
  if (Math.abs(cos) < 0.25) return 'middle'
  return cos > 0 ? 'start' : 'end'
}

function attributeValue(attribute) {
  if (!attribute) return 0

  const level = Number(attribute.level) || 0
  const currentXp = Number(attribute.currentXp) || 0
  const nextLevelUp = Number(attribute.nextLevelUp) || 0

  const progress = nextLevelUp > 0 ? Math.min(1, Math.max(0, currentXp / nextLevelUp)) : 0

  return level + progress
}

export default function BalanceRadar({ attributes = [], size = 300 }) {
  const byName = new Map(
    attributes.map((attribute) => [String(attribute?.name || '').toLowerCase(), attribute]),
  )

  const axes = ATTRIBUTE_ORDER.map((name) => ({
    name,
    label: ATTRIBUTE_LABELS[name] || name,
    attribute: byName.get(name.toLowerCase()) || null,
  }))

  attributes
    .filter((attribute) => !ATTRIBUTE_ORDER.includes(String(attribute?.name || '')))
    .forEach((attribute, index) => {
      axes.push({
        name: String(attribute?.name || `attribute-${index}`),
        label: attribute?.name || '—',
        attribute,
      })
    })

  const values = axes.map((axis) => attributeValue(axis.attribute))
  const peak = Math.max(0, ...values)
  const scaleMax = Math.max(MIN_SCALE, Math.ceil(peak))

  const total = Math.max(3, axes.length)
  const cx = size / 2
  const cy = size / 2
  const radius = size / 2 - size * 0.16

  const angles = axes.map((_, index) => -Math.PI / 2 + (index * 2 * Math.PI) / total)
  const ratios = values.map((value) =>
    Math.min(1, Math.max(MIN_RATIO, value / scaleMax)),
  )

  const rings =
    scaleMax <= MAX_TICK_SCALE
      ? Array.from({ length: scaleMax }, (_, index) => (index + 1) / scaleMax)
      : [0.25, 0.5, 0.75, 1]

  const ticks =
    scaleMax <= MAX_TICK_SCALE
      ? Array.from({ length: scaleMax }, (_, index) => ({
          ratio: (index + 1) / scaleMax,
          level: index + 1,
        }))
      : []

  const valuePoints = angles
    .map((angle, index) => {
      const point = polar(cx, cy, radius * ratios[index], angle)
      return `${point.x.toFixed(2)},${point.y.toFixed(2)}`
    })
    .join(' ')

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="auto"
      role="img"
      aria-label="Колесо баланса атрибутов"
      style={{ display: 'block', overflow: 'visible' }}
    >
      {rings.map((ring, index) => (
        <polygon
          key={`ring-${index}`}
          points={polygonPoints(cx, cy, radius * ring, angles)}
          fill="none"
          stroke="var(--c-line)"
          strokeWidth={ring === 1 ? 1 : 0.6}
          strokeOpacity={ring === 1 ? 1 : 0.55}
        />
      ))}

      {angles.map((angle, index) => {
        const outer = polar(cx, cy, radius, angle)
        return (
          <line
            key={`axis-${axes[index].name}-${index}`}
            x1={cx}
            y1={cy}
            x2={outer.x}
            y2={outer.y}
            stroke="var(--c-line)"
            strokeWidth={0.6}
            strokeOpacity={0.7}
          />
        )
      })}

      {ticks.map((tick) => (
        <text
          key={`tick-${tick.level}`}
          x={cx + 4}
          y={cy - radius * tick.ratio}
          textAnchor="start"
          dominantBaseline="middle"
          fill="var(--c-muted)"
          fontSize={8.5}
          fontWeight={500}
          opacity={0.85}
        >
          {tick.level}
        </text>
      ))}

      <polygon
        points={valuePoints}
        fill="var(--c-accent)"
        fillOpacity={0.18}
        stroke="var(--c-accent)"
        strokeWidth={1.4}
        strokeLinejoin="round"
      />

      {angles.map((angle, index) => {
        const point = polar(cx, cy, radius * ratios[index], angle)
        return (
          <circle
            key={`dot-${axes[index].name}-${index}`}
            cx={point.x}
            cy={point.y}
            r={2.4}
            fill="var(--c-accent)"
          />
        )
      })}

      {angles.map((angle, index) => {
        const axis = axes[index]
        const cos = Math.cos(angle)
        const sin = Math.sin(angle)
        const outer = polar(cx, cy, radius + size * 0.045, angle)
        const levelY = outer.y + (sin > 0.4 ? size * 0.075 : size * 0.065)

        return (
          <g key={`label-${axis.name}-${index}`}>
            <text
              x={outer.x}
              y={outer.y}
              textAnchor={labelAnchor(cos)}
              dominantBaseline={sin > 0.4 ? 'hanging' : sin < -0.4 ? 'auto' : 'middle'}
              fill="var(--c-ink)"
              fontSize={11}
              fontWeight={600}
            >
              {axis.label}
            </text>
            <text
              x={outer.x}
              y={levelY}
              textAnchor={labelAnchor(cos)}
              fill="var(--c-muted)"
              fontSize={9.5}
              fontWeight={500}
            >
              {`ур. ${Number(axis.attribute?.level) || 0}`}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

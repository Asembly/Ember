const BASE_PROPS = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Svg({ size = 20, strokeWidth = 1.7, className = '', children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden="true"
      focusable="false"
      {...BASE_PROPS}
      {...rest}
    >
      {children}
    </svg>
  )
}

export const DashboardIcon = (props) => (
  <Svg {...props}>
    <rect x="3.2" y="3.2" width="7.6" height="7.6" rx="2.2" />
    <rect x="13.2" y="3.2" width="7.6" height="4.6" rx="2" />
    <rect x="13.2" y="11.2" width="7.6" height="9.6" rx="2.2" />
    <rect x="3.2" y="14.2" width="7.6" height="6.6" rx="2.2" />
  </Svg>
)

export const TasksIcon = (props) => (
  <Svg {...props}>
    <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="4.2" />
    <path d="m7.8 12.1 2.6 2.6 5.8-6.2" />
  </Svg>
)

export const TrophyIcon = (props) => (
  <Svg {...props}>
    <path d="M7.2 3.8h9.6v5.4a4.8 4.8 0 0 1-9.6 0V3.8Z" />
    <path d="M16.8 5.6h2.4a1.6 1.6 0 0 1 0 3.2h-2.4" />
    <path d="M7.2 5.6H4.8a1.6 1.6 0 0 0 0 3.2h2.4" />
    <path d="M12 14v3" />
    <path d="M8.4 20.2h7.2" />
    <path d="M9.6 20.2c0-1.9 1.1-3.2 2.4-3.2s2.4 1.3 2.4 3.2" />
  </Svg>
)

export const HistoryIcon = (props) => (
  <Svg {...props}>
    <path d="M3.6 12a8.4 8.4 0 1 0 2.5-6" />
    <path d="M3.6 4.6V10H9" />
    <path d="M12 7.6V12l3 1.9" />
  </Svg>
)

export const PlusIcon = (props) => (
  <Svg {...props}>
    <path d="M12 5.2v13.6" />
    <path d="M5.2 12h13.6" />
  </Svg>
)

export const PlayIcon = (props) => (
  <Svg {...props} fill="currentColor" stroke="none">
    <path d="M8.4 5.4c0-.85 0.95-1.35 1.65-.87l8.6 6.06c.62.44.62 1.38 0 1.82l-8.6 6.06c-.7.48-1.65-.02-1.65-.87V5.4Z" />
  </Svg>
)

export const StopIcon = (props) => (
  <Svg {...props} fill="currentColor" stroke="none">
    <rect x="6.2" y="6.2" width="11.6" height="11.6" rx="2.6" />
  </Svg>
)

export const CheckIcon = (props) => (
  <Svg {...props} strokeWidth={2.1}>
    <path d="m4.8 12.6 4.6 4.6L19.2 7" />
  </Svg>
)

export const CloseIcon = (props) => (
  <Svg {...props}>
    <path d="M6.2 6.2l11.6 11.6" />
    <path d="M17.8 6.2 6.2 17.8" />
  </Svg>
)

export const SearchIcon = (props) => (
  <Svg {...props}>
    <circle cx="10.8" cy="10.8" r="6.4" />
    <path d="m15.6 15.6 4 4" />
  </Svg>
)

export const SparkIcon = (props) => (
  <Svg {...props}>
    <path d="M12 3.4l1.85 5.55 5.55 1.85-5.55 1.85L12 18.2l-1.85-5.55L4.6 10.8l5.55-1.85L12 3.4Z" />
  </Svg>
)

export const FlameIcon = (props) => (
  <Svg {...props}>
    <path d="M12 3.4c3.1 3.5 5.4 5.9 5.4 9.3a5.4 5.4 0 0 1-10.8 0c0-3.4 2.3-5.8 5.4-9.3Z" />
    <path d="M12 18.4c1.6 0 2.7-1.1 2.7-2.5 0-1.6-1.1-2.5-2.7-4.2-1.6 1.7-2.7 2.6-2.7 4.2 0 1.4 1.1 2.5 2.7 2.5Z" />
  </Svg>
)

export const CrownIcon = (props) => (
  <Svg {...props}>
    <path d="M4.4 18.6h15.2" />
    <path d="m4.4 7.8 4 4.6L12 4.8l3.6 7.6 4-4.6v8.2H4.4V7.8Z" />
  </Svg>
)

export const ShieldIcon = (props) => (
  <Svg {...props}>
    <path d="M12 3.4 19 5.8v5.4c0 4-2.8 7.1-7 9.4-4.2-2.3-7-5.4-7-9.4V5.8l7-2.4Z" />
    <path d="m9 11.9 2.1 2.1 4-4.3" />
  </Svg>
)

export const StarIcon = (props) => (
  <Svg {...props}>
    <path d="m12 3.8 2.5 5.1 5.6.8-4.05 3.95.95 5.55L12 16.55l-5 2.65.95-5.55L3.9 9.7l5.6-.8L12 3.8Z" />
  </Svg>
)

export const BoltIcon = (props) => (
  <Svg {...props}>
    <path d="M13.2 2.9 6.4 13.6h4.6l-1 7.5 7-11h-4.6l.8-7.2Z" />
  </Svg>
)

export const ClockIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="8.3" />
    <path d="M12 7.6V12l3 1.9" />
  </Svg>
)

export const TimerIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="13.6" r="6.9" />
    <path d="M12 10.2v3.7l2.4 1.6" />
    <path d="M9.4 2.9h5.2" />
    <path d="M12 2.9v1.9" />
  </Svg>
)

export const RoadIcon = (props) => (
  <Svg {...props}>
    <path d="M6.4 20.2 9.2 4" />
    <path d="M17.6 20.2 14.8 4" />
    <path d="M12 5v3" />
    <path d="M12 11v3" />
    <path d="M12 17v3.2" />
  </Svg>
)

export const BalanceIcon = (props) => (
  <Svg {...props}>
    <path d="M12 4v16" />
    <path d="M5.4 7.6h13.2" />
    <path d="m8.2 7.6-2.9 6h5.8l-2.9-6Z" />
    <path d="m15.8 7.6-2.9 6h5.8l-2.9-6Z" />
    <path d="M8.4 20h7.2" />
  </Svg>
)

export const TagIcon = (props) => (
  <Svg {...props}>
    <path d="M4.2 11.6V5.6A1.4 1.4 0 0 1 5.6 4.2h6L20 12.6 12.6 20 4.2 11.6Z" />
    <circle cx="8.1" cy="8.1" r="1.25" fill="currentColor" stroke="none" />
  </Svg>
)

export const LayersIcon = (props) => (
  <Svg {...props}>
    <path d="m12 3.2 8.4 4.4L12 12 3.6 7.6 12 3.2Z" />
    <path d="m4.4 12 7.6 4 7.6-4" />
    <path d="m4.4 16.4 7.6 4 7.6-4" />
  </Svg>
)

export const ArrowRightIcon = (props) => (
  <Svg {...props}>
    <path d="M4.8 12h13.4" />
    <path d="m13.2 6.8 5.2 5.2-5.2 5.2" />
  </Svg>
)

export const CalendarIcon = (props) => (
  <Svg {...props}>
    <rect x="3.4" y="5" width="17.2" height="15.4" rx="3.2" />
    <path d="M8 2.9v4" />
    <path d="M16 2.9v4" />
    <path d="M3.4 10.2h17.2" />
  </Svg>
)

export const TargetIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="8.2" />
    <circle cx="12" cy="12" r="4.1" />
    <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
  </Svg>
)

export const RefreshIcon = (props) => (
  <Svg {...props}>
    <path d="M20 12a8 8 0 1 1-2.4-5.7" />
    <path d="M20 4.4V10h-5.6" />
  </Svg>
)

export const PaletteIcon = (props) => (
  <Svg {...props}>
    <path d="M12 3.4c-4.7 0-8.5 3.5-8.5 8s3.4 8.2 7.4 8.2c1.4 0 2-.95 2-1.9 0-1.6-1.5-1.75-1.5-3 0-1 .8-1.7 1.9-1.7h1.8c2.5 0 4.4-1.8 4.4-4.3 0-3.6-3.7-5.3-7.5-5.3Z" />
    <circle cx="7.9" cy="10.1" r="1.05" fill="currentColor" stroke="none" />
    <circle cx="11" cy="7.3" r="1.05" fill="currentColor" stroke="none" />
    <circle cx="15" cy="8.4" r="1.05" fill="currentColor" stroke="none" />
  </Svg>
)

export const AlertIcon = (props) => (
  <Svg {...props}>
    <path d="M12 4.2 21 19.6H3L12 4.2Z" />
    <path d="M12 9.6v4.2" />
    <circle cx="12" cy="16.8" r="0.9" fill="currentColor" stroke="none" />
  </Svg>
)

export const InfoIcon = (props) => (
  <Svg {...props}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 11v5.2" />
    <circle cx="12" cy="7.9" r="0.95" fill="currentColor" stroke="none" />
  </Svg>
)

export const ChevronDownIcon = (props) => (
  <Svg {...props}>
    <path d="m6.2 9.4 5.8 5.8 5.8-5.8" />
  </Svg>
)

export const PencilIcon = (props) => (
  <Svg {...props}>
    <path d="m4.6 19.4.9-4L16 5a2.1 2.1 0 0 1 3 3L8.5 18.5l-3.9.9Z" />
    <path d="m14 7 3 3" />
  </Svg>
)

export const TrendUpIcon = (props) => (
  <Svg {...props}>
    <path d="m4 16.2 5.4-5.4 3.5 3.5L20 7.2" />
    <path d="M14.8 7.2H20v5.2" />
  </Svg>
)

export const FolderIcon = (props) => (
  <Svg {...props}>
    <path d="M3.6 6.4A1.8 1.8 0 0 1 5.4 4.6h4L11.6 7h7A1.8 1.8 0 0 1 20.4 8.8v9A1.8 1.8 0 0 1 18.6 19.6H5.4a1.8 1.8 0 0 1-1.8-1.8V6.4Z" />
  </Svg>
)

export const LockIcon = (props) => (
  <Svg {...props}>
    <rect x="4.6" y="10.4" width="14.8" height="10" rx="2.4" />
    <path d="M8.2 10.4V7.8a3.8 3.8 0 0 1 7.6 0v2.6" />
  </Svg>
)

export const ACHIEVEMENT_ICONS = {
  spark: SparkIcon,
  flame: FlameIcon,
  crown: CrownIcon,
  shield: ShieldIcon,
  star: StarIcon,
  bolt: BoltIcon,
  clock: ClockIcon,
  road: RoadIcon,
  balance: BalanceIcon,
  check: CheckIcon,
}

export function AchievementIcon({ name, ...props }) {
  const Component = ACHIEVEMENT_ICONS[name] || SparkIcon
  return <Component {...props} />
}

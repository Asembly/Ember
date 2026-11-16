export default function Brand({ size = 'md', withText = true }) {
  const box = size === 'lg' ? 'h-12 w-12' : size === 'sm' ? 'h-8 w-8' : 'h-9 w-9'
  const glyph = size === 'lg' ? 22 : size === 'sm' ? 16 : 18

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`relative flex ${box} shrink-0 items-center justify-center overflow-hidden radius-theme`}
        style={{
          backgroundColor: 'var(--c-accent)',
          color: 'var(--c-accent-ink)',
        }}
      >
        <svg
          width={glyph}
          height={glyph}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m8.2 12.3 2.5 2.5 5.1-5.7" strokeWidth="2.3" />
        </svg>
      </div>

      {withText ? (
        <div className="leading-none">
          <p className="font-display text-[17px] font-semibold tracking-tight text-ink">Ember</p>
        </div>
      ) : null}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { elapsedMs, formatClock } from '../lib/format'

export default function TaskTimer({ startedAt, active = false, className = '' }) {
    const [now, setNow] = useState(() => Date.now())

    useEffect(() => {
        if (!active) return undefined

        setNow(Date.now())
        const interval = window.setInterval(() => setNow(Date.now()), 1000)
        return () => window.clearInterval(interval)
    }, [active, startedAt])

    const value = active ? elapsedMs(startedAt, now) : 0

    return (
        <span
            className={`mono-time tabular-nums ${className}`}
            style={active ? { color: 'var(--c-ink)' } : { color: 'var(--c-muted)' }}
        >
            {formatClock(value)}
        </span>
    )
}

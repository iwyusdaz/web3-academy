interface Props {
  /** 0..1 */
  value: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
}

export function ProgressRing({ value, size = 96, strokeWidth = 8, label, sublabel }: Props) {
  const clamped = Math.max(0, Math.min(1, value))
  const r = (size - strokeWidth) / 2
  const c = 2 * Math.PI * r
  const offset = c * (1 - clamped)
  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} aria-hidden="true">
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={strokeWidth} />
        <circle
          className="ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={strokeWidth}
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-text">
        <span className="ring-label">{label ?? `${Math.round(clamped * 100)}%`}</span>
        {sublabel && <span className="ring-sublabel">{sublabel}</span>}
      </div>
    </div>
  )
}

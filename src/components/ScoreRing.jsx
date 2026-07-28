import { scoreColor } from '../utils/helpers'

// Circular score indicator (SVG-based, no external chart lib needed)
export default function ScoreRing({ value = 0, label = '', size = 96, stroke = 8 }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference
  const color = scoreColor(value)

  return (
    <div className="score-ring" style={{ width: size }}>
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={size / 4.2}
          fontWeight="700"
          fill="var(--text)"
        >
          {value}
        </text>
      </svg>
      {label && <p className="score-ring-label">{label}</p>}
    </div>
  )
}

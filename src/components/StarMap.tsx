import { useMemo, useState } from 'react'
import { getLevelLessons } from '../data/curriculum'
import type { Lesson, Level } from '../types'

// The atlas plate: all 33 lessons drawn as three constellations on night stock.
// Deterministic geometry — the same chart every visit, stars are real lessons
// in reading order, brass fill marks completed plates.

interface Pt {
  x: number
  y: number
}

function constellation(count: number, x0: number, y0: number, x1: number, y1: number, amp: number, phase: number): Pt[] {
  const pts: Pt[] = []
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1)
    pts.push({
      x: x0 + (x1 - x0) * t + Math.cos(t * Math.PI * 2.3 + phase) * (amp * 0.45),
      y: y0 + (y1 - y0) * t + Math.sin(t * Math.PI * 1.9 + phase) * amp,
    })
  }
  return pts
}

const W = 920
const H = 560

const TRACKS: { level: Level; label: string; range: string }[] = [
  { level: 'beginner', label: 'Beginner', range: 'I–X' },
  { level: 'intermediate', label: 'Intermediate', range: 'XI–XXI' },
  { level: 'advanced', label: 'Advanced', range: 'XXII–XXXIII' },
]

const GEOMETRY: Record<Level, { from: Pt; to: Pt; amp: number; phase: number }> = {
  beginner: { from: { x: 84, y: 468 }, to: { x: 372, y: 386 }, amp: 26, phase: 0.4 },
  intermediate: { from: { x: 318, y: 408 }, to: { x: 648, y: 236 }, amp: 30, phase: 1.9 },
  advanced: { from: { x: 552, y: 196 }, to: { x: 856, y: 92 }, amp: 22, phase: 3.1 },
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

function roman(n: number): string {
  if (n <= 12) return ROMAN[n - 1]
  const tens = Math.floor((n - 1) / 10)
  const ones = ((n - 1) % 10) + 1
  return ['X', 'XX', 'XXX'][tens - 1] + (ones > 0 ? ROMAN[ones - 1] : '')
}

export function StarMap({ completed }: { completed: Record<string, boolean> }) {
  const [hovered, setHovered] = useState<Level | null>(null)

  const data = useMemo(
    () =>
      TRACKS.map((t) => {
        const lessons = getLevelLessons(t.level)
        const g = GEOMETRY[t.level]
        const pts = constellation(lessons.length, g.from.x, g.from.y, g.to.x, g.to.y, g.amp, g.phase)
        return { ...t, lessons, pts }
      }),
    [],
  )

  return (
    <figure className="starmap" aria-label="Chart of all 33 lessons across the three tracks; each star links to its lesson">
      <svg viewBox={`0 0 ${W} ${H}`} role="group">
        {/* faint graticule — engraved chart stock */}
        <g className="starmap-graticule" aria-hidden="true">
          {[112, 224, 336, 448].map((y) => (
            <line key={`h${y}`} x1={24} x2={W - 24} y1={y} y2={y} />
          ))}
          {[160, 320, 480, 640, 800].map((x) => (
            <line key={`v${x}`} x1={x} x2={x} y1={24} y2={H - 24} />
          ))}
        </g>

        {data.map((track) => {
          const dim = hovered !== null && hovered !== track.level
          const active = hovered === track.level
          return (
            <g
              key={track.level}
              className={`constellation c-${track.level} ${dim ? 'is-dim' : ''} ${active ? 'is-active' : ''}`}
              onMouseEnter={() => setHovered(track.level)}
              onMouseLeave={() => setHovered(null)}
            >
              {track.pts.slice(0, -1).map((p, i) => {
                const q = track.pts[i + 1]
                const len = Math.round(Math.hypot(q.x - p.x, q.y - p.y))
                return (
                  <line
                    key={i}
                    x1={p.x}
                    y1={p.y}
                    x2={q.x}
                    y2={q.y}
                    className="star-line"
                    style={{ strokeDasharray: len, strokeDashoffset: len, animationDelay: `${(track.lessons.length > 10 ? 10 : track.lessons.length) * 0.04 + i * 0.05}s` }}
                  />
                )
              })}
              {track.pts.map((p, i) => {
                const lesson = track.lessons[i]
                const done = Boolean(completed[lesson.id])
                const major = i === 0 || i === track.pts.length - 1
                return (
                  <g key={lesson.id} className="star-node">
                    <a href={`#/lesson/${lesson.id}`}>
                      <title>{`Plate ${roman(lesson.order)} — ${lesson.title}`}</title>
                      {major && (
                        <path
                          className={`star-sparkle ${done ? 'done' : ''}`}
                          d={`M ${p.x} ${p.y - 13} L ${p.x} ${p.y - 5} M ${p.x} ${p.y + 5} L ${p.x} ${p.y + 13} M ${p.x - 13} ${p.y} L ${p.x - 5} ${p.y} M ${p.x + 5} ${p.y} L ${p.x + 13} ${p.y}`}
                        />
                      )}
                      <circle className="star-hit" cx={p.x} cy={p.y} r={16} />
                      <circle className={`star ${done ? 'done' : ''}`} cx={p.x} cy={p.y} r={major ? 4.6 : 3.4} />
                    </a>
                  </g>
                )
              })}
              <text className="star-label" x={track.pts[0].x - 6} y={track.pts[0].y + 34} textAnchor="start">
                {track.label.toUpperCase()} · PLATES {track.range}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption className="visually-hidden">
        An engraved star chart: every lesson is a star, grouped into three constellations — Beginner (plates 1–10),
        Intermediate (plates 11–21) and Advanced (plates 22–33). Bright brass stars are plates you have completed.
        Follow the stars, or use the curriculum list for the same lessons as text.
      </figcaption>
    </figure>
  )
}

export function trackGlyph(level: Level): { points: [number, number][] } {
  const g = GEOMETRY[level]
  const n = 5
  const pts = constellation(n, 6, 34, 94, 6, 9, g.phase)
  return { points: pts.map((p) => [p.x, p.y] as [number, number]) }
}

export type { Lesson }

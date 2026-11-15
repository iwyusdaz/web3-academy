import { Link, useParams } from 'react-router-dom'
import { getLevelLessons, moduleLessons, trackFor } from '../data/curriculum'
import { useProgress } from '../lib/progress'
import { LessonRow } from '../components/LessonCard'
import { NotFound } from './NotFound'
import { IconArrowLeft } from '../lib/icons'
import type { Level } from '../types'
import { caseStudies } from '../data/caseStudies'

export function Track() {
  const { level } = useParams()
  const { levelProgress } = useProgress()
  if (level !== 'beginner' && level !== 'intermediate' && level !== 'advanced') return <NotFound />
  const track = trackFor(level as Level)
  if (!track) return <NotFound />
  const lessons = getLevelLessons(level as Level)
  const prog = levelProgress(level as Level)
  const relatedCases = caseStudies.filter((c) =>
    c.relatedLessonIds.some((lid) => lessons.some((l) => l.id === lid)),
  )

  return (
    <div className="page wrap narrow-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/learn">
          <IconArrowLeft size={14} /> All tracks
        </Link>
      </nav>
      <header className="page-head track-head">
        <div>
          <h1>The {track.name.toLowerCase()} sky</h1>
          <p className="track-tagline">{track.tagline}</p>
          <p className="page-lead">{track.description}</p>
        </div>
        <div className="track-stat">
          <span className="stat-value tnum">
            {prog.done}/{prog.total}
          </span>
          <span className="stat-label">plates complete</span>
        </div>
      </header>
      <div className={`meridian big ${prog.total > 0 && prog.done === prog.total ? 'full' : ''}`} role="progressbar" aria-valuenow={prog.total ? Math.round((prog.done / prog.total) * 100) : 0} aria-valuemin={0} aria-valuemax={100} aria-label={`${track.name} progress`}>
        <span style={{ width: `${prog.total ? Math.round((prog.done / prog.total) * 100) : 0}%` }} />
      </div>

      {track.modules.map((m) => (
        <section key={m.id} className="module-block" aria-labelledby={m.id}>
          <h2 id={m.id} className="module-title">
            {m.title}
          </h2>
          <p className="module-desc">{m.description}</p>
          <div className="lesson-list">
            {moduleLessons(m).map((l) => (
              <LessonRow key={l.id} lesson={l} />
            ))}
          </div>
        </section>
      ))}

      {relatedCases.length > 0 && (
        <section className="related-cases" aria-labelledby="rc-h">
          <h2 id="rc-h">Case studies touching this track</h2>
          <div className="chip-row">
            {relatedCases.map((c) => (
              <Link key={c.id} to={`/cases/${c.id}`} className="chip-link">
                {c.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

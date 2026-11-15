import { Link } from 'react-router-dom'
import { tracks, moduleLessons } from '../data/curriculum'
import { useProgress } from '../lib/progress'
import { LessonRow } from '../components/LessonCard'
import { IconArrowRight } from '../lib/icons'

export function Learn() {
  const { levelProgress } = useProgress()
  return (
    <div className="page wrap narrow-page">
      <header className="page-head">
        <h1>Curriculum</h1>
        <p>
          Three constellations, nine chart sections, 33 plates. Read in order for the full path, or jump to where
          you are. Each plate: deep reading, key terms, fieldwork, sources and a field check.
        </p>
      </header>
      {tracks.map((t) => {
        const prog = levelProgress(t.level)
        return (
          <section key={t.level} className={`track-section track-${t.level}`} aria-labelledby={`${t.level}-h`}>
            <div className="track-section-head">
              <div>
                <h2 id={`${t.level}-h`}>The {t.name.toLowerCase()} sky</h2>
                <p className="track-tagline">{t.tagline}</p>
              </div>
              <div className="track-section-cta">
                <span className="track-count tnum">
                  {prog.done}/{prog.total} complete
                </span>
                <Link className="btn btn-ghost btn-sm" to={`/learn/${t.level}`}>
                  Open track <IconArrowRight size={14} />
                </Link>
              </div>
            </div>
            <div className={`meridian ${prog.total > 0 && prog.done === prog.total ? 'full' : ''}`} role="progressbar" aria-valuenow={prog.total ? Math.round((prog.done / prog.total) * 100) : 0} aria-valuemin={0} aria-valuemax={100} aria-label={`${t.name} track progress`}>
              <span style={{ width: `${prog.total ? Math.round((prog.done / prog.total) * 100) : 0}%` }} />
            </div>
            {t.modules.map((m) => (
              <div key={m.id} className="module-block">
                <h3 className="module-title">{m.title}</h3>
                <p className="module-desc">{m.description}</p>
                <div className="lesson-list">
                  {moduleLessons(m).map((l) => (
                    <LessonRow key={l.id} lesson={l} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        )
      })}
    </div>
  )
}

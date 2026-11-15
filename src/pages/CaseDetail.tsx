import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { caseStudies } from '../data/caseStudies'
import { getLesson, LEVEL_LABEL } from '../data/curriculum'
import { useProgress } from '../lib/progress'
import { renderInline, Md } from '../lib/markdown'
import { NotFound } from './NotFound'
import { CaseCard, categoryLabel, outcomeLabel, severityLabel } from '../components/CaseCard'
import { cx } from '../lib/utils'
import { IconArrowLeft, IconCheck, IconExternal } from '../lib/icons'

const RESOURCE_TYPE_LABEL: Record<string, string> = {
  docs: 'Docs',
  article: 'Article',
  video: 'Video',
  tool: 'Tool',
  paper: 'Paper',
  course: 'Course',
}

export function CaseDetail() {
  const { id } = useParams()
  const { markCaseStudied, isCaseStudied } = useProgress()
  const cs = caseStudies.find((c) => c.id === id)
  const catNo = cs ? `EX-${String(caseStudies.indexOf(cs) + 1).padStart(2, '0')}` : ''

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!cs) return <NotFound />
  const studied = isCaseStudied(cs.id)
  const relatedLessons = cs.relatedLessonIds
    .map((lid) => getLesson(lid))
    .filter((l): l is NonNullable<typeof l> => Boolean(l))

  return (
    <article className="page wrap narrow-page case-detail">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/cases">
          <IconArrowLeft size={14} /> All case exhibits
        </Link>
      </nav>

      <header className="case-plate-head">
        <div className="cat-line">
          <span className="cat-no tnum">{catNo}</span>
          <span className="k-label" style={{ color: 'var(--star-muted)' }}>
            Case exhibit · {cs.year}
          </span>
        </div>
        <div className="case-badges">
          <span className="meta-chip" style={{ color: 'var(--star-muted)' }}>{categoryLabel[cs.category]}</span>
          <span className={`tag sev-${cs.severity}`}>{severityLabel[cs.severity]}</span>
          <span className={`tag outcome-${cs.outcome}`}>{outcomeLabel[cs.outcome]}</span>
        </div>
        <h1>{cs.title}</h1>
        <p className="case-hook large">{renderInline(cs.hook)}</p>
      </header>

      <section className="case-summary">
        <Md text={cs.summary} />
        <div className="impact-grid">
          {cs.impact.map((row) => (
            <div key={row.label} className="impact-item">
              <span className="impact-value">{row.value}</span>
              <span className="impact-label">{row.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="case-section" aria-labelledby="bg-h">
        <h2 id="bg-h">Background</h2>
        <Md text={cs.background} />
      </section>

      <section className="case-section" aria-labelledby="tl-h">
        <h2 id="tl-h">What happened</h2>
        <ol className="timeline">
          {cs.timeline.map((t, i) => (
            <li key={i} className={cx(t.confidence === 'inferred' && 'inferred')}>
              <span className="timeline-label">{t.label}</span>
              <div className="timeline-body">{renderInline(t.detail)}</div>
            </li>
          ))}
        </ol>
      </section>

      <div className="case-two-col">
        <section className="case-section card paper-2" aria-labelledby="rc-h">
          <h2 id="rc-h">Root causes</h2>
          <ul className="content-list">
            {cs.rootCauses.map((r, i) => (
              <li key={i}>{renderInline(r)}</li>
            ))}
          </ul>
        </section>
        <section className="case-section card paper-2" aria-labelledby="ls-h">
          <h2 id="ls-h">Takeaways</h2>
          <ul className="content-list lessons-list">
            {cs.lessons.map((r, i) => (
              <li key={i}>{renderInline(r)}</li>
            ))}
          </ul>
        </section>
      </div>

      {relatedLessons.length > 0 && (
        <section className="case-section" aria-labelledby="rl-h">
          <h2 id="rl-h">Plates that teach the concepts behind this case</h2>
          <div className="chip-row">
            {relatedLessons.map((l) => (
              <Link key={l.id} to={`/lesson/${l.id}`} className="chip-link lesson-chip">
                <span className="lesson-chip-level">{LEVEL_LABEL[l.level]}</span> {l.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="case-section" aria-labelledby="src-h">
        <h2 id="src-h">Sources &amp; further reading</h2>
        <ul className="resource-list">
          {cs.links.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                <span className="resource-type">{RESOURCE_TYPE_LABEL[r.type] ?? r.type}</span>
                <span className="resource-title">{r.title}</span>
                {r.note && <span className="resource-note">{r.note}</span>}
                <IconExternal size={14} />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="lesson-complete card paper-2">
        <div>
          <h2>Studied this exhibit?</h2>
          <p>Marking it studied counts toward the Case Cracker badge (5 exhibits).</p>
        </div>
        <button
          type="button"
          className={cx('btn btn-lg', studied ? 'btn-ghost' : 'btn-primary')}
          onClick={() => {
            if (!studied) markCaseStudied(cs.id)
          }}
          disabled={studied}
        >
          {studied ? (
            <>
              <IconCheck /> Marked as studied
            </>
          ) : (
            'Mark as studied'
          )}
        </button>
      </div>

      <section className="case-section" aria-labelledby="more-h">
        <h2 id="more-h">More exhibits</h2>
        <div className="case-grid two">
          {caseStudies
            .filter((c) => c.id !== cs.id)
            .slice(0, 2)
            .map((c) => (
              <CaseCard key={c.id} cs={c} index={caseStudies.indexOf(c)} />
            ))}
        </div>
      </section>
    </article>
  )
}

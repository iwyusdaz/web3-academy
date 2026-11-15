import { Link, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { getAdjacent, getLesson, getLevelLessons, trackFor } from '../data/curriculum'
import { caseStudies } from '../data/caseStudies'
import { useProgress, XP_PER_LESSON } from '../lib/progress'
import { renderInline, Md, CodeBlock } from '../lib/markdown'
import { Callout } from '../components/Callout'
import { LevelBadge } from '../components/LevelBadge'
import { Quiz } from '../components/Quiz'
import { NotFound } from './NotFound'
import { cx } from '../lib/utils'
import { IconAlert, IconArrowLeft, IconArrowRight, IconCheck, IconClock, IconExternal, IconFlask, IconTarget } from '../lib/icons'

const RESOURCE_TYPE_LABEL: Record<string, string> = {
  docs: 'Docs',
  article: 'Article',
  video: 'Video',
  tool: 'Tool',
  paper: 'Paper',
  course: 'Course',
}

export function LessonPage() {
  const { id } = useParams()
  const { isLessonComplete, setLessonComplete, isCaseStudied, markCaseStudied, togglePracticeStep, isPracticeComplete, practiceStepDone } =
    useProgress()

  const lesson = id ? getLesson(id) : undefined

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!lesson) return <NotFound />

  const track = trackFor(lesson.level)
  const moduleOf = track?.modules.find((m) => m.lessonIds.includes(lesson.id))
  const { prev, next } = getAdjacent(lesson.id)
  const done = isLessonComplete(lesson.id)
  const relatedCases = caseStudies.filter((c) => c.relatedLessonIds.includes(lesson.id))
  const caseStudied = relatedCases.some((c) => isCaseStudied(c.id))

  return (
    <article className="page wrap lesson-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/learn">Curriculum</Link>
        <span className="sep" aria-hidden="true">/</span>
        <Link to={`/learn/${lesson.level}`}>{track?.name ?? lesson.level}</Link>
        <span className="sep" aria-hidden="true">/</span>
        <span>{moduleOf?.title ?? 'Lesson'}</span>
        <span className="sep" aria-hidden="true">/</span>
        <span className="tnum">Plate {lesson.order}</span>
      </nav>

      <header className="lesson-head">
        <div className="lesson-head-meta">
          <LevelBadge level={lesson.level} />
          <span className="meta-chip">
            <IconClock size={14} /> ~{lesson.minutes} min read
          </span>
          <span className="meta-chip">
            Lesson {lesson.order} of {getLevelLessons(lesson.level).length}
          </span>
        </div>
        <h1>{lesson.title}</h1>
        <p className="page-lead">{renderInline(lesson.subtitle)}</p>
      </header>

      <section className="objectives card" aria-labelledby="obj-h">
        <h2 id="obj-h" className="objectives-title">
          <IconTarget /> What you'll be able to do
        </h2>
        <ul>
          {lesson.objectives.map((o, i) => (
            <li key={i}>{renderInline(o)}</li>
          ))}
        </ul>
      </section>

      {lesson.sections.map((s, i) => (
        <section key={i} className="lesson-section">
          <h2>{s.heading}</h2>
          {s.paragraphs.map((p, j) => (
            <Md key={j} text={p} />
          ))}
          {s.list && (
            <ul className="content-list">
              {s.list.map((item, j) => (
                <li key={j}>{renderInline(item)}</li>
              ))}
            </ul>
          )}
          {s.table && (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    {s.table.headers.map((h, j) => (
                      <th key={j} scope="col">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.table.rows.map((row, j) => (
                    <tr key={j}>
                      {row.map((cell, k) => (
                        <td key={k} data-header={k === 0 ? undefined : s.table?.headers[k]}>
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {s.code && <CodeBlock lang={s.code.lang} code={s.code.code} caption={s.code.caption} />}
          {s.callout && <Callout type={s.callout.type} title={s.callout.title} body={s.callout.body} />}
        </section>
      ))}

      {lesson.keyTerms.length > 0 && (
        <section className="key-terms" aria-labelledby="kt-h">
          <h2 id="kt-h">Legend — key terms</h2>
          <dl className="terms-grid">
            {lesson.keyTerms.map((t) => (
              <div key={t.term} className="term-item">
                <dt>{t.term}</dt>
                <dd>{renderInline(t.definition)}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {lesson.practices.length > 0 && (
        <section className="practices" aria-labelledby="pr-h">
          <h2 id="pr-h">
            <IconFlask /> Fieldwork
          </h2>
          <p className="section-note">
            Hands-on exercises with real tools. Tick each step as you go — finishing every step of a lab earns XP
            in your field log.
          </p>
          {lesson.practices.map((p) => {
            const complete = isPracticeComplete(p.id)
            return (
              <div key={p.id} className={cx('card practice-card paper-2', complete && 'practice-done')}>
                <div className="practice-head">
                  <h3>{p.title}</h3>
                  {complete && (
                    <span className="done-mark">
                      <IconCheck size={14} /> complete
                    </span>
                  )}
                </div>
                <p className="practice-goal">{renderInline(p.goal)}</p>
                {p.caution && (
                  <p className="practice-caution">
                    <IconAlert size={16} />
                    <span>{renderInline(p.caution)}</span>
                  </p>
                )}
                <ol className="practice-steps">
                  {p.steps.map((step, si) => {
                    const checked = practiceStepDone(p.id, si)
                    return (
                      <li key={si}>
                        <label className="step-check">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePracticeStep(p.id, si, p.steps.length)}
                          />
                          <span className="step-mark" aria-hidden="true" />
                          <span>{renderInline(step)}</span>
                        </label>
                      </li>
                    )
                  })}
                </ol>
              </div>
            )
          })}
        </section>
      )}

      {lesson.resources.length > 0 && (
        <section className="lesson-resources" aria-labelledby="res-h">
          <h2 id="res-h">Sources</h2>
          <ul className="resource-list">
            {lesson.resources.map((r) => (
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
      )}

      <Quiz lessonId={lesson.id} questions={lesson.quiz} />

      {relatedCases.length > 0 && (
        <section className="related-cases" aria-labelledby="rc-h">
          <h2 id="rc-h">See this in the real world</h2>
          <div className="chip-row">
            {relatedCases.map((c) => (
              <Link
                key={c.id}
                to={`/cases/${c.id}`}
                className={cx('chip-link', isCaseStudied(c.id) && 'is-done')}
                onClick={() => {
                  if (!isCaseStudied(c.id)) markCaseStudied(c.id)
                }}
              >
                {c.title}
              </Link>
            ))}
          </div>
          {caseStudied && (
            <p className="section-note">
              Case studies opened from a lesson are automatically marked as studied.
            </p>
          )}
        </section>
      )}

      <div className="lesson-complete card paper-2">
        <div>
          <h2>Plate complete?</h2>
          <p>
            Marking this plate complete awards {XP_PER_LESSON} XP and fills its star on the curriculum chart. You
            can unmark it any time.
          </p>
        </div>
        <button
          type="button"
          className={cx('btn btn-lg', done ? 'btn-ghost' : 'btn-primary')}
          onClick={() => setLessonComplete(lesson.id, !done)}
        >
          {done ? (
            <>
              <IconCheck /> Completed — undo?
            </>
          ) : (
            <>
              Mark lesson complete <IconArrowRight size={15} />
            </>
          )}
        </button>
      </div>

      <nav className="lesson-pager" aria-label="Adjacent lessons">
        {prev ? (
          <Link to={`/lesson/${prev.id}`} className="pager-link prev">
            <IconArrowLeft size={15} />
            <span>
              <em>Previous</em>
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link to={`/lesson/${next.id}`} className="pager-link next">
            <span>
              <em>Next lesson</em>
              {next.title}
            </span>
            <IconArrowRight size={15} />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}

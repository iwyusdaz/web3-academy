import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../lib/progress'
import { allLessons, getLesson, tracks, LEVEL_LABEL } from '../data/curriculum'
import type { Lesson, QuizResult } from '../types'
import { ProgressRing } from '../components/ProgressRing'
import { cx, timeAgo } from '../lib/utils'
import { IconArrowRight, IconTrophy } from '../lib/icons'

const TIERS = [
  { min: 0, name: 'Curious newcomer' },
  { min: 200, name: 'Key holder' },
  { min: 600, name: 'Chain reader' },
  { min: 1200, name: 'Contract student' },
  { min: 2000, name: 'Protocol analyst' },
  { min: 3000, name: 'Web3 native' },
]

function tierFor(xp: number) {
  let current = TIERS[0]
  let next: (typeof TIERS)[number] | null = null
  for (let i = 0; i < TIERS.length; i++) {
    if (xp >= TIERS[i].min) {
      current = TIERS[i]
      next = TIERS[i + 1] ?? null
    }
  }
  return { current, next }
}

export function Dashboard() {
  const { xp, badges, counts, state, levelProgress, resetAll } = useProgress()
  const [confirming, setConfirming] = useState(false)
  const { current, next } = tierFor(xp)
  const overall = { done: counts.lessons, total: allLessons.length }
  const quizEntries: { lesson: Lesson; q: QuizResult }[] = Object.entries(state.quizzes)
    .map(([lessonId, q]) => ({ lesson: getLesson(lessonId), q }))
    .filter((e): e is { lesson: Lesson; q: QuizResult } => Boolean(e.lesson))
    .sort((a, b) => b.q.completedAt - a.q.completedAt)
    .slice(0, 6)

  return (
    <div className="page wrap narrow-page">
      <header className="page-head">
        <h1>Field log</h1>
        <p>Your record of the territory covered so far — stored locally in your browser, nothing leaves your device.</p>
      </header>

      <section className="dash-hero card paper-2" aria-labelledby="xp-h">
        <div className="dash-ring">
          <ProgressRing
            value={overall.total ? overall.done / overall.total : 0}
            size={140}
            strokeWidth={10}
            label={`${overall.done}/${overall.total}`}
            sublabel="plates"
          />
        </div>
        <div className="dash-xp" aria-labelledby="xp-h">
          <h2 id="xp-h">
            <span className="xp-num">{xp.toLocaleString()}</span> XP · {current.name}
          </h2>
          <p>
            {next
              ? `${next.min - xp} XP to ${next.name} (${next.min} XP).`
              : 'You have reached the highest tier. Go touch grass — or finish the advanced sky.'}
          </p>
          <div className="dash-facts tnum">
            <div className="fact">
              <strong>{counts.lessons}</strong> plates read
            </div>
            <div className="fact">
              <strong>{counts.practices}</strong> fieldwork done
            </div>
            <div className="fact">
              <strong>{counts.cases}</strong> exhibits studied
            </div>
            <div className="fact">
              <strong>{Object.values(state.quizzes).filter((q) => q.perfect).length}</strong> perfect checks
            </div>
          </div>
        </div>
      </section>

      <section className="dash-tracks" aria-labelledby="tracks-h">
        <h2 id="tracks-h">Constellation progress</h2>
        <div className="dash-track-grid">
          {tracks.map((t) => {
            const prog = levelProgress(t.level)
            const pct = prog.total ? Math.round((prog.done / prog.total) * 100) : 0
            return (
              <Link key={t.level} to={`/learn/${t.level}`} className={cx('card dash-track', `track-${t.level}`)}>
                <div className="dash-track-head">
                  <span className="dash-track-name">{LEVEL_LABEL[t.level]}</span>
                  <span className="dash-track-count">
                    {prog.done}/{prog.total}
                  </span>
                </div>
                <div className={`meridian ${pct >= 100 ? 'full' : ''}`} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${LEVEL_LABEL[t.level]} progress`}>
                  <span style={{ width: `${pct}%` }} />
                </div>
                <span className="track-cta">
                  {pct > 0 && pct < 100 ? 'Continue' : pct === 100 ? 'Review' : 'Start'} <IconArrowRight size={14} />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="dash-badges" aria-labelledby="badges-h">
        <h2 id="badges-h">
          <IconTrophy /> Badges · {badges.filter((b) => b.earned).length}/{badges.length}
        </h2>
        <div className="badge-grid">
          {badges.map((b) => (
            <div key={b.id} className={cx('card badge-card', b.earned && 'earned')}>
              <span className="badge-dot" aria-hidden="true" />
              <h3>{b.title}</h3>
              <p>{b.description}</p>
            </div>
          ))}
        </div>
      </section>

      {quizEntries.length > 0 && (
        <section className="dash-quizzes" aria-labelledby="quiz-h">
          <h2 id="quiz-h">Recent field checks</h2>
          <table className="quiz-table">
            <thead>
              <tr>
                <th scope="col">Lesson</th>
                <th scope="col">Score</th>
                <th scope="col">When</th>
              </tr>
            </thead>
            <tbody>
              {quizEntries.map(({ lesson, q }) => (
                <tr key={lesson.id}>
                  <td>
                    <Link to={`/lesson/${lesson.id}`}>{lesson.title}</Link>
                  </td>
                  <td className={cx(q.perfect && 'perfect-text')}>
                    {q.correct}/{q.total}
                  </td>
                  <td>{timeAgo(q.completedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="dash-reset" aria-labelledby="reset-h">
        <h2 id="reset-h">Start over</h2>
        <p>
          Clears lessons, quizzes, practice steps, case studies, XP and badges from this browser. This cannot be
          undone.
        </p>
        {!confirming ? (
          <button type="button" className="btn btn-danger-ghost" onClick={() => setConfirming(true)}>
            Reset all progress
          </button>
        ) : (
          <div className="confirm-row">
            <span>Are you sure?</span>
            <button type="button" className="btn btn-danger" onClick={() => { resetAll(); setConfirming(false) }}>
              Yes, wipe everything
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setConfirming(false)}>
              Cancel
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

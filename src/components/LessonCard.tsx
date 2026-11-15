import { Link } from 'react-router-dom'
import type { Lesson } from '../types'
import { useProgress } from '../lib/progress'
import { cx, pluralize } from '../lib/utils'
import { renderInline } from '../lib/markdown'
import { IconCheck, IconClock, IconFlask } from '../lib/icons'
import { LevelBadge } from './LevelBadge'

/** Line-state mark: ring = unread, filled check = completed. */
export function StateMark({ done, size = 18 }: { done: boolean; size?: number }) {
  return (
    <span className={`state-mark ${done ? 'state-done' : 'state-open'}`} aria-hidden="true">
      {done ? (
        <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="8" fill="var(--verdigris-fill)" />
          <path d="m5.5 9.5 2.5 2.5 5-5.5" stroke="#f6f2e6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4" strokeDasharray="2.5 3" />
        </svg>
      )}
    </span>
  )
}

export function LessonRow({ lesson, showLevel = false }: { lesson: Lesson; showLevel?: boolean }) {
  const { isLessonComplete } = useProgress()
  const done = isLessonComplete(lesson.id)
  return (
    <Link to={`/lesson/${lesson.id}`} className={cx('lesson-row', done && 'is-done')}>
      <span className="tnum lesson-order">{String(lesson.order).padStart(2, '0')}</span>
      <span className="lesson-row-main">
        <span className="lesson-row-title">
          {lesson.title}
          {showLevel && <LevelBadge level={lesson.level} size="sm" />}
        </span>
        <span className="lesson-row-sub">{renderInline(lesson.subtitle)}</span>
      </span>
      <span className="lesson-row-meta">
        <span className="meta-chip tnum">
          <IconClock size={14} /> {lesson.minutes} min
        </span>
        <span className="meta-chip">
          <IconFlask size={14} /> {pluralize(lesson.practices.length, 'lab')}
        </span>
        <StateMark done={done} />
      </span>
    </Link>
  )
}

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const { isLessonComplete } = useProgress()
  const done = isLessonComplete(lesson.id)
  return (
    <Link to={`/lesson/${lesson.id}`} className={cx('card lesson-card', done && 'is-done')}>
      <div className="lesson-card-top">
        <LevelBadge level={lesson.level} size="sm" />
        {done && (
          <span className="done-mark">
            <IconCheck size={14} /> done
          </span>
        )}
      </div>
      <h3>{lesson.title}</h3>
      <p className="lesson-card-sub">{renderInline(lesson.subtitle)}</p>
      <div className="lesson-card-meta">
        <span className="meta-chip tnum">
          <IconClock size={14} /> {lesson.minutes} min
        </span>
        <span className="meta-chip">
          <IconFlask size={14} /> {pluralize(lesson.practices.length, 'practice')}
        </span>
        <span className="meta-chip tnum">{pluralize(lesson.quiz.length, 'question')}</span>
      </div>
    </Link>
  )
}

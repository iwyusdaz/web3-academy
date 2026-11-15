import { useMemo, useState } from 'react'
import type { QuizQuestion } from '../types'
import { useProgress } from '../lib/progress'
import { cx } from '../lib/utils'
import { IconCheck, IconX } from '../lib/icons'
import { renderInline } from '../lib/markdown'

interface Props {
  lessonId: string
  questions: QuizQuestion[]
}

type Answer = number | null

export function Quiz({ lessonId, questions }: Props) {
  const { recordQuiz } = useProgress()
  const [answers, setAnswers] = useState<Answer[]>(() => questions.map(() => null))
  const [runDone, setRunDone] = useState(false)

  const answered = answers.filter((a) => a !== null).length
  const correctCount = useMemo(
    () =>
      answers.reduce<number>((n, a, i) => (a === questions[i].correctIndex ? n + 1 : n), 0),
    [answers, questions],
  )
  const perfect = runDone && correctCount === questions.length

  const pick = (qi: number, oi: number) => {
    if (answers[qi] !== null) return
    setAnswers((prev) => {
      const next = [...prev]
      next[qi] = oi
      return next
    })
  }

  const finish = () => {
    if (answered < questions.length) return
    setRunDone(true)
    recordQuiz(lessonId, correctCount, questions.length)
  }

  const retry = () => {
    setAnswers(questions.map(() => null))
    setRunDone(false)
  }

  return (
    <section className="quiz" aria-label="Lesson quiz">
      <div className="quiz-head">
        <h2>Field check</h2>
        <span className="quiz-progress">
          {answered}/{questions.length} answered
        </span>
      </div>

      {questions.map((q, qi) => {
        const chosen = answers[qi]
        const isAnswered = chosen !== null
        const isCorrect = chosen === q.correctIndex
        return (
          <div key={q.id} className={cx('quiz-question', isAnswered && (isCorrect ? 'correct' : 'incorrect'))}>
            <h3 className="quiz-prompt">
              <span className="quiz-num">{qi + 1}</span>
              {renderInline(q.prompt)}
            </h3>
            <div className="quiz-options" role="group" aria-label={`Question ${qi + 1} options`}>
              {q.options.map((opt, oi) => {
                const state =
                  !isAnswered
                    ? 'idle'
                    : oi === q.correctIndex
                      ? 'right'
                      : oi === chosen
                        ? 'wrong'
                        : 'dim'
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => pick(qi, oi)}
                    className={cx('quiz-option', `is-${state}`)}
                  >
                    <span className="opt-letter">{String.fromCharCode(65 + oi)}</span>
                    <span className="opt-text">{renderInline(opt)}</span>
                    {state === 'right' && <IconCheck />}
                    {state === 'wrong' && <IconX />}
                  </button>
                )
              })}
            </div>
            {isAnswered && (
              <div className={cx('quiz-explain', isCorrect ? 'ok' : 'no')}>
                <strong>{isCorrect ? 'Correct.' : 'Not quite.'}</strong> {renderInline(q.explanation)}
              </div>
            )}
          </div>
        )
      })}

      <div className="quiz-footer">
        {!runDone ? (
          <button type="button" className="btn btn-primary" disabled={answered < questions.length} onClick={finish}>
            {answered < questions.length
              ? `Answer all questions to finish (${answered}/${questions.length})`
              : `Finish quiz — ${correctCount}/${questions.length} correct`}
          </button>
        ) : (
          <div className={cx('quiz-result', perfect ? 'perfect' : '')}>
            <p className="quiz-score">
              <strong>{correctCount}/{questions.length}</strong>{' '}
              {perfect ? '— perfect. XP bonus earned.' : correctCount >= questions.length / 2 ? '— solid. Re-read what you missed.' : '— worth another pass through the lesson.'}
            </p>
            <button type="button" className="btn btn-ghost" onClick={retry}>
              Retake quiz
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Level, QuizResult } from '../types'
import { allLessons } from '../data/curriculum'

// ── Stored state (persisted to localStorage) ─────────────────────────────────

interface StoredPractice {
  done: number[]
  total: number
}

export interface StoredState {
  lessons: Record<string, boolean>
  quizzes: Record<string, QuizResult>
  practices: Record<string, StoredPractice>
  cases: Record<string, number>
}

const STORAGE_KEY = 'web3-academy-v1'

const emptyState: StoredState = { lessons: {}, quizzes: {}, practices: {}, cases: {} }

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState
    const parsed = JSON.parse(raw) as Partial<StoredState>
    return {
      lessons: parsed.lessons ?? {},
      quizzes: parsed.quizzes ?? {},
      practices: parsed.practices ?? {},
      cases: parsed.cases ?? {},
    }
  } catch {
    return emptyState
  }
}

// ── XP & badges (derived from state — no double-counting possible) ──────────

export const XP_PER_LESSON = 100
export const XP_PER_QUIZ_CORRECT = 10
export const XP_PERFECT_BONUS = 25
export const XP_PER_PRACTICE = 25

export interface BadgeDef {
  id: string
  title: string
  description: string
  earned: boolean
}

function computeBadges(state: StoredState): BadgeDef[] {
  const completedCount = Object.values(state.lessons).filter(Boolean).length
  const byLevel = (level: Level) =>
    allLessons.filter((l) => l.level === level).filter((l) => state.lessons[l.id]).length
  const totals = {
    beginner: allLessons.filter((l) => l.level === 'beginner').length,
    intermediate: allLessons.filter((l) => l.level === 'intermediate').length,
    advanced: allLessons.filter((l) => l.level === 'advanced').length,
  }
  const practiceDone = Object.values(state.practices).filter((p) => p.done.length >= p.total && p.total > 0).length
  const casesStudied = Object.keys(state.cases).length
  const perfects = Object.values(state.quizzes).filter((q) => q.perfect).length

  return [
    {
      id: 'first-lesson',
      title: 'First Steps',
      description: 'Complete your first lesson.',
      earned: completedCount >= 1,
    },
    {
      id: 'beginner-grad',
      title: 'Foundations Forged',
      description: 'Complete the entire Beginner track.',
      earned: totals.beginner > 0 && byLevel('beginner') >= totals.beginner,
    },
    {
      id: 'intermediate-grad',
      title: "Builder's Insight",
      description: 'Complete the entire Intermediate track.',
      earned: totals.intermediate > 0 && byLevel('intermediate') >= totals.intermediate,
    },
    {
      id: 'advanced-grad',
      title: 'Protocol Master',
      description: 'Complete the entire Advanced track.',
      earned: totals.advanced > 0 && byLevel('advanced') >= totals.advanced,
    },
    {
      id: 'perfect-quiz',
      title: 'Flawless',
      description: 'Score 100% on any lesson quiz.',
      earned: perfects >= 1,
    },
    {
      id: 'practice-pro',
      title: 'Hands On',
      description: 'Finish 5 practice labs.',
      earned: practiceDone >= 5,
    },
    {
      id: 'case-cracker',
      title: 'Case Cracker',
      description: 'Study 5 case studies.',
      earned: casesStudied >= 5,
    },
    {
      id: 'half-way',
      title: 'Committed',
      description: 'Complete 15 lessons.',
      earned: completedCount >= 15,
    },
    {
      id: 'full-academy',
      title: 'Full Academy',
      description: 'Complete every lesson in all three tracks.',
      earned: allLessons.length > 0 && completedCount >= allLessons.length,
    },
  ]
}

// ── Context ──────────────────────────────────────────────────────────────────

interface ProgressApi {
  state: StoredState
  xp: number
  badges: BadgeDef[]
  isLessonComplete(id: string): boolean
  setLessonComplete(id: string, done: boolean): void
  recordQuiz(lessonId: string, correct: number, total: number): void
  togglePracticeStep(practiceId: string, stepIndex: number, total: number): void
  isPracticeComplete(practiceId: string): boolean
  practiceStepDone(practiceId: string, stepIndex: number): boolean
  markCaseStudied(id: string): void
  isCaseStudied(id: string): boolean
  levelProgress(level: Level): { done: number; total: number }
  counts: { lessons: number; practices: number; cases: number }
  resetAll(): void
}

const ProgressContext = createContext<ProgressApi | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(() => loadState())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage unavailable (private mode) — progress simply won't persist
    }
  }, [state])

  const setLessonComplete = useCallback((id: string, done: boolean) => {
    setState((s) => ({ ...s, lessons: { ...s.lessons, [id]: done } }))
  }, [])

  const recordQuiz = useCallback((lessonId: string, correct: number, total: number) => {
    setState((s) => {
      const prev = s.quizzes[lessonId]
      const next: QuizResult = {
        correct,
        total,
        perfect: correct === total,
        completedAt: Date.now(),
      }
      // Keep the better score (more correct, tie-break on newer).
      const better = !prev || correct > prev.correct || (correct === prev.correct && next.perfect && !prev.perfect)
      if (!better) return s
      return { ...s, quizzes: { ...s.quizzes, [lessonId]: next } }
    })
  }, [])

  const togglePracticeStep = useCallback((practiceId: string, stepIndex: number, total: number) => {
    setState((s) => {
      const current = s.practices[practiceId] ?? { done: [], total }
      const done = current.done.includes(stepIndex)
        ? current.done.filter((i) => i !== stepIndex)
        : [...current.done, stepIndex].sort((a, b) => a - b)
      return { ...s, practices: { ...s.practices, [practiceId]: { done, total } } }
    })
  }, [])

  const markCaseStudied = useCallback((id: string) => {
    setState((s) => ({ ...s, cases: { ...s.cases, [id]: Date.now() } }))
  }, [])

  const resetAll = useCallback(() => setState(emptyState), [])

  const api = useMemo<ProgressApi>(() => {
    const badges = computeBadges(state)
    const xp =
      Object.values(state.lessons).filter(Boolean).length * XP_PER_LESSON +
      Object.values(state.quizzes).reduce((sum, q) => sum + q.correct * XP_PER_QUIZ_CORRECT, 0) +
      Object.values(state.quizzes).filter((q) => q.perfect).length * XP_PERFECT_BONUS +
      Object.values(state.practices).filter((p) => p.total > 0 && p.done.length >= p.total).length *
        XP_PER_PRACTICE

    return {
      state,
      xp,
      badges,
      isLessonComplete: (id) => Boolean(state.lessons[id]),
      setLessonComplete,
      recordQuiz,
      togglePracticeStep,
      isPracticeComplete: (practiceId) => {
        const p = state.practices[practiceId]
        return Boolean(p && p.total > 0 && p.done.length >= p.total)
      },
      practiceStepDone: (practiceId, stepIndex) => {
        const p = state.practices[practiceId]
        return Boolean(p && p.done.includes(stepIndex))
      },
      markCaseStudied,
      isCaseStudied: (id) => Boolean(state.cases[id]),
      levelProgress: (level) => {
        const levelLessons = allLessons.filter((l) => l.level === level)
        return {
          done: levelLessons.filter((l) => state.lessons[l.id]).length,
          total: levelLessons.length,
        }
      },
      counts: {
        lessons: Object.values(state.lessons).filter(Boolean).length,
        practices: Object.values(state.practices).filter((p) => p.total > 0 && p.done.length >= p.total).length,
        cases: Object.keys(state.cases).length,
      },
      resetAll,
    }
  }, [state, setLessonComplete, recordQuiz, togglePracticeStep, markCaseStudied, resetAll])

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressApi {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}

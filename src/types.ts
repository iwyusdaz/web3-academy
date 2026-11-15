// ── Web3 Academy content schema ──────────────────────────────────────────────
// Single source of truth for all content files in src/data/.

export type Level = 'beginner' | 'intermediate' | 'advanced'

export interface Resource {
  title: string
  url: string
  type: 'docs' | 'article' | 'video' | 'tool' | 'paper' | 'course'
  note?: string
}

export interface QuizQuestion {
  id: string
  prompt: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface Practice {
  id: string
  title: string
  goal: string
  /** Each step is a checkbox the learner ticks off. */
  steps: string[]
  /** Warned/optional notes, e.g. testnet-only warnings. */
  caution?: string
}

export interface Callout {
  type: 'tip' | 'warning' | 'deep-dive'
  title: string
  body: string
}

export interface LessonSection {
  heading: string
  /** Paragraphs. Inline markdown subset: **bold**, *italic*, `code`, [text](url). */
  paragraphs: string[]
  list?: string[]
  table?: { headers: string[]; rows: string[][] }
  code?: { lang: string; code: string; caption?: string }
  callout?: Callout
}

export interface KeyTerm {
  term: string
  definition: string
}

export interface Lesson {
  id: string
  level: Level
  /** Lesson number within the level, 1-based, defines ordering. */
  order: number
  title: string
  subtitle: string
  /** Estimated minutes to read. */
  minutes: number
  objectives: string[]
  sections: LessonSection[]
  keyTerms: KeyTerm[]
  practices: Practice[]
  resources: Resource[]
  quiz: QuizQuestion[]
}

export interface Module {
  id: string
  level: Level
  title: string
  description: string
  lessonIds: string[]
}

export interface Track {
  level: Level
  name: string
  tagline: string
  description: string
  modules: Module[]
}

export type CaseCategory = 'security' | 'economics' | 'governance' | 'infrastructure' | 'defi'
export type Severity = 'low' | 'medium' | 'high' | 'critical'

export interface CaseStudy {
  id: string
  title: string
  /** One-line hook, e.g. "How 3.6M ETH vanished in one weekend". */
  hook: string
  category: CaseCategory
  /** Outcome tone: what this case teaches. */
  outcome: 'failure' | 'breakthrough' | 'contested'
  year: string
  severity: Severity
  summary: string
  background: string
  /** Chronological narrative beats. Entries with disputed or varied reporting
   * are marked confidence: 'inferred' and render as lighter provenance hairlines. */
  timeline: { label: string; detail: string; confidence?: 'established' | 'inferred' }[]
  rootCauses: string[]
  impact: { label: string; value: string }[]
  lessons: string[]
  relatedLessonIds: string[]
  links: Resource[]
}

export interface GlossaryTerm {
  term: string
  definition: string
  category: 'core' | 'security' | 'defi' | 'technology' | 'economics' | 'culture'
  /** Optional related lesson ids. */
  related?: string[]
}

/** Quiz result per lesson, stored in progress. */
export interface QuizResult {
  correct: number
  total: number
  /** True when the learner answered every question correctly in one run. */
  perfect: boolean
  completedAt: number
}

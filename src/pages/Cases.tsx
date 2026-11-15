import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { caseStudies } from '../data/caseStudies'
import { categoryLabel, outcomeLabel, severityLabel } from '../components/CaseCard'
import { useProgress } from '../lib/progress'
import { cx } from '../lib/utils'
import { IconArrowRight } from '../lib/icons'
import type { CaseCategory } from '../types'

const FILTERS: (CaseCategory | 'all')[] = ['all', 'security', 'economics', 'governance', 'infrastructure', 'defi']

export function Cases() {
  const [filter, setFilter] = useState<CaseCategory | 'all'>('all')
  const { isCaseStudied } = useProgress()
  const shown = useMemo(() => (filter === 'all' ? caseStudies : caseStudies.filter((c) => c.category === filter)), [filter])

  return (
    <div className="page wrap">
      <header className="page-head">
        <h1>The case exhibits</h1>
        <p>
          Real events that shaped how Web3 works today — exploits, collapses, breakthroughs and courtrooms, each
          catalogued and structured for study: background, timeline, root causes, impact and takeaways.{' '}
          {caseStudies.length} exhibits, in chronological order.
        </p>
      </header>
      <div className="chip-row" aria-label="Filter case studies by category">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            className={cx('chip-link as-button', filter === f && 'active')}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : categoryLabel[f]}
          </button>
        ))}
      </div>
      <div className="case-rows" style={{ marginTop: 28 }}>
        {shown.map((c) => {
          const idx = caseStudies.indexOf(c)
          return (
            <Link to={`/cases/${c.id}`} key={c.id} className="case-row">
              <span className="case-cat-no tnum">
                EX-{String(idx + 1).padStart(2, '0')} · {c.year}
              </span>
              <div className="case-row-main">
                <h3>{c.title}</h3>
                <p className="case-hook">{c.hook}</p>
              </div>
              <div className="case-row-side">
                <span className={`tag sev-${c.severity}`}>{severityLabel[c.severity]}</span>
                <span className={`tag outcome-${c.outcome}`}>{outcomeLabel[c.outcome]}</span>
                {isCaseStudied(c.id) && <span className="done-mark">studied</span>}
                <span className="row-arrow">
                  <IconArrowRight size={15} />
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

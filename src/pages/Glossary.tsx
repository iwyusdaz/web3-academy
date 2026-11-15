import { useMemo, useState } from 'react'
import { glossaryTerms } from '../data/glossary'
import { renderInline } from '../lib/markdown'
import { cx } from '../lib/utils'
import type { GlossaryTerm } from '../types'

const CATEGORIES: (GlossaryTerm['category'] | 'all')[] = ['all', 'core', 'security', 'defi', 'technology', 'economics', 'culture']

const CAT_LABEL: Record<GlossaryTerm['category'], string> = {
  core: 'Core',
  security: 'Security',
  defi: 'DeFi',
  technology: 'Technology',
  economics: 'Economics',
  culture: 'Culture',
}

export function Glossary() {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<GlossaryTerm['category'] | 'all'>('all')

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return glossaryTerms
      .filter((t) => (cat === 'all' ? true : t.category === cat))
      .filter((t) => (q ? t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q) : true))
      .sort((a, b) => a.term.localeCompare(b.term))
  }, [query, cat])

  return (
    <div className="page wrap narrow-page">
      <header className="page-head">
        <h1>Glossary</h1>
        <p>
          {glossaryTerms.length} terms you'll meet across the tracks — precise definitions, no hand-waving.
          Jargon is culture, not understanding.
        </p>
      </header>
      <div className="glossary-controls">
        <div className="search-input-row inline">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter terms…"
            aria-label="Filter glossary terms"
          />
        </div>
        <div className="chip-row" aria-label="Filter glossary by category">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              className={cx('chip-link as-button', cat === c && 'active')}
              onClick={() => setCat(c)}
            >
              {c === 'all' ? 'All' : CAT_LABEL[c]}
            </button>
          ))}
        </div>
      </div>
      <p className="section-note" aria-live="polite">
        Showing {shown.length} of {glossaryTerms.length} terms
      </p>
      <dl className="glossary-list">
        {shown.map((t) => (
          <div key={t.term} className="glossary-item">
            <div className="glossary-term-head">
              <dt>{t.term}</dt>
              <span className="tag">{CAT_LABEL[t.category]}</span>
            </div>
            <dd>{renderInline(t.definition)}</dd>
          </div>
        ))}
      </dl>
      {shown.length === 0 && <p className="search-empty-inline">No terms match — try a shorter filter.</p>}
    </div>
  )
}

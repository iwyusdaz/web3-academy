import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { allLessons } from '../data/curriculum'
import { caseStudies } from '../data/caseStudies'
import { glossaryTerms } from '../data/glossary'
import { LEVEL_LABEL } from '../data/curriculum'
import { cx } from '../lib/utils'
import { IconBook, IconFile, IconSearch } from '../lib/icons'

interface Hit {
  kind: 'lesson' | 'case' | 'glossary'
  id: string
  title: string
  detail: string
  href: string
}

function buildIndex(): Hit[] {
  const lessons: Hit[] = allLessons.map((l) => ({
    kind: 'lesson',
    id: l.id,
    title: l.title,
    detail: `${LEVEL_LABEL[l.level]} · Lesson ${l.order} — ${l.subtitle}`,
    href: `/lesson/${l.id}`,
  }))
  const cases: Hit[] = caseStudies.map((c) => ({
    kind: 'case',
    id: c.id,
    title: c.title,
    detail: `Case study · ${c.year} — ${c.hook}`,
    href: `/cases/${c.id}`,
  }))
  const terms: Hit[] = glossaryTerms.map((g) => ({
    kind: 'glossary',
    id: g.term.toLowerCase(),
    title: g.term,
    detail: `${g.definition.slice(0, 110)}${g.definition.length > 110 ? '…' : ''}`,
    href: `/glossary`,
  }))
  return [...lessons, ...cases, ...terms]
}

function matches(h: Hit, q: string): boolean {
  return h.title.toLowerCase().includes(q) || h.detail.toLowerCase().includes(q)
}

const KIND_LABEL = { lesson: 'Lesson', case: 'Case study', glossary: 'Glossary' } as const

export function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const index = useMemo(buildIndex, [])
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return index.filter((h) => matches(h, q)).slice(0, 12)
  }, [index, query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    setActive(0)
  }, [query])

  const choose = (hit: Hit) => {
    navigate(hit.href)
    onClose()
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    }
    if (e.key === 'Enter' && results[active]) {
      choose(results[active])
    }
  }

  const kindIcon = (kind: Hit['kind']) =>
    kind === 'lesson' ? <IconBook size={16} /> : kind === 'case' ? <IconFile size={16} /> : <IconSearch size={16} />

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="search-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Search the academy"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKey}
      >
        <div className="search-input-row">
          <IconSearch />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, case studies, glossary…"
            aria-label="Search query"
          />
          <kbd>Esc</kbd>
        </div>
        {query.trim() === '' ? (
          <div className="search-empty">
            <p>Try “gas”, “reentrancy”, “Terra”, “rollup”, “seed phrase”…</p>
          </div>
        ) : results.length === 0 ? (
          <div className="search-empty">
            <p>No results for “{query}”.</p>
          </div>
        ) : (
          <ul className="search-results" role="listbox">
            {results.map((hit, i) => (
              <li key={`${hit.kind}-${hit.id}`} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  className={cx('search-hit', i === active && 'active')}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(hit)}
                >
                  <span className="hit-icon">{kindIcon(hit.kind)}</span>
                  <span className="hit-text">
                    <span className="hit-title">{hit.title}</span>
                    <span className="hit-detail">{hit.detail}</span>
                  </span>
                  <span className="hit-kind">{KIND_LABEL[hit.kind]}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="search-hint">
          <kbd>↑</kbd> <kbd>↓</kbd> navigate · <kbd>Enter</kbd> open
        </div>
      </div>
    </div>
  )
}

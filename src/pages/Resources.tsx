import { resourceGroups } from '../data/resources'
import { IconExternal } from '../lib/icons'

const TYPE_LABEL: Record<string, string> = {
  docs: 'Docs',
  article: 'Article',
  video: 'Video',
  tool: 'Tool',
  paper: 'Paper',
  course: 'Course',
}

export function Resources() {
  return (
    <div className="page wrap">
      <header className="page-head">
        <h1>Resource hub</h1>
        <p>
          Curated external links that pair with the curriculum — official docs, post-mortems, practice
          platforms and data tools. Prefer primary sources; this page points at them, not at summaries.
        </p>
      </header>
      {resourceGroups.map((g) => (
        <section key={g.id} className="resource-group" aria-labelledby={g.id}>
          <h2 id={g.id}>{g.title}</h2>
          <p className="module-desc">{g.description}</p>
          <ul className="resource-list">
            {g.items.map((r) => (
              <li key={r.url}>
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                  <span className="resource-type">{TYPE_LABEL[r.type] ?? r.type}</span>
                  <span className="resource-title">{r.title}</span>
                  {r.note && <span className="resource-note">{r.note}</span>}
                  <IconExternal size={14} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

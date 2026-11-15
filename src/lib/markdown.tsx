import type { ReactNode } from 'react'

// Minimal inline-markdown renderer supporting exactly the subset used by content
// authors: **bold**, *italic*, `code`, [text](url). Nothing else is interpreted.

const INLINE_RE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g

export function renderInline(text: string): ReactNode[] {
  const parts = text.split(INLINE_RE)
  return parts.map((part, i) => {
    if (!part) return null
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="inline-code">{part.slice(1, -1)}</code>
    }
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part)
    if (link) {
      return (
        <a key={i} href={link[2]} target="_blank" rel="noopener noreferrer" className="text-link">
          {link[1]}
        </a>
      )
    }
    return <span key={i}>{part}</span>
  })
}

/** Paragraph convenience: inline rendering inside a <p>. */
export function Md({ text }: { text: string }) {
  return <p>{renderInline(text)}</p>
}

export function CodeBlock({ lang, code, caption }: { lang: string; code: string; caption?: string }) {
  return (
    <figure className="code-block">
      <div className="code-head">
        <span className="code-lang">{lang}</span>
        <button
          type="button"
          className="code-copy"
          onClick={() => {
            void navigator.clipboard?.writeText(code)
          }}
          aria-label="Copy code to clipboard"
        >
          Copy
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
      {caption && <figcaption className="code-caption">{caption}</figcaption>}
    </figure>
  )
}

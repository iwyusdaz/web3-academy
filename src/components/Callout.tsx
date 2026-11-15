import { renderInline } from '../lib/markdown'
import { IconAlert, IconBulb, IconZoom } from '../lib/icons'

export function Callout({
  type,
  title,
  body,
}: {
  type: 'tip' | 'warning' | 'deep-dive'
  title: string
  body: string
}) {
  const icon = type === 'tip' ? <IconBulb /> : type === 'warning' ? <IconAlert /> : <IconZoom />
  return (
    <aside className={`callout callout-${type}`}>
      <div className="callout-head">
        {icon}
        <span className="callout-title">{title}</span>
        <span className="callout-kind">{type === 'deep-dive' ? 'Deep dive' : type === 'tip' ? 'Tip' : 'Warning'}</span>
      </div>
      <div className="callout-body">{renderInline(body)}</div>
    </aside>
  )
}

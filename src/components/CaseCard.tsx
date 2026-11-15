import { Link } from 'react-router-dom'
import type { CaseStudy, Severity } from '../types'
import { useProgress } from '../lib/progress'
import { cx } from '../lib/utils'
import { renderInline } from '../lib/markdown'
import { IconCheck } from '../lib/icons'

export const severityLabel: Record<Severity, string> = {
  low: 'Low impact',
  medium: 'Notable',
  high: 'Severe',
  critical: 'Critical',
}

export const categoryLabel: Record<CaseStudy['category'], string> = {
  security: 'Security',
  economics: 'Economics',
  governance: 'Governance',
  infrastructure: 'Infrastructure',
  defi: 'DeFi',
}

export const outcomeLabel: Record<CaseStudy['outcome'], string> = {
  failure: 'Failure',
  breakthrough: 'Breakthrough',
  contested: 'Contested',
}

export function CaseCard({ cs, index }: { cs: CaseStudy; index: number }) {
  const { isCaseStudied } = useProgress()
  const studied = isCaseStudied(cs.id)
  return (
    <Link to={`/cases/${cs.id}`} className={cx('card case-card', studied && 'is-done')}>
      <div className="case-card-top">
        <span className="case-year tnum">
          EX-{String(index + 1).padStart(2, '0')} · {cs.year}
        </span>
        <span className={`tag sev-${cs.severity}`}>{severityLabel[cs.severity]}</span>
        {studied && (
          <span className="done-mark">
            <IconCheck size={14} /> studied
          </span>
        )}
      </div>
      <h3>{cs.title}</h3>
      <p className="case-hook">{renderInline(cs.hook)}</p>
      <div className="case-card-foot">
        <span className="tag">{categoryLabel[cs.category]}</span>
        <span className={`tag outcome-${cs.outcome}`}>{outcomeLabel[cs.outcome]}</span>
      </div>
    </Link>
  )
}

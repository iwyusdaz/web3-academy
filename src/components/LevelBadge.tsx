import { cx } from '../lib/utils'

export function LevelBadge({ level, size = 'md' }: { level: 'beginner' | 'intermediate' | 'advanced'; size?: 'sm' | 'md' }) {
  return (
    <span className={cx('level-badge', `lvl-${level}`, size === 'sm' && 'sm')}>
      {level === 'beginner' ? 'Beginner' : level === 'intermediate' ? 'Intermediate' : 'Advanced'}
    </span>
  )
}

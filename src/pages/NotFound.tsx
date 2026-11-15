import { Link } from 'react-router-dom'
import { IconArrowRight } from '../lib/icons'

export function NotFound() {
  return (
    <div className="page wrap narrow-page notfound">
      <h1>This block doesn't exist</h1>
      <p className="page-lead">
        The page you tried to reach was never mined — 404. Head back to the curriculum or the home page.
      </p>
      <div className="hero-actions">
        <Link to="/" className="btn btn-primary">
          Home <IconArrowRight size={15} />
        </Link>
        <Link to="/learn" className="btn btn-ghost">
          Curriculum
        </Link>
      </div>
    </div>
  )
}

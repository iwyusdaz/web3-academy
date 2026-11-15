import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { cx } from '../lib/utils'
import { IconMenu, IconSearch, IconX, LogoMark } from '../lib/icons'
import { SearchModal } from './SearchModal'

const NAV = [
  { to: '/learn', label: 'Learn' },
  { to: '/cases', label: 'Case studies' },
  { to: '/glossary', label: 'Glossary' },
  { to: '/resources', label: 'Resources' },
  { to: '/progress', label: 'Progress' },
]

export function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="site">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="wrap header-row">
          <Link to="/" className="brand" aria-label="Web3 Academy home">
            <LogoMark />
            <span className="brand-name">
              Web3<span className="brand-accent">Academy</span>
            </span>
          </Link>
          <nav className="main-nav" aria-label="Main navigation">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => cx('nav-link', isActive && 'active')}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button type="button" className="search-btn" onClick={() => setSearchOpen(true)}>
              <IconSearch />
              <span>Search</span>
              <kbd>⌘K</kbd>
            </button>
            <button
              type="button"
              className="icon-btn menu-toggle"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <IconX /> : <IconMenu />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="mobile-nav wrap" aria-label="Mobile navigation">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => cx('nav-link', isActive && 'active')}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main id="main">{children}</main>

      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div className="footer-brand">
            <div className="brand">
              <LogoMark size={24} />
              <span className="brand-name">
                Web3<span className="brand-accent">Academy</span>
              </span>
            </div>
            <p>
              A free, self-paced atlas for learning Web3 in depth — 33 plates of deep reading and fieldwork, 10
              case exhibits and a lexicon, with your progress saved in your browser. No signup, no tracking.
            </p>
          </div>
          <div className="footer-col">
            <h3>Learn</h3>
            <Link to="/learn/beginner">Beginner track</Link>
            <Link to="/learn/intermediate">Intermediate track</Link>
            <Link to="/learn/advanced">Advanced track</Link>
            <Link to="/glossary">Glossary</Link>
          </div>
          <div className="footer-col">
            <h3>Explore</h3>
            <Link to="/cases">Case studies</Link>
            <Link to="/resources">Resource hub</Link>
            <Link to="/progress">Your progress</Link>
          </div>
        </div>
        <div className="wrap footer-legal">
          <p>
            Educational content only — nothing here is financial advice. Practice on testnets; the lessons will
            tell you the same thing again.
          </p>
        </div>
      </footer>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </div>
  )
}

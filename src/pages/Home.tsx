import { Link } from 'react-router-dom'
import { tracks, levelMeta } from '../data/curriculum'
import { caseStudies } from '../data/caseStudies'
import { glossaryTerms } from '../data/glossary'
import { useProgress } from '../lib/progress'
import { StarMap, trackGlyph } from '../components/StarMap'
import { IconArrowRight, IconBook, IconFlask, IconShield, IconTrophy } from '../lib/icons'
import type { Level } from '../types'

function TrackGlyph({ level }: { level: Level }) {
  const { points } = trackGlyph(level)
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
  return (
    <svg className="track-glyph" width="100" height="40" viewBox="0 0 100 40" aria-hidden="true">
      <path d={d} fill="none" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={i === 4 ? 3.4 : 2.2} className={i === 4 ? 'glyph-major' : undefined} />
      ))}
    </svg>
  )
}

export function Home() {
  const { levelProgress, xp, counts } = useProgress()
  const startedAny = counts.lessons > 0
  const completedMap = useProgress().state.lessons
  const featured = caseStudies.slice(0, 5)

  return (
    <div className="page home-page" style={{ paddingTop: 0 }}>
      <section className="hero" data-enter>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1>
              Master Web3, from your first wallet to <span className="plate-ref">protocol internals.</span>
            </h1>
            <p className="standfirst">
              A free, self-paced atlas of the decentralized stack: 33 engraved plates of deep reading, fieldwork
              with real tools on testnets, and ten case exhibits — from The DAO to the AI-agent economy. No
              account, no tracking; your progress lives in your browser.
            </p>
            <p className="index-line tnum">
              <span className="item">
                <strong>33</strong> plates
              </span>
              <span className="item">
                <strong>3</strong> constellations
              </span>
              <span className="item">
                <strong>{caseStudies.length}</strong> case exhibits
              </span>
              <span className="item">
                <strong>{glossaryTerms.length}</strong> lexicon entries
              </span>
            </p>
            <div className="hero-actions">
              <Link className="btn btn-primary btn-lg" to={startedAny ? '/learn' : '/lesson/what-is-web3'}>
                {startedAny ? 'Continue where you stopped' : 'Begin Plate I — From Web1 to Web3'} <IconArrowRight />
              </Link>
              <Link className="btn btn-ghost btn-lg" to="/cases">
                Study the case exhibits
              </Link>
            </div>
          </div>
          <div className="hero-plate">
            <StarMap completed={completedMap} />
            <div className="plate-caption">
              <span className="k-label">The curriculum chart · Plates I–XXXIII</span>
              <span className="caption-tracks" aria-hidden="true">
                Beginner · Intermediate · Advanced
              </span>
              <span className="plate-legend">
                <span className="plate-legend-item">
                  <span className="plate-legend-dot done" /> completed
                </span>
                <span className="plate-legend-item">
                  <span className="plate-legend-dot unread" /> unread
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="why-h">
        <div className="wrap">
          <h2 id="why-h">Built for understanding, not buzzwords</h2>
          <div className="ruled-grid">
            <div className="ruled-cell">
              <span className="ruled-mark"><IconBook /></span>
              <div>
                <h3>Learn in depth</h3>
                <p>
                  Every plate explains mechanisms, not slogans — how gas is metered, how an AMM prices a swap, why
                  a rollup can't simply be trusted. Worked numbers, tables and code throughout.
                </p>
              </div>
            </div>
            <div className="ruled-cell">
              <span className="ruled-mark"><IconFlask /></span>
              <div>
                <h3>Practice with real tools</h3>
                <p>
                  Fieldwork in every lesson: install a wallet, use a faucet, deploy in Remix, read a transaction on
                  Etherscan, test an invariant in Foundry. Testnet first, always.
                </p>
              </div>
            </div>
            <div className="ruled-cell">
              <span className="ruled-mark"><IconShield /></span>
              <div>
                <h3>Study real failures</h3>
                <p>
                  The case exhibits — The DAO, Ronin, Terra/LUNA, FTX — teach what screenshots can't: how systems
                  actually break, and what that means for you.
                </p>
              </div>
            </div>
            <div className="ruled-cell">
              <span className="ruled-mark"><IconTrophy /></span>
              <div>
                <h3>Record your progress</h3>
                <p>
                  A field check closes every plate; the field log keeps your XP, marks and badges. All of it stored
                  locally — nothing leaves your device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="tracks-h">
        <div className="wrap">
          <h2 id="tracks-h">Three constellations, one sky</h2>
          <p className="section-head" style={{ marginBottom: 24 }}>
            Each track ends where the next begins. Complete all three and you can reason about protocols like a
            builder.
          </p>
          <div className="track-rows">
            {tracks.map((t) => {
              const meta = levelMeta[t.level]
              const prog = levelProgress(t.level)
              const pct = prog.total ? prog.done / prog.total : 0
              return (
                <Link to={`/learn/${t.level}`} key={t.level} className="track-row">
                  <TrackGlyph level={t.level} />
                  <div className="track-row-main">
                    <h3>
                      {meta.name} <em>{meta.tagline}</em>
                    </h3>
                    <p>{meta.blurb}</p>
                    <div
                      className={`meridian ${pct >= 1 ? 'full' : ''}`}
                      role="progressbar"
                      aria-valuenow={Math.round(pct * 100)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${meta.name} track progress`}
                    >
                      <span style={{ width: `${Math.round(pct * 100)}%` }} />
                    </div>
                  </div>
                  <div className="track-row-side">
                    <span className="track-count tnum">
                      {prog.done}/{prog.total} plates
                    </span>
                    <span className="track-cta">
                      {pct > 0 ? 'Continue' : 'Open track'} <IconArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="cases-h">
        <div className="wrap">
          <h2 id="cases-h">The case exhibits</h2>
          <p className="section-head" style={{ marginBottom: 24 }}>
            Exploits, collapses, breakthroughs and courtrooms — each exhibit structured for study: background,
            timeline, root causes, impact, takeaways.
          </p>
          <div className="case-rows">
            {featured.map((c, i) => (
              <Link to={`/cases/${c.id}`} key={c.id} className="case-row">
                <span className="case-cat-no tnum">
                  EX-{String(i + 1).padStart(2, '0')} · {c.year}
                </span>
                <div className="case-row-main">
                  <h3>{c.title}</h3>
                  <p className="case-hook">{c.hook}</p>
                </div>
                <div className="case-row-side">
                  <span className={`tag outcome-${c.outcome}`}>{c.outcome}</span>
                  <span className="row-arrow"><IconArrowRight size={15} /></span>
                </div>
              </Link>
            ))}
          </div>
          <p className="center-cta">
            <Link className="btn btn-ghost" to="/cases">
              All {caseStudies.length} exhibits <IconArrowRight size={15} />
            </Link>
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="how-h">
        <div className="wrap">
          <h2 id="how-h">How the academy works</h2>
          <ol className="how-steps">
            <li>
              <h3>Pick your constellation</h3>
              <p>
                Complete beginner? Start at Plate I. Web2 developer? Jump straight to the Intermediate sky.
              </p>
            </li>
            <li>
              <h3>Read, then do</h3>
              <p>
                Each plate pairs deep reading with fieldwork that has you use real tools on a testnet.
              </p>
            </li>
            <li>
              <h3>Pass the field check</h3>
              <p>
                Four questions with explanations close every plate. XP, marks and badges keep the record.
              </p>
            </li>
          </ol>
          {xp > 0 && (
            <p className="xp-note">
              Your field log stands at <strong className="tnum">{xp.toLocaleString()} XP</strong> — the next plate
              is waiting.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

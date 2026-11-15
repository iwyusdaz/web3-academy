# Web3 Academy

A free, self-contained web app for learning **Web3 in depth** — from your first wallet to
protocol internals. Three tracks (Beginner / Intermediate / Advanced), 33 deep lessons, 9
modules, 10 real case studies, a ~72-term glossary, guided practice labs, quizzes with
explanations, and an XP/badge progress system — all stored locally in your browser.
No signup, no backend, no tracking.

## Run it

```bash
npm install
npm run dev        # dev server → http://localhost:5173
```

Production:

```bash
npm run build      # typecheck + bundle to dist/
npm run preview    # serve the production build locally
```

## What's inside

| Section | Route | Content |
|---|---|---|
| Home | `/#/` | Overview, track cards, featured cases |
| Curriculum | `/#/learn` | All three tracks with modules & lessons |
| Track | `/#/learn/:level` | `beginner` · `intermediate` · `advanced` |
| Lesson | `/#/lesson/:id` | Deep reading, key terms, practice labs, resources, quiz |
| Case studies | `/#/cases` | 10 structured post-mortems/breakdowns |
| Glossary | `/#/glossary` | Searchable terms by category |
| Progress | `/#/progress` | XP, tiers, 9 badges, quiz scores, reset |
| Resources | `/#/resources` | Curated external docs/tools hub |
| Search | `⌘K` / `Ctrl+K` | Across lessons, cases, glossary |

### Curriculum summary

- **Beginner (10 lessons)** — what Web3 is, how a blockchain works, Ethereum, wallets & keys,
  transactions & gas, first dApp session on a testnet, tokens & NFTs, stablecoins, security
  basics, ecosystem map.
- **Intermediate (11 lessons)** — smart contracts, Solidity fundamentals, token standards,
  dApp architecture, DeFi primitives, AMMs/DEXs (worked math), lending & stablecoin design,
  oracles, L2 scaling, DAOs & governance, on-chain analysis.
- **Advanced (12 lessons)** — consensus internals, EVM internals, rollup internals, applied
  cryptography, security & auditing methodology, MEV, tokenomics, account abstraction,
  interoperability & bridges, ZK applications, RWA/institutional, AI agents & crypto.

### Case studies

The DAO hack · Poly Network · Uniswap v3 · Axie Infinity · Ronin Bridge · Terra/LUNA · FTX ·
The Merge · Tornado Cash · Curve/Vyper compiler bug. Each: background → timeline → root
causes → impact → takeaways → sources.

## Tech

Vite + React 18 + TypeScript, `react-router-dom` (hash routing — deployable to any static
host). Hand-written CSS design system (dark theme, emerald/teal/amber), hand-rolled inline
markdown renderer and SVG icon set. Progress persists in `localStorage`
(`web3-academy-v1`). No runtime API keys, no secrets in source.

## Project layout

```
src/
  types.ts            # content schema (single source of truth)
  data/               # curriculum.ts, beginner/intermediate/advanced lessons,
                      # caseStudies.ts, glossary.ts, resources.ts
  lib/                # progress engine, markdown, icons, utils
  components/         # layout, quiz engine, cards, search modal, callouts…
  pages/              # one file per route
  styles/global.css   # design system
PRD.md                # product requirements (research basis, spec, acceptance)
```

## Notes

- Educational content only — nothing here is financial advice.
- All practice labs are testnet-first; lessons repeat that because it matters.
- External links point at canonical sources (ethereum.org, protocol docs, post-mortems).

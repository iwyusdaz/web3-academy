# PRD — Web3 Academy

**Product:** Web3 Academy — a self-paced web app for learning Web3 in depth, from beginner to advanced.
**Date:** 2026-11-13 · **Status:** Implemented v1 · **Owner:** Built end-to-end by ZCode per user request.

---

## 1. Vision

Web3 Academy is a free, self-contained learning platform that takes a curious person from
"What is a blockchain?" to "I can reason about MEV, zk-SNARKs and tokenomics design." Every
lesson pairs deep explanations with **hands-on practices** (guided, tool-based exercises) and
**real case studies** (exploits, collapses, breakthroughs) so learners build judgment, not just
vocabulary. Progress, XP and badges are tracked locally in the browser — no signup, no backend.

## 2. Research basis (sources consulted)

- Curriculum structure modeled on public roadmaps: [web3.career 2025 roadmap](https://web3.career/learn-web3/web3-developer-2025-roadmap), [QuickNode "How to become a Web3 developer"](https://www.quicknode.com/guides/web3-fundamentals-security/how-to-become-a-web3-developer-roadmap), [Scaler beginner→advanced project guide](https://www.scaler.com/blog/web3-development-projects-for-developers-beginner-to-advanced).
- Case studies grounded in reporting: [Wikipedia — The DAO](https://en.wikipedia.org/wiki/The_DAO), [Chainalysis — Ronin/Axie hack](https://www.chainalysis.com/blog/axie-infinity-ronin-bridge-dprk-hack-seizure), [MIT Sloan — Anatomy of a Run (Terra/LUNA)](https://mitsloan.mit.edu/cfi/anatomy-a-run-terra-luna-crash), [MIT Sloan — FTX case](https://mitsloan.mit.edu/teaching-resources-library/sam-bankman-frieds-ftx), [Chainalysis — Curve pool exploit](https://www.chainalysis.com/blog/curve-finance-liquidity-pool-hack).
- Canonical free resources curated in-app: [ethereum.org docs](https://ethereum.org/developers/docs), [ethereum.org/learn](https://ethereum.org/learn), [Solidity docs](https://docs.soliditylang.org), plus CryptoZombies, Ethernaut, geth docs.

## 3. Target users & personas

| Persona | Need | Track entry |
|---|---|---|
| **Priya, 24, CS student** | Wants a structured path into blockchain dev | Beginner → Intermediate |
| **Marco, 31, web2 backend dev** | Knows code, needs EVM/Solidity/security depth | Intermediate fast-path |
| **Ana, 28, analyst / PM** | Needs to evaluate protocols, tokenomics, risk | Case studies + Intermediate/Advanced concepts |
| **Sam, 45, skeptic** | Wants honest trade-offs, scams and failure modes included | Beginner + Cases |

## 4. Scope & information architecture

Three tracks, nine modules, 33 lessons, 10 case studies, ~70-term glossary, curated resource hub.

```
/                     Home — what it is, track cards, featured case, how it works
/learn                Curriculum — all 3 tracks with module/lesson outline
/learn/:level         Track page — modules, lesson list, per-lesson progress
/lesson/:id           Lesson — objectives, deep sections, key terms, practices, resources, quiz
/cases                Case study library (filter by category)
/cases/:id            Case study — background, timeline, root causes, impact, takeaways
/glossary             ~70 terms, searchable + category filter
/progress             Dashboard — XP, level, completion %, badges, quiz scores
/resources            Curated external resource hub (docs, courses, tools, papers)
⌘K / Ctrl+K           Global search across lessons, cases, glossary
```

## 5. Curriculum (content spec)

### Beginner — "Own your first keys" (10 lessons, 3 modules)
B1 Foundations: `what-is-web3` · `blockchain-basics` · `ethereum-overview`
B2 Keys & first dApp: `wallets-and-keys` · `transactions-and-gas` · `using-dapps`
B3 Tokens, safety & ecosystem: `tokens-and-nfts` · `stablecoins` · `web3-security-basics` · `ecosystem-map`

### Intermediate — "Build and analyze" (11 lessons, 3 modules)
I1 Smart contracts: `smart-contracts-101` · `solidity-fundamentals` · `token-standards` · `dapp-architecture`
I2 DeFi mechanics: `defi-primitives` · `amms-and-dexs` · `lending-and-stables` · `oracles`
I3 Scaling, governance, data: `scaling-l2s` · `daos-and-governance` · `on-chain-analysis`

### Advanced — "Protocol internals & judgment" (12 lessons, 3 modules)
A1 Internals: `consensus-internals` · `evm-internals` · `rollup-internals` · `cryptography`
A2 Security & economics: `security-auditing` · `mev` · `tokenomics` · `account-abstraction`
A3 Frontier: `interop-bridges` · `zk-applications` · `rwa-institutional` · `ai-agents-crypto`

### Case studies (10)
`the-dao-hack` (2016, reentrancy→ETH/ETC fork) · `poly-network` (2021, $611M bridge, whitehat return) ·
`uniswap-v3` (2021, concentrated liquidity breakthrough) · `axie-economy` (2021–22, play-to-earn boom & bust) ·
`ronin-bridge` (2022, $625M, validator key compromise) · `terra-luna` (2022, algorithmic stablecoin death spiral) ·
`ftx-collapse` (2022, CeFi fraud & commingling) · `the-merge` (2022, PoW→PoS transition) ·
`tornado-cash` (2022, privacy protocol sanctioned — regulation) · `curve-vyper` (2023, compiler-level reentrancy).

Every lesson carries: objectives, 5–7 deep sections (with callouts/tables/code where apt),
key terms, 1–2 guided **practice labs** with step-by-step tool exercises, 3–5 curated
**resources** (real URLs, docs/articles/papers), and a 4-question **quiz** with explanations.

## 6. Functional requirements

| # | Requirement | Acceptance |
|---|---|---|
| F1 | Track & lesson browsing | All 33 lessons navigable from `/learn` and track pages |
| F2 | Lesson reader | Sections, callouts, tables, code, key terms, resources render; prev/next lesson nav |
| F3 | Quiz engine | Instant feedback, explanations, score; perfect-run badge; retry resets |
| F4 | Practice labs | Checkbox steps with progress; all steps done ⇒ practice complete |
| F5 | Progress engine | localStorage: completed lessons, quiz results, practice steps, XP, badges |
| F6 | XP & badges | Lesson=100 XP, quiz correct=10 XP, perfect=+25, practice=25 XP; ≥8 badges |
| F7 | Dashboard | XP, badge grid, per-track completion %, recent quiz scores |
| F8 | Case studies | Filterable library; detail pages; "mark as studied" tracked |
| F9 | Glossary | Search + category filter, ~70 terms, cross-links to lessons |
| F10 | Global search | ⌘K modal across lessons/cases/glossary with keyboard nav |
| F11 | Resource hub | Categorized external links (docs, courses, tools, papers) |
| F12 | Persistence & reset | State survives reload; one-click reset in dashboard |

## 7. Non-goals

No wallet connection / live chain calls (safety + zero-dependency), no backend/accounts, no
user-generated content, no video hosting. Practices use free public tools (faucets, explorers,
Remix, Etherscan, zk.cx sandboxes) with clear "testnet only" framing.

## 8. UX & design system (taste rules applied)

- Dark "tech" theme: graphite-navy ground, **emerald/teal + amber accents** (deliberately no violet).
- One button pair, one card style, one radius scale; equal left/right edges on one container.
- Hover micro-interactions: linked cards lift 2px, buttons step/press, underlines draw. Hero enters once; **no scroll-triggered card fades**.
- Typography scale with mono accents for on-chain vocabulary; AA contrast.
- A11y: skip link, visible focus rings, 44px tap targets, labeled controls, semantic headings.
- Responsive at 1440/1024/768/390; single column on phones, full-width buttons.

## 9. Tech stack

Vite + React 18 + TypeScript SPA. `react-router-dom` (HashRouter — deployable to any static host).
Hand-written CSS design system (no CSS framework), hand-rolled inline-markdown renderer, SVG icons
& progress rings (no icon/chart deps). All content typed in `src/types.ts`; data in `src/data/*`.
Zero runtime API keys; no secrets in source (per security constraint).

## 10. Content schema (single source of truth)

`Lesson`, `LessonSection` (heading, paragraphs, callout, list, table, code), `Practice`,
`QuizQuestion`, `Resource`, `CaseStudy`, `GlossaryTerm`, `Track`/`Module` in `src/types.ts` —
see file for exact definitions. Lesson body paragraphs support `**bold**`, `*italic*`,
`` `code` ``, `[links](url)`.

## 11. Milestones

1. Research + PRD ✅ · 2. Schema + scaffold ✅ · 3. Content authored (5 parallel writing passes) ✅
4. App shell + engines ✅ · 5. Integration, typecheck, production build ✅ · 6. Browser verification ✅

## 12. Risks & mitigations

- **Link rot** → only well-known stable domains; resources page notes checking dates.
- **Schema drift from parallel authors** → authors receive exact types; `tsc --noEmit` gates integration.
- **Unsafe advice** → lessons emphasize self-custody risks, testnets for practice, "not financial advice" framing.

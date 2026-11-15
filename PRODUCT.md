# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated (recorded from the completed v1 build): Vite + React 18 + TypeScript SPA, react-router-dom (hash routing), hand-written CSS design system in `src/styles/global.css`, no CSS framework, no icon dependency. Content lives in typed data modules (`src/data/*`) rendered against `src/types.ts`.

## Users

- **Priya, CS student (primary)** — self-learns Web3 from zero; needs a structured, trustworthy path with zero signup friction.
- **Marco, web2 backend developer** — knows code, jumps straight to Intermediate; needs EVM/Solidity/security depth fast.
- **Ana, analyst / PM** — evaluates protocols and risk; lives in case studies, glossary and tokenomics material.
- **Sam, skeptic** — wants honest trade-offs, scams and failure modes included, not hype.

*(Derived from PRD §3 personas; confirmed by the shipped curriculum.)*

## Product Purpose

A free, self-contained learning platform that takes a curious person from "what is a blockchain" to reasoning about MEV, zk-SNARKs and tokenomics design. Success = a learner completes tracks, passes quizzes, practices with real tools on testnets, and studies real failures — without an account.

## Positioning

Depth + honesty + practice: mechanism-level explanations with worked numbers, guided tool-based labs, and structured failure case studies — all offline-capable, local-first, no tracking. Neighboring "learn crypto" sites copy hype vocabulary; this one cannot truthfully copy the case-study rigor or the no-backend privacy stance.

## Operating Context

- Self-paced solo study in a desktop or phone browser; sessions are short and resumable.
- Progress persists in browser localStorage (`web3-academy-v1`); the dashboard is the learner's own record.
- Practices direct learners to external tools (MetaMask, Sepolia faucets, Etherscan, Remix) — the app itself never touches real funds or wallets.
- Content authored in typed TS data files; inline markdown subset (**bold**, *italic*, `code`, [links](url)).

## Capabilities and Constraints

- 33 lessons across Beginner (10) / Intermediate (11) / Advanced (12), 9 modules; 10 case studies; 83-term glossary; curated resource hub; ⌘K global search; XP/badge engine.
- Constraints: no backend, no accounts, no wallet connection, no runtime API keys, no secrets in source; hash routing so `dist/` deploys to any static host; educational-content-only framing (no financial advice).
- Quiz scores, practice steps, lesson completion and case-study marks are all client-side state.

## Brand Commitments

- Name: **Web3 Academy** (wordmark "Web3**Academy**" with accent on "Academy").
- Voice: direct, mechanistic, honest about trade-offs; zero hype vocabulary; testnet-first safety framing repeated deliberately.
- Visual rule carried from v1: no violet/lavender anywhere in the design (per design-taste-frontend house rule).

## Evidence on Hand

- Real, substantial authored content: `src/data/beginner.ts` (10 lessons), `intermediate.ts` (11), `advanced.ts` (12), `caseStudies.ts` (10), `glossary.ts` (83 terms), `resources.ts` (30 links). No testimonials, no fabricated metrics — hero stats count actual content only.

## Product Principles

1. **Substance over slogan** — every screen shows real content, never placeholder or filler.
2. **Practice is the point** — reading always pairs with a doable tool exercise.
3. **Honesty builds trust** — failures, risks and trade-offs are first-class content.
4. **Local-first respect** — no accounts, no tracking; the learner's progress belongs to them.
5. **One system, quietly excellent** — consistent tokens and components beat one-off flourishes.

## Accessibility & Inclusion

- WCAG-minded basics already shipped: skip link, visible focus rings, semantic headings, labeled controls, 44px tap targets, AA contrast on dark ground, `prefers-reduced-motion` honored. Redesign must keep or raise this bar.

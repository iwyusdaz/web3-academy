import type { Lesson, Level, Module, Track } from '../types'
import { beginnerLessons } from './beginner'
import { intermediateLessons } from './intermediate'
import { advancedLessons } from './advanced'
import { levelRank } from '../lib/utils'

export const levelMeta: Record<
  Level,
  { name: string; tagline: string; blurb: string; accent: string; icon: 'sprout' | 'build' | 'internals' }
> = {
  beginner: {
    name: 'Beginner',
    tagline: 'Own your first keys',
    blurb:
      'Understand what a blockchain actually is, set up a wallet safely, send your first testnet transaction and learn to spot scams before they cost you.',
    accent: 'var(--lvl-beginner)',
    icon: 'sprout',
  },
  intermediate: {
    name: 'Intermediate',
    tagline: 'Build and analyze',
    blurb:
      'Read and reason about smart contracts, take apart DeFi mechanics with real numbers, and understand how L2s, DAOs and on-chain data fit together.',
    accent: 'var(--lvl-intermediate)',
    icon: 'build',
  },
  advanced: {
    name: 'Advanced',
    tagline: 'Protocol internals & judgment',
    blurb:
      'Go under the hood: consensus, the EVM, rollup architecture, applied cryptography, MEV, tokenomics design and the frontier of AI-agent economies.',
    accent: 'var(--lvl-advanced)',
    icon: 'internals',
  },
}

function mods(level: Level, defs: [string, string, string, string[]][]): Module[] {
  return defs.map(([id, title, description, lessonIds]) => ({ id, level, title, description, lessonIds }))
}

export const tracks: Track[] = [
  {
    level: 'beginner',
    name: 'Beginner',
    tagline: 'Own your first keys',
    description:
      'No prior knowledge assumed. Ten lessons that take you from "what even is a blockchain" to confidently — and safely — using a wallet, testnets and dApps.',
    modules: mods('beginner', [
      [
        'b-foundations',
        'Foundations of Web3',
        'The mental model: why blockchains exist, what makes them different from databases, and what Ethereum adds on top.',
        ['what-is-web3', 'blockchain-basics', 'ethereum-overview'],
      ],
      [
        'b-keys',
        'Keys, Transactions & First dApp',
        'Hands-on fundamentals: wallets, seed phrases, gas, and actually using a dApp on a testnet.',
        ['wallets-and-keys', 'transactions-and-gas', 'using-dapps'],
      ],
      [
        'b-ecosystem',
        'Tokens, Safety & the Ecosystem',
        'The assets you will meet everywhere, the scams that target newcomers, and a map of the whole space.',
        ['tokens-and-nfts', 'stablecoins', 'web3-security-basics', 'ecosystem-map'],
      ],
    ]),
  },
  {
    level: 'intermediate',
    name: 'Intermediate',
    tagline: 'Build and analyze',
    description:
      'For learners who know the basics. Read Solidity, dissect DeFi math, understand oracle and L2 architecture, and start analyzing protocols like an analyst.',
    modules: mods('intermediate', [
      [
        'i-contracts',
        'Smart Contracts & Development',
        'From a first contract to token standards and the full dApp stack: frontend, RPC, events and indexing.',
        ['smart-contracts-101', 'solidity-fundamentals', 'token-standards', 'dapp-architecture'],
      ],
      [
        'i-defi',
        'DeFi Mechanics',
        'Swaps, pools, lending and oracles — with worked numbers, not vibes.',
        ['defi-primitives', 'amms-and-dexs', 'lending-and-stables', 'oracles'],
      ],
      [
        'i-systems',
        'Scaling, Governance & Data',
        'How the ecosystem scales, governs itself and can be measured from the outside.',
        ['scaling-l2s', 'daos-and-governance', 'on-chain-analysis'],
      ],
    ]),
  },
  {
    level: 'advanced',
    name: 'Advanced',
    tagline: 'Protocol internals & judgment',
    description:
      'For builders, auditors and analysts. Consensus internals, EVM execution, rollup design, applied cryptography, MEV economics and protocol design.',
    modules: mods('advanced', [
      [
        'a-internals',
        'Protocol Internals',
        'Consensus, the EVM, rollup architecture and the cryptography that makes trustless systems possible.',
        ['consensus-internals', 'evm-internals', 'rollup-internals', 'cryptography'],
      ],
      [
        'a-security-econ',
        'Security & Protocol Economics',
        'Auditing methodology, MEV, tokenomics design and the account-abstraction stack.',
        ['security-auditing', 'mev', 'tokenomics', 'account-abstraction'],
      ],
      [
        'a-frontier',
        'The Frontier',
        'Bridges, ZK applications, real-world assets and the emerging AI-agent economy.',
        ['interop-bridges', 'zk-applications', 'rwa-institutional', 'ai-agents-crypto'],
      ],
    ]),
  },
]

export const allLessons: Lesson[] = [...beginnerLessons, ...intermediateLessons, ...advancedLessons].sort(
  (a, b) => levelRank(a.level) - levelRank(b.level) || a.order - b.order,
)

const lessonsById = new Map(allLessons.map((l) => [l.id, l]))

export function getLesson(id: string): Lesson | undefined {
  return lessonsById.get(id)
}

export function getLevelLessons(level: Level): Lesson[] {
  return allLessons.filter((l) => l.level === level)
}

export function getAdjacent(id: string): { prev: Lesson | null; next: Lesson | null } {
  const idx = allLessons.findIndex((l) => l.id === id)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? allLessons[idx - 1] : null,
    next: idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
  }
}

export function moduleLessons(module: Module): Lesson[] {
  return module.lessonIds
    .map((id) => lessonsById.get(id))
    .filter((l): l is Lesson => Boolean(l))
}

export function trackFor(level: Level): Track | undefined {
  return tracks.find((t) => t.level === level)
}

export const LEVEL_LABEL: Record<Level, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

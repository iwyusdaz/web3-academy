import type { Resource } from '../types'

export interface ResourceGroup {
  id: string
  title: string
  description: string
  items: Resource[]
}

// Curated external resource hub. Only long-lived, official or canonical URLs.
export const resourceGroups: ResourceGroup[] = [
  {
    id: 'foundations',
    title: 'Foundations & Conceptual',
    description: 'Start here if you want the big picture explained properly, from first principles.',
    items: [
      { title: 'ethereum.org — Learn hub', url: 'https://ethereum.org/en/learn/', type: 'docs', note: 'Canonical beginner library maintained by the Ethereum Foundation.' },
      { title: 'ethereum.org — Developer docs', url: 'https://ethereum.org/en/developers/docs/', type: 'docs', note: 'The reference for accounts, transactions, gas, blocks and the EVM.' },
      { title: 'Ethereum Foundation blog', url: 'https://blog.ethereum.org/', type: 'article', note: 'Protocol announcements and roadmap posts, straight from the source.' },
      { title: 'Vitalik Buterin’s writings', url: 'https://vitalik.ca/', type: 'article', note: 'Deep essays on governance, cryptography and protocol design.' },
      { title: 'ethresear.ch', url: 'https://ethresear.ch/', type: 'article', note: 'Research forum where scaling and consensus proposals are debated.' },
    ],
  },
  {
    id: 'development',
    title: 'Development & Tooling',
    description: 'Docs and environments you will actually keep open while building.',
    items: [
      { title: 'Solidity documentation', url: 'https://docs.soliditylang.org/', type: 'docs', note: 'The language reference — read the security considerations section early.' },
      { title: 'Remix IDE', url: 'https://remix.ethereum.org/', type: 'tool', note: 'Browser IDE: compile, deploy and debug contracts without installing anything.' },
      { title: 'Foundry Book', url: 'https://book.getfoundry.sh/', type: 'docs', note: 'Fast test framework, fuzzer and scripting in Rust-era tooling.' },
      { title: 'EIP repository', url: 'https://eips.ethereum.org/', type: 'docs', note: 'Every improvement proposal — ERC-20, EIP-1559, EIP-4844, ERC-4337 and beyond.' },
      { title: 'Ethers.js docs', url: 'https://docs.ethers.org/', type: 'docs', note: 'Standard library for talking to chains from JavaScript.' },
    ],
  },
  {
    id: 'security',
    title: 'Security & Auditing',
    description: 'Where exploit literacy comes from: post-mortems, challenges and audit resources.',
    items: [
      { title: 'Ethernaut by OpenZeppelin', url: 'https://ethernaut.openzeppelin.com/', type: 'course', note: 'Learn security by breaking vulnerable contracts, level by level.' },
      { title: 'rekt.news', url: 'https://rekt.news/', type: 'article', note: 'Anonymous post-mortems of major exploits — the industry’s incident log.' },
      { title: 'Chainalysis research blog', url: 'https://www.chainalysis.com/blog/', type: 'article', note: 'On-chain forensics and laundering-pattern research.' },
      { title: 'Consensys Diligence blog', url: 'https://consensys.net/diligence/blog/', type: 'article', note: 'Audit write-ups and tooling from a major security firm.' },
      { title: 'ChainAbuse', url: 'https://www.chainabuse.com/', type: 'tool', note: 'Report and look up scam addresses across chains.' },
    ],
  },
  {
    id: 'defi',
    title: 'DeFi & Protocol Docs',
    description: 'Primary protocol documentation — always prefer it over influencer summaries.',
    items: [
      { title: 'Uniswap docs', url: 'https://docs.uniswap.org/', type: 'docs', note: 'v2/v3/v4 mechanics, from constant product to hooks.' },
      { title: 'Uniswap v3 core whitepaper (PDF)', url: 'https://uniswap.org/whitepaper.pdf', type: 'paper', note: 'The concentrated-liquidity paper — worth reading slowly.' },
      { title: 'Aave docs', url: 'https://docs.aave.com/', type: 'docs', note: 'Lending mechanics: collateral factors, health factor, liquidations.' },
      { title: 'Chainlink docs', url: 'https://docs.chain.link/', type: 'docs', note: 'Data feeds architecture and oracle design patterns.' },
      { title: 'Safe (multisig)', url: 'https://safe.global/', type: 'tool', note: 'The standard multisig for treasuries — try it on a testnet.' },
    ],
  },
  {
    id: 'scaling',
    title: 'Scaling & L2 Intelligence',
    description: 'Where to check how rollups actually behave, beyond their marketing.',
    items: [
      { title: 'L2BEAT', url: 'https://l2beat.com/', type: 'tool', note: 'Risk-frameworked comparison of every L2: stage, proof systems, escape hatches.' },
      { title: 'ethereum.org — Layer 2 section', url: 'https://ethereum.org/en/layer-2/', type: 'docs', note: 'Rollups, blobs and the scaling roadmap explained.' },
      { title: 'beaconcha.in', url: 'https://beaconcha.in/', type: 'tool', note: 'Explore validators, attestations and finality on the consensus layer.' },
    ],
  },
  {
    id: 'data',
    title: 'Data & Analysis',
    description: 'Tools for reading the chain and measuring what actually happens.',
    items: [
      { title: 'Etherscan', url: 'https://etherscan.io/', type: 'tool', note: 'The explorer: transactions, contracts, labels, approvals.' },
      { title: 'Sepolia explorer', url: 'https://sepolia.etherscan.io/', type: 'tool', note: 'The testnet twin of Etherscan for practice without real funds.' },
      { title: 'Dune', url: 'https://dune.com/', type: 'tool', note: 'SQL dashboards over on-chain data — thousands of community queries.' },
      { title: 'DefiLlama', url: 'https://defillama.com/', type: 'tool', note: 'TVL, fees and yields across protocols, without ad framing.' },
    ],
  },
  {
    id: 'practice',
    title: 'Structured Practice',
    description: 'Guided, hands-on courses that pair well with this academy’s lessons.',
    items: [
      { title: 'CryptoZombies', url: 'https://cryptozombies.io/', type: 'course', note: 'Learn Solidity by building a game, lesson by lesson.' },
      { title: 'Speedrun Ethereum', url: 'https://speedrunethereum.com/', type: 'course', note: 'Challenge-based dApp building with Scaffold-ETH.' },
      { title: 'Alchemy University / faucets', url: 'https://www.alchemy.com/faucets', type: 'tool', note: 'Testnet ETH faucets for Sepolia and other networks.' },
    ],
  },
]

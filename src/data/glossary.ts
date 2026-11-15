import type { GlossaryTerm } from '../types'

// Glossary of Web3 Academy terms, sorted alphabetically by term (case-insensitive).
// Inline markdown subset only: **bold**, *italic*, `code`. No links, no HTML.

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Account abstraction",
    definition:
      "A family of standards (notably **ERC-4337** and EIP-7702) that lets smart contracts act as user accounts, enabling custom signature rules, batched transactions, gas paid in tokens, and social recovery instead of a single fragile private key.",
    category: "technology",
    related: ["account-abstraction", "wallets-and-keys", "transactions-and-gas"],
  },
  {
    term: "Address",
    definition:
      "A public identifier for an account on a blockchain — on Ethereum, a 42-character `0x`-prefixed string derived from a public key. Addresses are safe to share and receive funds; the private key behind one is not.",
    category: "core",
    related: ["what-is-web3", "wallets-and-keys"],
  },
  {
    term: "Address poisoning",
    definition:
      "A scam in which an attacker sends dust transfers from an address that visually mimics one you have used before, hoping you later copy the impostor from your transaction history and send real funds to it. Defenses: paste and verify the *full* address, not just the first and last characters.",
    category: "security",
    related: ["web3-security-basics"],
  },
  {
    term: "Alpha",
    definition:
      "Jargon, borrowed from finance, for privileged information that supposedly gives a trading edge. Treat it critically: alpha shared publicly is usually marketing or exit-liquidity recruitment, and genuine edges are rarely broadcast.",
    category: "culture",
    related: ["on-chain-analysis"],
  },
  {
    term: "AMM",
    definition:
      "An **Automated Market Maker** — a smart contract that prices trades against a pool of deposited tokens using a formula such as the constant-product curve `x * y = k`, instead of matching buyers and sellers in an order book. AMMs let anyone become a market maker by depositing assets.",
    category: "defi",
    related: ["amms-and-dexs", "defi-primitives"],
  },
  {
    term: "Approval",
    definition:
      "A token allowance: an ERC-20 holder grants a contract permission to spend tokens on their behalf, up to a limit or an `infinite` amount. Stale unlimited approvals are a recurring exploit path, so revoke approvals you no longer use.",
    category: "security",
    related: ["web3-security-basics", "using-dapps", "token-standards"],
  },
  {
    term: "Audit",
    definition:
      "A time-boxed professional review of smart contract code by an external security firm, delivered as a report of findings. An audit materially reduces risk but guarantees nothing — major exploits have hit audited protocols — so treat *audited* as one signal among several.",
    category: "security",
    related: ["security-auditing", "smart-contracts-101"],
  },
  {
    term: "Blob (EIP-4844)",
    definition:
      "A large data payload attached to Ethereum transactions since the 2024 Dencun upgrade (proto-danksharding), giving rollups a dedicated, much cheaper fee market for publishing data. Blobs are pruned after roughly 18 days: they guarantee *data availability*, not permanent storage.",
    category: "technology",
    related: ["rollup-internals", "scaling-l2s"],
  },
  {
    term: "Block",
    definition:
      "A batch of transactions committed together in one step, carrying a hash of the parent block, a timestamp, and consensus metadata. Each block links to the previous one, which is what makes the ledger tamper-evident.",
    category: "core",
    related: ["blockchain-basics"],
  },
  {
    term: "Blockchain",
    definition:
      "A replicated, append-only ledger in which transactions are grouped into cryptographically chained blocks and mirrored across many independent nodes. Rewriting history would require redoing consensus work across most of the network simultaneously, so the record is effectively immutable.",
    category: "core",
    related: ["blockchain-basics", "what-is-web3"],
  },
  {
    term: "Bug bounty",
    definition:
      "A standing program that pays security researchers for responsibly disclosed vulnerabilities, with rewards scaled by severity. For a large protocol, a million-dollar payout for a critical bug is far cheaper than losing treasury funds to an attacker.",
    category: "security",
    related: ["security-auditing"],
  },
  {
    term: "Calldata",
    definition:
      "The read-only input bytes passed to a smart contract function in a transaction, and the EVM region where they live during execution. Because calldata is stored only in transaction history — not in contract state — it is cheap to publish, which is why rollups posted their compressed data there before blobs existed.",
    category: "technology",
    related: ["evm-internals", "solidity-fundamentals", "rollup-internals"],
  },
  {
    term: "Cold wallet",
    definition:
      "Key storage that never touches an internet-connected device, typically a hardware wallet or an offline paper or metal backup. Best for long-term holdings; the cost is slower, more deliberate signing.",
    category: "security",
    related: ["web3-security-basics", "wallets-and-keys"],
  },
  {
    term: "Collateral factor",
    definition:
      "The fraction of an asset's value that a lending protocol counts toward borrowing power — with a 0.75 factor, $100 of deposited ETH lets you borrow up to $75. Volatile or illiquid assets get lower factors because their value can drop faster than liquidations can react.",
    category: "defi",
    related: ["lending-and-stables", "defi-primitives"],
  },
  {
    term: "Consensus",
    definition:
      "The mechanism by which independent nodes agree on a single canonical ordering of transactions without a central coordinator. Ethereum uses **proof of stake** and Bitcoin uses **proof of work** — different engineering tradeoffs for the same coordination problem.",
    category: "core",
    related: ["consensus-internals", "blockchain-basics"],
  },
  {
    term: "DApp",
    definition:
      "A **decentralized application**: a frontend plus smart contracts whose core logic runs on a blockchain rather than a private server, making it permissionless and independently verifiable. Most DApps still rely on centralized conveniences such as hosted frontends and RPC providers.",
    category: "core",
    related: ["what-is-web3", "using-dapps", "dapp-architecture"],
  },
  {
    term: "Data availability",
    definition:
      "The guarantee that the raw data needed to independently reconstruct and verify a chain's state is actually published where anyone can retrieve it. It is the central scaling bottleneck: verifying execution is cheap, but making all data available to everyone was expensive until blobs.",
    category: "technology",
    related: ["rollup-internals", "scaling-l2s"],
  },
  {
    term: "Decentralization",
    definition:
      "Distribution of a system's control, operation, and decision-making across many independent participants instead of one administrator. It is a spectrum, not a switch — a protocol can be decentralized in validation while still centralized in upgrades, hosting, or governance.",
    category: "core",
    related: ["what-is-web3", "daos-and-governance"],
  },
  {
    term: "DeGen",
    definition:
      "Self-applied slang (from *degenerate*) for traders who pile into highly speculative assets with little research, often with leverage, and wear the losses as a badge of honor. The humor is part of the marketing: it normalizes gambling-sized risk, and the people promoting plays rarely hold them through the crash.",
    category: "culture",
  },
  {
    term: "Depeg",
    definition:
      "The event of a stablecoin trading away from its intended peg (usually $1), typically under market panic or doubt about reserves. Temporary depegs often recover; depegs caused by broken backing can end near zero, as Terra's UST did in 2022.",
    category: "economics",
    related: ["stablecoins", "lending-and-stables"],
  },
  {
    term: "Drainer",
    definition:
      "Malware-as-a-service kits that walk victims through a legitimate-looking interface until they sign something catastrophic — a token approval, a permit signature, a transfer — after which the kit sweeps the wallet. Drainer infrastructure has extracted billions of dollars through phishing links.",
    category: "security",
    related: ["web3-security-basics"],
  },
  {
    term: "DYOR",
    definition:
      "*Do Your Own Research* — the reminder that no one else absorbs your losses. As method: read the docs, find who controls upgrades, verify contract addresses, trace on-chain flows, and size positions you can afford to lose. As a disclaimer, it is frequently used to dodge accountability for shilling.",
    category: "culture",
    related: ["web3-security-basics", "on-chain-analysis", "tokenomics"],
  },
  {
    term: "Emission",
    definition:
      "The rate at which a protocol creates new tokens — block rewards, incentive programs, airdrop schedules. Emission above genuine demand dilutes existing holders, so the schedule and its decline curve matter more than the headline APY.",
    category: "economics",
    related: ["tokenomics"],
  },
  {
    term: "ERC-20",
    definition:
      "The Ethereum standard defining a shared interface for fungible tokens — `transfer`, `balanceOf`, `approve` and friends — which is why any ERC-20 works with any compliant wallet, exchange, or DeFi contract without custom integration.",
    category: "technology",
    related: ["token-standards", "tokens-and-nfts"],
  },
  {
    term: "ERC-721",
    definition:
      "The Ethereum standard for non-fungible tokens: each token has a unique id and a single owner, enabling on-chain representation of collectibles, tickets, credentials, and other distinct assets.",
    category: "technology",
    related: ["token-standards", "tokens-and-nfts"],
  },
  {
    term: "Ethereum",
    definition:
      "The leading programmable blockchain: a global computer that executes smart contracts on the EVM, secured by proof of stake since 2022. Its roadmap is rollup-centric — the base layer optimizes for security and decentralization while Layer 2s carry most user activity.",
    category: "core",
    related: ["ethereum-overview", "scaling-l2s", "ecosystem-map"],
  },
  {
    term: "EVM",
    definition:
      "The **Ethereum Virtual Machine**, the deterministic sandbox in which smart contract bytecode executes against isolated storage. Its near-universal adoption made EVM compatibility the default target for new chains and developer tooling.",
    category: "technology",
    related: ["evm-internals", "solidity-fundamentals", "smart-contracts-101"],
  },
  {
    term: "FDV",
    definition:
      "**Fully Diluted Valuation** — price multiplied by maximum total supply, i.e. the market cap that would exist if every token, including locked and unissued ones, were circulating today. Comparing FDV to circulating market cap exposes how much future sell supply the current price is already ignoring.",
    category: "economics",
    related: ["tokenomics"],
  },
  {
    term: "Fee switch",
    definition:
      "A protocol mechanism — or the governance decision to activate it — that routes a share of protocol revenue to token holders, turning a governance token into a claim on cash flow. Few protocols have flipped theirs, largely because of unresolved legal risk.",
    category: "economics",
    related: ["tokenomics", "daos-and-governance"],
  },
  {
    term: "Flash loan",
    definition:
      "An uncollateralized loan borrowed and repaid inside a single transaction; if repayment fails, the whole transaction reverts as if nothing happened. Legitimate uses include arbitrage and collateral swaps, but the same atomicity makes flash loans a powerful amplifier for attacks on vulnerable protocols.",
    category: "defi",
    related: ["defi-primitives", "security-auditing", "mev"],
  },
  {
    term: "FOMO",
    definition:
      "*Fear Of Missing Out* — the emotional state that drives chasing pumps, which is also precisely when early holders distribute to latecomers. Countdown timers, limited windows, and fake urgency exist because FOMO converts reliably.",
    category: "culture",
  },
  {
    term: "Fork",
    definition:
      "A divergence in rules or history. A **soft fork** tightens validation rules so old clients still follow the upgraded chain; a **hard fork** changes rules incompatibly and can split the network in two, as happened with Ethereum and Ethereum Classic in 2016. The word is also used loosely for copying open-source code.",
    category: "core",
    related: ["blockchain-basics", "consensus-internals"],
  },
  {
    term: "Fraud proof",
    definition:
      "The enforcement mechanism of optimistic rollups: a watcher submits a proof that a claimed state root is wrong, and the on-chain contract re-executes the disputed transition, penalizing the dishonest party. Security depends on at least one honest watcher acting within the challenge window.",
    category: "technology",
    related: ["rollup-internals", "scaling-l2s"],
  },
  {
    term: "FUD",
    definition:
      "*Fear, Uncertainty, and Doubt* — a label applied to criticism, usually to dismiss it rather than answer it. The honest usage guide: some FUD is legitimate risk analysis, and projects that reflexively shout FUD at hard questions are telling you something.",
    category: "culture",
  },
  {
    term: "Gas",
    definition:
      "The unit that prices computational work on the EVM: every operation costs gas, and users pay fees in ETH at a price per gas they set. Gas compensates validators and turns block space into a priced resource, which is what makes spam expensive.",
    category: "core",
    related: ["transactions-and-gas", "evm-internals"],
  },
  {
    term: "Genesis block",
    definition:
      "The first block of a blockchain (height 0), hardcoded into client software rather than mined like later blocks. Every subsequent block descends from it, so two networks with different genesis blocks are different chains even if everything else matches.",
    category: "core",
    related: ["blockchain-basics"],
  },
  {
    term: "Hardware wallet",
    definition:
      "A dedicated physical device that stores private keys in a secure element and signs transactions internally, so keys never touch an internet-connected computer. It defends against malware on your machine — but not against you approving a transaction the attacker designed.",
    category: "security",
    related: ["wallets-and-keys", "web3-security-basics"],
  },
  {
    term: "Health factor",
    definition:
      "A lending position's ratio of collateral value (weighted by collateral factors) to outstanding debt; when it falls below 1, the position becomes liquidatable. It is the single number to watch when the market moves against your borrow.",
    category: "defi",
    related: ["lending-and-stables", "defi-primitives"],
  },
  {
    term: "HODL",
    definition:
      "A typo for *hold* — from a 2013 forum post during a crash — later backronymed as *Hold On for Dear Life*, meaning never sell. As strategy it is a commitment device against panic selling, but it is also indistinguishable from having no exit plan, which is occasionally brilliant and occasionally catastrophic.",
    category: "culture",
  },
  {
    term: "Hot wallet",
    definition:
      "A wallet whose keys live on an internet-connected device or in a browser extension — convenient for daily dApp use, exposed to malware, drainers, and phishing. Standard practice: keep spending money hot and savings cold, and never hold more in a hot wallet than you would carry in cash.",
    category: "security",
    related: ["web3-security-basics", "wallets-and-keys"],
  },
  {
    term: "Impermanent loss",
    definition:
      "The value a liquidity provider gives up relative to simply holding the deposited assets when their prices diverge, because the AMM formula continuously rebalances the pool toward equal value. It becomes *permanent* at withdrawal, or whenever accumulated fees fail to cover it.",
    category: "defi",
    related: ["amms-and-dexs", "defi-primitives"],
  },
  {
    term: "Intent",
    definition:
      "A user-declared outcome — swap X for Y within these limits — that specialized solvers compete to fulfill, instead of the user hand-building a transaction route (promoted by ERC-7683). Intents simplify UX but move trust into the solver market: you now rely on solvers to compete honestly.",
    category: "technology",
    related: ["account-abstraction", "interop-bridges"],
  },
  {
    term: "IPFS",
    definition:
      "The InterPlanetary File System, a peer-to-peer storage network that addresses files by the hash of their contents rather than by location. Widely used for NFT metadata — and worth knowing that *stored on IPFS* is not the same as *stored on a blockchain*.",
    category: "technology",
    related: ["dapp-architecture", "tokens-and-nfts"],
  },
  {
    term: "Layer 2",
    definition:
      "A separate execution environment that processes transactions off the main chain while inheriting its security by posting data and proofs back to it — on Ethereum today, essentially always a rollup. Independent alt-L1s that do not inherit L1 security are faster chains, not Layer 2s.",
    category: "technology",
    related: ["scaling-l2s", "rollup-internals"],
  },
  {
    term: "Liquidation",
    definition:
      "The forced sale of a borrower's collateral when health factor drops below the threshold: liquidator bots repay part of the debt and claim the collateral at a discount. It protects the protocol's solvency and is where weak personal risk management gets settled.",
    category: "defi",
    related: ["lending-and-stables", "defi-primitives"],
  },
  {
    term: "Liquidity pool",
    definition:
      "A smart contract holding reserves of one or more tokens that traders trade against, funded by providers who deposit assets and earn a share of trading fees. Pool depth determines price impact and slippage, making depth a DeFi protocol's real competitive moat.",
    category: "defi",
    related: ["amms-and-dexs", "defi-primitives"],
  },
  {
    term: "LP token",
    definition:
      "A receipt token minted to liquidity providers representing their fractional claim on a pool. LP tokens are composable — they can be staked, used as collateral, or auto-compounded — which is convenient, and also how risk stacks invisibly.",
    category: "defi",
    related: ["amms-and-dexs", "defi-primitives"],
  },
  {
    term: "Mainnet",
    definition:
      "The live production network where real value moves, as opposed to testnets. Every transaction costs real money and most mistakes are irreversible, which is why rehearsal happens elsewhere first.",
    category: "core",
    related: ["ethereum-overview", "using-dapps"],
  },
  {
    term: "Market cap",
    definition:
      "Price multiplied by circulating supply — the market value of tokens that exist and trade today. It measures size, not quality: it says nothing about locked supply, future emissions, or whether the token confers any claim at all.",
    category: "economics",
    related: ["tokenomics"],
  },
  {
    term: "MEV",
    definition:
      "**Maximal Extractable Value** — the profit a block producer or searcher can capture by reordering, inserting, or censoring transactions within a block: frontrunning, sandwich attacks, and arbitrage. MEV is structural rather than a bug, and the mitigation frontier (private order flow, fair ordering, encrypted mempools) is an active design space.",
    category: "economics",
    related: ["mev", "on-chain-analysis"],
  },
  {
    term: "Multisig",
    definition:
      "A wallet contract requiring M-of-N distinct keys to authorize any action, such as 3-of-5, so a single compromised key cannot drain funds alone. It is standard for treasuries and protocol administration, though it concentrates control in whoever holds the remaining keys.",
    category: "security",
    related: ["wallets-and-keys", "security-auditing", "daos-and-governance"],
  },
  {
    term: "Node",
    definition:
      "A computer running blockchain client software that independently validates and relays transactions and blocks. A full node verifies every rule itself, which is why running one is the strongest way to stop trusting third parties for your balances.",
    category: "core",
    related: ["blockchain-basics", "what-is-web3"],
  },
  {
    term: "Nonce",
    definition:
      "A number used once, with two common meanings in this ecosystem: on Ethereum, the per-account counter that orders transactions and prevents replays; in proof of work, the value miners vary while searching for a valid hash.",
    category: "core",
    related: ["transactions-and-gas", "consensus-internals"],
  },
  {
    term: "On-chain sleuth",
    definition:
      "An analyst who works directly with raw blockchain data — wallet clustering, fund flows, labeling — to trace stolen funds, expose wash trading, or de-anonymize bad actors after exploits. Because the ledger is public, the work is verifiable by anyone willing to check it.",
    category: "culture",
    related: ["on-chain-analysis"],
  },
  {
    term: "Optimistic rollup",
    definition:
      "A Layer 2 that posts transactions to Ethereum assuming they are valid, and enforces that assumption with a challenge window during which fraud proofs can revert bad state roots. Fast to use, but canonical withdrawals to L1 wait out the window — about 7 days — unless a liquidity bridge fronts the exit.",
    category: "technology",
    related: ["rollup-internals", "scaling-l2s"],
  },
  {
    term: "Oracle",
    definition:
      "A service that feeds external data such as asset prices into smart contracts, which cannot fetch anything themselves. Because protocols act on oracle updates, oracles are a prime attack surface, and price-report manipulation has driven some of DeFi's largest lending exploits.",
    category: "defi",
    related: ["oracles", "defi-primitives"],
  },
  {
    term: "Paymaster",
    definition:
      "In ERC-4337 account abstraction, an entity that sponsors or restructures gas payment so users can pay fees in ERC-20 tokens or transact gas-free, subsidized by the application. It removes the need to acquire ETH before doing anything — a major onboarding barrier.",
    category: "technology",
    related: ["account-abstraction"],
  },
  {
    term: "Phishing",
    definition:
      "Social engineering that lures you into fake sites, malicious signature prompts, or imposter support agents to extract secrets or approvals. Web3 has no chargebacks or password resets, so habits — bookmarking real URLs, reading every signature, refusing urgency — are the only defense.",
    category: "security",
    related: ["web3-security-basics"],
  },
  {
    term: "Private key",
    definition:
      "The secret number from which your public key and address are derived and which authorizes every outgoing transaction. Whoever holds it owns the funds: there is no reset, no support desk, and no recourse after exposure.",
    category: "security",
    related: ["wallets-and-keys", "web3-security-basics"],
  },
  {
    term: "Public key",
    definition:
      "The value derived mathematically from a private key that can be shared freely; on Ethereum, the address is derived from it in turn. Others use it to verify your signatures — the asymmetric pair that lets you prove identity without revealing the secret.",
    category: "security",
    related: ["wallets-and-keys", "cryptography"],
  },
  {
    term: "Reentrancy",
    definition:
      "A smart contract vulnerability in which an external call hands control to an attacker's contract, which calls back into the original function before balances are updated, draining funds repeatedly in one transaction. The DAO hack of 2016 is the canonical example; the standard fixes are checks-effects-interactions ordering and reentrancy guards.",
    category: "security",
    related: ["security-auditing", "solidity-fundamentals", "smart-contracts-101"],
  },
  {
    term: "Restaking",
    definition:
      "Reusing staked ETH as collateral to secure additional services (AVSs) for extra yield, as popularized by EigenLayer. The yield stacks because the risk stacks: the same stake now faces the slashing conditions of every service it secures at once.",
    category: "economics",
    related: ["consensus-internals", "tokenomics"],
  },
  {
    term: "Rollup",
    definition:
      "A scaling architecture that executes transactions off-chain and posts compressed data plus a commitment to the results back to the L1, which enforces correctness through validity proofs (ZK rollups) or fraud proofs (optimistic rollups). The L1's job is data availability and settlement, not execution.",
    category: "technology",
    related: ["rollup-internals", "scaling-l2s"],
  },
  {
    term: "RPC node",
    definition:
      "A node — or more often a hosted provider such as Infura or Alchemy — exposing a JSON-RPC endpoint that wallets and dApps query to read balances and broadcast transactions. Your wallet's picture of the chain is only as honest as the RPC endpoint it uses.",
    category: "technology",
    related: ["dapp-architecture", "using-dapps"],
  },
  {
    term: "Rug pull",
    definition:
      "A scam in which a project's operators extract the value and vanish — draining liquidity, minting themselves tokens, or emptying the treasury after the hype peaks. Warning signs worth weighing: anonymous teams, liquidity that is not locked, and concentrated token ownership.",
    category: "security",
    related: ["web3-security-basics", "tokens-and-nfts"],
  },
  {
    term: "Seed phrase",
    definition:
      "The 12–24 word mnemonic that deterministically generates every key in a wallet; it is the master backup and a total-compromise event if exposed. Enter it only into the wallet app itself — never into a website, a cloud note, or a photo.",
    category: "security",
    related: ["wallets-and-keys", "web3-security-basics"],
  },
  {
    term: "Slashing",
    definition:
      "The protocol-enforced destruction of part of a validator's stake as punishment for provably breaking consensus rules, such as signing conflicting blocks. Slashing converts *do not cheat* from a promise into a direct financial calculation.",
    category: "economics",
    related: ["consensus-internals"],
  },
  {
    term: "Slippage",
    definition:
      "The difference between the price you expect when submitting a trade and the price you actually receive, caused by pool movement or competing trades in the same block. Generous slippage tolerance is also exactly what sandwich attackers look for.",
    category: "defi",
    related: ["amms-and-dexs", "mev", "defi-primitives"],
  },
  {
    term: "Smart contract",
    definition:
      "A program deployed on a blockchain that runs identically on every node and can hold assets under code-defined rules, so outcomes cannot be changed by an operator after the fact unless the code allows upgrades. Deployed code is public and production mistakes are irreversible, which is why engineering discipline is not optional.",
    category: "technology",
    related: ["smart-contracts-101", "ethereum-overview"],
  },
  {
    term: "Solidity",
    definition:
      "The dominant high-level language for writing Ethereum smart contracts, compiled to EVM bytecode. Its tooling is mature, but its footguns — reentrancy, storage-layout confusion, `delegatecall` misuse — mean testing and review remain non-negotiable.",
    category: "technology",
    related: ["solidity-fundamentals", "evm-internals", "security-auditing"],
  },
  {
    term: "Stablecoin",
    definition:
      "A token engineered to track a reference value, usually $1, through fiat reserves (USDT, USDC), crypto over-collateralization (DAI), or algorithmic designs (UST — which collapsed in 2022). The mechanism determines fragility: a peg is a promise backed by reserves, not a law of nature.",
    category: "economics",
    related: ["stablecoins", "lending-and-stables"],
  },
  {
    term: "Staking",
    definition:
      "Locking tokens to help secure a proof-of-stake network or earn protocol yield, receiving rewards while taking on slashing and lockup risk. Liquid-staking tokens such as stETH make the position tradable, adding a secondary depeg risk on top.",
    category: "economics",
    related: ["consensus-internals", "tokenomics"],
  },
  {
    term: "Testnet",
    definition:
      "A sandbox chain mirroring its mainnet's mechanics but with worthless native currency, used to practice transactions and deploy contracts without risk. Testnet tokens come free from faucets, and testnet results are for learning, not production guarantees.",
    category: "core",
    related: ["using-dapps", "ethereum-overview"],
  },
  {
    term: "Token",
    definition:
      "A unit of value tracked on a blockchain — currency, governance vote, membership, or claim — issued under standards such as ERC-20 for fungible and ERC-721 for unique assets. The word covers nearly everything, so the useful question is always what holding the token actually entitles you to.",
    category: "economics",
    related: ["tokens-and-nfts", "token-standards", "tokenomics"],
  },
  {
    term: "Tokenomics",
    definition:
      "The design of a token's economy: supply schedule, distribution, utility, and how value accrues to holders. It exists to answer one question — why would demand grow faster than supply? — which most token designs answer poorly.",
    category: "economics",
    related: ["tokenomics"],
  },
  {
    term: "Transaction",
    definition:
      "A signed instruction submitted to the network — a transfer, a contract call, a deployment — that is included in a block and permanently changes chain state. Execution is atomic: a transaction either completes entirely or reverts entirely.",
    category: "core",
    related: ["transactions-and-gas", "blockchain-basics"],
  },
  {
    term: "TVL",
    definition:
      "**Total Value Locked** — the aggregate value of assets deposited in a protocol's contracts, the standard headline metric for DeFi size. It counts deposits, not revenue or safety, and is easily inflated by circular collateral and double counting.",
    category: "defi",
    related: ["defi-primitives", "on-chain-analysis"],
  },
  {
    term: "Validity proof",
    definition:
      "A succinct cryptographic proof — typically a ZK-SNARK or STARK — that a batch of transactions was executed correctly, verifiable by a smart contract in milliseconds without re-execution. Because validity is proven up front, ZK rollups can settle faster than optimistic rollups.",
    category: "technology",
    related: ["rollup-internals", "zk-applications", "cryptography"],
  },
  {
    term: "Vesting",
    definition:
      "A schedule that releases tokens allocated to teams and investors gradually over months or years instead of all at launch. Vesting spreads out sell pressure, but clustered unlock dates are predictable supply shocks worth tracking before they hit.",
    category: "economics",
    related: ["tokenomics"],
  },
  {
    term: "WAGMI",
    definition:
      "*We're All Gonna Make It* — a communal chant of guaranteed collective success, most loudly deployed during pumps. Read it as hype culture's prayer rather than analysis: it marks sentiment peaks more reliably than market bottoms, and nobody chanting it is accountable when *all* do not make it.",
    category: "culture",
  },
  {
    term: "Yield farming",
    definition:
      "Deploying capital across protocols to earn fees and token incentives, rotating as rates shift. Sustained yields far above market rates are usually subsidy emissions that decay, or compensation for risks — contract bugs, depegs, liquidations — that the APY figure does not display.",
    category: "defi",
    related: ["defi-primitives", "lending-and-stables", "amms-and-dexs"],
  },
  {
    term: "ZK rollup",
    definition:
      "A Layer 2 that posts each batch to Ethereum together with a validity proof, so the L1 can verify correctness immediately without a challenge window. The tradeoffs versus optimistic designs are prover cost and complexity rather than exit delay.",
    category: "technology",
    related: ["rollup-internals", "scaling-l2s", "zk-applications"],
  },
  {
    term: "zkVM",
    definition:
      "A virtual machine whose execution produces a zero-knowledge proof of correctness, letting anyone verify that a program ran as claimed without re-running it. zkVMs power ZK rollups and verifiable off-chain computation, with designs targeting general instruction sets (RISC-V-based SP1, RISC Zero) as well as EVM-specific proving.",
    category: "technology",
    related: ["zk-applications", "cryptography", "evm-internals"],
  },
]

import type { CaseStudy } from '../types'

export const caseStudies: CaseStudy[] = [
  {
    id: 'the-dao-hack',
    title: 'The DAO Hack',
    hook: "One recursive call turned the largest crowdfund in history into Ethereum's defining crisis.",
    category: 'security',
    outcome: 'failure',
    year: '2016',
    severity: 'critical',
    summary:
      "In June 2016 an unknown attacker used a reentrancy flaw in The DAO's withdrawal logic to recursively drain roughly 3.6M ETH - about a third of the roughly $150M raised - into a contract under the attacker's control. The community responded with a contentious hard fork that returned the funds to investors and split Ethereum into two chains, ETH and Ethereum Classic. The incident made reentrancy the canonical smart-contract vulnerability, formalized the checks-effects-interactions pattern, and effectively created the modern smart-contract audit industry.",
    background:
      "The DAO launched on April 30, 2016 as a decentralized venture fund: participants exchanged ETH for DAO tokens and voted on how the pooled capital would be invested. It was remarkable on every axis - a 28-day funding window that raised about 11.5M ETH (roughly $150M at then-prices, the largest crowdfunding campaign ever at that point), and a token balance representing approximately 14-15% of all ETH in circulation. The code, written by the team behind the slock.it project and reviewed informally by several researchers, was rushed to market; a recursive-call concern raised publicly in the days before the exploit was judged by some to be theoretical, and no fix was deployed in time.\n\nThe technical flaw sat in the withdrawal path: when a token holder chose to split out of The DAO, the contract sent ETH with an external call before fully updating the sender's balance. Because that external call handed execution control to whatever code received the funds, an attacker could re-enter the withdrawal function again and again, with the balance ledger never catching up to reality. On June 17, 2016, the attacker did exactly that - repeatedly, for hours, moving roughly 3.6M ETH into a 'child DAO' whose withdrawal was deliberately delayed by about 27 days. That delay turned out to be the only reason recovery was even possible: the community spent a month arguing, then executed a hard fork on July 20, 2016 that clawed the funds back. A minority refused the intervention, kept running the unforked chain, and called it Ethereum Classic.",
    timeline: [
      {
        label: "April 30, 2016 - The raise",
        detail:
          "The DAO's token sale opens. Over a 28-day window it collects about 11.5M ETH (roughly $150M), the largest crowdfunding round ever conducted at that time. DAO tokens represent roughly 14-15% of all circulating ETH, an enormous concentration of value in unaudited code."
      },
      {
        label: "June 9-12, 2016 - Early warnings",
        detail:
          "A security researcher publishes a warning about recursive-call vulnerabilities in Ethereum contracts, and a proposed fix for The DAO circulates in the community. Nothing is deployed before the window closes. In hindsight, the flaw is documented days before it is exploited."
      },
      {
        label: "June 17, 2016 - The drain",
        detail:
          "The attacker calls the split function with a malicious fallback contract and recursively re-enters the withdrawal path, siphoning roughly 3.6M ETH (around $50-60M at then-prices) into a 'child DAO' within hours. ETH's price drops roughly a third from its recent high as the market digests the news."
      },
      {
        label: "June 17 - July 19, 2016 - Governance crisis",
        detail:
          "The community debates intervention versus the principle that code is law. A proposed soft fork to block the attacker's withdrawal is abandoned after it is shown to enable denial-of-service attacks. Exchanges pause deposits; the price continues sliding; the 27-day withdrawal window ticks down."
      },
      {
        label: "July 20, 2016 - The hard fork",
        detail:
          "At block 1,920,000, Ethereum forks: DAO token holders' balances are moved into a withdrawal contract so the raised funds can be returned. Most of the ecosystem follows the new chain (ETH). A minority keeps the original, unmodified chain alive as Ethereum Classic (ETC), preserving the 3.6M ETH in the attacker's contract there."
      },
      {
        label: "Aftermath - 2016 and beyond",
        detail:
          "Reentrancy becomes vulnerability number one in every audit checklist, and the checks-effects-interactions pattern becomes standard practice. In July 2017 the US SEC issues a report concluding DAO tokens were securities, seeding years of regulatory questions. The professional security-audit industry as it exists today traces its origin to this weekend."
      }
    ],
    rootCauses: [
      "Unchecked external call: the withdrawal path used a low-level call that forwarded ETH - and with it, execution control - to an untrusted contract before the function finished its own work.",
      "No checks-effects-interactions discipline: state was not updated before interacting with external code, so the attacker re-entered against a stale balance. No reentrancy guard existed.",
      "A rushed 28-day funding window: high-stakes code shipped on a marketing deadline, with known concerns raised days before the exploit and no fix deployed.",
      "Value-locking design: The DAO's split logic concentrated a huge jackpot behind a single flawed function, making the bug a one-shot, protocol-draining exploit rather than a per-user annoyance.",
      "Governance vacuum: there was no agreed process for crisis response, so the improvised response (a soft fork, then a hard fork) itself became a source of contention and a permanent network split."
    ],
    impact: [
      { label: 'ETH drained', value: '~3.6M ETH (roughly $50-60M at then-prices)' },
      { label: 'Funds raised', value: '~11.5M ETH / ~$150M in a 28-day window' },
      { label: 'Share of ETH supply', value: '~14-15% of all circulating ETH committed to The DAO' },
      { label: 'Market reaction', value: 'ETH price fell roughly a third in the days after disclosure' },
      { label: 'Network split', value: 'One chain became two: ETH (forked) and ETC (original chain)' },
      { label: 'Regulatory echo', value: 'SEC 2017 report found DAO tokens were securities' }
    ],
    lessons: [
      "Treat every external call as hostile. Checks-effects-interactions ordering and explicit reentrancy guards became table stakes for Ethereum development after this incident.",
      "Code is law is a social claim as much as a technical one. The community chose to intervene, and that precedent - for better and worse - still shapes how Ethereum handles protocol-level disputes.",
      "Rushing high-value code is the cheapest way to lose it. The flaw was discoverable; the funding schedule, not the technology, is what made the loss possible.",
      "Audits became an industry for a reason: once contracts hold millions, external security review is expected. But the DAO also shows audits are necessary, not sufficient - the review landscape was immature, and process pressure outranked findings.",
      "Design for failure: the 27-day withdrawal delay in the attacker's child DAO is the only reason a recovery fork was feasible at all. Time-locks on large movements are a legitimate safety feature."
    ],
    relatedLessonIds: [
      'smart-contracts-101',
      'solidity-fundamentals',
      'security-auditing',
      'evm-internals',
      'daos-and-governance',
      'blockchain-basics'
    ],
    links: [
      {
        title: "The DAO - Wikipedia",
        url: "https://en.wikipedia.org/wiki/The_DAO",
        type: 'article',
        note: "Overview of the raise, the exploit, and the fork"
      },
      {
        title: "Critical Update Re: DAO Vulnerability (Ethereum Foundation blog)",
        url: "https://blog.ethereum.org/2016/06/17/critical-update-re-dao-vulnerability/",
        type: 'article',
        note: "The Foundation's same-day disclosure of the attack"
      },
      {
        title: "Ethereum Hard Fork Completed (Ethereum Foundation blog)",
        url: "https://blog.ethereum.org/2016/07/20/hard-fork-completed/",
        type: 'article',
        note: "The fork that returned the funds and split the network"
      },
      {
        title: "DAO Rekt (Rekt News)",
        url: "https://rekt.news/dao-rekt/",
        type: 'article',
        note: "Retrospective write-up of the incident"
      }
    ]
  },
  {
    id: 'poly-network',
    title: 'Poly Network: The $611M Whitehat Return',
    hook: "The biggest theft of 2021 took about an hour; giving it back took a week.",
    category: 'security',
    outcome: 'contested',
    year: '2021',
    severity: 'critical',
    summary:
      "On August 10, 2021, an attacker forged valid-looking cross-chain messages to drain roughly $611M from Poly Network's contracts across Ethereum, BSC, and Polygon. Over the following days the attacker voluntarily returned essentially all recoverable funds, describing the exploit as an attempt to expose the flaw. The case became the defining lesson that a bridge is only as trustworthy as its message verification - and a reminder that whitehat returns are a choice, not a mechanism.",
    background:
      "Poly Network was a cross-chain interoperability protocol connecting heterogeneous chains. Its model: a user locks an asset on chain A, a proof of that event is relayed to a cross-chain manager contract on chain B, and the manager verifies the message against a list of keeper public keys before minting or releasing assets. The fatal design wrinkle was that the manager contract could execute calls into other Poly contracts based on message contents - and one of the reachable contracts stored the keeper public keys themselves. In other words, the system that verified messages could be instructed, through a crafted message, to rewrite the very trust root it verified against.\n\nThe attacker chained this loop: a first forged message re-keyed the keeper list, and subsequent messages signed by the new keys - the attacker's own - looked perfectly legitimate to every chain's manager. Within roughly an hour, contracts on Ethereum, BSC, and Polygon were drained of approximately $611M. What followed was unusual: the attacker began returning funds almost immediately, later saying the goal was to expose the vulnerability and noting, pointedly, that their earlier disclosure attempts had gotten a slow response from the team. Poly Network publicly asked for the funds back and offered a reward; exchanges and issuers froze what they could (Tether blacklisted roughly $13M in USDT). Over about a week the bulk of the assets came back transaction by transaction, and Poly dubbed the attacker 'Mr. White Hat.' The name flatters the outcome more than the process explains it - nothing in the protocol's design forced the return, and most hacked protocols never get their money back at all.",
    timeline: [
      {
        label: "August 10, 2021 - The forgery",
        detail:
          "The attacker submits crafted cross-chain messages that cause the manager contract to overwrite the stored keeper public keys, then submits further messages that pass verification with the new keys. Contracts on Ethereum, BSC, and Polygon are drained of roughly $611M in tokens within about an hour."
      },
      {
        label: "August 10, 2021 - Response begins",
        detail:
          "Poly Network confirms the exploit and publicly asks the attacker to return the funds. Tether freezes around $13M in USDT linked to the theft, and major exchanges begin monitoring inflows from the attacker's addresses."
      },
      {
        label: "August 10-11 - The attacker responds",
        detail:
          "Funds start moving back. In on-chain messages the attacker says the exploit was carried out for fun and to expose a serious vulnerability, and complains that Poly Network's earlier responses to disclosure attempts were slow. The tone is part taunt, part proof-of-concept."
      },
      {
        label: "August 11-13 - Negotiation and return",
        confidence: 'inferred',
        detail:
          "Poly Network and the attacker communicate through embedded transaction messages; the bulk of the stolen assets are returned. Poly offers a $500K bug bounty, which the attacker reportedly declines, saying the exploit was about the flaw, not the money."
      },
      {
        label: "August 16-17 - Resolution",
        detail:
          "Essentially all recoverable funds are back with Poly Network; some assets (frozen tokens and dust) remain permanently stuck. Poly thanks 'Mr. White Hat' and ships fixes to the message-verification path. The largest hack in crypto history to date ends, remarkably, without a loss of user principal."
      },
      {
        label: "November 2023 - The echo",
        detail:
          "Poly Network is exploited again, losing roughly $5.7M after the compromise of a keeper-side account. The repeat incident underlines the original lesson: trust concentrated in a small set of keys is a standing target, at any scale."
      }
    ],
    rootCauses: [
      "Self-authorization loop: the contract that executed cross-chain messages could, via a crafted message, invoke the contract that stored the keeper public keys - letting a message rewrite the trust root that messages were verified against.",
      "Over-broad internal call path: the manager accepted arbitrary target contracts and methods from message payloads, with no allowlist separating admin functions from user-facing ones.",
      "Trusted-minority keeper model: protocol security reduced to a short list of on-chain public keys, with no circuit breaker, transfer caps, or anomaly checks on the other side of verification.",
      "Audit blind spot: the flaw lived in the interaction between contracts rather than inside any single function, the category of bug that per-contract review routinely misses.",
      "Rapid multichain expansion: identical vulnerable manager contracts were deployed across several chains, so one logic error drained three ecosystems simultaneously."
    ],
    impact: [
      { label: 'Value drained', value: '~$611M across Ethereum, BSC, and Polygon' },
      { label: 'Speed', value: 'All three chains drained within roughly an hour on day one' },
      { label: 'Returned', value: 'Essentially all recoverable funds returned within about a week' },
      { label: 'Frozen', value: 'Around $13M in USDT frozen by Tether during the response' },
      { label: 'Bounty', value: '$500K reward offered; reportedly declined by the attacker' },
      { label: 'Recurrence', value: '~$5.7M lost in a second, smaller incident in November 2023' }
    ],
    lessons: [
      "Verify the verifier: the contract that executes cross-chain messages must never be able to authorize its own messages or modify the trust root it checks against. Allowlist every callable target and method.",
      "Whitehat returns are a gift, not a plan. Poly Network recovered funds because one anonymous actor chose to; design as if theft is permanent, and use bounties and monitoring to convert attackers into reporters before they become thieves.",
      "Bridge security is a systems property: a bridge inherits the assumptions of every chain and contract it touches, and the weakest one defines the floor.",
      "Audit scope must include interactions between contracts, not just each contract in isolation. Formal verification of message paths is increasingly the norm for high-value bridges for exactly this reason.",
      "Circuit breakers and transfer caps cost little and bound the blast radius when - not if - verification logic fails."
    ],
    relatedLessonIds: [
      'interop-bridges',
      'smart-contracts-101',
      'security-auditing',
      'on-chain-analysis',
      'web3-security-basics'
    ],
    links: [
      {
        title: "Poly Network - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Poly_Network",
        type: 'article',
        note: "Overview of the protocol and the 2021 exploit"
      },
      {
        title: "Poly Network Rekt (Rekt News)",
        url: "https://rekt.news/polynetwork-rekt/",
        type: 'article',
        note: "Technical walkthrough of the message forgery"
      },
      {
        title: "Understanding Cross-Chain Crime (Chainalysis)",
        url: "https://www.chainalysis.com/blog/cross-chain-crime/",
        type: 'article',
        note: "How stolen funds move across bridges and chains"
      }
    ]
  },
  {
    id: 'uniswap-v3',
    title: 'Uniswap v3: Concentrated Liquidity',
    hook: "Liquidity stopped being a lake and became a landscape you could sculpt.",
    category: 'defi',
    outcome: 'breakthrough',
    year: '2021',
    severity: 'medium',
    summary:
      "Uniswap v3, launched on Ethereum mainnet in May 2021, replaced the uniform whole-range liquidity of earlier automated market makers with concentrated positions that liquidity providers place inside custom price ranges. The design delivered up to roughly 4,000x capital efficiency versus v2 within narrow ranges, turned liquidity provision into an active management task, and represented each position as an NFT. Alongside the math came a legal experiment - a time-limited Business Source License that expired into GPL - making v3 a case study in how protocol design choices, technical and legal, shape entire ecosystems.",
    background:
      "Uniswap's v1 (2018) and v2 (2020) ran on the constant-product formula: liquidity providers deposit a 50/50 value split, and their capital sits passively across the entire price curve from zero to infinity. The elegance is real, but so is the inefficiency - at any given moment, the overwhelming majority of pooled capital is idle at prices nobody is trading. v3 attacked that waste directly. Liquidity is deposited into discrete price ranges defined by 'ticks'; swaps consume only the liquidity of pools whose ranges they cross, so a provider who brackets the current price with a tight range earns fees on far less capital. The protocol's own figures put the capital-efficiency gain at up to roughly 4,000x versus v2 for narrow ranges. Three fee tiers (0.05%, 0.30%, 1.00%) let providers match volatility profiles - stable pairs get tight ranges and low fees, volatile pairs get wide ones and high fees.\n\nThe trade-offs were as instructive as the wins. Because positions are heterogeneous, they cannot be represented by fungible ERC-20 pool shares; each is an ERC-721 NFT. That broke some composability (LP tokens were no longer simple yield-bearing assets) but created a secondary ecosystem of position managers and vaults. It also sharpened impermanent loss: a position that exits its range stops earning fees entirely and holds 100% of the depreciating asset. Passive LPs discovered that concentrated liquidity rewards attention - researchers later documented just-in-time liquidity bots that add and remove liquidity within single blocks to capture fees from large trades while dodging the loss. And the licensing saga - core contracts shipped under Business Source License 1.1 to deter instant forking, then converted to GPL-3.0 when the license's change date arrived in spring 2023 - turned v3 into a referendum on what open source means for protocols whose moat is code.",
    timeline: [
      {
        label: "November 2018 / May 2020 - Foundations",
        detail:
          "Uniswap v1 proves on-chain automated market making can work at scale; v2 adds direct token pairs, flash swaps, and a price oracle that other DeFi protocols begin to rely on. The stage is set: passive constant-product liquidity is now the industry default."
      },
      {
        label: "March 2021 - The design is published",
        detail:
          "Uniswap Labs unveils v3: concentrated liquidity, ticks, multiple fee tiers, and non-fungible positions. The announcement sparks wide debate - some see the capital-efficiency breakthrough, others see a licensing move after SushiSwap's 2020 'vampire attack' forked v2 wholesale."
      },
      {
        label: "May 5, 2021 - Mainnet launch",
        detail:
          "v3 goes live on Ethereum with three fee tiers (0.05%, 0.30%, 1.00%) and ERC-721 position tokens. Liquidity migrates quickly; v3 pools begin capturing a large share of DEX volume despite holding less total value locked than v2."
      },
      {
        label: "2021 - The active-LP era",
        detail:
          "Providing liquidity becomes a managed strategy: range placement, rebalancing, and fee-tier selection matter. Vaults and position managers emerge to automate it, and researchers document just-in-time liquidity bots that extract fees within single blocks. Impermanent loss is now an active risk to be managed, not a passive tax."
      },
      {
        label: "2021-2023 - The licensing saga",
        detail:
          "v3 core ships under Business Source License 1.1, restricting commercial forks for a period. Critics call it a retreat from DeFi's open-source norms; supporters note it funds real research. When the change date arrives in spring 2023, the core code converts to GPL-3.0, and competitors (PancakeSwap v3 among them) adopt concentrated liquidity."
      },
      {
        label: "2022 and after - Scale",
        detail:
          "Across all versions, Uniswap crosses $1 trillion in cumulative lifetime trading volume in 2022. v3's design vocabulary - ticks, ranges, fee tiers - becomes the default dialect of AMM design, and v4 (announced 2023) extends it with programmable hooks."
      }
    ],
    rootCauses: [
      "Idle capital: v2's uniform distribution meant fees accrued per unit of liquidity rather than per unit of actual trading activity, so most deposited capital earned nothing most of the time.",
      "Tick discretization: quantizing price ranges into discrete intervals made the concentrated-liquidity math gas-feasible while approximating continuous curves.",
      "Heterogeneous positions demand NFTs: positions with unique ranges and fee tiers cannot share a fungible token, so v3 chose ERC-721 - trading composability for expressiveness.",
      "Fork pressure shaped the license: after SushiSwap cloned v2 within days of launch, the team chose a time-limited BSL to protect the innovation window, converting to GPL on schedule.",
      "Fee tiers as market segmentation: different volatility and volume profiles between stable and volatile pairs justified multiple pools per pair."
    ],
    impact: [
      { label: 'Capital efficiency', value: 'Up to ~4,000x versus v2 within narrow ranges (protocol figures)' },
      { label: 'Fee tiers at launch', value: '0.05%, 0.30%, and 1.00% per pair' },
      { label: 'Position tokens', value: 'ERC-721 NFTs, one per liquidity position' },
      { label: 'Adoption', value: 'v3 pools captured a large share of DEX volume through 2021-2022' },
      { label: 'Cumulative volume', value: '$1T+ lifetime across all versions by 2022' },
      { label: 'License', value: 'BSL 1.1 at launch, converting to GPL-3.0 in spring 2023' }
    ],
    lessons: [
      "AMM design was not finished at v2. Concentrated liquidity came from questioning an assumption everyone had stopped seeing - that liquidity must be uniform - and the industry followed rather than forked.",
      "Capital efficiency shifts risk to providers. Tighter ranges mean more fees and sharper impermanent loss; out-of-range positions earn nothing. Passive yield became an active skill, which is why automated vaults matter.",
      "Licensing is a design decision with ecosystem consequences. The BSL debate showed protocols can reward original research with a time-limited moat without permanently enclosing the commons - but the argument is not settled.",
      "Composability has a shape: NFT positions enabled a whole secondary ecosystem of managers and markets, while breaking the fungible-LP assumptions v2 protocols relied on. Every representation choice enables some integrations and forecloses others.",
      "Innovation in DeFi can be original research, not just replication - and the projects that set the agenda tend to be the ones that publish the math."
    ],
    relatedLessonIds: [
      'amms-and-dexs',
      'defi-primitives',
      'token-standards',
      'on-chain-analysis'
    ],
    links: [
      {
        title: "Introducing Uniswap v3 (Uniswap Labs blog)",
        url: "https://uniswap.org/blog/uniswap-v3/",
        type: 'article',
        note: "The original design announcement"
      },
      {
        title: "Uniswap documentation",
        url: "https://docs.uniswap.org/",
        type: 'docs',
        note: "v3 concepts: concentrated liquidity, ticks, fee tiers"
      },
      {
        title: "Uniswap v2 whitepaper (PDF)",
        url: "https://uniswap.org/whitepaper.pdf",
        type: 'paper',
        note: "Background on the constant-product model v3 improved on"
      },
      {
        title: "Uniswap - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Uniswap",
        type: 'article',
        note: "Protocol history including the v3 licensing period"
      }
    ]
  },
  {
    id: 'axie-economy',
    title: 'Axie Infinity: A Play-to-Earn Economy Boom and Bust',
    hook: "A video game became a paycheck for thousands of Filipinos - until the paycheck printed itself into worthlessness.",
    category: 'economics',
    outcome: 'failure',
    year: '2021-2022',
    severity: 'high',
    summary:
      "Axie Infinity paid players in SLP, a token whose only real demand came from new players buying Axies to breed more Axies. Through 2021 that loop produced remarkable incomes in the Philippines and made Axie the flagship of play-to-earn. When player growth stalled in late 2021, emissions kept flowing while demand evaporated: SLP fell more than 95% from its peak, scholar earnings collapsed, and late entrants who bought Axies at peak prices were left holding losses. The case is the canonical lesson that token incentives cannot substitute for product-market fit, and that emissions without matching sinks are dilution on a schedule.",
    background:
      "Axie Infinity, built by Vietnam-based Sky Mavis, is a turn-based creature-battling game on its own Ronin sidechain. Players own Axies as NFTs, earn Smooth Love Potion (SLP) from battles and quests, and spend SLP plus the governance token AXS to breed new Axies, which are then sold to new players. On top of that sat the scholarship model: managers who owned teams of Axies lent them to 'scholars' - disproportionately in the Philippines, where pandemic unemployment was severe - and split the SLP earnings. At the 2021 peak, company-reported player counts ran into the millions of daily actives, SLP traded near $0.35-0.40, and many scholars earned more than the local minimum wage. International media presented Axie as an income revolution.\n\nThe economics were a circle, not an engine. SLP is minted as players win; it is consumed mainly when owners breed Axies; and breeding only pays if someone is buying new Axies - which is to say, if new players are arriving. Both sides of the ledger were coupled to growth: emissions scaled with engagement, and the sink scaled with new entrants. The moment growth plateaued in late 2021, minting outran burning by a widening margin. Sky Mavis patched repeatedly - breeding costs, burn events, season resets - and the Ronin bridge hack of March 2022 (covered in its own case) drained the treasury and user confidence at the worst possible time. A redesigned economy launched with the 'Origins' season in 2022 capped and restructured earnings. None of it restored prices: by late 2022 SLP traded around $0.01-0.02, down more than 95%, and scholars who had structured their lives around peak earnings were earning pennies. Players who bought Axies near peak floor prices needed months of maximum SLP just to break even; most never did.",
    timeline: [
      {
        label: "2018-2020 - Build phase",
        detail:
          "Axie Infinity ships as a niche blockchain game with a modest economy. During the 2020 pandemic, the scholarship model takes shape, and the play-to-earn concept starts attracting attention in Southeast Asia."
      },
      {
        label: "Mid-2021 - Boom",
        confidence: 'inferred',
        detail:
          "SLP peaks near $0.40; company figures report millions of daily active players; Philippine scholars commonly earn above the local minimum wage. Axie becomes the poster child for play-to-earn, and Axie NFT trading volumes run in the hundreds of millions of dollars per month."
      },
      {
        label: "Late 2021 - Peak strain",
        detail:
          "AXS hits roughly $165 in November. Under the surface, growth slows: SLP emissions continue at engagement scale while breeding demand - the main sink - stalls with new-player acquisition. The first economy patches appear."
      },
      {
        label: "March 2022 - The Ronin shock",
        detail:
          "The Ronin bridge securing Axie's economy is drained of roughly $625M by the Lazarus Group (see the Ronin Bridge case). The treasury and user confidence take a direct hit while the SLP imbalance is already compounding."
      },
      {
        label: "Mid-2022 - Redesign",
        detail:
          "Sky Mavis restructures earnings around the 'Origins' season: SLP minting is capped and rebalanced, breeding economics change, and burn mechanisms are added. SLP trades around $0.01-0.02, down more than 95% from its peak; AXS has fallen from ~$165 to under $20."
      },
      {
        label: "2022-2023 - Aftermath",
        detail:
          "Player counts stabilize far below peak. Scholarships that were lifelines become marginal; late entrants who bought Axies at peak prices absorb the largest losses. The industry rebrands play-to-earn toward 'play-and-own,' quietly conceding the income pitch."
      }
    ],
    rootCauses: [
      "Emission outran sinks: SLP was minted as a function of engagement, while its primary consumption (breeding) depended on new-player demand. When growth flattened, the imbalance became structural rather than cyclical.",
      "Reflexive onboarding: income attracted players whose presence generated the income. That loop is a boom machine in reverse the moment the marginal buyer exits.",
      "Entry costs indexed to peak earnings: Axie floor prices rose to multiples of expected monthly income, so late entrants needed ever-rising SLP just to break even - a treadmill with a cliff at the end.",
      "Reactive tuning: economy patches (breeding costs, burns, seasons) chased the collapse rather than pre-balancing it. No patch can fix a design that requires perpetual growth.",
      "Compounding external shock: the Ronin hack hit the treasury and trust simultaneously, though the economy was already decaying before it."
    ],
    impact: [
      { label: 'Peak players', value: 'Millions of daily actives reported at peak (company figures)' },
      { label: 'SLP price', value: '~$0.35-0.40 peak (2021) to ~$0.01-0.02 (late 2022), down more than 95%' },
      { label: 'AXS price', value: '~$165 peak (November 2021) to under $20 within a year' },
      { label: 'NFT volume', value: 'Cumulative Axie trading volume in the billions of dollars (tracker-reported)' },
      { label: 'Scholar income', value: 'Above-minimum-wage earnings at peak collapsed below subsistence for many' },
      { label: 'Compounding shock', value: '~$625M Ronin bridge hack (March 2022)' }
    ],
    lessons: [
      "Reward-driven acquisition inverts into reward-driven exit. Design for the day the marginal player stops making money - if the economy only works while growing, it does not work.",
      "Match emissions to sinks over the full player lifecycle, not per patch. Model minting and burning as one system with explicit assumptions about growth, and test what happens when growth is zero.",
      "Token incentives amplify what already exists; they cannot create retention where the product is weak. Games must be fun first - the players who stayed after the crash were the ones who liked the game.",
      "Entry-asset pricing matters as much as tokenomics: an NFT priced against peak yield guarantees losses for late entrants when yield normalizes.",
      "Guilds and scholarships redistribute risk between owners and players; they do not fix macro balance. A shared economy can be more human and still be insolvent."
    ],
    relatedLessonIds: [
      'tokenomics',
      'tokens-and-nfts',
      'on-chain-analysis'
    ],
    links: [
      {
        title: "Axie Infinity - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Axie_Infinity",
        type: 'article',
        note: "Game history, economy, and the 2021-2022 cycle"
      },
      {
        title: "Blockchain game - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Blockchain_game",
        type: 'article',
        note: "Context on play-to-earn economics and its critics"
      },
      {
        title: "2021 Global Crypto Adoption Index (Chainalysis)",
        url: "https://www.chainalysis.com/blog/2021-global-crypto-adoption-index/",
        type: 'article',
        note: "Philippines ranked #2 globally; gaming-driven grassroots adoption"
      }
    ]
  },
  {
    id: 'ronin-bridge',
    title: 'Ronin Bridge Hack',
    hook: "Six days. That is how long a roughly $625M theft sat unnoticed on a bridge nobody was watching.",
    category: 'security',
    outcome: 'failure',
    year: '2022',
    severity: 'critical',
    summary:
      "In March 2022 an attacker - later attributed by the FBI to North Korea's Lazarus Group - forged the 5-of-9 validator signatures securing Axie Infinity's Ronin bridge and drained roughly $625M in ETH and USDC. The signatures came from a spearphished Sky Mavis engineer plus an undisclosed permission Sky Mavis had quietly been granted months earlier. The theft went undetected for about six days, exposed how thin validator decentralization can be in practice, and forced a $150M reimbursement raise and a complete validator redesign.",
    background:
      "Ronin is the EVM sidechain Sky Mavis built for Axie Infinity, and its bridge - the door between Axie's economy and the rest of crypto - was secured by nine validators requiring five signatures to move funds. Behind that respectable-sounding threshold sat a fragile reality: Sky Mavis operated a controlling share of the set. In November 2021, when gas costs spiked, the Axie DAO granted Sky Mavis's signing node authority to sign on behalf of the DAO's validator to save costs - a privilege that was never revoked and never publicly documented. Around the same time, operators linked to Lazarus began targeting Sky Mavis staff with fake job offers; one engineer accepted an emailed PDF, and the compromise cascaded into Sky Mavis's signing infrastructure.\n\nOn March 23, 2022, the attacker assembled five valid signatures - four from compromised Sky Mavis keys and one exercised through the forgotten DAO grant - and withdrew roughly 173,600 ETH and 25.5M USDC in two transactions. Nobody noticed for six days. The theft was discovered on March 29 only when a user tried to withdraw 5,000 ETH and found the bridge's liquidity pool empty; Sky Mavis disclosed on March 30. The response was unusually concrete: the bridge was halted, the FBI and US Treasury attributed the attack to Lazarus Group, validators were expanded well beyond the original nine, and Sky Mavis raised $150M from investors including Binance and a16z to make affected users whole. US authorities later seized portions of the stolen funds, and the laundering of the remainder - much of it pushed through mixers - became a centerpiece of the sanctions story told in the Tornado Cash case.",
    timeline: [
      {
        label: "November 2021 - A quiet privilege",
        detail:
          "To reduce gas costs after a network spike, the Axie DAO whitelists Sky Mavis to sign as the DAO's validator. The grant is undisclosed to users and never revoked - a hidden fifth key waiting to be combined with any four others."
      },
      {
        label: "Early 2022 - The intrusion",
        detail:
          "Operators later attributed to the Lazarus Group spearphish a Sky Mavis engineer with a fake job offer attached as a PDF. Compromise of the engineer's systems cascades into Sky Mavis's signing node and validator keys."
      },
      {
        label: "March 23, 2022 - The drain",
        detail:
          "Two transactions carrying five forged signatures pull roughly 173,600 ETH and 25.5M USDC - about $625M at then-prices - out of the bridge. No alarms sound; the bridge keeps operating."
      },
      {
        label: "March 29, 2022 - Discovery",
        confidence: 'inferred',
        detail:
          "A user's attempt to withdraw 5,000 ETH fails: the bridge's liquidity pool is empty. Roughly six days after the theft, the loss becomes visible - an operational monitoring failure as significant as the key compromise itself."
      },
      {
        label: "March 30 - April 2022 - Disclosure and attribution",
        detail:
          "Sky Mavis halts the bridge and discloses the breach. The FBI and US Treasury attribute the attack to the Lazarus Group and sanction associated addresses, making Ronin the largest single state-linked theft of the era."
      },
      {
        label: "Mid-2022 - Rebuild and reimburse",
        detail:
          "Sky Mavis raises $150M from investors including Binance and a16z to reimburse affected users. The validator set is expanded well beyond nine members with new governance requirements, and the bridge reopens under the hardened configuration."
      },
      {
        label: "2023 and after - Aftermath",
        detail:
          "US authorities seize portions of the stolen funds in later law-enforcement actions. Much of the remainder flows through mixing services and sanctioned addresses, intertwining the Ronin case with the Tornado Cash sanctions story."
      }
    ],
    rootCauses: [
      "Thin decentralization: nine validators with a 5-of-9 threshold sounds robust, but a controlling share of the set was operated by - or delegated to - a single company. The security model matched a small project, not a $600M bridge.",
      "Stale, undisclosed delegation: the Axie DAO grant was a hidden fifth key that no audit inventory listed. Undocumented privileges are unauditable, unrevocable in practice, and exactly what attackers hunt for.",
      "Key-operations failure: validator keys lived on infrastructure reachable through one phished engineer, with no hardware isolation or separation between signing duties and ordinary workstations.",
      "No monitoring: there was no alerting on large or anomalous bridge outflows. Detection arrived via a user complaint six days after the fact.",
      "Value outran governance: Ronin's TVL exploded through 2021 while validator diversity, key hygiene, and ops maturity stayed flat. The gap between secured value and secured process is the loss."
    ],
    impact: [
      { label: 'Stolen', value: '~173,600 ETH + 25.5M USDC (roughly $625M at then-prices)' },
      { label: 'Signatures forged', value: '5-of-9 validator threshold (four compromised keys + one stale DAO grant)' },
      { label: 'Time to detection', value: '~6 days' },
      { label: 'Reimbursement', value: '$150M raised to make affected users whole' },
      { label: 'Validator reform', value: 'Set expanded well beyond 9 validators with new governance requirements' },
      { label: 'Recovery', value: 'Portions of funds seized by US authorities in later operations' }
    ],
    lessons: [
      "Validator sets must be diverse across organizations and geographies. A multi-sig where one party controls a majority is a single point of failure wearing a committee costume.",
      "Maintain a privilege inventory. Every delegation, whitelist, and grant should be documented, revocable, and periodically audited - the Ronin attacker exploited a key that existed only as institutional memory.",
      "One phished engineer should never equal five keys. Hardware-isolated signing (HSMs), role separation, and phishing-resistant workflows are the difference between an incident and a catastrophe.",
      "Bridge liquidity needs real-time anomalous-outflow alerting. Six silent days on a $600M pool is a monitoring failure layered on top of a key failure - and each was independently sufficient to cause the loss.",
      "Cap the bridge until the validator set grows. TVL and decentralization should rise together; any gap between them is an arbitrage opportunity for attackers."
    ],
    relatedLessonIds: [
      'interop-bridges',
      'wallets-and-keys',
      'security-auditing',
      'on-chain-analysis',
      'web3-security-basics'
    ],
    links: [
      {
        title: "Ronin Rekt (Rekt News)",
        url: "https://rekt.news/ronin-rekt/",
        type: 'article',
        note: "Detailed breakdown of the signature forgery and response"
      },
      {
        title: "Ronin Network - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Ronin_Network",
        type: 'article',
        note: "Network history and the 2022 hack"
      },
      {
        title: "How Did North Korea Steal $600 Million? (Chainalysis)",
        url: "https://www.chainalysis.com/blog/how-did-north-korea-steal-600-million/",
        type: 'article',
        note: "Tracing the stolen funds and the laundering trail"
      }
    ]
  },
  {
    id: 'terra-luna',
    title: 'Terra/LUNA: Death Spiral of an Algorithmic Stablecoin',
    hook: "A stablecoin held up by its own reflection fell in four days, taking roughly $40B with it.",
    category: 'economics',
    outcome: 'failure',
    year: '2022',
    severity: 'critical',
    summary:
      "Terra's UST maintained its dollar peg through an arbitrage loop: burn $1 worth of LUNA to mint 1 UST, and swap UST back into LUNA the other way. Anchor Protocol's roughly 20% deposit yield concentrated enormous demand and masked the fact that the peg depended entirely on confidence in LUNA itself. In May 2022, large withdrawals triggered a depeg; the mint mechanism responded by hyperinflating LUNA's supply into trillions of tokens; and roughly $40B+ in combined value evaporated within about a week. It remains the textbook case that a stablecoin with no external collateral is a mirror, and mirrors shatter.",
    background:
      "Terra, built by Seoul-based Terraform Labs under Do Kwon, ran an ambitious monetary design. UST was an algorithmic stablecoin with no reserve backing: the protocol's market module let anyone redeem 1 UST for $1 worth of newly minted LUNA, or burn LUNA to mint UST. Arbitrage was supposed to hold the peg - when UST traded below $1, traders would buy cheap UST, redeem it for more LUNA value, and sell, shrinking UST supply and restoring parity. The catch was that LUNA, the redemption asset, derived its value from the growing demand for UST. Peg and backing were the same reflexive thing. Demand was manufactured deliberately: Anchor Protocol paid a subsidized yield of roughly 20% on UST deposits, funded by reserves and staking rewards rather than real revenue, and by spring 2022 it held roughly $14-18B of the ~$17-18B UST supply. LUNA's market cap peaked near $28B with the token around $120 in April 2022.\n\nThe unraveling took days. In early May, roughly $2B exited Anchor within a short window while large UST sell orders hit Curve pools; the peg slipped. As UST traded below $1, holders rushed the redemption exit, and the market module minted LUNA in quantities that dwarfed its existing supply - from roughly 350 million tokens to trillions within days. Each new LUNA pushed the price down, inviting more minting: the classic death spiral, except this one was executed by the protocol itself. UST bottomed near $0.30; LUNA became effectively worthless; the Terra chain halted twice under the load; and the Luna Foundation Guard's roughly $3B Bitcoin reserve, deployed to defend the peg, vanished into the effort. Roughly $40-45B in combined value was erased, and the contagion spread into the broader crunch that took down Celsius, Three Arrows Capital, and Voyager weeks later. The legal aftermath ran for years: Terraform Labs was wound toward bankruptcy, and in 2024 a US jury found Terraform Labs and Do Kwon liable for civil fraud, with penalties on the order of $4.5B; Kwon, arrested in Montenegro in 2023, was extradited to the US at the end of 2024.",
    timeline: [
      {
        label: "2021 - The growth engine",
        detail:
          "Anchor's roughly 20% yield makes UST the default on-chain savings asset, and UST supply compounds. The yield is a subsidy - funded by reserves and inflation rather than genuine lending revenue - but at growth rates it never has to prove otherwise."
      },
      {
        label: "Early 2022 - Maximum scale",
        detail:
          "UST circulation reaches roughly $17-18B; LUNA trades near its all-time high around $120 with a market cap near $28B. Public critics warn that the design is reflexive; the criticism is met with confidence rather than disclosure."
      },
      {
        label: "May 7-8, 2022 - The trigger",
        confidence: 'inferred',
        detail:
          "Roughly $2B is withdrawn from Anchor within days while concentrated UST sales hit Curve liquidity pools. UST slips below $1 for the first time; arbitrage capital that was supposed to defend the peg starts asking whether it should defend it at all."
      },
      {
        label: "May 9-10 - Depeg",
        detail:
          "UST falls to roughly $0.60. Holders stampede the mint/burn exit, and the market module mints LUNA at rates the market cannot absorb. LUNA's supply explodes from roughly 350M tokens toward trillions; its price collapses."
      },
      {
        label: "May 11-13 - The spiral completes",
        detail:
          "UST touches roughly $0.30; LUNA is effectively worthless; the Terra chain halts twice under the minting load. The Luna Foundation Guard deploys its roughly $3B Bitcoin reserve in a failed defense. Roughly $40-45B in combined UST/LUNA value is gone in about a week."
      },
      {
        label: "June-July 2022 - Contagion",
        detail:
          "The hole Terra blew in institutional crypto balance sheets propagates: Celsius freezes withdrawals, Three Arrows Capital defaults, and Voyager collapses. The stablecoin sector re-rates around collateralization almost overnight."
      },
      {
        label: "2022-2024 - Legal endgame",
        detail:
          "Terra forks into a revived chain (Terra 2.0) while the old chain lives on as Terra Classic; UST never re-pegs. Do Kwon is arrested in Montenegro (2023) and extradited to the US (late 2024); a 2024 US jury finds Terraform Labs and Kwon liable for civil fraud, with penalties around $4.5B."
      }
    ],
    rootCauses: [
      "A collateral-free peg: UST's only backing was the market value of LUNA itself, so the redemption asset and the peg's solvency were the same reflexive object. There was no external reserve to fall back on.",
      "Artificial yield: Anchor's roughly 20% rate was a subsidy, not revenue. It concentrated $14-18B of demand in one place - demand that could, and did, leave in days.",
      "Bank-run mechanics with no lender of last resort: redeeming a run into freshly minted LUNA converts a liquidity crisis into hyperinflation of the rescuing asset. The defense mechanism was the failure mechanism.",
      "Concentrated liquidity and whale dependence: UST's exit capacity lived in a handful of Curve pools, so large coordinated sells could move the peg faster than arbitrage could respond.",
      "Opacity under stress: reserve deployments by the Luna Foundation Guard were neither pre-committed nor transparent, so each ad hoc move eroded the confidence it was meant to restore."
    ],
    impact: [
      { label: 'Value erased', value: '~$40-45B across UST and LUNA in about a week' },
      { label: 'UST depeg low', value: '~$0.30 from a $1.00 peg' },
      { label: 'LUNA supply', value: 'From roughly 350M tokens to trillions within days' },
      { label: 'Anchor deposits', value: '~$14-18B at peak - the run staging ground' },
      { label: 'Reserves', value: "LFG's roughly $3B Bitcoin stockpile deployed and depleted without restoring the peg" },
      { label: 'Contagion', value: 'Contributed to the Celsius, 3AC, and Voyager collapses (June-July 2022)' }
    ],
    lessons: [
      "A stablecoin is only as good as its redemption promise. Algorithmic pegs without external collateral make that promise a mirror of their own demand - which is precisely what fails in a run.",
      "Ask who pays the yield. An above-market rate on a nominally risk-free asset is a subsidy, and the question that matters is what happens to the subsidy's beneficiaries when the subsidy stops.",
      "Run risk is the defining stablecoin risk. Redemption design determines whether a run is survivable: overcollateralized designs absorb it, algorithmic ones convert it into hyperinflation.",
      "Watch the backing asset's supply as an early-warning signal. Minting new tokens to defend a peg is the fire, not the fire brigade - by the time supply is visibly exploding, the peg is already gone.",
      "Concentration turns wobbles into collapses. Liquidity concentrated in a few pools and decisions concentrated in one founder meant there was no redundancy anywhere in the system."
    ],
    relatedLessonIds: [
      'stablecoins',
      'tokenomics',
      'lending-and-stables',
      'on-chain-analysis'
    ],
    links: [
      {
        title: "Terra (blockchain) - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Terra_(blockchain)",
        type: 'article',
        note: "Protocol design and the May 2022 collapse"
      },
      {
        title: "Do Kwon - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Do_Kwon",
        type: 'article',
        note: "The legal aftermath, through extradition and civil findings"
      },
      {
        title: "Stablecoins 2.0 (Klages-Mundt et al., arXiv)",
        url: "https://arxiv.org/abs/2006.08580",
        type: 'paper',
        note: "Foundational risk analysis of stablecoin designs, written before the crash"
      },
      {
        title: "Stablecoin (Investopedia)",
        url: "https://www.investopedia.com/terms/s/stablecoin.asp",
        type: 'article',
        note: "Collateralized versus algorithmic categories"
      }
    ]
  },
  {
    id: 'ftx-collapse',
    title: 'FTX: When the Exchange IS the Risk',
    hook: "The second-largest exchange in crypto was, it turned out, mostly an IOU to itself.",
    category: 'governance',
    outcome: 'failure',
    year: '2022',
    severity: 'critical',
    summary:
      "In November 2022, a leaked balance sheet revealed that FTX's trading arm Alameda was propped up by billions in FTT - a token FTX itself issued - and within days a roughly $6B withdrawal run exposed an ~$8B hole where customer funds should have been. FTX and about 130 affiliates filed for bankruptcy; founder Sam Bankman-Fried was convicted of fraud in 2023 and sentenced to 25 years in 2024. The collapse made proof-of-reserves a standing demand, reset custody and governance expectations for the industry, and became the reference point regulators reach for when they discuss exchange rules.",
    background:
      "FTX launched in 2019, built by Sam Bankman-Fried around his Alameda Research trading firm (founded 2017), and grew into one of the largest exchanges in crypto, valued at $32B in early 2022. During the 2022 downturn, SBF cultivated an image as the industry's white knight, extending bailouts to lenders like Voyager and BlockFi. Beneath the surface, there was no separation between customer custody funds and Alameda's trading capital: deposits flowed to Alameda and were spent, lent, and lost, while the FTT token FTX had issued sat on Alameda's balance sheet as collateral. Corporate controls were famously thin - personalized bookkeeping, no meaningful audit of the custody relationship, and effectively one person at the top of the exchange, the trading firm, and the token.\n\nThe end came in eight days. On November 2, 2022, CoinDesk published a leaked Alameda balance sheet showing roughly $5.8B in assets dominated by FTT and locked coins. On November 6, Binance announced it would liquidate its ~$580M of FTT, and customers ran: roughly $6B was withdrawn in about 72 hours. FTX halted withdrawals on November 8; Binance signed a letter of intent to acquire the exchange and abandoned it a day later after due diligence. On November 11, FTX, Alameda, and roughly 130 affiliates filed for Chapter 11, with an approximately $8B shortfall in customer funds. The new CEO, veteran restructuring lawyer John J. Ray III, wrote in court filings that he had never seen such a complete failure of corporate controls. SBF was arrested in the Bahamas in December 2022, convicted on seven counts in November 2023, and sentenced in March 2024 to 25 years with roughly $11B in forfeiture; Alameda CEO Caroline Ellison received a two-year sentence after cooperating, and co-founder Gary Wang also pleaded guilty and cooperated. The estate's recovery proved better than expected - a court-approved plan in 2024 committed to repaying most customer classes over 100% of their petition-date dollar value, with distributions beginning in 2025.",
    timeline: [
      {
        label: "2017-2019 - Origins",
        detail:
          "Alameda Research is founded as a crypto trading firm (2017); FTX launches as an exchange (2019) with the FTT token at its center. From the start, exchange operations and proprietary trading share people, capital, and incentives."
      },
      {
        label: "2022 - Reputation peak",
        detail:
          "FTX is valued at $32B, and SBF positions himself as the industry's stabilizer with bailouts of Voyager and BlockFi. Meanwhile customer deposits continue flowing to Alameda, and FTT dominates Alameda's asset base."
      },
      {
        label: "November 2, 2022 - The leak",
        detail:
          "CoinDesk publishes a leaked Alameda balance sheet: roughly $5.8B in assets, dominated by FTT and locked positions, with little visible cash. Analysts immediately flag the circularity - the exchange's own token backing the trading firm that shares its owner."
      },
      {
        label: "November 6-8 - The run",
        detail:
          "Binance announces it will sell its roughly $580M of FTT. Customers withdraw roughly $6B in about 72 hours; FTX halts withdrawals on November 8 and signs an acquisition letter of intent with Binance the same day."
      },
      {
        label: "November 9-11 - Collapse",
        detail:
          "Binance withdraws from the deal after due diligence. On November 11, FTX, Alameda, and roughly 130 affiliates file for Chapter 11; the filing reveals an approximately $8B customer shortfall, and SBF resigns as CEO."
      },
      {
        label: "December 2022 - November 2024 - Accountability",
        detail:
          "SBF is arrested in the Bahamas and extradited to the US. New CEO John J. Ray documents the control failures in court filings. SBF is convicted on seven counts in November 2023 and sentenced to 25 years with roughly $11B forfeiture in March 2024; Ellison receives two years, and Wang cooperates."
      },
      {
        label: "2024-2025 - Recovery",
        detail:
          "The court approves the estate's plan in 2024, committing most customer classes to repayment above 100% of petition-date dollar value. Distributions begin in 2025 - a better outcome than most expected, and no comfort to anyone who needed their money in November 2022."
      }
    ],
    rootCauses: [
      "Commingling: customer custody funds were treated as Alameda's working capital, with no segregation between exchange deposits and trading losses. The ~$8B hole was spending, not a hack.",
      "Circular collateral: FTT, a token FTX itself issued, served as Alameda's principal asset. The exchange's solvency was backed by its own printing press, and the loop hid insolvency until a withdrawal run forced it into the open.",
      "Governance failure: one person effectively controlled the exchange, the trading firm, and the token. Boards, auditors, and controls existed as decoration rather than as checks.",
      "Record-keeping vacuum: court filings describe personalized bookkeeping, unrecorded transfers, and missing documentation - at a $32B-valued company, the controls had never scaled past a startup.",
      "Concentrated trust with zero proof: customers treated exchange balances as bank deposits while no proof-of-reserves or third-party attestation existed. The run was rational."
    ],
    impact: [
      { label: 'Customer shortfall', value: '~$8B in customer funds unaccounted for at filing' },
      { label: 'Withdrawal run', value: '~$6B in roughly 72 hours before withdrawals were halted' },
      { label: 'Corporate perimeter', value: 'FTX, Alameda, and ~130 affiliates in Chapter 11' },
      { label: 'FTT crash', value: 'Token fell from roughly $25 to about $1 within two weeks' },
      { label: 'Criminal outcome', value: 'SBF: seven-count conviction (2023); 25-year sentence and ~$11B forfeiture (2024)' },
      { label: 'Recovery', value: 'Estate plan repays most customer classes over 100% of petition-date value' }
    ],
    lessons: [
      "Exchange balances are unsecured claims until proven otherwise. Proof-of-reserves - with liabilities, and ideally third-party attestation - became a minimum expectation across the industry after FTX.",
      "Custody segregation is an architecture, not a policy. Separate entities, separate keys, and separate ledgers make misuse impossible; written rules merely make it forbidden.",
      "Concentrated control plus an internal token is reflexive risk. When the exchange, the trading desk, and the collateral asset share an owner, there is no independent party left to say no.",
      "Controls must scale with success. FTX's bookkeeping practices that were quirks at $100M were catastrophic at $32B - governance debt compounds exactly like financial debt.",
      "The regulatory aftermath is durable: FTX became the canonical example in exchange licensing debates, custody rules, and congressional testimony, shaping how jurisdictions treat customer assets today."
    ],
    relatedLessonIds: [
      'daos-and-governance',
      'wallets-and-keys',
      'web3-security-basics',
      'ecosystem-map'
    ],
    links: [
      {
        title: "Collapse of FTX - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Collapse_of_FTX",
        type: 'article',
        note: "Chronology of the run, bankruptcy, and prosecutions"
      },
      {
        title: "Sam Bankman-Fried - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Sam_Bankman-Fried",
        type: 'article',
        note: "Biography and the criminal case through sentencing"
      },
      {
        title: "FTX - Wikipedia",
        url: "https://en.wikipedia.org/wiki/FTX",
        type: 'article',
        note: "The exchange itself, including the estate's recovery plan"
      }
    ]
  },
  {
    id: 'the-merge',
    title: 'The Merge: Retiring Proof-of-Work',
    hook: "Ethereum swapped its engine mid-flight - and most users never noticed.",
    category: 'infrastructure',
    outcome: 'breakthrough',
    year: '2022',
    severity: 'medium',
    summary:
      "On September 15, 2022, Ethereum executed the Merge, replacing proof-of-work with proof-of-stake at block 15537394 with zero downtime. Energy consumption fell an estimated ~99.95%, daily ETH issuance dropped roughly 90%, and the largest live protocol migration ever attempted completed essentially on schedule and without incident. The case is the reference example for coordinating a live upgrade at scale - and for the new trade-offs, chiefly staking centralization, that success created.",
    background:
      "Proof-of-stake had been in Ethereum's roadmap since its earliest design documents, but shipping it meant replacing the consensus engine of a network securing hundreds of billions of dollars while it was running. The strategy that made it tractable was two-phase: first, launch an entirely separate proof-of-stake chain - the Beacon Chain, live December 1, 2020 - and let it run in parallel for 21 months, tracking an empty ledger while thousands of validators staked 32 ETH each. Second, merge the existing execution layer into that consensus by defining a terminal proof-of-work block (via a total terminal difficulty of 58750000000000000000000) that the beacon chain would adopt as its first execution payload. The design split the problem: Casper FFG provided accountable, checkpointed finality on the consensus side, while the execution layer - and every contract and account on it - was left untouched.\n\nThe engineering discipline around the cutover was as much the story as the design. Multiple independent clients were built and cross-tested against a standardized engine API; the merge was rehearsed repeatedly on testnets and shadow forks through 2022; the terminal difficulty was announced in advance so everyone could verify the trigger; and withdrawals of staked ETH were deliberately deferred to a later upgrade (Shanghai/Capella, April 2023) to keep the merge surface minimal. On September 15, 2022, the terminal difficulty was reached at about 06:40 UTC; the first proof-of-stake execution block, 15537394, followed moments later, and finality was confirmed roughly 13 minutes after that. There was no downtime and no transaction disruption. There was also no price fork: ETH kept its ticker on the proof-of-stake chain, a small minority proof-of-work fork (ETHW) attracted little hashpower, and the network's energy use collapsed by an estimated ~99.95% (per the CCRI study commissioned around the merge). New risks arrived quietly in exchange: liquid staking providers came to hold a large share of validator stakes, client diversity remained imperfect, and MEV-boost relays concentrated block-building - centralization questions that are the direct descendants of the merge's success.",
    timeline: [
      {
        label: "December 1, 2020 - Beacon Chain genesis",
        detail:
          "The proof-of-stake consensus layer launches as a parallel chain with its own validator set and 32 ETH staking units. It tracks an empty ledger for months - a deliberate burn-in period to prove the new consensus can run before anything depends on it."
      },
      {
        label: "2021-2022 - Engineering the cutover",
        detail:
          "Client teams build the engine API and rehearse the merge on devnets, shadow forks, and public testnets (Ropsten, Sepolia, Goerli). Altair hardens the beacon chain's rules. The execution and consensus layers are integrated client by client."
      },
      {
        label: "August-September 2022 - Countdown",
        detail:
          "The Bellatrix upgrade activates on the beacon chain (September 6), and the terminal total difficulty is set to 58750000000000000000000. Mining pools publicly pledge not to resist the transition, and the industry watches a live countdown to the trigger."
      },
      {
        label: "September 15, 2022 - The Merge",
        detail:
          "Terminal difficulty is reached around 06:40 UTC; block 15537394 becomes the first proof-of-stake execution block, and finality is confirmed roughly 13 minutes later. Zero downtime, zero transaction disruption. Daily issuance falls from roughly 13,000 ETH to roughly 1,700 ETH."
      },
      {
        label: "April 12, 2023 - Withdrawals unlock",
        detail:
          "The Shanghai/Capella upgrade enables validators to withdraw staked ETH - a feature deliberately deferred so the merge itself carried minimal new code. The full staking lifecycle, from deposit to exit, is finally complete."
      },
      {
        label: "Aftermath - New trade-offs",
        detail:
          "The minority ETHW proof-of-work fork fizzles. Attention shifts to the risks proof-of-stake created: liquid staking concentration (with a single provider holding a large share of stakes), client supermajorities, and MEV-boost relay centralization - the merge's success made these the live debates."
      }
    ],
    rootCauses: [
      "PoW economics: proof-of-work security cost was dominated by electricity, and its ~13,000 ETH/day issuance subsidized an energy arms race. The roadmap wanted cheap consensus to leave room for rollup data availability.",
      "Two-phase migration: running the new consensus separately for 21 months before the cutover made the risk reversible and rehearsable - the single most important design choice for shipping it safely.",
      "Finality as a gadget: Casper FFG layered accountable checkpointed finality onto the existing execution layer, so the merge changed consensus without touching contracts or accounts.",
      "Client diversity and standardization: multiple independent implementations against one engine API prevented any single client bug from becoming a network event.",
      "Deliberate scope discipline: deferring staking withdrawals to a later fork kept the merge's blast radius small - shipping less was the risk management."
    ],
    impact: [
      { label: 'Cut-over', value: 'September 15, 2022; first PoS block 15537394; zero downtime' },
      { label: 'Energy', value: '~99.95% reduction in network energy use (CCRI estimate)' },
      { label: 'Issuance', value: '~13,000 to ~1,700 ETH/day (roughly 90% cut)' },
      { label: 'Validators', value: 'Over 400,000 active validators at merge time (32 ETH each)' },
      { label: 'Price fork', value: 'None; the minority ETHW proof-of-work fork faded' },
      { label: 'New risk', value: 'Staking concentration among liquid-staking providers and exchanges' }
    ],
    lessons: [
      "Massive live migrations are possible. Parallel-run architecture, repeated rehearsals, and a pre-announced, verifiable trigger turned the riskiest upgrade in crypto history into a quiet Tuesday morning.",
      "Proof-of-stake trades energy for economics: the electricity arms race is gone, but consensus is now wealth-weighted, and liquid staking concentrates stake in ways proof-of-work's mining pools foreshadowed.",
      "Deferred features are risk management. Pushing withdrawals to a later fork was criticized at the time and is now the case study in upgrade scope discipline.",
      "Coordination is a product. The merge succeeded because thousands of independent operators - client teams, node runners, exchanges, pools - upgraded against shared specs and public signals on a common schedule.",
      "Success creates its own problems: staking centralization, relay concentration, and client diversity are the merge's children. Every solved risk leaves a new one to govern."
    ],
    relatedLessonIds: [
      'consensus-internals',
      'ethereum-overview',
      'blockchain-basics',
      'scaling-l2s'
    ],
    links: [
      {
        title: "Mainnet Merge Announcement (Ethereum Foundation blog)",
        url: "https://blog.ethereum.org/en/2022/08/30/mainnet-merge/",
        type: 'article',
        note: "The official cut-over plan and terminal difficulty"
      },
      {
        title: "Ethereum - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Ethereum",
        type: 'article',
        note: "Platform history including the proof-of-stake transition"
      },
      {
        title: "Proof of stake - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Proof_of_stake",
        type: 'article',
        note: "Consensus mechanics and trade-offs versus proof-of-work"
      },
      {
        title: "Beacon Chain explorer (beaconcha.in)",
        url: "https://beaconcha.in/",
        type: 'tool',
        note: "Live validator, slot, and epoch data for the PoS layer"
      }
    ]
  },
  {
    id: 'tornado-cash',
    title: 'Tornado Cash: Sanctions Meet Privacy',
    hook: "Washington sanctioned a set of computer instructions - and the courts eventually pushed back.",
    category: 'governance',
    outcome: 'contested',
    year: '2022',
    severity: 'high',
    summary:
      "In August 2022, OFAC sanctioned Tornado Cash, a zk-SNARK privacy protocol, listing immutable smart-contract addresses - the first time US sanctions targeted code itself. The fallout was sweeping: a developer was arrested and later convicted in the Netherlands, two more were indicted in the US, and infrastructure from GitHub to USDC froze around the designations. Then the legal ground shifted - in November 2024 a US appeals court ruled that sanctioning immutable smart contracts exceeded Treasury's authority, and the designations were removed in March 2025. The case is the sharpest collision yet between censorship-resistant software and financial law, and both the privacy case and the laundering case deserve to be stated plainly.",
    background:
      "Tornado Cash, launched on Ethereum in 2019, is a non-custodial privacy protocol: users deposit fixed denominations of ETH into a pool, and withdrawals are made with zero-knowledge proofs that verify a valid deposit exists without revealing which one - severing the on-chain link between sender and recipient. The tool serves two constituencies at once, and honesty about both is required. On one side, privacy is a legitimate property: researchers, activists, and ordinary users have sound reasons to not broadcast their finances, and cash-like privacy has long been considered a normal feature of money. On the other, investigators documented that the protocol was heavily used by criminals: in its August 2022 designation, Treasury cited roughly $7B in virtual currency laundered through Tornado Cash since 2019, including a large share of the roughly $455M stolen in the Ronin bridge hack. Both statements are true of the same immutable code, which is exactly why the case became a referendum.\n\nThe state's response ran on several tracks at once. OFAC added the protocol's addresses - including immutable smart contracts that no one owns or controls - to the SDN list on August 8, 2022, an unprecedented act: sanctioning property that is not property in any conventional sense. Practical effects followed immediately: GitHub repositories were removed (and partially restored after protest), Circle froze roughly $75K of USDC in designated pools, and compliant services began blocking any interaction with the addresses. A censorship debate ignited inside Ethereum itself when, in early 2023, a majority of MEV-boost relays were producing OFAC-compliant blocks that excluded Tornado-related transactions. The human costs landed on developers: Alexey Pertsev was arrested in the Netherlands on August 10, 2022 and convicted in May 2024 to 64 months for laundering criminal proceeds through the protocol (under appeal); Roman Storm and Roman Semenov were indicted in the US in August 2023 on money-laundering, sanctions, and money-transmitting charges, with Semenov sanctioned and Storm convicted in August 2025 on the unlicensed money-transmitting count while the jury deadlocked on the other two. And the legal architecture partially unwound: in November 2024, the Fifth Circuit in Van Loon v. Treasury held that immutable smart contracts are not sanctionable 'property' under the relevant statute, and in March 2025 Treasury removed the Tornado Cash designations - leaving the developer-liability questions fully open.",
    timeline: [
      {
        label: "2019 - Launch",
        detail:
          "Tornado Cash ships fixed-denomination zk mixing on Ethereum: deposit into a pool, withdraw with a zero-knowledge proof. Non-custodial and immutable by design - once deployed, the core pools have no admin key."
      },
      {
        label: "2019-2022 - Mixed usage",
        detail:
          "Privacy-seeking users and criminal actors both adopt the protocol. Treasury's 2022 designation cites roughly $7B laundered since creation, including a large share of the Ronin hack proceeds; privacy advocates note the same math that hides launderers hides everyone."
      },
      {
        label: "August 8, 2022 - Sanctions on code",
        detail:
          "OFAC designates Tornado Cash addresses, including immutable smart contracts - the first US sanctions on blockchain code itself. GitHub repos are removed, Circle freezes roughly $75K of USDC in designated pools, and compliant services begin blocking interactions."
      },
      {
        label: "August 10, 2022 - Developer arrest",
        detail:
          "Alexey Pertsev is detained in the Netherlands on money-laundering allegations tied to the protocol. The arrest crystallizes the emerging question: what is the legal status of someone who wrote neutral, open-source code?"
      },
      {
        label: "2023 - Indictments and the censorship debate",
        detail:
          "Roman Storm and Roman Semenov are indicted in the US; Semenov is sanctioned. Meanwhile MEV-boost relays making OFAC-compliant blocks account for a majority of Ethereum blocks at points, forcing the community to confront how much censorship the network will tolerate at its edges."
      },
      {
        label: "2024 - Conviction and judicial pushback",
        detail:
          "A Dutch court convicts Pertsev in May and sentences him to 64 months (appeal follows). In November, the Fifth Circuit rules in Van Loon v. Treasury that sanctioning immutable smart contracts exceeded Treasury's statutory authority - the first major judicial correction to sanctions on code."
      },
      {
        label: "2025 - Unwinding, unresolved",
        detail:
          "Treasury removes the Tornado Cash designations in March. In August, a New York jury convicts Storm on one count (conspiring to operate an unlicensed money-transmitting business) while deadlocking on the money-laundering and sanctions counts. Developer liability and the future of compliant privacy remain open questions."
      }
    ],
    rootCauses: [
      "Neutral-by-design code: the protocol offers identical guarantees to privacy seekers and launderers, with no gatekeeping - so its illicit-use share became the policy hook, while its design left no one to hold responsible.",
      "Sanctions law met non-custodial code: asset-freezing frameworks built for persons and property had no coherent answer for immutable addresses that no one controls, producing a designation courts later ruled exceeded authority.",
      "Centralizable edges: the code could not be turned off, but its conveniences could - frontends, GitHub hosting, relayer networks, and USDC balances were the practical levers the state and companies pulled.",
      "Corporate-like elements invited operating-business theories: a funded team, maintained frontends, and a governance token gave prosecutors a money-transmitting narrative for the Storm case, distinct from the code itself.",
      "A privacy gap in compliant finance: with no widely adopted way to prove lawful origins while transacting privately, mixers remained the blunt instrument of choice for both legitimate privacy and laundering."
    ],
    impact: [
      { label: 'Flows cited', value: "~$7B laundered through the protocol since 2019, per Treasury's 2022 designation" },
      { label: 'Hack proceeds', value: 'A large share of the ~$455M Ronin haul routed through it, per investigators' },
      { label: 'First', value: 'First OFAC designation of immutable smart-contract addresses (August 2022)' },
      { label: 'Frozen', value: '~$75K USDC frozen in designated pools (Circle)' },
      { label: 'Developers', value: 'Pertsev: 64-month sentence (2024, on appeal); Storm: one-count conviction (2025)' },
      { label: 'Reversal', value: 'Fifth Circuit ruled designations exceeded authority (Nov 2024); delisting March 2025' }
    ],
    lessons: [
      "Censorship-resistance stops at the edges you do not control: relays, frontends, code hosting, and fiat rails are where compliance pressure actually binds. The chain stayed neutral; the world around it did not.",
      "Sanctioning code proved legally fragile. Policy tools must fit the technology, or courts will unwind them - Van Loon is now the leading precedent that immutable contracts are not sanctionable property.",
      "Developer liability is a live, unsettled question: writing and shipping neutral protocols can carry criminal exposure depending on control elements, business structures, and intent. Every open-source crypto team now has to think like a compliance officer.",
      "Privacy is a legitimate demand, not only a laundering tool - and the durable path forward is likely privacy technology that can prove compliance selectively, rather than the absence of privacy.",
      "Both things were true at once: the same immutable code protected ordinary users' privacy and laundered hundreds of millions for a hostile state's hacking unit. Cases like this demand precision, not slogans."
    ],
    relatedLessonIds: [
      'cryptography',
      'zk-applications',
      'daos-and-governance',
      'web3-security-basics'
    ],
    links: [
      {
        title: "Tornado Cash - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Tornado_Cash",
        type: 'article',
        note: "Protocol mechanics and the sanctions timeline"
      },
      {
        title: "OFAC Recent Actions (US Treasury)",
        url: "https://ofac.treasury.gov/recent-actions",
        type: 'article',
        note: "The August 2022 designation and March 2025 removal"
      },
      {
        title: "Zero-knowledge proof - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Zero-knowledge_proof",
        type: 'article',
        note: "The cryptography behind zk mixers"
      },
      {
        title: "Office of Foreign Assets Control (Investopedia)",
        url: "https://www.investopedia.com/terms/o/ofac.asp",
        type: 'article',
        note: "How sanctions designations work"
      }
    ]
  },
  {
    id: 'curve-vyper',
    title: 'Curve & the Vyper Compiler Reentrancy Bug',
    hook: "The bug was not in the audited contract - it was in the compiler that built it.",
    category: 'security',
    outcome: 'failure',
    year: '2023',
    severity: 'high',
    summary:
      "On July 30, 2023, attackers drained roughly $50-70M from three Curve Finance stable pools by exploiting a faulty reentrancy lock inside Vyper compiler versions 0.2.15 through 0.3.0 - a defect in code the projects never wrote and their audits never reviewed. Whitehat and MEV actors rescued additional funds still at risk and negotiated the return of most drained assets within days, while founder Michael Egorov's heavily levered CRV positions brought a market-wide liquidation cascade to the edge of reality. The case turned toolchain risk and dependency management into first-class security topics.",
    background:
      "Curve Finance operates the largest stableswap AMMs in DeFi, and its pools are written in Vyper, a Pythonic smart-contract language favored for its simplicity. Reentrancy protection in Vyper comes from a built-in @nonreentrant decorator that the compiler implements as an internal lock. That guarantee, however, is only as good as the compiler version producing the bytecode. Vyper's advisory after the incident confirmed that versions 0.2.15, 0.2.16, and 0.3.0 contained a bug allowing the reentrancy lock to fail under specific conditions - meaning contracts compiled with those versions believed they were protected when they were not. Several Curve stable pools (the alETH, msETH, and pETH pools) had been compiled with the vulnerable versions, while pools on other versions were untouched.\n\nThe exploit itself was almost a reprise of 2016: re-entering liquidity functions before state settled, siphoning roughly $50-70M across the three pools within hours. But the aftermath showcased a DeFi that had learned some reflexes. Whitehat and MEV actors front-ran further drains, securing tens of millions more that were still at risk, and within days a whitehat negotiated the return of the bulk of the stolen funds (keeping a 10% bounty in one widely reported deal). The scarier subplot was macro: Curve founder Michael Egorov had borrowed tens of millions of dollars against CRV collateral across multiple lending markets, and a CRV price collapse would have liquidated those positions and potentially cascaded through Aave, Frax, and Curve's own crvUSD. CRV slumped sharply during the crisis; the cascade did not materialize; and in August Egorov sold roughly 106M CRV in over-the-counter deals to de-lever. The lasting lesson was about trust boundaries: audits had reviewed the pools' source code, but nobody audits the compiler backend - and few teams even knew which compiler versions their deployed contracts used until the advisory went out.",
    timeline: [
      {
        label: "Pre-2023 - Trust in the toolchain",
        detail:
          "Curve's pools are compiled across several Vyper versions; the @nonreentrant decorator is treated as gospel. Audits review the pools' source code. The compiler backend that generates their bytecode is nobody's checklist item."
      },
      {
        label: "July 30, 2023 - The drain",
        confidence: 'inferred',
        detail:
          "The attacker exploits the faulty lock to re-enter liquidity functions in the alETH, msETH, and pETH stable pools, removing roughly $50-70M within hours (reporting varies on the pool-by-pool split). Pools compiled on non-vulnerable Vyper versions are untouched."
      },
      {
        label: "July 30-31 - The front-running rescue",
        detail:
          "Whitehat and MEV actors race the attacker to remaining vulnerable pools, securing tens of millions more. Vyper publishes its advisory confirming versions 0.2.15, 0.2.16, and 0.3.0 are affected, and projects across the ecosystem begin auditing which compiler versions their deployed contracts use."
      },
      {
        label: "July 31 - August 1 - The cascade scare",
        detail:
          "CRV slumps as markets price in the risk that Egorov's large CRV-collateralized loans across lending markets get liquidated, potentially cascading through Aave, Frax, and crvUSD. Bounty negotiations with the whitehat open."
      },
      {
        label: "August 2023 - Return and de-risk",
        detail:
          "The bulk of the drained funds is returned after negotiation, with one whitehat keeping a 10% bounty. Egorov sells roughly 106M CRV in OTC deals to reduce leverage, and the feared liquidation cascade fades."
      },
      {
        label: "Aftermath - Toolchain reckoning",
        detail:
          "Vyper ships corrected reentrancy locks; teams inventory compiler versions across deployed contracts and pin dependencies deliberately; auditors add toolchain verification to scope. The incident becomes the canonical example that your trust set includes your compiler."
      }
    ],
    rootCauses: [
      "Compiler defect: the reentrancy lock generated by Vyper 0.2.15/0.2.16/0.3.0 could fail to engage under specific conditions, silently voiding the decorator's guarantee at the bytecode level.",
      "Misplaced upstream trust: contracts and audits treated the language's built-in safety features as axioms, and nobody reviewed the compiler that translated audited source into executable bytecode.",
      "Version sprawl without inventory: pools were pinned to different Vyper versions, and many teams discovered their exposure only after the advisory - there was no live map of which deployed contracts used vulnerable builds.",
      "Concentrated founder leverage: Egorov's tens of millions in CRV-collateralized loans across multiple lending venues meant a pool exploit nearly became a market-wide liquidation cascade.",
      "Interconnected stablepool structure: shared liquidity and pricing relationships gave three niche pools a blast radius far beyond their own TVL."
    ],
    impact: [
      { label: 'Drained', value: '~$50-70M across three pools (reporting varies on exact totals)' },
      { label: 'Rescued', value: 'Tens of millions more secured by whitehat/MEV front-running' },
      { label: 'Returned', value: 'Most drained funds returned within days; 10% bounty in one negotiated case' },
      { label: 'Compiler versions', value: 'Three affected: Vyper 0.2.15, 0.2.16, and 0.3.0' },
      { label: 'CRV shock', value: 'Token slumped during the scare; ~106M CRV sold OTC to de-lever founder positions' },
      { label: 'Untouched', value: 'Pools compiled on non-vulnerable Vyper versions lost nothing' }
    ],
    lessons: [
      "Your trust set includes your compiler. Audits end where the toolchain begins; verify bytecode against source, track compiler advisories, and treat compiler upgrades as security events, not chores.",
      "Dependency management is security engineering. Maintain an inventory of compiler versions across every deployed contract - teams that had one responded to the advisory in hours; teams that did not found out from the exploit.",
      "Audits are necessary, not sufficient: they can only review code you know is being executed. The vulnerable logic here lived in a dependency nobody had put in scope.",
      "Concentrated founder leverage converts a protocol bug into a market-wide scare. Personal positions collateralized in the protocol's own token tie ecosystem stability to one person's margin call.",
      "Whitehat and MEV response worked this time - front-running saved tens of millions and negotiation recovered the rest. But it is luck-dependent, emergent, and no substitute for incident-response playbooks designed in advance."
    ],
    relatedLessonIds: [
      'security-auditing',
      'evm-internals',
      'smart-contracts-101',
      'defi-primitives'
    ],
    links: [
      {
        title: "Curve Vyper Rekt (Rekt News)",
        url: "https://rekt.news/curve-vyper-rekt/",
        type: 'article',
        note: "Incident write-up with pool-by-pool losses"
      },
      {
        title: "Curve Rekt (Rekt News, 2020)",
        url: "https://rekt.news/curve-rekt/",
        type: 'article',
        note: "Earlier Curve incident for context on the protocol's risk history"
      },
      {
        title: "Curve Finance - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Curve_Finance",
        type: 'article',
        note: "Protocol overview and the 2023 incidents"
      }
    ]
  }
]

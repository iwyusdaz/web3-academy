import type { Lesson } from "../types"

export const advancedLessons: Lesson[] = [
  {
    "id": "consensus-internals",
    "level": "advanced",
    "order": 1,
    "title": "Consensus Internals",
    "subtitle": "How proof-of-stake actually decides, finalizes, and punishes",
    "minutes": 26,
    "objectives": [
      "Explain how Ethereum proof-of-stake organizes validators into slots, epochs and committees, and what an attestation actually contains.",
      "Trace how LMD-GHOST fork choice and Casper FFG finality together produce a chain head and a finalized checkpoint.",
      "Reason about the two punishment mechanisms — slashing and the inactivity leak — and which failure each one targets.",
      "Describe how MEV-boost and proposer-builder separation changed who constructs blocks, and the trust that relays introduce.",
      "Evaluate restaking (EigenLayer) as a debated extension of proof-of-stake security."
    ],
    "sections": [
      {
        "heading": "Stake as the scarce resource",
        "paragraphs": [
          "Proof-of-stake replaces the energy expenditure of proof-of-work with an economic deposit. Anyone can become a validator by depositing exactly **32 ETH** into the deposit contract — a protocol constant, not a price — and running validator software with two key pairs: a hot signing key that votes, and a cold withdrawal key that controls funds. The protocol tracks all validators in a registry stored in beacon chain state, and activation of new validators is churn-limited so the set cannot change too fast.",
          "With roughly a million active validators as of 2026, the system cannot let everyone vote on every block. Instead validators are randomly assigned duties: one proposer per slot, plus committees of a few hundred validators that attest. Assignments are derived from RANDAO, a beacon-chain randomness source accumulated from validator signatures, so nobody can predict or fully engineer their future duties — a property the security model depends on.",
          "The security model is honest-majority: if validators controlling a majority of staked ETH follow the protocol, the chain stays live and final. That assumption is not taken on faith — everything in this lesson, from fork choice to slashing to the inactivity leak, is machinery for making it durable under adversarial pressure, network asynchrony, and honest mistakes alike. The rest of this lesson is a tour of that machinery, one mechanism at a time."
        ],
        "callout": {
          "type": "tip",
          "title": "Why exactly 32 ETH?",
          "body": "The deposit size is a protocol constant chosen to balance validator count against message overhead, not an investment minimum. Staking pools exist because few people hold 32 ETH, but pools are a social and economic layer on top — the protocol only ever sees individual 32 ETH validators."
        }
      },
      {
        "heading": "Slots, epochs and attestations",
        "paragraphs": [
          "Beacon chain time is cut into **slots** of 12 seconds and **epochs** of 32 slots (about 6.4 minutes). Each slot, one proposer builds and broadcasts a block; each epoch, every active validator attests exactly once as part of a committee. An attestation is small but dense: it votes for the head block (for fork choice) and for a source and target checkpoint (for finality), all in one signed object.",
          "A BLS signature aggregates, so thousands of attestations compress into one verifiable signature — the committee’s votes arrive as a bitfield plus a single aggregate. That is the only reason a million validators is practical: per slot, consensus processes a handful of aggregate objects rather than a million messages. It is also why Ethereum chose BLS rather than ECDSA for consensus — recall the trade-offs from the cryptography lesson.",
          "Timing matters economically. Validators earn slightly more when their attestation lands quickly, because rewards decay with inclusion delay, and proposers earn more for including attestations promptly. This creates a quiet latency competition among validators, separate from the louder MEV competition among block builders you will meet later in this track. In aggregate these micro-incentives shape real infrastructure: better-connected validators, lower-latency networks, and attestation services that specialize in landing votes fast."
        ],
        "list": [
          "Head vote: the block root the validator currently sees as the chain head.",
          "Target: the checkpoint at the current epoch boundary.",
          "Source: the last checkpoint the validator considers justified.",
          "Signature: a BLS signature, designed to aggregate across the whole committee."
        ]
      },
      {
        "heading": "LMD-GHOST: choosing the head",
        "paragraphs": [
          "When network delays produce two competing blocks, a fork choice rule picks the canonical one. Longest-chain rules misbehave under proof-of-stake, so Ethereum uses GHOST — Greedy Heaviest Observed Subtree. Starting at genesis, at every fork you follow the branch whose subtree carries the most attestation weight, not the one with the most blocks or the first block seen. The rule is deliberately indifferent to block height, because height is cheap to fake and weight is not.",
          "The LMD prefix means *latest message driven*: each validator contributes only through its most recent attestation, counted once. The head is therefore the block with the greatest total staked weight beneath it, recomputed live as new attestations arrive. Block height alone decides nothing, and a fork with fewer blocks can still win if more stake supports it. Old attestations expire from the calculation, which keeps the rule responsive rather than merely cumulative.",
          "The consequence is a two-tier guarantee. Below the latest finalized checkpoint, the head can still reorganize by a few slots under asynchrony — finality there is only probabilistic. Above it, the chain is deterministic. Understanding which regime you are in is essential when building anything that reacts to reorgs, such as exchanges, bridges or oracle relayers. Exchanges and bridges therefore wait for finality before crediting deposits, while L2 systems design around the probabilistic window below it."
        ]
      },
      {
        "heading": "Casper FFG: checkpoints and finality",
        "paragraphs": [
          "Casper FFG overlays a finality gadget on the fork choice. At epoch boundaries, two-thirds of staked ETH must vote a **source** checkpoint to a **target** checkpoint; that supermajority link makes the target *justified*. A justified checkpoint whose successor is also justified becomes *finalized*. Under normal network conditions finality takes about two epochs — roughly 13 minutes from proposal to irreversible.",
          "Finality is economic irreversibility with accountability. Conflicting with a finalized checkpoint requires at least one-third of staked ETH to provably violate rules, which the protocol destroys. In proof-of-work, reversal is a question of hash power; here it is a question of identity, and the attacking validators can be named, slashed and ejected from the set. This is what makes reorg attacks on finalized history economically self-defeating rather than merely difficult.",
          "The nightmare scenario is two conflicting finalized chains — so-called dueling finality. The protocol cannot resolve that on its own; the community must choose one history while the other side loses funds through slashing. Design treats this as existential, which is exactly why the inactivity leak exists to prevent permanent splits rather than merely punish them. Every serious post-mortem of consensus incidents is a story about avoiding exactly this state."
        ],
        "callout": {
          "type": "deep-dive",
          "title": "Justified versus finalized",
          "body": "Justification is the step toward finality: a checkpoint is justified when two-thirds of stake vote for it as target from a justified source, and finalized once the next epoch builds on that link. Casper calls this accountable safety — safety violations are not just impossible without cost, they are attributable to specific slashed validators."
        }
      },
      {
        "heading": "Slashing and the inactivity leak",
        "paragraphs": [
          "Two behaviors are provably bad and therefore **slashable**: proposing two different blocks for the same slot, and casting contradictory attestations — double voting, or surrounding votes that skip backward past your own earlier source. Both require signatures, so violations are undeniable evidence. Slashing burns part of the stake and force-ejects the validator from the set. Evidence, not accusation, drives the penalty — the signatures are the proof.",
          "The penalty is correlated: it scales with how many other validators were slashed around the same time. A lone honest mistake costs a little; a coordinated attack costs the attackers a large fraction of their stake. This single design choice converts attempted attacks from profitable gambits into catastrophic losses, and it is why slashing is rare in practice. It also makes slashing insurance markets possible, since correlated risk can be quantified and priced.",
          "The **inactivity leak** handles partitions and mass outages. If the chain fails to finalize for more than four epochs, validators who are not participating gradually lose stake — quadratically over time — until the remaining active set again holds two-thirds and finality resumes. After a partition heals, the smaller side has been bled until it can rejoin consensus. No human intervention is required, by design."
        ],
        "callout": {
          "type": "warning",
          "title": "You can slash yourself by accident",
          "body": "Running the same validator keys on two machines, or migrating a node without stopping the old one, can produce a double vote and a real slashing. Operators rely on slashing protection databases that refuse to sign contradictory messages. Staking is infrastructure work, not passive income."
        }
      },
      {
        "heading": "MEV-boost, PBS and the market for blocks",
        "paragraphs": [
          "Building the most profitable block became a specialized industry: searchers find MEV opportunities, builders assemble full blocks, relays transmit them. MEV-boost, an out-of-protocol sidecar, lets proposers auction the right to fill their slot: they receive block headers with bids attached, blindly sign the highest bid, and collect the payment when the payload is revealed. The proposer never sees the transactions it is signing — that is the point and the problem.",
          "This is **proposer-builder separation (PBS)** in practice: the right to order transactions is separated from the duty to propose. Since late 2022 roughly nine in ten Ethereum blocks have been built through MEV-boost, which makes relays — trusted intermediaries serving headers and passing payments — a critical and heavily criticized point of centralization. Nine in ten is not a statistic; it is the market structure of block production.",
          "The economic argument is efficiency and neutrality: proposers no longer need a latency arms race or a professional MEV desk to earn fair value for their slot. The cost is concentration — a small set of dominant builders and relays, where censorship pressure now sits. Enshrining PBS in protocol (ePBS) is an active roadmap debate as of 2026. Either way, the auction has already changed who profits from Ethereum blocks."
        ]
      },
      {
        "heading": "Restaking: reusing the security budget?",
        "paragraphs": [
          "EigenLayer lets stakers opt in to additional slashing conditions in order to secure other services — AVSs (actively validated services) such as oracles, bridges or data availability layers. In effect the same 32 ETH now backs multiple security commitments at once, and services that could never bootstrap their own validator set can rent Ethereum’s. Opting in is the key phrase: the base 32 ETH stake is untouched unless the staker consents.",
          "Advocates describe an open marketplace for security; critics warn of *overloading consensus*: if restaked liabilities exceed the stake actually backing them, a systemic failure in an AVS could cascade into Ethereum core security. There are also concerns about economic coercion — validators effectively pressured into following service rules they never chose — and about the governance concentration of the restaking platform itself.",
          "As of 2026 restaking is significant but genuinely contested, and its long-run effects are unresolved. The honest mental model: security is a budget, not a commodity that duplicates for free. When a service claims free security from restaking, ask who absorbs the tail risk — because someone always does, and it is usually the stakers. The debate is ongoing, and credible published analyses exist on both sides."
        ]
      }
    ],
    "keyTerms": [
      {
        "term": "Validator",
        "definition": "A 32 ETH deposit plus keys that proposes blocks and attests in proof-of-stake; the atomic unit of consensus participation."
      },
      {
        "term": "Slot / epoch",
        "definition": "A 12-second block opportunity (slot); 32 slots (about 6.4 minutes) form an epoch, the unit of committee assignment and finality."
      },
      {
        "term": "Attestation",
        "definition": "A validator's signed vote containing a head vote plus source and target checkpoints, aggregatable via BLS."
      },
      {
        "term": "LMD-GHOST",
        "definition": "Fork choice rule that follows the subtree with the most attestation weight, counting each validator only via its latest message."
      },
      {
        "term": "Casper FFG",
        "definition": "The finality gadget: two-thirds supermajority links justify checkpoints, and chained justifications finalize them."
      },
      {
        "term": "Slashing",
        "definition": "Destruction of stake for provable misbehavior (double proposal, double or surround vote), with penalties scaled to the number of simultaneous offenders."
      },
      {
        "term": "Inactivity leak",
        "definition": "Quadratic draining of non-participating validators when finality stalls beyond four epochs, restoring a two-thirds active majority automatically."
      },
      {
        "term": "Proposer-builder separation",
        "definition": "Splitting block construction (builders) from block proposal (validators), mediated today by MEV-boost and trusted relays."
      }
    ],
    "practices": [
      {
        "id": "consensus-internals-p1",
        "title": "Read a live attestation",
        "goal": "See real consensus data with your own eyes on a public beacon explorer.",
        "steps": [
          "Open https://beaconcha.in in a browser; no wallet or account is needed.",
          "Go to the Blocks page and open a recently finalized slot (look for the finalized marker a few thousand slots back).",
          "Note the proposer index, and whether the block was built via MEV-boost (builder/relay labels are usually shown).",
          "Open the Attestations tab on that block and count how many distinct attestations were included.",
          "Pick one attestation and record its committee index, slot, and the source and target checkpoints it votes for.",
          "Compare the attestation source checkpoint with the currently finalized checkpoint on the front page."
        ],
        "caution": "Read-only exploration. Never connect a wallet to an explorer site — viewing data requires no signature."
      },
      {
        "id": "consensus-internals-p2",
        "title": "Watch finality happen",
        "goal": "Observe justification and finality advance in real time, and connect it to the leak mechanism.",
        "steps": [
          "On beaconcha.in, note the current justified and finalized epochs.",
          "Return about 30 minutes later and record the new values.",
          "Verify finalization advanced by roughly five epochs (one epoch is about 6.4 minutes).",
          "Research a historical non-finalization incident (for example May 2023) and how long finality was delayed.",
          "Write two sentences on what the inactivity leak would have done had that incident lasted for days."
        ]
      }
    ],
    "resources": [
      {
        "title": "Proof-of-stake — ethereum.org",
        "url": "https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/",
        "type": "docs",
        "note": "Official reference for PoS roles, epochs and finality."
      },
      {
        "title": "Ethereum consensus specifications",
        "url": "https://github.com/ethereum/consensus-specs",
        "type": "docs",
        "note": "The actual protocol spec — dense but authoritative."
      },
      {
        "title": "Why Proof of Stake (Vitalik Buterin)",
        "url": "https://vitalik.ca/general/2020/11/06/pos201.html",
        "type": "article",
        "note": "The economic case, written pre-Merge."
      },
      {
        "title": "Staking — ethereum.org",
        "url": "https://ethereum.org/en/staking/",
        "type": "docs",
        "note": "Solo staking vs pooled options, with risk framing."
      },
      {
        "title": "Rewards and penalties — ethereum.org",
        "url": "https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/rewards-and-penalties/",
        "type": "docs",
        "note": "Exact incentive mechanics for attestations."
      }
    ],
    "quiz": [
      {
        "id": "consensus-internals-q1",
        "prompt": "A checkpoint on Ethereum is finalized. What exactly does that guarantee?",
        "options": [
          "No block below it can ever be reorganized under any circumstances.",
          "Reversing it would require at least one-third of staked ETH to be provably destroyed, plus social coordination.",
          "Every node has finished executing all transactions in it.",
          "A simple majority of stakers attested to it once."
        ],
        "correctIndex": 1,
        "explanation": "Finality is economic and accountable: a conflicting history implies at least a third of stake violated slashing rules, so those funds burn. Execution completeness is unrelated — finality is a consensus property, not a computation property."
      },
      {
        "id": "consensus-internals-q2",
        "prompt": "Why does the protocol include an inactivity leak at all?",
        "options": [
          "To punish offline validators and generate protocol revenue.",
          "To automatically restore finality after a partition by draining inactive validators until the active set again holds two-thirds.",
          "To deter MEV extraction during congestion.",
          "To replace slashing for double voting."
        ],
        "correctIndex": 1,
        "explanation": "The leak exists for liveness, not punishment: when a partition prevents finality, bleeding inactive stake re-establishes a two-thirds supermajority on the larger side. It is deliberately slow and quadratic to give the network time to heal before funds are destroyed."
      },
      {
        "id": "consensus-internals-q3",
        "prompt": "Under LMD-GHOST, how is the canonical head chosen when forks exist?",
        "options": [
          "The branch with the highest block number, as in longest-chain rules.",
          "The block proposed by the validator holding the most total stake.",
          "The branch whose subtree carries the most attestation weight, counting each validator only via its latest message.",
          "A random lottery weighted by committee membership."
        ],
        "correctIndex": 2,
        "explanation": "GHOST follows the heaviest subtree by attestation weight; LMD means each validator contributes only through its most recent vote. Height alone is never the criterion — a longer fork with less attested weight loses."
      },
      {
        "id": "consensus-internals-q4",
        "prompt": "In MEV-boost, what does a proposer trust when it blind-signs a block header it did not build?",
        "options": [
          "That every transaction in the block is valid — proposers verify execution before signing.",
          "That the relay will serve the payload it committed to and pay the promised bid.",
          "That the builder is licensed by the Ethereum Foundation.",
          "Nothing — headers are fully verified by consensus rules."
        ],
        "correctIndex": 1,
        "explanation": "Proposers sign a header without seeing its contents and rely on the relay to hand over the matching payload and pay out. That trust in relays — not execution validity — is the central criticism of PBS as deployed today."
      }
    ]
  },
  {
    "id": "evm-internals",
    "level": "advanced",
    "order": 2,
    "title": "The EVM Internals",
    "subtitle": "Inside the 256-bit stack machine that runs the world’s contracts",
    "minutes": 26,
    "objectives": [
      "Describe the EVM as a deterministic 256-bit stack machine and situate memory, storage, calldata and transient storage.",
      "Predict storage slot layout for structs with packed fields, and locate mapping and dynamic-array data.",
      "Connect gas costs (SLOAD 2100, SSTORE 20000, CALL 2600, keccak256) to the real costs they price: state growth and state access.",
      "Explain precompiles and evaluate why the EVM became the default target for new chains, compared with SVM and MoveVM."
    ],
    "sections": [
      {
        "heading": "One computer, re-executed everywhere",
        "paragraphs": [
          "The EVM is a **stack machine**: operands are pushed and popped from a stack capped at 1024 items, with no registers and no addressable stack. Every full node executes every transaction and must reach the same result — determinism is the whole game. That is why there is no randomness, no clock and no I/O: every input must live in state or in the transaction itself, and anything else must arrive as signed data via oracles.",
          "Words are **256 bits** wide. The choice predates efficiency concerns: 256 bits matches the Keccak-256 output size, softens elliptic-curve arithmetic, and simplifies specifications. The price is awkward mapping onto 64-bit hardware — every native addition becomes multi-precision arithmetic under the hood, one reason EVM chains benchmark poorly against designs built around machine words. The EVM effectively runs a software big-integer arithmetic unit on hardware that was not built for it.",
          "World computer is a literal description: state is one giant Merkle tree (the state trie) keyed by account, and a single 32-byte root in each block header commits to the entire system. That root is what makes light clients, state proofs and everything in the rollup lessons cryptographically possible — one number attests to terabytes of live state. Everything downstream — light clients, state proofs, rollups — leans on that single root."
        ],
        "callout": {
          "type": "deep-dive",
          "title": "Why 256 bits stuck",
          "body": "Changing word size today would break every contract, tool and precompile interface at once. EVM compatibility is defined down to the word size — which is why competitors who argue against the design often copy it anyway, and why equivalence (same bytecode, same behavior) is a stronger claim than compatibility marketing."
        }
      },
      {
        "heading": "The data locations",
        "paragraphs": [
          "Each location has a distinct lifetime and cost. The **stack** holds ephemeral operands. **Memory** is a byte-addressable scratchpad cleared between message calls, whose expansion cost grows roughly quadratically. **Calldata** is the read-only input bytes of a call — cheaper than memory for passing arguments. **Storage** is the persistent key/value store mapping 2^256 slots to 32-byte words, and it is where most gas and security bugs live.",
          "Storage is expensive by design because it is the part of the world computer that never goes away. Reading a cold slot costs **2,100 gas** (EIP-2929); writing a fresh nonzero value costs **20,000 gas** — every nonzero byte in the state trie is permanent, replicated data that every node must store and serve forever, so the protocol prices its creation accordingly.",
          "EIP-1153 added **transient storage** (TLOAD/TSTORE) with the Cancun upgrade: values that behave like storage within a transaction but are discarded at its end. It is cheaper than storage for cross-call flags such as reentrancy locks, and it slots into the same mental model without polluting the persistent trie — a good default for temporary cross-contract coordination. Treat it as the default for transaction-scoped flags, and storage for anything that must outlive the call."
        ],
        "table": {
          "headers": [
            "Location",
            "Lifetime",
            "Cost profile",
            "Typical use"
          ],
          "rows": [
            [
              "Stack",
              "One call frame",
              "Free but limited (1024 items)",
              "Arithmetic, immediate operands"
            ],
            [
              "Memory",
              "One transaction/message",
              "Grows with expansion, quadratic-ish",
              "Intermediate data, ABI decoding"
            ],
            [
              "Calldata",
              "One call",
              "Cheapest input channel",
              "Function arguments, batch payloads"
            ],
            [
              "Transient (TSTORE)",
              "One transaction",
              "Cheap, non-persistent",
              "Reentrancy locks, temporary flags"
            ],
            [
              "Storage",
              "Forever",
              "SLOAD 2100 cold; SSTORE 20000 new",
              "State that must survive"
            ]
          ]
        }
      },
      {
        "heading": "Storage slots and packing",
        "paragraphs": [
          "State variables occupy slots assigned in declaration order, starting at zero. The compiler **packs** variables smaller than 32 bytes into the same slot when they fit contiguously — two uint128s share one slot, but a uint128 followed by a uint256 cannot. Mappings and dynamic arrays reserve a single root slot and store their actual elements elsewhere, at hashes computed from the root slot.",
          "The two golden formulas: a mapping value for key k at root slot s lives at keccak256(k || s), and element i of a dynamic array at root slot s lives at keccak256(s) + i. Everything else is the same 32-byte slot arithmetic. Foundry exposes all of it: cast storage reads any slot of any contract, and forge inspect storage-layout prints the compiler’s plan.",
          "Packing is worth internalizing because it changes costs measurably: one SLOAD reads both halves of a packed slot, so grouping small fields together reduces gas in hot paths. Conversely, careless ordering — a uint256, then a bool, then a uint256 — wastes entire slots, a real cost paid on every touch of the contract for its whole lifetime. The compiler will not warn you about a wasteful layout; only reading the slot map will."
        ],
        "code": {
          "lang": "solidity",
          "code": "struct LayoutDemo {\n    uint128 a;  // slot 0 (packed with b)\n    uint128 b;  // slot 0\n    uint256 c;  // slot 1\n    mapping(address => uint256) balances; // root: slot 2\n    uint256[] vals;                       // root: slot 3\n}\n// balances[user] lives at keccak256(abi.encode(user, uint256(2)))\n// vals[i] lives at keccak256(uint256(3)) + i",
          "caption": "Slot layout: packing pairs up small fields; mappings and arrays hash their way to their data."
        }
      },
      {
        "heading": "Gas metering as pricing policy",
        "paragraphs": [
          "Storage slots are public and predictable — anyone with an address and slot arithmetic can read your private variables, because *private in Solidity means private to other contracts, not to the world*. There is no on-chain confidentiality, only obfuscation that a determined reader with cast storage defeats in seconds. This surprises developers coming from web2, where private fields are private to the process — here the ledger is world-readable by design.",
          "Gas is a price list attached to execution. The stable anchors: cold **SLOAD 2,100**, warm 100; **SSTORE** 20,000 for a new nonzero value; a cold **CALL 2,600**; **KECCAK256** costs 30 plus 6 per 32-byte word; memory expansion grows quadratically. Since EIP-1559, the base fee is burned rather than paid to proposers, partially recycling congestion costs to all ETH holders. Read the gas schedule as a policy document and the design intent becomes visible.",
          "The numbers encode policy, not just hardware. State access is priced high because unpriced state growth would let cheap transactions permanently bloat every node — the 2016-era state growth concern is exactly why storage writes cost 20,000 rather than a few hundred. Gas is the mechanism that makes permanent data expensive to create and cheap to compute over. Once you see gas as policy, repricing debates read as arguments about what Ethereum wants to make expensive.",
          "Block gas limits bound per-block work: as of 2026 they sit in the tens of millions and are periodically raised by validator vote, with a separate fee market for blobs (lesson 3). A transaction that exceeds its allowance reverts but still pays for gas consumed — the meter keeps running even when the call fails, which is also why simulation matters before broadcasting."
        ]
      },
      {
        "heading": "The opcodes that define the machine",
        "paragraphs": [
          "Most execution is arithmetic and flow control, but a handful of opcodes define the EVM’s character. **CALL** and **DELEGATECALL** are how contracts compose: CALL transfers control and context, so msg.sender becomes the callee. DELEGATECALL executes the callee’s code in the caller’s storage and context — the mechanism behind every proxy pattern, and a recurring bug source when the target is attacker-controlled.",
          "KECCAK256 is the glue of the whole system: it derives storage locations for mappings, hashes messages before signatures, and builds the Merkle structures that commit to state. SSTORE refunds once caused griefing attacks and were curtailed by EIP-3529. CREATE2 enables deterministic addresses — the basis of counterfactual deployment used heavily by smart accounts, which you will meet in the account abstraction lesson."
        ],
        "table": {
          "headers": [
            "Opcode",
            "Cost (approx.)",
            "Why it matters"
          ],
          "rows": [
            [
              "SLOAD (cold/warm)",
              "2,100 / 100",
              "Pricing state access is the core of EIP-2929"
            ],
            [
              "SSTORE (new nonzero)",
              "20,000",
              "Prices permanent state growth"
            ],
            [
              "CALL (cold account)",
              "2,600",
              "Base cost of every external interaction"
            ],
            [
              "KECCAK256",
              "30 + 6/word",
              "Hashing drives storage, signatures, tries"
            ],
            [
              "DELEGATECALL",
              "Same as CALL",
              "Context-preserving composition; proxies"
            ],
            [
              "CREATE2",
              "32,000 base",
              "Deterministic, counterfactual addresses"
            ]
          ]
        }
      },
      {
        "heading": "Precompiles: native crypto at fixed addresses",
        "paragraphs": [
          "Precompiles are implementations at special addresses (0x01 through 0x0a today) executed natively by the client rather than as EVM bytecode: ecrecover, SHA-256, RIPEMD-160, identity, big-integer modular exponentiation, BN254 curve add/mul/pairing, BLAKE2f, and — since EIP-4844 — the KZG point evaluation used for blob proofs. They give the EVM heavy cryptographic primitives at a fraction of bytecode cost. Proxy patterns, diamond facets and minimal clones are all variations on these two instructions.",
          "Adding one is a consensus hard fork with network-wide security review: a bug in a precompile breaks every client, not one contract. That friction is why the list grows slowly, and why alternative routes (such as RIP-7212 for P-256 verification, needed by passkeys in lesson 8) matter so much for the roadmap. If you remember one opcode relationship, make it this one: keccak is how the machine addresses everything, including its own state."
        ]
      },
      {
        "heading": "Why the EVM became the default target",
        "paragraphs": [
          "New chains overwhelmingly ship EVM compatibility because the ecosystem is the moat: Solidity and Vyper, Foundry and Hardhat, deep auditor experience, wallet and indexer support, and battle-tested bytecode. EVM-equivalence — accepting the exact bytecode with identical semantics — is the strong version of the claim, and chains compete to be *more* equivalent than their rivals. The tooling moat compounds yearly: every auditor trained, every wallet shipped, every tutorial written reinforces it.",
          "Contrast the neighbors. Solana’s SVM executes transactions in parallel using explicitly declared account access lists, trading default composability for throughput, on a different word size and programming model. MoveVM’s linear resource types make double-spends unrepresentable in the type system — elegant, but with a far smaller tooling and auditor pool to draw on. Each design is rational on its own terms; they simply optimize for different bottlenecks.",
          "The honest assessment: the EVM is neither the fastest nor the most elegant design — serial execution and 256-bit words cost real performance, and its quirks are baked into thousands of deployed contracts. But design wins are network-effect wins, and as of 2026 the EVM remains the lingua franca, with rivals increasingly competing on its tooling rather than its bytecode."
        ]
      }
    ],
    "keyTerms": [
      {
        "term": "Stack machine",
        "definition": "A compute model where operations consume and produce stack values; the EVM caps its stack at 1024 items and has no registers."
      },
      {
        "term": "256-bit word",
        "definition": "The EVM’s native word size, chosen to match Keccak-256 output and simplify crypto arithmetic at the cost of hardware efficiency."
      },
      {
        "term": "Calldata",
        "definition": "The read-only input bytes of a call — the cheapest way to pass arguments into a contract."
      },
      {
        "term": "Storage slot",
        "definition": "One 32-byte cell in a contract’s persistent store; slots are publicly readable and predictable from the declaration layout."
      },
      {
        "term": "Slot packing",
        "definition": "Compiler optimization that fits multiple sub-32-byte fields into one slot; one SLOAD then covers them all."
      },
      {
        "term": "SLOAD",
        "definition": "Reads a storage slot: 2,100 gas cold, 100 warm after EIP-2929 — pricing that reflects the permanent cost of serving state."
      },
      {
        "term": "DELEGATECALL",
        "definition": "Executes another contract’s code in the caller’s storage and context; the engine of proxy patterns and of classic delegatecall bugs."
      },
      {
        "term": "Precompile",
        "definition": "A native implementation at a fixed low address (ecrecover, pairing checks, KZG evaluation) added only via hard fork."
      }
    ],
    "practices": [
      {
        "id": "evm-internals-p1",
        "title": "Read and compute real storage slots",
        "goal": "Prove to yourself that storage is public, predictable, and inspectable with standard tooling.",
        "steps": [
          "Install Foundry and run forge init to create a scratch project.",
          "Write a contract with a packed struct — two uint128 fields, one uint256, a mapping, and a dynamic array — as shown in the lesson.",
          "Run forge inspect <ContractName> storage-layout and check the compiler’s slot assignments against your own prediction.",
          "Deploy the contract to a public testnet with forge create, using a throwaway key funded from a faucet.",
          "Run cast storage <address> 0 to read the packed slot, and decode the two uint128 halves.",
          "Compute the mapping slot for your address with cast keccak (ABI-encoding key and slot number) and read it with cast storage.",
          "Change a value in a transaction, then re-read the slot and identify exactly which bytes changed."
        ],
        "caution": "Testnet and throwaway keys only. Never deploy experiments from a funded account."
      }
    ],
    "resources": [
      {
        "title": "Ethereum Virtual Machine (EVM) — ethereum.org",
        "url": "https://ethereum.org/en/developers/docs/evm/",
        "type": "docs",
        "note": "Official overview including opcodes and gas."
      },
      {
        "title": "Layout of State Variables in Storage — Solidity docs",
        "url": "https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html",
        "type": "docs",
        "note": "The canonical packing and mapping-slot rules."
      },
      {
        "title": "EIP-2929: Gas cost increases for state access",
        "url": "https://eips.ethereum.org/EIPS/eip-2929",
        "type": "article",
        "note": "Where the 2,100 cold SLOAD figure comes from."
      },
      {
        "title": "Precompiled contracts — ethereum.org",
        "url": "https://ethereum.org/en/developers/docs/gas/precompiled/",
        "type": "docs",
        "note": "List and purpose of every precompile."
      },
      {
        "title": "Foundry Book",
        "url": "https://book.getfoundry.sh",
        "type": "tool",
        "note": "forge inspect and cast storage are your slot-reading tools."
      }
    ],
    "quiz": [
      {
        "id": "evm-internals-q1",
        "prompt": "Which data location survives the end of a transaction?",
        "options": [
          "Memory",
          "Calldata",
          "Transient storage (TSTORE)",
          "Storage"
        ],
        "correctIndex": 3,
        "explanation": "Only storage persists beyond the transaction; memory and stack are per-call, calldata is read-only input, and transient storage is explicitly wiped at transaction end. That permanence is exactly why storage writes cost 20,000 gas."
      },
      {
        "id": "evm-internals-q2",
        "prompt": "A struct contains uint128 a; uint128 b; uint256 c. How many 32-byte storage slots does it occupy?",
        "options": [
          "1",
          "2",
          "3",
          "It depends on the values stored"
        ],
        "correctIndex": 1,
        "explanation": "The two uint128s pack together into slot 0 (they total exactly 32 bytes), and c occupies slot 1. Slot count depends on declaration order and types, never on runtime values."
      },
      {
        "id": "evm-internals-q3",
        "prompt": "Why is a cold SLOAD priced at 2,100 gas rather than a few dozen?",
        "options": [
          "Because reading memory is intrinsically slow on validators.",
          "To price the permanent burden of state: every slot is replicated data all nodes must store and serve.",
          "To discourage use of mappings versus arrays.",
          "It is an arbitrary number chosen by client developers."
        ],
        "correctIndex": 1,
        "explanation": "EIP-2929 repriced state access to reflect the real costs of unbounded state growth. Computation got cheaper over time while state access stayed expensive — a deliberate policy, not a hardware measurement."
      },
      {
        "id": "evm-internals-q4",
        "prompt": "What distinguishes DELEGATECALL from CALL?",
        "options": [
          "DELEGATECALL is cheaper and reserved for library contracts.",
          "DELEGATECALL executes the target’s code in the caller’s storage and context, preserving msg.sender.",
          "DELEGATECALL cannot send value.",
          "DELEGATECALL creates a new account context."
        ],
        "correctIndex": 1,
        "explanation": "DELEGATECALL borrows code but keeps the caller’s state and context — which is what makes proxies work, and what makes a delegatecall into an attacker-controlled address catastrophic: the attacker’s code runs with your storage."
      }
    ]
  },
  {
    "id": "rollup-internals",
    "level": "advanced",
    "order": 3,
    "title": "Rollups in Depth",
    "subtitle": "Sequencers, blobs, proofs — and what Stage 2 actually buys you",
    "minutes": 27,
    "objectives": [
      "Trace a transaction from L2 submission through sequencing, batching, data availability and proof verification on L1.",
      "Compare fraud proofs and validity proofs and articulate the latency, trust and cost trade-offs.",
      "Explain blob-carrying transactions (EIP-4844) and the danksharding trajectory for data availability.",
      "Assess rollup decentralization using escape hatches, forced inclusion and the L2Beat stage framework."
    ],
    "sections": [
      {
        "heading": "The rollup execution model",
        "paragraphs": [
          "A rollup moves execution off L1 while keeping settlement and data on it. A **sequencer** receives transactions, orders and executes them, and posts compressed batches of data to Ethereum. A set of L1 contracts tracks the rollup’s state root and verifies proofs that transitions are valid — or waits for challenges if the system is optimistic. Those L1 contracts are the settlement layer: they hold deposits, verify proofs, and enforce rules the operator cannot quietly change. Those settlement contracts are the constitutional layer: what they enforce is what users can rely on.",
          "Users pay L2 fees that mostly cover L1 data costs plus amortized proof verification. Because data is compressed and shared across thousands of transactions, fees drop by an order of magnitude or more, while throughput is bounded by the sequencer rather than by Ethereum itself. In fee terms, a transaction that might cost a dollar on L1 can settle for cents when its data shares a batch with hundreds of others. Compression works because most transaction bytes are redundant signatures, addresses and amounts that batch together very well indeed.",
          "The design tension is trust. The more the L1 can verify without trusting anyone, the more secure the rollup; the more the sequencer does off the books, the more you depend on its honesty and uptime. Everything in this lesson — proofs, blobs, escape hatches, stage ratings — is about shrinking that trusted set as far as engineering allows, which is why serious analysts grade rollups on trust assumptions and escape hatches first, and throughput numbers second. Every mechanism below — proofs, blobs, forced inclusion — is a tool for shrinking that trusted set one piece at a time."
        ]
      },
      {
        "heading": "The sequencer bottleneck",
        "paragraphs": [
          "As of 2026, most major rollups run a single sequencer operated by the team. It delivers fast soft confirmations and orderly execution — but it can censor, reorder for MEV, or go down. Soft confirmations are the sequencer’s promise, not protocol finality: they can be reorganized until batches actually land on L1. When the sequencer stops, the normal deposit and withdrawal paths stop with it; only escape hatches keep users whole. Soft confirmations are a promise with the sequencer's signature on it, not the protocol's.",
          "Decentralizing the sequencer is genuinely hard: you need consensus among a new validator set, a policy for distributing sequencing MEV, and someone to bear latency costs. **Shared sequencers** (one set serving many rollups) and **based rollups** (Ethereum’s own proposers sequence, inheriting L1 decentralization at the cost of latency) are the main trajectories — both unsettled as of 2026. Every design inherits the same dilemma: whoever orders transactions captures MEV, and whoever captures MEV has power worth competing for. Sequencing MEV is the prize that makes this fight worth having, and its distribution is the political question inside every decentralization proposal.",
          "Centralization is tolerable today only because of forced inclusion and escape hatches: transactions can be forced into the L2 via L1 calldata, and users can exit without sequencer cooperation. The right security question is not can the sequencer hurt me briefly, but can it hurt me permanently. Briefly is the operative word — hours of downtime are recoverable, weeks without a working exit are how trust dies. Design for the outage rather than for the average day, and the architecture answers itself."
        ],
        "callout": {
          "type": "warning",
          "title": "Outage vs catastrophe",
          "body": "A sequencer outage is an inconvenience if escape hatches and forced withdrawals work, and a catastrophe if they do not. Before trusting any L2 with meaningful funds, read its escape hatch documentation — not its marketing page."
        }
      },
      {
        "heading": "Data availability: blobs and the danksharding road",
        "paragraphs": [
          "Data availability asks: can anyone reconstruct the L2 state from data the L1 guarantees to publish? Rollups post data to Ethereum because Ethereum consensus guarantees availability long enough for anyone to verify and challenge. **EIP-4844** (2024) introduced blob-carrying transactions: dedicated data objects of about **125 KB** each, priced in their own fee market, and pruned by consensus after roughly 18 days.",
          "Pruning is safe because data availability is a short-term consensus guarantee: once validity is settled (or the challenge window closes), historical data is no longer needed by the protocol. Archives and indexers keep history — nodes that need older data fetch it from them, the same way Ethereum history works today. Consensus only needs the recent window, and that separation is what makes blobs far cheaper than calldata for the same bytes. The 18-day window is a protocol guarantee about consensus, not about your data disappearing — archives keep everything.",
          "The trajectory: EIP-4844 is proto-danksharding, a stepping stone toward full **danksharding**, where data-availability sampling lets validators verify availability without downloading everything, raising blob counts by orders of magnitude. As of 2026 blob targets have been raised in steps and PeerDAS-style sampling is the active engineering frontier. The direction is stable even when the numbers are not: more data per block, cheaper L2 fees, without asking validators to download the world — so check current numbers rather than memorizing them. Blobs dropped L2 fees immediately when they shipped; that is the whole economic point."
        ]
      },
      {
        "heading": "Fraud proofs vs validity proofs",
        "paragraphs": [
          "Optimistic rollups post batches and assume validity; a **fraud proof** can challenge a bad state root during a window (classically about 7 days). Security rests on a 1-of-N assumption: at least one honest, funded, online verifier must exist. Proving is interactive — challenger and sequencer bisect a disagreement down to a single execution step — and cheap in the happy path.",
          "**Validity-proof (ZK) rollups** post a proof with each batch; the L1 verifies it mathematically, no window required. Costs shift to provers — expensive hardware, meaningful latency — but withdrawals become trustless and near-instant once the proof lands. Hybrids exist, and most major optimistic rollups have been shipping permissionless fraud proofs in stages through 2024-2026. The trade is prover economics versus user latency, and as provers get faster the trade increasingly favors validity proofs. Prover speed is the active frontier, and every year of progress shifts the balance further toward validity proofs."
        ],
        "table": {
          "headers": [
            "Dimension",
            "Optimistic (fraud proofs)",
            "ZK (validity proofs)"
          ],
          "rows": [
            [
              "Trust assumption",
              "1-of-N honest verifier online",
              "Sound cryptography + correct circuit"
            ],
            [
              "Withdrawal latency",
              "Challenge window (~7 days)",
              "As soon as the proof verifies"
            ],
            [
              "Cost profile",
              "Cheap happy path, costly disputes",
              "Expensive proving, cheap verification"
            ],
            [
              "Failure mode",
              "No challenger online during window",
              "Buggy circuit or delayed prover"
            ]
          ]
        }
      },
      {
        "heading": "Escape hatches, forced inclusion and the stage framework",
        "paragraphs": [
          "The **escape hatch** is what turns a team promise into a protocol property. A user whom the sequencer censors can force a transaction into the L2 via L1 (**forced inclusion**), and a withdrawal path exists that does not require the sequencer’s cooperation. Whether these are live, restricted by a security council, or purely theoretical is the core decentralization question for every rollup.",
          "L2Beat grades this with the **stage framework**: Stage 0 has proofs and a security council that can override freely (training wheels); Stage 1 has permissionless or near-permissionless proofs with council power narrowed by thresholds and delays; Stage 2 is fully trustless — no discretionary overrides, forced withdrawals guaranteed. Most rollups as of 2026 sit at Stage 0-1, with a small number reaching Stage 2.",
          "Read labels like an analyst: a **validium** keeps data off-chain (weaker availability), a sovereign rollup settles without L1 verification, and upgrade keys, timelocks and multisigs matter as much as the proof system. The stage — not the branding — is the risk label, and it can move in either direction: a Stage 1 rollup that ships a restrictive upgrade this quarter can effectively behave like Stage 0 again, so read the current configuration rather than the history. Upgrades can also move a rollup backward, so the stage you verify today is a snapshot, not a permanent grade."
        ],
        "callout": {
          "type": "tip",
          "title": "The four things to check first",
          "body": "On any rollup’s L2Beat page: its stage, what happens on sequencer failure, what happens on prover failure, and where data availability lives. Four fields tell you more than an hour of marketing."
        }
      },
      {
        "heading": "Fragmentation, shared sequencing and interop debates",
        "paragraphs": [
          "Dozens of rollups fragment liquidity, users and UX, and bridging between them reintroduces the trust problems of lesson 9. The proposed fixes are among the most contested topics in the ecosystem: shared sequencing for atomic cross-rollup transactions, based sequencing for L1-inherited neutrality, native rollups whose validation is enshrined in the L1, and interop layers backed by shared security. Every one of these is an attempt to make cross-rollup composition safe without reintroducing a trusted bridge in the middle. Fragmentation is the tax the ecosystem pays for rapid experimentation; the interop proposals are attempts to refund it.",
          "There is no consensus as of 2026, and reasonable people hold opposite positions. Each design trades something — latency, neutrality, sovereignty, or roadmap complexity for Ethereum itself. What is not settled is which design wins, or whether the ecosystem simply remains multi-paradigm, with different trade-offs winning in different niches. What is settled is the direction of travel: more security delegated to L1-verified components, less to multisigs and teams. The multi-rollup future looks permanent either way; the open question is how much of it settles to one common root of trust, and how quickly."
        ]
      }
    ],
    "keyTerms": [
      {
        "term": "Sequencer",
        "definition": "The operator that orders and executes L2 transactions and posts batches to L1; today usually a single team-operated service."
      },
      {
        "term": "Data availability",
        "definition": "The guarantee that anyone can obtain the data needed to reconstruct and verify the L2 state."
      },
      {
        "term": "Blob (EIP-4844)",
        "definition": "A dedicated ~125 KB data object with its own fee market, pruned by consensus after about 18 days."
      },
      {
        "term": "Fraud proof",
        "definition": "An interactive challenge proving an optimistic rollup’s state root wrong within the challenge window."
      },
      {
        "term": "Validity proof",
        "definition": "A succinct proof submitted with each batch that lets L1 verify state transitions mathematically, no challenge window needed."
      },
      {
        "term": "Forced inclusion",
        "definition": "Submitting a transaction via L1 calldata so the sequencer must include it — the censorship backstop."
      },
      {
        "term": "Validium",
        "definition": "A validity-proved chain whose data lives off-chain: strong correctness, weaker availability guarantees."
      },
      {
        "term": "Stage framework",
        "definition": "L2Beat’s 0/1/2 grading of how much a rollup still depends on trusted operators or security councils."
      }
    ],
    "practices": [
      {
        "id": "rollup-internals-p1",
        "title": "Audit an L2’s trust assumptions on L2Beat",
        "goal": "Turn the stage framework into a repeatable diligence routine.",
        "steps": [
          "Open https://l2beat.com/scaling/summary and pick a rollup you use or find interesting.",
          "Record its stage (0, 1 or 2) and read the one-line definition of that stage.",
          "Find the Sequencer failure and Proposer failure entries: what happens when each fails, and does anything require the team?",
          "Check the data availability entry: on-chain blobs, calldata, or an external DA committee?",
          "Look up proof system status: are proofs permissionless today, and does a security council hold emergency powers?",
          "Write a three-sentence risk summary as if briefing someone about to move real funds to this L2."
        ]
      },
      {
        "id": "rollup-internals-p2",
        "title": "Find a real blob on a block explorer",
        "goal": "Connect EIP-4844 theory to an actual transaction.",
        "steps": [
          "Open the block explorer of a major L2 (Arbitrum, Optimism, Base, or a zk rollup).",
          "Locate the latest batch or state root posted to Ethereum — many explorers label these Batch or State batch.",
          "Open the corresponding L1 transaction on an Ethereum explorer and find the blob versioned hash in the transaction details.",
          "Note the blob’s approximate size (~125 KB) and the separate fee it paid versus regular calldata.",
          "Bonus: check how many blobs that block carried against the current protocol target."
        ],
        "caution": "Read-only. Explorers never need wallet connections; do not sign anything to view data."
      }
    ],
    "resources": [
      {
        "title": "L2Beat — Stages framework",
        "url": "https://l2beat.com/stages",
        "type": "tool",
        "note": "The definitive decentralization grading for rollups."
      },
      {
        "title": "EIP-4844: Shard Blob Transactions",
        "url": "https://eips.ethereum.org/EIPS/eip-4844",
        "type": "docs",
        "note": "The proto-danksharding spec — blobs and fee market."
      },
      {
        "title": "Danksharding — ethereum.org roadmap",
        "url": "https://ethereum.org/en/roadmap/danksharding/",
        "type": "docs",
        "note": "Where data availability is headed."
      },
      {
        "title": "An Incomplete Guide to Rollups (Vitalik Buterin)",
        "url": "https://vitalik.ca/general/2021/01/05/rollup.html",
        "type": "article",
        "note": "Still the best conceptual comparison of proof types."
      },
      {
        "title": "Optimistic rollups — ethereum.org",
        "url": "https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/",
        "type": "docs",
        "note": "Official reference on fraud-proof mechanics."
      }
    ],
    "quiz": [
      {
        "id": "rollup-internals-q1",
        "prompt": "What trust assumption underlies an optimistic rollup’s security?",
        "options": [
          "A majority of L2 validators must be honest.",
          "At least one honest, funded, online verifier will submit a fraud proof within the challenge window.",
          "The sequencer must be honest at all times.",
          "Ethereum validators re-execute all L2 transactions."
        ],
        "correctIndex": 1,
        "explanation": "Optimistic security is 1-of-N: a single honest challenger suffices to catch invalid state roots. The sequencer can be temporarily malicious or down as long as escape hatches and the challenge mechanism function."
      },
      {
        "id": "rollup-internals-q2",
        "prompt": "Why is it safe for consensus to prune blobs after roughly 18 days?",
        "options": [
          "Because rollups mirror all data to IPFS beforehand.",
          "Because consensus only needs data available during the challenge and verification window; history is served by ordinary nodes afterwards.",
          "Because blobs contain no user transactions.",
          "Because the data is re-posted automatically every 17 days."
        ],
        "correctIndex": 1,
        "explanation": "Data availability is a short-term guarantee: once proofs are verified or the window closes, the protocol no longer needs the data. History lives with archives and indexers, which is why blobs can be far cheaper than calldata."
      },
      {
        "id": "rollup-internals-q3",
        "prompt": "A rollup is listed as Stage 2 on L2Beat. What does that mean for a user?",
        "options": [
          "The team can pause withdrawals in emergencies.",
          "Proofs are permissionless and there are no discretionary overrides — exits are enforceable without operator cooperation.",
          "The rollup has been live for two years.",
          "Withdrawals take two days."
        ],
        "correctIndex": 1,
        "explanation": "Stage 2 means training wheels are off: validity or fraud proofs are permissionless and no security council can override outcomes at will. Your funds are protected by the L1-enforced system, not by the team’s good behavior."
      },
      {
        "id": "rollup-internals-q4",
        "prompt": "What problem does forced inclusion solve?",
        "options": [
          "It speeds up L2 finality.",
          "It defeats sequencer censorship: users can push transactions in via L1 calldata that the sequencer must include within a deadline.",
          "It reduces blob fees.",
          "It lets users bypass the bridge contract."
        ],
        "correctIndex": 1,
        "explanation": "If a sequencer ignores your transactions, L1-forced submission guarantees eventual inclusion on a deadline. Combined with forced withdrawals, it is what makes a censored user temporarily inconvenienced rather than trapped."
      }
    ]
  },
  {
    "id": "cryptography",
    "level": "advanced",
    "order": 4,
    "title": "Applied Cryptography for Web3",
    "subtitle": "Hashes, signatures, Merkle proofs, commitments and zero-knowledge — honestly",
    "minutes": 28,
    "objectives": [
      "State the three hardness properties of hash functions and identify where keccak-256 anchors chain security.",
      "Compare ECDSA and BLS signatures and explain why signature aggregation makes consensus practical.",
      "Construct and verify a Merkle proof, and reason about commitments (binding and hiding).",
      "Give an honest intuitive account of zk-SNARKs vs STARKs, threshold signatures and MPC, and post-quantum pressure."
    ],
    "sections": [
      {
        "heading": "Hash functions: the workhorse",
        "paragraphs": [
          "A cryptographic hash maps arbitrary input to a fixed-size digest with three properties: **preimage resistance** (cannot invert), **second-preimage resistance** (cannot find another input with the same digest for a given one), and **collision resistance** (cannot find any two colliding inputs). Collision resistance is the hardest — its security is only half the output length due to birthday attacks — and it is the property that erodes first.",
          "keccak-256 is load-bearing everywhere: it derives Ethereum addresses from public keys, computes storage locations for mappings, links every node of the state and transaction tries, and builds commitments inside countless protocols. If keccak broke, addressing and commitment machinery across the entire stack would need replacement — there is no graceful degradation. It is arguably the single most reused primitive in the ecosystem, which is why its security margin matters more than most.",
          "Engineering habit: hash structured data with a well-defined encoding and a domain separator. Hash of what, exactly is where integration bugs live — ambiguous serialization invites two different message types to collide, and history shows attackers hunt for exactly that gap between what the engineer meant and what the encoding says. The fix is boring and effective: canonical encodings, explicit type tags, and tests that assert the exact bytes being hashed."
        ],
        "callout": {
          "type": "deep-dive",
          "title": "Collision vs preimage, quantitatively",
          "body": "A 256-bit hash offers about 2^128 collision resistance (birthday bound) but 2^256 preimage resistance. Doubling output length does not double security uniformly — it doubles the collision exponent while leaving preimage exponent to grow by the same factor. This asymmetry drives why 256-bit hashes are the standard sweet spot."
        }
      },
      {
        "heading": "Signatures: ECDSA and BLS",
        "paragraphs": [
          "ECDSA over the secp256k1 curve secures every externally owned account. Its signature carries (r, s) plus a recovery id, allowing the public key — and therefore the address — to be recovered from message and signature alone via the ecrecover precompile. Recovery is why wallets never need to store keys on-chain, and why signature verification is so cheap in practice.",
          "ECDSA has sharp edges. Reusing the ephemeral nonce k across two messages leaks the private key algebraically; biased nonces leak it statistically — the mechanism behind several famous key compromises. EIP-2 mandated canonical low-s signatures on Ethereum to kill **malleability**: both (r, s) and (r, n-s) verify, so accepting only low-s makes each signature unique and prevents replay trickery. Any signer library that lets nonces repeat is a liability regardless of everything else in the system.",
          "BLS signatures (on BLS12-381) trade recovery for **aggregation**: any number of signatures on the same message compress into one, verified with a single pairing check. This is why a million validators’ attestations per slot are practical (lesson 1). Costs: verification is slower, there is no recovery trick, and misuse of the same key across protocols can be dangerous — so BLS lives in consensus, not wallets."
        ]
      },
      {
        "heading": "Merkle trees and proofs",
        "paragraphs": [
          "Two classic mistakes recur in real incidents: hashing raw leaves without a prefix (enabling second-preimage attacks where an internal node is replayed as a leaf), and unsorted sibling pairs (an attacker reorders inputs to forge a different tree that hashes the same). Both are one-line fixes that were skipped in code that passed every test — because the test encoded the same wrong assumption.",
          "Finally, scope the claim: a Merkle proof proves membership in a set. It says nothing about whether the set itself is legitimate — garbage root, garbage inclusion. In airdrops the legitimacy question is who generated the eligible list; in bridges it is who computed the deposit root. The tree only certifies membership, so always ask where the root came from and who signed it."
        ],
        "code": {
          "lang": "solidity",
          "code": "function verify(bytes32[] calldata proof, bytes32 root, bytes32 leaf)\n    public pure returns (bool)\n{\n    bytes32 h = leaf;\n    for (uint256 i = 0; i < proof.length; i++) {\n        h = keccak256(abi.encodePacked(h, proof[i])); // sibling ordering matters\n    }\n    return h == root;\n}",
          "caption": "Sketch of a Merkle check. Production code should hash leaves with a distinct prefix (leaf = H(0x00 || data)) to prevent second-preimage attacks."
        }
      },
      {
        "heading": "Commitments: binding and hiding",
        "paragraphs": [
          "A commitment is a sealed envelope. It should be **binding** (you cannot change the contents after sealing) and ideally **hiding** (nobody can see inside until you open it). Committing with hash(value || salt) gives binding and probabilistic hiding; Pedersen commitments are perfectly hiding and homomorphic — they support adding committed values while the hiding stays intact, the algebra behind confidential transactions.",
          "On-chain uses are everywhere: sealed-bid auctions, commit-reveal game moves, state-channel balance updates, and the note commitments inside shielded pools (lesson 10). The recurring recipe: commitment for the data, zero-knowledge proof for the rules, and the chain verifies both without learning either. Wherever you see a hash published before an action and a reveal after it — auctions, channel updates, mixer notes — there is a commitment underneath, and usually a proof riding along with it."
        ]
      },
      {
        "heading": "Zero-knowledge: what is actually proven",
        "paragraphs": [
          "A ZK proof lets a prover convince a verifier that a statement is true — I know a witness making this computation output y — without revealing the witness. For chains, the headline superpower is **succinctness**: verification is dramatically cheaper than re-execution, which is what rollups buy. *Privacy* is a separate property that some constructions include and others do not.",
          "**Arithmetization** is the translation step: the computation (a VM execution, a signature check, a balance update) is compiled into algebraic constraints — R1CS circuits, Plonkish gates, or AIR trace tables — and the proof system attests the constraints are satisfied. Garbage in, garbage out: if the arithmetization mis-encodes the intended computation, the mathematics faithfully prove the wrong program. A perfect proof of a wrong circuit is a perfectly wrong guarantee.",
          "Pairing-based SNARKs produce tiny proofs — a few hundred bytes — cheap to verify on-chain, but many require a **trusted setup** ceremony: participants generate and destroy secret toxic waste, and if any single party secretly kept theirs, they could forge proofs. STARKs are transparent (no trusted setup, hash-based) and plausibly post-quantum, but proofs are larger — tens to hundreds of kilobytes."
        ],
        "table": {
          "headers": [
            "Property",
            "Pairing-based SNARKs",
            "STARKs"
          ],
          "rows": [
            [
              "Proof size",
              "Hundreds of bytes",
              "Tens to hundreds of KB"
            ],
            [
              "Verifier cost",
              "Very cheap, near-constant",
              "Cheap but larger inputs"
            ],
            [
              "Trusted setup",
              "Often required (per-circuit or universal)",
              "None — transparent"
            ],
            [
              "Post-quantum",
              "No (pairings vulnerable to Shor)",
              "Plausibly yes (hash-based)"
            ],
            [
              "Typical home",
              "On-chain verification, rollups",
              "Large computations, DA proofs"
            ]
          ]
        }
      },
      {
        "heading": "MPC and threshold signatures",
        "paragraphs": [
          "Multi-party computation (MPC) lets n parties jointly compute a function — such as sign with the secret key — without any of them ever learning it. In **threshold signatures** (t-of-n), any t shares produce one valid signature, and only one signature appears on-chain, indistinguishable from a single signer’s. The key never exists as a complete value anywhere — not in memory, not on disk, not in transit — which removes the single most attractive target in key management.",
          "Contrast with a multisig: an on-chain multisig is an explicit structure with visible signers and rules (auditable, expensive), while a threshold signature is one ordinary signature (cheap, opaque). Bridges and custodians use both. Ronin’s collapse (lesson 9) was a 5-of-9 ECDSA key set stolen wholesale — threshold schemes aim to remove any place a whole key exists, but they add protocol complexity and new, subtler failure modes."
        ]
      },
      {
        "heading": "Post-quantum: what actually changes",
        "paragraphs": [
          "Shor’s algorithm breaks ECDSA and BLS on a sufficiently large fault-tolerant quantum computer — elliptic-curve discrete logarithms become easy. Grover’s algorithm gives only a quadratic speedup against hashes, manageable by doubling output lengths. As of 2026 no cryptographically relevant quantum computer is publicly known, but harvest-now-break-later applies to anything recorded today that stays sensitive. The margin math is unforgiving: Shor removes elliptic-curve security entirely rather than shaving it.",
          "Post-quantum candidates are maturing: hash-based signatures (SPHINCS+) and lattice-based schemes (ML-DSA/Dilithium for signatures, ML-KEM/Kyber for encryption). The algorithms are standardized and the mathematics is believed; the bottleneck is deployment — far larger signatures and keys on chains where every byte is replicated across thousands of nodes and priced in gas, plus tooling that does not exist yet. Deployment, not mathematics, is the long pole — the same lesson as every migration before it.",
          "Chains face the hardest migration: addresses derive from public keys, and a public key is exposed the first time an account spends. Long-dormant accounts holding value are therefore the visible quantum risk. Quantum-safe account designs (hash-based addresses, commit-reveal migration flows) are research, not production. The safest hedge today is operational: minimize how long sensitive keys stay live, and favor account systems that can rotate their cryptography without a hard split. Treat confident timeline claims, in either direction, as speculation."
        ]
      }
    ],
    "keyTerms": [
      {
        "term": "keccak-256",
        "definition": "Ethereum’s hash function — used for addresses, storage slots, tries and commitments throughout the stack."
      },
      {
        "term": "Collision resistance",
        "definition": "Infeasibility of finding any two inputs with the same digest; birthday-bounded at roughly half the output length."
      },
      {
        "term": "ECDSA",
        "definition": "Ethereum’s account signature scheme over secp256k1, with public-key recovery and known nonce pitfalls."
      },
      {
        "term": "BLS aggregation",
        "definition": "Combining many signatures on one message into a single verifiable signature — the reason million-validator consensus is practical."
      },
      {
        "term": "Merkle proof",
        "definition": "The sibling-hash path from a leaf to a root, sized O(log n), proving membership in a committed set."
      },
      {
        "term": "Commitment",
        "definition": "A binding (and ideally hiding) fingerprint of hidden data — the envelope behind auctions, channels and shielded pools."
      },
      {
        "term": "zk-SNARK",
        "definition": "A succinct zero-knowledge proof with tiny on-chain verification cost, often requiring a trusted setup ceremony."
      },
      {
        "term": "zk-STARK",
        "definition": "A transparent, hash-based zero-knowledge proof with no trusted setup and plausible post-quantum security, at larger proof sizes."
      }
    ],
    "practices": [
      {
        "id": "cryptography-p1",
        "title": "Recover an address and verify a Merkle proof",
        "goal": "Exercise ecrecover and Merkle verification hands-on in a safe local environment.",
        "steps": [
          "Create a throwaway Foundry project (forge init) and add a test contract.",
          "Generate a test key with cast wallet new and note its address.",
          "Sign a fixed message with cast wallet sign --private-key <KEY> <MESSAGE> and record the v, r, s values.",
          "In your test, call ecrecover(keccak256(message), v, r, s) and assert it returns your address.",
          "Change one character of the message and confirm recovery now yields a different address.",
          "Add an OpenZeppelin-style MerkleProof check: hardcode a small root and proof, assert verify passes, then corrupt one sibling hash and confirm it fails.",
          "Write down which property — preimage resistance, collision resistance, or binding — each check exercised."
        ],
        "caution": "Use only a throwaway key generated for this exercise. Never sign anything with a key holding real funds."
      }
    ],
    "resources": [
      {
        "title": "Cryptography — ethereum.org developer docs",
        "url": "https://ethereum.org/en/developers/docs/cryptography/",
        "type": "docs",
        "note": "Hashes, curves and signatures in context."
      },
      {
        "title": "Data structures and encoding — ethereum.org",
        "url": "https://ethereum.org/en/developers/docs/data-structures-and-encoding/",
        "type": "docs",
        "note": "Merkle tries as Ethereum actually builds them."
      },
      {
        "title": "STARKs, Part I: Proofs with Polynomials (Vitalik Buterin)",
        "url": "https://vitalik.ca/general/2017/11/22/starks_part_1.html",
        "type": "article",
        "note": "The most readable honest introduction to how ZK proofs work."
      },
      {
        "title": "EIP-197: Precompiled contracts for pairing checks",
        "url": "https://eips.ethereum.org/EIPS/eip-197",
        "type": "docs",
        "note": "The pairing precompiles SNARK verification relies on."
      },
      {
        "title": "ethresear.ch",
        "url": "https://ethresear.ch",
        "type": "article",
        "note": "Research forum where much of this is worked out in public."
      }
    ],
    "quiz": [
      {
        "id": "cryptography-q1",
        "prompt": "Why does Ethereum’s consensus use BLS rather than ECDSA for attestations?",
        "options": [
          "BLS signatures are shorter than ECDSA signatures.",
          "BLS signatures aggregate: thousands collapse into one verifiable signature per slot.",
          "BLS supports public-key recovery, which ECDSA lacks.",
          "BLS is post-quantum secure."
        ],
        "correctIndex": 1,
        "explanation": "Aggregation is the whole point: one pairing check verifies an entire committee’s votes, making a million validators practical. ECDSA cannot aggregate this way, and BLS is emphatically not post-quantum — pairings fall to Shor like everything elliptic."
      },
      {
        "id": "cryptography-q2",
        "prompt": "A Merkle proof proves membership of a leaf in a tree with one billion leaves. Roughly how many hashes does the proof contain?",
        "options": [
          "1,000",
          "About 30",
          "Exactly 1 billion",
          "It depends on the leaf size"
        ],
        "correctIndex": 1,
        "explanation": "Proof size is the tree depth: log2(10^9) is about 30 sibling hashes. That logarithmic size is what makes Merkle proofs practical for airdrops, light clients and bridges."
      },
      {
        "id": "cryptography-q3",
        "prompt": "What does a SNARK trusted-setup ceremony protect against?",
        "options": [
          "Verifiers rejecting valid proofs.",
          "A participant secretly retaining the trapdoor (toxic waste) that would allow forging proofs.",
          "Provers running out of storage.",
          "Circuits mis-encoding the computation."
        ],
        "correctIndex": 1,
        "explanation": "The ceremony multiplies secret contributions together and destroys them; security needs just one honest participant to discard their piece. It does not protect against circuit bugs — a mis-encoder proves the wrong statement perfectly."
      },
      {
        "id": "cryptography-q4",
        "prompt": "Which layer of today’s chains is most exposed to Shor’s algorithm?",
        "options": [
          "Hash functions like keccak-256.",
          "Elliptic-curve signature schemes (ECDSA, BLS).",
          "Merkle tree structures.",
          "Peer-to-peer networking."
        ],
        "correctIndex": 1,
        "explanation": "Shor breaks the discrete logarithm problem underlying ECDSA and BLS outright. Hashes only face Grover’s quadratic speedup, mitigable by longer outputs — which is why hash-based signatures are the leading post-quantum candidates."
      }
    ]
  },
  {
    "id": "security-auditing",
    "level": "advanced",
    "order": 5,
    "title": "Security & Auditing Methodology",
    "subtitle": "How professionals hunt for bugs — and why audits alone don’t save you",
    "minutes": 28,
    "objectives": [
      "Categorize the dominant exploit classes and their mechanistic root causes in EVM contracts.",
      "Walk a professional audit: scoping, threat modeling, invariant specification and reporting.",
      "Use Foundry fuzzing and invariant testing to break, then fix, a deliberately vulnerable contract.",
      "Explain bug-bounty economics and why audits are necessary but not sufficient, using the 2023 Curve/Vyper compiler incident as the boundary case."
    ],
    "sections": [
      {
        "heading": "A taxonomy of failure",
        "paragraphs": [
          "Nearly every major exploit falls into a small set of classes: **reentrancy** (an external call re-enters before state settles), **oracle manipulation** (feeding a wrong value the contract trusts), **broken access control** (including uninitialized proxy initializers), **front-running** (ordering attacks), **integer and rounding errors** (truncation direction matters), and **signature replay or malleability** (one authorization used twice, or altered). Each class has a mechanistic signature — learn to look for the pattern, not the name.",
          "The classes share a root cause: contracts compose trustlessly by making external calls and reading external values, and every external dependency is a trust boundary. Auditing is the discipline of walking each boundary and asking what happens when the other side lies, delays, or calls you back mid-execution. Trust boundaries are where audits are won or lost; internal arithmetic you fully control is rarely where exploits enter.",
          "Learn the classes deeply once, with one real incident attached to each in your memory. Most novel bugs are old classes wearing new clothes — the industry keeps rediscovering reentrancy through new token standards, new callback surfaces, and new combinations of old parts. Build a mental library of one canonical incident per class — The DAO for reentrancy, flash-loan oracle games, the Ronin key compromise — and pattern-matching starts working for you instead of against you."
        ]
      },
      {
        "heading": "Reentrancy, mechanistically",
        "paragraphs": [
          "The variants matter as much as the classic. **Cross-function reentrancy** re-enters a different function sharing the same state. **Read-only reentrancy** lets a view function report inconsistent state during a callback — it has burned real protocols that priced positions off spot values inside callbacks. Any token with hooks (ERC-777, some ERC-20 extensions) is a reentrancy vector, not just ETH transfers. The lesson: any external call is a potential re-entry, from any function, including view functions reached through callbacks.",
          "Guards complement ordering but do not replace it: a mutex only protects the functions it wraps, and forgetting it on one entry point reopens the hole. The durable rule is structural — leave the contract in a consistent state before you ever hand control to an outside party. Ordering is the fix; guards are the insurance policy you buy for the day someone forgets the ordering."
        ],
        "code": {
          "lang": "solidity",
          "code": "// VULNERABLE: interaction before effect\nfunction withdraw() external {\n    uint256 amount = balances[msg.sender];\n    (bool ok, ) = msg.sender.call{value: amount}('');\n    require(ok, 'transfer failed');\n    balances[msg.sender] = 0; // too late — reentered before this\n}\n\n// FIXED: effects before interactions (optionally + nonReentrant)\nfunction withdrawFixed() external {\n    uint256 amount = balances[msg.sender];\n    balances[msg.sender] = 0; // effect first\n    (bool ok, ) = msg.sender.call{value: amount}('');\n    require(ok, 'transfer failed');\n}",
          "caption": "The canonical vulnerable/fixed pair. State changes (effects) must precede external calls (interactions)."
        }
      },
      {
        "heading": "Oracles, arithmetic and authority",
        "paragraphs": [
          "**Oracle manipulation**: a contract reads an AMM spot price; an attacker flash-borrows huge size, moves the spot price within one transaction, triggers a loan or liquidation priced off it, and repays. The attack works because the protocol mistakes market price for truth. The fixes are time-weighted averages, external price feeds with sanity bounds, and treating every externally-settable value — prices, timestamps, totals — as attacker-controllable until proven otherwise.",
          "**Arithmetic**: pre-0.8 Solidity silently wrapped integers; modern Solidity reverts, but rounding direction remains a design decision. Round in favor of the protocol, never the user, or fractions accumulate into a drain. Share-price mathematics in vaults (inflation attacks on near-empty vaults) shows how a tiny rounding choice becomes a full exploit — the math is exact, and the direction of rounding is a policy choice with economic consequences.",
          "**Authority and signatures**: missing access checks, initializer front-running on proxies, and delegatecall into attacker-controlled addresses form the access-control family. Signature replay — the same signed order reused across chains or nonces — is countered with nonces, chain IDs and EIP-712 domain separation, with canonical low-s signatures closing malleability (lesson 4). Signatures authorize; they do not deduplicate — replay protection is always your job."
        ]
      },
      {
        "heading": "The audit process",
        "paragraphs": [
          "Scope first: which contracts, deploy scripts, upgrade paths, and which external dependencies are trusted. Then **threat modeling**: enumerate assets (user funds, governance rights), trust boundaries (token callbacks, oracles, admin keys), and adversaries (MEV bots, users, compromised keys). The deliverable of this phase is shared understanding, not a list — a bug list without a threat model is trivia. A threat model the whole team shares outlives any individual report.",
          "Manual review hunts for semantic bugs no tool sees: economic assumptions, privilege escalation through composition, invariants that hold per-function but fail per-system. Tooling complements it — static analysis for known patterns, fuzzers for state exploration, formal methods for the most critical properties. Tools find what they were taught to find; the semantic bugs hiding between modules are still yours, and they are usually the expensive ones.",
          "Process matters as much as findings: report, client triage, fixes, fix review, public disclosure. High-value protocols commission multiple independent audits and run public bounties, because different firms catch different classes of bugs — which is why serious teams treat multiple audits as the entry ticket, not the finish line. Keep the asymmetry in mind: defenders must hold everywhere; attackers need one seam."
        ]
      },
      {
        "heading": "Fuzzing and invariants with Foundry",
        "paragraphs": [
          "**Formal verification** is the stronger sibling: prove a property for *all* inputs rather than random ones (model checkers like Halmos, or specification languages like Certora). It is expensive, slow, and only as strong as the specification — an incomplete spec yields an incomplete guarantee. Random exploration is sampling; proof is coverage of the whole space, hence the price difference. As of 2026 it remains reserved for the highest-value components.",
          "Coverage metrics deserve the same skepticism. A test suite that touches every line proves nothing about properties; it proves the code paths were reachable, and reachability and correctness are different questions that tooling often conflates. The questions that matter are what should always be true, and who can make it false — those are invariant and threat-model questions, not coverage questions."
        ],
        "code": {
          "lang": "solidity",
          "code": "contract VaultInvariantTest is Test {\n    Vault vault;\n\n    function setUp() public { vault = new Vault(); }\n\n    /// forge-config: default.fuzz.runs = 10000\n    function invariant_Solvency() public {\n        assertGe(\n            vault.totalAssets(),\n            vault.totalLiabilities(),\n            'vault insolvent'\n        );\n    }\n}",
          "caption": "A minimal Foundry invariant. Real suites add handler contracts that constrain the fuzzer to realistic call sequences."
        },
        "callout": {
          "type": "warning",
          "title": "Coverage is not security",
          "body": "100% line coverage means every line executed, not that any property was checked. The dangerous bugs live in the properties nobody thought to assert — which is exactly what invariant testing is designed to surface."
        }
      },
      {
        "heading": "Bug bounty economics",
        "paragraphs": [
          "A well-run bounty converts an attacker’s discovery into a payday instead of an exploit. Caps for the highest-TVL protocols commonly reach into the millions of dollars, because paying $1M beats losing $100M. The economics only work if payouts are fast, non-discretionary and credible — bounty programs with discretionary clawbacks get ignored by exactly the people they target, and trust, once burned, does not come back at any price.",
          "Whitehat norms have matured: emergency rescue transactions that front-run exploits to secure funds, coordinated disclosure timelines, and safe-harbor frameworks that protect good-faith researchers. For learners, reading disclosed bug reports and post-mortems teaches more per minute than any checklist — rekt.news is the catalog, and an hour of post-mortems beats a week of vague checklists. The people who write those reports are the same people who found the bugs — that is the whole point."
        ]
      },
      {
        "heading": "Necessary, not sufficient: the Curve/Vyper boundary case",
        "paragraphs": [
          "In July 2023 several pools, including Curve’s, were drained through a bug in the **Vyper compiler** itself: versions 0.2.15 through 0.3.0 emitted faulty reentrancy locks, so guards that looked correct in source simply did not exist in bytecode — no application-layer contract bug was involved at all. Audited, professionally run protocols lost tens of millions to a flaw one layer below anything they audited.",
          "The lesson generalizes: your trust boundary includes the compiler, the proxy admin, the deploy scripts, the RPC provider, and the humans. Audits are *necessary* because they catch whole classes of bugs before mainnet; they are not *sufficient* because no process covers every layer, and every layer you did not review is a layer someone else can break. Composition bugs appear only in production conditions.",
          "Defense therefore continues after deployment: monitoring and alerting, pause authorities with clearly enumerated controls, incident-response runbooks, and live bounties. Incident response is a muscle built before the incident — protocols that had exercised pause and rescue procedures survived, and the ones that had not learned why drills matter. The protocols that survived 2023’s events were the ones with working response machinery, not merely clean audit reports."
        ]
      }
    ],
    "keyTerms": [
      {
        "term": "Reentrancy",
        "definition": "An external call re-entering a contract before its state settles; the DAO’s fatal flaw and still a live class."
      },
      {
        "term": "Checks-effects-interactions",
        "definition": "The ordering discipline — validate, update state, then make external calls — that removes the reentrancy primitive."
      },
      {
        "term": "Oracle manipulation",
        "definition": "Distorting a value a contract trusts (usually a spot price) with flash liquidity to trigger profitable actions."
      },
      {
        "term": "Invariant",
        "definition": "A property that must hold in every reachable state (solvency, supply conservation); the unit of invariant testing."
      },
      {
        "term": "Fuzzing",
        "definition": "Automated random input (and call-sequence) exploration to find states humans did not imagine."
      },
      {
        "term": "Formal verification",
        "definition": "Mathematical proof that a specification holds for all inputs; only as strong as the specification."
      },
      {
        "term": "Bug bounty",
        "definition": "A priced, credible channel converting attacker discoveries into payouts — insurance priced in advance."
      },
      {
        "term": "Trust boundary",
        "definition": "Any seam where your code depends on something outside its control: tokens, oracles, compilers, admins."
      }
    ],
    "practices": [
      {
        "id": "security-auditing-p1",
        "title": "Break (and fix) a contract with Foundry invariants",
        "goal": "Feel both sides of the process: exploit a flaw, fix it, and let a fuzzer confirm.",
        "steps": [
          "forge init a scratch project and add a deliberately flawed vault (withdraw() sends ETH before zeroing balances).",
          "Write a reentrancy attacker contract and a forge test proving the drain works.",
          "Apply checks-effects-interactions to fix it; re-run and confirm the attacker now fails.",
          "Add an invariant test — vault ETH balance always equals the sum of recorded balances — and run forge test with default fuzz runs.",
          "Raise the runs count and add a second actor interaction to see whether the fuzzer finds anything new.",
          "Write down which taxonomy class your bug belonged to, and name one class Foundry would be unlikely to catch automatically."
        ],
        "caution": "Local forge fuzzing only. Never deploy deliberately vulnerable code to any public network, even a testnet."
      },
      {
        "id": "security-auditing-p2",
        "title": "Read a real post-mortem like an analyst",
        "goal": "Turn incident history into a reusable review habit.",
        "steps": [
          "Pick an incident on https://rekt.news — a bridge or oracle exploit works well.",
          "Identify the exploit class from this lesson’s taxonomy.",
          "Determine which layer failed: code, compiler, key management, monitoring, or process.",
          "Check whether the protocol had a prior audit; if so, note what an audit could and could not have caught.",
          "Note the time between bug introduction and exploitation, if reported.",
          "Write three sentences: root cause, what defense-in-depth would have helped, and the first thing you would check in a similar protocol."
        ]
      }
    ],
    "resources": [
      {
        "title": "Smart contract security — ethereum.org",
        "url": "https://ethereum.org/en/developers/docs/smart-contracts/security/",
        "type": "docs",
        "note": "Official security patterns and known-attack list."
      },
      {
        "title": "Foundry Book — Invariant testing",
        "url": "https://book.getfoundry.sh/forge/invariant-testing",
        "type": "docs",
        "note": "Hands-on reference for the practice in this lesson."
      },
      {
        "title": "Security considerations — Solidity docs",
        "url": "https://docs.soliditylang.org/en/latest/security-considerations.html",
        "type": "docs",
        "note": "Language-level pitfalls straight from the source."
      },
      {
        "title": "reentrancy-attacks — curated list of real incidents",
        "url": "https://github.com/pcaversaccio/reentrancy-attacks",
        "type": "tool",
        "note": "A decade of reentrancy victims, maintained in public."
      },
      {
        "title": "rekt.news",
        "url": "https://rekt.news",
        "type": "article",
        "note": "The post-mortem library of the industry."
      }
    ],
    "quiz": [
      {
        "id": "security-auditing-q1",
        "prompt": "What is the minimal correct fix for classic reentrancy in a withdraw() function?",
        "options": [
          "Adding a reentrancy guard decorator.",
          "Zeroing the balance before making the external call (checks-effects-interactions).",
          "Using callvalue instead of call.",
          "Requiring msg.sender to be a contract."
        ],
        "correctIndex": 1,
        "explanation": "Reordering removes the exploit primitive: by the time the external call runs, the ledger already shows zero, so re-entry has nothing to drain. Guards are good defense-in-depth but are the second line, not the fix."
      },
      {
        "id": "security-auditing-q2",
        "prompt": "Why is an AMM spot price a dangerous oracle input?",
        "options": [
          "Spot prices update too slowly.",
          "A flash loan can move the spot price arbitrarily within one transaction, and the protocol acts on the distorted value before it reverts.",
          "AMMs round prices against the protocol.",
          "Spot prices are only available on L2s."
        ],
        "correctIndex": 1,
        "explanation": "Within a single transaction, borrowed liquidity can push x*y=k to any price; the protocol’s action executes on that price before the pool returns to equilibrium. Time-weighted or external feeds with sanity bounds are the standard mitigations."
      },
      {
        "id": "security-auditing-q3",
        "prompt": "What makes invariant testing stronger than unit testing?",
        "options": [
          "It runs faster.",
          "The fuzzer invents call sequences the author never wrote, and checks a system-wide property after each one.",
          "It replaces the need for audits.",
          "It tests only the happy path more thoroughly."
        ],
        "correctIndex": 1,
        "explanation": "Unit tests confirm scenarios you anticipated; invariant tests explore sequences you did not, against properties that must always hold. The gap between what you asserted and what can happen is exactly where bugs hide."
      },
      {
        "id": "security-auditing-q4",
        "prompt": "What did the 2023 Curve/Vyper incident demonstrate?",
        "options": [
          "That AMM pools are inherently unsafe.",
          "That the toolchain — including the compiler — is part of the trust boundary, and source-level audits cannot catch compiler-emitted flaws.",
          "That Solidity is safer than Vyper in all cases.",
          "That audits are useless."
        ],
        "correctIndex": 1,
        "explanation": "The bug lived in Vyper’s reentrancy lock emission — correct in source, broken in bytecode. The durable lesson is defense in depth: monitoring, pause controls and response machinery, because no single review covers every layer."
      }
    ]
  },
  {
    "id": "mev",
    "level": "advanced",
    "order": 6,
    "title": "MEV: Maximal Extractable Value",
    "subtitle": "Who profits from ordering transactions, and what it does to protocol design",
    "minutes": 26,
    "objectives": [
      "Define MEV precisely and map its supply chain: users, searchers, builders, relays and proposers.",
      "Work through sandwich attacks and backrun arbitrage with concrete pool numbers.",
      "Explain PBS economics, orderflow auctions (MEV-Share) and private mempools.",
      "Assess MEV as a design pressure shaping L1 fee markets, L2 sequencing and intent-based UX."
    ],
    "sections": [
      {
        "heading": "What MEV actually is",
        "paragraphs": [
          "MEV is the value extractable by whoever holds the right to order, insert or censor transactions within a block, beyond standard rewards. The name drifted from miner-extractable to maximal-extractable as Ethereum moved to proof-of-stake, but the substance predates and outlives any particular consensus mechanism — wherever ordering rights exist, MEV exists. If you can reorder it, delay it, or drop it, its value is part of your extractable surface.",
          "It splits into neutral and predatory. Neutral MEV aligns markets: arbitrage that repairs price differences across DEXs, liquidations that keep lending systems solvent. Predatory MEV taxes users: sandwiches, latency games, and reorg-for-profit schemes. The same ordering right produces both — which is why MEV cannot simply be banned away, only channeled and priced. Both kinds are rational responses to the same incentive; the difference is who pays the cost.",
          "The dark-forest framing explains user experience: open mempools leak intent, and sophisticated bots see a profitable pending swap and act before it lands. Everything users describe as getting front-run by bots is visibility plus ordering rights, compounded by latency — and every defense in this lesson attacks one of those three ingredients. Remove any one ingredient and the attack fails — which is why every defense targets exactly one of them."
        ]
      },
      {
        "heading": "The MEV supply chain",
        "paragraphs": [
          "A bundle travels: user, to public or private mempool, to **searcher** (finds an ordering opportunity and bids for placement), to **builder** (assembles a full block maximizing total bids), to **relay** (holds the block, publishes only its header and bid), to **proposer** (blind-signs the highest bid). Since late 2022 roughly nine in ten Ethereum blocks have been built this way via MEV-boost.",
          "Read the table as a market, not an org chart: each layer competes, and each layer’s margin is squeezed by the layer above it. Users sit at the source of the flow — which is why orderflow itself became the commodity being bought and sold, and why protection products compete to represent you. Concentration at any layer is a systemic risk, not just a business story."
        ],
        "table": {
          "headers": [
            "Actor",
            "Does",
            "Earns",
            "Risk borne"
          ],
          "rows": [
            [
              "User",
              "Creates the flow",
              "Service outcome",
              "Sandwiches and slippage"
            ],
            [
              "Searcher",
              "Finds opportunities, bids",
              "Edge over bid",
              "Competition, failed bundles"
            ],
            [
              "Builder",
              "Assembles best block",
              "Bid margin",
              "Infrastructure cost, flow deals"
            ],
            [
              "Relay",
              "Serves headers, mediates payment",
              "Small cut / goodwill",
              "Trusted intermediary, censorship point"
            ],
            [
              "Proposer",
              "Signs highest-bid header",
              "Most of block value",
              "Trust in relay honesty"
            ]
          ]
        }
      },
      {
        "heading": "Sandwiches and backruns, with numbers",
        "paragraphs": [
          "A sandwich needs a visible victim buy. Take a pool with 1,000 ETH and 2,000,000 USDC (x*y = k, spot 2,000 USDC/ETH, fees ignored for clarity). The victim wants to swap 20,000 USDC for ETH with 5% slippage tolerance. The attacker buys first, lets the victim execute into the inflated price, then sells immediately after. Tolerance is the victim's own estimate of acceptable damage — which is exactly what the attacker spends.",
          "Worked through: the attacker’s 20,000 USDC buy removes about 9.90 ETH, moving the spot to roughly 2,040. The victim’s 20,000 USDC then returns only about 9.71 ETH — an average price near 2,060, about 3% worse than spot. The attacker sells the 9.90 ETH back into the pool for about 20,200 USDC: a profit near 200 USDC, which is almost exactly the victim’s extra cost. The sandwich is a tax whose size is the victim’s own price impact.",
          "A **backrun** is the same muscle without a victim: watch for a price-moving event — an oracle update, a large trade, a liquidation — and immediately arbitrage the created discrepancy. Searchers bid in fee auctions for that right; the winner’s bid flows through builders to proposers. User slippage enters at the bottom of the pipe and value is redistributed upward through it."
        ]
      },
      {
        "heading": "Protection: private flow and orderflow auctions",
        "paragraphs": [
          "The user-side defense is not being visible. Protecting RPCs (Flashbots Protect-style endpoints) keep transactions out of the public mempool, and **MEV-Share**-style orderflow auctions selectively leak just enough information for searchers to bid on backruns — sharing the proceeds with the user whose order created the opportunity. The user's transaction never touches the public mempool, so latency-sensitive bots never see it to front-run.",
          "Intents flip the model entirely: the user signs a desired outcome — I want at least X out, any route — and competing solvers execute it. The solver absorbs the ordering-attack exposure instead of the user. That is why intent-based routing and batch auctions became the dominant anti-sandwich UX of 2025-2026. Solver competition then does the price discovery that ordering attacks used to do, but inside a rule-bound venue.",
          "Trade-offs are real: protection relies on trusted off-chain infrastructure — the RPC, the auction operator — and concentrated orderflow is itself market power. The flow that protects you can be sold. No protection is free; always ask who operates the pipe and what their incentive is when your trade is profitable to reorder. Concentration plus trust is the classic recipe for a future incident, so watch it the way you watch relays."
        ]
      },
      {
        "heading": "PBS economics",
        "paragraphs": [
          "Builders bid for the right to fill the proposer’s slot, and competition means proposers capture most of the extracted value — commonly estimated above 90% of a block’s MEV passes to the proposer as the winning bid. Builders compete on latency, exclusivity deals and private orderflow; as of 2026 a small number of builders produce most blocks, a concentration critics watch closely.",
          "Relays are the trusted hinge: proposers blind-sign headers, so relays can withhold payloads, filter transactions (as seen when certain addresses were screened under sanctions pressure in 2022-2023), or simply fail. Mitigations — multiple relays, inclusion lists, eventual in-protocol PBS — remain active roadmap debates as of 2026. Relay failures in practice look like missed slots and delayed payments, not stolen blocks — the trust is narrower than it sounds, but real.",
          "Why Ethereum accepted this: PBS was designed to dampen the worst MEV incentive — reorganizing recent blocks to capture their value (time-bandit attacks). The alternative was constant reorg-for-profit pressure that no chain could survive; auctioning was the compromise that made MEV visible and payable instead of hidden and destabilizing. When MEV is auctioned transparently and paid to the proposer, honestly selling the block beats attacking the chain for it."
        ],
        "callout": {
          "type": "deep-dive",
          "title": "Flash Boys 2.0 (2019)",
          "body": "Daian et al. formalized transaction-ordering profit as a consensus-layer threat: when block rewards are small relative to MEV, rational validators may reorg. That paper named the problem; PBS and MEV-burn proposals are the ecosystem’s ongoing answers."
        }
      },
      {
        "heading": "MEV as design pressure on L1 and L2",
        "paragraphs": [
          "On L1, MEV shaped fee market design (EIP-1559’s base-fee burn), the push toward enshrined PBS, inclusion lists against builder censorship, and research into MEV-aware mempool rules. The protocol increasingly treats MEV as physics to manage rather than a bug to delete — the design question is who captures it and who is protected from it. The physics framing is deliberate: you engineer around gravity, you do not legislate it away.",
          "On L2s, whoever runs the sequencer inherits the ordering right, so MEV is central to sequencer decentralization (lesson 3): who extracts, who pays, and whether users get protections they enjoy on L1. Some rollups route sequencing MEV to public goods; others monetize it directly. At the application layer, per-dapp orderflow auctions and batch auctions push extraction into designed venues with explicit rules."
        ]
      },
      {
        "heading": "Hygiene for users and builders",
        "paragraphs": [
          "MEV cannot be abolished; it can be priced, redistributed and defended against. Users and developers each have a short list that removes most of the damage — none of it heroic, all of it effective. Most real-world losses come from skipping one of these in the heat of a trade, so make them defaults rather than afterthoughts. Defaults beat diligence, because most users will never read a blog post about sandwiches.",
          "For developers the same list reads as design requirements rather than user tips: batch auctions instead of naive order matching, commit-reveal where ordering matters, and callback surfaces that assume a hostile re-entry. MEV-awareness is far cheaper to build in before launch than to retrofit after — the retrofits are how the expensive public incidents happen. Retrofitting ordering-resistance into a live protocol is where the expensive public lessons happen."
        ],
        "list": [
          "Set explicit, tight slippage caps and transaction deadlines on every swap.",
          "Use a protecting RPC (private submission) for trades; accept the small latency cost.",
          "Prefer intent-based routers or batch auctions for large orders.",
          "Split large trades across time or venues to shrink per-transaction price impact.",
          "For builders: use commit-reveal or batch ordering, and design oracles and callbacks to be read-only-reentrancy safe."
        ],
        "callout": {
          "type": "tip",
          "title": "MEV-awareness is a design skill",
          "body": "The best MEV protection is structural: protocols that batch orders, hide intent until execution, or make reordering worthless remove the profit before bots can compete for it. When you review a design, ask what a searcher would do with the right to reorder its transactions."
        }
      }
    ],
    "keyTerms": [
      {
        "term": "MEV",
        "definition": "Value extractable by ordering, inserting or censoring transactions in a block, beyond standard rewards."
      },
      {
        "term": "Searcher",
        "definition": "An actor who finds MEV opportunities and bids for block placement of their bundles."
      },
      {
        "term": "Builder",
        "definition": "An actor assembling complete blocks from bundles and transactions to maximize bid value."
      },
      {
        "term": "Relay",
        "definition": "A trusted intermediary serving block headers to proposers and mediating builder payment; today’s censorship chokepoint."
      },
      {
        "term": "Sandwich attack",
        "definition": "Front-running and back-running a victim’s swap to capture their price impact as profit."
      },
      {
        "term": "Backrun",
        "definition": "A transaction placed immediately after a price-moving event to capture the created arbitrage."
      },
      {
        "term": "Orderflow auction",
        "definition": "A market where users’ transaction flow is auctioned to searchers, sharing proceeds with users (e.g., MEV-Share)."
      },
      {
        "term": "PBS",
        "definition": "Proposer-builder separation: auctioning block construction so proposers sell ordering rights instead of exploiting them."
      }
    ],
    "practices": [
      {
        "id": "mev-p1",
        "title": "See MEV in the wild",
        "goal": "Read real blocks and identify sandwiches and backruns from public data alone.",
        "steps": [
          "Open https://beaconcha.in and open a recent block; note whether it was built via MEV-boost and by which builder and relay.",
          "Open a few DEX swap transactions in that block on an explorer and look for pairs: a buy and a sell of the same token by the same address immediately around a victim swap.",
          "For one sandwich, read the three transactions in order (front-run, victim, backrun) and record the attacker’s net profit.",
          "Find a pure backrun: an arbitrage transaction in the same block as a price-moving event, typically from a known searcher address.",
          "Estimate what fraction of that block’s builder bid came from MEV-style transactions versus plain transfers."
        ],
        "caution": "Observation only. Never run bots or MEV tooling against mainnet from a learning account — you can lose real funds and disrupt live markets."
      },
      {
        "id": "mev-p2",
        "title": "Simulate a sandwich on a fork",
        "goal": "Reproduce the arithmetic of the worked example in a controlled local simulation.",
        "steps": [
          "In a Foundry project, configure a fork test against a public RPC (forge test --fork-url) targeting a major DEX pool.",
          "Write a test where a large swap moves the pool price; log the price before and after.",
          "Add attacker transactions around the victim swap and compute the attacker’s profit in the test.",
          "Confirm the profit roughly equals the victim’s extra slippage minus fees.",
          "Keep it a local simulation — nothing is broadcast anywhere."
        ],
        "caution": "Simulation only, against a forked chain in your own test suite. Never broadcast MEV tooling from a learning account; live interference can backfire legally and financially."
      }
    ],
    "resources": [
      {
        "title": "MEV — ethereum.org developer docs",
        "url": "https://ethereum.org/en/developers/docs/mev/",
        "type": "docs",
        "note": "Official MEV overview including PBS."
      },
      {
        "title": "Flash Boys 2.0 (Daian et al., 2019)",
        "url": "https://arxiv.org/abs/1904.05234",
        "type": "paper",
        "note": "The paper that named the problem."
      },
      {
        "title": "Flashbots public repository",
        "url": "https://github.com/flashbots/pm",
        "type": "docs",
        "note": "MEV-boost, MEV-Share and research coordination."
      },
      {
        "title": "ethresear.ch",
        "url": "https://ethresear.ch",
        "type": "article",
        "note": "Where MEV design debates play out in public."
      }
    ],
    "quiz": [
      {
        "id": "mev-q1",
        "prompt": "Under PBS as deployed today, who ends up capturing most extracted MEV?",
        "options": [
          "Searchers, who keep their edge.",
          "Builders, who set the bids.",
          "Proposers, via competitive builder bids.",
          "Relays, as service fees."
        ],
        "correctIndex": 2,
        "explanation": "Builders compete against each other for each slot, so most of a block’s value flows to whoever owns the slot as the winning bid. That capture — and its implication for stake yields — is why PBS changed validator economics."
      },
      {
        "id": "mev-q2",
        "prompt": "In a sandwich attack, where does the attacker’s profit come from?",
        "options": [
          "The protocol’s fee pool.",
          "The victim’s own price impact — the attacker buys before, raising the price the victim pays, and sells after into the price the victim moved.",
          "Block rewards from the proposer.",
          "Oracle reporting delays."
        ],
        "correctIndex": 1,
        "explanation": "The sandwich monetizes the victim’s slippage: buy ahead of the trade, let the victim’s own size move the price, then sell into it. That is why slippage caps and private orderflow are the direct defenses."
      },
      {
        "id": "mev-q3",
        "prompt": "Why was MEV a consensus-layer threat before PBS?",
        "options": [
          "Because mempools leaked user data.",
          "Because when the MEV in recent blocks exceeds standard rewards, rational proposers might reorganize the chain to recapture it.",
          "Because DEXs were illegal.",
          "Because gas auctions were unfair."
        ],
        "correctIndex": 1,
        "explanation": "Flash Boys 2.0 formalized the time-bandit risk: ordering profit can outweigh honest proposing, destabilizing consensus itself. Transparent, auctioned MEV paid to the proposer dampens that incentive."
      },
      {
        "id": "mev-q4",
        "prompt": "What does an orderflow auction (MEV-Share style) actually give the user?",
        "options": [
          "Guaranteed zero MEV forever.",
          "Private submission plus a share of backrun proceeds — at the cost of trusting the auction operator.",
          "Faster block inclusion than the public mempool.",
          "Free transactions on all chains."
        ],
        "correctIndex": 1,
        "explanation": "The user’s order avoids the open mempool and backrun profits are partially refunded, but the protection depends on the operator running the auction honestly. It is a redistribution of MEV, not its elimination."
      }
    ]
  },
  {
    "id": "tokenomics",
    "level": "advanced",
    "order": 7,
    "title": "Tokenomics & Protocol Economics",
    "subtitle": "Value accrual, supply schedules and the search for sustainable demand",
    "minutes": 27,
    "objectives": [
      "Distinguish value-accrual mechanisms (cash flows, burns, required use) from governance-only claims.",
      "Compute dilution from emissions and unlocks, and reason about float versus FDV.",
      "Analyze staking yields (dilutive versus real) and ve-tokenomics with worked numbers.",
      "Evaluate points programs and apply a checklist for sustainable demand."
    ],
    "sections": [
      {
        "heading": "What makes a token worth anything",
        "paragraphs": [
          "Strip away narratives and a token accrues value through three channels: a claim on **cash flows** (fees routed to stakers, buybacks, burns), enforced **scarcity** (caps, declining emissions, burns), and **required use** (gas, collateral, access rights). A token whose only property is governance votes borrows its value from the expectation that governance will someday control fees or treasury. If none of these channels exists, the token is a claim on sentiment.",
          "That expectation is testable. Does activating the fee switch require a governance vote that may never pass, or is fee routing automatic? Value that depends on a future discretionary act is a promise; value that flows today is a fact. Analysts price the difference, and markets eventually do too — so ask who must say yes, and whether they have said it yet.",
          "Respect reflexivity in both directions: price strength attracts usage and liquidity, which supports the story; price weakness drains TVL and delegitimizes the token even when the product works. Token design shapes that loop but cannot repeal it — which is why designs that reduce dependence on the token price are more robust than designs that amplify it. The loop is the reason token design is a discipline rather than a spreadsheet."
        ]
      },
      {
        "heading": "Supply schedules: emissions, halvings, unlocks",
        "paragraphs": [
          "Unlocks matter as much as emissions: team and investor vesting converts into scheduled sell pressure. Compare circulating **float** against fully diluted valuation (**FDV**) — a token at 10% float and $10B FDV carries years of unlock overhang. A cliff unlock of 5% of supply in one month is a different event than the same tokens dribbled over five years. Shape matters: cliffs create events, linear schedules create pressure, and both show up in the chart.",
          "The analyst’s habit: divide FDV by float to see how much latent supply is waiting, then map the vesting calendar onto your holding horizon. Check the vesting calendar before you buy, not after the cliff hits — by then the information is only useful for explaining the chart. As of 2026, unlock dashboards are standard diligence, and high-FDV/low-float launches are widely treated as structural sell pressure."
        ],
        "code": {
          "lang": "ts",
          "code": "const yourTokens = 1_000_000;\nconst supplyStart = 100_000_000;\nconst emission = 5_000_000;\n\nconst shareAfter = yourTokens / (supplyStart + emission);\n// ≈ 0.009524 → your claim fell ~4.8% in one year",
          "caption": "One-line dilution math. Staking yield must beat emission growth for stakers to gain share."
        }
      },
      {
        "heading": "Fee switches, burns and buybacks",
        "paragraphs": [
          "When real revenue exists, the design question is what happens to it: distribute to stakers (transparent but requires trust in accounting), buy back and burn (deflationary, no per-recipient bookkeeping), or fund development (sustainable, but dilutive to the value story). Each allocates value differently and carries different accounting and regulatory baggage. EIP-1559 demonstrated burn at protocol scale: Ethereum burns its base fee, making total supply responsive to actual usage.",
          "Worked comparison: a protocol earns $50M in annual fees; its token trades at a $5B market cap. Fee-to-cap yield is 1% — equivalent to a 1% annual burn if all fees were burned. If the same protocol emits $120M per year in token incentives, net value accrual is negative (about -$70M): the token is effectively being bought with token inflation. Comparing fees and emissions in the same units is the single most clarifying calculation in tokenomics.",
          "Watch the accounting: fees quoted before referral rebates, loyalty discounts or LP profit-shares overstate what the token actually captures. Rebates and discounts are still costs — they simply do not appear in the headline fee number, which is why the full flow matters more than the figure. Demand gross revenue, protocol share, and token-holder share before believing a yield headline."
        ]
      },
      {
        "heading": "Staking yield: dilutive or real?",
        "paragraphs": [
          "Separate the two yield sources. **Emission yield** mints new tokens to stakers — real to you, dilutive to everyone else. **Fee yield** routes external cash flow to stakers — non-dilutive, actually earned. A protocol where all yield is emissions is redistributing among holders, not creating value. The test is simple: turn off emissions entirely and see what stakers still receive — that remainder is the protocol’s real, external income.",
          "Worked example: emission 4% per year with 25% of supply staked means stakers earn 16% gross (4% spread over 25%). But every non-staker eats the 4% dilution — and if everyone stakes, everyone earns exactly the 4% inflation: zero real gain. Real yield is the fee yield; emission yield is a stake-or-be-diluted forced game, a dynamic Ethereum’s own design deliberately includes.",
          "Reflexivity closes the loop: high nominal yields attract TVL; TVL makes the protocol look successful; the market funds more emissions; emissions stop and capital leaves — the boom-bust pattern of 2021-era farming. Yield that exists only while emissions exist is rented liquidity, not demand — and when the rent stops, you find out what was actually demanded. That is the difference between a protocol and an incentive program wearing one."
        ],
        "callout": {
          "type": "warning",
          "title": "APY is a snapshot, not a promise",
          "body": "Quoted yields assume today’s staked ratio and today’s token price. Both move. A 40% APY denominated in a token that loses 60% of its value is a loss — always ask what currency the yield is paid in and what sustains it."
        }
      },
      {
        "heading": "ve-tokenomics: locking time for power",
        "paragraphs": [
          "Curve’s design: lock tokens for up to four years to receive **veTokens** (vote-escrow); voting power scales with size and lock length; weekly emissions are allocated by gauge weight votes. Locking shrinks circulating supply and aligns voters with long-term value — at the cost of liquidity and flexibility for lockers. Locking is a personal sacrifice made credible by protocol rules, which is exactly why it signals alignment.",
          "The flywheel created an entire meta: protocols bribed veToken holders for gauge votes (Votium-style markets), making votes a tradeable cash flow and CRV emissions a currency that others compete to direct. It worked — deeply — and was copied across the industry. The bribe market is not a bug in the design; it is the design working exactly as the incentives imply.",
          "The critiques are structural: plutocracy (whales dominate votes), permanence (multi-year locks become painful through volatility), and a meta-game that directs emissions toward protocols willing to pay rather than those that deserve them. Copy the mechanism only if you can accept the politics that come with it — plutocracy is not an implementation detail you can patch out later. Curve worked because its politics matched its users; most copies cannot say the same."
        ]
      },
      {
        "heading": "Points and the degeneration problem",
        "paragraphs": [
          "Pre-token **points** promise a future airdrop without committing to anything on-chain. They bootstrap usage cheaply, but attract mercenary capital optimized to farm rather than use, make Sybil resistance the core problem, and force the eventual token to satisfy expectations priced in by thousands of farmers. Because nothing is committed on-chain, nothing is enforceable — points are pure expectation management, and expectations are the most expensive thing to mismanage.",
          "The degeneration pattern: points, airdrop, sell pressure, a new points program, fatigue. As of 2026 sophisticated users treat points as marketing, and the protocols with durable usage tend to be those whose demand would exist without the points. The analyst’s exit question is always the same: what remains when the faucet closes? If the answer is nothing, the token was the product — and points can start a flywheel, but they cannot be the flywheel."
        ]
      },
      {
        "heading": "A design checklist",
        "paragraphs": [
          "Whether you are evaluating or designing a token, run the list below. A token that fails most items is a marketing asset, not an economic one — and the checklist is deliberately unforgiving, because failing items are information, not decoration. It exists because most token failures are visible in advance — in the supply math, in the fee routing, or in the unlock calendar.",
          "Apply the list adversarially: assume each answer is marketing until you have verified it in code, contracts or on-chain data. The fee-routing question, for instance, is checkable in minutes on a block explorer — and if the only evidence you can find is a dashboard screenshot, then that fact is itself the answer to the checklist. Minutes of on-chain checking beat hours of reading marketing pages."
        ],
        "list": [
          "Is there a required use — gas, collateral, access — that creates floor demand?",
          "Are fees real, recurring, and actually routed to token holders or burn?",
          "Is emission declining, and does real yield beat dilution for stakers?",
          "What are float and FDV, and when do unlock cliffs hit?",
          "What happens to the loop at 10x usage — and at 0.1x?",
          "If every incentive stopped tomorrow, what demand would remain?"
        ],
        "callout": {
          "type": "deep-dive",
          "title": "Two tokens, one table",
          "body": "Token A: $100M float, $2B FDV, 8% emission, $10M fees. Token B: $300M float, $400M FDV, 2% emission, $60M fees, half routed to stakers. Run the arithmetic before reading either roadmap: A dilutes you faster than it earns, while B’s float-to-FDV ratio and fee coverage speak for themselves. The checklist turns narratives into columns of numbers you can argue about."
        }
      }
    ],
    "keyTerms": [
      {
        "term": "Value accrual",
        "definition": "The mechanism by which a token captures protocol success: cash flows, burns, or enforced utility."
      },
      {
        "term": "Emission schedule",
        "definition": "The rules for minting new supply over time; the primary driver of dilution."
      },
      {
        "term": "Dilution",
        "definition": "The loss of relative ownership from supply growth; emission minus your staking participation."
      },
      {
        "term": "Fee switch",
        "definition": "The mechanism (or promise) that routes protocol revenue to token holders; its activation is the test of governance-only value."
      },
      {
        "term": "Buyback-and-burn",
        "definition": "Spending revenue to repurchase and destroy tokens — deflationary value return without per-recipient accounting."
      },
      {
        "term": "ve-tokenomics",
        "definition": "Vote-escrow: lock tokens for voting power over emissions (Curve’s model), creating lock-ups and a bribe market."
      },
      {
        "term": "Float / FDV",
        "definition": "Circulating supply versus fully diluted valuation; the ratio measures unlock overhang and latent sell pressure."
      },
      {
        "term": "Reflexivity",
        "definition": "The feedback loop between token price and protocol fundamentals, which amplifies both booms and busts."
      }
    ],
    "practices": [
      {
        "id": "tokenomics-p1",
        "title": "Compute dilution and real yield from public data",
        "goal": "Do the two calculations that separate real economics from marketing.",
        "steps": [
          "Choose a protocol with a token and public docs or dashboards.",
          "Find or estimate annual token emissions (inflation schedule or incentive budget).",
          "Find or estimate annual protocol fees and what share accrues to token holders or burns.",
          "Compute dilution: emission divided by total supply.",
          "Compute staking gross yield: emission divided by staked supply; then real yield: fees to holders minus dilution.",
          "Write two sentences: is this token net accretive or net dilutive for a holder who does nothing?"
        ],
        "caution": "Estimates only, and not investment advice. Dashboards can be stale or flattered — treat any number you did not verify yourself as a hypothesis."
      },
      {
        "id": "tokenomics-p2",
        "title": "Map an unlock schedule",
        "goal": "Quantify the sell pressure hiding behind a price chart.",
        "steps": [
          "Pick a recently launched token with public vesting terms.",
          "Record current circulating float and FDV; compute float divided by FDV.",
          "Identify cliff dates and linear vesting periods for team and investor allocations.",
          "Estimate the largest single month of unlocks as a percentage of float.",
          "Write three sentences on what that overhang implies for a buyer at today’s price."
        ]
      }
    ],
    "resources": [
      {
        "title": "EIP-1559: Fee market change",
        "url": "https://eips.ethereum.org/EIPS/eip-1559",
        "type": "docs",
        "note": "Burn mechanics at protocol scale."
      },
      {
        "title": "EIP-155: Fixed supply schedule",
        "url": "https://eips.ethereum.org/EIPS/eip-155",
        "type": "docs",
        "note": "The original hard cap that turned ETH emission down."
      },
      {
        "title": "Ethereum Foundation blog",
        "url": "https://blog.ethereum.org",
        "type": "article",
        "note": "Protocol economics posts from the source."
      },
      {
        "title": "ethresear.ch",
        "url": "https://ethresear.ch",
        "type": "article",
        "note": "Open research on fee markets, MEV and monetary policy."
      }
    ],
    "quiz": [
      {
        "id": "tokenomics-q1",
        "prompt": "A protocol pays stakers 12% APY entirely from token emissions, with 50% of supply staked. What is the real yield for the ecosystem as a whole?",
        "options": [
          "12%, since stakers receive it.",
          "6%, half the stakers’ rate.",
          "Zero or negative — emission yield only redistributes among holders, so ecosystem-wide real yield equals fee yield (here, nothing) minus dilution.",
          "24%, compounding twice."
        ],
        "correctIndex": 2,
        "explanation": "Emission yield is a transfer from non-stakers to stakers; it creates no external cash flow. Ecosystem-wide real yield equals actual fee revenue — and everyone still eats the inflation. That is why fee yield, not emission yield, is the number that matters."
      },
      {
        "id": "tokenomics-q2",
        "prompt": "Supply is 100M with 5M annual emission. You hold 1M and do not stake. What is your ownership share after one year?",
        "options": [
          "1.0%",
          "0.99%",
          "About 0.952% (roughly 4.8% dilution)",
          "0.90%"
        ],
        "correctIndex": 2,
        "explanation": "1M divided by 105M is about 0.952% — your claim fell by the ratio of emission to new total supply. This one-line calculation is the honest denominator behind every headline APY."
      },
      {
        "id": "tokenomics-q3",
        "prompt": "What economic act does a four-year veToken lock perform?",
        "options": [
          "It burns tokens permanently.",
          "It removes tokens from circulation for the duration and grants voting power over emissions — making votes valuable enough to bribe.",
          "It guarantees a yield equal to protocol fees.",
          "It converts governance tokens into stablecoins."
        ],
        "correctIndex": 1,
        "explanation": "Locking reduces float and aligns voters with long-term value, and because votes direct emissions, a market to buy votes (bribes) emerges. That bribe market is the mechanism’s signature — and its main criticism."
      },
      {
        "id": "tokenomics-q4",
        "prompt": "A protocol earns $50M in annual fees, all burned, at a $5B market cap — while emitting $120M per year in incentives. What is the net value accrual?",
        "options": [
          "+1% per year, from the burn.",
          "+$170M per year.",
          "About -$70M per year — emissions exceed fees, so holders are net diluted.",
          "Zero, burns offset emissions exactly."
        ],
        "correctIndex": 2,
        "explanation": "Fees burn $50M while emissions add $120M of new supply: net -$70M. The fee-to-cap ratio (1%) is a useful standalone metric, but only the fees-minus-emissions comparison reveals direction."
      }
    ]
  },
  {
    "id": "account-abstraction",
    "level": "advanced",
    "order": 8,
    "title": "Account Abstraction",
    "subtitle": "From EOAs to smart accounts: 4337, 7702, passkeys and sponsored gas",
    "minutes": 25,
    "objectives": [
      "Explain the concrete limitations of EOAs that account abstraction addresses.",
      "Describe the ERC-4337 architecture — UserOperation, bundler, EntryPoint, paymaster — and its division of labor.",
      "Explain ERC-7702 EOA delegation and the new security considerations it introduces.",
      "Weigh passkeys, session keys and social recovery against the added attack surface of smart accounts."
    ],
    "sections": [
      {
        "heading": "The EOA ceiling",
        "paragraphs": [
          "An externally owned account is just a secp256k1 key pair with an address derived from its public key. Authority is binary: whoever holds the key can do anything; anyone without it can do nothing. There is no spending limit, no key rotation, no recovery path, no batching, no expiry, and no way to pay gas in anything but the chain’s native token.",
          "Those limits shaped a decade of UX debt: seed phrases that must never be lost or seen, approval spam because session permissions do not exist, and onboarding friction because users need tokens to pay gas before they can acquire tokens. Smart contract wallets such as Safe existed for years — what was missing was a standard way for them to pay gas and be included by nodes.",
          "Account abstraction is the umbrella for fixing this: make the account itself programmable, and standardize how such accounts transact without redesigning the protocol’s core. It is less one upgrade than a decade-long migration of where account logic lives — from a fixed key-pair rule burned into consensus, to code that wallets, apps and users can compose. Everything in this lesson is a station on that migration path."
        ]
      },
      {
        "heading": "Smart accounts in principle",
        "paragraphs": [
          "A smart account is a contract with two core functions: **validate** (is this request authorized, and within what limits?) and **execute** (do it). Validation logic can be anything — multiple keys, passkeys, social recovery, session rules, spending caps, time locks. Done well this is genuinely more secure; done badly it is a new bug class with your funds inside it.",
          "Why not let consensus validate contract accounts directly? Because consensus must charge predictable gas for validation, and arbitrary validation code creates denial-of-service and cost hazards. The 4337 answer: leave the protocol untouched and route through a standardized pseudo-transaction with capped validation gas — keeping arbitrary code off the hot path that every node must execute for every transaction. That single constraint explains most of 4337's architecture."
        ]
      },
      {
        "heading": "ERC-4337, end to end",
        "paragraphs": [
          "The flow: the user signs a **UserOperation** — a pseudo-transaction carrying the intent, the account, call data and gas settings. A **bundler**, an off-chain actor resembling a block builder, collects UserOperations, verifies they pass simulation, and pays real gas to include a bundle addressed to the global **EntryPoint** contract. The EntryPoint then calls each account’s validateUserOp and executes the calls, reimbursing the bundler.",
          "The **paymaster** is the gas abstraction: a contract agreeing to sponsor UserOperations that meet its rules — its own product’s users, or payment accepted in ERC-20 tokens. Paymasters carry griefing risk, so they must bound acceptance with verification rules and per-entity limits; the paymaster’s promise is economic, and its acceptance rules are the only thing standing between it and griefers.",
          "Because 4337 required no consensus changes, it shipped as pure infrastructure. The costs are a separate mempool of UserOperations and reliance on bundler and paymaster operators. That trade — infrastructure flexibility versus operational dependence — is the root of most 4337 criticism, and the roadmap items (signature aggregation, native rollup support) aim squarely at it. The roadmap items exist to close exactly this gap."
        ],
        "code": {
          "lang": "solidity",
          "code": "interface Simple4337Account {\n    function validateUserOp(\n        UserOperation calldata userOp,\n        bytes32 userOpHash,\n        uint256 missingFunds\n    ) external returns (uint256 validationData);\n\n    function execute(address target, uint256 value, bytes calldata data) external;\n}",
          "caption": "The two functions at the heart of every 4337 account. Passkeys, sessions and recovery all plug into validateUserOp."
        }
      },
      {
        "heading": "ERC-7702: EOAs become smart accounts",
        "paragraphs": [
          "EIP-7702, live with the 2025 Pectra upgrade, lets an EOA sign a **delegation**: a transaction type that attaches contract code to the EOA’s own address, so the EOA executes as a smart account while keeping its address and history. The signature does not move funds — it changes what the address is, which is arguably bigger. Existing accounts gain batching, sponsorship and session keys without migrating anywhere.",
          "Delegations can point at 4337-style account implementations, unifying the two worlds. The risks are equally direct: a signed delegation installs code — a phished 7702 signature can attach malicious logic to your account, and drainer kits moved fast on exactly this. Wallets must present delegation requests with the same gravity as fund transfers, and users must verify the implementing contract address.",
          "As of 2026 adoption is growing but uneven across wallets and chains. The practical rule: know which implementation contract your delegation points at, check that its upgrade path is one you trust, and revoke delegations you no longer use — treating them like live permissions rather than set-and-forget settings. Delegations are powerful enough that revoking them is a real operational habit, not a footnote."
        ],
        "callout": {
          "type": "warning",
          "title": "A 7702 signature can change what your address is",
          "body": "Signing a delegation trusts the target contract until it is changed. Treat delegation requests like code review, not like a message signature — check the implementation address carefully, and revoke delegations you no longer need."
        }
      },
      {
        "heading": "Passkeys, session keys and recovery",
        "paragraphs": [
          "Passkeys (WebAuthn) replace seed phrases with device-bound key pairs unlocked by biometrics. Chains must verify P-256 signatures; EVM precompile support via RIP-7212 has been adopted unevenly as of 2026, which affects cost more than capability. UX is excellent, but recovery remains the hard problem — passkeys die with the device unless escrowed or synced, and synced passkeys via platform vendors change the trust model: decide deliberately whose cloud holds your recovery.",
          "**Session keys** scope authority: a key that may call specific functions on specific contracts, up to a spend cap, until an expiry. Games and dApps use them to eliminate per-action approvals; the design discipline is least privilege — a session key should never be able to move everything, and its blast radius should be bounded by construction. The pattern generalizes to autonomous agents, which lesson 12 builds on directly.",
          "Social recovery composes with all of it: a smart account whose guardians — other keys, trusted people, institutions — can rotate the signing key after a delay. The trade is between convenience, trust in guardians, and delay windows that give you time to notice a compromise before it is irreversible. Guardian design is social engineering of yourself: choose guardians who cannot easily collude."
        ]
      },
      {
        "heading": "Gas sponsorship economics",
        "paragraphs": [
          "Sponsored gas removes onboarding’s chicken-and-egg problem — needing tokens to pay gas in order to get tokens. Paymasters sponsor verified users, accept ERC-20 gas priced through oracles, or run promotional campaigns; sponsorship converts onboarding friction into a line item the product controls. Every sponsor must bound griefing: verification gas caps, acceptance rules and per-user limits keep an attacker from monetizing free validation.",
          "Bundler economics mirror block building: bundlers include profitable UserOperations and compete on inclusion. The 4337 mempool rules — simulation requirements, stake minimums for paymasters — are the invisible scaffolding: they are what makes it safe for bundlers to accept arbitrary UserOperations without becoming a denial-of-service vector. This is why validation gas is capped and certain validation patterns are forbidden. Read them as safety engineering for an off-protocol market, which is what they are."
        ]
      },
      {
        "heading": "Security trade-offs",
        "paragraphs": [
          "A smart account is code, and code has bugs: upgradeable implementations are a rug vector, validation bugs can lock funds or enable theft, and the 7702/4337 tooling is younger than the EOA stack. The EOA model’s brutal simplicity — one key, no code — is also its safety property, and that simplicity is a feature pretending to be a limitation; the trade should be made consciously, not by default.",
          "Done well, smart accounts dominate on real security: key rotation, scoped permissions, no single point of total loss, and no seed phrase to phish. Safe-style multisigs are already the institutional standard, and a large share of on-chain value sits behind them. The frontier as of 2026 is making that security the default for individuals, not just organizations — because defaults are destiny in wallet security."
        ],
        "list": [
          "Key rotation and recovery: EOA no — smart account yes.",
          "Spending limits and session scopes: EOA no — smart account yes.",
          "Gas in ERC-20 or sponsored: EOA no — smart account yes.",
          "Batched transactions: EOA no — smart account yes.",
          "Attack surface: EOA key only — smart account key plus code plus upgrades."
        ]
      }
    ],
    "keyTerms": [
      {
        "term": "EOA",
        "definition": "Externally owned account: a raw key pair with no code; binary authority and native-token-only gas."
      },
      {
        "term": "Smart account",
        "definition": "A contract account with pluggable validation and execution logic — the unit of account abstraction."
      },
      {
        "term": "UserOperation",
        "definition": "The 4337 pseudo-transaction: intent, account, call data and gas settings, signed off-chain."
      },
      {
        "term": "Bundler",
        "definition": "The off-chain actor that packages UserOperations, pays gas, and is reimbursed through the EntryPoint."
      },
      {
        "term": "EntryPoint",
        "definition": "The global contract that validates UserOperations and executes calls for all 4337 accounts."
      },
      {
        "term": "Paymaster",
        "definition": "A contract sponsoring gas for UserOperations that meet its acceptance rules, bounded against griefing."
      },
      {
        "term": "ERC-7702 delegation",
        "definition": "A signed transaction type that attaches code to an EOA itself, making it act as a smart account."
      },
      {
        "term": "Session key",
        "definition": "A scoped, time-boxed, spend-capped sub-key — least-privilege authority for apps and agents."
      }
    ],
    "practices": [
      {
        "id": "account-abstraction-p1",
        "title": "Drive a 4337 smart account on a testnet",
        "goal": "Use the architecture hands-on and see its events from the outside.",
        "steps": [
          "Choose a smart-account wallet with 4337 support and a Sepolia faucet; create a smart account on Sepolia.",
          "Fund it with testnet ETH and send a batched transaction — two transfers in one UserOperation — if the interface supports it.",
          "Find the EntryPoint contract address your wallet used and look it up on the block explorer.",
          "Open your account’s transaction and locate the UserOperationEvent emitted by the EntryPoint.",
          "If sponsorship is available, send a gas-sponsored UserOperation and verify the paymaster covered the fee.",
          "Write down three capabilities this account has that a plain EOA lacks."
        ],
        "caution": "Testnet only. Never connect a funded mainnet wallet to experimental account-abstraction tooling."
      },
      {
        "id": "account-abstraction-p2",
        "title": "Read the 4337 spec like an engineer",
        "goal": "Ground the architecture in the primary source.",
        "steps": [
          "Open https://eips.ethereum.org/EIPS/eip-4337.",
          "List the UserOperation fields that have no equivalent in a normal transaction.",
          "Find the section on validation gas limits and note why validation is capped.",
          "Find the paymaster rules and write down two griefing protections.",
          "Note what the spec says about the alternative mempool and why bundlers reject certain operations."
        ]
      }
    ],
    "resources": [
      {
        "title": "EIP-4337: Account abstraction via EntryPoint",
        "url": "https://eips.ethereum.org/EIPS/eip-4337",
        "type": "docs",
        "note": "The primary specification."
      },
      {
        "title": "EIP-7702: Set EOA code",
        "url": "https://eips.ethereum.org/EIPS/eip-7702",
        "type": "docs",
        "note": "The delegation mechanism from Pectra."
      },
      {
        "title": "Account abstraction — ethereum.org roadmap",
        "url": "https://ethereum.org/en/roadmap/account-abstraction/",
        "type": "docs",
        "note": "Where the roadmap is taking accounts."
      },
      {
        "title": "EIP-1271: Contract signature validation",
        "url": "https://eips.ethereum.org/EIPS/eip-1271",
        "type": "docs",
        "note": "How contracts verify signatures on behalf of accounts."
      },
      {
        "title": "Safe",
        "url": "https://safe.global",
        "type": "tool",
        "note": "The most deployed smart account stack."
      }
    ],
    "quiz": [
      {
        "id": "account-abstraction-q1",
        "prompt": "Why can’t consensus validate smart-account operations with arbitrary logic directly?",
        "options": [
          "Because contracts cannot hold ETH.",
          "Because validation cost must be predictable and DoS-resistant; 4337 caps validation gas inside the EntryPoint and moves acceptance decisions to bundlers.",
          "Because ECDSA is faster than contract code.",
          "Because the mempool cannot hold contracts."
        ],
        "correctIndex": 1,
        "explanation": "Arbitrary validation code would let transactions cost unbounded consensus resources. The 4337 design caps validation gas, requires simulation, and lets bundlers decide what enters their bundles — keeping the protocol itself untouched."
      },
      {
        "id": "account-abstraction-q2",
        "prompt": "What does a paymaster commit to?",
        "options": [
          "Validating signatures on behalf of accounts.",
          "Paying gas for UserOperations that meet its acceptance rules, with griefing bounded by verification limits.",
          "Ordering UserOperations fairly.",
          "Storing account recovery keys."
        ],
        "correctIndex": 1,
        "explanation": "The paymaster accepts the gas bill for qualifying operations — sponsoring onboarding or accepting ERC-20 payment. Its economic risk is griefing, which is why the spec forces verification rules and gas caps."
      },
      {
        "id": "account-abstraction-q3",
        "prompt": "How does ERC-7702 differ from ERC-4337?",
        "options": [
          "7702 is for L2s only; 4337 is for L1.",
          "7702 attaches code to the EOA itself via a signed delegation (same address), while 4337 uses separate account contracts through an EntryPoint.",
          "7702 removes the need for signatures.",
          "7702 replaces the EntryPoint contract."
        ],
        "correctIndex": 1,
        "explanation": "7702 upgrades the EOA in place — the address keeps its history and gains code. 4337 keeps accounts as contracts and standardizes the transaction pipeline. They compose: delegated EOAs can act as 4337 accounts."
      },
      {
        "id": "account-abstraction-q4",
        "prompt": "Which design gives a dApp session-based access without letting it drain the account?",
        "options": [
          "Sharing the account’s private key with the dApp.",
          "A session key scoped to specific contracts and functions, with a spend cap and expiry.",
          "Approving unlimited ERC-20 allowance once.",
          "Disabling two-factor confirmation."
        ],
        "correctIndex": 1,
        "explanation": "Session keys express least privilege: specific contracts, specific functions, bounded spend, hard expiry. Unlimited approvals and shared keys are the patterns account abstraction exists to retire."
      }
    ]
  },
  {
    "id": "interop-bridges",
    "level": "advanced",
    "order": 9,
    "title": "Interoperability & Bridges",
    "subtitle": "Moving value across chains — and why bridges became the top attack target",
    "minutes": 25,
    "objectives": [
      "Classify bridges by trust model: lock-and-mint, liquidity networks, and native verification with light clients.",
      "Explain why bridges concentrate attack value, and recount the Ronin, Wormhole and Harmony failure patterns.",
      "Compare messaging layers (LayerZero, Wormhole, Across) conceptually by who attests to remote events.",
      "Evaluate shared security and rollup-native interoperability as the trajectory past third-party bridges."
    ],
    "sections": [
      {
        "heading": "Why bridging is hard",
        "paragraphs": [
          "A chain cannot natively observe another chain: validators verify their own consensus, not a neighbor’s. Any cross-chain system therefore needs some party or mechanism to attest that an event happened elsewhere — funds locked, a message signed, a state root included. Every bridge is a choice of who that attester is, and the choice is the security model. Attestation is the whole design; everything else is packaging.",
          "The economics amplify the risk. Bridged assets on the destination are claims minted against locked collateral on the source, so a bug or key compromise does not merely lose the locked funds — it can mint unbacked claims across every connected chain at once. Bridges concentrate the value of many ecosystems into a few contracts and keys. Value concentrates where trust concentrates, and bridges compress trust dramatically.",
          "That is why bridge security is asymmetric with protocol security: a DEX bug drains one pool; a bridge bug drains everything the bridge ever locked, everywhere. The damage propagates to every protocol holding the wrapped asset, on every connected chain, within minutes — before most teams have even read the exploit transaction. That propagation speed is why bridge incidents are ecosystem events rather than protocol events."
        ]
      },
      {
        "heading": "A taxonomy of bridges",
        "paragraphs": [
          "Lock-and-mint (canonical) bridges lock assets on the source and mint wrapped representations on the destination; burning unwraps. **Liquidity networks** hold pools on both sides and swap rather than wrap — faster, but liquidity providers bear inventory risk. **Native verification** bridges run light clients of the counterpart chain and verify its consensus or proofs directly: the strongest model, and the hardest to build.",
          "Rollups’ canonical bridges are native verification of a special kind: Ethereum verifies the rollup’s proofs, so the L1-to-L2 bridge inherits L1 security without extra attesters. Third-party bridges between arbitrary chains usually cannot afford full light clients of each other — running counterpart consensus is expensive and chain-specific — which is where external attestors enter. Inheriting Ethereum's security is the strongest bridge property a design can have."
        ],
        "table": {
          "headers": [
            "Model",
            "Who attests",
            "Primary failure mode"
          ],
          "rows": [
            [
              "Lock-and-mint",
              "External validators or multisig",
              "Key compromise → unbacked minting"
            ],
            [
              "Liquidity network",
              "LP pools + optimistic verification",
              "LP insolvency, config bugs"
            ],
            [
              "Native verification",
              "The counterpart chain itself",
              "Light-client bugs, coverage limits"
            ],
            [
              "Custodial",
              "A company",
              "Custody risk, opacity"
            ]
          ]
        }
      },
      {
        "heading": "Why bridges are the top attack target",
        "paragraphs": [
          "The record is stark. **Ronin** (March 2022): the Axie Infinity sidechain bridge required 5 of 9 validator keys; attackers, attributed to the DPRK-linked Lazarus group, socially engineered their way to five keys and drained about $625M. **Wormhole** (February 2022): a signature-verification bug in its Solana contract let an attacker mint 120,000 unbacked wETH (about $320M); the hole was covered by a recapitalization. **Harmony** (June 2022): a 2-of-5 multisig compromise cost about $100M.",
          "The shared pattern: value custody compressed into a small key set or one verification bug, with mints on multiple chains hanging off a single trust root. Chainalysis tracked these among the largest thefts of the era — for a period, bridge TVL was effectively the ecosystem’s largest honeypot. The honeypot was not an accident; it was the natural result of compressing cross-chain trust into few keys.",
          "The defenses are structural: distribute and time-delay control (larger validator sets, high-threshold multisigs with timelocks), minimize custodied value (liquidity networks over lock-and-mint where possible), and prefer native verification — rollup canonical bridges — for large transfers. Each defense trades convenience or speed for attack cost, and the bridges that survived 2022 deployed all three at once, plus timelocks that convert stolen credentials into recoverable incidents."
        ],
        "callout": {
          "type": "warning",
          "title": "A wrapped asset is an IOU",
          "body": "Wrapped ETH on a sidechain is not ETH; it is a claim on whoever operates the bridge. Its security is the bridge’s, and its worst case is total unbacking. Size positions accordingly."
        }
      },
      {
        "heading": "Reading a bridge like an analyst",
        "paragraphs": [
          "The due-diligence questions: who can mint or release funds, and at what threshold? Are upgrades and withdrawals timelocked? What happens if attesters disappear or collude — is there a delay, a security council, an emergency pause? Has the bridge been audited more than once, has it appeared on rekt.news, and how were past incidents handled? If any answer is a small multisig with no delay, treat the bridge as custodial.",
          "Also ask the quiet question: is the bridge needed at all? For rollup users, the canonical bridge is usually the safest path for large amounts despite slower withdrawals. Fast third-party bridges are a convenience premium paid for speed — best used with smaller amounts, on the assumption that any wrapped asset can unback. Speed is a product feature; security is a product property."
        ]
      },
      {
        "heading": "Messaging layers",
        "paragraphs": [
          "General message passing generalized the bridge: instead of moving assets, move authenticated messages that applications interpret. **LayerZero** uses configurable trust — an oracle feeds block headers and a relayer submits proofs, with applications choosing (and able to mix) the providers. **Wormhole** uses a fixed guardian set of 19 that signs observations of events. **Across** focuses on fast intent-based transfers, with LPs filling on the destination and optimistic verification on the source.",
          "None of these is trustless in the light-client sense; each picks a different attestation structure with different costs and failure modes. The analyst’s question is identical for all: who can attest falsely, what stops them, and how would I know? Configurability is not security — it just relocates the choice to you, along with the consequences. Messaging configs are part of your security surface whether you wrote them or not.",
          "As of 2026, messaging layers power most cross-chain applications — governance calls, NFT moves, intent settlement. Your app inherits whichever trust configuration it ships with, so the guardian set and oracle choices are part of your threat model whether or not you wrote them. Treating messaging configs as first-class security decisions is now standard practice. Shipping with the weakest attestation configuration to save costs is how app-layer bridge incidents start."
        ]
      },
      {
        "heading": "Shared security and the rollup interop trajectory",
        "paragraphs": [
          "The endgame many argue for: rollups that settle to Ethereum already share L1 finality, so interoperability built on L1-verified state — shared or based sequencing, enshrined rollup validation, shared proof aggregation — can be trust-minimized in a way third-party bridges cannot. Two rollups anchored to the same L1 can verify each other through the L1 they both trust; interop becomes a consequence of shared settlement rather than an added trust assumption.",
          "Shared sequencers would additionally enable atomic cross-rollup composability: a transaction touching multiple rollups executes everywhere or nowhere. That property — atomicity across domains — is the real prize, because it is what composability actually means. As of 2026 these designs are contested and partially deployed; fragmentation is the present reality, and L1-anchored interoperability is the direction of travel. Atomicity is the difference between composability and mere coexistence.",
          "Meanwhile, shared security beyond Ethereum — restaked bridges, pooled validator sets, security councils — is an active experiment with mixed reviews. It reuses a security budget in the same sense as restaking (lesson 1), and the debate reappears here almost verbatim: does reusing a security budget concentrate resilience or spread risk? The honest answer depends on the correlation of failure modes across the services sharing it."
        ]
      },
      {
        "heading": "Practical bridging hygiene",
        "paragraphs": [
          "For practitioners, a short list saves careers and funds. Bridges fail predictably: the ones that survived 2022 either verify natively or distribute control widely with delays — prefer both, and treat speed as the thing you pay extra attention for. The list is short because the failure modes are short: keys, upgrades, and custody in transit — three seams, each checkable in minutes.",
          "When in doubt, the canonical bridge is the default answer for anything you cannot afford to lose; third-party bridges are for amounts where waiting longer costs more than the residual bridge risk. That framing — residual risk weighed against time cost, per transfer — is how professionals actually route funds, and it survives every incident cycle. Professionals route this way because it works across every incident cycle."
        ],
        "list": [
          "Use canonical rollup bridges for large transfers, even when slower.",
          "Test every new bridge with a small amount first.",
          "Check who attests, the threshold, timelocks, and audit history before trusting.",
          "Assume any wrapped asset can unback — size positions accordingly.",
          "Follow rekt.news for your bridge’s history and how past incidents were handled."
        ],
        "callout": {
          "type": "warning",
          "title": "Fast bridges carry the fast risks",
          "body": "Speed comes from someone taking on risk in the meantime — liquidity providers, external validators, or a custody model. Know which one it is before you click confirm, because that party is your counterparty for the duration of the transfer."
        }
      }
    ],
    "keyTerms": [
      {
        "term": "Bridge",
        "definition": "A system moving assets or messages between chains by attesting to events on one chain for the other."
      },
      {
        "term": "Lock-and-mint",
        "definition": "Locking assets on the source and minting wrapped claims on the destination; burn-to-unlock reverses it."
      },
      {
        "term": "Wrapped asset",
        "definition": "A destination-chain IOU representing locked collateral elsewhere — as secure as the bridge, nothing more."
      },
      {
        "term": "Light client",
        "definition": "A mechanism verifying another chain’s consensus (headers or proofs) without full validation — native verification for bridges."
      },
      {
        "term": "Liquidity network",
        "definition": "A bridge design that swaps via pooled liquidity on both sides instead of wrapping."
      },
      {
        "term": "Messaging layer",
        "definition": "General cross-chain message transport (LayerZero, Wormhole, Across) that apps build on."
      },
      {
        "term": "Canonical bridge",
        "definition": "The rollup’s official L1-anchored bridge, secured by Ethereum verifying the rollup itself."
      },
      {
        "term": "Shared security",
        "definition": "Multiple chains drawing on one security budget (validators, restaked stake) for cross-chain guarantees."
      }
    ],
    "practices": [
      {
        "id": "interop-bridges-p1",
        "title": "Deconstruct a bridge’s trust model",
        "goal": "Apply the analyst’s questions to a real bridge before trusting it.",
        "steps": [
          "Pick a bridge you have used, or one connecting two chains you follow.",
          "From its docs, identify who attests cross-chain events: multisig, validator set, guardians, light client, or optimistic verification?",
          "Find the signing threshold (for example 5-of-9) and how many independent entities hold keys.",
          "Check whether upgrades and withdrawals have timelocks or emergency powers, and who holds them.",
          "Search https://rekt.news for incidents involving this bridge or its components.",
          "Write a three-line trust summary you could show a friend before they move real funds."
        ]
      },
      {
        "id": "interop-bridges-p2",
        "title": "Compare canonical vs third-party bridging on testnet",
        "goal": "Feel the speed-versus-trust trade-off with zero real funds at stake.",
        "steps": [
          "On a public testnet, bridge a test asset to an L2 using the rollup’s canonical bridge; note the stated withdrawal period.",
          "Bridge the same asset back using a third-party or liquidity bridge if one supports the testnet.",
          "Compare speed, fees, and the information each interface gives you about custody in transit.",
          "For each path, identify who holds your funds mid-flight and what could go wrong there.",
          "Write two sentences on when you would choose each."
        ],
        "caution": "Testnet only. Bridges are the highest-risk contracts in the ecosystem; never experiment with real funds while learning."
      }
    ],
    "resources": [
      {
        "title": "Chainalysis — The Ronin/Axie bridge hack",
        "url": "https://www.chainalysis.com/blog/axie-infinity-ronin-bridge-dprk-hack-seizure",
        "type": "article",
        "note": "Forensic account of the largest bridge theft."
      },
      {
        "title": "rekt.news — Ronin",
        "url": "https://rekt.news/ronin-rekt/",
        "type": "article",
        "note": "Post-mortem of the validator-key compromise."
      },
      {
        "title": "rekt.news — Wormhole",
        "url": "https://rekt.news/wormhole-rekt/",
        "type": "article",
        "note": "The signature-verification bug, dissected."
      },
      {
        "title": "L2Beat",
        "url": "https://l2beat.com",
        "type": "tool",
        "note": "Rollup and bridge risk data."
      },
      {
        "title": "Layer 2 — ethereum.org",
        "url": "https://ethereum.org/en/layer-2/",
        "type": "docs",
        "note": "Canonical bridges in the L2 context."
      }
    ],
    "quiz": [
      {
        "id": "interop-bridges-q1",
        "prompt": "Why do bridge exploits tend to be larger than typical protocol exploits?",
        "options": [
          "Bridge code is always unaudited.",
          "Bridges concentrate custody and minting authority: a compromise can mint unbacked assets across many chains at once.",
          "Bridges cannot use oracles.",
          "Chains prohibit bridge insurance."
        ],
        "correctIndex": 1,
        "explanation": "The destination-side mint is the honeypot: control the attestation, and you can print claims against every chain the bridge touches. A DEX bug drains a pool; a bridge bug drains the bridge’s entire historical TVL."
      },
      {
        "id": "interop-bridges-q2",
        "prompt": "What was Ronin bridge’s root cause?",
        "options": [
          "A smart contract bug in the token standard.",
          "A 5-of-9 validator key threshold was met by compromising keys through social engineering.",
          "An oracle price manipulation.",
          "A reentrancy bug in withdrawals."
        ],
        "correctIndex": 1,
        "explanation": "The bridge trusted nine validators requiring five signatures; attackers obtained five keys and simply signed withdrawals. Small attestation sets plus human-targeted compromise is the recurring bridge failure pattern."
      },
      {
        "id": "interop-bridges-q3",
        "prompt": "What makes a native-verification bridge the strongest model?",
        "options": [
          "It is always the fastest option.",
          "It verifies the counterpart chain’s own consensus via light clients or proofs, with no external attesters to compromise.",
          "It requires no collateral.",
          "It is regulated by governments."
        ],
        "correctIndex": 1,
        "explanation": "With native verification, trust rests on the counterpart chain’s validator set itself — there is no small key set to steal. The costs are engineering difficulty and limited chain coverage, which is why it remains rare outside rollup canonical bridges."
      },
      {
        "id": "interop-bridges-q4",
        "prompt": "Why might rollup-to-rollup interoperability end up more trust-minimized than third-party bridges?",
        "options": [
          "Because rollups are always Stage 2.",
          "Because both rollups settle to Ethereum, so interop can be built on L1-verified state and finality that both already trust.",
          "Because rollups share the same sequencer.",
          "Because L2 tokens are cheaper to move."
        ],
        "correctIndex": 1,
        "explanation": "Shared settlement creates a common root of trust: each rollup’s state is L1-verified, so cross-rollup messages can be verified through the L1 instead of through external attesters. That is the core of the interop endgame debate."
      }
    ]
  },
  {
    "id": "zk-applications",
    "level": "advanced",
    "order": 10,
    "title": "ZK Applications",
    "subtitle": "Privacy, identity and provable computation — beyond faster rollups",
    "minutes": 24,
    "objectives": [
      "Distinguish ZK’s two superpowers — succinctness and privacy — and map application families to each.",
      "Explain private-transfer mechanics (commitments and nullifiers) and the Tornado Cash regulatory arc.",
      "Evaluate zk identity and proof-of-personhood designs, including the Worldcoin debate.",
      "Explain zkVMs and provable computation, and reason honestly about prover centralization."
    ],
    "sections": [
      {
        "heading": "Two superpowers, not one",
        "paragraphs": [
          "Scaling rollups use ZK’s **succinctness**: verification is cheaper than re-execution. Privacy applications use its **hiding** property: statements can be proven without revealing witnesses. Most production systems use both in different proportions, and conflating them produces confused analysis — rollups buy succinctness and skip privacy, mixers buy privacy and skip scaling, so read the claim carefully before the category name. The test is simple: ask what an outside observer learns from a successful verification — new computation, or nothing at all. Rollup verifiers learn nothing about your data; shielded-pool verifiers learn nothing about your balance — different silences, same mechanism.",
          "The application families: private payments and transfers (hiding amounts and counterparties), private identity and credentials (proving attributes selectively), provable computation (zkVMs, off-chain compute verified on-chain), and verifiable hidden-state games. This lesson is mostly about the second superpower and the machinery built around it — and the interesting products combine both superpowers in a single system. Succinctness products advertise speed; privacy products advertise confidentiality; the rare systems that deliver both honestly are the ones worth studying closely, because they had to solve the engineering problems of both at once."
        ]
      },
      {
        "heading": "Private transfers, mechanistically",
        "paragraphs": [
          "A shielded pool represents funds as **commitments** — hashes of (asset, amount, owner, secret). To spend, the owner proves in zero knowledge: I know a commitment inside the pool’s tree, I know its secret, and I reveal a fresh **nullifier** derived from it. The chain stores spent nullifiers to prevent double-spending — without learning which commitment was spent. Everything else is bookkeeping around those two facts. Two hashes and one proof replace an entire audit trail — that is why shielded pools scale privacy better than tumbler services ever did.",
          "That is Tornado Cash’s model, popularized with fixed denominations: deposit 1 ETH, later withdraw 1 ETH to a fresh address, linked only by knowledge of the secret. Fixed amounts simplified proofs and made mixing effective; the trade-off was an anonymity set shared with criminals — the mixer made that trade-off legible, but an anonymity set that includes everyone also includes the people you do not want to be pooled with. The denominations also made amounts uniform, which strengthened anonymity at the cost of flexibility — a design trade worth noticing.",
          "The regulatory fallout: OFAC sanctioned Tornado Cash and its immutable contract addresses in 2022 — an unprecedented act against autonomous code — exchanges delisted related addresses, and developers faced prosecution attempts. Court rulings and policy changes led to the sanctions being lifted in 2025, but the episode defined the debate: privacy tooling, compliance designs (viewing keys, selective disclosure), and how the law treats code-as-speech. Whatever your view on the policy, the episode is required reading for anyone building privacy infrastructure — the questions it raised about code, speech and sanctions are still open."
        ],
        "callout": {
          "type": "deep-dive",
          "title": "Nullifiers and privacy leaks",
          "body": "Even with perfect circuits, side channels leak: timing patterns, fixed amounts, withdrawal-to-DEX linkability, and metadata around when notes were created. Privacy is a systems property — the circuit is only one component, and usually not the weakest."
        }
      },
      {
        "heading": "Identity and proof-of-personhood",
        "paragraphs": [
          "The problem: prove a fact about a person — over 18, one-human-one-account, citizen of X, member of Y — without revealing identity documents or enabling surveillance. ZK credentials let an issuer sign an attribute and the holder prove statements about it selectively; designs from national eID research are now arriving on-chain. The cryptography is well understood; the governance is where designs genuinely differ. The holder chooses what to reveal per interaction — the difference between identity and surveillance. Compliance-friendly variants ship viewing keys so auditors can see without users being exposed.",
          "Proof-of-personhood pushes further to uniqueness: one account per human. Worldcoin’s approach — iris biometrics hashed at an Orb, with ZK membership proofs — attracted both adoption and sustained criticism: biometric collection centralization, coercion risks, exclusion of the unscannable, and the irreversibility of biometric compromise. Uniqueness is the hard requirement, and it is where every scheme pays its price — in biometrics, in social trust, or in exclusion. Every scheme pays somewhere: biometrics pay in irrevocability, social graphs pay in sybil resistance, ceremonies pay in scale.",
          "The alternatives trade differently: social-graph verification (web of trust), web2 attestation bridges, in-person key ceremonies, pseudonym parties. As of 2026 there is no dominant solution — the design space is genuinely contested. There is no neutral choice here either; every design picks its trade-off, and the right question is which trade-off you can defend publicly. Whichever you pick, write down what it fails at — your critics will find it anyway."
        ]
      },
      {
        "heading": "zkVMs and provable computation",
        "paragraphs": [
          "A **zkVM** is a virtual machine whose execution can be proven: run a program, receive outputs plus a proof that they follow from the program on the given inputs. Cairo (STARK-native), Noir (a circuit language), and RISC-V zkVMs (proving arbitrary compiled programs) are the main families as of 2026. The promise: any program becomes verifiable by anyone with a cheap verification budget. The verification budget stays constant as programs grow, which is the property that makes the whole category interesting.",
          "The catch is overhead: proving costs roughly 10x to 1000x the raw computation depending on workload and stack, plus real engineering effort to constrain the VM soundly. The overhead is the tax on verifiability — it shrinks each year, but anyone quoting near-zero proving costs today is selling something. Verification is cheap for everyone; the prover’s hardware bill is not. Prover time is the price of succinctness, paid once so verification can be paid by everyone. The ratio improves as dedicated proving hardware and better arithmetization land, but never to zero.",
          "What this enables: rollups that prove their own execution, applications proving heavy off-chain computation (game logic, matching engines, model inference — lesson 12), and a shift in audit practice from reviewing code to reviewing circuits and their arithmetization. The circuit review is where the real assurance work happens — if the circuit mis-encodes the intent, the proof is perfect and worthless. Auditing circuits is a real discipline with real tooling, and it is hiring."
        ]
      },
      {
        "heading": "The prover problem",
        "paragraphs": [
          "Verification is trustless; proving is not free. Who runs provers, on what hardware, and what happens when they are slow or down? In rollups, prover centralization is a liveness risk — batches cannot finalize without proofs — even when verification itself is permissionless. Permissionless verification without permissionless proving is half a system, and several rollups spent 2024-2026 shipping the other half. A batch that cannot be proven is a batch that cannot finalize, whatever the sequencer promised users.",
          "The frontier: prover markets (pay someone to prove), proof aggregation (amortize one verification across many proofs), recursion (proofs of proofs), and hardware acceleration. Each direction reduces prover power in a different way, and none eliminates the dependency yet — the dependency just gets cheaper and more diffuse. The honest summary: trustless in ZK means anyone can verify — it does not mean nobody can deny you timely service. Watch this space: every quarter, proving gets cheaper, aggregation gets better, and the centralization argument gets weaker — revisit these assumptions before repeating them."
        ]
      },
      {
        "heading": "Judgment: when ZK is worth it",
        "paragraphs": [
          "Worth it: compliance-friendly privacy with selective disclosure, credential checks where privacy matters, heavy off-chain computation whose integrity justifies the prover cost, and scaling — where succinctness is the entire point. Not worth it: simple state machines where a signature suffices, or private systems whose anonymity set would be too small to protect anyone — a privacy tool with an anonymity set of five protects no one. The question is never is-ZK-good but whether the value of hiding or succinctness exceeds its cost here.",
          "And remember that circuits are code too: they need audits, testing and care, and several ZK systems have fallen to soundness bugs rather than broken mathematics. Treat circuit review as a required budget line, not a nice-to-have — the bugs are in the encoding, and the encoding is where nobody looks. Budget for it the way you budget for contract audits. Several well-funded teams have shipped broken circuits; the mathematics held and the products still failed — soundness bugs, not broken math, were the cause."
        ]
      }
    ],
    "keyTerms": [
      {
        "term": "Zero-knowledge proof",
        "definition": "A proof that a statement is true without revealing the witness — hiding plus (optionally) succinctness."
      },
      {
        "term": "Succinctness",
        "definition": "Verification being dramatically cheaper than re-execution; the property rollups buy."
      },
      {
        "term": "Nullifier",
        "definition": "A one-time revealed marker that prevents double-spending without revealing which commitment was spent."
      },
      {
        "term": "Shielded pool",
        "definition": "A contract holding funds as note commitments, with spends proven in ZK against the note tree."
      },
      {
        "term": "Arithmetization",
        "definition": "Compiling a computation into algebraic constraints a proof system can attest; where circuit bugs live."
      },
      {
        "term": "zkVM",
        "definition": "A virtual machine whose execution traces can be proven — Cairo, Noir, RISC-V zkVMs."
      },
      {
        "term": "Prover",
        "definition": "The party generating proofs; expensive, and a centralization/liveness concern even when verification is trustless."
      },
      {
        "term": "Proof-of-personhood",
        "definition": "Attesting one-human-one-account uniqueness — via biometrics, social graphs or ceremonies — with contested trade-offs."
      }
    ],
    "practices": [
      {
        "id": "zk-applications-p1",
        "title": "Watch a zk rollup prove on L1",
        "goal": "Move from theory to an actual verification transaction.",
        "steps": [
          "Open https://l2beat.com and pick a rollup listed with a zk proof system.",
          "Open the rollup’s block explorer and find the latest batch posted to Ethereum.",
          "Open the corresponding L1 transaction on an Ethereum explorer; locate the proof-verification call (often named verifyProof or similar).",
          "Note the size of the proof data compared with the batch’s claimed transaction count.",
          "Check L2Beat for whether proving is permissionless for this rollup today.",
          "Compare batch intervals: how often are proofs posted, and what does that imply about prover latency?",
          "Write two sentences on who currently runs provers for this rollup and what that implies."
        ]
      },
      {
        "id": "zk-applications-p2",
        "title": "Design a nullifier scheme on paper",
        "goal": "Test whether you understand what the circuit must and must not reveal.",
        "steps": [
          "Define a note format: what fields would you commit to for a private 10-token transfer?",
          "Write the spend statement: what exactly does the ZK proof assert, and what does it hide?",
          "Derive the nullifier: why must it be linkable to spent-ness but unlinkable to the commitment?",
          "List three side channels that could de-anonymize users despite correct circuits.",
          "Revisit your design a day later and attack it yourself."
        ]
      }
    ],
    "resources": [
      {
        "title": "ZK-rollups — ethereum.org",
        "url": "https://ethereum.org/en/developers/docs/scaling/zk-rollups/",
        "type": "docs",
        "note": "The scaling context for ZK systems."
      },
      {
        "title": "L2Beat",
        "url": "https://l2beat.com",
        "type": "tool",
        "note": "Which rollups use which proof systems, and their status."
      },
      {
        "title": "ethresear.ch",
        "url": "https://ethresear.ch",
        "type": "article",
        "note": "Open research on proofs, provers and privacy designs."
      },
      {
        "title": "Chainalysis blog",
        "url": "https://www.chainalysis.com/blog/",
        "type": "article",
        "note": "Regulatory and on-chain analytics reporting, including the Tornado Cash era."
      }
    ],
    "quiz": [
      {
        "id": "zk-applications-q1",
        "prompt": "What role does the nullifier play in a shielded pool?",
        "options": [
          "It encrypts the recipient’s address.",
          "It is a one-time revealed marker that prevents double-spending without revealing which commitment was spent.",
          "It stores the note’s amount on-chain.",
          "It replaces the need for signatures."
        ],
        "correctIndex": 1,
        "explanation": "Spending reveals a fresh nullifier derived from the note’s secret; the contract rejects reuse, so each note spends exactly once — and the link between nullifier and commitment stays hidden."
      },
      {
        "id": "zk-applications-q2",
        "prompt": "Why did regulators sanction Tornado Cash’s contract addresses rather than shutting it down?",
        "options": [
          "The developers were anonymous.",
          "Immutable autonomous contracts cannot be switched off by enforcement, so sanctions targeted interaction points — and were lifted in 2025 after legal challenges.",
          "The protocol was based offshore.",
          "The token was unregistered."
        ],
        "correctIndex": 1,
        "explanation": "The contracts have no admin, no pause and no operator — there is nothing to switch off. Sanctioning addresses constrained intermediaries instead, and the later delisting left the underlying questions about code-as-speech and privacy rights unresolved."
      },
      {
        "id": "zk-applications-q3",
        "prompt": "A zk system has centralized provers but permissionless verification. In what sense is it trustless?",
        "options": [
          "Fully trustless — provers cannot affect anything.",
          "Verification is trustless: anyone can check correctness; but you depend on provers for liveness and timeliness.",
          "Not trustless at all — provers can steal funds.",
          "Trustless only for large batches."
        ],
        "correctIndex": 1,
        "explanation": "Provers cannot make an invalid state valid — verification would reject it — but they can stall finalization. Trustless correctness, rented liveness: that distinction is the honest way to grade every zk system."
      },
      {
        "id": "zk-applications-q4",
        "prompt": "What is the strongest criticism of biometric proof-of-personhood schemes like Worldcoin’s?",
        "options": [
          "Iris scans are too expensive to run.",
          "Biometric data is irrevocable and collection is centralized and coercive — compromise or exclusion cannot be rolled back.",
          "They cannot be integrated with ZK proofs.",
          "They prove citizenship rather than uniqueness."
        ],
        "correctIndex": 1,
        "explanation": "You can rotate a compromised password, not an iris. Centralized enrollment also creates chokepoints for coercion and exclusion — which is why social-graph and ceremony-based alternatives, trading uniqueness for privacy, remain serious contenders."
      }
    ]
  },
  {
    "id": "rwa-institutional",
    "level": "advanced",
    "order": 11,
    "title": "Real-World Assets & Institutional DeFi",
    "subtitle": "When trillions meet blockchains: treasuries, credit, custody and the law",
    "minutes": 24,
    "objectives": [
      "Map the RWA landscape: tokenized treasuries, private credit, and tokenized funds in the BUIDL era.",
      "Explain the off-chain truth problem: custody, attestations, and the difference between wrappers and verified claims.",
      "Analyze permissioned (KYC-gated) DeFi and its trade-offs against permissionless composability.",
      "Summarize the regulatory texture — MiCA and US stablecoin legislation — with appropriate hedging."
    ],
    "sections": [
      {
        "heading": "What tokenization actually promises",
        "paragraphs": [
          "Tokenizing a real-world asset means representing a claim on it as a token: a share of a treasury fund, a slice of a loan book, a fraction of a building. The chain guarantees the representation’s integrity — ownership, transfer, programmability — but guarantees nothing about the underlying. That split is the source of both the opportunity and every hard problem in this lesson.",
          "The categories in production as of 2026: tokenized treasuries and money-market funds, private credit, tokenized funds and equity experiments, commodities, and real estate. The emblematic shift: BlackRock’s BUIDL tokenized treasury fund (launched 2024) moved tokenization from crypto-native startups to the largest asset managers — several billion dollars now sit in tokenized funds, a rounding error in global finance but a real foothold.",
          "Why institutions care: 24/7 settlement, instant collateral mobility between venues, programmable corporate actions, and atomic delivery-versus-payment. Tokenization does not create yield; it relocates and accelerates existing assets — and velocity itself is the product feature that traditional settlement rails, designed for T+2 cycles and banking hours, simply cannot match. The innovation is velocity, not yield — and velocity compounds across every venue that adopts it."
        ]
      },
      {
        "heading": "Tokenized treasuries, concretely",
        "paragraphs": [
          "Mechanics: a fund holds T-bills or repo with a regulated manager and custodian; the token is a share whose value tracks the fund; yield accrues via token price appreciation or rebasing; redemption follows the fund’s rules, not the chain’s. Worked example: a $100M fund yielding 5% adds roughly $13,700 per day before fees; a 0.5% annual management fee trims about $1,370 of that. The token’s economics are the fund’s economics plus wrapper friction.",
          "The killer app is collateral: a tokenized treasury can sit in a margin account, move between venues instantly, and be posted against trades while still earning its yield — something traditional settlement rails do slowly. Yield-earning collateral that moves in seconds is genuinely new; the yield itself is not. The new part is the plumbing, and plumbing is where the durable advantages live.",
          "A hedged reality check: yields track the risk-free rate and shrink in easing cycles; the products’ differentiators are operational, not return-generating. Operational superiority is the pitch, but operational risk is the price — wrappers, custodians and redemption gates are all operational surfaces that can fail. As of 2026 growth is real, but the sector remains small relative to global fund assets, and most of it is permissioned."
        ]
      },
      {
        "heading": "Private credit and its warnings",
        "paragraphs": [
          "On-chain private credit — loans originated off-chain and funded by on-chain lenders — boomed in 2021-2022 and then met reality: several prominent books reported delinquencies and defaults through 2022-2024, and lenders discovered that loan-level data arrived late and legal recourse was slow. The loans did not get worse because they were tokenized; the reporting just became impossible to hide. Tokenization had digitized the claims, not the borrower.",
          "The evaluation questions for credit RWAs are therefore credit questions, not crypto questions: who is the borrower, what is the collateral, what are the covenants, who services the loan, what happens on default, and who has standing in which court? A token of a bad loan is a bad loan — and on-chain transparency of the wrapper tells you nothing about the off-chain solvency of the borrower."
        ],
        "callout": {
          "type": "warning",
          "title": "Tokenization transfers representation, not risk",
          "body": "The chain can make a claim perfectly tradeable; it cannot make the underlying solvent. Treat any RWA yield above the risk-free rate as compensation for a risk you must independently evaluate — usually credit risk with a blockchain wrapper."
        }
      },
      {
        "heading": "The off-chain truth problem",
        "paragraphs": [
          "On-chain code can verify only what it can compute. Whether a T-bill exists in a custody account, whether a building stands, whether a loan was repaid — these are off-chain facts that reach the chain through custodian statements, auditor attestations and oracle reports. Each is a periodic, human-mediated snapshot: an **attestation**, not a proof. This is the ceiling of what the chain can know by itself.",
          "Trust is layered: asset manager, custodian, auditor, attestation provider, token contract. Any layer can fail — custodial commingling, stale attestations, or a wrapper contract drifting from its stated backing. Each layer is a dependency, and each dependency is a place to look during diligence. Proof-of-reserves dashboards help but have known limits: they demonstrate holdings at a moment, not liabilities at all times.",
          "The design frontier: continuous attestation, regulated reporting pipelines, on-chain identity so attestations are attributable, and legal wrappers engineered for **bankruptcy remoteness**, so a fund failure does not strand token holders behind unsecured creditors. As of 2026 these are improving but incomplete — RWA due diligence remains mostly legal and operational, not cryptographic. Off-chain diligence is the real work; the chain is just the last mile."
        ]
      },
      {
        "heading": "Permissioned DeFi",
        "paragraphs": [
          "Institutional demand brought **KYC-gated pools**: pools where eligibility is enforced on-chain through identity-bound tokens, transfer restrictions and whitelisted participants. This resolves the compliance blocker for regulated money while preserving atomic settlement and composability within the permissioned perimeter — a smaller world than open DeFi, but one regulators can actually approve. The perimeter is smaller, but every participant in it can be named and regulated.",
          "The trade-offs are structural: liquidity fragments across pools, composability shrinks to the whitelisted set, and censorship-compatible infrastructure — blocklists at the application or even sequencer level — enters the stack. Permissionlessness is not all-or-nothing; most real systems sit somewhere on a gradient. Whether permissioned and permissionless finance converge, coexist, or compete is one of the defining open questions as of 2026.",
          "Travel-rule obligations, sanctions screening and reporting duties increasingly reach on-chain participants through regulated intermediaries and compliant venues. Builders now design for auditability by regulators as a first-class requirement rather than an afterthought — and design reviews increasingly include a compliance reviewer alongside the security reviewer. Compliance reviews now sit beside security reviews in serious organizations, and shipping without one is its own risk decision."
        ]
      },
      {
        "heading": "Regulatory texture, hedged",
        "paragraphs": [
          "Europe’s **MiCA** regime took full effect during 2024, creating a unified licensing framework with specific rules for stablecoins (e-money tokens and asset-referenced tokens). The US moved in 2025 with federal stablecoin legislation — the **GENIUS Act** — establishing a framework for payment stablecoins. These are the two anchor regimes most cited by institutional desks as of 2026. Both frameworks answer the same question: who may issue a stablecoin, and what must back it.",
          "Open questions remain: whether yield-bearing tokens are securities in a given jurisdiction, how tokenized funds map onto existing fund law, cross-border recognition, and DeFi-specific obligations. Rules differ by jurisdiction and continue to move — jurisdictional arbitrage is a strategy, not a loophole, and it is slowly closing. None of this is legal advice; verify current law before acting on it.",
          "The useful frame for analysts: regulation is converging on stablecoins first, tokenized funds second, DeFi protocols last. The order is not accidental — it follows regulatory certainty, and each step of certainty expands what regulated institutions can touch on-chain, which is why the institutional footprint grows in that same order. Certainty arrives in the order institutions can price it, and adoption follows certainty."
        ]
      },
      {
        "heading": "An evaluation checklist",
        "paragraphs": [
          "When someone shows you an RWA product, run this list before admiring the dashboard. The uncomfortable questions in this space have uncomfortable answers, and the checklist exists to find them early — before your funds become the case study. The uncomfortable questions in this space have uncomfortable answers, and the checklist is built to surface them before they surface your users.",
          "One pattern recurs across every good answer: named, regulated, verifiable counterparties at every layer, with documents you can actually read. Vague answers — a leading custodian, regular attestations — are the red flag. A product’s willingness to answer precisely is itself a signal about what it is, and how it expects to be diligenced. Precision in disclosure correlates strongly with precision in operations — a pattern that has held across every product examined for this lesson."
        ],
        "list": [
          "What exactly is the underlying, and who holds it — custodian and jurisdiction?",
          "Who attests, how often, and can I read the attestations myself?",
          "What are the redemption terms, fees, and gates under stress?",
          "What legal wrapper stands between me and the asset, and is it bankruptcy-remote?",
          "What law governs, and what regulator supervises each party?",
          "What happens to the token if the manager, custodian or oracle fails?"
        ],
        "callout": {
          "type": "tip",
          "title": "Precision is the signal",
          "body": "One pattern recurs across every good answer: named, regulated, verifiable counterparties at every layer, with documents you can actually read. Vague answers — a leading custodian, regular attestations — are the red flag. A product’s willingness to answer precisely is itself a signal about what it is, and how it expects to be diligenced."
        }
      }
    ],
    "keyTerms": [
      {
        "term": "RWA (real-world asset)",
        "definition": "A token representing a claim on an off-chain asset — treasuries, credit, funds, property."
      },
      {
        "term": "Tokenized treasury",
        "definition": "A tokenized share of a T-bill or money-market fund; yield tracks the risk-free rate minus fees."
      },
      {
        "term": "Private credit",
        "definition": "Off-chain loans funded by on-chain lenders; tokenized claims whose risk is credit risk, not protocol risk."
      },
      {
        "term": "Attestation",
        "definition": "A periodic, human- or auditor-produced statement about off-chain state — trusted evidence, not cryptographic proof."
      },
      {
        "term": "Proof of reserves",
        "definition": "Dashboards or reports demonstrating backing at a point in time; limited by what they say about liabilities."
      },
      {
        "term": "Permissioned DeFi",
        "definition": "KYC-gated, identity-bound protocols where eligibility is enforced on-chain."
      },
      {
        "term": "Bankruptcy remoteness",
        "definition": "Legal structuring so a fund or manager failure does not strand token holders behind other creditors."
      },
      {
        "term": "MiCA",
        "definition": "The EU’s Markets in Crypto-Assets regime — unified licensing and stablecoin rules, in force since 2024."
      }
    ],
    "practices": [
      {
        "id": "rwa-institutional-p1",
        "title": "Evaluate a tokenized fund’s disclosures",
        "goal": "Apply the checklist to a real product using only public documents.",
        "steps": [
          "Choose a live tokenized treasury or money-market product.",
          "From its official docs, identify the asset manager, custodian, and any auditor or attestation provider.",
          "Find the redemption terms: notice periods, gates, minimums, and fees.",
          "Compute the net yield after fees and compare it with the prevailing short-term treasury rate.",
          "Check whether attestations are current, periodic, and independently produced.",
          "Write a three-sentence risk assessment covering representation, custody and redemption."
        ],
        "caution": "Educational exercise only — not investment advice. Do not purchase anything as part of this practice."
      },
      {
        "id": "rwa-institutional-p2",
        "title": "Compare two regulatory regimes at a glance",
        "goal": "Build the habit of grounding regulatory claims in primary or summary sources.",
        "steps": [
          "Read an official or high-quality summary of MiCA’s stablecoin rules (European Commission or a major law-firm summary).",
          "Read a summary of the US GENIUS Act stablecoin framework.",
          "For each, note who can issue, reserve requirements, and the supervisory authority.",
          "Identify one requirement present in one regime and absent in the other.",
          "Write two sentences on what these rules imply for a tokenized fund operating in both regions."
        ]
      }
    ],
    "resources": [
      {
        "title": "Chainalysis blog",
        "url": "https://www.chainalysis.com/blog/",
        "type": "article",
        "note": "Institutional adoption and compliance reporting."
      },
      {
        "title": "Stablecoins — ethereum.org",
        "url": "https://ethereum.org/en/stablecoins/",
        "type": "docs",
        "note": "The substrate most institutional flows settle in."
      },
      {
        "title": "Ethereum Foundation blog",
        "url": "https://blog.ethereum.org",
        "type": "article",
        "note": "Institutional and ecosystem developments from the source."
      },
      {
        "title": "Chainlink docs",
        "url": "https://docs.chain.link",
        "type": "docs",
        "note": "Oracle infrastructure commonly used for reserves and asset data."
      }
    ],
    "quiz": [
      {
        "id": "rwa-institutional-q1",
        "prompt": "What does tokenization NOT do for an underlying asset?",
        "options": [
          "It does not make it transferable.",
          "It does not transfer or improve the underlying’s risk or custody — the chain guarantees only the representation.",
          "It does not allow fractional ownership.",
          "It does not enable 24/7 settlement."
        ],
        "correctIndex": 1,
        "explanation": "The chain secures the wrapper: ownership records, transfer, programmability. Whether the T-bill exists, the loan performs, or the custodian is solvent are off-chain facts the token cannot vouch for."
      },
      {
        "id": "rwa-institutional-q2",
        "prompt": "Why are tokenized treasuries attractive as trading collateral?",
        "options": [
          "They yield more than other RWAs.",
          "They combine risk-free-ish yield with instant, programmable transferability that traditional settlement rails lack.",
          "They are exempt from regulation.",
          "They cannot be frozen."
        ],
        "correctIndex": 1,
        "explanation": "The value is operational: collateral that earns while it sits and moves in seconds between venues. The yield itself is just the risk-free rate — the innovation is velocity, not return."
      },
      {
        "id": "rwa-institutional-q3",
        "prompt": "What is the difference between an attestation and a proof in the RWA context?",
        "options": [
          "Attestations are cheaper.",
          "An attestation is a periodic, trusted snapshot of off-chain state; a proof is something the chain can verify computationally on its own.",
          "Attestations come from oracles; proofs come from auditors.",
          "There is no difference in practice."
        ],
        "correctIndex": 1,
        "explanation": "Chains can verify what they can compute — signatures, proofs, on-chain state. Off-chain truth arrives only as attestations: statements from custodians, auditors and oracles that you must trust on a schedule."
      },
      {
        "id": "rwa-institutional-q4",
        "prompt": "What do MiCA and the US GENIUS Act have in common?",
        "options": [
          "Both ban yield-bearing tokens.",
          "Both establish stablecoin-specific regulatory frameworks — EU licensing and reserve rules, and a US federal payment-stablecoin regime.",
          "Both regulate NFTs.",
          "Both are voluntary codes of conduct."
        ],
        "correctIndex": 1,
        "explanation": "Both regimes target stablecoins first — issuance, reserves, supervision — leaving securities questions for yield-bearing tokens open in both jurisdictions. Stablecoins first, tokenized funds second, DeFi protocols last."
      }
    ]
  },
  {
    "id": "ai-agents-crypto",
    "level": "advanced",
    "order": 12,
    "title": "AI Agents & Crypto",
    "subtitle": "Machine money: payments, identity and verification for autonomous agents",
    "minutes": 22,
    "objectives": [
      "Explain why autonomous agents need native, programmatic payments and what crypto rails offer.",
      "Describe x402-style HTTP payment flows and agentic commerce mechanics.",
      "Design scoped cryptographic identity and permissions for agents using session keys and smart accounts.",
      "Assess DeFAI’s risk profile and the open problem of verifying AI outputs."
    ],
    "sections": [
      {
        "heading": "Why agents need money",
        "paragraphs": [
          "An autonomous agent acts without a human in the loop: it fetches data, calls APIs, rents compute, buys services and settles obligations. Card rails assume a human identity, chargeback rights and minimum transaction sizes, and require enrollment per service. Agent commerce is frequent, tiny and machine-paced — a poor fit for rails designed for people. The mismatch is structural, not cosmetic — no amount of API polish fixes an identity requirement.",
          "Crypto offers the opposite shape: permissionless accounts (an agent can simply hold a wallet), micropayment-scale fees on L2s, no chargebacks, and programmable escrow. Every property maps to a requirement agents actually have — accounts that can be created programmatically, fees that vanish at machine scale, and settlement that cannot be reversed by a dispute department. Each maps one-to-one to a constraint agents face at machine pace.",
          "The honest framing: this thesis has been discussed for years. What changed by 2025-2026 is that agents became capable enough — LLM-driven planners and tool users — that the payment bottleneck became concrete. The bottleneck moved from intelligence to settlement: models got good enough to transact, and the rails had not caught up. Standards like x402-style HTTP payments emerged to close that gap."
        ]
      },
      {
        "heading": "x402-style payments and payment primitives",
        "paragraphs": [
          "HTTP has reserved status code 402 Payment Required — unused for decades. x402-style schemes revive it: a server replies 402 with payment instructions; the client (the agent) attaches a signed payment — often a stablecoin transfer or authorization — and retries; a facilitator verifies and settles on-chain; the server releases the content. No accounts, no card-on-file, settlement in seconds — the whole flow fits inside one HTTP conversation.",
          "Beyond per-call payments, the primitives compose: **streaming payments** (funds drip per second while a service runs), escrowed milestones released on verified delivery, on-chain subscriptions, and postpaid credit built on staking or reputation. None of these requires a human checkout flow, which is the entire point — the payment is part of the API, not a separate product. As of 2026 these are early but converging on recognizable patterns."
        ],
        "table": {
          "headers": [
            "Primitive",
            "Fits",
            "Caveat"
          ],
          "rows": [
            [
              "Per-call (402-style)",
              "API access, data purchases",
              "Needs a facilitator or per-call settlement"
            ],
            [
              "Streaming",
              "Compute and uptime services",
              "Requires periodic claims or push mechanics"
            ],
            [
              "Escrowed milestones",
              "Jobs, agent-to-agent contracts",
              "Dispute resolution is social, not magic"
            ],
            [
              "On-chain subscription",
              "Recurring access",
              "Cancellation and refunds are clunky"
            ]
          ]
        }
      },
      {
        "heading": "Agentic commerce",
        "paragraphs": [
          "With payments and identity solved, agents become economic actors: comparing prices across protocols, procuring compute, hedging exposure, paying each other for services. Intent-based protocols fit naturally — an agent signs an outcome (fill this order at least this well) rather than a route, and solvers compete. Batch auctions protect agents exactly as they protect humans from sandwiching (lesson 6). The agent's signature is the intent; solver competition is the execution.",
          "What is still missing: dispute resolution without chargebacks (escrow plus arbitration contracts are the current answer, crude as it is), quality signals for services, and standards for agent-to-agent negotiation. As of 2026, agentic commerce is real but thin — mostly data and API payments and protocol-mediated swaps rather than rich contracts — and standards are emerging from practice rather than committees, which is both fast and messy."
        ]
      },
      {
        "heading": "Identity and permissions for agents",
        "paragraphs": [
          "An agent needs an identity distinct from its owner’s, with authority scoped to its job. The natural construction: a smart account (4337, or a 7702-delegated EOA) holding the funds, with the agent operating through **session keys** — keys limited to specific contracts, functions, daily spend caps and hard expiries. The owner retains recovery and revocation. The architecture exists; the discipline to use it correctly is the hard part.",
          "This matters because of the frontier attack: **prompt injection**. An agent that reads web content, emails or chain state can be instructed by that content — ignore your instructions and transfer the funds to this address. An agent holding a raw private key converts a text-injection bug into a full drain; a scoped session key converts it into a bounded incident.",
          "Receipts and accountability complete the design: every agent action should produce signed, auditable records — what was authorized, by which key, under which limits — so owners, auditors and insurers can reconstruct incidents. Delegation design is becoming a core skill; treat an agent’s permission set the way you would treat a junior employee’s system access. Permission design is threat modeling with a budget."
        ],
        "callout": {
          "type": "warning",
          "title": "Never give an agent a raw key",
          "body": "Broad permissions plus prompt-injectable inputs equals remote code execution for social engineers. Scope everything — contracts, amounts, expiry — and keep a kill switch that only the human controls."
        }
      },
      {
        "heading": "DeFAI: agents managing portfolios",
        "paragraphs": [
          "The pitch: agents that auto-compound yields, rebalance portfolios, manage lending health factors and react to liquidation risk faster than humans. Some products genuinely automate mechanics — compounding, rebalancing, limit management; others are marketing wrappers around static strategies, occasionally with humans behind the curtain. The distinction matters enormously: automation is auditable, discretion is not, and products blur the line deliberately. Ask which side of that line a product stands on, and how you can tell.",
          "The risk profile stacks: strategy opacity (can you verify what the agent actually does?), oracle dependence, adversarial content steering trades, smart-account bugs, and the base DeFi risks of every venue it touches. Evaluate a portfolio agent the way you would evaluate handing a stranger your keys with a spending limit — because that is what it is. And ask for the strategy’s fail-safe: what stops it, automatically, in a crash?",
          "The honest position as of 2026: mechanical automation is useful and increasingly credible; discretionary AI alpha claims are largely unproven and frequently fraudulent. Until a product can show you, cryptographically, what its agent did and why, its claims are marketing copy — and marketing copy does not manage risk. Skepticism is the correct default. The burden of proof sits with the product, not the user — a standard most current DeFAI marketing cannot meet."
        ]
      },
      {
        "heading": "Verification: proving things about AI",
        "paragraphs": [
          "The open problem: a chain can verify signatures and computation, but not that an output was really produced by a specific model, honestly, with the claimed inputs. Yet many agent designs need exactly that — pay for inference only if it really ran, accept a trading signal only if the claimed model really produced it. This gap is the entire research agenda at the intersection of the two fields.",
          "Partial answers: **zkML** proves an inference was computed by a specific circuit — currently expensive (often orders of magnitude slower than raw inference) and only as sound as the circuit encoding. **TEEs** (attested hardware enclaves) prove code ran on genuine hardware — cheaper, but you trust the hardware vendor and its attestation chain. Signed outputs with reputation and slashing are the pragmatic baseline.",
          "None of these settles the semantic question: a correctly computed model output can still be wrong, biased or adversarial. Verification of computation is a solvable engineering problem; verification of judgment is not, and may never be. Design systems that bound the damage of a wrong answer rather than assuming proofs of it — bounded wrongness instead of guaranteed rightness. Bounded wrongness is an engineering goal; guaranteed rightness is a category error."
        ],
        "callout": {
          "type": "deep-dive",
          "title": "Why the chain can’t check the model",
          "body": "Consensus verifies deterministic computation over signed inputs. Model weights and stochastic sampling break determinism, and even deterministic inference at scale exceeds what validators can re-execute. Hence proofs and TEEs for execution — and reputation for everything else."
        }
      },
      {
        "heading": "A judgment checklist for the frontier",
        "paragraphs": [
          "Separating the durable from the speculative in this space is a skill, and it compounds with use. Work through the list below; it is designed to fail products quickly, which is the point — most agent claims do not survive question two. The list fails products quickly because most of them fail on question two — authority without scoping — and no amount of model quality compensates for that.",
          "Notice how the checklist reuses every lesson before it: question two is account abstraction, question three is the verification problem from this lesson, question six is tokenomics. The frontier is a capstone rather than a separate topic — which is why the judgment checklist, not the tech stack, is the deliverable of this whole track. That is the real test of whether this track landed: you can now fail an agent pitch in four questions."
        ],
        "list": [
          "Does this need a blockchain at all, or would a database and an API work?",
          "Are payments and permissions scoped, revocable and auditable?",
          "Can I verify any claim about the AI’s role, or is it unverifiable marketing?",
          "What happens when the agent is wrong — is there a hard bound on the loss?",
          "Who profits from the agent’s actions, and are the incentives disclosed?",
          "Would this still work if the token price fell 90% tomorrow?"
        ],
        "callout": {
          "type": "tip",
          "title": "Why none of the questions ask about model quality",
          "body": "In agentic systems the dangerous parts are authority, money and reversibility — not intelligence. A mediocre model with scoped permissions is a bounded nuisance; a brilliant model with a raw key is an unbounded problem. Scope first; benchmark later."
        }
      }
    ],
    "keyTerms": [
      {
        "term": "M2M payments",
        "definition": "Machine-to-machine settlement: frequent, tiny, programmatic payments between software agents."
      },
      {
        "term": "x402",
        "definition": "An HTTP-native payment pattern reviving status 402: payment instructions in the response, signed payment in the retry."
      },
      {
        "term": "Agentic commerce",
        "definition": "Autonomous agents buying services and assets, negotiating and settling without human checkout."
      },
      {
        "term": "Session key",
        "definition": "A scoped, capped, time-boxed sub-key on a smart account — the least-privilege unit of agent authority."
      },
      {
        "term": "Prompt injection",
        "definition": "Adversarial content that instructs an agent to act against its owner; the defining agent security threat."
      },
      {
        "term": "DeFAI",
        "definition": "DeFi managed by AI agents — credible for mechanical automation, largely unproven for discretionary alpha."
      },
      {
        "term": "zkML",
        "definition": "Zero-knowledge proofs of model inference; sound for computation, expensive, and silent about semantic quality."
      },
      {
        "term": "TEE",
        "definition": "Trusted execution environment: hardware-attested computation — cheaper than zkML, but you trust the vendor."
      }
    ],
    "practices": [
      {
        "id": "ai-agents-crypto-p1",
        "title": "Scope an agent’s permissions, then break them",
        "goal": "Practice least-privilege design for an autonomous actor — including its failure modes.",
        "steps": [
          "On paper, write a session-key spec for a testnet portfolio agent: allowed contracts, allowed functions, daily spend cap, expiry, kill-switch holder.",
          "On a public testnet, set up a smart account with spending limits — a Safe with a spending-limit module, or any 4337 wallet with session keys.",
          "Perform an in-scope action (a small transfer within the cap) and confirm it succeeds.",
          "Attempt an out-of-scope action — over the cap, or against a non-whitelisted contract — and confirm it is rejected.",
          "Simulate compromise: assume the session key leaked, write the incident steps (revoke, recover, notify), and estimate the maximum loss under your spec.",
          "Tighten one limit and repeat the out-of-scope attempt."
        ],
        "caution": "Testnet only, with throwaway keys. Never connect a funded wallet to agent tooling, and never let an agent hold a raw private key — even in demos."
      },
      {
        "id": "ai-agents-crypto-p2",
        "title": "Map an x402-style payment flow",
        "goal": "Trace who signs, who settles, and who is trusted in a machine payment.",
        "steps": [
          "Read the documentation of an x402-style HTTP payment standard (any active project’s spec will do).",
          "Draw the flow: client request, 402 challenge, signed payment, facilitator, on-chain settlement, content delivery.",
          "Mark each step: what is signed, what is settled on-chain, and what is trusted off-chain.",
          "Identify the facilitator’s role and what happens if it disappears or acts maliciously.",
          "Write a three-line trust summary comparing this to a card payment."
        ]
      }
    ],
    "resources": [
      {
        "title": "Accounts — ethereum.org developer docs",
        "url": "https://ethereum.org/en/developers/docs/accounts/",
        "type": "docs",
        "note": "The EOA/contract distinction underlying agent wallets."
      },
      {
        "title": "Safe",
        "url": "https://safe.global",
        "type": "tool",
        "note": "Smart-account infrastructure commonly used for scoped agent permissions."
      },
      {
        "title": "arXiv",
        "url": "https://arxiv.org",
        "type": "paper",
        "note": "Search here for zkML and agent-payment research literature."
      },
      {
        "title": "ethresear.ch",
        "url": "https://ethresear.ch",
        "type": "article",
        "note": "Open research on verification and permission designs."
      }
    ],
    "quiz": [
      {
        "id": "ai-agents-crypto-q1",
        "prompt": "Why do HTTP 402-style payments suit autonomous agents?",
        "options": [
          "They are cheaper than ACH transfers.",
          "They require no account signup or human identity — the payment travels with the request, enabling machine-paced micropayments without chargebacks.",
          "They are regulated in all jurisdictions.",
          "They only work on L1s."
        ],
        "correctIndex": 1,
        "explanation": "The agent’s signature is the identity; the 402 challenge-response is the checkout. No enrollment, no card-on-file, and final settlement without chargeback rails — exactly the shape machine commerce needs."
      },
      {
        "id": "ai-agents-crypto-q2",
        "prompt": "What is the correct key design for an agent that manages funds?",
        "options": [
          "A raw EOA key held by the agent for speed.",
          "Scoped session keys (contracts, functions, spend caps, expiry) on a smart account the human controls, with a kill switch.",
          "A multisig where the agent holds the majority.",
          "An unlimited approval to the agent’s contract."
        ],
        "correctIndex": 1,
        "explanation": "Least privilege bounds the blast radius: if the agent is prompt-injected or compromised, the damage is capped by the session key’s scopes. Raw keys and unlimited approvals turn a content bug into a full drain."
      },
      {
        "id": "ai-agents-crypto-q3",
        "prompt": "What can zkML prove today, and what can’t it?",
        "options": [
          "It proves the model is accurate and fair.",
          "It proves an inference ran as a specific circuit — at high cost — but says nothing about semantic correctness or model quality.",
          "It proves outputs were not manipulated by the operator.",
          "It makes inference free."
        ],
        "correctIndex": 1,
        "explanation": "zkML attests computation: these weights, this input, this output. It cannot attest that the model is good, unbiased, or correct — and its prover overhead keeps it far from most production inference today."
      },
      {
        "id": "ai-agents-crypto-q4",
        "prompt": "What is the reasonable default stance toward DeFAI products claiming AI-generated alpha, as of 2026?",
        "options": [
          "Trust but verify with the product’s own dashboard.",
          "Skepticism: mechanical automation is credible, discretionary alpha claims are largely unverified — evaluate as handing a stranger scoped keys.",
          "Confidence, since agents cannot lie.",
          "Indifference, since the technology is still pre-release."
        ],
        "correctIndex": 1,
        "explanation": "Mechanical automation (compounding, rebalancing) is verifiable and useful. Discretionary alpha claims are unverifiable marketing until products can cryptographically show what the agent did — and many are simply wrappers."
      }
    ]
  }
]

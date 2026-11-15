// Intermediate track — "Build and analyze" (11 lessons)
// Modules: I1 Smart contracts · I2 DeFi mechanics · I3 Scaling, governance, data

import type { Lesson } from '../types'

export const intermediateLessons: Lesson[] = [
  {
    id: "smart-contracts-101",
    level: "intermediate",
    order: 1,
    title: "Smart Contracts: Programs You Can't Turn Off",
    subtitle: "Self-enforcing code, immutability, upgrade paths, and why gas is a design constraint.",
    minutes: 18,
    objectives: [
      "Define what a smart contract is and trace what happens between deployment and execution.",
      "Explain the code-is-law idea: what it buys, what it risks, and who carries the responsibility.",
      "Compare immutable contracts with proxy-based upgradeable designs and name the trade-offs.",
      "Distinguish events from storage and describe how gas shapes every design decision."
    ],
    sections: [
      {
        heading: "Code that is the agreement",
        paragraphs: [
          "A smart contract is a program stored on a blockchain and executed by every node in the network. There is no server to hack, no admin to email, no office hours: the code runs when someone sends it a transaction, and the result is agreed by consensus. Like the contracts you know from law, it encodes obligations — *if* funds arrive, *then* they can be withdrawn under stated rules — except here enforcement is arithmetic, not a court.",
          "Deployment is itself a transaction. You compile source code to bytecode, send it to a special empty address, and the network stores the resulting runtime code at a new address derived from your wallet and a nonce. From that moment the contract is callable by anyone, forever, at the same address. Nobody can silently edit what is stored there; changing behavior means deploying something new.",
          "The radical part is custody. A contract can *own* assets: escrows, token treasuries, lending pools all hold balances whose movement is controlled purely by code. This is what people mean by trust-minimized — you replace a counterparty who might misbehave with a program whose behavior you can read. The precise phrase matters: you have not eliminated trust, you have moved it into code, oracles and governance."
        ]
      },
      {
        heading: "Code is law, with fine print",
        paragraphs: [
          "**Code is law** means the rules run without an operator: if the code permits a withdrawal, no one can veto it; if the code forbids it, no manager can wave it through. This buys real properties — censorship resistance, global access, predictable enforcement — and it is why the pattern is compelling for money. It also removes the safety net of human discretion that traditional institutions provide.",
          "The fine print: bugs are law too. In 2016, an attacker used a reentrancy bug to drain roughly 3.6 million ETH from [The DAO](https://en.wikipedia.org/wiki/The_DAO). The community responded with a contentious hard fork that reversed the theft — splitting the chain into Ethereum and Ethereum Classic and amending code-is-law at the social layer. The lesson stuck: immutable code still lives inside a human ecosystem, and at the deepest layer, people decide.",
          "For practitioners, code-is-law redistributes responsibility. Users cannot rely on chargebacks, so they read audits and risk pages before depositing. Developers carry the weight of every bug permanently. Regulators, meanwhile, ask who is accountable when code acts unlawfully — a question with no settled answer. Treat immutability as a claim you evaluate per contract, not a slogan."
        ],
        callout: {
          type: "deep-dive",
          title: "Law has layers",
          body: "Think of enforcement as a stack: the EVM is physics, contracts are statutes, and the social consensus around the chain is the constitutional layer that can, in extremis, amend everything. The DAO fork and The Merge both happened at that top layer. When someone says code is law, ask which layer they mean."
        }
      },
      {
        heading: "Immutable versus upgradeable",
        paragraphs: [
          "By default a contract is immutable: its logic can never change. The fix for mistakes is migrate-and-redeploy — ship version 2 and hope users move their balances. That works for apps, but it fails for contracts holding state users cannot easily move, and it breaks the address that other protocols have integrated.",
          "The dominant solution is the **proxy pattern**: users interact with a proxy contract that holds all state, and it uses `delegatecall` to execute the logic of a separate implementation contract — in the proxy's own storage context. Upgrading means pointing the proxy at a new implementation; data survives, the address stays. Because the implementation's constructor never runs in the proxy's context, upgradeable systems use **initializers** instead, guarded so they can run only once.",
          "Upgradeability is a trade, not a feature. Whoever can change the implementation can change the rules — and drain the funds. The honest questions are: who holds the upgrade key (a single key, a multisig, governance behind a timelock?), and is the change process transparent? An immutable contract can be trusted by reading its code once; an upgradeable one must be re-evaluated every time its authority changes."
        ],
        table: {
          headers: ["Design", "Who can change logic", "Trust required", "Typical use"],
          rows: [
            ["Immutable", "Nobody", "Read the code once", "Simple tools, launch-and-forget utilities"],
            ["Proxy, governance-controlled", "Token holders, after a timelock delay", "Ongoing governance oversight", "Major DeFi protocols"],
            ["Proxy, multisig-controlled", "A small key set", "Trust in the signers", "Early-stage teams, fast iteration"]
          ]
        },
        callout: {
          type: "tip",
          title: "Check the upgrade path before you deposit",
          body: "On Etherscan, contracts behind a proxy show a Read as Proxy tab. Find who can call the upgrade function and whether a timelock sits in front of it. An upgrade key held by a single private key is the most important risk factor in most protocols."
        }
      },
      {
        heading: "Constructors and initializers",
        paragraphs: [
          "A `constructor` runs exactly once, during deployment, before the contract's runtime code exists. It is where ownership, parameters and initial state are written to storage. After deployment the constructor is gone — you cannot re-run it, which is precisely why it is safe for one-time setup. Anyone reading the address after deploy sees only the result.",
          "Proxies break this assumption. The implementation contract is deployed normally, so *its* constructor runs in the implementation's own context — but the proxy never executes it, and storage lives in the proxy. Upgradeable contracts therefore use an `initialize()` function plus a guard that allows it to run exactly once. Forgetting that guard has real consequences: several bridge and protocol incidents began with an unprotected initializer that let an attacker claim ownership of the proxy.",
          "When you review a contract, initialization is a checklist item: does it exist, is it guarded, who can call it, and was it called? A contract whose initializer was never invoked by the deployer is a time bomb — the first caller becomes the owner."
        ]
      },
      {
        heading: "Events versus storage",
        paragraphs: [
          "Storage is the contract's memory: variables the contract itself can read in future transactions. It is expensive — writing a fresh slot costs roughly 20,000 gas versus about 3 for memory. Events are log entries attached to the transaction receipt: cheap to emit, indexed for efficient filtering, but *invisible to contracts* — no opcode can read past events back.",
          "Events exist because contracts cannot push data to the outside world. They are the broadcast channel: frontends subscribe to logs, indexers build histories from them, oracles and off-chain bots react. The `Transfer` and `Approval` events of ERC-20 are how every explorer, portfolio app and analytics dashboard tracks tokens — balances live in storage, but the *history* lives in logs.",
          "Design rule: if the contract must reason about a value later, it belongs in storage; if the ecosystem needs to know about it, emit an event. Index up to three parameters — `indexed` values become searchable topics. Many well-run protocols keep storage minimal and let indexers reconstruct state from events: cheaper on-chain, at the cost of off-chain infrastructure."
        ]
      },
      {
        heading: "Gas is a design constraint",
        code: {
          lang: "solidity",
          caption: "A minimal contract: one state variable, one event, one function.",
          code: "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.24;\n\ncontract Counter {\n    uint256 public count;\n\n    event Counted(address indexed caller, uint256 newCount);\n\n    function increment() external {\n        count += 1;\n        emit Counted(msg.sender, count);\n    }\n}"
        },
        paragraphs: [
          "Every EVM instruction has a price, and the caller pays. Setting a fresh storage slot costs on the order of 20,000 gas, updating an existing one around 5,000, and merely touching a cold address or slot another 2,100. These numbers shape architecture more than any style guide: expensive storage pushes protocols toward mappings, events and minimal on-chain logic.",
          "Read the example the way an engineer would: one storage variable means one slot to initialize, one event gives the world a history, and an `external` function does nothing but arithmetic and a log — deliberately cheap. Public getters are free for callers because reads (`eth_call`) cost nothing. This is the complete loop of contract engineering: state, events, and a function that changes the first and emits the second.",
          "Gas also protects the network: a transaction's gas limit caps how much work it can do, and execution that runs out of gas reverts — state changes undone, though the gas already spent is kept. Failed transactions are not free. Remember from the beginner track that users pay a base fee plus a tip; developers pay the same tax in complexity: every feature must justify its bytes."
        ],
        callout: {
          type: "tip",
          title: "Reverts refund nothing you already spent",
          body: "When a transaction reverts, all state changes roll back but gas consumed until the failure point is still charged. That is why simulations and gas estimates matter: they catch the failure before you pay for it."
        }
      }
    ],
    keyTerms: [
      { term: "smart contract", definition: "A program stored on a blockchain that runs deterministically when called, and can custody assets itself." },
      { term: "immutability", definition: "The default property that deployed contract code cannot be changed; fixes require new deployments or upgrade machinery." },
      { term: "proxy pattern", definition: "A design where a proxy contract holds state and forwards calls via delegatecall to a swappable implementation contract." },
      { term: "delegatecall", definition: "A call variant that executes another contract's code in the caller's storage context — the mechanism behind upgradeable proxies." },
      { term: "initializer", definition: "The upgradeable equivalent of a constructor: a one-time setup function guarded against re-running, because proxy storage never runs a constructor." },
      { term: "event", definition: "A cheap log entry written to the transaction receipt, readable by off-chain consumers but not by other contracts." },
      { term: "gas", definition: "The unit priced per EVM instruction; it caps execution, prices storage, and acts as a design constraint." },
      { term: "code is law", definition: "The idea that contract rules are enforced by consensus rather than institutions — including the bugs." }
    ],
    practices: [
      {
        id: "smart-contracts-101-practice-1",
        title: "Deploy and call your first unstoppable program",
        goal: "Deploy the Counter contract to Sepolia through Remix, change its state, and find your own event in the explorer.",
        steps: [
          "Open remix.ethereum.org, create a file called Counter.sol, and paste the lesson's Counter code.",
          "Compile it in the Solidity Compiler tab with a 0.8.x compiler version.",
          "In the Deploy and Run tab, connect MetaMask with the Sepolia network selected, and deploy (Injected Provider).",
          "Open the deployed contract instance and call increment() — confirm the transaction in your wallet.",
          "Read the count value with the blue getter button; it should show 1.",
          "Open the transaction on sepolia.etherscan.io and locate the Counted event under the Logs tab."
        ],
        caution: "Testnet only. You need Sepolia ETH for gas — get it from a faucet such as sepolia.ethereum.org. Never deploy experiments with real funds."
      }
    ],
    resources: [
      { title: "Smart contracts — ethereum.org", url: "https://ethereum.org/en/developers/docs/smart-contracts/", type: "docs" },
      { title: "Introduction to smart contracts — Solidity docs", url: "https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html", type: "docs" },
      { title: "Upgrading smart contracts — ethereum.org", url: "https://ethereum.org/en/developers/docs/smart-contracts/upgrading-smart-contracts/", type: "docs" },
      { title: "Remix IDE", url: "https://remix.ethereum.org/", type: "tool", note: "Browser IDE used for the practice" },
      { title: "The DAO — Wikipedia", url: "https://en.wikipedia.org/wiki/The_DAO", type: "article", note: "The founding code-is-law case" }
    ],
    quiz: [
      {
        id: "smart-contracts-101-q1",
        prompt: "A critical bug is found in a deployed immutable contract that holds user funds. What is the correct remediation path?",
        options: [
          "Edit the bytecode in place via a special transaction",
          "Wait for the chain to roll back the affected transactions",
          "Deploy a fixed contract and migrate users and funds to the new address",
          "Ask block producers to ignore calls to the bugged function"
        ],
        correctIndex: 2,
        explanation: "Immutable code cannot be patched; the only remedy is a new deployment plus migration, which depends on users actually moving. Chain-level interventions happen only at the social-consensus layer and are extraordinary — The DAO fork being the famous exception, not a tool."
      },
      {
        id: "smart-contracts-101-q2",
        prompt: "In the standard proxy pattern, where do user balances live and whose code executes?",
        options: [
          "Balances live in the implementation; the implementation's code executes in its own context",
          "Balances live in the proxy; the implementation's code executes in the proxy's context via delegatecall",
          "Balances live in the proxy; the proxy's own bytecode implements all logic",
          "Each user gets a personal clone of the implementation"
        ],
        correctIndex: 1,
        explanation: "The proxy owns storage so state survives upgrades, and delegatecall runs implementation code against that storage. This separation is also why constructors do not run in the proxy context and initializers exist."
      },
      {
        id: "smart-contracts-101-q3",
        prompt: "Why can a contract not read its own past events?",
        options: [
          "Events are encrypted",
          "Events live only in transaction receipts, which the EVM cannot address from within execution",
          "Events are deleted after 256 blocks",
          "Events require a paid subscription opcode"
        ],
        correctIndex: 1,
        explanation: "Events are cheap precisely because they are off the state path: they are written to receipts for off-chain consumers and have no read opcode. Anything the contract needs later must be stored."
      },
      {
        id: "smart-contracts-101-q4",
        prompt: "Which single operation is typically the most expensive in a simple contract function?",
        options: [
          "Writing a value to a fresh storage slot",
          "Writing to memory",
          "Emitting an event with two indexed parameters",
          "Calling a public getter"
        ],
        correctIndex: 0,
        explanation: "A fresh storage write costs roughly 20,000 gas versus about 3 for memory and a few hundred for a typical event. Getter calls are free because reads do not produce transactions."
      }
    ]
  },
  {
    id: "solidity-fundamentals",
    level: "intermediate",
    order: 2,
    title: "Solidity Fundamentals",
    subtitle: "Contract layout, storage slots, guards, payable — and a faucet you can actually ship.",
    minutes: 25,
    objectives: [
      "Read the layout of a Solidity file and reason about where each piece belongs.",
      "Explain storage slots, packing, and the cost model behind mappings, structs and arrays.",
      "Choose the right visibility, guard functions with modifiers and custom errors, and handle ether with payable.",
      "Deploy a complete faucet contract and explain what Solidity 0.8.x changed about arithmetic."
    ],
    sections: [
      {
        heading: "Anatomy of a contract file",
        paragraphs: [
          "A Solidity file opens with a license identifier and a `pragma` pinning compiler versions, then imports, then the contract. Inside, a widely used reading order is: type declarations, state variables, events, errors, modifiers, then functions. The compiler does not care; auditors do. Consistent layout turns a security review from archaeology into reading.",
          "Under the hood a contract is four things: runtime code, storage (the persistent key-value space), an ether balance, and transient scratch space (stack, memory, calldata). Storage is where state variables live across transactions; memory and stack are wiped after each call. Keeping that boundary in your head explains most gas and correctness surprises.",
          "The EVM executes your Solidity only after compiling it to bytecode; everything in this lesson — slots, visibilities, modifiers — is a compile-time convenience over that machine. The advanced track goes inside the EVM; here we stay at the source level where you will actually work."
        ],
        code: {
          lang: "solidity",
          caption: "The canonical layout: state, events, errors, then functions.",
          code: "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.24;\n\ncontract Vault {\n    // state\n    mapping(address => uint256) public deposits;\n\n    // events\n    event Deposited(address indexed who, uint256 amount);\n\n    // errors\n    error NothingToWithdraw();\n\n    // functions\n    function deposit() external payable {\n        deposits[msg.sender] += msg.value;\n        emit Deposited(msg.sender, msg.value);\n    }\n}"
        }
      },
      {
        heading: "State variables live in storage slots",
        paragraphs: [
          "Storage is a flat array of 32-byte slots indexed from zero. Each simple state variable claims the next slot in declaration order. Reading a cold slot costs 2,100 gas and writing a fresh slot about 20,000 — versus roughly 3 gas for memory — which is why careless state updates dominate gas bills in real protocols.",
          "Values smaller than 32 bytes are **packed**: the compiler places consecutive small fields into one slot, declaration order matters, and a partial update rewrites the whole slot. Declaring `uint128 a; uint128 b;` uses one slot; separating them with a `uint256` between costs two. In storage-heavy contracts, field ordering is a measurable optimization.",
          "Mappings and dynamic arrays refuse naive slots: a `mapping` at slot N computes each value's location as `keccak256(key . N)`, and dynamic arrays store length at N with data starting at `keccak256(N)`. Two consequences: mappings cannot be iterated (there is no key list), and does-this-key-exist needs an explicit flag — unmapped reads return zero, not an error."
        ],
        callout: {
          type: "deep-dive",
          title: "Storage layout is a security surface",
          body: "delegatecall executes foreign code against your storage, so proxy and implementation must agree on slot meaning. Upgradeable contracts must therefore only append new variables — inserting or reordering causes storage collisions where two variables silently share a slot. Verification tooling even hashes storage layouts to detect this."
        }
      },
      {
        heading: "Visibility and modifiers",
        paragraphs: [
          "Solidity offers four function visibilities. `public` is callable from anyone, `external` only from outside (slightly cheaper for large calldata), `internal` from this contract and children, `private` only from this contract. For variables, `public` auto-generates a getter. And a critical truth: **private does not mean secret** — every value in storage is readable from the chain; privacy restricts who can *call*, not who can *see*.",
          "Modifiers wrap functions with reusable guards: they run code before (or after) the function body via the underscore placeholder. `onlyOwner`, `nonReentrant`, `whenNotPaused` — most security postures in real protocols are a handful of well-audited modifiers. Keep them pure checks; logic inside modifiers is a readability hazard.",
          "Inheritance matters: modifiers and state flow through `is` relationships, and initializer patterns exist precisely because constructors of parents and proxies interact in surprising ways. When you read a real protocol, trace which inherited contracts define the modifiers you see."
        ],
        code: {
          lang: "solidity",
          caption: "A guard modifier: check, then delegate with _.",
          code: "address public owner;\n\nerror NotOwner();\n\nmodifier onlyOwner() {\n    if (msg.sender != owner) revert NotOwner();\n    _;\n}"
        }
      },
      {
        heading: "require, revert, assert — and custom errors",
        paragraphs: [
          "`require(condition, message)` is the workhorse for validating inputs and state; failing it reverts with a string. `revert CustomError(args)` does the same with a typed, gas-cheaper custom error — the modern default, since strings must live in bytecode while error selectors are four bytes. `assert` checks invariants that should be mathematically impossible to break; since 0.8 it triggers a Panic and is a debugging signal, not input validation.",
          "Reverts unwind everything: all state changes in the transaction are discarded and unused gas is refunded, but gas burned up to the failure point is kept — failed transactions still pay. This atomicity is a feature, not an error path: entire DeFi strategies rely on revert-as-rollback, and flash loans (next module) are exactly this pattern weaponized for good.",
          "Catching reverts: off-chain, `eth_call` simulations return the error; on-chain, low-level `call` and `try-catch` let aggregators route around failing pools. Design your errors for the caller: typed arguments (amounts, addresses, deadlines) turn debugging from guesswork into reading."
        ],
        table: {
          headers: ["Tool", "Intent", "When to use", "Cost profile"],
          rows: [
            ["require(cond, msg)", "Reject invalid inputs or state", "User-facing checks", "Short strings are fine; long strings inflate bytecode"],
            ["revert CustomError(...)", "Reject with typed data", "Complex conditions, protocol guards", "Cheapest in bytecode; typed args help callers"],
            ["assert(cond)", "Verify invariants", "Internal sanity that must never fail", "Panic; treat as a bug if ever hit"]
          ]
        }
      },
      {
        heading: "Data structures: mapping, struct, array",
        paragraphs: [
          "The workhorse is `mapping(K => V)`: constant-cost lookups, default-zero values, no iteration. Wrap it in a `struct` for real-world records — a Position with collateral, debt and an interest index is the heart of every lending market. Structs in storage pack their fields into slots exactly like top-level variables.",
          "Arrays come in storage, memory and calldata flavors. Storage arrays are expensive per element and dangerous when loops grow unbounded — a `for` over user-supplied length is a classic denial-of-service: one failing element reverts the whole loop forever. Bounded iterations, or the withdraw pattern of tracking owed amounts and letting users pull, keep functions safe.",
          "Choosing by access pattern: need lookup by key — mapping; need ordered history — array with bounded operations; need enumerable sets — mapping plus an index array, accepting the gas. Most protocol bugs at this level are not clever attacks but plain arithmetic and loop mistakes."
        ],
        code: {
          lang: "solidity",
          caption: "Struct plus mapping: the standard on-chain record. These fields pack into two slots.",
          code: "struct Position {\n    uint128 collateral;\n    uint128 debt;\n    uint64 openedAt;\n    bool active;\n}\n\nmapping(address => Position) public positions;"
        }
      },
      {
        heading: "payable and the ether surface",
        paragraphs: [
          "Ether only enters a contract through `payable` functions, `receive()`, or a `fallback()` with matching rules. Non-payable functions revert if sent value — the compiler inserts that check for you. `receive() external payable` handles plain transfers with empty calldata; `fallback()` catches unknown selectors. Together they define the contract's entire ether surface.",
          "Inside, `msg.value` is the wei attached to this call and `address(this).balance` is total holdings — note that they diverge: the balance can include ether pushed by other contracts' logic, not just accounted deposits. Track balances explicitly; never treat balance as equal to recorded deposits without checking why.",
          "Payments out should follow the **withdraw (pull) pattern**: record what each user is owed in storage and let them claim in their own transaction. Pushing ether inside complex logic invites reentrancy — the bug class that emptied The DAO — and lets one failing recipient revert a batch for everyone. The advanced security lesson dissects it; for now: pull, do not push."
        ]
      },
      {
        heading: "A complete faucet",
        paragraphs: [
          "Read it top to bottom: constants document the policy; the `lastClaim` mapping enforces a per-address cooldown; `drip()` validates (reverting with a typed `TooSoon`), updates state *before* the external transfer (checks-effects-interactions), emits an event for indexers, then pays. There is no constructor because every default is explicit; `receive` lets anyone donate gas money for future drips.",
          "One 0.8.x note: arithmetic is checked by default. Overflow or underflow reverts with a Panic instead of silently wrapping around the uint256 ring — before 0.8 that silent wrap sat behind dozens of exploits, like underflowing balances into astronomically large numbers. When you genuinely want wrapping semantics (hashing, counters), opt in with an `unchecked` block and comment why.",
          "Exercises that make it stick: add an `onlyOwner`-guarded drain function and a minimum-balance guard on `receive`; then compare your file against OpenZeppelin's audited equivalents and notice what they check that you did not. That gap — between your first version and the audited one — is exactly what the security track teaches systematically."
        ],
        code: {
          lang: "solidity",
          caption: "A rate-limited faucet: custom error, event, cooldown mapping, checks-effects-interactions.",
          code: "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.24;\n\ncontract Faucet {\n    uint256 public constant DRIP = 0.01 ether;\n    uint256 public constant COOLDOWN = 1 hours;\n\n    mapping(address => uint256) public lastClaim;\n\n    event Dripped(address indexed to, uint256 amount);\n    error TooSoon(address claimer, uint256 nextAllowed);\n\n    function drip() external {\n        uint256 next = lastClaim[msg.sender] + COOLDOWN;\n        if (block.timestamp < next) {\n            revert TooSoon(msg.sender, next);\n        }\n        lastClaim[msg.sender] = block.timestamp; // effect before interaction\n        emit Dripped(msg.sender, DRIP);\n        payable(msg.sender).transfer(DRIP);\n    }\n\n    receive() external payable {}\n}"
        },
        callout: {
          type: "tip",
          title: "Compile with the optimizer, but only after tests pass",
          body: "The optimizer trades deployment cost and runtime gas; it does not fix logic. Turn it on once your tests pass — never as a substitute for them."
        }
      }
    ],
    keyTerms: [
      { term: "pragma", definition: "The compiler-version declaration pinning which Solidity releases may compile the file." },
      { term: "storage slot", definition: "One 32-byte cell in a contract's persistent storage; state variables occupy slots in declaration order." },
      { term: "packing", definition: "The compiler combining consecutive sub-32-byte fields into a single storage slot to reduce gas." },
      { term: "visibility", definition: "The access level (public, external, internal, private) controlling who may call — never a secrecy guarantee." },
      { term: "modifier", definition: "A reusable wrapper that runs guard code around a function body." },
      { term: "custom error", definition: "A typed revert reason — cheaper and more informative than require strings — caught with try-catch." },
      { term: "payable", definition: "A function keyword allowing the call to carry ether; the gate through which value enters a contract." },
      { term: "checks-effects-interactions", definition: "The ordering discipline — validate, update state, then interact externally — that prevents reentrancy." }
    ],
    practices: [
      {
        id: "solidity-fundamentals-practice-1",
        title: "Deploy a faucet on Sepolia",
        goal: "Ship the lesson's faucet, claim from it twice, and meet your own custom error.",
        steps: [
          "Open remix.ethereum.org, create Faucet.sol, and paste the complete faucet from this lesson.",
          "Compile it with a 0.8.x compiler in the Solidity Compiler tab.",
          "In the Deploy and Run tab, connect MetaMask with Sepolia selected and deploy via Injected Provider.",
          "Fund the faucet: send it 0.05 ETH from your wallet to its contract address.",
          "Call drip() from your wallet, confirm, then call drip() again — read the TooSoon revert in Remix's terminal.",
          "Find both transactions on sepolia.etherscan.io and locate the Dripped event in the Logs tab of the first one."
        ],
        caution: "Testnet only. You need Sepolia ETH from a faucet such as sepolia.ethereum.org for gas and funding — never practice with mainnet funds."
      },
      {
        id: "solidity-fundamentals-practice-2",
        title: "Read a verified contract like an auditor",
        goal: "Apply the layout and visibility vocabulary to a real deployed contract.",
        steps: [
          "Open etherscan.io and open any verified top token or protocol contract (check the Contract tab for green source code).",
          "Identify its state variables; then find its events and custom errors in the source.",
          "Find one external and one payable function, and check which modifiers guard them.",
          "Look for an initializer or proxy marker (Read as Proxy tab) and note who could re-initialize or upgrade it."
        ]
      }
    ],
    resources: [
      { title: "Contracts — Solidity documentation", url: "https://docs.soliditylang.org/en/latest/contracts.html", type: "docs" },
      { title: "Solidity cheatsheet", url: "https://docs.soliditylang.org/en/latest/cheatsheet.html", type: "docs" },
      { title: "OpenZeppelin Contracts", url: "https://github.com/OpenZeppelin/openzeppelin-contracts", type: "tool", note: "Audited building blocks to compare against" },
      { title: "Remix IDE", url: "https://remix.ethereum.org/", type: "tool" },
      { title: "Smart contract security — ethereum.org", url: "https://ethereum.org/en/developers/docs/smart-contracts/security/", type: "docs" }
    ],
    quiz: [
      {
        id: "solidity-fundamentals-q1",
        prompt: "A variable marked private in a deployed contract is...",
        options: [
          "Invisible on the blockchain",
          "Readable by anyone analyzing storage, but not callable from other contracts",
          "Encrypted at rest",
          "Readable only by the deployer"
        ],
        correctIndex: 1,
        explanation: "Visibility restricts access from other contracts during execution; all storage is public data on chain. Nothing in the EVM is secret — confidential data must stay off-chain or be hidden with cryptography."
      },
      {
        id: "solidity-fundamentals-q2",
        prompt: "Under Solidity 0.8.x, what happens when uint256 x = 0; then x -= 1; executes without an unchecked block?",
        options: [
          "x becomes the maximum uint256 value",
          "The transaction reverts with a Panic (arithmetic underflow)",
          "x becomes -1 as a signed value",
          "The compiler refuses to deploy the contract"
        ],
        correctIndex: 1,
        explanation: "Since 0.8, arithmetic is checked by default and reverts with a Panic code instead of wrapping. Pre-0.8 code silently wrapped, which attackers exploited — the checked default is one of the version's most consequential changes."
      },
      {
        id: "solidity-fundamentals-q3",
        prompt: "Why do audited protocols prefer the withdraw pattern over pushing ether to many recipients in one transaction?",
        options: [
          "It saves gas on every payout",
          "Pushing can let a hostile recipient revert the whole batch or reenter the contract mid-execution",
          "The withdraw pattern is required by the EVM",
          "It avoids paying base fees"
        ],
        correctIndex: 1,
        explanation: "A single malicious or failing recipient can revert an entire push loop or reenter mid-execution. Recording amounts and letting users pull isolates failures — it is the pattern behind nearly all payout logic after The DAO."
      },
      {
        id: "solidity-fundamentals-q4",
        prompt: "A plain ether transfer (no calldata) is sent to a contract. Which function receives it?",
        options: [
          "fallback()",
          "receive() if defined, otherwise fallback()",
          "constructor",
          "Any payable function chosen by the compiler"
        ],
        correctIndex: 1,
        explanation: "Empty calldata targets receive() when it exists; fallback() is the catch-all for unknown selectors. Knowing which runs matters because each can carry different, or no, guards."
      }
    ]
  },
  {
    id: "token-standards",
    level: "intermediate",
    order: 3,
    title: "Token Standards",
    subtitle: "ERC-20, ERC-721, ERC-1155 — the shared vocabulary that makes DeFi composable.",
    minutes: 22,
    objectives: [
      "Walk through the ERC-20 interface and trace the transfer and approve/transferFrom flows.",
      "Explain decimals, minting and burning in terms of the underlying uint256 ledger.",
      "Compare ERC-721 and ERC-1155 and know when each fits.",
      "Recognize the infinite-approval footgun and how permit (EIP-2612) changes approvals."
    ],
    sections: [
      {
        heading: "Standards are the API of money",
        paragraphs: [
          "Composability is DeFi's superpower: any contract that speaks ERC-20 plugs into every wallet, exchange, lending market and analytics tool with zero custom integration. The standards are function signatures agreed in advance — ERC stands for Ethereum Request for Comments, a numbering scheme for proposals, of which ERC-20, ERC-721 and ERC-1155 are the load-bearing ones.",
          "Standards are conventions, not enforcement. A token that omits the boolean return from `transfer`, skips events, or charges hidden fees is *non-standard*, and integrators have learned to wrap calls defensively — the safe-transfer wrappers in major protocols exist because real tokens (USDT being the classic example) behave outside spec. Deviating tokens still trade; they just silently break naive integrators.",
          "The standard also says nothing about trust. Two contracts with identical ERC-20 interfaces can differ completely in who can mint, whether the owner can pause transfers, and whether the code is upgradeable. Reading a token means reading the standard surface *and* the authority surface — the second is where the risk lives."
        ]
      },
      {
        heading: "ERC-20 walkthrough",
        paragraphs: [
          "Underneath, every ERC-20 is a ledger: `mapping(address => uint256) balances` plus `totalSupply`. `balanceOf` reads it; `transfer` subtracts from the caller and credits the recipient, emitting `Transfer(from, to, value)`. Nothing physical moves — balances are bookkeeping entries, and the event is the published receipt.",
          "The `approve`/`transferFrom` pair exists for a structural reason: contracts cannot sign transactions. A DEX router cannot initiate your transfer, so you must grant it an **allowance** — `approve(spender, amount)` writes a permission slot keyed by you and the spender — after which the spender's contract calls `transferFrom` on your behalf within its own transaction. This two-step dance is the most common flow in all of DeFi, and the source of its most common footgun (next section).",
          "Indexers ignore storage and read the events: every chart of token flows you have seen is a replay of `Transfer` logs. When a token does not emit events, it becomes invisible to the ecosystem's entire history — a compatibility break, not just a bug."
        ],
        code: {
          lang: "solidity",
          caption: "The mandatory surface of ERC-20. Name, symbol and decimals are optional metadata.",
          code: "interface IERC20 {\n    function totalSupply() external view returns (uint256);\n    function balanceOf(address account) external view returns (uint256);\n    function transfer(address to, uint256 amount) external returns (bool);\n    function allowance(address owner, address spender) external view returns (uint256);\n    function approve(address spender, uint256 amount) external returns (bool);\n    function transferFrom(address from, address to, uint256 amount) external returns (bool);\n\n    event Transfer(address indexed from, address indexed to, uint256 value);\n    event Approval(address indexed owner, address indexed spender, uint256 value);\n}"
        }
      },
      {
        heading: "The infinite-approve footgun",
        paragraphs: [
          "Because each `approve` is a full transaction costing gas, dApps habitually request `type(uint256).max` — the infinite approval — so you never approve again. Efficient in the happy path; but an allowance is a standing permission: while it remains, the approved spender contract can move your tokens at any time, even months after you stopped using the site.",
          "The threat is concrete: if the spender is compromised, buggy, or turns malicious, whatever sits in your allowance is claimable without your signature. There is also the approval race: changing an allowance directly from A to B lets A spend the *new* amount in the window before your transaction lands — set it to zero first, or use permit. The summed losses from stale approvals across the ecosystem are enormous.",
          "Newer infrastructure attacks the problem structurally: permit (below) removes the separate transaction, and permit2-style universal approvers add per-token, per-spender expirations. The mental model to keep: an approval is an open credit line, and credit lines deserve reviews."
        ],
        callout: {
          type: "warning",
          title: "Approvals outlive sessions",
          body: "Use Etherscan's Token Approvals checker to list every live allowance on your wallet and revoke what you no longer use. Rule of thumb: exact amounts for one-shot interactions; unlimited only for contracts you actively trust and monitor."
        }
      },
      {
        heading: "Decimals and raw amounts",
        paragraphs: [
          "Balances are raw integers of `10^decimals`. ERC-20 carries a `decimals()` metadata field: USDC uses 6, so 250 USDC is `250000000`; most tokens use 18, so 1.5 ETH-equivalent units are `1500000000000000000`. Every human-facing number is a division away from being wrong by orders of magnitude.",
          "Precision bugs are permanent. Transfers sent with misapplied decimals (10x or 1,000x too much) are irrecoverable without the receiver's cooperation, and naive integrations that *assume* 18 decimals break on 6-decimal tokens — the entire reason every serious integration reads decimals from the contract instead of hard-coding.",
          "When reading amounts on Etherscan, the explorer already divides by decimals in the human-readable columns; when reading raw logs or calldata, you must do it yourself. A calculator tab is cheaper than a 250,000 USDC mistake."
        ]
      },
      {
        heading: "ERC-721 and ERC-1155",
        paragraphs: [
          "ERC-721 is the non-fungible standard: each token id maps to exactly one owner (`ownerOf`). Approvals are granular — approve a single id, or `setApprovalForAll` for an operator. Marketplaces universally ask for the latter, which is why a compromised marketplace approval can list your entire collection: the blast radius of one signature is everything.",
          "ERC-1155 is the multi-token standard: one contract holds many token ids, each potentially fungible (quantity per id) or unique. Its headline feature is batching — `safeBatchTransferFrom` moves many ids in one call — designed for games and marketplaces where per-token transactions would be ruinous.",
          "Both expose `tokenURI(id)` pointing at metadata — usually IPFS or a web server, rarely on-chain (the dApp architecture lesson explains why). The pointer is part of the trust surface: whoever controls the URI can change what your token points to. Immutable, content-addressed metadata is the fix."
        ],
        table: {
          headers: ["Standard", "Unit", "Ownership model", "Typical homes"],
          rows: [
            ["ERC-20", "Fungible balance", "address => amount", "Currency, collateral, governance"],
            ["ERC-721", "Unique id", "id => owner", "Collectibles, positions, identities"],
            ["ERC-1155", "id => supply", "id => balances per owner", "Game items, batch mints, mixed collections"]
          ]
        }
      },
      {
        heading: "Minting, burning and supply",
        paragraphs: [
          "Minting is an internal function increasing a balance and `totalSupply`; burning decreases them. There is no special EVM support — supply rules are plain code. What matters is authority: an `onlyOwner` mint, a role-gated minter (OpenZeppelin `AccessControl`), or minting gated by governance each produce different trust graphs. A cap written in code is real; a cap written in a blog post is not.",
          "Burn authority varies: some tokens let any holder burn their own balance, some reserve burns for the issuer (common in fiat-backed systems for redemption), and some cannot be burned at all — which is a risk property, not trivia. Burn mechanics matter in redemption flows and in rebase-adjacent designs.",
          "Supply events (`Transfer` from the zero address for mints, to it for burns) are how analytics compute circulating supply. If those events are missing or faked, every downstream metric inherits the error — a preview of the final lesson on reading the chain."
        ],
        callout: {
          type: "warning",
          title: "Mint keys are supply keys",
          body: "Before trusting a token, find who can mint or upgrade the contract into one that can. Also verify you hold the real contract address — name and symbol are free strings, and lookalike tokens with identical metadata are the oldest scam on the shelf."
        }
      },
      {
        heading: "Permit: approvals without transactions",
        paragraphs: [
          "EIP-2612, known as **permit**, lets a token holder grant an allowance with a signature instead of an approve transaction. The holder signs an EIP-712 typed message (owner, spender, value, deadline, nonce); anyone — usually the dApp's router — submits it inside the transaction that uses the allowance. One transaction instead of two, and wallets holding no ETH can still approve via relayers.",
          "The signature machinery is worth studying once: the token contract maintains a per-owner nonce and checks the deadline, so signatures cannot be replayed; EIP-712 makes the message display in human-readable form in the wallet. Permit is implemented by USDC and many major tokens; Uniswap's permit2 generalizes it into a universal approval contract that works for arbitrary tokens.",
          "Convenience cuts both ways: permit approvals require no transaction, so phishing no longer needs you to send anything — a signed message is enough. Read what you sign; a permit authorization is a real spending grant. The general lesson repeats from the approvals section: signatures are permissions, and permissions deserve the same scrutiny as transactions."
        ]
      }
    ],
    keyTerms: [
      { term: "ERC", definition: "Ethereum Request for Comments — the numbered proposal system that produced standards like ERC-20 and ERC-721." },
      { term: "allowance", definition: "The amount a spender may transferFrom an owner, set by approve or permit; a standing permission until changed." },
      { term: "infinite approval", definition: "Approving type(uint256).max so a spender never needs re-approval — convenient, and a standing drain risk." },
      { term: "decimals", definition: "Token metadata stating how many raw units make one human unit (USDC 6, most tokens 18)." },
      { term: "ERC-721", definition: "The non-fungible token standard: one owner per unique token id." },
      { term: "ERC-1155", definition: "The multi-token standard: many token types in one contract with batch transfers." },
      { term: "permit (EIP-2612)", definition: "Granting an allowance via an EIP-712 signature submitted within the using transaction, instead of a separate approve." },
      { term: "composability", definition: "The property that standard-conforming contracts interoperate without custom integration." }
    ],
    practices: [
      {
        id: "token-standards-practice-1",
        title: "Follow an approval on Etherscan",
        goal: "See the approve/transferFrom dance exactly as the chain records it.",
        steps: [
          "Open etherscan.io, open the USDC token page, and find a recent transaction of type Approval.",
          "Read the decoded call: who is the owner, who is the spender, what raw amount was allowed.",
          "Convert the raw amount to human units using USDC's 6 decimals.",
          "Open the spender address and identify which protocol it belongs to using Etherscan's labels.",
          "Then open the Token Approvals checker for your own address and count how many live allowances you hold."
        ]
      },
      {
        id: "token-standards-practice-2",
        title: "Ship a tiny ERC-20 on Sepolia",
        goal: "Deploy a standard token, hold it in your wallet, and grant an allowance.",
        steps: [
          "In Remix, create MyToken.sol that imports OpenZeppelin's ERC20 (Remix resolves @openzeppelin imports automatically).",
          "Write a contract inheriting ERC20 that mints 1,000 tokens (18 decimals) to the deployer in the constructor.",
          "Compile and deploy on Sepolia through MetaMask, then copy the contract address.",
          "Add the token to MetaMask as a custom token using that address — the balance should read 1,000.",
          "Approve a second address for 5 tokens and confirm the allowance via the allowances read on Etherscan."
        ],
        caution: "Testnet only — get Sepolia ETH from a faucet such as sepolia.ethereum.org before deploying."
      }
    ],
    resources: [
      { title: "ERC-20 token standard — ethereum.org", url: "https://ethereum.org/en/developers/docs/standards/tokens/erc-20/", type: "docs" },
      { title: "ERC-721 — ethereum.org", url: "https://ethereum.org/en/developers/docs/standards/tokens/erc-721/", type: "docs" },
      { title: "Token Approvals checker — Etherscan", url: "https://etherscan.io/tokenapprovalchecker", type: "tool", note: "Audit your live allowances" },
      { title: "OpenZeppelin Contracts", url: "https://github.com/OpenZeppelin/openzeppelin-contracts", type: "tool" },
      { title: "Remix IDE", url: "https://remix.ethereum.org/", type: "tool" }
    ],
    quiz: [
      {
        id: "token-standards-q1",
        prompt: "Why does ERC-20 need approve plus transferFrom instead of letting a contract pull tokens directly?",
        options: [
          "To double-charge gas for security",
          "Because contracts cannot sign transactions, so a recorded allowance is required first",
          "Because transferFrom is cheaper than transfer",
          "To comply with ERC-721"
        ],
        correctIndex: 1,
        explanation: "A contract executes only when called within a transaction someone else signed; it cannot initiate an owner-approved transfer on its own. The allowance slot is the standing permission that makes automated pulls possible."
      },
      {
        id: "token-standards-q2",
        prompt: "You approved a DEX router for an unlimited amount a year ago and stopped using it. What is the risk?",
        options: [
          "None — approvals expire after 30 days",
          "The allowance persists; if that contract is ever compromised, your tokens can be drained without a new signature",
          "The tokens are locked until you revoke",
          "Gas fees accrue on idle approvals"
        ],
        correctIndex: 1,
        explanation: "Approvals do not expire. A standing unlimited allowance on a compromised or malicious contract is a permanent drain path — which is why periodic approval reviews are basic hygiene."
      },
      {
        id: "token-standards-q3",
        prompt: "A token has 6 decimals. What raw uint256 amount represents 250 tokens?",
        options: ["250", "250000", "250000000", "250000000000000000000"],
        correctIndex: 2,
        explanation: "Raw units are the human amount times 10^decimals: 250 × 10^6 = 250,000,000. Misreading decimals is one of the most common and most expensive integration errors."
      },
      {
        id: "token-standards-q4",
        prompt: "What does ERC-1155 add over ERC-721 for games and marketplaces?",
        options: [
          "Cheaper block production",
          "One contract holding many token types with batch transfers of multiple ids",
          "On-chain metadata enforcement",
          "Automatic royalty distribution"
        ],
        correctIndex: 1,
        explanation: "ERC-1155 is multi-token: ids can be fungible or unique, and safeBatchTransferFrom moves many in one call. ERC-721 remains one-owner-per-id; the batch model is the practical win for item-heavy apps."
      }
    ]
  },
  {
    id: "dapp-architecture",
    level: "intermediate",
    order: 4,
    title: "dApp Architecture",
    subtitle: "Wallet, RPC, contracts, events, indexers — the whole stack behind a decentralized app.",
    minutes: 20,
    objectives: [
      "Map the layers of a dApp from browser UI down to consensus, and say what each layer trusts.",
      "Distinguish read (call) from write (transaction) interactions and their cost and latency profiles.",
      "Explain why events exist and how indexers like The Graph turn raw logs into queryable APIs.",
      "Reason about IPFS/Arweave storage, backend-less patterns, and what Hardhat/Foundry do in a dev loop."
    ],
    sections: [
      {
        heading: "The stack, layer by layer",
        paragraphs: [
          "Strip any dApp down and you find five layers: a browser UI, a wallet holding keys, an RPC provider relaying JSON-RPC messages, the Ethereum network itself, and the contracts that hold state. The UI never talks to the chain directly — it asks the wallet to sign and an RPC node to relay. Every hop is a boundary where behavior can diverge from what you see.",
          "The trust mapping matters for security reasoning: a malicious RPC can show you fake balances or refuse to broadcast, but it cannot spend your funds — that requires your signature. A malicious frontend can trick you into signing, which is why the wallet, not the website, is where verification happens. This is the beginner-track phishing lesson, seen from the architecture side.",
          "Backend-less does not mean trustless: the JavaScript you load from a CDN is a trust point too (frontend compromise equals approval theft). Mature dApps pin builds, publish hashes, and increasingly serve UIs from decentralized hosts to close that gap."
        ],
        list: [
          "UI (your browser): renders state, builds transactions — can mislead or phish",
          "Wallet (keys + signing): the user's agent — the only layer that must be trusted with secrets",
          "RPC provider (node gateway): relays reads and broadcasts writes — can censor or lag but cannot forge signatures",
          "Ethereum network: consensus and state — the final arbiter of what actually happened",
          "Contracts: the logic and balances everything else merely views"
        ]
      },
      {
        heading: "Reads versus writes",
        paragraphs: [
          "Reading state is `eth_call`: executed immediately against a node's latest state, not broadcast, not consensus-relevant, and free. Writing is a signed transaction: broadcast, paid in gas, ordered by the mempool and included by a block builder. The asymmetry defines UX: reads are instant and infinite, writes are scarce, priced and visible.",
          "Writes follow a pipeline every user should recognize: the dApp builds a transaction, the wallet simulates it and shows a preview, you sign, it propagates, gets included, and returns a **receipt** with status and logs. Confirmations matter for finality — one inclusion is not the same as finality, a distinction that becomes central in the L2 lesson.",
          "Between read and write sit simulations: `eth_estimateGas` and override-enabled calls let dApps preview results (if you submit, you will receive X). Simulations are honest about state but blind to the future — other transactions can land first, which is why min-out parameters and slippage guards from the AMM lesson exist."
        ]
      },
      {
        heading: "Events: the push channel contracts don't have",
        paragraphs: [
          "Contracts cannot open sockets, call webhooks, or message your browser. Their only broadcast mechanism is the event: a log entry written into the transaction receipt, addressable by contract and topic. A UI either subscribes to log streams over a WebSocket or polls `eth_getLogs` over block ranges — both are just filtered reads of receipts.",
          "Anatomy: each event has a signature hash as topic 0, up to three `indexed` parameters as further topics (searchable), and unindexed data as payload. This is why declaring parameters indexed matters: indexers filter on topics, so a well-indexed event is cheap to query and a poorly indexed one forces full scans. Cheap to emit, invisible to contracts — the exact complement of storage.",
          "Everything user-facing that feels live — a pending swap confirming, a loan showing its health — is a loop of reads plus event subscriptions over receipts. When a dApp seems to know things instantly, it is watching logs, not the chain itself."
        ]
      },
      {
        heading: "Indexing: The Graph idea",
        paragraphs: [
          "Raw logs are append-only and awkward: per-contract, per-topic, no joins. Indexers solve this by decoding events into entities — positions, trades, votes — and exposing them through a query API. The Graph popularized the pattern (subgraphs); Dune takes the same raw data and exposes it as SQL tables for analytics, as the final lesson explores.",
          "What this buys: a portfolio app answers all positions for one address across five protocols with a single query instead of replaying millions of logs. What it costs: indexer lag (new events take time to appear) and a new trust point — you are reading a derived database, not the chain. For settlement-critical values, protocols recompute from raw state; for display, derived views are fine.",
          "The principle worth keeping: the chain is the canonical record; every dashboard, indexer and explorer view is a cache with its own staleness and its own bugs. Knowing which layer you are reading is half of on-chain literacy."
        ]
      },
      {
        heading: "Files are not state: IPFS and Arweave",
        paragraphs: [
          "Chain storage costs orders of magnitude more than ordinary hosting, so dApps split data by role: money-critical state on-chain, files elsewhere. IPFS provides content-addressed storage — a file's name is the hash of its contents, so fetching verifies integrity by construction. Arweave offers pay-once permanent storage with a different economic model.",
          "NFTs are the canonical example: the token records ownership on-chain and points at metadata via `tokenURI`, usually an IPFS hash. Content addressing prevents silent substitution (change the file, change the hash), but *pinning* — who keeps the file reachable — is an economic question, and dead pins mean dead art. The pointer, not the content, is usually the weak link.",
          "The split is a design decision you should be able to justify: what must be consensus-visible (balances, logic) goes on-chain; what must be durable but bulky (images, sites, large JSON) goes to content-addressed storage; what is cosmetic can live on ordinary servers with appropriate skepticism."
        ]
      },
      {
        heading: "Backend-less patterns",
        paragraphs: [
          "A pure dApp has no accounts database: the wallet *is* the identity. **Sign-In with Ethereum (SIWE)** standardizes this — the user signs a structured message (domain, nonce, statement) proving key control, and any session logic derives from that signature. No passwords, no password database to breach, and the same key works across every dApp.",
          "Real systems still grow conventional components: rate-limited RPC gateways, notification services, fiat on-ramps, fraud monitoring. None of these can move funds without signatures, but each reintroduces availability and privacy trade-offs. A good architecture document names every such component and what it can and cannot do — the audit habit from the smart contracts lesson, applied to infrastructure.",
          "Hosting closes the loop: static UIs can live on IPFS or decentralized hosts, making the whole application a set of content-addressed artifacts plus contracts. That is the strongest backend-less shape — and a good test of whether a dApp actually is one."
        ]
      },
      {
        heading: "The dev loop: Hardhat and Foundry",
        paragraphs: [
          "Two tools dominate local development. Hardhat brings a JavaScript-first workflow: an embedded network, deploy scripts, chai-style tests, and a fork mode that loads real mainnet state. Foundry is Rust-based and tests in Solidity itself, with extremely fast fuzzing and the same forking trick via its local chain, anvil.",
          "The conceptual loop matters more than the choice: write the contract, unit-test invariants, fork-test against the *real* deployed protocols it will touch (real pools, real oracles, real tokens), run static analysis, deploy to a testnet, then mainnet. Audits slot in before real funds — the case studies in this course are mostly failures of process, not of grammar.",
          "For this course you do not need either tool yet — Remix covers the exercises. But the fork-test idea is worth internalizing early: it is how you would reproduce every bug you will study in the case study library, on your own machine, without spending anything."
        ]
      }
    ],
    keyTerms: [
      { term: "dApp", definition: "An application whose backend logic runs as contracts and whose client talks to the chain through wallets and RPC." },
      { term: "RPC provider", definition: "A node gateway exposing the JSON-RPC interface that browsers and wallets use to read state and broadcast transactions." },
      { term: "eth_call", definition: "A free, local read executed against a node's current state without broadcasting." },
      { term: "transaction receipt", definition: "The per-transaction result record: status, gas used, and all emitted event logs." },
      { term: "event log", definition: "The append-only log layer written by contracts for off-chain consumers; searchable by topics." },
      { term: "subgraph", definition: "A Graph-protocol indexer that decodes contract events into queryable entities." },
      { term: "IPFS", definition: "Content-addressed storage where files are identified by the hash of their contents." },
      { term: "SIWE", definition: "Sign-In with Ethereum — proving address control by signing a structured message, replacing password sessions." }
    ],
    practices: [
      {
        id: "dapp-architecture-practice-1",
        title: "Watch a dApp talk to the chain",
        goal: "See the five-layer stack in action: reads, log subscriptions, and one signed write.",
        steps: [
          "Open any read-only dApp page (a price chart or portfolio viewer) in your browser and open DevTools, Network tab.",
          "Filter by fetch/XHR and find JSON-RPC calls: eth_call, eth_getLogs, eth_blockNumber.",
          "Inspect one eth_call request body — note the to address and the encoded calldata.",
          "Watch the websocket or polling traffic while the page live-updates — identify the log subscription or getLogs loop.",
          "Connect a wallet on Sepolia and submit one harmless transaction (send 0 ETH to yourself) — watch the send call appear.",
          "Open the same transaction on sepolia.etherscan.io and match each field you saw in DevTools to the explorer view."
        ],
        caution: "Use Sepolia if you sign anything. Reading dApps costs nothing; only the optional signed transaction needs testnet ETH."
      }
    ],
    resources: [
      { title: "dApps — ethereum.org", url: "https://ethereum.org/en/developers/docs/dapps/", type: "docs" },
      { title: "JSON-RPC API — ethereum.org", url: "https://ethereum.org/en/developers/docs/apis/json-rpc/", type: "docs" },
      { title: "InterPlanetary File System — Wikipedia", url: "https://en.wikipedia.org/wiki/InterPlanetary_File_System", type: "article" },
      { title: "Graph Node — The Graph on GitHub", url: "https://github.com/graphprotocol/graph-node", type: "tool", note: "The indexer behind subgraphs" },
      { title: "Foundry", url: "https://github.com/foundry-rs/foundry", type: "tool", note: "Rust toolkit: anvil, forge, cast" }
    ],
    quiz: [
      {
        id: "dapp-architecture-q1",
        prompt: "Which interaction is free, instant, and never broadcast to the network?",
        options: [
          "Sending a transaction",
          "An eth_call read",
          "Emitting an event",
          "Deploying a contract"
        ],
        correctIndex: 1,
        explanation: "eth_call executes against a node's local state without consensus cost. Transactions cost gas and inclusion; events ride on transactions; deployments are transactions."
      },
      {
        id: "dapp-architecture-q2",
        prompt: "Why do contracts rely on events instead of pushing notifications?",
        options: [
          "Events are cheaper than storage and the only channel contracts have toward off-chain listeners",
          "Events are required for state changes",
          "Events execute faster on-chain",
          "Events persist inside contract storage"
        ],
        correctIndex: 0,
        explanation: "Contracts cannot initiate communication; events write to receipts that off-chain consumers index. They are cheap precisely because the EVM cannot read them back."
      },
      {
        id: "dapp-architecture-q3",
        prompt: "An NFT's image lives where, typically?",
        options: [
          "In contract storage as bytes",
          "Off-chain via a tokenURI pointing to IPFS or a server",
          "In the block header",
          "Nowhere — NFTs are only ids"
        ],
        correctIndex: 1,
        explanation: "Ownership and ids are on-chain; metadata is usually a content-addressed pointer. That pointer is part of the trust surface — dead pins or mutable URIs change what the token points to."
      },
      {
        id: "dapp-architecture-q4",
        prompt: "What does an indexer (subgraph) fundamentally change about reading chain data?",
        options: [
          "It writes new state to the chain",
          "It decodes raw events into queryable entities, trading freshness and an extra trust point for usability",
          "It verifies consensus",
          "It replaces RPC nodes"
        ],
        correctIndex: 1,
        explanation: "Indexing is a derived view: fast, joinable queries over decoded logs, with lag and indexer trust as the price. Settlement-critical logic still reads the chain directly."
      }
    ]
  },
  {
    id: "defi-primitives",
    level: "intermediate",
    order: 5,
    title: "DeFi Primitives",
    subtitle: "Swaps, collateral, flash loans and money legos — the building blocks and how they break.",
    minutes: 20,
    objectives: [
      "Describe how liquidity pools replace orderbooks and what swaps really do to reserves.",
      "Model overcollateralized borrowing and explain why collateral requirements exist.",
      "Explain flash loans and why atomicity makes them safe primitives but sharp attack tools.",
      "Assess composability benefits and systemic risks, and critique TVL as a headline metric."
    ],
    sections: [
      {
        heading: "Finance as composable contracts",
        paragraphs: [
          "Traditional finance is organizations holding assets and matching counterparties. DeFi rebuilds the same primitives as contracts: custody by multisig and code, market-making by formula, credit by collateral. Everything runs around the clock, globally, without accounts — and without credit assessment, because nobody can underwrite a pseudonym. Collateral substitutes for trust throughout.",
          "The primitives are small and composable: swap (pool), lend and borrow (pool plus interest model), collateralize (deposit into a market), mint (create a synthetic), flash loan (borrow and repay in one transaction). Composition means calling several of these in a single transaction — a strategy, not a product.",
          "Honest framing for the whole module: DeFi does not remove risk, it *replaces* counterparty risk with smart-contract risk, oracle risk and governance risk. Each is smaller in some ways (no one can abscond with pooled funds directly) and larger in others (a bug drains everyone at once). The case study library catalogues both."
        ]
      },
      {
        heading: "Swaps and liquidity pools",
        paragraphs: [
          "An orderbook needs active market makers quoting both sides. A liquidity pool replaces them with two reserves and a pricing curve: traders exchange against the pool, and the reserve ratio *is* the price. Anyone can supply both assets and earn the swap fees; anyone can trade at any size, at any hour, with no counterparty approval.",
          "The fee is compensation for a structural cost: the pool is always willing to trade, including with traders who know more than the pool does. Every informed trade leaves the pool slightly worse off than holding — **adverse selection** — and fees are the toll that makes supplying worthwhile anyway. Whether fees beat that cost is the impermanent-loss question of the next lesson.",
          "Families of curves exist because the trade-off differs by asset: constant-product for volatile pairs, stableswap curves for pegged assets (near-zero slippage at the peg), concentrated liquidity for efficiency. The mechanics are next lesson; here, keep the economic role of the curve — a public, formulaic market maker."
        ]
      },
      {
        heading: "Collateral and borrowing",
        paragraphs: [
          "Lending without identity means lending against assets: post collateral worth more than the debt. Each accepted asset carries a **collateral factor** (also called max LTV) — say 80% for ETH — set by protocol risk teams and governance based on volatility and liquidity. Borrowing power equals collateral value times the collateral factor.",
          "Worked example: deposit 1 ETH priced at $2,000 with an 80% factor, and you have $1,600 of borrowing power; borrow 1,000 USDC and you keep a cushion of $600. If ETH falls, the cushion shrinks mechanically; when it hits zero (here, ETH at $1,250), the position is liquidatable. The cushion is not arbitrariness — it must absorb price movement, oracle lag and liquidation incentives between checkups.",
          "This same primitive underlies stablecoin generation (DAI vaults), margin trading, and leveraged looping (below). Overcollateralization is the tax paid for removing identity — inefficient in capital, robust in assumptions."
        ]
      },
      {
        heading: "Flash loans",
        paragraphs: [
          "A flash loan lends any amount with zero collateral on one condition: repay within the same transaction. If repayment fails, the entire transaction reverts and it is as if nothing happened — the lender's invariant (never be owed anything) holds by construction. Atomicity makes unsecured lending safe.",
          "Legitimate uses exploit the same property: collateral swaps (borrow, re-collateralize, repay atomically), refinancing debt across protocols, arbitrage between venues, self-liquidation to avoid penalties. The borrower risks only gas.",
          "The sharp edge: flash loans rent billions of dollars of buying power to anyone for one block. Attack patterns — price manipulation of thin pools used as oracles, governance token accumulation — no longer require capital, only an idea. Flash loans did not create these vulnerabilities; they democratized access and removed the attacker needs money as a defense. Every protocol must now assume an adversary with unlimited temporary resources."
        ],
        callout: {
          type: "deep-dive",
          title: "Atomicity is the parent pattern",
          body: "Everything in a transaction happens or nothing does. Flash loans, sandwich attacks, multi-hop arbitrages and most exploit sequences all live inside this single property. When you evaluate any DeFi mechanism, ask: what could an adversary do if they could chain unlimited actions atomically, for free?"
        }
      },
      {
        heading: "Money legos and systemic risk",
        paragraphs: [
          "Composability earns the money-legos name: collateral can itself be a yield-bearing position, LP tokens can be collateral, vaults stack on vaults. Each layer adds yield options — and multiplies dependencies. A position three layers deep depends on three codebases, three oracle setups and three governance processes simultaneously.",
          "Leverage loops show the math: deposit ETH, borrow stablecoin at an 80% collateral factor, swap the stablecoin back to ETH, redeposit. Each round multiplies exposure by 1/(1 − 0.8) — bounded at 5× for a single asset, and higher when multiple protocols accept each other's receipts. The loop is rational per user and fragile in aggregate.",
          "Systemic dynamics: a price shock triggers liquidations, liquidations sell collateral, selling deepens the shock, and congestion (gas spikes) slows liquidators exactly when it matters. Correlated collateral concentrates the damage — when one liquid-staking receipt backs positions across many protocols, its depeg is everyone's problem. Diversification assumptions that hold in isolation fail together."
        ]
      },
      {
        heading: "TVL: the metric and its flaws",
        paragraphs: [
          "**TVL** (total value locked) sums the dollar value of assets held in a protocol's contracts. It is the headline number of the industry — comparable across protocols, easy to compute, and misleading in predictable ways.",
          "None of this makes TVL useless — it measures scale and user commitment over time, especially within one protocol. But comparisons across protocols require decomposition: native deposits versus borrowed, own-token positions haircut or excluded, and price movement normalized out. Analysts ask for *net* deposits, not gross.",
          "The habit generalizes: every aggregated metric in this industry deserves a what-exactly-is-being-counted pass. The final lesson builds the tooling discipline for checking at the source; here, build the skepticism."
        ],
        list: [
          "Double counting: an LP token deposited as collateral is counted by the AMM and by the lending market",
          "Price inflation: ETH doubling raises every ETH-heavy TVL with zero new deposits",
          "Own-token inflation: unissued team tokens counted at market prices inflate TVL that could never be sold at those prices",
          "Borrowed assets re-counted: funds borrowed from one market and deposited to another appear in both"
        ]
      }
    ],
    keyTerms: [
      { term: "liquidity pool", definition: "Reserves of two or more assets that price and settle trades by formula instead of counterparties." },
      { term: "collateral factor", definition: "The fraction of an asset's value that counts as borrowing power (max LTV), set per asset by risk teams." },
      { term: "flash loan", definition: "An uncollateralized loan that must be repaid within the same transaction or the whole transaction reverts." },
      { term: "atomicity", definition: "All-or-nothing execution: a transaction's effects commit fully or not at all." },
      { term: "composability", definition: "Protocols calling each other within single transactions, treating each other as legos." },
      { term: "leverage loop", definition: "Repeatedly depositing, borrowing and re-depositing to multiply exposure up to 1/(1 − collateral factor)." },
      { term: "TVL", definition: "Total value locked — the dollar value of assets in a protocol's contracts; useful, and routinely miscounted." },
      { term: "adverse selection", definition: "The pool's structural loss to traders who know more than the formula; the cost fees must cover." }
    ],
    practices: [
      {
        id: "defi-primitives-practice-1",
        title: "Trace a flash loan on Etherscan",
        goal: "See atomicity in the wild: one transaction, many protocols, one invariant.",
        steps: [
          "On etherscan.io, search the web for a documented Aave flash loan transaction hash, then open it on Etherscan.",
          "Read the Logs tab: find the FlashLoan event and note the asset, amount and initiator.",
          "Open the Internal Txns tab and trace which contracts received value during execution.",
          "Check the decoded input: how many contract calls were chained inside this single transaction?",
          "State the invariant you expect (loan repaid in the same transaction) and verify the pool's balance before and after via the state-change view."
        ]
      },
      {
        id: "defi-primitives-practice-2",
        title: "Compute a leverage loop",
        goal: "Feel the 1/(1 − CF) bound with a paper exercise.",
        steps: [
          "Assume an 80% collateral factor and $10,000 of ETH deposited. Compute the maximum borrowing power.",
          "Simulate one loop: borrow, swap to ETH, redeposit — recompute total collateral and total debt.",
          "Iterate until the next loop adds less than one dollar of exposure; sum your total exposure.",
          "Verify your total against the closed form: 10,000 / (1 − 0.8). Then repeat with a 90% collateral factor and compare."
        ]
      }
    ],
    resources: [
      { title: "DeFi — ethereum.org", url: "https://ethereum.org/en/defi/", type: "docs" },
      { title: "Aave developer documentation", url: "https://docs.aave.com/developers/", type: "docs", note: "Flash loans and market mechanics" },
      { title: "Uniswap documentation", url: "https://docs.uniswap.org/", type: "docs" },
      { title: "Decentralized finance — Wikipedia", url: "https://en.wikipedia.org/wiki/Decentralized_finance", type: "article" }
    ],
    quiz: [
      {
        id: "defi-primitives-q1",
        prompt: "Why can flash loans be offered with no collateral?",
        options: [
          "Because lenders are charitable",
          "Because repayment is enforced within the same transaction — failure reverts everything",
          "Because borrowers post NFTs",
          "Because they are subsidized by protocol fees"
        ],
        correctIndex: 1,
        explanation: "Atomicity guarantees the lender never ends up owed: either the loan repays inside the transaction or the whole transaction reverts. The risk-free property is mechanical, not social."
      },
      {
        id: "defi-primitives-q2",
        prompt: "With an 80% collateral factor, what is the maximum exposure from looping a $10,000 deposit?",
        options: ["$12,500", "$18,000", "$50,000", "$80,000"],
        correctIndex: 2,
        explanation: "Each loop multiplies exposure by 1/(1 − CF); 1/(1 − 0.8) = 5, so $10,000 supports at most $50,000 of exposure. The bound tightens sharply as collateral factors rise."
      },
      {
        id: "defi-primitives-q3",
        prompt: "Which of these does NOT inflate a protocol's TVL measurement?",
        options: [
          "Counting LP tokens in both the AMM and the lending market",
          "The underlying assets rising in price",
          "Counting unissued team tokens at market price",
          "Users withdrawing deposits"
        ],
        correctIndex: 3,
        explanation: "Withdrawals reduce TVL by definition. The other three are the classic distortions: double counting, price beta, and own-token circularity."
      },
      {
        id: "defi-primitives-q4",
        prompt: "What is the economic role of swap fees in a liquidity pool?",
        options: [
          "They pay for gas",
          "They compensate liquidity providers for adverse selection — the pool's structural loss to informed traders",
          "They fund the development team only",
          "They are a tax collected by miners"
        ],
        correctIndex: 1,
        explanation: "The pool trades with everyone, including better-informed traders, and systematically loses a little each time. Fees exist to pay LPs enough that supplying still beats holding."
      }
    ]
  },
  {
    id: "amms-and-dexs",
    level: "intermediate",
    order: 6,
    title: "AMMs & DEXs",
    subtitle: "x*y=k, impermanent loss computed by hand, and the road from Uniswap v2 to hooks.",
    minutes: 25,
    objectives: [
      "Compute swap outputs, effective price and price impact from the constant-product formula.",
      "Derive impermanent loss on a concrete two-price example and explain when it matters.",
      "Explain slippage tolerance, sandwich exposure and how aggregators route around it.",
      "Compare Uniswap v2, v3 (concentrated liquidity, ticks) and v4 (hooks) on capital efficiency and complexity."
    ],
    sections: [
      {
        heading: "From orderbooks to a formula",
        paragraphs: [
          "A DEX can match buyers and sellers with an orderbook, or replace counterparties with a curve. Uniswap v2 chose the simplest curve that works: **constant product**. The pool holds reserves x of token X and y of token Y, and enforces x · y = k on every swap (k set at deposit time, nudged upward by fees). The reserve ratio y/x is the pool's spot price.",
          "Two properties follow immediately. The pool always quotes a price — liquidity never runs out, it just gets exponentially more expensive at the extremes. And the pool's price moves continuously with trade size: small trades barely move it, large trades pay a rising marginal price. That second property is price impact, and computing it is this lesson's first exercise."
        ],
        callout: {
          type: "tip",
          title: "Fees are charged on the way in",
          body: "Uniswap v2 takes 0.3% of the input amount before applying the product invariant, so the effective input is amountIn × 0.997. The fee stays in the pool, growing k — that growth is the liquidity provider's revenue."
        }
      },
      {
        heading: "A swap, computed",
        paragraphs: [
          "Walk the numbers. The pool's k is 20,000,000 and its spot price 2,000 USDC per ETH. Selling 10 ETH — ten percent of the ETH reserve — nets 18,132.22 USDC after the fee, an effective price of about 1,813 per ETH: 9.3% worse than spot. The *post-trade* spot sits even lower, around 1,654, because the trade moved the whole curve.",
          "Notice the asymmetry between marginal and average price: the trader paid 2,000 for the first wei and progressively less for each following one, averaging 1,813. Price impact grows with the square of the trade's share of the pool — ten percent of depth moved the effective price about 9.3%, and the effect accelerates from there. This is the mathematical reason aggregators split large orders across venues, and why pool depth matters.",
          "Sanity check the invariant: 109.97 × 181,867.78 ≈ 20,000,001 — the fee nudged k upward by a hair, which is the pool's accumulated revenue. If a quoted swap output disagrees with this arithmetic, the quote includes a different fee tier or a different venue — know which before trusting it."
        ],
        code: {
          lang: "pseudocode",
          caption: "Constant-product swap with a 0.3% fee. Without the fee, output would be 18,181.82 USDC.",
          code: "// Pool: 100 ETH, 200,000 USDC\nk          = 100 * 200000            // = 20,000,000\nspot       = 200000 / 100            // = 2,000 USDC per ETH\n\n// A trader sells 10 ETH (0.3% fee -> effective input 9.97 ETH)\nnewEthReserve  = 100 + 9.97          // = 109.97\nnewUsdcReserve = k / newEthReserve   // = 20,000,000 / 109.97 = 181,867.78\nusdcOut        = 200000 - 181867.78  // = 18,132.22\n\neffectivePrice = usdcOut / 10        // = 1,813.22 USDC per ETH\npostTradeSpot  = newUsdcReserve / newEthReserve  // = 1,653.75"
        }
      },
      {
        heading: "Slippage tolerance and the sandwich",
        paragraphs: [
          "A swap transaction can sit in the mempool while others land first. **Slippage tolerance** is the defense: the trader specifies a minimum acceptable output (or maximum input), and the router reverts the swap if the pool moved beyond it. On the 10-ETH trade, a 1% limit means demanding at least roughly 17,951 USDC of output.",
          "The defense targets the **sandwich attack**: an attacker sees your pending swap, buys ahead of it (pushing the price up), lets your trade execute at the worse price, then sells into your impact. Your slippage tolerance caps their extraction — they can only profit from the gap you allowed. Tight limits reduce extraction but raise failure rates on volatile pairs, and failed transactions still pay gas for what executed before the revert.",
          "Modern mitigations: private orderflow (submitting transactions that skip the public mempool), MEV-protected routers, and batch auctions. None removes price impact — that is the curve — but they remove the part of your cost that came from *announcing* your trade. The advanced MEV lesson goes deep; here, know that quoted slippage and realized slippage are different numbers."
        ]
      },
      {
        heading: "Impermanent loss, by hand",
        paragraphs: [
          "**Impermanent loss (IL)** is the gap between what a liquidity provider ends up with versus simply holding the two tokens, caused by the pool continuously rebalancing toward equal value. Concrete case: deposit 1 ETH + 100 USDC at price $100 (k = 100). The market price doubles to $200. Arbitrageurs trade against the pool until its internal price matches: new reserves 0.7071 ETH + 141.42 USDC (product preserved: 0.7071 × 141.42 ≈ 100).",
          "Value the positions. LP: 0.7071 × $200 + $141.42 = $282.84. HODL: 1 × $200 + $100 = $300. IL = 282.84 / 300 − 1 = **−5.72%**: nearly six percent poorer than doing nothing, before fees. The pool mechanically sold ETH on the way up and bought it on the way down — buying high, selling low, always.",
          "Three practical consequences. Fees can offset IL — whether they do is pool- and period-specific, and never guaranteed. Correlated pairs (ETH against a liquid-staking receipt) have near-zero IL because the ratio barely moves; peg-breaking is the disaster case, as the UST depeg showed LPs. And IL is *impermanent* only until you withdraw — the moment you exit, the paper gap becomes real money. The full derivation lives in the [Uniswap v2 whitepaper](https://uniswap.org/whitepaper.pdf)."
        ],
        table: {
          headers: ["Price change", "IL vs HODL (fees excluded)"],
          rows: [
            ["+25%", "−0.6%"],
            ["+50%", "−2.0%"],
            ["+100%", "−5.7%"],
            ["+200%", "−13.4%"],
            ["+400%", "−20.0%"]
          ]
        }
      },
      {
        heading: "Concentrated liquidity: Uniswap v3",
        paragraphs: [
          "v2 providers spread capital across every price from zero to infinity; at any moment, almost all of it is idle. Uniswap v3 lets providers choose a range [Pa, Pb] and supplies **virtual reserves** concentrated there. Capital efficiency jumps: fee-earning density scales roughly with the inverse of range width, so a position spanning a tenth of the price space earns about ten times the fees per dollar — *while price stays inside it*.",
          "The cost is active management. If price exits your range, the position sits 100% in the worse-performing asset and earns nothing — a freeze exactly when IL bites hardest. Ranges must be re-centered as price drifts, spending gas and realizing IL each time. v3 discretizes price into **ticks** (a tick is log base 1.0001 of price) and liquidity is provided per tick; swaps hop through ticks, adding and removing liquidity as they go.",
          "Positions became unique — hence v3 positions are NFTs, each with its own range. The economic shift is real: providing liquidity turned from passive depositing into a strategy with monitoring obligations, formalized in the [v3 whitepaper](https://raw.githubusercontent.com/Uniswap/v3-core/main/docs/whitepaper-v3.pdf). Passive providers on volatile pairs often underperform holding; stablecoin pairs with tight ranges behave closer to v2."
        ]
      },
      {
        heading: "v4 hooks and the aggregator layer",
        paragraphs: [
          "Uniswap v4 moves all pools into a singleton contract and introduces **hooks**: external contracts attached to individual pools that intercept lifecycle points — before and after swaps, liquidity changes, fee updates. A hook can enforce dynamic fees, build limit orders, or implement custom curves inside the pool itself. The hook's address encodes which lifecycle hooks it uses, so behavior is verifiable at a glance.",
          "Power and risk travel together: attaching arbitrary code to a pool's execution path is a new trust surface — users of a hooked pool must read the hook like any other contract. v4's architectural win is composability (one contract, accounting shared across pools) plus extensibility; its cost is a wider surface to audit. Every convenience in DeFi eventually asks: who wrote the code between you and your money?",
          "Above the pools sit **aggregators**: routers that query many venues — v2, v3, v4, Curve, Balancer — split an order into chunks, and route each chunk to minimize total price impact. For the 10-ETH trade above, an aggregator might send 4 ETH to one pool and 6 to another, blending shallower curves into one better average price. Retail flow overwhelmingly routes through aggregators, which is why reading pool-level math still matters: it is the ground truth the aggregators optimize against."
        ]
      }
    ],
    keyTerms: [
      { term: "constant product", definition: "The x·y = k invariant behind Uniswap v2 pools; the reserve ratio sets the spot price." },
      { term: "price impact", definition: "The gap between spot price and average execution price caused by moving the curve." },
      { term: "slippage tolerance", definition: "A trader-set minimum output (or maximum input) that reverts the swap if the pool moves too far." },
      { term: "sandwich attack", definition: "Front-running and back-running a pending swap to extract its allowed slippage." },
      { term: "impermanent loss", definition: "The shortfall of an LP position versus holding, from continuous rebalancing; about −5.72% at a 2× price move." },
      { term: "tick", definition: "Uniswap v3's discrete price grid (log base 1.0001); liquidity is provided per tick." },
      { term: "concentrated liquidity", definition: "Liquidity supplied only within a chosen price range, multiplying fee density and management burden." },
      { term: "hook", definition: "A v4 contract attached to a pool that intercepts swaps and liquidity events — power with a trust cost." }
    ],
    practices: [
      {
        id: "amms-and-dexs-practice-1",
        title: "Compute impermanent loss by hand",
        goal: "Derive −2.02% yourself, then check it against the table.",
        steps: [
          "Set up: an LP deposits 1 ETH + 3,000 USDC when ETH trades at 3,000. Confirm k = 3,000.",
          "The price moves to 4,500 (a 1.5× move). Solve for the pool's new reserves with x·y = 3,000 and y/x = 4,500.",
          "Value the LP position: (ETH amount × 4,500) + USDC amount. You should get about 7,348.47.",
          "Value the HODL alternative: 1 × 4,500 + 3,000 = 7,500.",
          "Compute IL = 7,348.47 / 7,500 − 1. You should land at about −2.02%, matching the table's +50% row.",
          "Bonus: assume the pool earned 1% in fees over the same period. Did fees offset IL here?"
        ]
      },
      {
        id: "amms-and-dexs-practice-2",
        title: "Verify a swap against the formula",
        goal: "Close the loop between the whitepaper math and a real transaction.",
        steps: [
          "Find a recent Uniswap router swap on etherscan.io and open its decoded input and Swap event logs.",
          "Read the amounts: exact input, minimum output, and the actual amounts in and out from the event.",
          "Compute the effective execution price from the event amounts.",
          "Read the pool's post-trade reserves via the pool contract on Etherscan and compute the post-trade spot price.",
          "Note the fee tier used (0.05%, 0.3%, 1%) and recompute the expected output with that fee — how close is the real number?"
        ]
      }
    ],
    resources: [
      { title: "Uniswap v2 whitepaper", url: "https://uniswap.org/whitepaper.pdf", type: "paper" },
      { title: "Uniswap v3 whitepaper", url: "https://raw.githubusercontent.com/Uniswap/v3-core/main/docs/whitepaper-v3.pdf", type: "paper" },
      { title: "Uniswap documentation", url: "https://docs.uniswap.org/", type: "docs" },
      { title: "Uniswap v3 concepts", url: "https://v3.docs.uniswap.org/", type: "docs", note: "Concentrated liquidity explained" },
      { title: "Etherscan", url: "https://etherscan.io/", type: "tool", note: "For the swap-verification practice" }
    ],
    quiz: [
      {
        id: "amms-and-dexs-q1",
        prompt: "A pool holds 100 ETH and 200,000 USDC. What are k and the spot price?",
        options: [
          "k = 2,000,000; spot = 2,000",
          "k = 20,000,000; spot = 2,000",
          "k = 20,000,000; spot = 200",
          "k = 200,000; spot = 100"
        ],
        correctIndex: 1,
        explanation: "k = x · y = 100 × 200,000 = 20,000,000, and the spot price is the reserve ratio y/x = 200,000/100 = 2,000. Both numbers fall straight out of the invariant."
      },
      {
        id: "amms-and-dexs-q2",
        prompt: "An LP provides 1 ETH + 100 USDC at price 100, and the price doubles to 200. Ignoring fees, what is the impermanent loss versus holding?",
        options: [
          "0% — the pool value is unchanged",
          "About −5.7%",
          "About −13.4%",
          "About −25.5%"
        ],
        correctIndex: 1,
        explanation: "The pool rebalances to 0.7071 ETH + 141.42 USDC = $282.84, while holding would be $300: a 5.72% shortfall. IL grows super-linearly with price divergence — −13.4% corresponds to a 3× move."
      },
      {
        id: "amms-and-dexs-q3",
        prompt: "In Uniswap v3, what happens to a position when price moves outside its range?",
        options: [
          "The position closes automatically",
          "The position becomes 100% the worse-performing asset and stops earning fees until re-centered",
          "The position doubles its liquidity",
          "Fees continue accruing at the same rate"
        ],
        correctIndex: 1,
        explanation: "Out-of-range v3 liquidity is fully converted to one asset and is inert — no fees until price re-enters or the provider re-positions. That freeze is the price paid for concentrated capital efficiency."
      },
      {
        id: "amms-and-dexs-q4",
        prompt: "Why do most retail swaps route through aggregators rather than a single pool?",
        options: [
          "Aggregators avoid paying gas",
          "Splitting an order across venues reduces total price impact versus forcing it through one curve",
          "Aggregators have better consensus",
          "Pools refuse large trades"
        ],
        correctIndex: 1,
        explanation: "Price impact grows super-linearly with trade share, so chunking an order across shallower curves yields a better blended average price. The aggregator's job is optimization over the pool math you just learned."
      }
    ]
  },
  {
    id: "lending-and-stables",
    level: "intermediate",
    order: 7,
    title: "Lending Protocols & Stablecoin Design",
    subtitle: "Health factors, liquidations, interest curves — and three ways to mint a dollar.",
    minutes: 24,
    objectives: [
      "Compute borrowing power and health factor from collateral value and collateral factor.",
      "Explain how Aave-style liquidations work and why liquidation bonuses exist.",
      "Describe utilization-based interest rate models and why they kink.",
      "Compare fiat-backed, crypto-backed (CDP) and algorithmic stablecoins, and assess liquid staking risks."
    ],
    sections: [
      {
        heading: "Pooled lending",
        paragraphs: [
          "Aave and Compound run the same shape: suppliers deposit assets into a pooled market and receive a receipt (aTokens) that accrues interest; borrowers draw from the same pool against collateral and pay a rate set by utilization. No per-pair matching — every lender lends to the pool, every borrower borrows from it. Interest flows continuously as balances update per block.",
          "Each asset in each market carries risk parameters: collateral factor (max borrowing power), liquidation threshold (slightly above the factor — the actual liquidation line), reserve factor (a share of interest set aside as protocol insurance), and borrow and supply caps. These numbers *are* the risk model: governance adjusts them per asset based on volatility, liquidity and oracle quality.",
          "Newer designs add structure on top — isolated markets for riskier collateral, efficiency modes for correlated assets such as liquid-staking receipts — but the core loop of deposit, borrow, liquidate is what this lesson's math runs on."
        ]
      },
      {
        heading: "Collateral factor and health factor",
        paragraphs: [
          "The **health factor (HF)** compresses a whole position into one number: weighted collateral value divided by total debt. With a collateral factor of 80%, deposit 1 ETH at $2,000 and borrow 1,000 USDC: HF = (2,000 × 0.8) / 1,000 = 1.6. HF above 1 is safe; at exactly 1 the position reaches its liquidation threshold.",
          "HF is live: it recomputes with every price tick. Track the same position as ETH falls — at $1,500, HF = 1.2; at $1,250, HF = 1.0 and liquidation begins; at $1,100, HF = 0.88. The position did nothing wrong except hold a volatile collateral, and its safety margin was eaten by the market.",
          "Two habits follow. First, HF 1.6 means one thing at 5% volatility and another at 60% — risk-adjust the number, do not worship it. Second, HF depends on the oracle (next lesson): a stale or manipulated price can trigger or hide liquidations at the wrong moment."
        ],
        table: {
          headers: ["ETH price", "Collateral value", "Health factor", "Status"],
          rows: [
            ["$2,000", "$2,000", "1.60", "Safe"],
            ["$1,500", "$1,500", "1.20", "Cushion thinning"],
            ["$1,250", "$1,250", "1.00", "Liquidation threshold"],
            ["$1,100", "$1,100", "0.88", "Liquidatable"]
          ]
        }
      },
      {
        heading: "Liquidations",
        paragraphs: [
          "When HF drops to 1, anyone can call the liquidation function: they repay part of the borrower's debt (up to a **close factor**, often 50% per transaction) and receive an equivalent share of collateral plus a **liquidation bonus** (commonly around 5%, set per asset). The borrower loses collateral at a discount but keeps the remainder of the position open — de-risked, not destroyed.",
          "Worked: at HF 0.95 our example borrower owes 1,000 USDC against 1,100 worth of ETH. A liquidator repays 500 USDC and seizes 525 worth of ETH (500 plus the 5% bonus). The incentives are the design: third parties run bots watching every position, because the bonus pays them to be faster than the next bot. The protocol never touches the process — liquidation is a market.",
          "When the market fails, bad debt appears: thin collateral liquidity means liquidators cannot sell what they seized; gas spikes price out liquidators; oracle lag hides underwater positions. Protocols socialize such losses through the reserve factor, and cascades amplify them — liquidation sells push prices lower, triggering more liquidations. Design reviews always ask: what happens to the last liquidation in a crash?"
        ]
      },
      {
        heading: "Interest rates follow utilization",
        paragraphs: [
          "The pool's thermostat is **utilization**: U = borrowed / (borrowed + available liquidity). The borrow rate is a function of U — modest below an optimal point (commonly around 80-90%), rising steeply beyond it. The supply rate is the borrow rate multiplied by utilization and shaved by the reserve factor: lenders earn only what borrowers pay, pro rata.",
          "The kink encodes a safety requirement: at U = 100% the pool has no free liquidity — suppliers cannot withdraw and liquidators have nothing to borrow to execute with. The steep second slope makes that state economically self-correcting: borrowing becomes brutally expensive while supply (at near-full utilization) earns maximally, pulling liquidity back in.",
          "Reading rates as signals: a market sitting near its kink for long stretches is either very healthy (high demand) or undercapitalized (one big withdrawal from trouble). Compare supply APYs across markets for the same asset — large gaps usually trace back to utilization differences, caps, or risk parameters."
        ],
        code: {
          lang: "pseudocode",
          caption: "A kinked interest-rate model: cheap credit up to the optimal point, expensive past it.",
          code: "// stylized rate model\nif (U < optimalU) {\n    borrowRate = baseRate + (U / optimalU) * slope1;\n} else {\n    borrowRate = baseRate + slope1 + ((U - optimalU) / (1 - optimalU)) * slope2;\n}\nsupplyRate = borrowRate * U * (1 - reserveFactor);"
        }
      },
      {
        heading: "Stablecoins: three architectures",
        paragraphs: [
          "A stablecoin is a claim engineered to hold a peg, and the architecture decides who bears the risk. Three families dominate: fiat-backed (USDC, USDT — dollars in a bank, tokens on chain), crypto-overcollateralized (DAI — debt positions against crypto collateral), and algorithmic (UST — stability by incentive design).",
          "Fiat-backed coins buy simplicity with custody: the issuer can freeze addresses, and blacklists are enforced at the token contract because regulators require it. Crypto-backed coins trade that for machinery: vaults, stability fees, liquidations — the exact mechanics of the first three sections, applied to money creation. Algorithmic designs are the graveyard: Terra's UST collapsed in May 2022 when its endogenous collateral (LUNA) hyperinflated trying to defend the peg — studied in depth in the Terra case study.",
          "When evaluating any stablecoin, ask the same three questions: what backs it, who can freeze or mint, and what happens in a bank run? Every historical failure — Terra, Iron, Basis — failed one of those three."
        ],
        table: {
          headers: ["Design", "Backing", "Key strength", "Key failure mode"],
          rows: [
            ["Fiat-backed (USDC, USDT)", "Bank reserves, T-bills", "Simple, liquid, regulated", "Custodial freeze and blacklist; reserve opacity"],
            ["Crypto-backed CDP (DAI / Sky)", "Overcollateralized vaults", "Permissionless mint and burn, transparent", "Liquidation cascades; parameter risk"],
            ["Algorithmic (UST, historical)", "Endogenous token (LUNA)", "No reserve needed — scalable", "Death spiral: peg breaks, collateral collapses"]
          ]
        }
      },
      {
        heading: "DAI and USDC, side by side",
        paragraphs: [
          "USDC is Circle's liability: minted when dollars arrive, burned on redemption, blacklistable by the issuer, with reserves held as cash and short T-bills under monthly attestations. Its depeg episodes come from the banking layer — in March 2023 it fell to roughly $0.88 when part of its reserves sat at Silicon Valley Bank over a weekend. The risk is institutional, and legible.",
          "DAI (Maker, now the Sky ecosystem) mints against permissionless vaults: lock collateral above a threshold, draw DAI, repay plus a stability fee; governance sets every parameter. Its history is a decentralization trade in slow motion — to scale, it accepted centralized collateral: USDC via its peg-stability module and real-world assets in quantity. Today's DAI is a hybrid: overcollateralized crypto at its core, fiat-adjacent assets at its edges.",
          "The comparison teaches the right lesson: *decentralized* is a spectrum over collateral composition and governance control, not a label. Check what actually backs a coin and who can pull levers — marketing categories (algorithmic, decentralized) describe intentions, not balance sheets."
        ]
      },
      {
        heading: "Liquid staking: Lido and stETH",
        paragraphs: [
          "Proof of stake pays validators to secure Ethereum, but staked ETH is locked and node operation is technical. Liquid staking pools the stakes: Lido aggregates deposits, runs validators, and issues stETH one-to-one — a receipt that accrues staking rewards and trades freely. The receipt becomes a money lego: usable as collateral in the same lending markets from section one.",
          "The risks stack. Depeg: stETH traded below ETH during the June 2022 stress (Curve pool imbalance), catching leveraged users between a falling receipt and fixed debt — the correlated-collateral cascade from the DeFi primitives lesson, with a real date attached. Slashing: validator faults reduce the pool. Concentration: Lido's share of total staked ETH is large enough that its governance is a consensus-level concern, not just a protocol one.",
          "The loop closes the module: ETH, staked via Lido, becomes stETH used as collateral to borrow ETH, which is staked again. Each step is individually rational; together they couple DeFi leverage to Ethereum's consensus layer. Yield numbers — a few percent — look small until you notice the leverage and the systemic surface."
        ],
        callout: {
          type: "warning",
          title: "Staking yield is not free money",
          body: "Staking APY carries slashing risk, liquidity (depeg) risk, and concentration risk — none visible in the headline number. Before supplying or looping a liquid-staking receipt, ask what happens to your health factor if the receipt trades at a discount for a week."
        }
      }
    ],
    keyTerms: [
      { term: "collateral factor", definition: "The share of collateral value that grants borrowing power (max LTV)." },
      { term: "health factor", definition: "Weighted collateral value divided by debt; below 1 the position is liquidatable." },
      { term: "liquidation", definition: "Third-party repayment of part of a debt against seized collateral plus a bonus." },
      { term: "close factor", definition: "The maximum share of a debt that one liquidation transaction may repay." },
      { term: "utilization rate", definition: "Borrowed liquidity over total liquidity; drives the interest rate curve." },
      { term: "CDP", definition: "Collateralized debt position — a vault minting stablecoins against overcollateralized assets (DAI's core)." },
      { term: "liquid staking", definition: "A pooled staking service issuing a tradable receipt (stETH) for staked assets." },
      { term: "reserve factor", definition: "The share of interest income set aside as a protocol-level loss buffer." }
    ],
    practices: [
      {
        id: "lending-and-stables-practice-1",
        title: "Run the health-factor math",
        goal: "Compute HF, find the liquidation price, and stress-test a paper position against real Aave parameters.",
        steps: [
          "Set up a paper position: 2 ETH collateral at $2,000, an 80% collateral factor, borrowing 2,000 USDC.",
          "Compute the starting health factor (should be 1.6).",
          "Derive the liquidation price algebraically: at what ETH price does HF hit 1.0? (Answer: $1,250.)",
          "Assume a 5% liquidation bonus and a 50% close factor: compute the collateral seized if a liquidator fires at exactly HF 1.0.",
          "Open docs.aave.com and find the Aave v3 Ethereum market risk parameters; compare real collateral factors and bonuses for ETH and USDC.",
          "Redo steps 2-4 assuming ETH is at $1,400 when you borrow — notice how entry price, not just volatility, sets the margin."
        ]
      },
      {
        id: "lending-and-stables-practice-2",
        title: "Read a real liquidation",
        goal: "Watch the health factor become an actual transfer of value.",
        steps: [
          "On etherscan.io, find a documented Aave v3 liquidation transaction hash (search the web, or locate the Pool contract and scan its transactions).",
          "Read the decoded liquidationCall: collateral asset, debt asset, debt covered, liquidator.",
          "From the event data, compute the effective bonus: collateral received versus debt repaid.",
          "Check the block timestamp against the position's history — was this a slow bleed or a single-candle wipeout?",
          "Note which addresses called the liquidation — same operator across many events? That is a liquidation bot."
        ]
      }
    ],
    resources: [
      { title: "Aave developer documentation", url: "https://docs.aave.com/developers/", type: "docs" },
      { title: "Aave documentation", url: "https://docs.aave.com/", type: "docs", note: "Risk parameters and market design" },
      { title: "Stablecoins — ethereum.org", url: "https://ethereum.org/en/stablecoins/", type: "docs" },
      { title: "Stablecoin — Wikipedia", url: "https://en.wikipedia.org/wiki/Stablecoin", type: "article" },
      { title: "Dune", url: "https://dune.com/", type: "tool", note: "Dashboards on lending markets and stETH depeg history" }
    ],
    quiz: [
      {
        id: "lending-and-stables-q1",
        prompt: "1 ETH ($2,000) deposited at an 80% collateral factor, borrowing 1,000 USDC. At what ETH price does the health factor hit 1.0?",
        options: ["$1,600", "$1,250", "$1,000", "$800"],
        correctIndex: 1,
        explanation: "HF = (price × 0.8) / 1,000, so HF = 1.0 requires price = 1,250. Below it, liquidators can begin repaying debt against collateral plus bonus."
      },
      {
        id: "lending-and-stables-q2",
        prompt: "What is the purpose of the liquidation bonus?",
        options: [
          "To punish borrowers",
          "To compensate liquidators for gas, risk and capital, so liquidations happen reliably",
          "To fund protocol development",
          "To reduce the close factor"
        ],
        correctIndex: 1,
        explanation: "Liquidation is a market, not a protocol duty: the bonus is the wage that makes bots monitor every position continuously. Without it, bad debt would accumulate whenever markets move fast."
      },
      {
        id: "lending-and-stables-q3",
        prompt: "Why does the borrow rate curve kink upward after optimal utilization (around 80-90%)?",
        options: [
          "To increase protocol revenue on all loans",
          "To push the pool back below full utilization, because at 100% suppliers cannot withdraw and liquidators cannot operate",
          "To comply with regulation",
          "To reduce gas costs"
        ],
        correctIndex: 1,
        explanation: "Full utilization freezes the pool: no withdrawals and no liquidity for liquidations to borrow. The steep slope makes that state expensive for borrowers and lucrative for suppliers, restoring liquidity automatically."
      },
      {
        id: "lending-and-stables-q4",
        prompt: "Terra's UST failed because...",
        options: [
          "Its bank reserves were frozen",
          "Its collateral was endogenous — defending the peg required minting LUNA, whose collapse removed the backing",
          "It was hacked with a reentrancy bug",
          "An oracle fed it a stale price"
        ],
        correctIndex: 1,
        explanation: "UST's stabilizing mechanism exchanged UST for LUNA; when redemptions surged, LUNA supply exploded and its price collapsed, destroying the mechanism's backing. Endogenous collateral turns a bank run into a death spiral."
      }
    ]
  },
  {
    id: "oracles",
    level: "intermediate",
    order: 8,
    title: "Oracles",
    subtitle: "Getting off-chain truth into a trustless machine — feeds, TWAPs and manipulation.",
    minutes: 20,
    objectives: [
      "State the oracle problem and locate where trust re-enters a trustless system.",
      "Explain how decentralized price feeds aggregate many reporters and update on-chain.",
      "Compute a TWAP conceptually and know its trade-offs versus spot feeds.",
      "Analyze flash-loan price manipulation and pick an oracle pattern appropriate to a protocol."
    ],
    sections: [
      {
        heading: "The oracle problem",
        paragraphs: [
          "Consensus is deterministic: every node, given the same inputs, agrees on the same outputs. That strength is also a wall — the chain has no mechanism to observe anything outside itself. ETH/USD is not on-chain data; weather is not; a sports score is not. Someone must inject external facts, and whatever injects them becomes the system's weakest axiom.",
          "The naive solutions fail instructively. A contract owner setting the price is a single point of failure — and a honeypot for the key. Reading one exchange's API inherits its outages and its local distortions. Trusting the frontend to display honest prices means trusting the frontend. **The oracle problem** is not how to get data in, but how to get data in without recreating the trusted intermediary you removed.",
          "Oracles are a category, not a product: price feeds, verifiable randomness (VRF), generic API calls, identity attestations — even bridges and L2 sequencers are oracles in the structural sense, mechanisms importing off-chain claims. Every one of them is a trust boundary you can name and evaluate."
        ]
      },
      {
        heading: "Price feeds: aggregation in practice",
        paragraphs: [
          "Chainlink's data feeds are the workhorse. Independent node operators — exchanges, data companies, staking firms — each fetch prices from multiple sources and sign their reports; an off-chain aggregation step combines them (a median across reports). The result is written to an on-chain **aggregator contract** that stores the latest round: consumers read one address, and no single reporter can set the number.",
          "Updates fire on whichever comes first: a **heartbeat** (time elapsed, e.g. hourly) or a **deviation threshold** (price moved more than a set percent since the last round). Between updates the on-chain value is deliberately stale — fine for display, dangerous for liquidations — so consumers check the update timestamp against a maximum staleness before trusting `latestAnswer`.",
          "Feeds are per-pair and per-network, with per-feed decimals (ETH/USD uses 8). The security habit: treat the feed as an input with failure modes — stale, deviating, paused — and code the response, rather than assuming the number is truth."
        ],
        code: {
          lang: "solidity",
          caption: "Reading a feed: latestRoundData returns the price and its update time; decimals are per-feed (ETH/USD uses 8).",
          code: "interface AggregatorV3Interface {\n    function latestRoundData() external view\n        returns (uint80 roundId, int256 answer, uint256 startedAt,\n                 uint256 updatedAt, uint80 answeredInRound);\n}\n\n// ETH/USD mainnet proxy: 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419\n// price = answer / 1e8"
        }
      },
      {
        heading: "TWAPs",
        paragraphs: [
          "A **time-weighted average price (TWAP)** comes from the AMM itself instead of reporters. Uniswap pools accumulate a running cumulative price every second; the TWAP over any window is the difference in the accumulator divided by elapsed time. To distort the average, an attacker must hold the pool skewed across the *whole window* — manipulation becomes a matter of cost, not of timing.",
          "The trade-offs are the mirror image of aggregated feeds. TWAPs trust no reporters and cannot be paused by an operator — good. But they lag: an average over 30 minutes is useless for liquidating a position during a 5-minute crash, and an average over 5 minutes approaches spot and inherits spot's manipulability. Window choice is a direct security-versus-latency trade.",
          "Practical role: TWAPs suit accounting — valuing flows over time, benchmarking large trades — and serve as a manipulation-resistant *fallback* where a feed's liveness is in doubt. They are a poor primary oracle for volatile collateral: liquidation math needs freshness more than it needs reporter independence."
        ]
      },
      {
        heading: "Manipulation: a worked attack",
        paragraphs: [
          "The classic sequence, all inside one transaction: flash-borrow a large position in token Y; swap into a *thin* X/Y pool to distort the X price; interact with a protocol that reads that pool as its price source — borrow against inflated X collateral, or liquidate victims whose collateral now reads cheap; swap back; repay the flash loan; keep the difference. Total cost: gas and slippage. Total time: one block.",
          "Small numbers show the distortion. Pool: 100 X / 100,000 Y, so spot is 1,000 Y per X. The attacker sells 20,000 Y into it: reserves become about 83.33 X and 120,000 Y, and the pool now quotes 120,000 / 83.33 ≈ **1,440** per X — a 44% premium on one moderately sized trade in a pool of just 100 X. A lending market pricing collateral from this pool would grant 44% more borrowing power than reality, for the duration of a single transaction.",
          "Defenses stack: prefer aggregated feeds with staleness checks; never price money math from your own thin pool; cap borrowing on illiquid collateral; use TWAPs or multiple independent sources with cross-checks; add circuit breakers on price velocity. The case studies contain real exploits of exactly this shape — reading them after this lesson, you will see the pattern immediately."
        ]
      },
      {
        heading: "Choosing an oracle pattern",
        paragraphs: [
          "No single oracle wins; the choice depends on what failure you can tolerate. The table compresses the trade space.",
          "Rules of thumb. Liquidations and anything settlement-critical want the highest manipulation resistance plus explicit staleness handling — aggregated feeds, with a TWAP or bounds as cross-check. Accounting and analytics tolerate lag happily. Display can use anything, but users mistake display for settlement — label it.",
          "Hybrids are the mature pattern: feed as primary, TWAP as liveness fallback, sanity bounds across both (reject any price that deviates too far from the others). The engineering question is never which oracle is best, but which combination fails least badly for this asset, this volatility, this lockup."
        ],
        table: {
          headers: ["Pattern", "Trust locus", "Freshness", "Manipulation resistance", "Typical use"],
          rows: [
            ["Aggregated feed (Chainlink-style)", "Many reporters + aggregation", "Heartbeat or deviation — can be stale", "High — must corrupt a quorum", "Liquidations, core money math"],
            ["TWAP from a deep pool", "The pool only", "Lags by window length", "Cost-based — must skew for the window", "Fallbacks, benchmarking, L2s without feeds"],
            ["Single-source API", "One operator", "Fast", "Low", "Non-financial data, display"],
            ["Own pool spot price", "Anyone with capital", "Instant", "None — never for money math", "Display only"]
          ]
        }
      },
      {
        heading: "Timestamps, sequencing and quiet trust edges",
        paragraphs: [
          "`block.timestamp` is set by the block proposer and can drift by a few seconds — harmless for a cooldown, meaningful for an auction that closes at a second-level boundary. `block.number` is the safer ordering primitive. Treat on-chain time as approximately true, and never design money mechanics that break under a few seconds of proposer drift.",
          "Sequencing matters inside transactions too: reads within a single transaction are fixed at execution, but across transactions the current price is whatever the attacker arranged. On L2s a new edge appears — the sequencer itself can stall, so protocols consume a **sequencer uptime feed** to halt gracefully rather than act on a frozen view of the world. The L2 lesson revisits this.",
          "Zoom out and the pattern generalizes: every input a contract cannot verify itself is an oracle — the price feed, the bridge's message root, the L1 header an L2 inherits, even the calldata the frontend encodes. Auditing a protocol means listing all of them and asking, for each: who controls this, and what is the worst honest day plus the worst dishonest day?"
        ]
      }
    ],
    keyTerms: [
      { term: "oracle", definition: "Any mechanism importing off-chain claims into on-chain execution — the system's trust boundary for external truth." },
      { term: "price feed", definition: "An aggregated, on-chain price reference (e.g. a Chainlink aggregator contract) with defined decimals and update rules." },
      { term: "heartbeat", definition: "Maximum time between feed updates; the time half of the update trigger." },
      { term: "deviation threshold", definition: "The percent move that forces a feed update before the heartbeat expires." },
      { term: "TWAP", definition: "Time-weighted average price computed from AMM accumulators; manipulation-resistant but lagging." },
      { term: "staleness", definition: "The age of an oracle value relative to now — the first thing settlement-critical code must check." },
      { term: "price manipulation", definition: "Distorting a price source (often a thin pool) to profit from protocols that trust it." },
      { term: "sequencer uptime feed", definition: "An L2 oracle reporting whether the sequencer is live, letting protocols halt safely." }
    ],
    practices: [
      {
        id: "oracles-practice-1",
        title: "Read a live price feed",
        goal: "Read a real aggregated feed on Etherscan and judge whether you would settle against it.",
        steps: [
          "Open docs.chain.link and navigate to the Data Feeds section; find the ETH/USD feed on Ethereum mainnet.",
          "Copy its proxy address (0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419) and open it on etherscan.io.",
          "In the Read Contract tab, call latestRoundData and note the answer and updatedAt fields.",
          "Divide the answer by 1e8 (this feed's decimals) to get the dollar price.",
          "Compare with a price on any exchange — is the feed within its deviation tolerance?",
          "Check staleness: how old is the update in minutes? Would you settle a liquidation against it right now?"
        ]
      }
    ],
    resources: [
      { title: "Chainlink data feeds", url: "https://docs.chain.link/data-feeds", type: "docs" },
      { title: "Oracles — ethereum.org", url: "https://ethereum.org/en/developers/docs/oracles/", type: "docs" },
      { title: "Uniswap documentation", url: "https://docs.uniswap.org/", type: "docs", note: "Cumulative price and TWAP mechanics" },
      { title: "Blockchain oracle — Wikipedia", url: "https://en.wikipedia.org/wiki/Blockchain_oracle", type: "article" },
      { title: "Etherscan", url: "https://etherscan.io/", type: "tool", note: "For the feed-reading practice" }
    ],
    quiz: [
      {
        id: "oracles-q1",
        prompt: "Why can't an Ethereum contract simply look up the ETH/USD rate by itself?",
        options: [
          "It can, via block.timestamp",
          "Consensus only sees on-chain inputs; external data must be submitted by someone, making that someone a trust point",
          "It can, but only on testnets",
          "Because prices are encrypted"
        ],
        correctIndex: 1,
        explanation: "The EVM is deterministic and offline by construction: no opcode reaches the internet. Every external fact arrives via a transaction, so the submitter's trustworthiness is the design problem."
      },
      {
        id: "oracles-q2",
        prompt: "A Chainlink-style feed updates on...",
        options: [
          "Every block",
          "A heartbeat, a deviation threshold, or whichever comes first",
          "Only manual operator action",
          "A fixed 24-hour schedule"
        ],
        correctIndex: 1,
        explanation: "The dual trigger keeps feeds fresh when markets move fast and cheap when they are quiet. Between updates the on-chain value is intentionally stale — consumers must check the update time."
      },
      {
        id: "oracles-q3",
        prompt: "What makes a TWAP harder to manipulate than a spot price from the same pool?",
        options: [
          "It is encrypted",
          "Skewing the average requires sustaining a distorted pool across the entire window, which costs capital",
          "It updates every block",
          "It uses multiple reporters"
        ],
        correctIndex: 1,
        explanation: "A spot price can be moved with one trade; a TWAP must be held skewed for the whole window. The defense is economic rather than cryptographic — which is also why long windows lag real prices."
      },
      {
        id: "oracles-q4",
        prompt: "A lending market prices its collateral from its own thin 100-token pool. What is the assessment?",
        options: [
          "Fine — pool prices are always accurate",
          "Dangerous: one moderate trade moves the quote dramatically, enabling flash-loan collateral inflation",
          "Fine if the pool is older than a year",
          "Dangerous only if the token is an NFT"
        ],
        correctIndex: 1,
        explanation: "Thin-pool spot prices are the cheapest oracle to attack: in the lesson's example, 20,000 Y moved the quote 44%. Money math needs aggregated feeds, TWAPs, or caps — not its own shallow pool."
      }
    ]
  },
  {
    id: "scaling-l2s",
    level: "intermediate",
    order: 9,
    title: "Layer 2 Scaling",
    subtitle: "Rollups, blobs and the bridge problem — how Ethereum scales without giving up security.",
    minutes: 23,
    objectives: [
      "Explain why L1 throughput is structurally limited and what the trilemma says about it.",
      "Describe the rollup model and the division of labor between execution, data and settlement.",
      "Compare optimistic and ZK rollups on proofs, finality and exit windows.",
      "Summarize EIP-4844 blobs, data availability, and the risks that come with bridges and fragmentation."
    ],
    sections: [
      {
        heading: "Why L1 alone cannot scale",
        paragraphs: [
          "Every Ethereum transaction is executed and stored by every full node — that duplication *is* decentralization, and it caps throughput. Raising the gas limit buys speed with hardware requirements, which prices out home validators and concentrates the network. The **blockchain trilemma** names the bind: at the base layer, you can optimize two of decentralization, security and scale — not all three.",
          "Fee history made the constraint visceral: mints and market stress turned a queue into a paywall, with simple swaps costing tens of dollars. Those fees were not a bug in the auction — they were the market saying that this execution demand cannot live here. The design answer was not a bigger L1 but a division of labor.",
          "Ethereum's chosen answer, formalized as the rollup-centric roadmap, is to keep L1 for security and data availability and move execution to **Layer 2s** that inherit it. That bet defines this lesson: what a rollup is, how its security is proven, what blobs changed, and where the remaining risks live."
        ]
      },
      {
        heading: "The rollup idea",
        paragraphs: [
          "A rollup runs execution off-chain: an operator (the **sequencer**) orders and executes transactions, then posts compressed transaction data plus the resulting state root to an L1 contract. The L1 does not re-execute; it acts as court and notary — verifying proofs of correctness and holding the data everyone needs to reconstruct state.",
          "Posting data to L1 is the security root, not a formality. Because anyone can reconstruct the rollup's full state from L1 data, users can force exits without the operator's cooperation, and invalid state claims can be challenged or proven wrong. If data lives only on the operator's servers, none of those guarantees exist — a rollup without on-chain data is a hosting service with extra steps.",
          "What is *not* yet decentralized: most rollups run a single sequencer, which orders transactions (MEV power, uptime dependency, censorship risk) with escape hatches as the mitigation. The security architecture is layered — data, proofs, sequencer, upgrade keys — and the rest of this lesson walks each."
        ]
      },
      {
        heading: "Optimistic versus ZK rollups",
        paragraphs: [
          "Optimistic rollups publish batches and *assume* validity unless someone submits a fraud proof within the challenge window. Security needs only one honest, funded watcher with access to the data — a much weaker assumption than trusting the operator. The cost is latency: withdrawals to L1 wait out the window, and fast-exit liquidity bridges exist precisely to paper over it.",
          "ZK rollups attach a cryptographic validity proof to every batch; the L1 contract verifies the math, so a settled state is correct by construction and exits need no waiting window. The historical cost was prover expense and EVM compatibility — arbitrary EVM code is genuinely hard to prove — though the ZK-EVM spectrum has narrowed the gap dramatically.",
          "The families are converging: optimistic systems are adopting ZK-based fraud proofs for cheaper challenges, and ZK systems keep improving compatibility. Both still depend on data availability — the next section's topic — and both still have upgrade keys worth reading."
        ],
        table: {
          headers: ["Property", "Optimistic (Arbitrum, Optimism)", "ZK (zkSync, Starknet, Linea)"],
          rows: [
            ["Correctness proof", "Fraud proofs: invalid state challenged during a window", "Validity proofs: every batch ships with a proof the L1 verifies"],
            ["L1 finality for withdrawals", "Delayed (~7 day challenge window)", "Fast once the proof verifies"],
            ["Assumption", "At least one honest watcher with data access", "Proof system is sound; prover availability"],
            ["Execution compatibility", "Mature EVM equivalence", "ZK-EVM spectrum (compatibility vs proving speed)"],
            ["Cost profile", "Cheap execution; fraud machinery idle", "Prover cost per batch, falling over time"]
          ]
        }
      },
      {
        heading: "EIP-4844: blobs and data availability",
        paragraphs: [
          "Before March 2024, rollups posted transaction data as ordinary calldata, bidding in the same gas market as everything else — L2 fees spiked whenever L1 was busy. EIP-4844 (live with the Dencun upgrade) introduced **blob-carrying transactions**: a dedicated data space with its own fee market, priced independently of ordinary gas. Blobs hold roughly 125 KB each, with a target of 3 per block at launch, later raised.",
          "Blobs are pruned after about 18 days — long enough for anyone verifying the chain in that window to check them, short enough that nodes are not asked to store everything forever. Rollups that need the data archive it themselves. The effect on costs was dramatic: L2 transaction fees fell by an order of magnitude, decoupling L2 economics from L1 congestion.",
          "The full roadmap (danksharding) scales blob count much further using **data availability sampling** — nodes verify that data was published by sampling small chunks against cryptographic commitments, without downloading whole blobs. That is the bridge from today's dozens of blobs to the hundreds a rollup-dense Ethereum needs."
        ],
        callout: {
          type: "deep-dive",
          title: "Data availability is the actual bottleneck",
          body: "The data exists is weaker than anyone can get the data. A chain that keeps only hashes or state roots cannot be reconstructed, so fraud proofs and forced exits die. Blobs, erasure coding and sampling are all attempts to make published data provably retrievable at scale — the property everything else in rollup security leans on."
        }
      },
      {
        heading: "Costs in practice",
        paragraphs: [
          "An L2 fee decomposes into L1 data cost (now blob-driven), L2 execution, and operator margin. Pre-Dencun, L2 fees tracked L1 congestion almost one-to-one; after, the components decoupled and typical swaps dropped from dollars to cents. The lesson: L2 economics are now a blob-market question more than an L1 question.",
          "Cheapness changes what can be built: micropayments, games, per-trade settlement and high-frequency position management become viable when a transaction costs a cent. It also changes user behavior worth noticing — wallets that treat cheap transactions as trivial make small-but-frequent approvals a real attack surface. The approvals footgun from the token standards lesson, at scale.",
          "Be suspicious of the cheapest L2s: cost often reflects where data lives. Rollups posting blobs to Ethereum inherit its availability guarantees; **validiums** storing data off-chain are cheaper because they quietly dropped the security root that makes a rollup a rollup. L2Beat labels this per network — read it before moving size."
        ]
      },
      {
        heading: "Fragmentation and bridging",
        paragraphs: [
          "Dozens of rollups mean split liquidity, split users and split UX. Moving between rollups often routes through L1 (safe but slow — the optimistic exit window — and costly) or through third-party bridges (fast, with their own custody). Cross-rollup standards and shared sequencing aim to soften the seams; today, fragmentation is simply the price of the current design space.",
          "Bridge risk deserves its own accounting. Historical losses concentrate here: the Ronin bridge hack (2022) took roughly $625M by compromising 5 of 9 validator keys — studied in the case study library. A taxonomy: custodial or small-validator-set bridges (trust a handful of keys — the worst record), liquidity networks (fast, bounded risk), and native rollup bridges (messages through the L1 contract — safest, but subject to exit windows).",
          "Personal practice: for large amounts, prefer native bridges and wait the window; treat speed as a service you pay for with trust, not a free upgrade. And before parking funds on any L2, check its **stage** on L2Beat — the ecosystem's public scorecard for how much of the security story is actually live."
        ]
      },
      {
        heading: "Reading an L2 like an analyst",
        paragraphs: [
          "L2Beat's **stages** compress maturity: Stage 0 (training wheels) — proofs may be incomplete and the operator retains broad power; Stage 1 — proofs fully live, with a security council as a bounded exception; Stage 2 — no training wheels: the system is permissionless in the ways that matter. Marketing says secured by Ethereum; the stage says what that currently means.",
          "Bridge hygiene follows the same audit instinct: know the exit path *before* depositing, not during a crisis. Timelocked upgrades and tested escape hatches are the difference between an incident and a catastrophe; the multisig lesson from smart contracts — who holds the keys — applies verbatim at L2 scale.",
          "Zoom out: Ethereum is explicitly betting that security and data availability live on L1 while execution spreads across rollups that mature toward Stage 2. Evaluating L2s is therefore not which is fastest, but which inherits the most L1 security today, and which is on a credible path to inherit all of it."
        ],
        list: [
          "Stage and proof system status (l2beat.com/scaling/summary)",
          "Data availability: on-chain blobs or an external DA committee?",
          "Sequencer: single operator? What is the escape hatch, and has it been exercised?",
          "Upgrade keys: who signs upgrades — multisig threshold, timelock length, security council powers?",
          "Bridge: native or third-party? Which custody model holds the TVL?"
        ]
      }
    ],
    keyTerms: [
      { term: "rollup", definition: "Execution off-chain with transaction data and proofs posted to L1 for security and reconstruction." },
      { term: "sequencer", definition: "The operator that orders and executes L2 transactions before data is settled to L1." },
      { term: "fraud proof", definition: "A challenge demonstrating that an optimistic rollup's posted state was invalid." },
      { term: "validity proof", definition: "A cryptographic proof, verified by L1, that a batch's state transition was correct." },
      { term: "challenge window", definition: "The period during which optimistic-rollup states can be disputed; also the withdrawal delay." },
      { term: "blob (EIP-4844)", definition: "A dedicated, separately-priced chunk of transaction data (~125 KB) posted to L1 and pruned after ~18 days." },
      { term: "data availability", definition: "The guarantee that anyone can retrieve the data needed to reconstruct state — the security root of rollups." },
      { term: "bridge risk", definition: "The trust surface of moving value between chains; concentrated in validator-set and custodial designs." }
    ],
    practices: [
      {
        id: "scaling-l2s-practice-1",
        title: "Grade a rollup on L2Beat",
        goal: "Apply the analyst checklist to a real L2 and write a three-line risk verdict.",
        steps: [
          "Open l2beat.com/scaling/summary and pick a major rollup (e.g. Arbitrum One or OP Mainnet).",
          "Read its current Stage (0, 1 or 2) and what that stage permits the operator to do.",
          "Open the risk analysis tab: find the data availability layer (on-chain blobs vs external DA).",
          "Check the proof system section: are validity or fraud proofs live, and what can the security council do?",
          "Find the upgrade key holders: multisig signers, thresholds, timelock duration.",
          "Write a three-line verdict: what is secured by Ethereum today, what is still trusted, and what would you verify before bridging size."
        ]
      }
    ],
    resources: [
      { title: "L2Beat — rollup risk and stages", url: "https://l2beat.com/scaling/summary", type: "tool" },
      { title: "Layer 2 — ethereum.org", url: "https://ethereum.org/en/layer-2/", type: "docs" },
      { title: "Optimistic rollups — ethereum.org", url: "https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/", type: "docs" },
      { title: "Ethereum Foundation blog", url: "https://blog.ethereum.org/", type: "article", note: "Roadmap and upgrade announcements" },
      { title: "OP Stack — Optimism on GitHub", url: "https://github.com/ethereum-optimism/optimism", type: "tool" }
    ],
    quiz: [
      {
        id: "scaling-l2s-q1",
        prompt: "Why must rollup transaction data be posted to L1 (blobs count) rather than kept by the operator?",
        options: [
          "To save the operator money",
          "So anyone can reconstruct state, enabling forced exits and fraud proofs — data availability is the security root",
          "Because L1 storage is cheaper",
          "To make block explorers work"
        ],
        correctIndex: 1,
        explanation: "Reconstruction from L1 data is what lets users escape a misbehaving operator and lets watchers challenge invalid states. Off-chain data storage (validium) quietly removes those guarantees."
      },
      {
        id: "scaling-l2s-q2",
        prompt: "Why do optimistic rollups delay L1 withdrawals by roughly a week?",
        options: [
          "To collect more fees",
          "To leave time for fraud proofs against an invalid batch during the challenge window",
          "Because ZK proofs are slow",
          "To reduce blob usage"
        ],
        correctIndex: 1,
        explanation: "Optimistic security assumes validity and relies on watchers disputing within the window; withdrawals must wait it out. Validity-proof rollups finalize as soon as the proof verifies."
      },
      {
        id: "scaling-l2s-q3",
        prompt: "What did EIP-4844 change for L2 users?",
        options: [
          "Faster consensus",
          "A dedicated blob data space with its own fee market, cutting L2 data costs roughly an order of magnitude",
          "Cheaper L1 swaps",
          "Instant cross-rollup bridging"
        ],
        correctIndex: 1,
        explanation: "Blobs separate rollup data pricing from the general gas market and are pruned after about 18 days. Costs fell sharply and decoupled from L1 congestion."
      },
      {
        id: "scaling-l2s-q4",
        prompt: "Which bridge design has the worst historical security record?",
        options: [
          "Native rollup bridges through L1 contracts",
          "Small validator-set and multisig custodial bridges",
          "Burn-and-mint liquidity networks",
          "All are equivalent"
        ],
        correctIndex: 1,
        explanation: "Concentrated key sets are single points of failure — Ronin lost about $625M through 5-of-9 validator keys. Native bridges carry the rollup's own security model and are preferred for large amounts."
      }
    ]
  },
  {
    id: "daos-and-governance",
    level: "intermediate",
    order: 10,
    title: "DAOs & On-Chain Governance",
    subtitle: "Tokens as votes, timelocks as brakes, and what The DAO taught everyone.",
    minutes: 21,
    objectives: [
      "Define what a DAO is in operational terms — treasury, rules, voters — and locate on-chain versus off-chain execution.",
      "Explain how token-weighted voting, delegation and quorums work, on-chain and via Snapshot.",
      "Identify governance failure modes: plutocracy, apathy, low-quorum capture and bribery.",
      "Summarize timelocks, treasury management, and the fork precedent set by The DAO."
    ],
    sections: [
      {
        heading: "What a DAO actually is",
        paragraphs: [
          "Strip the branding and a DAO is three things: a treasury, rules for moving it, and a voter set holding decision rights. The rules may run fully on-chain — a governor contract that executes passed proposals through a timelock — or off-chain, where votes are signals and a multisig chooses to comply. The difference is not academic; it is the answer to who can actually move the money.",
          "Operational test: trace one dollar from treasury to recipient. If every step requires a signature from a defined key set following published rules, governance is real. If a private group can route around the vote, the DAO is advisory — a branding layer over a multisig. Neither is illegitimate, but they carry different risk, and users deserve to know which they are interacting with.",
          "Anatomy common to both: membership (usually tokens), a proposal lifecycle, voting, an execution layer (timelock, executor), and the treasury itself. The next sections walk that pipeline and where each stage fails."
        ]
      },
      {
        heading: "Governance tokens and delegation",
        paragraphs: [
          "Governance tokens are typically ERC-20 variants with **checkpoints**: balances recorded at each proposal's block, so voting power is fixed when a proposal starts and cannot be gamed by moving tokens mid-vote. This closes the simplest attack — borrowing votes for the duration of a single transaction and returning them after.",
          "Participation is structurally low, so most systems support **delegation**: holders assign voting weight to active participants who research and vote on their behalf. Delegates become proto-politicians — with constituencies, reputations, and (in mature DAOs) published voting rationales. The delegate layer is where accountability actually lives; token ownership alone tracks capital, not attention.",
          "**Quorum** — minimum participation for a vote to count — is the parameter that balances apathy against capture. Too high and governance stalls (large DAOs have fought over quorums for years); too low and a motivated minority plus bribes can pass anything. It is a live dial, not a solved constant."
        ]
      },
      {
        heading: "Proposals: on-chain versus off-chain",
        paragraphs: [
          "On-chain governance is executable end to end: anyone above the proposal threshold submits a set of calls (actions) with a description; token holders vote within a voting period; a passing proposal enters the timelock and then executes exactly the calls submitted. The strength: what was voted is precisely what runs — no interpretation gap.",
          "**Snapshot** voting is the popular off-chain middle ground: gasless, signature-weighted votes recorded off-chain, with results stored on IPFS. Nothing executes automatically — a multisig or governance contract acts on the outcome. That gap is the design's weakness: execution depends on signers honoring results, and it introduces delay and discretion. It is also cheap enough to vote weekly, which on-chain gas makes impractical.",
          "Mature DAOs layer both: a temperature-check post, a Snapshot vote for direction, then an on-chain proposal for executable changes. The pipeline costs days, which is the point — process is a security feature, slowing attackers and building the legitimacy that makes signers and delegates accountable."
        ]
      },
      {
        heading: "Timelocks and guardrails",
        paragraphs: [
          "A **timelock** holds a passed proposal for a fixed delay (hours to days) before execution. The window is a user-facing safety feature: anyone unhappy with a pending change — parameter updates, treasury movements, contract upgrades — can see it queued and exit or object before it lands. Governance changes become visible, not instantaneous.",
          "Guardrails cluster around the same idea: proposal thresholds (who may propose), voting periods long enough for humans to read, execution delays, and veto powers held by security councils for genuine emergencies. Each guardrail is also a power concentration — a veto right is a small group overriding a vote — so mature DAOs document exactly when these powers may fire.",
          "Limits: timelocks stop *impatient* attacks, not patient ones, and parameter drift — slowly unfavorable votes, each individually reasonable — sails through any delay. Governance quality is a repeated game; the auditor's question is not does it have a timelock, but who watches the queue."
        ]
      },
      {
        heading: "Treasuries",
        paragraphs: [
          "The treasury is the DAO's actual balance sheet: grants, contributor pay, liquidity provisioning, ecosystem incentives. Governance decides flows; an operations multisig usually executes the routine ones. Treasury size relative to protocol needs (runway) is a better health metric than raw size — a nine-figure treasury with unbounded grant authority is not safety, it is a target.",
          "Discipline patterns: diversification away from the native token (spending power should not die with the price), budgeted programs with vesting, conflict-of-interest disclosure for grantees, and public dashboards that let anyone reconcile flows against stated policy. Embezzlement and self-dealing are governance failures, not coding failures — the controls are procedural.",
          "The asymmetry to remember: code bugs get audits and post-mortems; treasury mismanagement gets press releases. Treat how funds are controlled, by whom, with what reporting as a first-class review item — the DAO version of who holds the upgrade key."
        ]
      },
      {
        heading: "Failure modes: plutocracy, apathy, capture",
        paragraphs: [
          "**Plutocracy** is structural: one token, one vote means capital concentration reproduces itself in decisions. Foundations, teams and early investors routinely hold vote shares that dwarf retail; formal decentralization can coexist with a permanent governing class. Mitigations exist — quadratic voting, bicameral designs, reputation systems — and each carries its own gaming surface.",
          "**Apathy** is the enabling condition: turnout on major votes is often in single digits. Low participation plus low quorums means a modest stake — borrowed, bribed, or simply bought — can decide outcomes. Governance attacks are the extreme case: acquire or rent just enough voting power, pass a proposal that drains the treasury through a legitimate-looking transfer, and let the timelock's visibility be your only obstacle.",
          "Counterweights are social and procedural: delegation concentrates attention, checkpoints block same-transaction vote rentals, timelocks give exit windows, and — the deepest one — **exit**: holders who disagree can sell, which disciplines a token's governance in a way corporate shares never could. Governance is security design where the threat model includes your own voters."
        ]
      },
      {
        heading: "Precedents: The DAO and the fork",
        paragraphs: [
          "The original DAO was also the original governance crisis. In 2016 it raised roughly 3.6M ETH — about 14% of all circulating supply at the time — and a reentrancy bug let an attacker drain about a third of it. The code permitted the withdrawal; code-is-law said the attacker won. The community faced a pure governance question: is an exploitative-but-valid call the law?",
          "The answer was the most consequential governance action in Ethereum's history: a hard fork moved the funds to a recovery contract, returning them to depositors. A minority refused the intervention, kept the unforked chain, and Ethereum Classic still runs today. The precedent cut both ways — Ethereum will amend at the social layer in extremis, and code is law always had a constitutional layer above it (the smart contracts lesson's framing, now with a date attached).",
          "Every norm since traces to that weekend: audits as standard practice, gradual deployment, timelocks, multisig custody of large treasuries, and the habit of asking who can intervene when code misbehaves. The DAO is studied in full in the case study library; here, take the throughline — governance is not a feature you ship, it is the system that decides what happens when everything else fails."
        ],
        callout: {
          type: "deep-dive",
          title: "The fork as constitutional precedent",
          body: "Forks are the one governance power above all contracts — they rewrite the chain itself. Ethereum has used that power rarely (The DAO) and deliberately (The Merge was planned for years). How a community treats its fork authority tells you more about its governance than any proposal page."
        }
      }
    ],
    keyTerms: [
      { term: "DAO", definition: "A shared treasury governed by token holders under published rules — executed on-chain or enforced socially." },
      { term: "governance token", definition: "A token granting voting weight, typically with block-level checkpoints to fix power at proposal time." },
      { term: "delegation", definition: "Assigning your voting weight to an active participant who votes on your behalf." },
      { term: "quorum", definition: "The minimum participation a vote needs to be valid — the dial between apathy and minority capture." },
      { term: "timelock", definition: "A mandatory delay between a passed proposal and its execution, giving users an exit window." },
      { term: "Snapshot voting", definition: "Gasless off-chain voting whose results are enforced socially by signers rather than executed automatically." },
      { term: "treasury", definition: "The DAO's assets under governance control; grants, payroll and incentives flow from it." },
      { term: "plutocracy", definition: "Governance outcomes tracking capital concentration because votes are weighted by tokens." }
    ],
    practices: [
      {
        id: "daos-and-governance-practice-1",
        title: "Follow a governance trail",
        goal: "Trace a real proposal from vote to timelock, then compare 2016's options with today's tools.",
        steps: [
          "Open etherscan.io and find a major governance contract (search Etherscan's labels or use the protocol's docs to locate its Governor).",
          "Read a recent proposal transaction: what calls does it queue if it passes?",
          "Locate the linked Timelock contract and read its delay in the Read tab.",
          "Check who holds the executor roles: multisig signers, the governance contract, or a security council.",
          "On Wikipedia, read The DAO article's timeline and compare 2016's intervention options with timelock-and-exit tools today.",
          "On dune.com, open or search a governance participation dashboard and note typical turnout for the protocol from step 1."
        ]
      }
    ],
    resources: [
      { title: "DAOs — ethereum.org", url: "https://ethereum.org/en/dao/", type: "docs" },
      { title: "The DAO — Wikipedia", url: "https://en.wikipedia.org/wiki/The_DAO", type: "article" },
      { title: "Decentralized autonomous organization — Wikipedia", url: "https://en.wikipedia.org/wiki/Decentralized_autonomous_organization", type: "article" },
      { title: "OpenZeppelin Governor contracts", url: "https://github.com/OpenZeppelin/openzeppelin-contracts", type: "tool", note: "The standard on-chain governance toolkit" },
      { title: "Dune", url: "https://dune.com/", type: "tool", note: "Governance participation dashboards" }
    ],
    quiz: [
      {
        id: "daos-and-governance-q1",
        prompt: "Why do governance tokens record balance checkpoints at the proposal block?",
        options: [
          "To save gas during voting",
          "So voting power is fixed when the proposal starts — tokens moved in mid-vote do not count",
          "To enable NFT governance",
          "To prevent proposals entirely"
        ],
        correctIndex: 1,
        explanation: "Checkpoints freeze each holder's weight at the snapshot block, closing the borrow-vote-return attack inside a transaction. Delegation and quorum are layered on top of this fixed baseline."
      },
      {
        id: "daos-and-governance-q2",
        prompt: "What is the key trust gap in Snapshot-style off-chain voting?",
        options: [
          "Votes cost gas",
          "Nothing executes automatically — signers must honor the recorded outcome, adding discretion between result and effect",
          "Votes are not counted",
          "Snapshot requires identity verification"
        ],
        correctIndex: 1,
        explanation: "Snapshot records intent cheaply; execution depends on a multisig or governor acting on it. The gap is the price of gasless voting — usually acceptable, but it must be named."
      },
      {
        id: "daos-and-governance-q3",
        prompt: "A timelock's primary purpose is to...",
        options: [
          "Increase protocol revenue",
          "Give users a visible window between a proposal passing and taking effect, so they can exit or object",
          "Slow down the blockchain",
          "Prevent any proposal from passing"
        ],
        correctIndex: 1,
        explanation: "The delay makes governance changes observable before they land — queued calls are public and exit remains possible. It stops impatient attacks and creates accountability, though not patient parameter drift."
      },
      {
        id: "daos-and-governance-q4",
        prompt: "The DAO fork of 2016 established which precedent?",
        options: [
          "That hacks are always refunded automatically",
          "That Ethereum's social layer can, in extremis, amend what the code did — splitting Ethereum from Ethereum Classic",
          "That reentrancy is impossible today",
          "That DAOs cannot hold treasuries"
        ],
        correctIndex: 1,
        explanation: "The community hard-forked to return the drained funds; dissenters continued the unforked chain as ETC. It is the defining evidence that consensus — not code alone — is the deepest layer of law on Ethereum."
      }
    ]
  },
  {
    id: "on-chain-analysis",
    level: "intermediate",
    order: 11,
    title: "Reading the Chain",
    subtitle: "Explorers, labels, SQL dashboards — how to decode transactions and when the data lies.",
    minutes: 20,
    objectives: [
      "Decode a transaction on a block explorer: fields, calldata, decoded functions, logs and internal transfers.",
      "Use labels and entity mapping to attribute addresses, and know the limits.",
      "Reconstruct fund flows and recognize wash trading patterns.",
      "Explain how Dune-style SQL dashboards work over raw tables — and the ways on-chain analytics mislead."
    ],
    sections: [
      {
        heading: "Everything is a receipt",
        paragraphs: [
          "A blockchain is the most auditable database ever deployed: every transaction, every event log, every balance change, forever, to anyone. There are no private APIs between you and the data — explorers and analytics just index what is already public. Pseudonymity (addresses, not names) is the only veil, and it is thinner than newcomers assume.",
          "The unit of analysis is the transaction: from, to, value, calldata, gas, plus the logs and internal value moves it produced. Most mysterious transactions resolve into one of a handful of shapes: a call to a verified contract's function, a token transfer, a contract deployment, or a multisig confirmation. The skill is pattern recognition plus a willingness to read fields.",
          "This lesson builds the reading habit that the case studies use repeatedly. The payoff is epistemic: when a dashboard, a tweet, or a protocol's own frontend claims something, you can go check the receipts yourself."
        ]
      },
      {
        heading: "Explorer deep-dive: decoding a transaction",
        paragraphs: [
          "Open any transaction on Etherscan and read it like a form. Status (success or fail), block and timestamp, from and to, value, gas limit versus used, and the fee paid (base fee plus tip — the beginner track's EIP-1559 lesson, now visible). The Input Data field is where intent lives: calldata is a 4-byte function selector followed by ABI-encoded arguments.",
          "If the receiving contract is verified, the Decoded tab names the method and arguments — a Uniswap swap shows `exactInputSingle` with pool, recipient, amount, minimum output and deadline; note that the min-out and deadline fields are exactly the slippage guards from the AMM lesson, visible in the raw call. For unverified contracts you can still decode the selector against public signatures, or fall back to reading the emitted events.",
          "Three tabs complete the picture. **Logs**: every event the execution emitted (topics and data). **Internal Txns**: ether moved by contracts during execution — catches transfers the top-level value field misses. **Token Transfers (ERC-20/721)**: the token flows, which for DeFi transactions are usually the real story."
        ],
        callout: {
          type: "tip",
          title: "Read the net effect, not the narrative",
          body: "State-change and balance-delta views show what each address actually gained or lost across the transaction. Multi-hop strategies (swap, borrow, redeposit) look complicated in calldata and trivial in balance deltas — start from deltas when the goal is who profited."
        }
      },
      {
        heading: "Labels and entities",
        paragraphs: [
          "Explorers maintain **label** databases: exchange hot wallets, protocol contracts, bridges, mixers, known exploiters, NFT collections. Labels come from public disclosures, on-chain patterns and crowdsourcing, and they are the difference between a raw hex address and Binance 14 — the vocabulary that makes flows readable at all.",
          "Attribution beyond labels uses **clustering**: addresses funded from the same source, change-address patterns, and synchronized timing get grouped into probable entities. This is probabilistic inference, industrialized by analytics firms — good enough to support sanctions actions and exploit post-mortems, and still inference, not proof.",
          "Limits to respect: labels lag reality, can be wrong, and privacy tools (mixers, privacy pools, fresh addresses) exist to break links. Treat every label as a published claim, verify surprising ones, and never build an accusation on a single unverified tag."
        ]
      },
      {
        heading: "Tracking flows",
        paragraphs: [
          "Flow tracing is hop-by-hop reading: start at the address or transaction of interest, follow token transfers, note where assets convert (a DEX swap appears as paired transfers), where they cross domains (a bridge), and where they rest. The terminal hop is usually the informative one — deposits to exchange hot wallets signal intent to cash out.",
          "Exploit post-mortems follow exactly this template: attacker contract, swap of stolen assets to ETH or stables, partial mixer deposits, staggered withdrawals, exchange deposits. Each hop is visible; mixers add delay and fragmentation, not invisibility. Reading two or three published incident analyses teaches the method faster than any tutorial.",
          "Tooling tips: export CSVs for hop tables, cross-check between explorers (decoding quality differs), and correlate timestamps across chains for bridge crossings. For large incidents, the researcher community publishes the full trace — start from those and verify the hops yourself."
        ]
      },
      {
        heading: "Dashboards: SQL over the chain",
        paragraphs: [
          "Dune materializes raw chain data into SQL-queryable tables — transactions, logs, traces, plus decoded tables per project where every event becomes columns. Analysts write queries, save them, and compose **dashboards** that anyone can fork and extend. It is the ecosystem's public data science: DEX volumes, liquidation counts, treasury flows, holder distributions.",
          "The concept maps directly onto this course's earlier lessons: a query over the logs table filtered by an event signature is the indexer idea from dApp architecture, exposed as SQL. If you can read a Swap event's topics on Etherscan, you can write the WHERE clause that selects it.",
          "Skill path: find a popular dashboard on a topic you know — say, staking flows — read its queries line by line, fork it, change one filter, and observe the delta. The lesson generalizes: every chart is a query, every query has assumptions, and what exactly did it count is always the first question."
        ]
      },
      {
        heading: "Whale watching and wash trading",
        paragraphs: [
          "**Whales** — addresses holding large positions — move markets through their flows. Standard signals: stablecoin inflows to exchanges (dry powder moving in), large outflows (accumulation or custody moves), dormant old wallets waking. All of it is legible because every transfer is public — and all of it is heuristic, because whales hedge, split custody across addresses, and sometimes want to be seen.",
          "**Wash trading** is manufacturing volume: the same controller trading with itself to inflate metrics — marketplace rankings, token volume stats, airdrop eligibility. The patterns are readable: round-trip transfers returning to origin, buyer-seller overlap across many addresses funded from one source, volume spikes with flat prices, NFTs sold back and forth between two wallets at rising prices.",
          "Detection heuristics worth internalizing: volume per unique trader (high volume, few traders — suspect), circular flow analysis (value returning to origin within n hops), funding-source clustering (many independent wallets, one faucet). None is proof; together they turn impressive volume into a testable claim — and frequently into a debunk."
        ]
      },
      {
        heading: "When on-chain data lies",
        paragraphs: [
          "The chain is honest; summaries of it are authored. Label errors misattribute entities; fake-verified contracts ship plausible-looking decoded ABIs; lightweight APIs drop internal transactions; dashboards inherit any upstream error. A number being on-chain means only that somewhere a query produced it — the query's assumptions are the actual claim.",
          "Semantic traps recur: users counted as addresses (one human, many wallets — or many sybils, one airdrop farmer), volume including wash trades, TVL double counting (the DeFi primitives lesson's critique), settled transactions that later reorganized on other chains. Every metric needs its counting rules read before its headline is believed.",
          "The discipline: triangulate (explorer raw view plus an independent dashboard plus protocol docs), check what block and timestamp a claim covers, and when stakes are high, recompute the number yourself from raw tables. On-chain data cannot be falsified by the chain — it can absolutely be misrepresented by a summary. That gap is the entire profession."
        ],
        callout: {
          type: "tip",
          title: "Verify at the source, cite the query",
          body: "When a claim matters — a security assessment, an investment thesis, a governance vote — open the underlying query or the raw transaction, not the chart. If you share a figure, share the query that produced it. Reproducibility is the whole advantage of public ledgers; use it."
        }
      }
    ],
    keyTerms: [
      { term: "block explorer", definition: "A search engine for chain data — transactions, addresses, contracts, logs — with decoded views." },
      { term: "calldata", definition: "The function selector plus ABI-encoded arguments in a transaction's input data; the raw form of intent." },
      { term: "internal transaction", definition: "Value moved by contracts during execution, visible only in traces — not as top-level transactions." },
      { term: "entity label", definition: "A published attribution attached to an address (exchange, bridge, mixer); a claim, not a proof." },
      { term: "address clustering", definition: "Heuristic grouping of addresses into probable entities via funding patterns and timing." },
      { term: "wash trading", definition: "Manufactured volume from same-controller trades on both sides of a market." },
      { term: "sybil", definition: "Many fake identities (addresses) controlled by one actor to farm rewards or distort metrics." },
      { term: "dashboard", definition: "A saved set of SQL queries over chain data (Dune-style) — reproducible, forkable, and assumption-laden." }
    ],
    practices: [
      {
        id: "on-chain-analysis-practice-1",
        title: "Decode a real transaction end to end",
        goal: "Go from raw calldata to a one-sentence story of who swapped what, at what price, with what guards.",
        steps: [
          "On etherscan.io, open a recent swap through a major router (pick any from a top token's DEX transfers).",
          "Read the header fields: status, value, gas used, fee — and confirm the base-fee-plus-tip split.",
          "Open the Decoded Input tab: identify the method, the minimum output parameter, and the deadline.",
          "Open the Logs tab: find the pool's Swap event and compute the effective execution price from its amounts.",
          "Open Internal Txns and Token Transfers: list every asset that moved and where it ended.",
          "Write the one-sentence story of the transaction: who swapped what, at what effective price, with what slippage guard."
        ]
      },
      {
        id: "on-chain-analysis-practice-2",
        title: "Fork a Dune dashboard",
        goal: "Experience SQL-over-the-chain and discover a metric's hidden counting assumptions.",
        steps: [
          "Create a free account on dune.com and open a popular dashboard on a topic from this course (DEX volume, staking flows, lending liquidations).",
          "Open the underlying queries and read them line by line: which tables, which filters, which joins?",
          "Fork one query and change a single filter — a date range, a token, an event signature.",
          "Run it and compare against the original — did the headline number move? Why?",
          "Write down the counting assumptions you discovered that the dashboard's title never mentions."
        ]
      }
    ],
    resources: [
      { title: "Block explorers — ethereum.org", url: "https://ethereum.org/en/developers/docs/data-and-analytics/block-explorers/", type: "docs" },
      { title: "Etherscan", url: "https://etherscan.io/", type: "tool" },
      { title: "Dune", url: "https://dune.com/", type: "tool", note: "SQL over raw chain data" },
      { title: "Blockchain — Wikipedia", url: "https://en.wikipedia.org/wiki/Blockchain", type: "article" }
    ],
    quiz: [
      {
        id: "on-chain-analysis-q1",
        prompt: "Where on an explorer do you find ether that a contract moved during execution?",
        options: [
          "The top-level value field",
          "The Internal Txns tab",
          "The contract's source code only",
          "The event logs"
        ],
        correctIndex: 1,
        explanation: "Value transferred by contracts mid-execution appears in traces, not as independent transactions. The top-level value field covers only what the original sender attached."
      },
      {
        id: "on-chain-analysis-q2",
        prompt: "What makes the Decoded view of a transaction possible on Etherscan?",
        options: [
          "The chain stores method names",
          "The contract's ABI is published and verified, letting the explorer map calldata to names and arguments",
          "Consensus verifies decoding",
          "Every function is required to emit a string"
        ],
        correctIndex: 1,
        explanation: "Calldata is just bytes; a verified ABI gives the bytes meaning. Unverified contracts still expose the 4-byte selector, and events can substitute where ABIs are missing."
      },
      {
        id: "on-chain-analysis-q3",
        prompt: "Which pattern most strongly suggests wash trading?",
        options: [
          "High volume concentrated among few addresses with round-trip flows returning to origin",
          "Volume spread across thousands of unique addresses",
          "Volume declining over time",
          "Volume concentrated during US trading hours"
        ],
        correctIndex: 0,
        explanation: "Manufactured volume shows low trader diversity and circular value flows, often from a single funding source. Legitimate volume is diffuse, and its price impact is usually visible."
      },
      {
        id: "on-chain-analysis-q4",
        prompt: "A dashboard reports one million users for a protocol. What is the right first question?",
        options: [
          "Nothing — on-chain data is always accurate",
          "How does the query count users — addresses or humans, and how does it treat sybils?",
          "Is the dashboard popular?",
          "Which chain is it on?"
        ],
        correctIndex: 1,
        explanation: "Address counts conflate wallets, humans and sybil clusters. Every on-chain metric inherits its query's counting rules — read the assumptions before the headline."
      }
    ]
  }
]

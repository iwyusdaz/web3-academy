import type { Lesson } from '../types'

export const beginnerLessons: Lesson[] = [
  {
    id: "what-is-web3",
    level: "beginner",
    order: 1,
    title: "From Web1 to Web3",
    subtitle: "How the web went from read-only to read-write — and why *owning* is the next, harder step.",
    minutes: 14,
    objectives: [
      "Describe the Web1 to Web2 to Web3 shift in terms of what users can read, write, and own.",
      "Explain what ownership means in software, and why a row in a company's database is not property.",
      "Place real systems on the decentralization spectrum instead of treating it as a binary label.",
      "List the honest trade-offs of Web3 today — complexity, scams, cost, and UX — without the hype."
    ],
    sections: [
      {
        heading: "Three eras, one question",
        paragraphs: [
          "The web began as a library. In the 1990s, websites were static pages: you opened a browser, read a document, and left. Publishing required a server, a domain, and technical skill, so most people were readers. The web was open at the protocol level, but *control* of content lived entirely with whoever hosted it. Nothing you did online left a durable trace that you controlled.",
          "The second era, Web2, turned readers into publishers. Social networks, video platforms, and app stores let anyone post, comment, and build an audience for free. The catch is where the records live: your profile, your followers, your uploads, and your purchase history all sit in databases owned by a company. You access them through an account that can be suspended, an algorithm that can bury you, and terms of service that can change.",
          "Web3 is the third proposal: read, write, and **own**. Records live on shared ledgers maintained by many independent operators instead of one company, and you control your assets with cryptographic keys rather than a login. That is the core idea. Whether it is better depends on what you need: Web3 trades convenience and support for custody and verifiability, and this course keeps score of both sides honestly."
        ]
      },
      {
        heading: "What ownership actually means",
        paragraphs: [
          "Start with what you already 'own' digitally. The skin in a game, the playlist on a streaming service, the followers on a social account — all of them are entries in a company's database, granted to you under terms the company can revise. Deletion, suspension, or an acquired-and-shut-down service can erase years of accumulation overnight. Real property, by contrast, carries durable rights: the right to use it, to transfer it to someone else, and to exclude others from taking it.",
          "A blockchain entry controlled by your private key is structurally different. Nobody hosts it *for* you; the record is replicated across thousands of independent computers, and the only way to move it is a signature from your key. There is no company between you and the asset. That is the closest thing digital systems have produced to bearer property: an asset that belongs to whoever holds the proof.",
          "This property comes with the flip side built in: **no safety net**. If your key is lost or stolen, there is no support desk, no fraud department, no reversal. Web3 does not remove the risks of ownership — it removes the intermediaries who used to absorb them. Much of this track exists to make you competent at that responsibility before you hold anything valuable."
        ]
      },
      {
        heading: "Decentralization is a spectrum",
        paragraphs: [
          "Calling a system 'decentralized' or not hides more than it reveals. Decentralization is a property of specific layers, and a real system can be decentralized in one layer and centralized in another. When you evaluate any Web3 project, ask four separate questions: who runs the network, who holds the data, who can change the rules, and who serves the interface you use.",
          "Ethereum, for example, has a highly decentralized network and rules layer, but the websites people use to interact with it are ordinary centralized servers. Bitcoin is more rigid by design, and its supporters count that as a feature. Treat every claim of decentralization as a question about specific layers, not a label."
        ],
        table: {
          headers: ["Layer", "Centralized version", "Decentralized version"],
          rows: [
            ["Network (who processes records)", "One company's servers", "Thousands of independent nodes running the same rules"],
            ["Data (where records live)", "Private databases you cannot audit", "A shared ledger anyone can verify"],
            ["Rules (who can change them)", "Executive decision, updated silently", "Protocol upgrades needing broad public agreement"],
            ["Interface (what you use)", "The company's app or website", "Your own wallet plus many interchangeable frontends"]
          ]
        }
      },
      {
        heading: "What Web3 is not",
        paragraphs: [
          "A lot of nonsense travels under the Web3 name, and clearing it out first makes everything else easier to learn. Here are the five most common misconceptions, each paired with the honest correction.",
          "What remains after stripping the hype is a modest but real claim: it is now possible to keep certain records and hold certain assets in a way that no single party can silently alter or take away. Whether that property is worth the costs for your situation is exactly the judgment this course trains."
        ],
        list: [
          "**Web3 is one technology.** It is a loose family of ideas — shared ledgers, cryptographic keys, open standards — implemented differently by hundreds of unrelated networks.",
          "**Decentralized means better.** It means *differently governed*. A decentralized system can be slower, more expensive, and harder to fix when something goes wrong.",
          "**It is anonymous.** Most public blockchains are pseudonymous: activity is permanently public and can often be linked to identity through exchanges or analysis.",
          "**Early adoption means easy money.** Price speculation dominates attention, but the technology's actual claims are about record-keeping and asset control, not returns.",
          "**It will replace the existing web.** The realistic uses are narrower: assets, payments, and provenance, in places where verifiability matters more than convenience."
        ]
      },
      {
        heading: "The honest trade-offs",
        paragraphs: [
          "**Complexity is the first cost.** You will manage networks, gas fees, approvals, and addresses that differ by a single character. Mistakes are permanent. The Web2 model — click, forget, contact support — does not apply; adopting the new one takes deliberate practice, which is what each lesson's exercise is for.",
          "**Scams are the second cost, and they are severe.** Irreversible transfers plus self-custody make holders profitable targets, and an entire industry of phishing sites, fake support agents, and drainer tooling exists to exploit beginners. Losses run into billions per year. Lesson 9 covers defense; adopt the default posture now: treat every unexpected message, airdrop, and signature request as hostile until proven otherwise.",
          "**Cost and user experience are the third and fourth.** Transactions cost money, fees spike when the network is busy, and the interface standards — seed phrases, twelve-word backups, approvals — are crude compared to the password-reset world you are used to. Layer-2 networks cut costs substantially but add concepts to learn. Web3 today is a power tool, not a consumer appliance: use it where its properties matter, not for everything."
        ]
      },
      {
        heading: "How this track teaches it",
        paragraphs: [
          "This beginner track is a straight line from zero to competence: ten lessons in three modules, each pairing explanation with a hands-on practice using real, free tools — block explorers, faucets, and testnets.",
          "Every practice runs on test networks with worthless currency, and the rule holds throughout: **testnet only until you know what you are doing**. The habits that protect testnet funds are the same ones that protect real funds later."
        ],
        list: [
          "**Module 1 — Foundations:** how blockchains and Ethereum actually work (lessons 1-3).",
          "**Module 2 — Keys and first dApp:** wallets, transactions, gas, and a full testnet session (lessons 4-6).",
          "**Module 3 — Tokens, safety, ecosystem:** tokens, NFTs, stablecoins, defense, and the map ahead (lessons 7-10)."
        ],
        callout: {
          type: "tip",
          title: "The question to keep asking",
          body: "For every system you meet in this course, ask: who can change this record, who can take this asset away from me, and how would I know? Most Web3 debates, product choices, and scams become clear once you answer it precisely."
        }
      }
    ],
    keyTerms: [
      { term: "Web1", definition: "The early read-only web of static pages served to passive readers, roughly 1991 to 2004." },
      { term: "Web2", definition: "The read-write era dominated by platforms that host user content in company-owned databases, roughly 2004 to present." },
      { term: "Web3", definition: "A family of technologies where records live on shared ledgers and users control assets with cryptographic keys instead of platform logins." },
      { term: "Platform risk", definition: "The possibility that a service provider changes terms, censors, or deletes your data and accounts unilaterally." },
      { term: "Decentralization", definition: "Distribution of control across many independent operators; a per-layer spectrum rather than a binary label." },
      { term: "Custody", definition: "Who actually controls an asset's key: you (self-custody) or a third party holding it on your behalf." }
    ],
    practices: [
      {
        id: "what-is-web3-p1",
        title: "Take a guided tour of the primary sources",
        goal: "Ground the vocabulary in Ethereum's own documentation before trusting any summary — including this one.",
        steps: [
          "Open https://ethereum.org/en/what-is-ethereum/ and read the introduction. Note how it defines Ethereum in one sentence.",
          "Open https://ethereum.org/en/web3/ and read the explainer on Web3.",
          "Write down two claims from these pages that sound like hype to you, and two that are concrete and testable.",
          "For each concrete claim, write one sentence describing how you could verify it yourself later in this course.",
          "Skim the Wikipedia article on Web3 (https://en.wikipedia.org/wiki/Web3) and note one criticism of the concept. Knowing the skeptical view makes you a better learner."
        ],
        caution: "Reading only — no wallet install yet, and nothing here requires real funds."
      }
    ],
    resources: [
      { title: "What is Web3?", url: "https://ethereum.org/en/web3/", type: "article", note: "The Ethereum Foundation's own framing of the term." },
      { title: "What is Ethereum?", url: "https://ethereum.org/en/what-is-ethereum/", type: "docs", note: "The starting point of the official documentation." },
      { title: "Web3 — Wikipedia", url: "https://en.wikipedia.org/wiki/Web3", type: "article", note: "Includes criticisms; read the skeptics too." },
      { title: "Ethereum Foundation Blog", url: "https://blog.ethereum.org/", type: "article", note: "Primary-source announcements, including protocol upgrades." }
    ],
    quiz: [
      {
        id: "what-is-web3-q1",
        prompt: "What is the defining difference between Web2 platforms and Web3 systems?",
        options: [
          "Web3 is faster and cheaper than Web2 platforms.",
          "In Web3, records and assets are controlled by cryptographic keys on shared ledgers rather than stored in a company's database.",
          "Web3 removes the need for any servers or websites.",
          "Web2 platforms cannot process payments."
        ],
        correctIndex: 1,
        explanation: "The structural shift is where records live and who controls them: shared ledgers and keys instead of company databases and logins. Speed and cost are usually worse on-chain, not better."
      },
      {
        id: "what-is-web3-q2",
        prompt: "A game announces it is shutting down and deleting all player inventories. From this lesson's perspective, what is this an example of?",
        options: [
          "Platform risk — the records lived in the company's database under revocable terms.",
          "A blockchain failure.",
          "A hard fork.",
          "A depeg event."
        ],
        correctIndex: 0,
        explanation: "The inventory was an entry in a company database, accessible only through an account governed by terms the company sets. That dependency is exactly what platform risk names."
      },
      {
        id: "what-is-web3-q3",
        prompt: "Which statement about decentralization is accurate?",
        options: [
          "A system is either fully decentralized or fully centralized.",
          "Decentralized systems are always more secure than centralized ones.",
          "Different layers of a system can be decentralized to different degrees.",
          "Decentralization means no one operates any servers."
        ],
        correctIndex: 2,
        explanation: "Decentralization is a per-layer property: a network can be run by thousands of nodes while its interface is one company's website. Evaluating layers separately is the analytical habit this course builds."
      },
      {
        id: "what-is-web3-q4",
        prompt: "Which claim about Web3 should you treat as a red flag rather than a fact?",
        options: [
          "Records on a public blockchain can be verified by anyone.",
          "You can hold certain assets without a company intermediary.",
          "Getting in early guarantees easy profits.",
          "Mistakes on-chain can be permanent."
        ],
        correctIndex: 2,
        explanation: "The first, second, and fourth are honest descriptions of the technology's properties — including its costs. Guaranteed profit claims are marketing for speculation, not properties of any protocol."
      }
    ]
  }
,
  {
    id: "blockchain-basics",
    level: "beginner",
    order: 2,
    title: "How a Blockchain Works",
    subtitle: "Hashes, blocks, and why changing history is computationally obvious to everyone.",
    minutes: 15,
    objectives: [
      "Describe what a cryptographic hash does and which of its properties blockchains depend on.",
      "Explain how blocks link to their parents and why editing old history is detectable.",
      "Summarize how thousands of independent nodes agree on one chain using proof of work or proof of stake.",
      "Explain immutability as a trade-off and describe what forks are and why they happen."
    ],
    sections: [
      {
        heading: "A hash is a fingerprint",
        paragraphs: [
          "A cryptographic hash function takes any input — a file, a sentence, a transaction — and produces a fixed-length string that acts as a fingerprint. SHA-256, the function Bitcoin uses, always outputs 64 hexadecimal characters whether the input is one word or a whole movie. The output is deterministic: the same input always yields the same fingerprint.",
          "Three properties make hashes the backbone of blockchains. First, they are **one-way**: given a fingerprint, there is no practical method to recover the input. Second, they exhibit the **avalanche effect**: flipping a single bit of input changes roughly half of the output characters, so any tampering is unmistakable. Third, collisions — two inputs with the same fingerprint — are astronomically improbable for well-designed functions.",
          "Blockchains use hashes everywhere: each block's identity is the hash of its header, each transaction has a hash that serves as its ID, and Ethereum addresses are derived from hashes of public keys. Once the fingerprint metaphor clicks, the rest of the architecture is mostly hashes pointing at other hashes."
        ],
        code: {
          lang: "shell",
          code: "sha256(\"hello\")\n# 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824\n\n# Change one letter and every character of the fingerprint changes.\n# You cannot run a fingerprint backwards to recover the input.",
          caption: "The properties that matter: deterministic, one-way, and avalanche-sensitive."
        }
      },
      {
        heading: "Blocks and the chain",
        paragraphs: [
          "A blockchain does not record transactions one by one. They accumulate in a waiting area (the mempool — more in lesson 5) and are batched into **blocks**. Each block contains a header — structured metadata about the block — plus the list of transactions it commits. On Ethereum a new block is proposed roughly every 12 seconds; on Bitcoin, about every 10 minutes.",
          "The linking mechanism is a single field: every block header contains the hash of its **parent block's** header. Block 19,000,001 commits to the hash of block 19,000,000, which commits to the one before it, all the way back to the genesis block. The chain is not a metaphor — it is literally a linked list in which the links are tamper-evident hashes.",
          "Now attempt to cheat: modify one old transaction in block 18,000,000. The block's hash changes, so every later block's stored parent hash no longer matches, and the breakage cascades down the entire chain. Every full node on the network can see immediately that the history is invalid. To make the forgery stick, you would have to redo the work or stake behind a replacement chain faster than the honest network extends the real one."
        ],
        callout: {
          type: "deep-dive",
          title: "Merkle roots: committing to thousands of transactions at once",
          body: "A block header does not list every transaction hash directly. The transactions are arranged in a Merkle tree and the header stores only the **Merkle root** — one hash that commits to all of them. Change any single transaction and the root changes. It also lets lightweight clients verify that a specific transaction is in a block without downloading the whole block."
        }
      },
      {
        heading: "Nodes: thousands of copies of the truth",
        paragraphs: [
          "A **full node** is a computer running blockchain software that downloads every block, checks every transaction against the network's rules, and keeps its own copy of the ledger. Ethereum has many thousands of such nodes operated by unrelated individuals, companies, and institutions around the world. No node is special; the software treats every peer's claims with equal suspicion.",
          "This is the structural answer to the question 'who keeps the records?' — everyone who cares to, independently. If one operator disappears, lies, or gets coerced, the network does not care: validity is defined by the rules the software enforces, not by any operator's word. Running your own node is the strongest way to verify the chain without trusting anyone else's copy.",
          "Most users do not run nodes; they query someone else's through an **RPC provider**, which lesson 10 covers as infrastructure. That is a reasonable trade for reading, but know what is being trusted: the provider's copy of the ledger and its honest reporting."
        ]
      },
      {
        heading: "Consensus at a glance",
        paragraphs: [
          "The hard problem is agreement. In an open network where anyone can join anonymously and some participants are actively malicious, how do thousands of strangers agree on exactly one history? This is the consensus problem, and different chains solve it differently — but every working solution makes cheating expensive rather than trusting participants to be honest.",
          "The two dominant designs price dishonesty differently, as the table shows. The details differ, but the shared principle is identical: honesty must be the economically rational strategy. Deep mechanics are an advanced-track topic; knowing *why* agreement is expensive matters more than every step of how."
        ],
        table: {
          headers: ["", "Proof of Work (Bitcoin)", "Proof of Stake (Ethereum since 2022)"],
          rows: [
            ["Who proposes blocks", "Miners racing to solve a hash puzzle", "Validators chosen in proportion to staked ETH"],
            ["What secures the chain", "Energy and hardware cost of redoing past work", "Value staked; provable cheating gets slashed"],
            ["Cost of attack", "Must out-compute the entire honest network", "Must acquire and risk a large share of all staked ETH"],
            ["Main criticism", "Enormous energy consumption", "Wealth concentration; newer and less battle-tested"]
          ]
        },
        callout: {
          type: "deep-dive",
          title: "The Merge: changing the engine mid-flight",
          body: "In September 2022, Ethereum switched from proof of work to proof of stake while running — no pause, no reset, one network replacing its consensus engine live. The event, called **The Merge**, is a coordination achievement: thousands of independent operators upgraded on the same schedule, and it worked. Deep mechanics are an advanced-track topic; understand that agreement is manufactured by making attacks expensive, not by trusting participants."
        }
      },
      {
        heading: "Immutability is a trade-off",
        paragraphs: [
          "Immutability means settled history effectively cannot be rewritten — not because anyone forbids it, but because the hash-linked structure makes any rewrite obvious and the economics make it prohibitive. The upside is credible records: an audit trail no party can quietly edit, which is genuinely valuable for payments, provenance, and agreements.",
          "The downside is symmetrical. Send funds to a wrong address: gone. A smart contract ships with a bug: it lives on-chain forever unless the code itself includes an upgrade path. There is no undo button and no customer service. Immutability is not an unqualified virtue — it is a trade of flexibility for credibility, and you should notice every time a system makes that trade on your behalf."
        ]
      },
      {
        heading: "Forks: when one chain becomes two",
        paragraphs: [
          "Two distinct things are called forks. A **temporary fork** is routine: two valid blocks appear near-simultaneously, the network briefly follows both branches, and the software converges on whichever branch grows first. This is normal operation, not a crisis.",
          "A **deliberate fork** is a protocol upgrade: the rules change at an agreed point, and clients that updated follow the new chain. If the change is backward-compatible it is a soft fork; if it invalidates old rules it is a hard fork, and un-updated software ends up on a different network.",
          "When the community disagrees deeply enough, a contentious hard fork splits the chain permanently, and each side keeps its own history and currency. The canonical example: after The DAO hack in 2016, Ethereum forked to reverse the theft, while a minority kept the unforked chain alive as **Ethereum Classic**. The technical chain is one history among possible ones — which one has value is ultimately decided by people, exchanges, and applications choosing to follow it."
        ]
      }
    ],
    keyTerms: [
      { term: "Hash", definition: "A one-way function mapping any input to a fixed-length fingerprint; the same input always yields the same output, and any change yields a completely different one." },
      { term: "Block", definition: "A batch of transactions committed together, identified by the hash of its header." },
      { term: "Parent hash", definition: "The field in each block header that stores its predecessor's hash, forming the tamper-evident chain." },
      { term: "Full node", definition: "Software that downloads and independently verifies every block and transaction against the network's rules." },
      { term: "Consensus", definition: "The process by which independent nodes agree on a single valid history, usually by making attacks economically expensive." },
      { term: "Proof of stake", definition: "Ethereum's consensus design, in which validators stake ETH and are penalized (slashed) for provable misbehavior." },
      { term: "Fork", definition: "A divergence in the chain — temporary and routine, a deliberate rule change, or a permanent community split." }
    ],
    practices: [
      {
        id: "blockchain-basics-p1",
        title: "Read a live block on Etherscan",
        goal: "Turn the vocabulary of this lesson into concrete fields you can find and interpret yourself.",
        steps: [
          "Open https://etherscan.io and note the latest block number shown on the homepage.",
          "Click the block number to open its detail page.",
          "Find the Parent Hash field and click it — you are now on the previous block. This is the linked chain, made visible.",
          "Go back and find the block's Transactions count, Timestamp, and its own hash.",
          "Refresh after roughly 15 seconds and confirm a new block has appeared — Ethereum proposes one about every 12 seconds.",
          "Open any transaction inside the block and locate its Status, Value, and Transaction Fee fields."
        ],
        caution: "Read-only exploration. You are not connecting a wallet or signing anything."
      }
    ],
    resources: [
      { title: "Blocks — Ethereum docs", url: "https://ethereum.org/en/developers/docs/blocks/", type: "docs", note: "Block structure and headers, straight from the official docs." },
      { title: "Consensus mechanisms — Ethereum docs", url: "https://ethereum.org/en/developers/docs/consensus-mechanisms/", type: "docs", note: "Proof of work and proof of stake compared." },
      { title: "Blockchain — Wikipedia", url: "https://en.wikipedia.org/wiki/Blockchain", type: "article", note: "History and broader context beyond Ethereum." },
      { title: "Etherscan", url: "https://etherscan.io", type: "tool", note: "The main Ethereum block explorer; your primary inspection tool throughout this course." }
    ],
    quiz: [
      {
        id: "blockchain-basics-q1",
        prompt: "You change one letter inside a transaction that was included in a block two weeks ago. What happens?",
        options: [
          "Nothing — old blocks are archived and are no longer checked.",
          "The block's hash changes, invalidating every later block that links to it.",
          "The network automatically corrects your copy back to the original.",
          "The transaction is silently removed and the rest of the chain is unaffected."
        ],
        correctIndex: 1,
        explanation: "Because each header commits to its parent's hash, one edit cascades: the edited block's hash no longer matches what every descendant recorded. All full nodes detect the tampering immediately."
      },
      {
        id: "blockchain-basics-q2",
        prompt: "What is the core idea that both proof of work and proof of stake share?",
        options: [
          "A trusted committee approves each block.",
          "Making attacks economically expensive, so honesty is the rational strategy.",
          "Encrypting transactions so validators cannot read them.",
          "Requiring government-issued identity for all participants."
        ],
        correctIndex: 1,
        explanation: "Proof of work makes rewriting history cost energy and hardware; proof of stake makes it cost staked value that can be slashed. Neither relies on trusting participants — both price the misbehavior."
      },
      {
        id: "blockchain-basics-q3",
        prompt: "A full node differs from a casual wallet user because it...",
        options: [
          "Earns block rewards for its operator.",
          "Downloads and verifies the entire chain against the rules itself.",
          "Can reverse transactions in emergencies.",
          "Holds everyone's private keys."
        ],
        correctIndex: 1,
        explanation: "A full node independently checks every block and transaction, trusting no one's copy. Wallets typically ask an RPC provider for answers instead — cheaper, but a different trust model."
      },
      {
        id: "blockchain-basics-q4",
        prompt: "After the 2016 DAO hack, Ethereum forked to reverse the theft. What does that episode demonstrate?",
        options: [
          "Blockchains are actually easy to rewrite.",
          "Code is law, always and without exception.",
          "Technical history is ultimately governed by social consensus about which chain matters.",
          "Proof of stake prevents smart contract hacks."
        ],
        correctIndex: 2,
        explanation: "The fork was possible because the community coordinated, and its legitimacy came from exchanges, applications, and users following the new chain. Rules can change through broad agreement — which is exactly why immutability needs the caveats this lesson gives."
      }
    ]
  }
,
  {
    id: "ethereum-overview",
    level: "beginner",
    order: 3,
    title: "Ethereum: The World Computer",
    subtitle: "One shared machine that nobody can switch off — and what that property costs.",
    minutes: 15,
    objectives: [
      "Explain what it means for Ethereum to be one shared, always-on state machine.",
      "Distinguish externally owned accounts (EOAs) from contract accounts.",
      "Describe the EVM, smart contracts as unstoppable programs, and ETH's dual role as money and fuel.",
      "Explain what testnets are for and how Ethereum's roadmap is organized."
    ],
    sections: [
      {
        heading: "One computer, shared by everyone",
        paragraphs: [
          "Strip away the marketing and Ethereum is a single, global state machine. Its **state** is an enormous, precise data structure: every account balance, every contract's code and storage. **Transactions** are the only things that can change that state, and every node executes every transaction in the same order, arriving at the same new state. This is why people call it the world computer: one machine, executed redundantly by thousands of independent operators.",
          "The design goal is not speed — a laptop database is faster. The goal is *sharedness* and neutrality: the state and its rules are public, and no operator can unilaterally change them or delete a program. Anyone can deploy code that will keep running exactly as written, for as long as fee-paying users want to call it. That property — programs no one can switch off — is the actual product.",
          "Redundant execution by thousands of nodes is expensive by design, and users pay for it. The payment mechanism is gas, covered in depth in lesson 5. For now: nothing on Ethereum happens for free, and the cost is the price of running code that nobody can censor, revoke, or quietly edit."
        ]
      },
      {
        heading: "Two kinds of accounts",
        paragraphs: [
          "Everything on Ethereum is an account, and there are exactly two kinds. An **externally owned account (EOA)** is controlled by a private key — this is what your wallet creates and manages. A **contract account** is controlled by code deployed on-chain; it holds its own storage and can hold a balance like any account.",
          "Both share the same address format — `0x` followed by 40 hex characters — so you cannot tell them apart by looking. On a block explorer you can: EOAs show a balance and a transaction history, while contracts show a Code tab. One asymmetry matters constantly: only EOAs can originate transactions, because only EOAs have a key to sign with. Contracts can send messages to other contracts, but every chain of activity starts at a key."
        ],
        table: {
          headers: ["Property", "EOA (your wallet)", "Contract account"],
          rows: [
            ["Controlled by", "A private key you hold", "Code deployed on-chain"],
            ["Can initiate a transaction", "Yes — the only kind that can", "No; it reacts when called"],
            ["Has code", "No", "Yes, immutable by default"],
            ["Typical role", "Users, signers, payers of gas", "Applications: tokens, exchanges, registries"]
          ]
        }
      },
      {
        heading: "The EVM: a deterministic virtual machine",
        paragraphs: [
          "Contract code runs on the **Ethereum Virtual Machine (EVM)**, a stack-based virtual machine emulated by every node. Its defining property is **determinism**: the same contract, called with the same inputs at the same prior state, produces exactly the same result on every machine in the world. No randomness, no dependence on the local environment — otherwise nodes would disagree and the shared state would fracture.",
          "A smart contract is, formally, a program whose storage is part of the global state. Once deployed, it does exactly what its code says: no admin panel, no moderator, no off switch — unless the code itself includes one. Contracts cannot act on their own; they execute when a transaction (from an EOA) or another contract calls them. In this sense a contract is a state machine with hard-coded transitions: call `deposit` and the state changes per the rules; call `withdraw` without a balance and the call reverts."
        ],
        code: {
          lang: "solidity",
          code: "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.24;\n\ncontract Greeter {\n    string public greeting = \"hello world\";\n\n    function setGreeting(string calldata g) external {\n        greeting = g;\n    }\n}",
          caption: "A minimal smart contract: one stored value, one function to change it. Deployed once, it runs exactly as written — and no one can delete it."
        }
      },
      {
        heading: "ETH: money and fuel",
        paragraphs: [
          "ETH plays two roles that beginners often conflate. As **money**, ETH is a tradable asset with a market price — what the exchanges quote. As **fuel**, ETH denominates gas, the payment for computation and storage. Every transaction on Ethereum pays its fee in ETH, regardless of which tokens it moves.",
          "Units matter. One ETH is divisible to 18 decimal places; the smallest unit is a **wei**, and one **gwei** (10^-9 ETH) is the standard unit for gas prices. A fee quoted as 15 gwei means 0.000000015 ETH per unit of gas. Wallets handle the conversions, but reading them yourself is a skill you will use on every explorer page.",
          "Keep the two roles separate in your head. Network usage drives demand for block space and therefore fees; the *price* of ETH in dollars moves with markets and speculation. A busy network and an expensive ETH are correlated through demand, but they are not the same quantity, and conflating them is a common analytical error."
        ],
        callout: {
          type: "warning",
          title: "Unstoppable cuts both ways",
          body: "The same property that makes contracts censorship-resistant makes bugs permanent. The 2016 DAO hack drained millions of dollars of ETH through a code flaw, and there was no patch button — fixing it required a contentious fork of the entire network (covered in this course's case studies). When you interact with a contract, you are trusting its code and its review process, not a brand promise."
        }
      },
      {
        heading: "Testnets: the free sandbox",
        paragraphs: [
          "A **testnet** is a parallel network that runs the same protocol rules but with worthless currency. **Sepolia** is the primary testnet for application developers and learners. Same address format, same transaction structure, same wallet experience — but the ETH is free from faucets, and losing it costs nothing. Lesson 6 walks your first full session there.",
          "This course's practices run on Sepolia almost exclusively. The habits — checking networks, reading transactions, managing approvals — transfer unchanged to mainnet. The only difference is the stakes."
        ],
        list: [
          "**Sepolia** — the default testing network for apps and users; this is the one you will use.",
          "**Holesky** — a testnet focused on staking and infrastructure testing.",
          "**Mainnet** — the real network, real value; you graduate here only when ready."
        ]
      },
      {
        heading: "A roadmap, not a finished product",
        paragraphs: [
          "Ethereum develops in public, organized informally into named phases: **The Merge** moved it to proof of stake in 2022; **The Surge** targets scaling through layer-2 rollups; later phases — Scourge, Verge, Purge, Splurge — address MEV resistance, cryptography, state bloat, and assorted improvements. These are directions of travel, not release dates.",
          "Two habits follow. First, treat any roadmap claim about the future as a plan, not a fact — shipping has historically slipped by years. Second, notice what *has* already shipped: proof of stake, EIP-1559 fee markets, and a functioning rollup ecosystem are all live today. Learning what exists now, versus what is promised, is part of learning to evaluate the space."
        ],
        callout: {
          type: "tip",
          title: "Sepolia first, always",
          body: "Every new tool you try — a wallet feature, a dApp, an approval — try it on Sepolia first. The muscle memory is identical and the losses are zero. By the time you touch mainnet, the checks should feel automatic."
        }
      }
    ],
    keyTerms: [
      { term: "EOA", definition: "Externally owned account — an account controlled by a private key; the only account type that can originate transactions." },
      { term: "Contract account", definition: "An account controlled by on-chain code, with its own storage and balance." },
      { term: "EVM", definition: "Ethereum Virtual Machine — the deterministic execution environment every node runs, so all replicas process transactions identically." },
      { term: "Smart contract", definition: "A program whose code and storage live on-chain; it runs exactly as written once triggered." },
      { term: "State", definition: "The complete set of all balances and contract data at a point in time; transactions are state transitions." },
      { term: "Gwei", definition: "One billionth of an ETH (10^-9); the common unit for quoting gas prices." },
      { term: "Testnet", definition: "A parallel network with the same rules but worthless currency, used for free practice — Sepolia is the main one." }
    ],
    practices: [
      {
        id: "ethereum-overview-p1",
        title: "Tell accounts apart on a real explorer",
        goal: "Learn to identify what kind of address you are looking at — a check you should run before every future interaction.",
        steps: [
          "Open https://etherscan.io/accounts — the list of the highest-balance addresses.",
          "Find an address labeled with a name tag or a Contract badge and open it. Look for the Code tab: that marks a contract account.",
          "Open a plain address without a label. Note there is no Code tab — it is an EOA.",
          "On the contract page, open the Read Contract tab and find a function you could call for free (reads cost no gas).",
          "Write one sentence answering: what data does this contract own in the global state?"
        ],
        caution: "Read-only. Do not connect a wallet for this, and do not interact with contracts you cannot read."
      }
    ],
    resources: [
      { title: "Accounts — Ethereum docs", url: "https://ethereum.org/en/developers/docs/accounts/", type: "docs", note: "EOAs versus contract accounts, formally defined." },
      { title: "Smart contracts — Ethereum docs", url: "https://ethereum.org/en/developers/docs/smart-contracts/", type: "docs", note: "Lifecycle, composability, and limits of on-chain programs." },
      { title: "Introduction to smart contracts — Solidity docs", url: "https://docs.soliditylang.org/en/latest/introduction-to-smart-contracts.html", type: "docs", note: "The official introduction; the doorway to writing your own." },
      { title: "Ethereum roadmap", url: "https://ethereum.org/en/roadmap/", type: "article", note: "The named phases, as maintained by the Foundation." }
    ],
    quiz: [
      {
        id: "ethereum-overview-q1",
        prompt: "Which statement about Ethereum accounts is true?",
        options: [
          "Only contract accounts can send transactions.",
          "EOAs and contract accounts have visibly different address formats.",
          "Only EOAs can originate transactions, because only they hold private keys.",
          "Contracts can act spontaneously on a schedule without any trigger."
        ],
        correctIndex: 2,
        explanation: "Every transaction chain begins with a signed transaction from an EOA. Contracts react when called — by an EOA or another contract — and cannot start on their own."
      },
      {
        id: "ethereum-overview-q2",
        prompt: "What makes the EVM deterministic, and why does it matter?",
        options: [
          "It runs at a fixed clock speed across all nodes.",
          "The same inputs produce the same outputs on every node, so all replicas agree on one state.",
          "It prevents smart contract bugs from deploying.",
          "It makes transactions free for small users."
        ],
        correctIndex: 1,
        explanation: "Thousands of nodes execute everything redundantly; agreement requires that execution be perfectly repeatable. Remove determinism and the replicas would diverge into conflicting histories."
      },
      {
        id: "ethereum-overview-q3",
        prompt: "You send a transaction that moves a token you own. Which asset pays the fee?",
        options: [
          "The token itself, automatically.",
          "ETH, always — fees are paid in the native asset.",
          "Whichever asset has the higher balance.",
          "Fees are paid by the recipient."
        ],
        correctIndex: 1,
        explanation: "Gas is denominated and paid in ETH regardless of what the transaction does. This is why a wallet holding only tokens still needs a small ETH balance to move anything."
      },
      {
        id: "ethereum-overview-q4",
        prompt: "What is Sepolia?",
        options: [
          "A layer-2 network with cheaper fees for real money.",
          "Ethereum's main testnet — same rules, worthless ETH, free to practice.",
          "A popular wallet brand.",
          "A stablecoin pegged to the dollar."
        ],
        correctIndex: 1,
        explanation: "Sepolia mirrors mainnet's rules with currency that has no market value. It exists precisely so that mistakes are free while the skills stay real."
      }
    ]
  },
  {
    id: "wallets-and-keys",
    level: "beginner",
    order: 4,
    title: "Wallets & Self-Custody",
    subtitle: "Your keys, your coins — and every risk that comes with them.",
    minutes: 16,
    objectives: [
      "Explain key pairs, signing, and what an address actually is.",
      "Describe seed phrases (BIP-39) and how one phrase derives many accounts.",
      "Choose between hot and cold, custodial and non-custodial storage deliberately.",
      "State the real risks of self-custody and the amounts they make sense for."
    ],
    sections: [
      {
        heading: "Keys, signatures, and addresses",
        paragraphs: [
          "A wallet manages a **private key**: a random 256-bit number. From it, elliptic-curve math derives a **public key**, and a hash of that public key becomes your **address** — the `0x...` string you share. The direction matters: derivation is one-way. Nobody can compute your private key from your address, for the same reason nobody can reverse a hash fingerprint.",
          "The private key does exactly one powerful thing: create **signatures**. When you approve a transaction, your wallet signs its contents with the key, and every node can verify — using only the public key — that the signature is valid, without ever seeing the key itself. You prove control constantly while revealing nothing. This is the same public-key cryptography that secures HTTPS, applied to money.",
          "One consequence worth internalizing early: addresses are **pseudonymous, not anonymous**. All activity is public and linkable, and exchanges or analytics firms can often connect addresses to real identities. Privacy techniques are an advanced topic; the beginner habit is simply to assume your on-chain history is visible."
        ]
      },
      {
        heading: "Seed phrases: one phrase, many accounts",
        paragraphs: [
          "Managing one key per account does not scale, so modern wallets use a **seed phrase** — 12 or 24 words drawn from a fixed list of 2048 English words (the BIP-39 standard). The words encode a large random number with a built-in checksum, and the wallet **derives** many account keys from it deterministically. One phrase, backed up once, recovers your entire set of accounts.",
          "Grasp what this means for your threat model: **whoever knows the phrase owns the accounts** — immediately, completely, and unrecoverably. The phrase is not a password protecting a server; it *is* the master key material. This is why wallet setup asks you to write it on paper and never digitize it: photos, cloud notes, and email drafts are how phrases leak.",
          "A useful reframe: your wallet application holds nothing but keys. Your ETH and tokens live on-chain, in the global ledger, attached to your address. The wallet is a keychain plus an interface. Lose the phone, keep the phrase — recover everything. Lose the phrase, keep the phone — one factory reset away from permanent loss."
        ],
        code: {
          lang: "text",
          code: "# A toy example — real seed phrases are 12 or 24 words:\nabandon abandon about\n\n# A real 12-word phrase:\n# word-1 word-2 word-3 word-4 word-5 word-6\n# word-7 word-8 word-9 word-10 word-11 word-12\n\n# Rules: exact order matters; every word comes from one fixed\n# 2048-word list; the final word carries a checksum that catches typos.",
          caption: "BIP-39 in one picture: entropy becomes words, and the words regenerate the keys."
        }
      },
      {
        heading: "Hot versus cold",
        paragraphs: [
          "A **hot wallet** keeps keys on an internet-connected device — a browser extension or phone app. It is convenient for daily use, and it is exposed to everything your device is exposed to: malware, malicious extensions, phishing. A **cold wallet** keeps keys on a dedicated device that never touches the network — typically a hardware wallet that signs transactions internally and outputs only signatures.",
          "The dividing line in practice is not paranoia, it is amounts. The threshold people converge on: when holdings exceed what you would be genuinely upset to lose, move the keys offline. Before that, a clean hot wallet used on testnets is exactly the right tool."
        ],
        table: {
          headers: ["Storage", "Keys live", "Best for", "Main risk"],
          rows: [
            ["Browser / mobile wallet", "On a networked device", "Small amounts, daily practice, testnets", "Device compromise and phishing"],
            ["Hardware wallet", "On a dedicated offline device", "Meaningful savings; keys never touch the network", "Cost; you can still be tricked into approving bad transactions"],
            ["Paper (phrase written down)", "Fully offline", "Deep-cold backup of the master phrase", "No convenient signing; physical loss or damage"]
          ]
        }
      },
      {
        heading: "Custodial versus non-custodial",
        paragraphs: [
          "Hold coins on a large exchange and you do not hold keys at all — you hold an **IOU**, a database claim against the company. This is **custodial** ownership, and its failure mode is brutal and well documented: the 2022 collapse of FTX showed that even large, reputable-seeming custodians can lose or misuse customer funds. 'Not your keys, not your coins' is the lesson the industry paid to learn.",
          "But honesty cuts both ways. Custodians offer real value: password resets, fraud support, simple interfaces, and no key management at all. For a non-technical user holding small amounts, a regulated custodian is a defensible choice. The correct framing is not 'custody is evil' but **know which one you are using** — and never mistake an exchange balance for self-custody.",
          "Between the extremes, newer designs — multi-party computation and smart-contract wallets with social recovery — reduce the single-point-of-failure problem. They are covered later, in the account abstraction material. For now, learn the two pure forms well, because everything else modifies them."
        ]
      },
      {
        heading: "The real risks of self-custody",
        paragraphs: [
          "**No reset exists.** Forget your phrase and the assets are gone — not frozen, gone; the addresses become permanently unreachable. Substantial fractions of all Bitcoin are estimated to be lost this way. Every backup ritual in this lesson exists because forgetting is the most common failure, ahead of hacking.",
          "**One mistake is unrecoverable.** A mistyped address, a malicious approval, a phrase entered into a phishing site — there is no fraud department to call. Irreversibility, presented in lesson 1 as a feature of the ledger, is here the source of personal risk. The defense is not caution alone but *practice*: doing small, meaningless transactions until the mechanics are boring.",
          "**You become a target.** Self-custodied wealth is visible to attackers who no longer need to breach a bank — they need to breach you: phishing links, fake support agents, physical coercion, even inheritance gaps, since a phrase only you know dies with you. The honest guidance for beginners: start with small amounts you can afford to lose entirely, treat them as tuition, and scale only as your habits earn it."
        ],
        callout: {
          type: "warning",
          title: "Never type your phrase into a website",
          body: "No legitimate service, wallet, support agent, or airdrop will ever ask for your seed phrase. Any website or person that does is stealing from you, full stop. The phrase goes to paper, to metal, or nowhere else."
        }
      }
    ],
    keyTerms: [
      { term: "Private key", definition: "A secret 256-bit number that controls an account; anyone who has it can move the funds." },
      { term: "Address", definition: "The public identifier derived from a key pair; it can be shared freely and never reveals the private key." },
      { term: "Seed phrase", definition: "12 or 24 words encoding the master secret from which a wallet derives all account keys." },
      { term: "BIP-39", definition: "The standard mapping between random entropy and word-list seed phrases, with a checksum for typo detection." },
      { term: "Hot wallet", definition: "A wallet whose keys live on an internet-connected device." },
      { term: "Cold wallet", definition: "Storage where keys never touch a networked device, typically a hardware wallet." },
      { term: "Custodial", definition: "An arrangement where a third party holds the keys and you hold a claim against them." }
    ],
    practices: [
      {
        id: "wallets-and-keys-p1",
        title: "Create a practice wallet and rehearse recovery",
        goal: "Make backup and recovery physical skills rather than ideas.",
        steps: [
          "Install a reputable browser wallet (MetaMask or similar) from the official site — verify the publisher, do not follow an ad link.",
          "Create a brand-new wallet and write the 12-word phrase on paper. Never photograph it or type it anywhere digital.",
          "Confirm the phrase is stored in order, spelled exactly, and hidden somewhere reasonable.",
          "Use the wallet's reset or lock feature, then restore the wallet from your paper phrase.",
          "Verify the restored addresses match the originals exactly.",
          "Only after that, connect it to a testnet (next lesson) — never to an exchange account or anything holding real funds."
        ],
        caution: "Testnet only — never practice with real funds. Use a wallet you intend to keep for learning; create a separate one before ever holding real value."
      }
    ],
    resources: [
      { title: "Wallets — Ethereum.org", url: "https://ethereum.org/en/wallets/", type: "docs", note: "Wallet types and how to choose one, from the official docs." },
      { title: "Security — Ethereum.org", url: "https://ethereum.org/en/security/", type: "article", note: "Official security guidance; pairs with lesson 9." },
      { title: "BIP-39 specification", url: "https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki", type: "docs", note: "The wordlist and derivation spec your wallet implements." },
      { title: "Public-key cryptography — Wikipedia", url: "https://en.wikipedia.org/wiki/Public-key_cryptography", type: "article", note: "The mathematical family behind keys and signatures." }
    ],
    quiz: [
      {
        id: "wallets-and-keys-q1",
        prompt: "What does a wallet application actually store?",
        options: [
          "Your coins and tokens, as files on your device.",
          "The keys that control on-chain balances — and nothing else.",
          "A full copy of the blockchain.",
          "Your identity documents for verification."
        ],
        correctIndex: 1,
        explanation: "Balances live in the global ledger attached to your address. The wallet holds the keys that authorize movements, plus an interface to read and act on them."
      },
      {
        id: "wallets-and-keys-q2",
        prompt: "You lose the paper with your 12-word phrase, and your phone is later destroyed. What happens to the funds?",
        options: [
          "Support can restore the account after identity verification.",
          "The funds are permanently unreachable by anyone.",
          "The exchange reissues them.",
          "They remain safe on the phone's chip."
        ],
        correctIndex: 1,
        explanation: "No copy of the key material exists anywhere else, and no recovery path exists by design. This is the single most common way self-custodied funds are lost."
      },
      {
        id: "wallets-and-keys-q3",
        prompt: "Keeping tokens on a centralized exchange means...",
        options: [
          "You have full self-custody with extra convenience.",
          "You hold an IOU against the company; the company holds the keys.",
          "Your keys are shared between you and the exchange.",
          "The tokens are safe because exchanges are regulated banks."
        ],
        correctIndex: 1,
        explanation: "Custodial balances are database claims, not on-chain assets under your control. FTX demonstrated the counterparty risk is real; the honest answer is choosing the model deliberately and knowing which one you chose."
      },
      {
        id: "wallets-and-keys-q4",
        prompt: "A hardware wallet improves security mainly because...",
        options: [
          "It cannot be used to approve malicious transactions.",
          "Keys are generated and kept on an offline device, so malware on your computer cannot read them.",
          "It stores a backup copy of your funds offline.",
          "It hides your address from the blockchain."
        ],
        correctIndex: 1,
        explanation: "Signing happens inside the device; your computer only ever sees signatures. Note the limit: if a scam tricks you into approving a bad transaction, you can still confirm it on the device — hardware protects key theft, not judgment."
      }
    ]
  }
,
  {
    id: "transactions-and-gas",
    level: "beginner",
    order: 5,
    title: "Transactions & Gas",
    subtitle: "What you are really signing, and why failures still cost money.",
    minutes: 16,
    objectives: [
      "Name the fields of a transaction and what each one does.",
      "Explain gas: units, limits, and why computation must cost money.",
      "Explain EIP-1559's base fee and tip, and how a total fee is computed.",
      "Describe the mempool, replacement, and why failed transactions still charge gas."
    ],
    sections: [
      {
        heading: "Anatomy of a transaction",
        paragraphs: [
          "Everything that changes Ethereum's state is a **transaction** signed by an EOA. Beneath the wallet interface, it is a small structured object with a handful of fields. Learning them turns the mysterious confirmation popup into a readable document — which is precisely the point.",
          "The fields that matter first: `to` is the recipient — an address or a contract. `value` is ETH attached, in wei. `data` is empty for plain transfers but carries function calls to contracts — that is what a token swap actually is. `nonce` is a per-account counter that orders your transactions and prevents replaying an old signed message a second time.",
          "The `signature` is lesson 4 in action: values produced by your private key over the transaction's contents. Because the signature covers the fields, nothing can be modified after signing — not the recipient, not the amount. This is also why you must read before you sign: the popup is your last chance to see what is cryptographically committed."
        ],
        code: {
          lang: "json",
          code: "{\n  \"to\": \"0x70997970C51812dc3A010C7d01b50e0d17dc79C8\",\n  \"value\": \"10000000000000000\",\n  \"data\": \"0x\",\n  \"nonce\": 7,\n  \"maxFeePerGas\": \"30000000000\",\n  \"maxPriorityFeePerGas\": \"2000000000\",\n  \"chainId\": 1,\n  \"signature\": { \"r\": \"0x9a2f...\", \"s\": \"0x1b7c...\", \"v\": 27 }\n}",
          caption: "A plain ETH transfer. The value field is in wei: 10000000000000000 equals 0.01 ETH."
        }
      },
      {
        heading: "Gas: paying for computation",
        paragraphs: [
          "Every EVM operation has a gas price tag. Simple arithmetic is cheap; writing to storage is deliberately expensive; loops consume gas as they run. A transaction's `gas limit` is the maximum you authorize — a budget, not a bill. Execution stops when the work is done, and unused gas is refunded; the actual charge is `gasUsed × price`.",
          "Why meter at all? Because thousands of nodes execute everything redundantly, unbounded computation would be an attack: anyone could broadcast a program that runs forever, and every node would pay for it. Gas turns computation into a metered, priced resource — the same reason utilities meter electricity.",
          "Units: gas is priced in **gwei** (10^-9 ETH). A simple transfer uses 21,000 gas; a token swap can use 150,000 or more. The fee you pay is gasUsed multiplied by the effective gas price. Reading a transaction on Etherscan — the practice below — makes this concrete in two minutes."
        ]
      },
      {
        heading: "EIP-1559: base fee plus tip",
        paragraphs: [
          "Since August 2021, Ethereum's fee market has two parts. The **base fee** is set by the protocol each block, moving up or down to keep blocks around half full — and, crucially, it is **burned**: destroyed, not paid to anyone. The **priority fee (tip)** is what you add for the validator, to compete for inclusion when blocks are busy.",
          "Your wallet sets a `maxFeePerGas` cap so a sudden spike cannot charge you more than you agreed. The formula: total fee = gasUsed × (baseFee + tip), where the effective price can never exceed your max fee. Unpredictable legacy auctions became mostly predictable — not free, not fixed, but bounded and legible.",
          "The burn matters beyond user experience: it removes the base fee from circulation, coupling network usage to ETH supply dynamics. Whether the net supply grows or shrinks depends on issuance versus burn — an ongoing, data-dependent question rather than a slogan in either direction."
        ]
      },
      {
        heading: "Pending: the mempool",
        paragraphs: [
          "A signed transaction is broadcast to nodes and waits in each one's **mempool** — the queue of not-yet-included transactions — until a validator picks it into a block. On a public, busy network, that means queues: under load, your transaction can sit for seconds or minutes, visible to everyone.",
          "Because your nonce orders transactions, you can **replace** a pending one: broadcast a new transaction with the same nonce and a higher tip, and the network treats it as a replacement — that is what the speed-up and cancel buttons in wallets do. The same public waiting room has a dark side: sophisticated actors watch the mempool and position themselves around visible trades (MEV — an advanced-track topic)."
        ]
      },
      {
        heading: "Failed transactions still cost gas",
        paragraphs: [
          "Here is the beginner's most common fee shock. A transaction can fail — a contract's rules reject it (`require` fails, out of gas, an arithmetic error) — and the fee is still charged. The state changes are discarded, but the computation already happened across thousands of nodes, and gas pays for computation, not for outcomes.",
          "A concrete picture: a swap that fails at a slippage check might consume 100,000 gas before reverting. You pay for those 100,000; the swap simply never happened. On Etherscan such transactions show Status: Failed, often with the contract's rejection reason visible. Confusing at first, then obvious: the meter ran, even though the machine returned your goods to the shelf."
        ],
        callout: {
          type: "warning",
          title: "Check the network before you sign",
          body: "The signature commits the chain ID too. A transaction signed on the wrong network is not merely ineffective — wallets auto-switch networks more easily than you would like. Read the top of every confirmation popup: network, recipient, amount."
        }
      }
    ],
    keyTerms: [
      { term: "Transaction", definition: "A signed instruction from an EOA that changes global state — a transfer, contract call, or deployment." },
      { term: "Nonce", definition: "A per-account counter that orders transactions and prevents replay of old signatures." },
      { term: "Gas limit", definition: "The maximum gas a transaction may consume; unused gas is refunded." },
      { term: "Gwei", definition: "10^-9 ETH; the unit gas prices are quoted in." },
      { term: "Base fee", definition: "The protocol-set fee per gas under EIP-1559, adjusted each block and burned." },
      { term: "Priority fee", definition: "The tip paid to the validator to compete for block inclusion." },
      { term: "Mempool", definition: "The waiting room of signed-but-unincluded transactions held by nodes." }
    ],
    practices: [
      {
        id: "transactions-and-gas-p1",
        title: "Dissect a real transaction on Etherscan",
        goal: "Map every field from this lesson onto a live, signed transaction.",
        steps: [
          "Open https://etherscan.io/gastracker and note the current base fee range in gwei.",
          "Open any recent block from the homepage and pick a transaction from it.",
          "Identify on the transaction page: From, To, Value, Gas Limit, Gas Used, and the fee paid.",
          "Multiply Gas Used by the effective gas price (Etherscan shows it) and confirm it matches the displayed fee.",
          "Find a transaction with Status: Failed and note that Gas Used was still charged.",
          "Open a token swap transaction and look at the Input Data — that is the data field carrying a contract call."
        ],
        caution: "Read-only exploration on a block explorer. No wallet connection or signing involved."
      }
    ],
    resources: [
      { title: "Transactions — Ethereum docs", url: "https://ethereum.org/en/developers/docs/transactions/", type: "docs", note: "Field-by-field reference for the transaction envelope." },
      { title: "Gas — Ethereum docs", url: "https://ethereum.org/en/developers/docs/gas/", type: "docs", note: "Gas units, EIP-1559 mechanics, and refunds." },
      { title: "EIP-1559 specification", url: "https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md", type: "paper", note: "The original proposal that changed Ethereum's fee market." },
      { title: "Etherscan Gas Tracker", url: "https://etherscan.io/gastracker", type: "tool", note: "Live base fee and tip levels; check it before timing transactions." }
    ],
    quiz: [
      {
        id: "transactions-and-gas-q1",
        prompt: "What does a transaction's nonce do?",
        options: [
          "Encrypts the recipient's address.",
          "Orders your transactions and prevents replaying old signatures.",
          "Sets the maximum fee you will pay.",
          "Randomizes timing to prevent front-running."
        ],
        correctIndex: 1,
        explanation: "Each EOA keeps a counter, and each new transaction must use the next number. That gives strict ordering and makes a signed message unusable twice."
      },
      {
        id: "transactions-and-gas-q2",
        prompt: "Under EIP-1559, where does the base fee go?",
        options: [
          "To the block validator, like the tip.",
          "Nowhere — it is burned, removed from supply.",
          "To the wallet provider as a service fee.",
          "To a decentralized treasury."
        ],
        correctIndex: 1,
        explanation: "The base fee is burned; only the tip goes to the validator. Burning ties usage to supply and removed most of the fee volatility of the old first-price auction."
      },
      {
        id: "transactions-and-gas-q3",
        prompt: "A contract call reverts halfway through execution. What happens?",
        options: [
          "Nothing — the transaction vanishes and no fee is charged.",
          "State changes are discarded, but the gas used before the failure is charged.",
          "The full gas limit is always charged regardless of progress.",
          "The fee is refunded minus a penalty."
        ],
        correctIndex: 1,
        explanation: "Gas pays for computation performed, not for outcomes. The run's effects are rolled back, but the meter keeps its reading — which is why failures still cost money."
      },
      {
        id: "transactions-and-gas-q4",
        prompt: "Your transaction is stuck pending. What is a legitimate way to speed it up?",
        options: [
          "Broadcast a new transaction with the same nonce and a higher priority fee.",
          "Email the validators directly.",
          "Sign it again with a brand-new nonce.",
          "Send a second copy with double the value."
        ],
        correctIndex: 0,
        explanation: "Same nonce plus a higher tip replaces the pending transaction in the queue. A new nonce would create a second, separate transaction — not a replacement."
      }
    ]
  },
  {
    id: "using-dapps",
    level: "beginner",
    order: 6,
    title: "Your First dApp Session",
    subtitle: "From installing a wallet to reading your own transaction on an explorer.",
    minutes: 18,
    objectives: [
      "Explain what a dApp is and how the wallet bridges and bounds your access to it.",
      "Set up a wallet on the Sepolia testnet and obtain testnet ETH safely.",
      "Distinguish connecting, signing, approving, and sending.",
      "Verify any transaction on a block explorer, including your own."
    ],
    sections: [
      {
        heading: "What a dApp actually is",
        paragraphs: [
          "A dApp is a normal frontend — usually a website — talking to smart contracts instead of a company's backend. The site draws the buttons and charts; the *authority* lives in the contracts, whose rules and history anyone can inspect. If the website disappears, the contracts persist on-chain, and another frontend can appear tomorrow talking to the same addresses.",
          "Your wallet is the bridge and the boundary. The dApp never receives your keys or any private material — it requests your address (read-only), and asks your wallet to sign or send things (write). Every state-changing action ends as a transaction signed locally in your wallet, exactly the object you dissected in lesson 5. This division — the app proposes, the wallet disposes — is the security model.",
          "Reads and writes are priced differently: reading contract state (your balance, a price) is free through a node connection, while anything that writes state costs gas, paid by you. When a site claims to do something 'for free', the gas meter still runs — it is simply being paid by a different party or on a cheaper chain."
        ]
      },
      {
        heading: "Install a wallet safely",
        paragraphs: [
          "Pick one wallet and learn it deeply before adding others; the mainstream beginner choice is a browser extension wallet such as MetaMask. The install step is itself a security exercise: go to the official site by typing the address, verify the publisher in the extension store, and never install from an ad or a link in a message. Fake wallet extensions are a real, active attack.",
          "Keep expectations straight about what the wallet's password protects: it encrypts the keys on *that device* only. The seed phrase is the real backup. A stolen laptop is survivable; a photographed phrase is not."
        ],
        list: [
          "Install from the official site, checking the store publisher name.",
          "Create a new wallet; write the seed phrase on paper, never digitally.",
          "Do one restore drill now, while nothing is at stake (lesson 4 practice).",
          "Set a strong device password — it protects casual access, not recovery."
        ]
      },
      {
        heading: "Switch to Sepolia and get testnet ETH",
        paragraphs: [
          "Open the network selector and switch to Sepolia — modern wallets ship it built in. Confirm you are on Sepolia in the popup header every time you interact with anything. If a site or task requires a network you do not recognize, that is a moment to pause, not to click 'approve' through the confusion.",
          "Get testnet ETH from a public faucet — for example [Alchemy's Sepolia faucet](https://www.alchemy.com/faucets/ethereum-sepolia), which may ask for an account or a small mainnet balance to deter bots. Request a little; you need far less than you think. Testnet ETH has no market value and no purchase path that makes sense — anyone 'selling' it is scamming you."
        ],
        callout: {
          type: "tip",
          title: "Faucet dry? Return what you borrow",
          body: "Faucets rate-limit by design. Many let you send testnet ETH back when you finish — a good habit that keeps free ETH circulating for the next learner."
        }
      },
      {
        heading: "Connect, sign, approve, send — four different powers",
        paragraphs: [
          "dApps ask for four different capabilities, and they are dangerously easy to blur. **Connecting** shares your address — read-only, like showing your account number. **Signing** a message proves you control the address at this moment: no state change, no fee, used for logins. **Approving** grants a contract permission to move a specific token of yours, up to a limit — a standing power that persists. **Sending** is a full transaction that changes state and costs gas.",
          "The approval row is where beginners get hurt. An approval is not a payment — it is a *grant*, and it stays active until explicitly revoked or the balance runs out. An unlimited approval to a malicious or compromised contract is an open door long after you close the browser tab. Lesson 9 builds the habit of reviewing approvals; right now, build the reflex of reading the amount."
        ],
        table: {
          headers: ["Action", "What you grant", "Costs gas?", "Reverses?", "Check before confirming"],
          rows: [
            ["Connect", "Your address (read-only)", "No", "Disconnect anytime", "That the site is the real one"],
            ["Sign message", "Proof of address control, once", "No", "Nothing to reverse", "What the message text actually says"],
            ["Token approval", "A contract may move token X up to amount N", "Yes", "Only by revoking (lesson 9)", "Spender address and amount — beware unlimited"],
            ["Send transaction", "Full execution as written", "Yes", "Never", "Network, recipient, value, function"]
          ]
        },
        callout: {
          type: "warning",
          title: "A signature can be a transaction in disguise",
          body: "Some standards let a signed *message* authorize a token transfer — no fee, no confirmation popup that looks like a payment. If a signature request mentions tokens, spending, or permissions you cannot read clearly, refuse it. You will meet the Permit standard in later tracks; for now, the default is: do not sign."
        }
      },
      {
        heading: "Read your own transaction",
        paragraphs: [
          "Send yourself a small testnet transfer: 0.001 ETH from account A to account B (create a second account inside the same wallet — one phrase, many addresses). The wallet will show it as pending, then confirmed. Now do the professional thing: open [Sepolia Etherscan](https://sepolia.etherscan.io), paste the transaction hash, and read it.",
          "Find, in order: Status (Success), Block (a number — click it to see the siblings), From and To (your two addresses), Value, and the Transaction Fee in ETH. Compare Gas Limit with Gas Used — you authorized more than was consumed, and the difference was refunded. This single page is the receipt, the audit, and the truth; the wallet interface is only a summary.",
          "The transaction hash is a *receipt*, not a credential. Nobody legitimate ever needs you to send them a hash, a seed phrase, or a screen share; when someone asks for any of these, you have met the scam, not a support agent. The full taxonomy is lesson 9."
        ]
      },
      {
        heading: "Habits that carry to mainnet",
        paragraphs: [
          "Everything above — official-source installs, network checks, reading amounts, small test sends first, explorer verification — costs nothing on testnet and transfers unchanged to real funds. Users who lose money are rarely outsmarted by novel attacks; they are rushed into skipping checks they already knew.",
          "One more habit worth starting now: **type URLs, never click them**, for anything involving money. Bookmark the real sites you use — faucet, explorer, wallet download — once, and navigate from bookmarks forever after. Phishing begins with a link; bookmarks quietly neutralize the most common entry point."
        ]
      }
    ],
    keyTerms: [
      { term: "dApp", definition: "An application whose backend logic runs as smart contracts; the frontend is replaceable, the rules are on-chain." },
      { term: "Connect", definition: "Sharing your public address with a site — read-only, revocable, no cost." },
      { term: "Signature", definition: "A cryptographic proof, made by your key, that you approved specific content; by itself it changes no state." },
      { term: "Approval", definition: "A standing grant letting a named contract move a token you own, up to a limit, until revoked." },
      { term: "Faucet", definition: "A service dispensing free testnet ETH." },
      { term: "Sepolia", definition: "Ethereum's primary testnet for practice." },
      { term: "Block explorer", definition: "A search engine for chains — Etherscan — where every transaction, address, and block is readable." }
    ],
    practices: [
      {
        id: "using-dapps-p1",
        title: "Run a full session: install, fund, send, verify",
        goal: "Complete one end-to-end testnet session so the mechanics become boring.",
        steps: [
          "Install your wallet from the official site and complete the lesson-4 backup drill if you have not yet.",
          "Switch the network to Sepolia and confirm the network name appears on every popup.",
          "Get testnet ETH from a faucet such as https://www.alchemy.com/faucets/ethereum-sepolia.",
          "Create a second account inside the same wallet and copy its address.",
          "Send 0.001 ETH from account one to account two; watch it go from pending to confirmed.",
          "Open https://sepolia.etherscan.io, paste the transaction hash, and find Status, Block, Value, and the fee.",
          "Compare Gas Limit with Gas Used and note the refund.",
          "Send a second, smaller transfer — deliberately notice how routine it has become."
        ],
        caution: "Testnet only — never practice with real funds. Never share your seed phrase or transaction hashes with anyone who asks."
      }
    ],
    resources: [
      { title: "Networks — Ethereum docs", url: "https://ethereum.org/en/developers/docs/networks/", type: "docs", note: "Mainnet versus testnets, and what each is for." },
      { title: "Alchemy Sepolia Faucet", url: "https://www.alchemy.com/faucets/ethereum-sepolia", type: "tool", note: "Free testnet ETH for practice." },
      { title: "Sepolia Etherscan", url: "https://sepolia.etherscan.io", type: "tool", note: "The explorer for the Sepolia testnet." },
      { title: "JSON-RPC — Ethereum docs", url: "https://ethereum.org/en/developers/docs/apis/json-rpc/", type: "docs", note: "How dApps actually talk to nodes under the hood." }
    ],
    quiz: [
      {
        id: "using-dapps-q1",
        prompt: "When you click 'Connect Wallet' on a dApp, what does it receive?",
        options: [
          "Your seed phrase, encrypted.",
          "Your public address — read-only access to it.",
          "The ability to move your tokens.",
          "A signed transaction authorizing future payments."
        ],
        correctIndex: 1,
        explanation: "Connect is the weakest request: it learns your address so the site can display balances. Spending power requires signatures or approvals, which are separate, explicit actions."
      },
      {
        id: "using-dapps-q2",
        prompt: "A site asks you to sign a message to log in. What is the effect?",
        options: [
          "It logs you in with no state change and no fee.",
          "It transfers a small gas fee to the site.",
          "It grants the site an unlimited token approval.",
          "It publishes your email address on-chain."
        ],
        correctIndex: 0,
        explanation: "Message signatures prove control without touching state — the basis of passwordless logins. The danger is signing things you have not read; a login request is benign, but the same dialog can be abused to hide spending permissions."
      },
      {
        id: "using-dapps-q3",
        prompt: "Why is an unlimited token approval more dangerous than a one-time payment?",
        options: [
          "It costs more gas to set up.",
          "It is a standing permission that persists until revoked.",
          "It cannot be revoked once made.",
          "It hides your balance from you."
        ],
        correctIndex: 1,
        explanation: "Approvals outlive the session: the approved contract can move tokens at any time up to the limit. Checking and revoking approvals is a maintenance habit, covered in lesson 9."
      },
      {
        id: "using-dapps-q4",
        prompt: "A transaction shows Gas Limit 63,000 and Gas Used 21,000. What do you actually pay for?",
        options: [
          "The full gas limit, always.",
          "Gas Used multiplied by the effective gas price; the unused 42,000 is refunded.",
          "Nothing, because the transaction succeeded.",
          "Gas Used plus a fixed penalty for overestimating."
        ],
        correctIndex: 1,
        explanation: "The limit is a ceiling, not a charge. You pay for the computation that actually executed, and the difference between limit and usage is returned."
      }
    ]
  }
,
  {
    id: "tokens-and-nfts",
    level: "beginner",
    order: 7,
    title: "Tokens & NFTs",
    subtitle: "A token is a row in someone else's spreadsheet — here is what that actually means.",
    minutes: 15,
    objectives: [
      "Explain that tokens are balances inside contracts, not native currency.",
      "Use the ERC-20 and ERC-721 standards from the user's side.",
      "Explain why minting costs gas and where NFT metadata actually lives.",
      "Separate NFT myths from reality, including ownership versus copyright."
    ],
    sections: [
      {
        heading: "A token is a row in someone's contract",
        paragraphs: [
          "ETH is native: balances are part of the protocol's core state. A **token** is different — it is a mapping inside a smart contract: `balances[address] = amount`. 'Sending' a token calls that contract, which checks that you own the amount, updates two rows, and emits an event. Nothing travels anywhere; a ledger is edited.",
          "The implications are worth dwelling on. The contract's author chose the rules: whether transfers charge fees, whether an admin can freeze accounts, whether the supply can grow. Two tokens with the same logo can be wildly different instruments. Before trusting any token, the question is not 'is it real?' but 'what does this contract's code allow?'",
          "Second implication: moving any token costs **ETH**, because gas is paid in the native asset. Holding a token with zero ETH leaves you unable to move it — a constant surprise, and the reason airdrops to active users often include a little ETH to cover the first transfer."
        ]
      },
      {
        heading: "ERC-20: the fungible standard",
        paragraphs: [
          "A standard is an interface everyone agrees to implement, and **ERC-20** is the most successful in history: `transfer`, `balanceOf`, `approve`, `transferFrom`, plus metadata like `name`, `symbol`, and `decimals`. Because wallets, exchanges, and DEXs support the standard, *any* ERC-20 token works everywhere automatically — no per-token integrations.",
          "Notice what the interface does *not* include: any promise about reserves, honesty, or supply. `totalSupply` tells you what the contract claims; whether that number means anything is a separate question. Scam tokens copy the standard perfectly and add a honeypot — code that lets you buy but not sell. Standards enable interoperability; they do not certify honesty."
        ],
        code: {
          lang: "solidity",
          code: "interface IERC20 {\n    function name() external view returns (string memory);\n    function symbol() external view returns (string memory);\n    function decimals() external view returns (uint8);\n    function totalSupply() external view returns (uint256);\n    function balanceOf(address who) external view returns (uint256);\n    function transfer(address to, uint256 amount) external returns (bool);\n    function approve(address spender, uint256 amount) external returns (bool);\n    function transferFrom(address from, address to, uint256 amount) external returns (bool);\n}",
          caption: "The entire ERC-20 surface. Every token your wallet shows you is this interface with different code behind it."
        }
      },
      {
        heading: "ERC-721: uniqueness as a primitive",
        paragraphs: [
          "Fungible means interchangeable: one USDC equals any other USDC. Non-fungible means each unit is distinct — a deed, a ticket, a game item. **ERC-721** models this with a `tokenId`: each token has a unique identifier and exactly one owner at a time. `ownerOf(tokenId)` is the core read, and transfers move a specific ID, not an amount.",
          "The non-fungible bucket is broader than art. Event tickets, memberships, domain names, and in-game items all fit the same primitive. What varies is whether the *thing behind the token* is worth anything — which brings us to the honest part of this lesson."
        ],
        table: {
          headers: ["", "ERC-20 (fungible)", "ERC-721 (non-fungible)"],
          rows: [
            ["Unit", "An amount, like 3.5 tokens", "A specific tokenId"],
            ["balanceOf means", "How many units you hold", "How many items you hold (each distinct)"],
            ["Transfer moves", "An amount between addresses", "One specific token"],
            ["Natural uses", "Currency, points, shares", "Deeds, tickets, collectibles, game items"],
            ["Uniqueness", "None — every unit identical", "Built in — ids are one-of-one"]
          ]
        }
      },
      {
        heading: "Why minting costs real money",
        paragraphs: [
          "Minting means creating a new token: incrementing a supply counter and writing your address into storage as an owner. On the EVM, **storage writes are among the most expensive operations** — every node must store the change forever. That is why minting a simple NFT can cost more gas than sending plain ETH, and why mints during network congestion get expensive fast.",
          "Uploading an image or a JSON file costs nothing on-chain unless you deliberately store it there. The mint transaction writes the pointer; the files themselves usually sit on decentralized storage like IPFS or on plain web hosting. Layer-2 networks make minting cheap by the same logic in reverse — less redundant execution, lower fees."
        ]
      },
      {
        heading: "NFT myths versus reality",
        paragraphs: [
          "Myth one: **the artwork is on the blockchain**. Usually not. The token typically stores a `tokenURI` — a link to a metadata JSON file, which itself links to the image. If that link is plain HTTP, the seller can edit it or the server can die, leaving a token that points at nothing. Content-addressed storage (IPFS) is more durable, but only if someone keeps pinning the data. An NFT outliving its art is a real failure mode, not a joke.",
          "Myth two: **buying the NFT buys the copyright**. Almost never. Owning the token proves the ledger entry; the intellectual property in the artwork stays with its creator unless explicitly licensed otherwise. Some collections grant commercial rights; many grant nothing beyond display bragging rights. Read the license, not the marketing.",
          "Myth three: **NFTs are safe investments in scarce digital goods**. Scarcity is programmable and copyable: the same image can be minted on another contract in minutes, and 'official' is a social fact, not a technical one. Value concentrates in collections with durable communities and collapses elsewhere. Treat minting and trading as spending on something you want, not as a savings plan."
        ],
        callout: {
          type: "warning",
          title: "Check which contract a collection lives on",
          body: "Marketplaces show dozens of fake 'collections' copying names and art. The real one is the contract the project's official site links to. Two tokens can be visually identical and economically unrelated."
        }
      }
    ],
    keyTerms: [
      { term: "Token", definition: "A balance tracked inside a smart contract rather than in the protocol's native state." },
      { term: "ERC-20", definition: "The fungible-token standard: a common interface that makes any token work in any wallet or exchange." },
      { term: "ERC-721", definition: "The non-fungible-token standard: one unique tokenId per item, one owner at a time." },
      { term: "Mint", definition: "Creating new tokens by writing to a contract's storage — paid in gas like any other write." },
      { term: "Metadata", definition: "The JSON describing an NFT (name, traits, image link), usually stored off-chain behind a tokenURI." },
      { term: "TokenURI", definition: "The pointer inside an NFT that locates its metadata — the fragile part of many collections." },
      { term: "IPFS", definition: "Content-addressed storage: files are found by their hash rather than by location, making links tamper-evident but not self-preserving." }
    ],
    practices: [
      {
        id: "tokens-and-nfts-p1",
        title: "Autopsy a token and an NFT on Etherscan",
        goal: "See the ledger-entry reality behind both standards.",
        steps: [
          "Open https://etherscan.io/tokens and pick a large ERC-20 token by market cap.",
          "Open its Holders tab — you are looking at the balances mapping rendered as a list. This is what a token *is*.",
          "Open the Transfers tab and read a few events: from, to, amount.",
          "Open the Contract tab, check that the source is verified, and skim for owner-only functions like pause, blacklist, or mint.",
          "Now open a well-known NFT collection's token page and find its metadata or tokenURI; note whether the link is IPFS or plain HTTP."
        ],
        caution: "Read-only inspection. Do not buy, mint, or approve anything from these pages."
      }
    ],
    resources: [
      { title: "Token standards — Ethereum docs", url: "https://ethereum.org/en/developers/docs/standards/tokens/", type: "docs", note: "ERC-20, ERC-721, and their siblings, officially summarized." },
      { title: "EIP-20 (ERC-20)", url: "https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md", type: "paper", note: "The original fungible-token standard." },
      { title: "EIP-721 (ERC-721)", url: "https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md", type: "paper", note: "The original non-fungible-token standard." },
      { title: "NFTs on Ethereum.org", url: "https://ethereum.org/en/nft/", type: "article", note: "A plain-language overview including the honest caveats." }
    ],
    quiz: [
      {
        id: "tokens-and-nfts-q1",
        prompt: "Where does a token's balance actually live?",
        options: [
          "In your wallet file.",
          "In the token contract's storage, as a mapping from addresses to amounts.",
          "In your browser's local storage.",
          "On the exchange's servers."
        ],
        correctIndex: 1,
        explanation: "A token is a ledger the contract maintains; your wallet only reads it. This is why the contract's code — fees, freezes, admin keys — defines what your ownership actually means."
      },
      {
        id: "tokens-and-nfts-q2",
        prompt: "What makes ERC-721 tokens non-fungible in practice?",
        options: [
          "They cost more gas to transfer.",
          "Each has a unique tokenId with exactly one owner.",
          "They cannot be transferred at all.",
          "They are always more valuable than ERC-20s."
        ],
        correctIndex: 1,
        explanation: "Fungibility is about interchangeability. ERC-721 replaces the amount with an identity — each unit is individually tracked, whether it is a deed or a doodle."
      },
      {
        id: "tokens-and-nfts-q3",
        prompt: "An NFT's image is typically stored...",
        options: [
          "Inside the token contract itself.",
          "Off-chain, behind a tokenURI pointing to metadata that links to the file.",
          "In the buyer's wallet.",
          "Nowhere — NFTs have no associated files."
        ],
        correctIndex: 1,
        explanation: "The chain stores the pointer and the ownership; the files live on IPFS or web servers. If the link rots, the token remains while what it points to disappears."
      },
      {
        id: "tokens-and-nfts-q4",
        prompt: "You buy an NFT of an artist's illustration. What do you usually acquire?",
        options: [
          "The copyright to the illustration.",
          "The ledger entry the contract defines; IP stays with the creator unless licensed otherwise.",
          "A trademark on the character.",
          "The right to stop others from viewing the image."
        ],
        correctIndex: 1,
        explanation: "Ownership of the token and ownership of the intellectual property are separate things. Read the collection's license; most grant limited or no commercial rights."
      }
    ]
  },
  {
    id: "stablecoins",
    level: "beginner",
    order: 8,
    title: "Stablecoins",
    subtitle: "Dollar-pegged tokens — the most used crypto product, and the most varied in risk.",
    minutes: 15,
    objectives: [
      "Explain why dollar-pegged tokens dominate on-chain activity.",
      "Compare fiat-backed, crypto-overcollateralized, and algorithmic designs.",
      "Trace how a DAI-style vault system holds a peg and what liquidations do.",
      "Identify the risk profile of each type: depeg, custody, and censorship."
    ],
    sections: [
      {
        heading: "Why the industry runs on dollar tokens",
        paragraphs: [
          "Most on-chain activity wants a unit of account that does not move 10% in a day. Traders price pairs and settle without exiting to banks; workers and families move value across borders in minutes; people in high-inflation economies hold digital dollars. That demand made **stablecoins** the most transacted category in crypto — by volume, larger than everything else combined.",
          "Mechanically they are ordinary tokens — mostly ERC-20s — whose *value* is managed to track one dollar. The interesting question is never 'is it a token?' but '**what mechanism holds the peg?**' Three families of answers exist, and they carry very different risk."
        ]
      },
      {
        heading: "Fiat-backed: USDC and USDT",
        paragraphs: [
          "The dominant design. An issuer — Circle for USDC, Tether for USDT — holds reserves, cash and short-term US Treasury bills, and issues tokens one-for-one against dollars deposited; redeeming tokens burns them. The peg rests on redeemability: if the token trades below a dollar, arbitrageurs buy it and redeem at par, pushing the price back up.",
          "The risks here are institutional, not cryptographic: you trust the issuer's honesty, its bank partners, and its jurisdiction. In March 2023, USDC briefly traded near $0.87 when part of its reserves was stuck in a failing bank — resolved within days, but a live demonstration that 'backed by dollars' can mean 'backed by a specific bank's solvency.'"
        ],
        list: [
          "What exactly backs it — and how often an independent attestation (not a full audit) is published.",
          "Who can freeze addresses: issuers hold blacklist functions and have used them.",
          "Where the reserves sit, and what happens if the banking rail behind them fails."
        ]
      },
      {
        heading: "Crypto-overcollateralized: the DAI design",
        paragraphs: [
          "The second family removes the bank. Maker's (now Sky's) **DAI** is minted by users who lock collateral — ETH and other assets — in a **vault** and draw DAI against it at less than full value: post roughly $150 of collateral to mint up to $100 of DAI. This **overcollateralization** is the buffer: the system only breaks if collateral value collapses faster than positions can be closed.",
          "The keystone mechanism is **liquidation**. If a vault's collateral falls below its required ratio, anyone can repay its DAI and seize the collateral at a discount. That keeps every vault honest without anyone's permission — the peg is defended by open arbitrage against contractual rules, not by a company's promise.",
          "The trade-offs are the mirror image of fiat-backed: no banking rails to fail, but capital sits locked and idle, risk parameters (collateral types, ratios, fees) are set by governance, and the system depends on price **oracles** to know when to liquidate — an infrastructure that is itself an attack surface, covered later in the course."
        ],
        callout: {
          type: "deep-dive",
          title: "Work the 150% number",
          body: "At 150% minimum collateralization, a $100 DAI debt sits behind at least $150 of collateral. A 20% price drop in the collateral leaves $120 behind a $100 debt — the vault is at its risk threshold and heads to liquidation. The buffer buys the system time to close positions before debts go underwater; the chosen ratio is the design's whole risk budget."
        }
      },
      {
        heading: "Algorithmic: the design that keeps dying",
        paragraphs: [
          "The third family tries to hold a peg with no full reserves at all — usually a two-token system in which a volatile companion token absorbs price movements through mint-and-burn incentives. It is elegant on paper and has repeatedly failed in practice: when confidence in the companion token falls faster than the incentives can compensate, both spiral together.",
          "The canonical collapse is **Terra**, May 2022. Its UST stablecoin lost its peg during large withdrawals; the mint-and-burn mechanism responded by hyperinflating the LUNA token from tens of dollars to effectively zero within a week, erasing an estimated $40 billion or more. The full anatomy is a case study in this course — study it, because it is the cleanest demonstration that a peg is a promise about reserves, not a mathematical trick.",
          "The lesson generalizes beyond Terra: mechanisms that maintain a peg through reflexivity — value resting on belief in the same system that must absorb the doubt — fail precisely when they are most needed. Reserve-based designs can fail too; the difference is *what* fails, and whether it can recover."
        ]
      },
      {
        heading: "Choosing your exposure: the risk table",
        paragraphs: [
          "No stablecoin is risk-free; each embeds a different bet. The table below is the checklist to run on any stablecoin you encounter — including ones launched after this lesson was written.",
          "Practical posture for a learner: treat stablecoins as tools with counterparty profiles, not as cash equivalents. Know which type you hold, know the redemption path, and remember that 'stable' describes the *goal* of the mechanism — the mechanism itself can lose."
        ],
        table: {
          headers: ["Type", "Example", "Peg held by", "Primary failure mode"],
          rows: [
            ["Fiat-backed", "USDC, USDT", "Off-chain reserves and redemption", "Issuer or bank failure; regulatory action"],
            ["Crypto-overcollateralized", "DAI (Sky)", "Locked crypto plus liquidations", "Collateral crash outrunning liquidations; oracle or governance failure"],
            ["Algorithmic", "UST (defunct)", "Incentives and a companion token", "Confidence spiral — peg and backing collapse together"]
          ]
        }
      },
      {
        heading: "Depeg, custody, censorship — reading the fine print",
        paragraphs: [
          "Three risk words come up in every stablecoin discussion, and they mean different things. **Depeg** is the token trading away from its reference value — temporary or fatal. **Custody** is who controls the reserves and the minting keys. **Censorship** is the ability to freeze specific addresses — every major fiat-backed issuer holds this power and has exercised it when required by law.",
          "None of these risks disqualifies stablecoins; they define the questions to ask. Who issues this, what backs it, who can freeze it, and what happened the last time markets panicked? A stablecoin that cannot answer those questions clearly is not a dollar substitute — it is a story."
        ],
        callout: {
          type: "warning",
          title: "Peg does not mean promise",
          body: "Every stablecoin has depegged at least briefly — USDC in a bank-run weekend, DAI during collateral crashes, UST permanently. The question is never 'can it depeg?' but 'what restores the peg, and how fast?'"
        }
      }
    ],
    keyTerms: [
      { term: "Stablecoin", definition: "A token managed to track a reference value, usually one US dollar." },
      { term: "Peg", definition: "The maintained price linkage between the token and its reference asset." },
      { term: "Fiat-backed", definition: "Pegged by reserves of real-world assets held by an issuer who mints and redeems tokens." },
      { term: "Overcollateralization", definition: "Requiring collateral worth more than the debt issued against it — the buffer behind DAI-style systems." },
      { term: "Liquidation", definition: "Closing an undercollateralized position by selling its collateral at a discount to repay the debt." },
      { term: "Algorithmic stablecoin", definition: "A peg maintained by incentive mechanisms rather than full reserves; historically fragile." },
      { term: "Depeg", definition: "The token trading away from its reference value — temporarily or permanently." }
    ],
    practices: [
      {
        id: "stablecoins-p1",
        title: "Audit a stablecoin's anatomy",
        goal: "Move from categories to a specific token's actual mechanics.",
        steps: [
          "Open https://etherscan.io/tokens and search for DAI, then open its token page.",
          "Open Holders and note the largest accounts — you will see exchanges and vault contracts, not a single issuer.",
          "Open the Contract tab, check that the source is verified, and look for a blacklist or freeze-style function. Note whether one exists.",
          "Find the price chart on the token page and scan its history for depeg moments, including March 2023.",
          "Repeat the last two steps for USDC and compare: which contract holds more admin power, and what backs each peg?",
          "Write two sentences: which failure mode worries you more for each token, and why."
        ],
        caution: "Read-only research on a block explorer. Never move real funds as part of this exercise."
      }
    ],
    resources: [
      { title: "Stablecoins — Ethereum.org", url: "https://ethereum.org/en/stablecoins/", type: "article", note: "Official overview of types, uses, and risks." },
      { title: "Stablecoin — Wikipedia", url: "https://en.wikipedia.org/wiki/Stablecoin", type: "article", note: "History across many designs and several failures." },
      { title: "Terra (blockchain) — Wikipedia", url: "https://en.wikipedia.org/wiki/Terra_(blockchain)", type: "article", note: "The collapse this lesson foreshadows; the full case study is in the library." },
      { title: "Chainlink Education Hub", url: "https://chain.link/education-hub", type: "article", note: "Primers on oracles and infrastructure, including stablecoin mechanics." }
    ],
    quiz: [
      {
        id: "stablecoins-q1",
        prompt: "What primarily holds a fiat-backed stablecoin like USDC at one dollar?",
        options: [
          "Smart-contract code alone.",
          "Off-chain reserves plus the ability to redeem tokens for dollars at par.",
          "A companion token absorbing volatility.",
          "A fixed total supply."
        ],
        correctIndex: 1,
        explanation: "Arbitrage against redeemability keeps the market price pinned near the redemption value. The trust is in the issuer and its banks — which is why custody and attestation questions matter."
      },
      {
        id: "stablecoins-q2",
        prompt: "Why does the DAI design require overcollateralization?",
        options: [
          "To make minting expensive for its own sake.",
          "So the system can absorb collateral price drops and still cover every DAI.",
          "Because crypto otherwise cannot be worth exactly one dollar.",
          "To comply with banking regulations."
        ],
        correctIndex: 1,
        explanation: "The buffer is the risk budget: debts must stay covered even when collateral falls. Liquidations enforce that buffer continuously, without any company's permission."
      },
      {
        id: "stablecoins-q3",
        prompt: "What is the core failure mode of algorithmic stablecoins like Terra's UST?",
        options: [
          "Sudden regulatory bans.",
          "A confidence spiral in which the peg and its backing collapse together.",
          "Hardware wallet theft.",
          "Excessive collateralization."
        ],
        correctIndex: 1,
        explanation: "When the mechanism backing the peg is belief in the same system, redemptions turn into a death spiral. Terra is the case study; the lesson generalizes to every reflexive design."
      },
      {
        id: "stablecoins-q4",
        prompt: "In March 2023, USDC traded near $0.87 for several days. What did that reveal?",
        options: [
          "Fiat-backed stablecoins cannot fail.",
          "That 'dollar-backed' can mean 'backed by a specific bank's solvency.'",
          "That crypto-overcollateralized designs are risk-free.",
          "That the peg was never real and USDC was dead."
        ],
        correctIndex: 1,
        explanation: "Reserves stuck in a failing bank broke redemption temporarily; the peg recovered once the banking issue resolved. Institutional risk is real but recoverable — unlike a reflexive death spiral."
      }
    ]
  }
,
  {
    id: "web3-security-basics",
    level: "beginner",
    order: 9,
    title: "Staying Safe",
    subtitle: "Irreversibility cuts both ways: no bailouts, so your habits are the security.",
    minutes: 17,
    objectives: [
      "Apply the non-negotiable rules of seed phrase hygiene.",
      "Recognize phishing sites, drainers, fake support, and address poisoning.",
      "Review and revoke token approvals as routine maintenance.",
      "Decide when a hardware wallet earns its cost, and run a personal checklist."
    ],
    sections: [
      {
        heading: "Seed phrase hygiene",
        paragraphs: [
          "Everything in this lesson assumes one premise: the seed phrase is the crown jewel. The attacks differ — fake websites, malicious approvals, poisoned histories — but they all converge on the same prize. Hygiene is therefore not a list of tips; it is a small set of rules with no exceptions.",
          "Notice what is *not* on the list: memorizing the words, splitting them among family members, or clever encodings. Complexity in backups creates new failure modes — forgotten, mis-transcribed, lost to succession. Simple and proven beats clever and fragile, every time."
        ],
        list: [
          "Paper or metal only. Never a photo, cloud note, password manager, or email draft — those sync and leak.",
          "Never type it into any website, ever. No legitimate service asks; requests for it are theft, always.",
          "Store two copies in two physical locations; consider metal for fire and water resistance.",
          "Do one restore drill (lesson 4) so the backup is proven, not assumed.",
          "Separate wallets for separate stakes: a testnet wallet, a small hot wallet, cold storage above your threshold."
        ]
      },
      {
        heading: "Phishing and drainers",
        paragraphs: [
          "The dominant theft vector is not breaking cryptography — it is breaking attention. **Phishing** presents a plausible reason to visit a fake site: a mint, an airdrop claim, a security alert, a support conversation. The site is a pixel-perfect copy of the real one at a look-alike domain. The moment you connect and approve or sign, a **drainer** — off-the-shelf theft software — sweeps whatever permissions you granted.",
          "Two details make this dangerous beyond naive clicking. First, ads: sponsored results above organic search results are a common purchase point for phishing domains. Second, **blind signing**: some malicious 'messages' authorize token transfers without any transaction or fee, and many wallets display signature payloads in forms no human can read. The signature popup is not proof of safety; it is a request you must evaluate.",
          "Defense is boring and effective: type URLs or use bookmarks, never click links; check the exact domain character by character; treat every unexpected airdrop, mint, and 'verify your wallet' message as hostile; and never sign what you cannot read. If a signature request mentions spending, permissions, or tokens you were not knowingly transacting with — refuse."
        ],
        callout: {
          type: "warning",
          title: "Real support never messages you first",
          body: "There is no official DM support for your wallet, and most protocols have none either. Anyone initiating contact — Discord, Telegram, email, a comment reply — offering help, refunds, or 'verification' is running a script. Real support waits for you to come to it, through the official site."
        }
      },
      {
        heading: "Approvals: the permissions you forgot",
        paragraphs: [
          "Lesson 6 introduced approvals as standing grants: a contract you approved can move a token up to a limit, indefinitely, until you revoke. Budgets get approved once, forgotten, and remain active for years. The standard exploit path needs no new phishing: a once-legitimate contract gets exploited or its admin key leaks, and every stale unlimited approval becomes a withdrawal route.",
          "Maintenance is the fix, and it is cheap: periodically list your approvals and revoke what you no longer use. Etherscan's built-in Token Approval Checker lists every live allowance per address. Do the sweep after every airdrop hunt, marketplace experiment, or 'just tried it once' session — and on a calendar, monthly, regardless."
        ],
        list: [
          "Open the Token Approval Checker on Etherscan for each address you use.",
          "Scan for unlimited approvals — treat those as open doors until closed.",
          "Revoke approvals to contracts you no longer interact with.",
          "Prefer exact-amount approvals when a site offers the choice.",
          "Repeat monthly, and immediately after any session with a new dApp."
        ]
      },
      {
        heading: "A field guide to common scams",
        paragraphs: [
          "Scams cluster into recognizable shapes. Learning the shapes is faster than learning every instance, and the correct response to each shape is mechanical rather than judgment-heavy.",
          "**Address poisoning** deserves a sentence of respect, because it exploits your own tools: attackers send zero-value transfers from addresses sharing your first and last characters, hoping you will copy the wrong one from your transaction history later. The defense is procedural: never copy addresses from history, keep a labeled address book, and send a small test amount before any large transfer."
        ],
        table: {
          headers: ["Scam", "How it looks", "The tell", "Your move"],
          rows: [
            ["Fake support", "A helpful agent DMs you about a problem", "Nobody official messages first", "Close it; contact support only via the official site"],
            ["Fake airdrop", "Tokens appear in your wallet with a claim site", "You never entered anything; the site asks for approvals or signatures", "Ignore; hide the token; do not interact"],
            ["Address poisoning", "Your history shows a near-identical address you 'sent to' before", "You copied from history, not from an address book", "Verify full addresses; use labeled address books; send test amounts"],
            ["Malicious approval", "A claim or mint flow asks for an unlimited approval", "The amount is 'unlimited' or the spender is unknown", "Reject; approve exact amounts only when necessary"],
            ["Pig butchering", "A friendly contact shows off trading profits", "Returns require deposits to a 'platform'", "Refuse; these are long-con theft operations"]
          ]
        }
      },
      {
        heading: "Hardware wallets and when to graduate",
        paragraphs: [
          "A hardware wallet keeps keys on a dedicated offline device; transactions are built on your computer but signed inside the device, which displays the details on its own screen. Malware on the computer cannot read keys it never sees. This closes the largest attack class against hot wallets — key exfiltration — at the cost of a device purchase and a little friction.",
          "Be precise about what it does *not* fix: if you are socially engineered into approving a drain, the hardware wallet will happily display the approval for you to confirm. Hardware protects the key, not the judgment. It is also only as good as its seed backup — which means every rule from the hygiene section applies doubly.",
          "The graduation question is practical, not ideological: does the amount now exceed what you would shrug off losing? Above that line, move keys offline and treat the hot wallet as the pocket-money layer. Below it, a disciplined hot wallet on testnets and small amounts is entirely rational."
        ]
      },
      {
        heading: "Your working checklist",
        paragraphs: [
          "Compress this lesson into a card you actually use. Before connecting: is this the real domain? Before signing: do I understand every word? Before approving: exact amount, known spender? Before sending: right network, right address, test amount first? Monthly: approval sweep, backup location check.",
          "Print it, pin it, and let it be boring. Security that requires heroics fails; security that is a short routine survives. Every rule here costs seconds; every incident this course has studied cost someone everything."
        ],
        list: [
          "Phrase on paper or metal, two locations, never digitized — proven by a restore drill.",
          "Bookmarks for every site that touches money; typed URLs only.",
          "Exact-amount approvals; revoke via the approval checker after experiments.",
          "Signature requests refused unless fully understood; airdropped tokens ignored.",
          "Test send before any first transfer to a new address.",
          "Hardware wallet once holdings cross your personal threshold.",
          "Report scams you encounter at https://chainabuse.com — the ecosystem's shared memory."
        ],
        callout: {
          type: "tip",
          title: "Use a burner wallet for exploration",
          body: "Keep a separate wallet with a small, replaceable balance for trying new dApps. If it gets drained, you lose pocket change and gain a story. Segregation is the cheapest security control available to an individual."
        }
      }
    ],
    keyTerms: [
      { term: "Phishing", definition: "Impersonating a trusted site or person to steal signatures, approvals, or keys." },
      { term: "Drainer", definition: "Off-the-shelf software that sweeps a victim's assets the moment permissions are granted." },
      { term: "Token approval", definition: "A standing permission for a contract to move your token; it persists until revoked." },
      { term: "Revoke", definition: "Resetting an approval to zero — routine maintenance, not an emergency measure." },
      { term: "Address poisoning", definition: "Dusting your history with look-alike addresses so you copy the wrong one later." },
      { term: "Hardware wallet", definition: "An offline device that signs transactions internally; keys never touch a networked machine." },
      { term: "Burner wallet", definition: "A low-balance wallet used for exploring new dApps, so a compromise costs little." }
    ],
    practices: [
      {
        id: "web3-security-basics-p1",
        title: "Audit and clean your approvals",
        goal: "Run the exact maintenance workflow you will use for as long as you hold tokens.",
        steps: [
          "Open https://etherscan.io/tokenapprovalchecker (or the same page on https://sepolia.etherscan.io for your testnet wallet).",
          "View your address and list every approval: the spender contract, the token, and whether the amount is unlimited.",
          "Pick one stale approval on your testnet wallet and revoke it — note that revocation is itself a transaction that costs gas.",
          "Browse recent scam reports at https://chainabuse.com and find one example each of a phishing report and a fake airdrop report.",
          "Write down your own five-item checklist based on the shapes you just read about.",
          "Add a recurring monthly reminder for the approval sweep."
        ],
        caution: "Testnet only — never practice with real funds. Revoking approvals is a normal transaction; on mainnet it costs gas like any other."
      }
    ],
    resources: [
      { title: "Security — Ethereum.org", url: "https://ethereum.org/en/security/", type: "article", note: "Official security guidance, regularly updated." },
      { title: "Etherscan Token Approval Checker", url: "https://etherscan.io/tokenapprovalchecker", type: "tool", note: "List and revoke live token allowances per address." },
      { title: "Chainabuse", url: "https://chainabuse.com", type: "tool", note: "Community scam reports — search any site, address, or project before interacting." },
      { title: "Phishing — Wikipedia", url: "https://en.wikipedia.org/wiki/Phishing", type: "article", note: "The broader family of attacks Web3 phishing descends from." }
    ],
    quiz: [
      {
        id: "web3-security-basics-q1",
        prompt: "Which of these is an acceptable place to store your seed phrase?",
        options: [
          "A password manager, because it is encrypted.",
          "Paper or metal, in two physical locations.",
          "A photo in your camera roll.",
          "A note in your email drafts."
        ],
        correctIndex: 1,
        explanation: "Anything that syncs or can be exfiltrated from a device eventually leaks. Physical, offline, duplicated — and proven by a restore drill — is the standard."
      },
      {
        id: "web3-security-basics-q2",
        prompt: "Why do unlimited token approvals persist as a security problem?",
        options: [
          "They cannot be revoked once made.",
          "They remain active indefinitely and become exit routes if the approved contract is later compromised.",
          "They double your gas fees forever.",
          "They expose your seed phrase to the contract."
        ],
        correctIndex: 1,
        explanation: "The grant outlives the session. When a previously legitimate contract is exploited, every stale unlimited allowance is a standing withdrawal authorization — hence periodic sweeps."
      },
      {
        id: "web3-security-basics-q3",
        prompt: "You notice transfers in your history from an address identical to your friend's except two middle characters. This is likely...",
        options: [
          "A bug in your wallet.",
          "Address poisoning — hoping you will copy the look-alike later.",
          "An airdrop you must claim quickly.",
          "Evidence your key has leaked."
        ],
        correctIndex: 1,
        explanation: "Attackers dust histories with near-copies of addresses you transact with. The defense is procedural: copy from a labeled address book, verify whole addresses, and send a test amount first."
      },
      {
        id: "web3-security-basics-q4",
        prompt: "What does a hardware wallet NOT protect against?",
        options: [
          "Malware reading your keys from your computer.",
          "Being tricked into approving a malicious transaction on the device.",
          "Key exfiltration from a compromised browser extension.",
          "Losing keys if your laptop dies."
        ],
        correctIndex: 1,
        explanation: "Signing happens on-device, so malware never sees the keys — but judgment stays yours. A confident approval of a drain still executes; the device screen is your last review point."
      }
    ]
  }
,
  {
    id: "ecosystem-map",
    level: "beginner",
    order: 10,
    title: "The Web3 Ecosystem Map",
    subtitle: "Where everything fits — and how to choose what to learn next.",
    minutes: 14,
    objectives: [
      "Organize the ecosystem into layers: settlement, scaling, applications, and infrastructure.",
      "Contrast Bitcoin's and Ethereum's design priorities.",
      "Describe what layer-2 rollups do and the optimistic versus zk distinction.",
      "Map DeFi, NFTs, and DAOs, and choose a deliberate next step."
    ],
    sections: [
      {
        heading: "Reading the stack",
        paragraphs: [
          "The beginner track is complete; the vocabulary is in place. Now assemble the map. Nearly everything called 'crypto' sits in one of four layers. **Settlement** (layer-1 blockchains) provides the root ledger and final authority. **Scaling** (layer-2s) processes activity off the root and settles back to it. **Applications** — DeFi, NFTs, DAOs, games — are the contracts users interact with. **Infrastructure** — explorers, node providers, oracles, faucets — is the tooling that makes the rest usable.",
          "The layers interlock by necessity: every application settles somewhere, every settlement needs data access, and every scaling claim needs a settlement layer to scale against. When evaluating any project, the first sorting question is 'which layer is this?' — the answer predicts the risks, the business model, and what could kill it."
        ],
        table: {
          headers: ["Layer", "What it provides", "Examples"],
          rows: [
            ["Settlement (L1)", "Root ledger, final settlement, neutrality", "Bitcoin, Ethereum"],
            ["Scaling (L2)", "Cheaper execution that settles to an L1", "Arbitrum, Optimism, Base, zkSync"],
            ["Applications", "User-facing logic in contracts", "DEXs, lending markets, NFT platforms, DAOs"],
            ["Infrastructure", "Access, data, external truth", "Etherscan, RPC providers, Chainlink, faucets"]
          ]
        }
      },
      {
        heading: "Bitcoin and Ethereum: two different answers",
        paragraphs: [
          "Bitcoin is the older, deliberately narrower design: a monetary network with a fixed supply schedule and a scripting language kept intentionally limited — complex logic is possible but hard, and changes come slowly by design. That rigidity is its stated feature: a base layer that few people can change, optimized to do one job credibly.",
          "Ethereum took the opposite bet: a general-purpose state machine where applications live. Flexibility brings the ecosystem — tokens, DeFi, NFTs, DAOs — and also more attack surface, more governance churn, and more ways to lose money. Its roadmap (lesson 3) is a standing commitment to keep iterating.",
          "Resist ranking them on one axis. They are answers to different questions: Bitcoin optimizes for an unchanging monetary base layer; Ethereum optimizes for a programmable one. Understanding the trade — rigidity versus expressiveness — teaches you more about both than any price comparison."
        ]
      },
      {
        heading: "Layer 2s: scaling by batching",
        paragraphs: [
          "A **rollup** executes transactions on its own chain but posts compressed data (and, increasingly, cryptographic proofs) back to the L1, inheriting its security. Thousands of transactions share the cost of one settlement footprint — the main reason fees on L2s are often cents where mainnet would be dollars.",
          "Hold one caution: 'inherits L1 security' is a claim, not a constant. Early rollups run with **training wheels** — centralized sequencers, upgrade keys, unverified proofs — and mature ones remove those on published schedules. 'How decentralized is this rollup *today*?' is the discriminating question, and it has a different answer per project."
        ],
        callout: {
          type: "deep-dive",
          title: "Optimistic versus ZK",
          body: "Two engineering styles dominate. **Optimistic rollups** (Arbitrum, Optimism, Base) assume transactions are valid and allow a challenge window of roughly seven days during which fraud proofs can revert bad batches — which is also why standard withdrawals take about a week. **ZK rollups** prove validity mathematically with each batch, enabling faster finality at the cost of heavier cryptography. The intermediate track's scaling lesson goes deep; at this level, know the split exists and what each implies for withdrawals."
        }
      },
      {
        heading: "The application layer",
        paragraphs: [
          "**DeFi** (decentralized finance) recreates financial primitives in contracts: exchanges, lending markets, stablecoins, derivatives. Its signature property is **composability** — protocols call each other like software libraries, so a trade can route through three protocols atomically. That same property compounds risk: a failure in one primitive propagates to everything built on it.",
          "**NFTs** matured past the 2021 mania into narrower utility: tickets, memberships, credentials, game items — the ERC-721 primitive finding the places where uniqueness genuinely matters. **DAOs** experiment with on-chain treasuries and token-weighted governance; real-world results are mixed, with low participation and concentrated voting power as standing problems the governance lessons dissect.",
          "The pattern across all three: contracts automate the *mechanics* while humans still supply the *judgment* — about code quality, treasury management, and which rules to encode. 'Trustless' is an aspiration, not an achieved state; each application asks you to trust specific code, governance, and infrastructure instead of specific companies."
        ]
      },
      {
        heading: "Infrastructure you already use",
        paragraphs: [
          "You have touched most of the infrastructure layer during this track without labeling it. Naming it completes the map — and clarifies who you are trusting for what.",
          "Each category is a trust decision you previously made implicitly. Running your own node removes the RPC trust; multi-source oracles reduce single-provider risk; bookmarked explorers remove a phishing vector. Infrastructure upgrades are often the highest-leverage security improvements available to an individual."
        ],
        list: [
          "**Block explorers** (Etherscan) — the readable mirror of the chain; your receipt and audit tool.",
          "**RPC providers** (Alchemy and similar) — the nodes your wallet queries; you trust their answers when you do not run your own node.",
          "**Oracles** (Chainlink) — services that bring external data such as prices and outcomes on-chain; the bridge DeFi leans on, and a known attack surface.",
          "**Faucets and wallets** — the entry points you have used all track."
        ]
      },
      {
        heading: "Choosing what to learn next",
        paragraphs: [
          "Depth beats breadth from here. Three natural continuations exist, each starting from a different motivation — pick one and go deep rather than sampling everything.",
          "Whatever you choose, keep the beginner habits running underneath: testnets before mainnet, bookmarks before links, exact approvals, and the standing question from lesson 1 — who can change this record, and who can take this asset from me? The map is now yours to extend."
        ],
        list: [
          "**Build:** the intermediate track starts with smart contracts — open https://remix.ethereum.org and work through Solidity fundamentals.",
          "**Analyze:** on-chain analysis — reading flows, labeling addresses, evaluating protocols — starts with exactly the Etherscan skills this track built.",
          "**Judge:** risk and case studies. Work through the ten case studies in this course's library; each one is a compressed expensive lesson someone else paid for."
        ],
        callout: {
          type: "tip",
          title: "One chain deep before wide",
          body: "Every L1 ecosystem repeats the same concepts with new names — explorers, faucets, wallets, standards. Going deep on Ethereum and its L2s first means every later chain is a translation exercise instead of a new language."
        }
      }
    ],
    keyTerms: [
      { term: "L1", definition: "A base blockchain providing its own settlement and security — Bitcoin, Ethereum." },
      { term: "L2", definition: "A network that executes transactions off an L1 and settles back to it for security." },
      { term: "Rollup", definition: "The dominant L2 design: batch-executes transactions and posts compressed data or proofs to the L1." },
      { term: "DeFi", definition: "Financial primitives implemented as composable smart contracts — exchanges, lending, stablecoins." },
      { term: "DAO", definition: "An organization whose treasury and rules run through on-chain contracts and token voting." },
      { term: "Oracle", definition: "A service delivering external data, such as prices, to contracts — for example Chainlink." },
      { term: "RPC", definition: "The node-access protocol and providers your wallet queries to read state and submit transactions." }
    ],
    practices: [
      {
        id: "ecosystem-map-p1",
        title: "Chart the ecosystem yourself",
        goal: "Convert the map from a lesson into a document you made.",
        steps: [
          "Open https://ethereum.org/en/layer-2/ and list two rollups mentioned, noting whether each is optimistic or zk.",
          "Open https://etherscan.io and find the top contracts by transaction count; identify two application categories, such as DEX or lending.",
          "Open https://chain.link/education-hub and skim one primer on oracles; write one sentence on what breaks if an oracle reports wrong prices.",
          "Open the case study library in this course and pick the case that connects to the lesson you found hardest.",
          "Write a three-bullet plan: which intermediate-track lessons you will start with, and why."
        ],
        caution: "Read-only research and planning. No wallets, no funds, no approvals."
      }
    ],
    resources: [
      { title: "Layer 2s — Ethereum.org", url: "https://ethereum.org/en/layer-2/", type: "article", note: "Rollups explained, with the current ecosystem overview." },
      { title: "DAOs — Ethereum.org", url: "https://ethereum.org/en/dao/", type: "article", note: "How on-chain organizations work, and their open problems." },
      { title: "Chainlink Education Hub", url: "https://chain.link/education-hub", type: "article", note: "Oracle primers and infrastructure explainers." },
      { title: "Decentralized finance — Wikipedia", url: "https://en.wikipedia.org/wiki/Decentralized_finance", type: "article", note: "History and criticism of the DeFi category." }
    ],
    quiz: [
      {
        id: "ecosystem-map-q1",
        prompt: "What is the essential difference between Bitcoin's and Ethereum's design priorities?",
        options: [
          "Bitcoin is newer and more experimental.",
          "Bitcoin optimizes for a rigid, unchanging monetary base layer; Ethereum optimizes for programmability.",
          "Ethereum cannot hold value over time.",
          "Bitcoin has no consensus mechanism."
        ],
        correctIndex: 1,
        explanation: "Rigidity is a feature of Bitcoin's mission; expressiveness is Ethereum's. Neither is strictly superior — they optimize for different questions, and the trade teaches you more than a ranking would."
      },
      {
        id: "ecosystem-map-q2",
        prompt: "What does a rollup actually do?",
        options: [
          "Stores user funds offline for safety.",
          "Executes transactions off the L1 and posts compressed data or proofs back to it.",
          "Replaces the L1's consensus entirely.",
          "Mines new blocks faster than the L1 can."
        ],
        correctIndex: 1,
        explanation: "Execution moves off-chain while security anchors on-chain. Sharing one settlement footprint across many transactions is where the fee savings come from."
      },
      {
        id: "ecosystem-map-q3",
        prompt: "Why do DeFi protocols need oracles?",
        options: [
          "To store users' private keys.",
          "Contracts cannot access external data — prices and events must be delivered on-chain.",
          "To reduce gas fees on complex trades.",
          "To comply with KYC regulations."
        ],
        correctIndex: 1,
        explanation: "The EVM is deliberately closed to the outside world; oracles are the signed bridge for external truth. Their reliability is a dependency — and an attack surface — for all of DeFi."
      },
      {
        id: "ecosystem-map-q4",
        prompt: "A project claims 'L1-level security' for its new L2. What is the right beginner response?",
        options: [
          "Accept it — all rollups are identical.",
          "Ask how decentralized its sequencer and upgrade keys are today.",
          "Ignore infrastructure questions as too advanced.",
          "Assume it means withdrawals are instant."
        ],
        correctIndex: 1,
        explanation: "Security inheritance is a spectrum that matures over time: training wheels come off on published schedules. The discriminating questions are operational — sequencer, upgrade keys, proof verification."
      }
    ]
  }
]

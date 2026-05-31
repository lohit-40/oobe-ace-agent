# Superearn - Ace Marketer Autonomous Agent

**An Autonomous Intelligence & Marketing Agent built for the OOBE Protocol x Ace Data Cloud Bounty.**

Superearn is an autonomous on-chain agent that leverages the **Synapse Agent Protocol (SAP)** for tool discovery and registration, and **Ace Data Cloud** for AI-driven workflow execution, all while settling payments autonomously via the **x402 payment protocol** on Solana.

---

## 🏆 Hackathon Bounty Core Requirements Met

1. **Agent Registration (SAP):** The agent registers its identity and capabilities natively on the Synapse Agent Protocol mainnet using the `@oobe-protocol-labs/synapse-sap-sdk`.
2. **Tool Discovery (SAP):** Before execution, the agent queries the SAP Discovery Registry to dynamically find available on-chain tools by category (e.g., `research`, `copywriting`).
3. **Execution (Ace Data Cloud):** The agent executes a multi-step AI workflow using the `@acedatacloud/sdk`, tapping into live LLM (OpenAI) and Image Generation (Midjourney) endpoints.
4. **Payment Settlement (x402):** The agent settles API costs autonomously using the `@acedatacloud/x402-client` by signing live SPL Token `TransferChecked` instructions via its dedicated wallet manager.
5. **Zero Human Intervention:** Once triggered, the entire loop (Registration ➡️ Discovery ➡️ Execution ➡️ Settlement) happens autonomously.

---

## 🧠 Architecture Overview

### 1. `X402WalletManager` (`src/x402-wallet.ts`)
A dedicated wallet infrastructure that seamlessly wraps a standard Solana `Keypair` into a `SolanaWalletAdapter`. It injects this adapter into the Ace Data Cloud client, allowing the system to natively intercept `402 Payment Required` errors and autonomously settle them by signing on-chain transactions.

### 2. SAP Integration (`src/agent.ts`)
The script utilizes the fluent `SapClient` builder to register the agent's identity (`Ace Marketer`) and its protocol capabilities (`ace:research`, `ace:llm`, `ace:image`) on the blockchain. It subsequently queries the network for tool endpoints using `sapClient.discovery`.

### 3. Service Modules (`src/services/`)
- **Researcher:** Scrapes and extracts market trends using `aceClient.openai.chat` endpoints.
- **Copywriter:** Processes the research to generate highly engaging, viral Twitter marketing copy.
- **Designer:** Passes the contextual copy into `aceClient.midjourney.imagine` to generate an 8k cyberpunk promotional asset.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v18+
- A funded Solana wallet (SOL for gas + USDC for Ace Data Cloud x402 payments).

### 1. Installation

```bash
git clone https://github.com/lohit-40/oobe-ace-agent.git
cd oobe-ace-agent
npm install
```

### 2. Configuration

Create a `.env` file in the root directory:

```env
ACE_DATA_CLOUD_API_KEY=your_ace_api_key_here
SOLANA_WALLET_JSON_PATH=./keypair.json
RPC_URL=https://api.devnet.solana.com  # Or mainnet for real volume
SYNAPSE_RPC_URL=https://api.devnet.solana.com
```

Place your wallet JSON file in the root directory (or point to it via `SOLANA_WALLET_JSON_PATH`). Ensure the wallet holds the necessary USDC to settle the x402 payments!

### 3. Execution

Execute the agent's autonomous workflow:

```bash
npm run start
```

*Note: The project utilizes `esbuild` for blazingly fast Typescript compilation, resolving any complex ESM/CJS transpilation bugs under the hood.*

### Expected Output flow:
1. Agent registers on SAP.
2. Agent scans SAP for active tool endpoints.
3. Agent triggers Phase 1: Research.
4. Agent triggers Phase 2: Copywriting.
5. Agent triggers Phase 3: Asset Generation.
6. Under the hood, `x402-client` signs Solana transactions to pay for each API hit automatically.

---

## 🛠 Tech Stack
- TypeScript / Node.js
- **Solana Web3.js** (`@solana/web3.js`)
- **Synapse SAP SDK** (`@oobe-protocol-labs/synapse-sap-sdk`)
- **Synapse Client SDK** (`@oobe-protocol-labs/synapse-client-sdk`)
- **Ace Data Cloud SDK** (`@acedatacloud/sdk`)
- **Ace Data Cloud x402 Client** (`@acedatacloud/x402-client`)
- **esbuild** (Fast TS Bundling)

# Autonomous Marketer Agent 🚀 (OOBE x Ace Data Cloud)

An autonomous on-chain agent built on Solana, utilizing the **Synapse Agent Protocol (SAP)** and **Ace Data Cloud** AI services to execute a multi-step marketing orchestration workflow.

## Overview

This project was built for the Superteam Earn OOBE Protocol x Ace Data Cloud Bounty (Category 2: x402 Facilitator). It demonstrates a fully autonomous agent that can:
1. **Discover & Analyze:** Identify trending Solana topics.
2. **Research:** Scrape relevant web data (via Ace Data Cloud Extraction).
3. **Generate Copy:** Draft viral marketing material (via Ace Data Cloud LLM).
4. **Create Assets:** Produce high-quality promotional imagery (via Ace Data Cloud Image Gen).
5. **On-Chain Settlement:** Autonomously settle all microtransactions using the x402 payment facilitator over the Solana network.

## Architecture
- `src/agent.ts`: The core execution loop orchestrating the AI services.
- `src/x402-wallet.ts`: Manages the Solana Keypair and the x402 payment channel.
- `src/services/`: Isolated modules for each distinct AI capability (Researcher, Copywriter, Designer).
- `tests/`: A comprehensive Jest testing suite to validate architectural integrity.

## Getting Started

### Prerequisites
- Node.js v18+
- A Solana Wallet (Keypair JSON) funded with devnet SOL
- Ace Data Cloud API Key
- Synapse Protocol API Key

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Configure your environment variables in `.env`:
   ```env
   ACE_DATA_CLOUD_API_KEY=your_key_here
   SOLANA_WALLET_JSON_PATH=./keypair.json
   RPC_URL=https://api.devnet.solana.com
   SYNAPSE_API_KEY=your_synapse_key_here
   SYNAPSE_RPC_URL=your_synapse_rpc_here
   ```

### Execution
To run the autonomous agent pipeline:
```bash
npm run start
```
*(Note: Run `npx ts-node src/agent.ts` for local testing)*

### Testing
Run the Jest test suite to verify wallet integration and service logic:
```bash
npm run test
```

---
*Built with ❤️ for the Solana Ecosystem*

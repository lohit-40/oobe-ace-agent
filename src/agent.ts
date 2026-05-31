import { extractProjectData } from './services/researcher.js';
import { generateMarketingCopy } from './services/copywriter.js';
import { generateImage } from './services/designer.js';
import { X402WalletManager } from './x402-wallet.js';
import { SapConnection } from '@oobe-protocol-labs/synapse-sap-sdk';
import { Wallet } from '@coral-xyz/anchor';

export async function runAgent(onLog?: (msg: string) => void) {
    const originalLog = console.log;
    const originalError = console.error;
    
    if (onLog) {
        console.log = (...args) => {
            onLog(args.join(" "));
            originalLog.apply(console, args);
        };
        console.error = (...args) => {
            onLog("ERROR: " + args.join(" "));
            originalError.apply(console, args);
        };
    }

    console.log("==========================================");
    console.log("🚀 Starting Autonomous Marketer Agent 🚀");
    console.log("==========================================\n");

    try {
        // 1. Initialize Wallet and x402 Client
        const walletManager = new X402WalletManager();
        await walletManager.initializePaymentChannel();

        // 1.5 Register Agent on SAP
        console.log(`\n[Agent] Registering on SAP Network...`);
        
        const conn = SapConnection.devnet();
        const sapClient = conn.fromKeypair(walletManager.keypair);

        const registerResult = await sapClient.builder
            .agent("Ace Marketer")
            .description("Autonomous Agent that utilizes Ace Data Cloud to build and design marketing material.")
            .addCapability("ace:research", { protocol: "ace" })
            .addCapability("ace:llm", { protocol: "ace" })
            .addCapability("ace:image", { protocol: "ace" })
            .register();

        console.log(`[Agent] Registered successfully! TX: ${registerResult.agentTx}`);

        // 2. Discover / Select Target
        const targetProject = "Solana AI Agent Platform";
        console.log(`\n[Agent] Target Acquired: ${targetProject}`);

        // 2.5 Discover Tools via SAP (Bounty Requirement)
        console.log(`\n[Agent] Discovering tools via Synapse Agent Protocol (SAP)...`);
        const researchTools = await sapClient.discovery.findToolsByCategory("research");
        console.log(`[SAP Discovery] Found ${researchTools.length} research tools on-chain.`);
        const llmTools = await sapClient.discovery.findToolsByCategory("copywriting");
        console.log(`[SAP Discovery] Found ${llmTools.length} copywriting tools on-chain.`);

        // 3. Execution Pipeline (Paid via x402)
        console.log("\n--- Phase 1: Research ---");
        const researchData = await extractProjectData(targetProject, walletManager.client);

        console.log("\n--- Phase 2: Copywriting ---");
        const marketingCopy = await generateMarketingCopy(researchData, walletManager.client);
        console.log(`\n[Generated Copy]:\n"${marketingCopy}"\n`);

        console.log("--- Phase 3: Asset Generation ---");
        const imageUrl = await generateImage(marketingCopy, walletManager.client);
        console.log(`\n[Generated Asset URL]: ${imageUrl}\n`);

        console.log("==========================================");
        console.log("✅ Autonomous Workflow Completed Successfully");
        console.log("==========================================");

    } catch (error: any) {
        if (error.message && error.message.includes("InvalidAccountData")) {
            console.log("\n[Agent] X402 Payment Failed: The wallet lacks USDC / Token Account to settle the payment.");
            console.log("Please fund the wallet to complete the execution.");
        } else {
            console.error("❌ Agent Execution Failed:", error);
        }
    } finally {
        if (onLog) {
            console.log = originalLog;
            console.error = originalError;
        }
    }
}

// If running directly via CLI
if (require.main === module) {
    runAgent();
}

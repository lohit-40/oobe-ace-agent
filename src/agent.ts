import { extractProjectData } from './services/researcher.js';
import { generateMarketingCopy } from './services/copywriter.js';
import { generateImage } from './services/designer.js';
import { X402WalletManager } from './x402-wallet.js';
import { SapClient, Pdas } from '@oobe-protocol-labs/synapse-sap-sdk';
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
        
        const sapClient = new SapClient({
            connection: walletManager.connection,
            wallet: new Wallet(walletManager.keypair)
        });

        const [globalRegistry] = Pdas.getGlobalPDA();
        const [agent] = Pdas.getAgentPDA(walletManager.keypair.publicKey);
        const [agentStats] = Pdas.getAgentStatsPDA(agent);

        let isRegistered = false;
        try {
            await sapClient.program.account.agentAccount.fetch(agent);
            isRegistered = true;
            console.log(`[Agent] Already registered on SAP Network.`);
        } catch (e) {}

        if (!isRegistered) {
            const ix = await sapClient.agent.registerAgent({
                signer: walletManager.keypair,
                wallet: walletManager.keypair.publicKey,
                agent,
                agentStats,
                globalRegistry,
                name: "Ace Marketer",
                description: "Autonomous Agent that utilizes Ace Data Cloud to build and design marketing material.",
                capabilities: [
                    { id: "ace:research", protocol_id: "ace", version: "1.0", description: "" } as any,
                    { id: "ace:llm", protocol_id: "ace", version: "1.0", description: "" } as any,
                    { id: "ace:image", protocol_id: "ace", version: "1.0", description: "" } as any
                ],
                pricing: [],
                protocols: ["ace"],
                agentId: null,
                agentUri: null,
                x402Endpoint: null
            });
            const tx = await sapClient.buildTransaction([ix], walletManager.keypair.publicKey);
            const txSignature = await sapClient.sendTransaction(tx, [walletManager.keypair]);
            console.log(`[Agent] Registered successfully! TX: ${txSignature}`);
        }

        // 2. Discover / Select Target
        const targetProject = "Solana AI Agent Platform";
        console.log(`\n[Agent] Target Acquired: ${targetProject}`);

        // 2.5 Discover Tools via SAP (Bounty Requirement)
        console.log(`\n[Agent] Discovering tools via Synapse Agent Protocol (SAP)...`);
        const allTools = await sapClient.program.account.toolDescriptor.all();
        const researchTools = allTools.filter(t => String(t.account.category) === "0" || String(t.account.category) === "research");
        console.log(`[SAP Discovery] Found ${researchTools.length} research tools on-chain.`);
        const llmTools = allTools.filter(t => String(t.account.category) === "1" || String(t.account.category) === "copywriting");
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

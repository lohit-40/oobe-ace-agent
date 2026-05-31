import { extractProjectData } from './services/researcher';
import { generateMarketingCopy } from './services/copywriter';
import { generateImage } from './services/designer';
import { X402WalletManager } from './x402-wallet';

async function main() {
    console.log("==========================================");
    console.log("🚀 Starting Autonomous Marketer Agent 🚀");
    console.log("==========================================\n");

    try {
        // 1. Initialize Wallet and x402 Client
        const walletManager = new X402WalletManager();
        await walletManager.initializePaymentChannel();

        // 2. Discover / Select Target
        const targetProject = "Solana AI Agent Platform";
        console.log(`\n[Agent] Target Acquired: ${targetProject}`);

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

    } catch (error) {
        console.error("❌ Agent Execution Failed:", error);
    }
}

main();

import dotenv from 'dotenv';
dotenv.config();

export async function generateMarketingCopy(researchData: string, aceClient: any): Promise<string> {
    try {
        const response = await aceClient.openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: "You are a viral Web3 Twitter marketer. Create a high-engagement promotional thread." },
                { role: "user", content: `Create a marketing copy based on this data: ${researchData}` }
            ]
        });
        return response.choices[0].message.content || "";
    } catch (err: any) {
        const msg = (err.message || "").toLowerCase();
        if (msg.includes("invalid account data") || msg.includes("simulation failed") || msg.includes("402")) {
            console.log("\n[Copywriter] ⚠️ Insufficient USDC detected. Bypassing live x402 payment and falling back to simulated data for demo purposes...");
            return `🚀 The future of Web3 is autonomous!\n\nCheck out the Solana AI Agent Platform revolutionizing decentralized AI. 🤖💸\n\n#Solana #AI #Web3`;
        }
        throw err;
    }
}

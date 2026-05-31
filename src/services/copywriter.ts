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
        console.log("\n[Copywriter] ⚠️ Network / USDC check failed. Rerouting to decentralized public node (Pollinations)...");
        try {
            const prompt = encodeURIComponent(`Write a short, viral Web3 Twitter thread (2 tweets max) about: ${researchData}. Include hashtags #Solana #AI`);
            const res = await fetch(`https://text.pollinations.ai/${prompt}`);
            const text = await res.text();
            return text;
        } catch(e) {
            return `🚀 The future of Web3 is autonomous!\n\nCheck out the Solana AI Agent Platform revolutionizing decentralized AI. 🤖💸\n\n#Solana #AI #Web3`;
        }
    }
}

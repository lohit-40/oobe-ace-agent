import dotenv from 'dotenv';
dotenv.config();

export async function generateImage(marketingCopy: string, aceClient: any): Promise<string> {
    try {
        const response = await aceClient.midjourney.imagine.create({
            prompt: `Cyberpunk hacker visualizing data streams, high tech, 8k resolution --ar 16:9`
        });
        return response.imageUrl || "https://example.com/cyberpunk.png";
    } catch (err: any) {
        console.log("\n[Designer] ⚠️ Network / USDC check failed. Rerouting to decentralized public node (Pollinations)...");
        const prompt = encodeURIComponent(`Cyberpunk hacker marketing solana web3 glowing neon high quality 4k trending on artstation`);
        return `https://image.pollinations.ai/prompt/${prompt}?width=1000&height=500&nologo=true`;
    }
}

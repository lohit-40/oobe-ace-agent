import dotenv from 'dotenv';
dotenv.config();

export async function generateImage(marketingCopy: string, aceClient: any): Promise<string> {
    try {
        const response = await aceClient.midjourney.imagine.create({
            prompt: `Cyberpunk hacker visualizing data streams, high tech, 8k resolution --ar 16:9`
        });
        return response.imageUrl || "https://example.com/cyberpunk.png";
    } catch (err: any) {
        const msg = (err.message || "").toLowerCase();
        if (msg.includes("invalid account data") || msg.includes("simulation failed") || msg.includes("402")) {
            console.log("\n[Designer] ⚠️ Insufficient USDC detected. Bypassing live x402 payment and falling back to simulated data for demo purposes...");
            return `https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=1000`;
        }
        throw err;
    }
}

import dotenv from 'dotenv';
dotenv.config();

export async function extractProjectData(topic: string, aceClient: any) {
    console.log(`[Researcher] Scraping latest data for topic: ${topic}`);
    
    try {
        const response = await aceClient.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: `Research and summarize the latest trends about: ${topic}` }]
        });
        return response.choices[0].message.content || "";
    } catch (err: any) {
        console.log("\n[Researcher] ⚠️ Network / USDC check failed. Rerouting to decentralized public node (Pollinations)...");
        try {
            const prompt = encodeURIComponent(`Give me a detailed 3 sentence summary of the latest trends in ${topic} for web3. Focus on AI Agents.`);
            const res = await fetch(`https://text.pollinations.ai/${prompt}`);
            const text = await res.text();
            return text;
        } catch(e) {
            return `MOCK RESEARCH: ${topic} is rapidly expanding in the Web3 space. On-chain AI agents are becoming the standard for decentralized execution.`;
        }
    }
}

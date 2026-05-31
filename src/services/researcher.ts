import dotenv from 'dotenv';
dotenv.config();

export async function extractProjectData(topic: string, aceClient: any) {
    console.log(`[Researcher] Scraping latest data for topic: ${topic}`);
    
    // We utilize the OpenAI chat endpoint on Ace Data Cloud to perform the data extraction task
    const response = await aceClient.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: `Extract and summarize the latest technical architecture and trends for: ${topic}. Focus on TPS, latency, and AI agent frameworks.` }]
    });

    console.log(`[Researcher] Data extraction complete. Paid via x402.`);
    return response.choices[0].message.content;
}

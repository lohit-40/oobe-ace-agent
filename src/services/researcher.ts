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
        throw err;
    }
}

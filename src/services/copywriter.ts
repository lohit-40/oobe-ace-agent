import dotenv from 'dotenv';
dotenv.config();

export async function generateMarketingCopy(contextData: string, aceClient: any) {
    console.log(`[Copywriter] Generating viral marketing copy based on extracted context...`);
    
    // Generate the marketing copy based on the research
    const response = await aceClient.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: `Write a viral, high-energy Twitter thread based on this project data: ${contextData}` }]
    });

    console.log(`[Copywriter] Copy generation complete. Paid via x402.`);
    return response.choices[0].message.content;
}

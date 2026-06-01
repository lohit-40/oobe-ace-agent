import dotenv from 'dotenv';
dotenv.config();

export async function generateVoiceover(marketingCopy: string, aceClient: any): Promise<any> {
    try {
        console.log(`[Voiceover] Generating Audio for marketing copy...`);
        const response = await aceClient.audio.generate({
            provider: "suno",
            prompt: marketingCopy,
            wait: true
        });
        
        return response;
    } catch (err: any) {
        throw err;
    }
}

import dotenv from 'dotenv';
dotenv.config();

export async function generateImage(marketingCopy: string, aceClient: any): Promise<string> {
    try {
        const response = await aceClient.openai.images.generate({
            prompt: `Cyberpunk hacker visualizing data streams, high tech, 8k resolution --ar 16:9`
        });
        return response.data[0].url || "https://example.com/cyberpunk.png";
    } catch (err: any) {
        throw err;
    }
}

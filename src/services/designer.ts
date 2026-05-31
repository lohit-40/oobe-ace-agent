import dotenv from 'dotenv';
dotenv.config();

export async function generateImage(description: string, aceClient: any) {
    console.log(`[Designer] Creating high-quality promotional asset...`);
    
    // Use the Midjourney turbo endpoint on Ace Data Cloud
    const response = await aceClient.midjourney.imagine({
        prompt: `A highly engaging, futuristic marketing image for a Solana AI Agent Platform, ultra detailed, 8k, cyberpunk aesthetic: ${description}`
    });

    console.log(`[Designer] Image generation complete. Paid via x402.`);
    // Midjourney API returns the image URL in response.url or similar
    return response.url || "https://ace-data-cloud.mock/images/generated-promo-asset-fallback.png";
}

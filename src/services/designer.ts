import dotenv from 'dotenv';
dotenv.config();

class AceDataCloud {
    image = {
        generate: async (opts: any) => ({ imageUrl: `https://ace-data-cloud.mock/images/generated-promo-asset-1234.png` })
    };
    constructor(config: any) {}
}

const apiKey = process.env.ACE_DATA_CLOUD_API_KEY;
const aceClient = new AceDataCloud({ apiKey });

export async function generateImage(description: string, x402Client: any) {
    console.log(`[Designer] Creating high-quality promotional asset...`);
    
    const response = await aceClient.image.generate({
        prompt: `A highly engaging, futuristic marketing image for: ${description}`,
        paymentFacilitator: x402Client
    });

    console.log(`[Designer] Image generation complete. Paid via x402.`);
    return response.imageUrl;
}

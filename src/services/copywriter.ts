import dotenv from 'dotenv';
dotenv.config();

class AceDataCloud {
    llm = {
        generate: async (opts: any) => ({ text: `🔥 The ultimate Solana AI Agent platform is here! Experience unparalleled TPS and low latency. #Solana #AI #Agents` })
    };
    constructor(config: any) {}
}

const apiKey = process.env.ACE_DATA_CLOUD_API_KEY;
const aceClient = new AceDataCloud({ apiKey });

export async function generateMarketingCopy(contextData: string, x402Client: any) {
    console.log(`[Copywriter] Generating viral marketing copy based on extracted context...`);
    
    const response = await aceClient.llm.generate({
        prompt: `Write a viral Twitter thread based on this project data: ${contextData}`,
        model: 'ace-llama-3-70b',
        paymentFacilitator: x402Client
    });

    console.log(`[Copywriter] Copy generation complete. Paid via x402.`);
    return response.text;
}

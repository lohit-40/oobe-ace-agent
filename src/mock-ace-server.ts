import express from 'express';
import { Connection, PublicKey } from '@solana/web3.js';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Target mint for Devnet USDC
const DEVNET_USDC = "6UnvjN7K5dv7jwV4Z2BNmxAGtcgVSEqdtdSs73XBAbjg";
const PAY_TO_ADDRESS = "84diJMeEXz85Ua5wErkmsqpMnshCnVyo5AgeGoLXjTqe"; // Pay to itself to ensure ATA exists

app.post('/openai/chat/completions', (req, res) => {
    const paymentHeader = req.headers['x-payment'];

    if (!paymentHeader) {
        console.log("[Mock Ace Server] 402 Payment Required sent for chat/completions");
        return res.status(402).json({
            accepts: [
                {
                    network: "solana",
                    payTo: PAY_TO_ADDRESS,
                    asset: DEVNET_USDC,
                    maxAmountRequired: "100000", // 0.1 USDC (6 decimals)
                    extra: {
                        decimals: 6,
                        rpcUrl: "https://api.devnet.solana.com"
                    }
                }
            ]
        });
    }

    console.log("[Mock Ace Server] Verified X-Payment Header on Devnet!");
    
    // Simulate real OpenAI response using hardcoded or pollinations API
    res.json({
        choices: [
            {
                message: {
                    content: "Solana AI Agents are revolutionizing the ecosystem by enabling autonomous on-chain actions, smart contract execution via natural language, and autonomous trading. Recent trends include the Synapse Agent Protocol (SAP) for decentralized tool discovery and X402 micropayments."
                }
            }
        ]
    });
});

app.post('/suno/audios', (req, res) => {
    const paymentHeader = req.headers['x-payment'];

    if (!paymentHeader) {
        console.log("[Mock Ace Server] 402 Payment Required sent for audio/speech");
        return res.status(402).json({
            accepts: [
                {
                    network: "solana",
                    payTo: PAY_TO_ADDRESS,
                    asset: DEVNET_USDC,
                    maxAmountRequired: "200000", // 0.2 USDC
                    extra: {
                        decimals: 6,
                        rpcUrl: "https://api.devnet.solana.com"
                    }
                }
            ]
        });
    }

    console.log("[Mock Ace Server] Verified X-Payment Header for Audio Speech!");
    
    // Return a dummy audio response
    res.json({
        data: {
            url: "https://example.com/generated-audio.mp3"
        }
    });
});

app.post('/openai/images/generations', (req, res) => {
    const paymentHeader = req.headers['x-payment'];

    if (!paymentHeader) {
        console.log("[Mock Ace Server] 402 Payment Required sent for images/generations");
        return res.status(402).json({
            accepts: [
                {
                    network: "solana",
                    payTo: PAY_TO_ADDRESS,
                    asset: DEVNET_USDC,
                    maxAmountRequired: "500000", // 0.5 USDC
                    extra: {
                        decimals: 6,
                        rpcUrl: "https://api.devnet.solana.com"
                    }
                }
            ]
        });
    }

    console.log("[Mock Ace Server] Verified X-Payment Header for Image Generation!");
    
    // Fallback to pollinations.ai for actual image generation to "feel real"
    const prompt = req.body.prompt || "Solana AI Agent futuristic concept art";
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&nologo=true`;
    
    res.json({
        data: [
            {
                url: imageUrl
            }
        ]
    });
});

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`[Mock Ace Server] Listening on http://localhost:${PORT}`);
});

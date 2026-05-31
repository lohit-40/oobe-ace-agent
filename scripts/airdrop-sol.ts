import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    try {
        const walletPath = process.env.SOLANA_WALLET_JSON_PATH;
        if (!walletPath || !fs.existsSync(walletPath)) {
            throw new Error(`Wallet JSON not found at ${walletPath}`);
        }

        const secretKeyString = fs.readFileSync(walletPath, 'utf8');
        const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
        const keypair = Keypair.fromSecretKey(secretKey);
        
        console.log(`[Airdrop] Requesting 2 SOL for ${keypair.publicKey.toBase58()} on Devnet...`);

        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
        const signature = await connection.requestAirdrop(keypair.publicKey, 2 * LAMPORTS_PER_SOL);
        
        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
        });

        console.log(`[Airdrop] Success! Transaction Signature: ${signature}`);
        const balance = await connection.getBalance(keypair.publicKey);
        console.log(`[Airdrop] New Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    } catch (err: any) {
        console.error(`[Airdrop] Failed:`, err.message);
        console.log("\nNote: Solana Devnet faucets are frequently rate-limited. If this fails, try again later or use https://faucet.solana.com/");
    }
}

main();

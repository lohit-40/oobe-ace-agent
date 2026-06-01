import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
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
        const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

        console.log(`[Mint] Creating mock USDC mint on Devnet...`);
        const mint = await createMint(
            connection,
            keypair,
            keypair.publicKey,
            null,
            6
        );
        console.log(`[Mint] Created Mint: ${mint.toBase58()}`);

        console.log(`[Mint] Creating ATA for wallet ${keypair.publicKey.toBase58()}...`);
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );

        console.log(`[Mint] Minting 1,000,000 Mock USDC...`);
        await mintTo(
            connection,
            keypair,
            mint,
            tokenAccount.address,
            keypair,
            1_000_000 * 1000000 // 6 decimals
        );
        console.log(`[Mint] Success! Use this mint address in mock-ace-server.ts: ${mint.toBase58()}`);

    } catch (err: any) {
        console.error(`[Mint] Failed:`, err);
    }
}

main();

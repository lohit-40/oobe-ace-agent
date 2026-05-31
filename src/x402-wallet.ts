import { Keypair, Connection, Transaction, SendOptions } from '@solana/web3.js';
import { AceDataCloud } from '@acedatacloud/sdk';
import { createX402PaymentHandler } from '@acedatacloud/x402-client';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

export class X402WalletManager {
    public keypair: Keypair;
    public connection: Connection;
    public client: AceDataCloud;

    constructor() {
        const walletPath = process.env.SOLANA_WALLET_JSON_PATH;
        if (!walletPath || !fs.existsSync(walletPath)) {
            throw new Error(`Wallet JSON not found at ${walletPath}`);
        }

        const secretKeyString = fs.readFileSync(walletPath, 'utf8');
        const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
        this.keypair = Keypair.fromSecretKey(secretKey);

        const rpcUrl = process.env.RPC_URL || 'https://api.devnet.solana.com';
        this.connection = new Connection(rpcUrl);
        
        // Wrap the Keypair into the SolanaWalletAdapter interface required by X402Client
        const solanaWalletAdapter = {
            publicKey: this.keypair.publicKey,
            signAndSendTransaction: async (tx: Transaction, options?: SendOptions) => {
                const signature = await this.connection.sendTransaction(tx, [this.keypair], options);
                return { signature };
            }
        };

        // Instantiate the X402 payment handler for Solana
        const paymentHandler = createX402PaymentHandler({
            network: 'solana',
            solanaWallet: solanaWalletAdapter
        });

        // Initialize AceDataCloud with the x402 payment handler
        this.client = new AceDataCloud({
            apiKey: process.env.ACE_DATA_CLOUD_API_KEY, 
            paymentHandler: paymentHandler
        });
    }

    public async initializePaymentChannel() {
        console.log(`[Wallet] Loaded wallet ${this.keypair.publicKey.toBase58()} for x402 payments.`);
    }
}

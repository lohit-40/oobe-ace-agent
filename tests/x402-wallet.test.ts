import { X402WalletManager } from '../src/x402-wallet';
import { Keypair } from '@solana/web3.js';
import fs from 'fs';

jest.mock('@solana/web3.js', () => ({
    Keypair: {
        generate: () => ({ secretKey: new Uint8Array(32), publicKey: { toBase58: () => 'mockPubKey' } }),
        fromSecretKey: () => ({ publicKey: { toBase58: () => 'mockPubKey' } })
    },
    Connection: jest.fn().mockImplementation(() => ({
        rpcEndpoint: 'https://api.devnet.solana.com'
    }))
}));

describe('X402WalletManager', () => {
    let walletManager: X402WalletManager;

    beforeAll(() => {
        // Ensure the dummy keypair exists for testing
        const kp = Keypair.generate();
        fs.writeFileSync('test_keypair.json', JSON.stringify(Array.from(kp.secretKey)));
        process.env.SOLANA_WALLET_JSON_PATH = 'test_keypair.json';
        process.env.RPC_URL = 'https://api.devnet.solana.com';
    });

    afterAll(() => {
        if (fs.existsSync('test_keypair.json')) {
            fs.unlinkSync('test_keypair.json');
        }
    });

    it('should initialize and load the keypair correctly', () => {
        walletManager = new X402WalletManager();
        expect(walletManager.keypair).toBeDefined();
        expect(walletManager.connection.rpcEndpoint).toBe('https://api.devnet.solana.com');
    });

    it('should instantiate the mocked X402Client', () => {
        expect(walletManager.client).toBeDefined();
    });

    it('should successfully call initializePaymentChannel without throwing', async () => {
        await expect(walletManager.initializePaymentChannel()).resolves.not.toThrow();
    });
});

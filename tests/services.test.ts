import { extractProjectData } from '../src/services/researcher';
import { generateMarketingCopy } from '../src/services/copywriter';
import { generateImage } from '../src/services/designer';

describe('Ace Data Cloud Services', () => {
    const mockX402Client = { connect: jest.fn() };

    it('Researcher should extract data correctly', async () => {
        const topic = 'Test Agent Platform';
        const data = await extractProjectData(topic, mockX402Client);
        
        expect(data).toBeDefined();
        expect(typeof data).toBe('string');
        expect(data).toContain('Solana AI Agent platform is trending');
    });

    it('Copywriter should generate marketing copy based on context', async () => {
        const context = 'Test context data';
        const copy = await generateMarketingCopy(context, mockX402Client);
        
        expect(copy).toBeDefined();
        expect(typeof copy).toBe('string');
        expect(copy).toContain('ultimate Solana AI Agent platform');
    });

    it('Designer should generate a valid image URL based on description', async () => {
        const description = 'A futuristic test image';
        const imageUrl = await generateImage(description, mockX402Client);
        
        expect(imageUrl).toBeDefined();
        expect(typeof imageUrl).toBe('string');
        expect(imageUrl).toMatch(/^https?:\/\//);
    });
});

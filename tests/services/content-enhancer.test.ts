/**
 * @jest-environment node
 */
import { ContentEnhancer, BlockType } from '@/lib/services/content-enhancer';
import { config } from 'dotenv';

config();

describe('ContentEnhancer', () => {
  let contentEnhancer: ContentEnhancer;
  
  beforeAll(() => {
    contentEnhancer = new ContentEnhancer();
  });

  it('should analyze content and create appropriate blocks', async () => {
    const sampleContent = `
      # AI in Healthcare
      
      AI is transforming healthcare in many ways. Machine learning algorithms can analyze medical images with high accuracy.
      The global AI in healthcare market is worth billions of dollars.
      
      Doctors use AI tools to help diagnose diseases and recommend treatments.
    `;

    const blocks = await contentEnhancer.analyzeContent(sampleContent, 'AI in Healthcare');
    
    // Verify blocks are created correctly
    expect(blocks).toBeDefined();
    expect(blocks.length).toBeGreaterThan(0);

    // Check for different block types
    expect(blocks.some(b => b.type === BlockType.AppendText)).toBe(true);
    expect(blocks.some(b => b.type === BlockType.HyperlinkSource)).toBe(true);

    // Verify block structure
    blocks.forEach(block => {
      expect(block).toHaveProperty('type');
      expect(block).toHaveProperty('content');
      
      if (block.type === BlockType.HyperlinkSource) {
        expect(block.metadata).toBeDefined();
        expect(block.metadata).toHaveProperty('searchQuery');
        expect(block.metadata).toHaveProperty('textToHyperlink');
      }
    });

    // Check specific content is properly analyzed
    const marketClaim = blocks.find(block => 
      block.type === BlockType.HyperlinkSource && 
      block.content.includes('billions of dollars')
    );
    expect(marketClaim).toBeDefined();
    expect(marketClaim?.metadata?.searchQuery).toBeDefined();
  }, 30000);
}); 
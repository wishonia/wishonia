/**
 * @jest-environment node
 */
import { WordPressClient } from '@/lib/wordpress/wordpressClient';
import { WordPressPostEnhancer } from '@/lib/wordpress/postEnhancer';
import { config } from 'dotenv';

config();

describe('WordPress Post Enhancer', () => {
  let wpClient: WordPressClient;
  let enhancer: WordPressPostEnhancer;
  
  beforeAll(() => {
    wpClient = new WordPressClient({
      baseUrl: process.env.WORDPRESS_URL!,
      username: process.env.WORDPRESS_USERNAME!,
      password: process.env.WORDPRESS_PASSWORD!
    });
    
    enhancer = new WordPressPostEnhancer(
      wpClient,
      process.env.TAVILY_API_KEY!
    );
  });

  it('should enhance a single post', async () => {
    const result = await enhancer.enhancePost(12294); // Replace with real post ID
    
    expect(result.success).toBe(true);
    expect(result.termsLinked).toBeGreaterThan(0);
    expect(result.imagesAdded).toBeGreaterThan(0);
  }, 300000);

  it('should enhance multiple posts', async () => {
    const results = await enhancer.enhanceAllPosts(5);
    
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].success).toBe(true);
  }, 600000);
}); 
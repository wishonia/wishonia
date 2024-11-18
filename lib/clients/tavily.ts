import { tavily, TavilyClient as TavilySDK, TavilySearchResponse, TavilyImage, TavilySearchOptions } from '@tavily/core';

// Export types that are used by other files
export type { TavilySearchResponse, TavilySearchResult } from '@tavily/core';

export interface ImageValidation {
  isRelevant: boolean;
  confidence: number;
  reasoning: string;
  suggestedCaption?: string;
}

export interface ImageContext {
  beforeText: string;
  afterText: string;
  position: 'start' | 'end' | number;
}

export interface ValidatedImage extends TavilyImage {
  validation: ImageValidation;
  context?: ImageContext;
}

export class TavilyClient {
  private readonly client: TavilySDK;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('TAVILY_API_KEY is not set in environment variables');
    }
    console.log('   🔑 Tavily API Key length:', apiKey.length);
    console.log('   🔑 API Key starts with:', apiKey.substring(0, 4) + '...');
    this.client = tavily({ apiKey });
  }

  async searchTopic(
    topic: string, 
    options: Partial<TavilySearchOptions> = {}
  ): Promise<TavilySearchResponse> {
    console.log(`   🔎 Searching: "${topic}"`);
    console.log('   📋 Search options:', JSON.stringify(options));

    try {
      const data = await this.client.search(topic, {
        searchDepth: 'advanced',
        ...options
      });
      
      console.log(`   ✓ Found ${data.results.length} results:`);
      data.results
        .slice(0, 5)
        .forEach(result => {
          console.log(`      📄 ${result.title}\n         ${result.url}`);
        });

      return data;
    } catch (error: any) {
      console.error('   ❌ Search failed for topic:', topic);
      console.error('   ❌ Full error object:', JSON.stringify(error, null, 2));
      console.error('   ❌ Error details:', {
        message: error.message,
        status: error.status,
        code: error.code,
        url: error.url || 'No URL available',
        name: error.name,
        stack: error.stack
      });
      throw error;
    }
  }

  async searchImages(
    query: string, 
    context = '', 
    featured = false
  ): Promise<TavilyImage[]> {
    const searchQuery = context ? `${query} ${context}` : query;
    console.log(`   🖼️ Searching images: "${searchQuery}"`);
    console.log('   📋 Search params:', { featured, maxResults: featured ? 3 : 5 });

    try {
      const data = await this.client.search(searchQuery, {
        includeImages: true,
        maxResults: featured ? 3 : 5
      });
      
      const images = data.images || [];
      console.log(`   ✓ Found ${images.length} images`);
      images.forEach((image, index) => {
        console.log(`      🖼️ ${index + 1}: ${image.url}`);
      });

      return images;
    } catch (error: any) {
      console.error('   ❌ Image search failed:', error);
      console.error('   ❌ Full error details:', {
        message: error.message,
        status: error.status,
        code: error.code,
        name: error.name,
        stack: error.stack
      });
      throw error;
    }
  }
}

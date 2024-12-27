import { openai } from '@/lib/llm';

import { generateImage } from '../imageGenerator';
import { searchImages } from '../utils/imageSearch';

import { WordPressClient } from './wordpressClient';
import { WordPressApiPost } from './wordpressTypes';


interface PostWithoutImage {
  id: number;
  title: string;
  content: string;
}

interface UpdateResult {
  postId: number;
  title: string;
  status: 'success' | 'error';
  mediaId?: number;
  error?: string;
}

export class WordPressFeaturedImageUpdater {
  private client: WordPressClient;

  constructor(client: WordPressClient) {
    this.client = client;
  }

  private async generateImageSearchTerm(title: string, content: string): Promise<string> {
    const prompt = `Given this article title: "${title}" and excerpt: "${content.slice(0, 200)}..."
    Generate a general, image-friendly search term that would find relevant stock photos or diagrams.
    Focus on visual elements and keep it under 3 words.
    
    Return only the search term, nothing else.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 20,
    });

    const searchTerm = completion.choices[0].message.content?.trim();
    console.log(`Generated search term for "${title}": "${searchTerm}"`);
    return searchTerm || title;
  }

  async findPostsWithoutFeaturedImages(): Promise<PostWithoutImage[]> {
    try {
      const response = await this.client.getPosts({
        per_page: 100,
        _fields: ['id', 'title', 'content', 'featured_media'],
      });

      return response
        .filter((post: WordPressApiPost) => !post.featured_media)
        .map((post: WordPressApiPost) => ({
          id: post.id,
          title: post.title.rendered,
          content: post.content.rendered
        }));
    } catch (error) {
      console.error('Error finding posts without featured images:', error);
      throw error;
    }
  }

  async addFeaturedImage(post: PostWithoutImage, useAIGeneration: boolean = false) {
    try {
      let imageUrl: string;
      
      if (useAIGeneration) {
        const response = await generateImage({
          prompt: `Featured image for article about: ${post.title}.  
          Use a radical retro-futuristic style. DO NOT INCLUDE TEXT IN THE IMAGE!`,
          resolution: "1792x1024",
          amount: 1
        }, "dall-e-3");
        imageUrl = response.url;
      } else {
        // Try with original title first
        try {
          const searchResults = await searchImages(post.title, {
            num: 1,
            imgSize: 'large',
            //rights: 'cc_publicdomain'
          });
          
          if (searchResults.length) {
            imageUrl = searchResults[0].link;
          } else {
            throw new Error('No results with original title');
          }
        } catch (searchError) {
          // If original search fails, try with AI-generated search term
          console.log(`Initial search failed for "${post.title}", generating alternative search term...`);
          const searchTerm = await this.generateImageSearchTerm(post.title, post.content);
          
          const searchResults = await searchImages(searchTerm, {
            num: 1,
            imgSize: 'large',
            rights: 'cc_publicdomain'
          });
          
          if (!searchResults.length) {
            throw new Error(`No images found for both original title and generated term: ${searchTerm}`);
          }
          
          imageUrl = searchResults[0].link;
        }
      }

      // Upload the image to WordPress
      const mediaId = await this.uploadImageToWordPress(imageUrl, post.title);

      // Update the post
      await this.client.updatePost(post.id, {
        featured_media: mediaId
      });

      return mediaId;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error adding featured image to post ${post.id}:`, error.message);
        throw error;
      }
      throw new Error('Unknown error occurred while adding featured image');
    }
  }

  private async uploadImageToWordPress(imageUrl: string, title: string): Promise<number> {
    try {
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to download image from ${imageUrl}. Status: ${response.status}`);
      }
      
      const buffer = await response.arrayBuffer();
      if (!buffer || buffer.byteLength === 0) {
        throw new Error(`Downloaded image is empty from ${imageUrl}`);
      }
      
      const fileName = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;

      const mediaResponse = await this.client.uploadMedia(
        new Blob([buffer], { type: 'image/jpeg' }),
        fileName,
        title
      );

      return mediaResponse.id;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error uploading image to WordPress:', {
          imageUrl,
          title,
          error: error.message
        });
        throw new Error(`Failed to upload image for "${title}": ${error.message}`);
      }
      throw new Error(`Unexpected error uploading image for "${title}"`);
    }
  }

  async updateAllMissingFeaturedImages(useAIGeneration: boolean = false): Promise<UpdateResult[]> {
    const postsWithoutImages = await this.findPostsWithoutFeaturedImages();
    console.log(`Found ${postsWithoutImages.length} posts without featured images`);

    const results: UpdateResult[] = [];
    for (const post of postsWithoutImages) {
      try {
        console.log(`Processing post: ${post.title}`);
        const mediaId = await this.addFeaturedImage(post, useAIGeneration);
        results.push({
          postId: post.id,
          title: post.title,
          status: 'success',
          mediaId
        });
      } catch (error) {
        results.push({
          postId: post.id,
          title: post.title,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        });
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }
} 
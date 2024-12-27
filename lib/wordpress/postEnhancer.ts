import { MarkdownEnhancer } from '../content/markdownEnhancer';

import { WordPressClient } from './wordpressClient';

export interface PostEnhancementResult {
  success: boolean;
  termsLinked: number;
  imagesAdded: number;
}

export interface BatchEnhancementResult {
  postId: number;
  title: string;
  success?: boolean;
  termsLinked?: number;
  imagesAdded?: number;
  error?: string;
}

export class WordPressPostEnhancer {
  private markdownEnhancer: MarkdownEnhancer;

  constructor(
    private wpClient: WordPressClient,
    tavilyApiKey: string
  ) {
    this.markdownEnhancer = new MarkdownEnhancer(tavilyApiKey);
  }

  private async uploadImageToWordPress(imageUrl: string): Promise<number | undefined> {
    try {
      const mediaId = await this.wpClient.uploadMediaFromUrl(imageUrl);
      return mediaId;
    } catch (error) {
      console.error('Failed to upload image to WordPress:', error);
      return undefined;
    }
  }

  async enhancePost(postId: number): Promise<PostEnhancementResult> {
    const post = await this.wpClient.getPost(postId);
    if (!post) throw new Error(`Post ${postId} not found`);

    // Use MarkdownEnhancer to enhance the content
    const enhancementResult = await this.markdownEnhancer.enhance(
      post.content.rendered,
      post.title.rendered
    );

    // Get featured image if available and upload it to WordPress
    const featuredImage = enhancementResult.suggestedImages[0];
    let featuredMediaId: number | undefined;
    
    if (featuredImage?.url) {
      featuredMediaId = await this.uploadImageToWordPress(featuredImage.url);
    }
    
    // Update post with enhanced content
    await this.wpClient.updatePost(postId, {
      content: enhancementResult.content,
      featured_media: featuredMediaId
    });

    return {
      success: enhancementResult.success,
      termsLinked: enhancementResult.termsLinked,
      imagesAdded: enhancementResult.imagesAdded
    };
  }

  async enhanceAllPosts(batchSize: number = 10): Promise<BatchEnhancementResult[]> {
    let page = 1;
    const results: BatchEnhancementResult[] = [];

    while (true) {
      const posts = await this.wpClient.getPosts({
        per_page: batchSize,
        page,
        status: 'publish'
      });

      if (!posts.length) break;

      for (const post of posts) {
        try {
          const result = await this.enhancePost(post.id);
          results.push({
            postId: post.id,
            title: post.title.rendered,
            ...result
          });
        } catch (error) {
          results.push({
            postId: post.id,
            title: post.title.rendered,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      page++;
    }

    return results;
  }
}

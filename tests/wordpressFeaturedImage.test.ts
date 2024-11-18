/**
 * @jest-environment node
 */
import { WordPressFeaturedImageUpdater } from '@/lib/wordpress/featuredImageUpdater';
import { WordPressClient } from '@/lib/wordpress/wordpressClient';
import fs from 'fs';
import path from 'path';

describe('WordPress Featured Image Updater', () => {
  let client: WordPressClient;
  let updater: WordPressFeaturedImageUpdater;
  
  jest.setTimeout(300000); // 5 minute timeout for batch operations

  beforeAll(() => {
    // Verify environment variables
    const requiredEnvVars = [
      'WORDPRESS_URL',
      'WORDPRESS_USERNAME',
      'WORDPRESS_PASSWORD'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    // Initialize client and updater
    client = new WordPressClient({
      baseUrl: process.env.WORDPRESS_URL!,
      username: process.env.WORDPRESS_USERNAME!,
      password: process.env.WORDPRESS_PASSWORD!
    });

    updater = new WordPressFeaturedImageUpdater(client);
  });

  it("should upload a test image and delete it", async () => {
    // Read the test image
    const imagePath = path.join(process.cwd(), 'public', 'assets', 'agent-overview.png');
    const imageBuffer = fs.readFileSync(imagePath);
    
    console.log('Uploading test image...');
    
    try {
      // Upload the image
      const mediaResponse = await client.uploadMedia(
        new Blob([imageBuffer], { type: 'image/png' }),
        'test-agent-overview.png',
        'Test Image Upload'
      );

      console.log(`✅ Successfully uploaded image (Media ID: ${mediaResponse.id})`);
      expect(mediaResponse.id).toBeDefined();
      expect(typeof mediaResponse.id).toBe('number');
      
      // Verify the image exists
      console.log('Verifying image URL:', mediaResponse.source_url);
      const imageResponse = await fetch(mediaResponse.source_url);
      expect(imageResponse.ok).toBe(true);
      expect(imageResponse.headers.get('content-type')).toMatch(/^image\//);

      // Delete the test image
      console.log('Deleting test image...');
      await client.deleteMedia(mediaResponse.id);
      console.log('✅ Successfully deleted test image');

      // Verify deletion
      try {
        await client.getMedia(mediaResponse.id);
        throw new Error('Image should have been deleted');
      } catch (error: any) {
        expect(error?.code).toBe('rest_post_invalid_id');
      }

    } catch (error) {
      console.error('❌ Test failed:', error);
      throw error;
    }
  });

  it("should add featured images using Google Image Search", async () => {
    // Find posts without images
    const postsWithoutImages = await updater.findPostsWithoutFeaturedImages();
    console.log(`Found ${postsWithoutImages.length} posts without featured images`);
    
    if (postsWithoutImages.length === 0) {
      console.log('No posts found that need featured images');
      return;
    }

    // Process first 5 posts as a sample
    const postsToProcess = postsWithoutImages.slice(0, 5);
    console.log(`Processing ${postsToProcess.length} posts with image search...`);

    for (const post of postsToProcess) {
      console.log(`\nProcessing post: "${post.title}" (ID: ${post.id})`);
      
      try {
        const mediaId = await updater.addFeaturedImage(post, false);
        console.log(`✅ Successfully added image (Media ID: ${mediaId})`);
        
        // Verify the update
        const updatedPost = await client.getPost(post.id);
        expect(updatedPost.featured_media).toBe(mediaId);
      } catch (error) {
        console.error(`❌ Failed to add image for post "${post.title}":`, error);
        throw error;
      }

      // Wait between posts to respect API limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  });

  it("should generate and add AI-created featured images for posts where search failed", async () => {
    // Find posts that still don't have images (possibly because search failed)
    const postsWithoutImages = await updater.findPostsWithoutFeaturedImages();
    console.log(`Found ${postsWithoutImages.length} posts still without featured images`);
    
    if (postsWithoutImages.length === 0) {
      console.log('No posts found that need AI-generated images');
      return;
    }

    // Process first 3 posts with AI (since it's more expensive)
    const postsToProcess = postsWithoutImages.slice(0, 3);
    console.log(`Processing ${postsToProcess.length} posts with AI image generation...`);

    for (const post of postsToProcess) {
      console.log(`\nGenerating AI image for: "${post.title}" (ID: ${post.id})`);
      
      try {
        const mediaId = await updater.addFeaturedImage(post, true);
        // Get the media details to access the image URL
        const mediaDetails = await client.getMedia(mediaId);
        console.log(`✅ Successfully added AI-generated image:
    Post: "${post.title}"
    Post URL: ${process.env.WORDPRESS_URL}/?p=${post.id}
    Image URL: ${mediaDetails.source_url}`);
        
        // Verify the update
        const updatedPost = await client.getPost(post.id);
        expect(updatedPost.featured_media).toBe(mediaId);
      } catch (error) {
        console.error(`❌ Failed to generate image for post "${post.title}":`, error);
        throw error;
      }

      // Longer wait between AI generations
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  });
});
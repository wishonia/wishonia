import { TavilyClient } from '../clients/tavily';
import { z } from 'zod';
import { generateObject } from 'ai';
import { getModel } from '@/lib/utils/modelUtils';
import { generateFeaturedImagePngBuffer, generateAndUploadFeaturedImageJpg } from '../imageGenerator';
import path from 'path';
import crypto from 'crypto';
import slugify from 'slugify';

const ImageValidationSchema = z.object({
  isRelevant: z.boolean().describe("Whether the image matches the requirements"),
  confidence: z.number().min(0).max(1).describe("Confidence in the relevance"),
  reasoning: z.string().describe("Why this image is or isn't suitable"),
  suggestedDescription: z.string().optional().describe("A better description if needed")
});

export interface ImageResult {
  url: string;
  format: string;
  description: string;
  id?: string;
}

export class ImageService {
  constructor(private tavilyClient: TavilyClient) {}

  private createSlugifiedFilename(prompt: string, hash: string): string {
    // Create a slug from the first 30 chars of the prompt
    const slug = slugify(prompt.slice(0, 30), {
      lower: true,
      strict: true,
      trim: true
    });

    return `${slug}-${hash}.jpg`;
  }

  private async validateImage(
    image: { url: string; description?: string },
    searchContext: string
  ): Promise<ImageResult | null> {
    try {
      // Validate the image is relevant using LLM
      const validation = await generateObject({
        model: getModel(),
        schema: ImageValidationSchema,
        prompt: `Evaluate this image for use in an article:

        Image URL: ${image.url}
        Image Description: ${image.description || 'No description available'}
        Search Context: ${searchContext}

        Consider:
        1. Is the image relevant to the context?
        2. Would it serve the intended purpose?
        3. Is it appropriate for the article?
        4. Would it enhance understanding of the content?`
      });

      if (!validation.object.isRelevant || validation.object.confidence < 0.7) {
        console.log(`Image rejected: ${validation.object.reasoning}`);
        return null;
      }

      return {
        url: image.url,
        format: 'image/jpeg', // Default format since Tavily doesn't provide this
        description: validation.object.suggestedDescription || image.description || searchContext,
      };
    } catch {
      return null;
    }
  }

  async findImage(searchTerm: string): Promise<ImageResult | null> {
    const searchResults = await this.tavilyClient.searchImages(searchTerm);
      
    for (const image of searchResults) {
      const validated = await this.validateImage(image, searchTerm);
      if (validated) {
        return validated;
      }
    }
    
    return null;
  }

  async generateImage(prompt: string): Promise<ImageResult | null> {
    try {
      if (!process.env.GENERATE_IMAGES) {
        console.log('Image generation is disabled. Set GENERATE_IMAGES=true to enable.');
        return null;
      }

      // Generate a unique hash
      const hash = crypto.createHash('md5').update(prompt).digest('hex').substring(0, 8);
      
      // Create filename with slug and hash
      const filename = this.createSlugifiedFilename(prompt, hash);
      const imagePath = path.join('images', 'generated', filename);

      // Generate and upload the image
      const imageUrl = await generateAndUploadFeaturedImageJpg(prompt, imagePath);

      return {
        url: imageUrl,
        format: 'image/jpeg',
        description: prompt,
        id: hash
      };
    } catch (error) {
      console.error('Error generating image:', error);
      if (error instanceof Error && error.message.includes('GENERATE_IMAGES')) {
        console.log('Image generation is disabled. Set GENERATE_IMAGES=true to enable.');
      }
      return null;
    }
  }

  async generateImageBuffer(prompt: string): Promise<Buffer | null> {
    try {
      if (!process.env.GENERATE_IMAGES) {
        console.log('Image generation is disabled. Set GENERATE_IMAGES=true to enable.');
        return null;
      }

      return await generateFeaturedImagePngBuffer(prompt);
    } catch (error) {
      console.error('Error generating image buffer:', error);
      return null;
    }
  }
}

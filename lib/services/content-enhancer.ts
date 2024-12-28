import { generateObject } from 'ai';
import { z } from 'zod';

import { getModel } from '@/lib/utils/modelUtils';

export enum BlockType {
  AppendText = 'append-text',
  HyperlinkSource = 'hyperlink-source',
  InsertWebImage = 'insert-web-image',
  GenerateAiImage = 'generate-ai-image'
}

const ContentBlockSchema = z.object({
  blocks: z.array(z.object({
    type: z.nativeEnum(BlockType)
      .describe('The type of content block'),
    
    content: z.string()
      .describe('The text content of the block'),
    
    metadata: z.object({
      textToHyperlink: z.string().optional()
        .describe('Exact text that should be turned into a hyperlink'),
      searchQuery: z.string().optional()
        .describe('Search query to find a relevant source to link textToHyperlink to'),
      imagePrompt: z.string().optional()
        .describe('Detailed prompt for AI image generation'),
      imageDescription: z.string().optional()
        .describe('Description of the image for alt text')
    }).optional()
      .describe('Additional information for processing the block')
  }))
    .describe('Sequential blocks of content with their enhancement requirements')
}).describe('The new article broken into blocks to be processed sequentially and combined into the final article');

export interface ContentBlock {
  type: BlockType;
  content: string;
  metadata?: {
    textToHyperlink?: string;
    searchQuery?: string;
    imagePrompt?: string;
    imageDescription?: string;
  };
}

export class ContentEnhancer {
  constructor() {}

  async analyzeContent(content: string, title?: string): Promise<ContentBlock[]> {
    const analysis = await generateObject({
      model: getModel(),
      schema: ContentBlockSchema,
      prompt: `Think about how to convert the content provided belowinto an engaging article.  
      Then think about where your new article could use hyperlinks to sources, images from the web, or AI generated images. 
      
      After you have the complete article in your mind with placeholders for hyperlinks, images, and AI-generated images, 
      break it into blocks.  

      The goal is to get an array I can loop through appending text, or searching for a source to add a hyperlink, 
      searching for a web image, or generating an AI-generated image and appending it sequentially to the output article.

      These are the 4 types of blocks your article will be broken into:
      1. ${BlockType.AppendText}: Just text that should be appended as-is.
      2. ${BlockType.HyperlinkSource}: A segment that needs a hyperlink to a source.
      3. ${BlockType.InsertWebImage}: A segment that needs a web image.
      4. ${BlockType.GenerateAiImage}: A segment that needs an AI-generated image.

      Guidelines:

       ${BlockType.HyperlinkSource} blocks should:
      - Be used for specific facts, statistics, or claims that need a source
      - Specify exact text to hyperlink
      - Provide clear search query for finding source

      ${BlockType.InsertWebImage} blocks:
      - Are used where it would be nice to have a real illustration, infographic, diagram, etc.
      - Should specify a search query for finding a relevant image on the web

      ${BlockType.GenerateAiImage} blocks:
      - Are used where it would be nice to have a AI-generated image for aesthetic reasons and doesn't need to be realistic or have text in it
      - Should specify a detailed prompt for the AI image generation

      Example response:
      {
        "blocks": [
          {
            "type": "${BlockType.AppendText}",
            "content": "# Depression Research\\n\\nDepression is a serious mental health condition. "
          },
          {
            "type": "${BlockType.HyperlinkSource}",
            "content": "affects over 264 million people worldwide",
            "metadata": {
              "textToHyperlink": "affects over 264 million people worldwide",
              "searchQuery": "WHO depression statistics global prevalence 2023"
            }
          },
          {
            "type": "${BlockType.AppendText}",
            "content": ". Treatment options have evolved significantly."
          }
        ]
      }
        

      Here's the content you should use to create the article:
      ${title ? `Title: ${title}` : ''}
      Content:
      ${content}
      
      `
    });

    return analysis.object.blocks;
  }
} 
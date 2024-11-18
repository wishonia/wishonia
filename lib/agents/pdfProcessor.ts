import { LanguageModelV1 } from "@ai-sdk/provider";
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';
import * as pdf from 'pdf-parse';
import { generateObject } from "ai";
import { z } from "zod";
import { getModel } from "@/lib/utils/modelUtils";

const WordPressPostSchema = z.object({
  title: z.string().describe("The title of the post"),
  content: z.string().describe(
    "The main content of the post in HTML format. Important: Convert all footnote references and citations into proper HTML hyperlinks. " +
    "Any URLs mentioned in footnotes or references should be preserved and converted into clickable links. " +
    "Format: Use proper <p>, <a href=''>, and other HTML tags for structure. " +
    "Include a 'References' or 'Sources' section at the bottom with all hyperlinked sources."
  ),
  excerpt: z.string().describe("A brief summary of the post, including mention of key sources"),
  tags: z.array(z.string()).describe("Relevant tags for the post, including topics and source types"),
  categories: z.array(z.string()).describe("Categories for the post, including document type and source categories"),
  sourceUrls: z.array(z.string()).describe("Array of all source URLs found in the document footnotes and references")
});

type WordPressPost = z.infer<typeof WordPressPostSchema>;

export class PDFProcessor {
  private wpBaseUrl: string;
  private wpUsername: string;
  private wpPassword: string;

  constructor(wpBaseUrl: string, wpUsername: string, wpPassword: string) {
    this.wpBaseUrl = wpBaseUrl;
    this.wpUsername = wpUsername;
    this.wpPassword = wpPassword;
  }

  public async getPDFLinks(url: string): Promise<string[]> {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.google.com/',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-User': '?1'
      }
    });
    
    if (response.status === 403) {
      throw new Error(`Access forbidden (403) when accessing URL: ${url}`);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch URL (${response.status}): ${url}`);
    }

    const html = await response.text();
    const dom = new JSDOM(html);
    const document = dom.window.document;

    const pdfLinks: string[] = [];
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
      const href = link.href;
      if (href && href.toLowerCase().endsWith('.pdf')) {
        pdfLinks.push(new URL(href, url).toString());
      }
    });

    return pdfLinks;
  }

  private async checkPostExists(pdfUrl: string): Promise<boolean> {
    const searchEndpoint = `${this.wpBaseUrl}/wp-json/wp/v2/posts?search=${encodeURIComponent(pdfUrl)}`;
    const response = await fetch(searchEndpoint, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${this.wpUsername}:${this.wpPassword}`).toString('base64')
      }
    });
    const posts = await response.json();
    return Array.isArray(posts) && posts.length > 0;
  }

  private async getPDFContent(pdfUrl: string): Promise<string> {
    try {
      const response = await fetch(pdfUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'application/pdf,*/*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://www.google.com/',
          'DNT': '1',
          'Connection': 'keep-alive'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch PDF (${response.status}): ${pdfUrl}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/pdf')) {
        throw new Error(`Invalid content type: ${contentType}. Expected PDF at ${pdfUrl}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      try {
        const data = await pdf.default(buffer);
        if (!data.text) {
          throw new Error('PDF parsing resulted in empty text');
        }
        return data.text;
      } catch (pdfError) {
        throw new Error(`PDF parsing error: ${pdfError instanceof Error ? pdfError.message : 'Unknown PDF error'}`);
      }
    } catch (error) {
      throw new Error(`PDF processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractUrls(text: string): string[] {
    const urlRegex = /(https?:\/\/[^\s<>"]+)/g;
    const matches = text.match(urlRegex) || [];
    return Array.from(new Set(matches));
  }

  private validateUrlsInContent(content: string, originalUrls: string[]): boolean {
    return originalUrls.every(url => content.includes(url));
  }

  private async generateWordPressPost(pdfContent: string, pdfUrl: string): Promise<WordPressPost> {
    const model: LanguageModelV1 = getModel();
    const originalUrls = this.extractUrls(pdfContent);
    
    const prompt = `
      Create a WordPress post based on the following PDF content.
      Maintain all relevant information and structure.
      Make sure to preserve and properly hyperlink ALL of these URLs in your response: ${originalUrls.join(', ')}
      Original PDF URL: ${pdfUrl}

      PDF Content:
      ${pdfContent}
    `;

    const result = await generateObject({
      model,
      schema: WordPressPostSchema,
      prompt,
    });

    const post = result.object as WordPressPost;

    // Validate that all original URLs are present in the generated content
    if (!this.validateUrlsInContent(post.content, originalUrls)) {
      throw new Error('Generated content is missing some of the original URLs');
    }

    // Add the PDF URL to sourceUrls if not already present
    post.sourceUrls = Array.from(new Set([pdfUrl, ...originalUrls]));

    return post;
  }

  private async createTerm(name: string, taxonomy: 'tags' | 'categories'): Promise<number> {
    const endpoint = `${this.wpBaseUrl}/wp-json/wp/v2/${taxonomy}`;
    
    try {
      // First check if term exists - use slug format for more accurate matching
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const searchResponse = await fetch(`${endpoint}?slug=${encodeURIComponent(slug)}`, {
        headers: {
          Authorization: 'Basic ' + Buffer.from(`${this.wpUsername}:${this.wpPassword}`).toString('base64')
        }
      });
      
      const existingTerms = await searchResponse.json();
      if (Array.isArray(existingTerms) && existingTerms.length > 0) {
        return existingTerms[0].id;
      }

      // Create new term if it doesn't exist
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + Buffer.from(`${this.wpUsername}:${this.wpPassword}`).toString('base64')
        },
        body: JSON.stringify({ 
          name,
          slug // Include the slug for consistency
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(`Failed to create ${taxonomy} term: ${name} (${response.status}: ${errorData?.message || response.statusText})`);
      }

      const newTerm = await response.json();
      return newTerm.id;
    } catch (error) {
      throw new Error(`Error creating ${taxonomy} term ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async createWordPressPost(post: WordPressPost): Promise<void> {
    // Create tags and categories first
    const tagIds = await Promise.all(
      post.tags.map(tag => this.createTerm(tag, 'tags'))
    );
    
    const categoryIds = await Promise.all(
      post.categories.map(category => this.createTerm(category, 'categories'))
    );

    const endpoint = `${this.wpBaseUrl}/wp-json/wp/v2/posts`;
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + Buffer.from(`${this.wpUsername}:${this.wpPassword}`).toString('base64')
      },
      body: JSON.stringify({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        status: 'publish',
        tags: tagIds,
        categories: categoryIds
      })
    });

    debugger;
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Failed to create WordPress post (${response.status}): ${
          errorData?.message || response.statusText
        }`
      );
    }

    const createdPost = await response.json();
    if (!createdPost?.id) {
      throw new Error('WordPress post creation failed: No post ID returned');
    }
  }

  public async processURL(url: string): Promise<{
    processed: number;
    skipped: number;
    errors: string[];
  }> {
    const results = {
      processed: 0,
      skipped: 0,
      errors: [] as string[]
    };

    try {
      const pdfLinks = await this.getPDFLinks(url);
      
      for (const pdfUrl of pdfLinks) {
        try {
          const exists = await this.checkPostExists(pdfUrl);
          
          if (exists) {
            results.skipped++;
            continue;
          }

          const pdfContent = await this.getPDFContent(pdfUrl);
          const post = await this.generateWordPressPost(pdfContent, pdfUrl);
          await this.createWordPressPost(post);
          
          results.processed++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          results.errors.push(`Error processing ${pdfUrl}: ${errorMessage}`);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      results.errors.push(`Error processing main URL ${url}: ${errorMessage}`);
    }

    return results;
  }
} 
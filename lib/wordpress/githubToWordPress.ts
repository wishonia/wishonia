import fs from 'fs/promises';
import path from 'path';

import { generateObject } from 'ai';
import matter from 'gray-matter';
import { marked } from 'marked';
import sharp from 'sharp';
import { z } from 'zod';

import { getModel } from '../utils/modelUtils';

import { WordPressFeaturedImageUpdater } from './featuredImageUpdater';
import { WordPressClient } from './wordpressClient';
import { WordPressMedia, WordPressApiPost, WordPressPost } from './wordpressTypes';



const PostMetadataSchema = z.object({
  title: z.string().describe("A factual and information-dense title for the post. Avoid adjectives"),
  excerpt: z.string().describe("A compelling excerpt/description for the post"),
  tags: z.array(z.string()).describe("3 to 5 highly relevant tags for categorization"),
  categories: z.array(z.string()).describe("One general primary category for the post"),
});

interface MigrationOptions {
  generateAIImages?: boolean;
  generateMetadata?: boolean;
  blacklist?: string[];
  contentCheck?: {
    enabled: boolean;
    context: string; // e.g. "nonprofit website focused on health"
  };
  logFile?: string; // Path to save the migration log
  overwrite?: boolean;
  minWords?: number;
}

interface MigrationResult {
  postsCreated: number;
  imagesProcessed: number;
  errors: Array<{
    file: string;
    error: string;
  }>;
  posts: Array<{
    title: string;
    url: string;
    status: string;
  }>;
  logFile?: string;
}

interface MigrationLogEntry {
  file: string;
  status: 'processed' | 'skipped' | 'error';
  reason?: string;
  postUrl?: string;
  postTitle?: string;
  timestamp: string;
  relevanceScore?: number;
}

interface FileContent {
  data: {
    title?: string;
    excerpt?: string;
    tags?: string[];
    categories?: string[];
    [key: string]: any;
  };
  content: string;
}

export class GitHubToWordPressMigrator {
  private wpClient: WordPressClient;
  private imageUpdater: WordPressFeaturedImageUpdater;

  constructor(wpClient: WordPressClient) {
    this.wpClient = wpClient;
    this.imageUpdater = new WordPressFeaturedImageUpdater(wpClient);
  }

  private async generateMetadataWithAI(content: string) {
    const prompt = `Analyze this content and generate appropriate WordPress metadata:
      ${content.slice(0, 2000)}...
      
      Generate a title, excerpt, tags, and categories that will work well for WordPress.
      Focus on SEO and reader engagement.`;

    const result = await generateObject({
      model: getModel(),
      schema: PostMetadataSchema,
      prompt,
    });

    return result.object;
  }

  private async findExistingMediaByFilename(filename: string): Promise<WordPressMedia | null> {
    try {
      // Clean the filename for comparison
      const cleanFilename = filename.toLowerCase()
        .replace(/[^a-z0-9.]/g, '-') // Replace special chars with hyphens
        .replace(/-+/g, '-')         // Collapse multiple hyphens
        .replace(/^-|-$/g, '');      // Remove leading/trailing hyphens

      // Get all media items that might match
      const media = await this.wpClient.getMedia({
        per_page: 100,               // Increase items per page
        search: cleanFilename.split('.')[0], // Search without extension
        _fields: ['id', 'source_url', 'title', 'media_details'],
      });

      // Find exact filename match by checking the end of source_url
      const exactMatch = media.find((item: WordPressMedia) => {
        const itemUrl = item.source_url.toLowerCase();
        const itemFilename = itemUrl.split('/').pop() || '';
        
        // Clean the URL filename the same way for comparison
        const cleanItemFilename = itemFilename
          .replace(/[^a-z0-9.]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');

        //console.log(`🔍 Comparing: "${cleanFilename}" with "${cleanItemFilename}"`);
        
        return cleanFilename === cleanItemFilename;
      });

      if (exactMatch) {
        //console.log(`✅ Found exact match for "${filename}": ${exactMatch.source_url}`);
        return exactMatch;
      }

      //console.log(`❌ No existing media found for "${filename}"`);
      return null;
    } catch (error) {
      console.error(`Failed to search for existing media: ${filename}`, error);
      return null;
    }
  }

  private generateImageTitle(fileName: string, filePath: string, repo: string): string {
    // Remove file extension and special characters
    const cleanFileName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
    const cleanPath = filePath.split('/').slice(0, -1).join(' - ').replace(/[_-]/g, ' ');
    const cleanRepo = repo.replace(/[_-]/g, ' ');

    // Title case each part
    const titleCase = (str: string) =>
        str.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

    // Combine parts, avoiding duplicates
    const parts = new Set([
      titleCase(cleanFileName),
      titleCase(cleanPath),
      titleCase(cleanRepo)
    ].filter(Boolean));

    return Array.from(parts).join(' - ');
  }

  private async convertSvgToPng(svgBuffer: ArrayBuffer): Promise<Buffer> {
    return sharp(Buffer.from(svgBuffer))
        .png()
        .resize(1200, 1200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .toBuffer();
  }

  private async processImages(content: string, owner: string, repo: string, filePath: string, accessToken: string): Promise<{
    processedContent: string;
    imageStats: Array<{
        fileName: string;
        status: 'reused' | 'uploaded' | 'failed';
        originalUrl: string;
        newUrl?: string;
        error?: string;
        size?: string;
    }>;
}> {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)|<img[^>]+src="([^"]+)"[^>]*>/g;
    let processedContent = content;
    const matches = Array.from(content.matchAll(imageRegex));
    const imageStats: Array<{
        fileName: string;
        status: 'reused' | 'uploaded' | 'failed';
        originalUrl: string;
        newUrl?: string;
        error?: string;
        size?: string;
    }> = [];

    for (const match of matches) {
        const imageUrl = match[2] || match[3];
        const fileName = imageUrl.split('/').pop() || 'image.jpg';
        
        try {
            let fullImageUrl: string;
            let headers: HeadersInit = {};

            if (imageUrl.startsWith('http')) {
                fullImageUrl = imageUrl;
            } else {
                const basePath = filePath.split('/').slice(0, -1).join('/').replace(/^\/+|\/+$/g, '');
                const cleanImagePath = imageUrl.replace(/^\/+|\/+$/g, '');
                const relativePath = imageUrl.startsWith('/')
                    ? cleanImagePath
                    : basePath ? `${basePath}/${cleanImagePath}` : cleanImagePath;

                fullImageUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${relativePath}`;
                headers = {
                    'Authorization': `Bearer ${accessToken}`,
                    'Accept': 'application/vnd.github.v3.raw'
                };
            }

            const imageTitle = this.generateImageTitle(fileName, filePath, repo);
            const existingMedia = await this.findExistingMediaByFilename(
                fileName.toLowerCase().endsWith('.svg')
                    ? fileName.replace(/\.svg$/, '.png')
                    : fileName
            );

            if (existingMedia) {
                imageStats.push({
                    fileName,
                    status: 'reused',
                    originalUrl: imageUrl,
                    newUrl: existingMedia.source_url
                });

                if (match[2]) {
                    processedContent = processedContent.replace(
                        `](${imageUrl})`,
                        `](${existingMedia.source_url})`
                    );
                } else {
                    processedContent = processedContent.replace(
                        imageUrl,
                        existingMedia.source_url
                    );
                }
                continue;
            }

            const response = await fetch(fullImageUrl, { headers });
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText}`);
            }

            const contentType = response.headers.get('content-type');
            console.log(`🖼️ Processing image:
• File: ${fileName}
• Content-Type: ${contentType}
• Size: ${response.headers.get('content-length')} bytes`);

            const imageBuffer = await response.arrayBuffer();
            let finalBuffer: Buffer | ArrayBuffer = imageBuffer;
            let finalContentType = contentType || 'image/jpeg';
            let finalFileName = fileName;

            // Handle different image types
            if (fileName.toLowerCase().endsWith('.svg')) {
                finalBuffer = await this.convertSvgToPng(imageBuffer);
                finalContentType = 'image/png';
                finalFileName = fileName.replace(/\.svg$/i, '.png');
            } else if (fileName.toLowerCase().endsWith('.gif')) {
                // Ensure GIF content type is correct
                finalContentType = 'image/gif';
                // Keep original buffer for GIFs
                finalBuffer = imageBuffer;
            }

            try {
                const mediaResponse = await this.wpClient.uploadMedia(
                    new Blob([finalBuffer], { type: finalContentType }),
                    finalFileName,
                    imageTitle
                );

                imageStats.push({
                    fileName,
                    status: 'uploaded',
                    originalUrl: imageUrl,
                    newUrl: mediaResponse.source_url,
                    size: `${(finalBuffer.byteLength / 1024).toFixed(2)}KB`
                });

                if (match[2]) {
                    processedContent = processedContent.replace(
                        `](${imageUrl})`,
                        `](${mediaResponse.source_url})`
                    );
                } else {
                    processedContent = processedContent.replace(
                        imageUrl,
                        mediaResponse.source_url
                    );
                }

            } catch (uploadError: any) {
                console.error(`❌ Upload failed for ${fileName}:
• Type: ${finalContentType}
• Size: ${(finalBuffer.byteLength / 1024).toFixed(2)}KB
• Error: ${uploadError.message}
• Status: ${uploadError.status}
• Code: ${uploadError.code}
• Response: ${JSON.stringify(uploadError.response || {}, null, 2)}`);
                
                throw uploadError;
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorDetails = error instanceof Error ? error : {};
            
            console.error(`❌ Failed to process image in ${filePath}:
• Image: ${fileName}
• URL: ${imageUrl}
• Error: ${errorMessage}
• Details: ${JSON.stringify(errorDetails, null, 2)}`);

            imageStats.push({
                fileName,
                status: 'failed',
                originalUrl: imageUrl,
                error: errorMessage
            });

            // If it's a permissions/file type error, crash the script
            if (errorMessage.includes('not allowed to upload this file type') ||
                errorMessage.includes('rest_upload_unknown_error')) {
                throw new Error(`🚨 Critical upload error in ${filePath}: ${errorMessage}`);
            }
        }
    }

    // Log image processing results as a table
    if (imageStats.length > 0) {
        console.log(`🖼️ Image Processing Results:
• Total: ${imageStats.length}
• Reused: ${imageStats.filter(s => s.status === 'reused').length}
• Uploaded: ${imageStats.filter(s => s.status === 'uploaded').length}
• Failed: ${imageStats.filter(s => s.status === 'failed').length}`);
    }

    return {
        processedContent,
        imageStats
    };
}

  private generateUniquePostName(owner: string, repo: string, filePath: string): string {
    // Remove file extension
    const cleanPath = filePath.replace(/\.(md|html)$/, '');
    
    // Get the filename without extension
    const fileName = path.basename(cleanPath);
    
    // Get the directory path without the filename
    const dirPath = path.dirname(cleanPath);
    
    // Combine all parts to create a unique slug
    const slugParts = [
      owner,
      repo,
      ...dirPath.split('/').filter(part => part !== '.'),
      fileName
    ];
    
    // Create the slug
    const slug = slugParts
      .join('-')
      .toLowerCase()
      // Replace any character that's not alphanumeric or hyphen with a hyphen
      .replace(/[^a-z0-9-]+/g, '-')
      // Replace multiple consecutive hyphens with a single hyphen
      .replace(/-+/g, '-')
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, '')
      // Ensure it's not too long for WordPress (max 200 chars)
      .slice(0, 200);

    return slug;
  }

  public async postExistsWithPostName(postName: string): Promise<boolean> {
    if (!postName) {
        console.log('❌ Empty post name provided');
        return false;
    }

    try {
        console.log(`🔍 Checking existence of post with slug: "${postName}"`);
        
        // Query directly by slug - this is more efficient than getting all posts
        const posts = await this.wpClient.getPosts({
            slug: postName,
            status: 'any',
            _fields: ['id', 'slug', 'status']
        });

        // If we find an exact match by slug, return true
        if (posts.length > 0) {
            console.log(`✅ Found post with slug "${postName}":
• Status: ${posts[0].status}
• ID: ${posts[0].id}`);
            return true;
        }

        // If no match found by direct slug query, log the result
        console.log(`❌ No post found with slug "${postName}"`);
        return false;

    } catch (error) {
        console.error(`❌ Error checking post existence:
• Slug: "${postName}"
• Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return false;
    }
  }

  private async convertToGutenbergBlocks(markdown: string): Promise<string> {
    // First convert markdown to HTML
    marked.setOptions({
      gfm: true, // GitHub Flavored Markdown
      breaks: true
    });

    // Convert markdown to HTML first
    const html = await marked.parse(markdown);

    // Start with a container block
    const blocks = [`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">`];

    // Split content by significant HTML elements
    const sections = html
      .split(/(?=<h[1-6]|<pre|<ul|<ol|<blockquote|<p|<img)/g)
      .filter(section => section.trim());

    for (const section of sections) {
      if (section.startsWith('<h1>')) {
        blocks.push(`<!-- wp:heading {"level":1} -->
${section}
<!-- /wp:heading -->`);
      }
      else if (section.startsWith('<h2>')) {
        blocks.push(`<!-- wp:heading {"level":2} -->
${section}
<!-- /wp:heading -->`);
      }
      else if (section.startsWith('<h3>')) {
        blocks.push(`<!-- wp:heading {"level":3} -->
${section}
<!-- /wp:heading -->`);
      }
      else if (section.startsWith('<h4>')) {
        blocks.push(`<!-- wp:heading {"level":4} -->
${section}
<!-- /wp:heading -->`);
      }
      else if (section.startsWith('<pre')) {
        // Code blocks
        const code = section.replace(/<\/?pre>|<\/?code>/g, '');
        blocks.push(`<!-- wp:code -->
<pre class="wp-block-code"><code>${code}</code></pre>
<!-- /wp:code -->`);
      }
      else if (section.startsWith('<ul>')) {
        blocks.push(`<!-- wp:list -->
${section}
<!-- /wp:list -->`);
      }
      else if (section.startsWith('<ol>')) {
        blocks.push(`<!-- wp:list {"ordered":true} -->
${section}
<!-- /wp:list -->`);
      }
      else if (section.startsWith('<blockquote>')) {
        blocks.push(`<!-- wp:quote -->
${section}
<!-- /wp:quote -->`);
      }
      else if (section.startsWith('<img')) {
        // Image blocks
        const altMatch = section.match(/alt="([^"]+)"/) || [];
        const srcMatch = section.match(/src="([^"]+)"/) || [];
        blocks.push(`<!-- wp:image {"align":"wide","sizeSlug":"large","linkDestination":"none"} -->
<figure class="wp-block-image alignwide size-large"><img src="${srcMatch[1] || ''}" alt="${altMatch[1] || ''}"/></figure>
<!-- /wp:image -->`);
      }
      else if (section.startsWith('<p>')) {
        // Handle paragraphs with links and other inline elements
        blocks.push(`<!-- wp:paragraph -->
${section}
<!-- /wp:paragraph -->`);
      }
      else if (section.trim()) {
        // Wrap any other HTML in paragraph block
        blocks.push(`<!-- wp:paragraph -->
<p>${section}</p>
<!-- /wp:paragraph -->`);
      }
    }

    // Close the container block
    blocks.push(`</div>
<!-- /wp:group -->`);

    return blocks.join('\n\n');
  }

  private async findExistingFeaturedImage(postName: string): Promise<number | null> {
    try {
      // Search for images with a title that includes our post name
      const media = await this.wpClient.getMedia({
        search: `AI Generated Featured Image - ${postName}`,
        _fields: ['id', 'title'],
        per_page: 1
      });

      if (media && media.length > 0) {
        console.log(`♻️ Found existing featured image for "${postName}"`);
        return media[0].id;
      }

      return null;
    } catch (error) {
      console.error(`Failed to search for existing featured image: ${postName}`, error);
      return null;
    }
  }

  private async checkContentRelevance(content: string, context: string): Promise<{
    relevant: boolean;
    reason: string;
    score: number;
  }> {
    const prompt = `As a content curator, evaluate if the following content is relevant for: ${context}

Content to evaluate:
${content.slice(0, 2000)}...

Provide a JSON response with:
1. "relevant": boolean - whether the content is relevant to the context
2. "reason": string - explanation of your decision
3. "score": number - relevance score from 0 to 1

Consider factors like:
- Topic alignment with ${context}
- Value to target audience
- Information usefulness
- Subject matter fit
- Core message relevance`;

    const result = await generateObject({
      model: getModel(),
      schema: z.object({
        relevant: z.boolean(),
        reason: z.string(),
        score: z.number().min(0).max(1)
      }),
      prompt,
    });

    return result.object;
  }

  private async logMigrationEntry(entry: MigrationLogEntry, logFile: string) {
    const logDir = path.dirname(logFile);
    await fs.mkdir(logDir, { recursive: true });

    const logLine = JSON.stringify({
      ...entry,
      timestamp: new Date().toISOString()
    });

    await fs.appendFile(logFile, logLine + '\n');
  }

  async migrateRepository(
      repoUrl: string,
      accessToken: string,
      options: MigrationOptions = { overwrite: false }
  ): Promise<MigrationResult> {
    console.log(`🚀 Starting migration of GitHub repository: ${repoUrl}
• Options: ${JSON.stringify(options, null, 2)}`);

    const result: MigrationResult = {
        postsCreated: 0,
        imagesProcessed: 0,
        errors: [],
        posts: [],
    };

    const [owner, repo] = repoUrl.split('/').slice(-2);
    console.log(`📂 Fetching repository contents from ${owner}/${repo}...`);

    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
        }
    );

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const markdownFiles = data.tree.filter((file: any) =>
        file.path.match(/\.(md|html)$/i)
    );

    console.log(`📝 Found ${markdownFiles.length} markdown/HTML files to process`);

    const logFile = options.logFile || `migration-logs/${owner}-${repo}-${Date.now()}.jsonl`;

    for (const file of markdownFiles) {
        console.log(`\n📄 Processing File:
• Path: ${file.path}
• Size: ${(file.size / 1024).toFixed(2)}KB
• SHA: ${file.sha}
• Type: ${file.path.endsWith('.md') ? 'Markdown' : 'HTML'}`);

        try {
            const migrationResult = await this.migrateSingleFile(
                repoUrl,
                file.path,
                accessToken,
                options
            );

            if (migrationResult.success && migrationResult.post) {
                result.postsCreated++;
                result.posts.push({
                    title: migrationResult.post.title,
                    url: migrationResult.post.url,
                    status: migrationResult.post.status,
                });

                await this.logMigrationEntry({
                    file: file.path,
                    status: 'processed',
                    postUrl: migrationResult.post.url,
                    postTitle: migrationResult.post.title,
                    timestamp: new Date().toISOString()
                }, logFile);
            } else {
                result.errors.push({
                    file: file.path,
                    error: migrationResult.error || 'Unknown error'
                });

                await this.logMigrationEntry({
                    file: file.path,
                    status: 'error',
                    reason: migrationResult.error || 'Unknown error',
                    timestamp: new Date().toISOString()
                }, logFile);
            }
        } catch (error) {
            console.error(`❌ Processing Error:
• File: ${file.path}
• Error Type: ${error instanceof Error ? error.constructor.name : 'Unknown'}
• Message: ${error instanceof Error ? error.message : 'Unknown error'}
• Stack: ${error instanceof Error ? error.stack : 'No stack trace'}`);

            result.errors.push({
                file: file.path,
                error: error instanceof Error ? error.message : 'Unknown error'
            });

            await this.logMigrationEntry({
                file: file.path,
                status: 'error',
                reason: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            }, logFile);
        }
    }

    console.log(`\n📊 Migration Summary:
• Posts Created: ${result.postsCreated}
• Images Processed: ${result.imagesProcessed}
• Success Rate: ${((result.postsCreated / markdownFiles.length) * 100).toFixed(1)}%`);

    return {
        ...result,
        logFile
    };
  }

  async migrateSingleFile(
      repoUrl: string,
      filePath: string,
      accessToken: string,
      options: MigrationOptions = { overwrite: false, minWords: 300 }
  ): Promise<{
      success: boolean;
      post?: {
          id: number;
          title: string;
          url: string;
          status: string;
          slug: string;
      };
      error?: string;
  }> {
      const [owner, repo] = repoUrl.split('/').slice(-2);
      
      try {
          const postName = this.generateUniquePostName(owner, repo, filePath);
          const exists = await this.postExistsWithPostName(postName);

          // If post exists and we're not overwriting, return early
          if (exists && !options.overwrite) {
              console.log(`⏭️ Post already exists with slug: "${postName}"`);
              const existingPost = (await this.wpClient.getPosts({
                  slug: postName,
                  status: 'any',
                  _fields: ['id', 'title', 'link', 'status', 'slug']
              }))[0];
              
              return {
                  success: true,
                  post: {
                      id: existingPost.id,
                      title: existingPost.title.rendered,
                      url: existingPost.link,
                      status: existingPost.status,
                      slug: existingPost.slug
                  }
              };
          }

          // Fetch and process content
          const contentResponse = await fetch(
              `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
              {
                  headers: {
                      Authorization: `Bearer ${accessToken}`,
                      Accept: 'application/vnd.github.v3+json',
                  },
              }
          );

          if (!contentResponse.ok) {
              throw new Error(`Failed to fetch file ${filePath}`);
          }

          const contentData = await contentResponse.json();
          const content = Buffer.from(contentData.content, 'base64').toString();
          const { data: frontmatter, content: cleanContent } = await this.processFileContent(content, filePath);

          // Check word count
          const wordCount = this.countWords(cleanContent);
          const minWords = options.minWords ?? 300;
          
          if (wordCount < minWords) {
              console.log(`⏭️ Skipping ${filePath}:
• Word count: ${wordCount}
• Minimum required: ${minWords}
• Status: Too short to process`);
              
              return {
                  success: false,
                  error: `Insufficient word count (${wordCount}/${minWords} words)`
              };
          }

          // Check content relevance if enabled and post doesn't exist
          if (!exists && options.contentCheck?.enabled) {
              const relevanceCheck = await this.checkContentRelevance(
                  cleanContent,
                  options.contentCheck.context
              );

              if (!relevanceCheck.relevant) {
                  console.log(`⏭️ Skipping ${filePath}:
• Relevance Score: ${relevanceCheck.score}
• Reason: ${relevanceCheck.reason}
• Status: Content not relevant for this site`);

                  return {
                      success: false,
                      error: `Content not relevant: ${relevanceCheck.reason} (score: ${relevanceCheck.score})`
                  };
              }

              console.log(`✅ Content relevance check passed for ${filePath}:
• Score: ${relevanceCheck.score}
• Reason: ${relevanceCheck.reason}`);
          }

          // Continue with rest of processing...
          const metadata = options.generateMetadata
              ? await this.generateMetadataWithAI(cleanContent)
              : {
                  title: frontmatter.title || path.basename(filePath, path.extname(filePath)).replace(/-/g, ' '),
                  excerpt: frontmatter.excerpt || '',
                  tags: frontmatter.tags || [],
                  categories: frontmatter.categories || [],
              };

          const { processedContent } = await this.processImages(
              cleanContent,
              owner,
              repo,
              filePath,
              accessToken
          );

          const finalContent = await this.convertToGutenbergBlocks(processedContent);

          const postData: WordPressPost = {
              title: metadata.title || path.basename(filePath, path.extname(filePath)).replace(/-/g, ' '),
              content: finalContent,
              excerpt: metadata.excerpt || '',
              status: 'draft',
              categories: metadata.categories || [],
              tags: metadata.tags || [],
              slug: postName
          };

          let post: WordPressApiPost;
          
          if (exists && options.overwrite) {
              const existingPosts = await this.wpClient.getPosts({
                  slug: postName,
                  status: 'any',
                  _fields: ['id']
              });
              post = await this.wpClient.updatePost(existingPosts[0].id, postData);
          } else {
              post = await this.wpClient.createPost(postData);
          }

          // If WordPress returns an empty slug for draft posts, update it
          if (!post.slug && post.status === 'draft') {
              console.log(`📝 Updating empty slug for draft post...
• Post ID: ${post.id}
• Generated Slug: "${postName}"`);
              
              post = await this.wpClient.updatePost(post.id, {
                  slug: postName,
                  status: 'draft'
              });
          }

          console.log(`🔍 Post Details:
• Generated Slug: "${postName}"
• Final Post Slug: "${post.slug}"
• Post ID: ${post.id}
• Status: ${post.status}`);

          return {
              success: true,
              post: {
                  id: post.id,
                  title: metadata.title || path.basename(filePath, path.extname(filePath)).replace(/-/g, ' '),
                  url: post.link,
                  status: post.status,
                  slug: post.slug || postName
              }
          };

      } catch (error) {
          return {
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error'
          };
      }
  }

  // Add this function to handle different file types
  private async processFileContent(content: string, filePath: string): Promise<FileContent> {
    if (filePath.endsWith('.html')) {
        // For HTML files, try to extract metadata from HTML comments or meta tags
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        const descMatch = content.match(/<meta\s+name="description"\s+content="(.*?)"/i);
        const keywordsMatch = content.match(/<meta\s+name="keywords"\s+content="(.*?)"/i);
        
        // Remove any <html>, <head>, and <body> tags to get clean content
        let cleanContent = content
            .replace(/<\/?html[^>]*>/gi, '')
            .replace(/<\/?head[^>]*>[\s\S]*?<\/head>/gi, '')
            .replace(/<\/?body[^>]*>/gi, '')
            .trim();

        // Extract first heading as title if no title tag
        let extractedTitle = '';
        const h1Match = cleanContent.match(/<h1[^>]*>(.*?)<\/h1>/i);
        if (h1Match) {
            extractedTitle = h1Match[1].replace(/<[^>]+>/g, '').trim();
            cleanContent = cleanContent.replace(h1Match[0], '');
        }

        // Convert common HTML elements to their WordPress equivalents
        cleanContent = cleanContent
            // Convert divs with class names to potential block equivalents
            .replace(/<div\s+class="([^"]*)">/gi, (match, className) => {
                if (className.includes('wp-block-')) return match;
                return '<div>';
            })
            // Handle HTML tables
            .replace(/<table[^>]*>/gi, '<!-- wp:table --><figure class="wp-block-table"><table>')
            .replace(/<\/table>/gi, '</table></figure><!-- /wp:table -->')
            // Clean up empty paragraphs and divs
            .replace(/<(p|div)[^>]*>\s*<\/(p|div)>/gi, '')
            .trim();

        // Extract keywords for tags
        const keywords = keywordsMatch?.[1]?.split(',').map(k => k.trim()) || [];

        return {
            data: {
                title: titleMatch?.[1]?.trim() || extractedTitle || '',
                excerpt: descMatch?.[1]?.trim() || '',
                tags: keywords,
                categories: []
            },
            content: cleanContent
        };
    } else {
        // For Markdown files, use gray-matter
        const { data, content: mdContent } = matter(content);
        return {
            data: {
                title: data.title || '',
                excerpt: data.excerpt || '',
                tags: Array.isArray(data.tags) ? data.tags : [],
                categories: Array.isArray(data.categories) ? data.categories : [],
                ...data
            },
            content: mdContent
        };
    }
  }

  private countWords(text: string): number {
    // Remove HTML tags and trim whitespace
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    // Split by whitespace and filter out empty strings
    return cleanText.split(/\s+/).filter(word => word.length > 0).length;
  }
}




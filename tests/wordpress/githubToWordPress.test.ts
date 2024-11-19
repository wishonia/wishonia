/**
 * @jest-environment node
 */
import { GitHubToWordPressMigrator } from '@/lib/wordpress/githubToWordPress';
import { WordPressClient } from '@/lib/wordpress/wordpressClient';
import { WordPressApiPost } from '@/lib/wordpress/wordpressTypes';
import { config } from 'dotenv';
import fs from 'fs/promises';

config();

describe('GitHub to WordPress Migration', () => {
  let wpClient: WordPressClient;
  let migrator: GitHubToWordPressMigrator;
  
  beforeAll(() => {
    wpClient = new WordPressClient({
      baseUrl: process.env.WORDPRESS_URL!,
      username: process.env.WORDPRESS_USERNAME!,
      password: process.env.WORDPRESS_PASSWORD!,
    });
    
    migrator = new GitHubToWordPressMigrator(wpClient);
  });


  it('should migrate markdown files from a GitHub repository', async () => {
    const repoUrl = 'mikepsinn/dFDA-DAO';
    const accessToken = process.env.GITHUB_ACCESS_TOKEN!;

    const result = await migrator.migrateRepository(repoUrl, accessToken, {
      generateAIImages: true,
      generateMetadata: true,
      blacklist: [],
      contentCheck: {
        enabled: true,
        context: "nonprofit website focused on health research that just has articles"
      },
      logFile: `logs/migration-${Date.now()}.jsonl`,
      minWords: 300
    });

    expect(result.postsCreated).toBeGreaterThan(0);
    expect(result.errors).toHaveLength(0);
    
    // Verify log file exists
    if (!result.logFile) {
      throw new Error('Log file path is undefined');
    }
    const logContent = await fs.readFile(result.logFile, 'utf-8');
    const logEntries = logContent.trim().split('\n').map((line: string) => JSON.parse(line));
    expect(logEntries.length).toBeGreaterThan(0);
  }, 3000000); // 3000000ms = 50 minutes

  it('should correctly check if a post exists by slug', async () => {
    const repoUrl = 'curedao/docs';
    const filePath = 'README.md';
    const accessToken = process.env.GITHUB_ACCESS_TOKEN!;

    // First, create a post
    console.log('🔄 Creating test post...');
    const result = await migrator.migrateSingleFile(repoUrl, filePath, accessToken, {
        generateMetadata: true,
        generateAIImages: false
    });

    expect(result.success).toBe(true);
    expect(result.post).toBeDefined();
    const postSlug = result.post?.slug;
    const postId = result.post?.id;
    
    console.log(`📝 Created test post:
• Slug: "${postSlug}"
• Post ID: ${postId}
• Status: ${result.post?.status}`);

    // Add a delay after creation
    console.log('⏳ Waiting for WordPress to process the post...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Try different ways to verify the post exists
    console.log('🔍 Verifying post existence through different methods...');

    // 1. Check by ID
    const byId = await wpClient.getPosts({
        include: [postId],
        status: 'any',
    });
    console.log(`1. Query by ID:
• Found: ${byId.length} posts
• Details: ${JSON.stringify(byId[0] || {}, null, 2)}`);

    // 2. Check by slug
    const bySlug = await wpClient.getPosts({
        slug: postSlug,
        status: 'any',
    });
    console.log(`2. Query by slug:
• Found: ${bySlug.length} posts
• Details: ${JSON.stringify(bySlug[0] || {}, null, 2)}`);

    // 3. Get all recent posts
    const recent = await wpClient.getPosts({
        per_page: 10,
        status: 'any',
        orderby: 'date',
        order: 'desc'
    });
    console.log(`3. Recent posts:
• Total found: ${recent.length}
• IDs: ${recent.map((p: WordPressApiPost) => p.id).join(', ')}
• Slugs: ${recent.map((p: WordPressApiPost) => p.slug).join(', ')}`);

    // Now check if our post is in the recent posts
    const foundInRecent = recent.find((p: WordPressApiPost) => p.id === postId);
    console.log(`4. Post in recent posts:
• Found: ${!!foundInRecent}
• Details: ${JSON.stringify(foundInRecent || {}, null, 2)}`);

    // Make assertions based on any successful query
    const postExists = byId.length > 0 || bySlug.length > 0 || !!foundInRecent;
    expect(postExists).toBe(true);

    if (!postExists) {
        console.error(`❌ Post not found in WordPress:
• ID: ${postId}
• Slug: "${postSlug}"
• Status: ${result.post?.status}
• Creation Time: ${new Date().toISOString()}`);
    }

    // Test postExistsWithPostName only if we can verify the post exists
    if (postExists) {
        const exists = await migrator.postExistsWithPostName(postSlug!);
        console.log(`5. postExistsWithPostName check:
• Result: ${exists}
• Slug used: "${postSlug}"`);
        expect(exists).toBe(true);
    }
}, 300000);


  it('should migrate single README and prevent duplicates', async () => {
    const repoUrl = 'curedao/docs';
    const filePath = 'README.md';
    const accessToken = process.env.GITHUB_ACCESS_TOKEN!;

    // First migration attempt
    console.log('🔄 Starting first migration attempt...');
    const firstResult = await migrator.migrateSingleFile(repoUrl, filePath, accessToken, {
      generateMetadata: true,
      generateAIImages: false
    });

    expect(firstResult.success).toBe(true);
    expect(firstResult.post).toBeDefined();
    const firstPostSlug = firstResult.post?.slug;
    
    console.log(`📝 First migration result:
• Success: ${firstResult.success}
• Post ID: ${firstResult.post?.id}
• Slug: "${firstPostSlug}"
• Status: ${firstResult.post?.status}`);

    expect(firstPostSlug).toBeTruthy();
    expect(typeof firstPostSlug === 'string').toBe(true);
    expect(firstPostSlug?.length).toBeGreaterThan(0);

    // Second migration attempt of the same file
    console.log('🔄 Starting second migration attempt...');
    const secondResult = await migrator.migrateSingleFile(repoUrl, filePath, accessToken, {
      generateMetadata: true,
      generateAIImages: false
    });

    console.log(`📝 Second migration result:
• Success: ${secondResult.success}
• Post ID: ${secondResult.post?.id}
• Slug: "${secondResult.post?.slug}"
• Status: ${secondResult.post?.status}`);

    expect(secondResult.success).toBe(true);
    expect(secondResult.post).toBeDefined();
    expect(secondResult.post?.slug).toBe(firstPostSlug);
    expect(secondResult.post?.id).toBe(firstResult.post?.id);

    // Verify post exists with the slug
    const posts = await wpClient.getPosts({
      slug: firstPostSlug,
      status: 'any',
      _fields: ['id', 'slug', 'title', 'status']
    });

    console.log(`🔍 Verification query results:
• Posts found: ${posts.length}
• First post slug: "${posts[0]?.slug}"
• First post ID: ${posts[0]?.id}
• First post status: ${posts[0]?.status}`);

    expect(posts.length).toBe(1);
    expect(posts[0].slug).toBe(firstPostSlug);
  }, 300000); // 5 minutes timeout

  afterAll(async () => {
    // Optional: Clean up test posts
    // This is commented out to avoid accidentally deleting production posts
    // Implement if needed with appropriate safeguards
  });
}); 
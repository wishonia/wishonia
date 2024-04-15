const fs = require("fs-extra");
const {join} = require("path");
const path = require("path");
const matter = require("gray-matter");
const fetch = require('node-fetch');
require('dotenv').config({ path: join(__dirname, '../.env') });
const { generateImage } = require("./generateImage");
const { generateText } = require("./generateText");

// Function to generate metadata
async function generateMetadata(content) {
  return await generateText(
    `Generate metadata for a blog post given the following content:\n\n${content}\n\nMetadata format:\n---\ntitle: ""\nexcerpt: ""\ncoverImage: ""\ndate: ""\nauthor:\n name: ""\n picture: ""\nogImage:\n url: ""\n---\n`,
    "gpt-3.5-turbo"
  );
}

let folder = "../public";
const postsDirectory = path.join(process.cwd(), folder);

function getPostPaths() {
  return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
}

async function getPostContent(slug) {
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  return fs.readFileSync(fullPath, "utf8");
}

// Main function to process markdown files
async function processMarkdownFiles() {
  const paths = getPostPaths();
  for (const file of paths) {
    const content = await getPostContent(file);
    if(matter.test(content)) {
        console.error("Already has metadata for", path.basename(file));
        continue; // Skip to the next file if metadata parsing fails
    }
    const metadata = await generateMetadata(content);
    const { data } = matter(metadata);
    const imagePrompt = `Generate a cover image for the following article. Do not include any text in the image. Use a colorful 16-bit style. Here's the article: ${content}`;
    const response = await generateImage({
      prompt: imagePrompt,
      resolution: "1792x1024",
      amount: 1
    });
    const imageUrl = response.url;
    const image = await fetch(imageUrl);
    const buffer = await image.buffer();
    const imagePath = path.join(postsDirectory, `${file.replace(/\.md$/, ".png")}`);
    await fs.writeFile(imagePath, buffer);
    const relativeImagePath = path.relative(postsDirectory, imagePath);
    data.coverImage = relativeImagePath;
    const newFileContents = matter.stringify(content, data);
    await fs.writeFile(file, newFileContents);
    console.log(`Processed ${path.basename(file)}`);
  }
}

processMarkdownFiles();
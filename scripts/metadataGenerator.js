const fs = require("fs-extra");
const {join} = require("path");
const path = require("path");
const matter = require("gray-matter");
require('dotenv').config({ path: join(__dirname, '../.env') });
const { generateAndSaveImage} = require("./imageGenerator");
const { generateText } = require("./textGenerator");
let model = "gpt-3.5-turbo";

// Function to generate metadata
async function generateMetadataFromContent(content) {
  const title = await generateTitleFromContent(content);
  const description = await generateDescriptionFromContent(content);
  return {
    title: title,
    description: description,
  };
}

async function generateTitleFromContent(content) {
  return await generateText(
      `Generate title for a blog post given the following content:\n\n${content}\n\n`,
      model
  );
}

async function generateDescriptionFromContent(content) {
  return await generateText(
      `Generate description for a blog post given the following content:\n\n${content}\n\n`,
      model
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
    const metadata = {
        title: "",
        description: "",
        featuredImage: "",
    }
    metadata.title = await generateTitleFromContent(content);
    metadata.description = await generateDescriptionFromContent(content);
    const imagePath = path.join(postsDirectory, `${file.replace(/\.md$/, ".png")}`);
    await generateAndSaveImage(content, imagePath);
    metadata.coverImage = path.relative(postsDirectory, imagePath);
    const newFileContents = matter.stringify(content, metadata);
    await fs.writeFile(file, newFileContents);
    console.log(`Processed ${path.basename(file)}`);
  }
}

processMarkdownFiles();
const fs = require("fs-extra");
const {join} = require("path");
const path = require("path");
const matter = require("gray-matter");
require('dotenv').config({ path: join(__dirname, '../.env') });
const { generateAndSaveImage} = require("./imageGenerator");
const { generateText } = require("./textGenerator");

// Function to generate metadata
async function generateMetadata(content) {
  return await generateText(
    `Generate metadata for a blog post given the following content:\n\n${content}\n\nMetadata format:\n---\ntitle: ""\ndescription: ""\nfeaturedImage: ""\ndate: ""\nauthor:\n name: ""\n picture: ""\nogImage:\n url: ""\n---\n`,
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
    const imagePath = path.join(postsDirectory, `${file.replace(/\.md$/, ".png")}`);
    await generateAndSaveImage(content, imagePath);
    data.coverImage = path.relative(postsDirectory, imagePath);
    const newFileContents = matter.stringify(content, data);
    await fs.writeFile(file, newFileContents);
    console.log(`Processed ${path.basename(file)}`);
  }
}

processMarkdownFiles();
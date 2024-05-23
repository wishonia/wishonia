const {writeFileSync} = require("fs");
const {stringify} = require("gray-matter");
const {convertToRelativePath, generateAndSaveFeaturedImageJpg} = require("./imageGenerator");
const {textCompletion} = require("../lib/llm");
async function saveMarkdownPost(postPath, name, description, featuredImage, content) {
    featuredImage = convertToRelativePath(featuredImage)
    const postContent = stringify(content, {name, description, featuredImage})
    writeFileSync(postPath, postContent);
    console.log(`Post saved to ${postPath}`);
}

async function generateMarkdownAndImageFromDescription(postPath, name, description) {
    const imagePath = postPath.replace('.md', '.png');
    let jpgPath = await generateAndSaveFeaturedImageJpg(description, imagePath);
    jpgPath = convertToRelativePath(jpgPath)
    const content = await textCompletion(`"Generate an article on ${description}`, "text")
    const metaData = {name, description, "featuredImage": jpgPath}
    const markdownWithMetaString = stringify(content, metaData)
    writeFileSync(postPath, markdownWithMetaString);
    console.log(`Post saved to ${postPath}`);
}

module.exports = {
    saveMarkdownPost,
    generateMarkdownAndImageFromDescription
};
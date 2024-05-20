const {writeFileSync} = require("fs");
const {stringify} = require("gray-matter");
const {convertToRelativePath} = require("./imageGenerator");
async function saveMarkdownPost(postPath, name, description, featuredImage, content) {
    featuredImage = convertToRelativePath(featuredImage)
    const postContent = stringify(content, {name, description, featuredImage})
    writeFileSync(postPath, postContent);
    console.log(`Post saved to ${postPath}`);
}

module.exports = {
    saveMarkdownPost
};
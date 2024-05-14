const {writeFile} = require("fs");
async function saveMarkdownPost(postPath, title, excerpt, coverImage, content) {
    const postContent = `---
title: "${title}"   
excerpt: "${excerpt}"
coverImage: "${coverImage}"
ogImage:
    url: "${coverImage}"
---
${content}
`;

        writeFile(postPath, postContent, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log(`Post saved to ${postPath}`);
        });
}

module.exports = {
    saveMarkdownPost
};
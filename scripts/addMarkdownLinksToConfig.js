const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const linksFilePath = path.join(__dirname, '../config/links.ts');
const publicDirPath = path.join(__dirname, '../public');

// Function to read the front matter from a markdown file
function readFrontMatter(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return matter(fileContent).data;
}

// Function to append link to the config file
function appendLinkToConfig(title, href) {
    const linkEntry = `  {
    title: "${title}",
    href: "${href}",
    icon: "file-text",
  },\n`;
    const fileContent = fs.readFileSync(linksFilePath, 'utf8');
    const insertionPoint = fileContent.lastIndexOf('];') - 1;
    const updatedContent = fileContent.slice(0, insertionPoint) + linkEntry + fileContent.slice(insertionPoint);
    fs.writeFileSync(linksFilePath, updatedContent);
}

// Main function to scan markdown files and update config
function updateLinksConfig() {
    const markdownFiles = fs.readdirSync(publicDirPath).filter(file => file.endsWith('.md'));

    markdownFiles.forEach(file => {
        const filePath = path.join(publicDirPath, file);
        const { title } = readFrontMatter(filePath);
        const href = `/${file.replace('.md', '')}`;
        appendLinkToConfig(title, href);
    });

    console.log('Links config updated with markdown files.');
}

updateLinksConfig()
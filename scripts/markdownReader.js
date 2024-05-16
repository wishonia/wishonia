import fs from "fs";
import path from "path";
import matter from "gray-matter";
function listMarkdownFiles(path) {
    return fs.readdirSync(path).filter(file => file.endsWith('.md'));
}
function readFrontMatter(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return matter(fileContent);
}
export function getMarkdownObjects(folder) {
    const markdownFiles = listMarkdownFiles(folder);
    const objects = [];
    for(let i = 0; i < markdownFiles.length; i++) {
        const file = markdownFiles[i];
        const filePath = path.join(folder, file);
        const obj = readFrontMatter(filePath);
        objects.push(obj);
    }
    return objects;
}

module.exports = {
    getMarkdownObjects
}

const objects = getMarkdownObjects(path.join(__dirname, '..', 'public', 'wishingWells'));
console.log("wishingWells: ", objects);
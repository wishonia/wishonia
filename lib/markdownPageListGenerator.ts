import { readAllMarkdownFiles } from '@/lib/markdownReader';
import {MarkdownPage} from "@/interfaces/markdownPage";
import {absPathFromPublic, absPathFromRepo} from "@/lib/fileHelper";
function pathRelativeToPublic(absPath: string) {
  let relativePath = absPath.replace(absPathFromPublic(), '');
  relativePath = relativePath.replace(/\\/g, '/');
    return relativePath;
}

export async function generateMarkdownPageList() {
  const markdownFiles = await readAllMarkdownFiles(absPathFromPublic('docs'));

  const markdownPages: MarkdownPage[] = markdownFiles.map((file) => {
    const markdownPage = JSON.parse(JSON.stringify(file));
    markdownPage.url = pathRelativeToPublic(file.absFilePath);
    markdownPage.url = markdownPage.url.replace('.md', '');
    if(!file.name){
        console.log('No name found for file:', file.absFilePath);
        throw new Error(`No name found for file: ${file.absFilePath}`);
    }
    return {
      name: file.name,
      url: markdownPage.url,
      description: file.description,
      featuredImage: file.featuredImage,
      content: file.content,
    } as MarkdownPage;
  });

  const markdownPagesCode = `export const markdownPages = ${JSON.stringify(markdownPages, null, 2)}`;

  const filePath = absPathFromRepo('lib/markdownPages.ts');
  const fileContent = `${markdownPagesCode}\n`;

  // Save the file content to the specified file path
  const fs = require('fs');
  fs.writeFileSync(filePath, fileContent);
}

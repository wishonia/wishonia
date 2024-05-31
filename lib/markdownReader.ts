import {MarkdownFile} from "@/interfaces/markdownFile";

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import {absPathFromPublic, getNonIgnoredFiles} from "@/lib/fileHelper";

export async function readAllMarkdownFiles(absFolderPath?: string): Promise<MarkdownFile[]> {
    if(!absFolderPath){
        absFolderPath = absPathFromPublic('');
    }
    // Get an absolute path to directory above this script
    const allFiles = getNonIgnoredFiles(absFolderPath);
    const markdownFiles = allFiles.filter(file => file.endsWith('.md'));
    return markdownFiles.map(fullPath => {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const {data, content} = matter(fileContents);
        // get filename without an extension
        const slug = path.basename(fullPath).replace(/\.md$/, '');
        const markdownFile: MarkdownFile = {
            slug: slug,
            name: data.name,
            date: data.date,
            featuredImage: data.featuredImage,
            author: data.author,
            description: data.description,
            ogImage: data.ogImage,
            content: content,
            preview: data.preview,
            absFilePath: fullPath
        };

        return markdownFile;
    });
}

export async function getMarkdownFilesWithoutMetaData(absFolderPath?: string): Promise<MarkdownFile[]> {
    const allFiles = getNonIgnoredFiles(absFolderPath);
    const mdFilePaths = allFiles.filter(file => file.endsWith('.md'));
    const mdFilesWithoutMetaData = [];
    for (const mdFilePath of mdFilePaths) {
        const fileContents = fs.readFileSync(mdFilePath, 'utf8');
        const {data} = matter(fileContents);
        if (!data.name) {
            const markdownFile: MarkdownFile = {
                absFilePath: mdFilePath,
                name: data.name
            };
            mdFilesWithoutMetaData.push(markdownFile);
        }
    }
    const filenames = mdFilesWithoutMetaData.map(mdFile => mdFile.absFilePath);
    console.log(`Files without metadata: ${filenames.join('\n\t- ')} `);
    return mdFilesWithoutMetaData;
}
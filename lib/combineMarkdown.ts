import fs from 'fs';
import path from 'path';

function combineMarkdownFiles(sourcePath: string, outputFileName: string = 'combined_markdown.md'): string {
    const repoRoot = process.cwd();
    const fullSourcePath = path.join(repoRoot, sourcePath);
    const outputFile = path.join(repoRoot, 'build', outputFileName);

    try {
        fs.mkdirSync(path.dirname(outputFile), { recursive: true });

        const markdownFiles = findMarkdownFiles(fullSourcePath);
        const combinedContent = processMarkdownFiles(markdownFiles, repoRoot);

        fs.writeFileSync(outputFile, combinedContent);
        console.log(`Markdown files combined successfully into ${outputFile}`);
        return outputFile;
    } catch (error) {
        console.error(`Error combining Markdown files from ${sourcePath} to ${outputFile}:`, error);
        throw error;
    }
}

function findMarkdownFiles(dir: string): string[] {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    let markdownFiles: string[] = [];

    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            markdownFiles = markdownFiles.concat(findMarkdownFiles(fullPath));
        } else if (file.name.endsWith('.md')) {
            markdownFiles.push(fullPath);
        }
    }

    return markdownFiles;
}

function processMarkdownFiles(files: string[], repoRoot: string): string {
    let combinedContent = '';

    for (const file of files) {
        const relativePath = path.relative(repoRoot, file);
        const content = fs.readFileSync(file, 'utf-8');

        combinedContent += `--- BEGIN FILE: ${relativePath} ---\n`;
        combinedContent += content;
        combinedContent += `\n--- END FILE: ${relativePath} ---\n\n`;
    }

    return combinedContent;
}

export { combineMarkdownFiles };
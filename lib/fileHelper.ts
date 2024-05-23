import fs from 'fs';
import path from 'path';
import ignore, { Ignore } from 'ignore';
export function convertToRelativePath(absolutePath: string): string {
    // Split the coverImage path into an array of directories
    let pathArray = absolutePath.split(/\/|\\/);
    // Find the index of the 'public' directory
    let publicIndex = pathArray.indexOf('public');
    // If 'public' directory is not found, return the original path
    if (publicIndex === -1) { return absolutePath; }
    // Get the path after the 'public' directory
    return '/' + pathArray.slice(publicIndex + 1).join('/');
}

function isAbsolute(pathRelativeToRepoRoot: string): boolean {
    return path.isAbsolute(pathRelativeToRepoRoot);
}

export function convertToAbsolutePath(pathRelativeToRepoRoot: string): string {
    if(isAbsolute(pathRelativeToRepoRoot)) {
        return pathRelativeToRepoRoot;
    }
    // Get the absolute path to the 'public' directory
    const repoDir = path.join(__dirname, '..');
    // Return the absolute path to the file
    return path.join(repoDir, pathRelativeToRepoRoot);
}

function loadGitignore(rootDir: string): Ignore {
    const ig = ignore();
    const gitignorePath = path.join(rootDir, '.gitignore');

    if (fs.existsSync(gitignorePath)) {
        const gitignore = fs.readFileSync(gitignorePath).toString();
        ig.add(gitignore);
    }

    return ig;
}

function getAllFiles(dirPath: string, ig: Ignore, arrayOfFiles: string[] = []): string[] {
    dirPath = convertToAbsolutePath(dirPath);
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const relativeFilePath = path.relative(dirPath, filePath);

        // Skip file if it matches .gitignore patterns
        if (ig.ignores(relativeFilePath)) {
            return;
        }

        if (fs.statSync(filePath).isDirectory()) {
            arrayOfFiles = getAllFiles(filePath, ig, arrayOfFiles);
        } else {
            arrayOfFiles.push(filePath);
        }
    });

    return arrayOfFiles;
}

export function getNonIgnoredFiles(folderPath?: string): string[] {
    // Get an absolute path to directory above this script
    const rootDir = path.dirname(__dirname);
    const ig = loadGitignore(rootDir);
    if(!folderPath) {
        folderPath = rootDir;
    }
    return getAllFiles(folderPath, ig);
}
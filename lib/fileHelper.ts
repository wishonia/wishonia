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
    // Get the absolute path to the repository root
    const repoRoot = path.resolve(__dirname, '../');

    // Check if the path to the repository root is included in the path
    return pathRelativeToRepoRoot.startsWith(repoRoot);
}

export function absPathFromPublic(pathRelativeToPublic?: string): string {
    if(pathRelativeToPublic && isAbsolute(pathRelativeToPublic)) {
        return pathRelativeToPublic;
    }
    // Get the absolute path to the 'public' directory
    const publicDir = path.join(__dirname, '../public');
    if(!pathRelativeToPublic){return publicDir;}
    // Return the absolute path to the file
    return path.join(publicDir, pathRelativeToPublic);
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

function getAllFiles(absPath: string, ig: Ignore, arrayOfFiles: string[] = []): string[] {

    const files = fs.readdirSync(absPath);

    files.forEach(file => {
        const absFilePath = path.join(absPath, file);
        const relativeFilePath = path.relative(absPath, absFilePath);

        // Skip file if it matches .gitignore patterns
        if (ig.ignores(relativeFilePath)) {
            return;
        }

        if (fs.statSync(absFilePath).isDirectory()) {
            arrayOfFiles = getAllFiles(absFilePath, ig, arrayOfFiles);
        } else {
            arrayOfFiles.push(absFilePath);
        }
    });

    return arrayOfFiles;
}

export function getNonIgnoredFiles(absFolderPath?: string): string[] {
    // Get an absolute path to directory above this script
    const rootDir = path.dirname(__dirname);
    const ig = loadGitignore(rootDir);
    if(!absFolderPath) {
        absFolderPath = rootDir;
    }
    return getAllFiles(absFolderPath, ig);
}
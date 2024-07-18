const fs = require('fs');
const path = require('path');
const ignore = require('ignore').default;
const repoPath = path.join(__dirname, '..');
const outputFile = path.join(repoPath, 'build', 'repo_contents.txt');
const MAX_FILE_SIZE_KB = 10;

async function repo2File() {
    if (!fs.existsSync('build')) {
        fs.mkdirSync('build');
    }

    const output = fs.createWriteStream(outputFile);
    const gitignore = ignore();
    gitignore.add('.git');
    // ignore markdown files
    gitignore.add('*.md');
    // ignore json files
    gitignore.add('*.json');
    // ignore spreadsheet files
    gitignore.add('*.csv');
    gitignore.add('*.xlsx');
    gitignore.add('*.xls');
    gitignore.add('*.yml');
    gitignore.add('*.yml');
    gitignore.add('*.xml');
    gitignore.add('*.sql');

    if (fs.existsSync('.gitignore')) {
        gitignore.add(fs.readFileSync('.gitignore', 'utf-8'));
    }

    const includedFiles = [];

    for await (const file of getFiles(repoPath)) {
        // Skip files directly in the repo root
        if (path.dirname(file) === repoPath) {
            continue;
        }

        const relativePath = path.relative(repoPath, file);
        if (gitignore.ignores(relativePath) || isBinaryFile(file)) {
            continue;
        }

        const stats = fs.statSync(file);
        if(stats.size > MAX_FILE_SIZE_KB * 1024) {
            console.log(`Skipping ${relativePath} because it is ${stats.size} bytes`);
            continue;
        }
        includedFiles.push({ path: relativePath, size: stats.size });

        const content = fs.readFileSync(file, 'utf-8');

        output.write(`--- BEGIN FILE: ${relativePath} ---\n`);
        output.write(content);
        output.write(`\n--- END FILE: ${relativePath} ---\n\n`);
    }

    // Sort files by size (ascending order)
    includedFiles.sort((a, b) => a.size - b.size);

    console.log(`Repository packed successfully into ${outputFile}`);
    console.log('Included files (sorted by size):');
    includedFiles.forEach(file => console.log(`${file.path} (${file.size} bytes)`));
}

async function* getFiles(dir) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            yield* getFiles(fullPath);
        } else {
            yield fullPath;
        }
    }
}

function isBinaryFile(filePath) {
    // Check if the path is a file before attempting to read
    if (!fs.statSync(filePath).isFile()) {
        return false;
    }

    const bytes = fs.readFileSync(filePath, { length: 4 });
    for (const byte of bytes) {
        if (byte === 0) {
            return true;
        }
    }
    return false;
}
repo2File();
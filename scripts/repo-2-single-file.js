const fs = require('fs');
const path = require('path');
const ignore = require('ignore').default;
const repoPath = path.join(__dirname, '..');
const outputFile = path.join(repoPath, 'build', 'repo_contents.txt');
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
    gitignore.add('*yml');
    gitignore.add('*.xml');

    if (fs.existsSync('.gitignore')) {
        gitignore.add(fs.readFileSync('.gitignore', 'utf-8'));
    }

    for await (const file of getFiles(repoPath)) {
        // Skip files directly in the repo root
        if (path.dirname(file) === repoPath) {
            continue;
        }

        const relativePath = path.relative(repoPath, file);
        if (gitignore.ignores(relativePath) || isBinaryFile(file)) {
            continue;
        }

        const content = fs.readFileSync(file, 'utf-8');

        output.write(`--- BEGIN FILE: ${relativePath} ---\n`);
        output.write(content);
        output.write(`\n--- END FILE: ${relativePath} ---\n\n`);
    }

    console.log(`Repository packed successfully into ${outputFile}`);
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
    const bytes = fs.readFileSync(filePath, { length: 4 });
    for (const byte of bytes) {
        if (byte === 0) {
            return true;
        }
    }
    return false;
}

repo2File();
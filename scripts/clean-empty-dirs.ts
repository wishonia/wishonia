import * as fs from 'fs';
import * as path from 'path';

function isDirectoryEmpty(dirPath: string): boolean {
  const files = fs.readdirSync(dirPath);
  return files.length === 0;
}

function deleteEmptyFolders(dirPath: string): void {
  // Read directory contents
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    
    // Skip if it's not a directory or if it starts with '.' or '_'
    if (!fs.statSync(fullPath).isDirectory() ||
      file.startsWith('.') ||
      file.startsWith('_')) {
      continue;
    }

    // Recursively check subdirectories
    deleteEmptyFolders(fullPath);

    // After processing subdirectories, check if this directory is now empty
    if (isDirectoryEmpty(fullPath)) {
      console.log(`Deleting empty directory: ${fullPath}`);
      fs.rmdirSync(fullPath);
    }
  }
}

// Start cleaning from the app directory
const appDir = path.join(process.cwd(), 'app');
console.log('Starting to clean empty directories...');
deleteEmptyFolders(appDir);
console.log('Finished cleaning empty directories');

// Add empty export to make it a module
export {}; 
import fs from 'fs';
import path from 'path';

async function listMarkdownFiles(dirPath: string): Promise<string[]> {
  let markdownFiles: string[] = [];
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      markdownFiles = markdownFiles.concat(await listMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md')) {
      markdownFiles.push("/" + fullPath.substring(fullPath.indexOf('/public') + 7));
    }
  }
  return markdownFiles;
}

export const GET = async () => {
  const directoryPath = path.join(process.cwd(), 'public');
  try {
    const markdownFiles = await listMarkdownFiles(directoryPath);
    return new Response(JSON.stringify({ markdownFiles }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    let errorMessage = 'An unknown error occurred';
    if (err instanceof Error) {
      errorMessage = err.message;
    }
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
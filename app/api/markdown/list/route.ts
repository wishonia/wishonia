import fs from 'fs';
import path from 'path';

export const GET = async () => {
  const directoryPath = path.join(process.cwd(), 'public');
  try {
    const files = await fs.promises.readdir(directoryPath);
    const markdownFiles = files.filter(file => file.endsWith('.md')).map(file => "/" + file);
    const directories = files.filter(file => !file.includes('.'));
    for (const directory of directories) {
      const nestedFiles = await fs.promises.readdir(path.join(directoryPath, directory));
      const nestedMarkdownFiles = nestedFiles.filter(file => file.endsWith('.md')).map(file => `/${directory}/${file}`);
      markdownFiles.push(...nestedMarkdownFiles);
    }
    return new Response(JSON.stringify(markdownFiles))
  } catch (err) {
    if (err instanceof Error) {
      return new Response(err.message, { status: 500 });
    } else {
      return new Response('An unknown error occurred', { status: 500 });
    }
  }
}
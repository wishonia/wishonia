import fs from 'fs';

export async function GET(req: any) {
  const { searchParams } = new URL(req.url);
  const mdPath = searchParams.get('path');
  if (typeof mdPath !== 'string') {
    return new Response('Invalid path', { status: 400 })
  }
  const filePath = mdPath.join(process.cwd(), 'public', ...mdPath.split('/')) + '.md';

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return new Response('Markdown file not found', { status: 404 })
    }
    return new Response(JSON.stringify({ content: data }), { status: 200 })
  });
}

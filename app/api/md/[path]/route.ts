import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: mdPath } = req.query;
  if (typeof mdPath !== 'string') {
    return res.status(400).json({ message: 'Invalid path' });
  }
  const filePath = path.join(process.cwd(), 'public', ...mdPath.split('/')) + '.md';
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(404).json({ message: 'Markdown file not found' });
    }
    res.status(200).json({ content: data });
  });
}

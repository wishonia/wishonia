import fs from 'fs';
import path from 'path';

export const GET = async () => {
  const directoryPath = path.join(process.cwd(), 'public/img/war');
  try {
    const files = await fs.promises.readdir(directoryPath);
    const filePaths = files.map(file => "/img/war/" + file);
    return Response.json(filePaths)
  } catch (err) {
    return Response.json({ message: "Unable to scan directory: " + err }, {
        status: 500
    });
  }
}

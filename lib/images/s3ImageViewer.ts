import { S3Client, ListObjectsV2Command, CopyObjectCommand } from "@aws-sdk/client-s3";
import mime from 'mime-types';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export async function makeS3ImagesViewable(bucketName: string, folderPrefix: string) {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: folderPrefix
    });

    const { Contents } = await s3Client.send(listCommand);
    
    if (!Contents) {
      console.log('No objects found in the specified folder');
      return;
    }

    let processedCount = 0;
    const totalImages = Contents.length;

    for (const object of Contents) {
      if (!object.Key) continue;

      const extension = object.Key.split('.').pop()?.toLowerCase();
      const contentType = mime.lookup(extension || '') || 'application/octet-stream';

      if (!contentType.startsWith('image/')) {
        console.log(`Skipping non-image file: ${object.Key}`);
        continue;
      }

      const copyCommand = new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: `${bucketName}/${object.Key}`,
        Key: object.Key,
        MetadataDirective: 'REPLACE',
        ContentType: contentType,
        ContentDisposition: 'inline',
        Metadata: {
          'Cache-Control': 'max-age=31536000'
        }
      });

      await s3Client.send(copyCommand);
      processedCount++;
      
      console.log(`Processed ${processedCount}/${totalImages}: ${object.Key}`);
    }

    console.log(`Successfully updated ${processedCount} images in ${folderPrefix}`);
    return processedCount;
  } catch (error) {
    console.error('Error updating image metadata:', error);
    throw error;
  }
}
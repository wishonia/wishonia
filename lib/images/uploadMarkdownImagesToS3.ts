import { readFile, writeFile, readdir } from 'fs/promises'
import path from 'path'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import mime from 'mime-types'

interface Config {
  sourcePath: string
  s3Bucket: string
  s3Directory: string
  s3Region: string
}

async function getAllFiles(dirPath: string, basePath: string): Promise<{ path: string; name: string }[]> {
  const files = await readdir(dirPath, { withFileTypes: true })
  const allFiles: { path: string; name: string }[] = []

  for (const file of files) {
    const fullPath = path.join(dirPath, file.name)
    
    if (file.isDirectory()) {
      const subFiles = await getAllFiles(fullPath, basePath)
      allFiles.push(...subFiles)
    } else {
      const relativePath = path.relative(basePath, fullPath)
      allFiles.push({
        path: fullPath,
        name: relativePath.split(path.sep).join('/')
      })
    }
  }

  return allFiles
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function uploadMarkdownImagesToS3(config: Config) {
  const s3Client = new S3Client({ region: config.s3Region })
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
  
  try {
    const files = await getAllFiles(config.sourcePath, config.sourcePath)
    const imageMap = new Map<string, { url: string; relativePath: string }>()
    
    // Upload images
    for (const file of files) {
      const ext = path.extname(file.name).toLowerCase()
      
      if (imageExtensions.includes(ext)) {
        const imageBuffer = await readFile(file.path)
        const mimeType = mime.lookup(ext) || 'application/octet-stream'
        
        // Ensure forward slashes for S3 key
        const s3Key = `${config.s3Directory}/${file.name}`
        console.log(`Uploading ${file.path} to s3://${config.s3Bucket}/${s3Key}`)
        
        await s3Client.send(new PutObjectCommand({
          Bucket: config.s3Bucket,
          Key: s3Key,
          Body: imageBuffer,
          ContentType: mimeType
        }))
        
        const s3Url = `https://${config.s3Bucket}.s3.${config.s3Region}.amazonaws.com/${s3Key}`
        imageMap.set(file.path, { url: s3Url, relativePath: file.name })
      }
    }
    
    // Update markdown files
    for (const file of files) {
      if (path.extname(file.name).toLowerCase() === '.md') {
        let content = await readFile(file.path, 'utf-8')
        const mdDir = path.dirname(file.path)
        
        const imageEntries = Array.from(imageMap.entries())
        for (const [imagePath, imageData] of imageEntries) {
          const relativeToMd = path.relative(mdDir, imagePath).split(path.sep).join('/')
          const imageBasename = path.basename(imagePath)
          
          const patterns = [
            // Matches ![Alt](image.png)
            new RegExp(`!\\[([^\\]]*)\\]\\(${escapeRegExp(imageBasename)}\\)`, 'g'),
            
            // Matches ![Alt](../image.png)
            new RegExp(`!\\[([^\\]]*)\\]\\(\\.\\.\\/${escapeRegExp(imageBasename)}\\)`, 'g'),
            
            // **Updated Pattern**: Matches ![Alt](image.png) and ![Alt](./image.png)
            new RegExp(`!\\[([^\\]]*)\\]\\(\\.?\\/?${escapeRegExp(relativeToMd)}\\)`, 'g'),
            
            // Matches <img src="image.png" />
            new RegExp(`<img[^>]*src=["']${escapeRegExp(imageBasename)}["'][^>]*>`, 'g'),
            
            // **Updated Pattern**: Matches <img src="image.png" /> and <img src="./image.png" />
            new RegExp(`<img[^>]*src=["']\\.?\\/?${escapeRegExp(relativeToMd)}["'][^>]*>`, 'g')
          ]
          
          patterns.forEach(pattern => {
            content = content.replace(pattern, (match, alt = '') => {
              if (match.startsWith('<img')) {
                return match.replace(/(src=["'])[^"']*?(["'])/, `$1${imageData.url}$2`)
              }
              return `![${alt}](${imageData.url})`
            })
          })
        }
        
        await writeFile(file.path, content, 'utf-8')
      }
    }
    
    return true
  } catch (error) {
    console.error('Error processing files:', error)
    throw error
  }
}

export type { Config } 
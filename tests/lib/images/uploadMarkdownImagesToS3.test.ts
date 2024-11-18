/**
 * @jest-environment node
 */
import { uploadMarkdownImagesToS3, type Config } from '@/lib/images/uploadMarkdownImagesToS3'
import { writeFile, mkdir, rm, readFile } from 'fs/promises'
import path from 'path'
import { S3Client, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3'

async function setupTestFiles(testDir: string) {
  await mkdir(testDir, { recursive: true })
  
  const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
  const imageBuffer = Buffer.from(base64Image, 'base64')
  await writeFile(path.join(testDir, 'test-image.png'), imageBuffer)
  
  const markdownContent = '# Test\n![Test Image](test-image.png)'
  await writeFile(path.join(testDir, 'test.md'), markdownContent)
}

async function cleanupTestFiles(testDir: string, s3Client: S3Client, config: Config) {
  await rm(testDir, { recursive: true, force: true })
  
  const listResponse = await s3Client.send(new ListObjectsV2Command({
    Bucket: config.s3Bucket,
    Prefix: config.s3Directory
  }))
  
  if (listResponse.Contents) {
    for (const object of listResponse.Contents) {
      await s3Client.send(new DeleteObjectCommand({
        Bucket: config.s3Bucket,
        Key: object.Key
      }))
    }
  }
}

describe('S3 Image Upload tests', () => {
  const testDir = path.join(process.cwd(), 'tmp-test-images')
  const testConfig: Config = {
    sourcePath: testDir,
    s3Bucket: process.env.AWS_BUCKET!,
    s3Directory: 'test-uploads',
    s3Region: process.env.AWS_REGION || 'us-east-1'
  }
  
  const s3Client = new S3Client({ region: testConfig.s3Region })

  it('uploads images and updates markdown references', async () => {
    await setupTestFiles(testDir)
    
    await uploadMarkdownImagesToS3(testConfig)
    
    const listResponse = await s3Client.send(new ListObjectsV2Command({
      Bucket: testConfig.s3Bucket,
      Prefix: testConfig.s3Directory
    }))
    
    expect(listResponse.Contents).toBeDefined()
    expect(listResponse.Contents!.length).toBeGreaterThan(0)
    
    const uploadedImage = listResponse.Contents!.find(obj => 
      obj.Key === `${testConfig.s3Directory}/test-image.png`
    )
    expect(uploadedImage).toBeDefined()
    
    const updatedMarkdown = await readFile(path.join(testDir, 'test.md'), 'utf-8')
    const expectedUrl = `https://${testConfig.s3Bucket}.s3.${testConfig.s3Region}.amazonaws.com/${testConfig.s3Directory}/test-image.png`
    expect(updatedMarkdown).toBe(`# Test\n![Test Image](${expectedUrl})`)

    await cleanupTestFiles(testDir, s3Client, testConfig)
  }, 30000)

  it('handles nested directories correctly', async () => {
    await setupTestFiles(testDir)
    const nestedDir = path.join(testDir, 'nested')
    await mkdir(nestedDir, { recursive: true })
    
    const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
    const imageBuffer = Buffer.from(base64Image, 'base64')
    await writeFile(path.join(nestedDir, 'nested-image.png'), imageBuffer)
    
    const markdownContent = '# Nested Test\n![Nested Image](./nested-image.png)'
    await writeFile(path.join(nestedDir, 'nested.md'), markdownContent)
    
    await uploadMarkdownImagesToS3(testConfig)
    
    const listResponse = await s3Client.send(new ListObjectsV2Command({
      Bucket: testConfig.s3Bucket,
      Prefix: testConfig.s3Directory
    }))
    
    console.log('S3 Objects:', listResponse.Contents?.map(obj => obj.Key))
    
    expect(listResponse.Contents).toBeDefined()
    expect(listResponse.Contents).not.toBeNull()
    const nestedImage = listResponse.Contents!.find(obj => 
      obj.Key === `${testConfig.s3Directory}/nested/nested-image.png`
    )
    expect(nestedImage).toBeDefined()
    
    const updatedMarkdown = await readFile(path.join(nestedDir, 'nested.md'), 'utf-8')
    const expectedUrl = `https://${testConfig.s3Bucket}.s3.${testConfig.s3Region}.amazonaws.com/${testConfig.s3Directory}/nested/nested-image.png`
    expect(updatedMarkdown).toBe(`# Nested Test\n![Nested Image](${expectedUrl})`)

    await cleanupTestFiles(testDir, s3Client, testConfig)
  }, 30000)
})

describe('DFDA Image Upload', () => {
  const dfdaConfig: Config = {
    sourcePath: path.join(process.cwd(), 'public/globalSolutions/dfda'),
    s3Bucket: process.env.AWS_BUCKET!,
    s3Directory: 'dfda',
    s3Region: process.env.AWS_REGION || 'us-east-1'
  }

  it('uploads DFDA images to S3', async () => {
    const s3Client = new S3Client({ region: dfdaConfig.s3Region })
    
    // Upload the images
    await uploadMarkdownImagesToS3(dfdaConfig)
    
    // Verify the upload by listing objects
    const listResponse = await s3Client.send(new ListObjectsV2Command({
      Bucket: dfdaConfig.s3Bucket,
      Prefix: dfdaConfig.s3Directory
    }))
    
    expect(listResponse.Contents).toBeDefined()
    expect(listResponse.Contents!.length).toBeGreaterThan(0)
    
    // Log uploaded files for verification
    console.log('Uploaded DFDA files:', 
      listResponse.Contents?.map(obj => obj.Key)
    )
  }, 60000)
})
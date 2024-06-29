import fs from "fs-extra"
import fetch from "node-fetch"
import sharp from "sharp"

import {
  absPathFromPublic,
  absPathFromRepo,
  getNonIgnoredFiles,
  relativePathFromPublic,
} from "@/lib/fileHelper"
import { uploadImageToVercel, vercelImageExists } from "@/lib/imageUploader"
import { openai } from "@/lib/llm"

interface GenerateImageOptions {
  prompt: string
  amount?: number
  resolution?: "512x512" | "256x256" | "1024x1024" | "1792x1024" | "1024x1792"
}

export async function generateImage(
  body: GenerateImageOptions,
  model: "dall-e-2" | "dall-e-3"
): Promise<any> {
  let { prompt, amount = 1, resolution } = body

  if (!process.env.OPENAI_API_KEY) {
    throw Error("OpenAI API Key not configured.")
  }

  if (!prompt) {
    throw Error("Prompt is required")
  }

  // Define the maximum length for each model
  const maxLength = model === "dall-e-2" ? 1000 : 3500

  // Check if the prompt exceeds the maximum length
  if (prompt.length > maxLength) {
    console.warn(
      `Prompt exceeds the maximum length for ${model}. It will be truncated.`
    )
    prompt = prompt.substring(0, maxLength)
  }

  const response = await openai.images.generate({
    model,
    prompt,
    n: amount || 1,
    size: resolution,
  })

  return response.data[0]
}

export async function generateFeaturedImagePngBuffer(
  content: string
): Promise<Buffer> {
  const prePrompt = `full width image for an article on ${content}. 
    Requirements: 
    1. THE IMAGE SHOULD NOT CONTAIN ANY TEXT! 
    2. Use a colorful 16-bit style.`
  console.log(`Generating image for content:
     ${content}`)
  // const generatedPrompt = await textCompletion(`Generate a detailed prompt description
  // for an AI image generator to generate
  //     an ${prePrompt} `,
  //     "text");
  //console.log(generatedPrompt)
  const response = await generateImage(
    {
      prompt: prePrompt,
      resolution: "1792x1024",
      amount: 1,
    },
    "dall-e-3"
  )
  const imageUrl = response.url
  const image = await fetch(imageUrl)
  return await image.buffer()
}

const JPG_QUALITY = 30

async function convertPngBufferToJpgBuffer(pngBuffer: Buffer): Promise<Buffer> {
  return await sharp(pngBuffer).jpeg({ quality: JPG_QUALITY }).toBuffer()
}

export async function generateAndUploadFeaturedImageJpg(
  content: string,
  imagePath: string
): Promise<string> {
  if (!process.env.GENERATE_IMAGES) {
    throw new Error(`Set process.env.GENERATE_IMAGES to true to generate images. 
         This is to prevent accidental image generation which can be costly.`)
  }
  imagePath = imagePath.replace(/\.[^/.]+$/, ".jpg")
  const jpgAbsPath = absPathFromPublic(imagePath)
  const jpgPublicPath = relativePathFromPublic(jpgAbsPath)
  if (fs.existsSync(jpgAbsPath)) {
    console.log(`JPG image already exists at ${jpgAbsPath}`)
    return await uploadImageToVercel(fs.readFileSync(jpgAbsPath), jpgPublicPath)
  }
  let url = await vercelImageExists(jpgPublicPath)
  if (url) {
    return url
  }
  const pngBuffer = await generateFeaturedImagePngBuffer(content)
  fs.writeFileSync(jpgAbsPath.replace(".jpg", ".png"), pngBuffer)
  const jpgBuffer = await convertPngBufferToJpgBuffer(pngBuffer)
  fs.writeFileSync(jpgAbsPath, jpgBuffer)
  return await uploadImageToVercel(jpgBuffer, jpgPublicPath)
}

export async function convertLargeImagesToJpg() {
  const allFiles = await getImagesGreaterThan(300)
  for (const file of allFiles) {
    const absPath = absPathFromRepo(file)
    convertToJpg(absPath)
  }
}
function convertToJpg(absPath: string) {
  const buffer = fs.readFileSync(absPath)
  let outputJpgAbsPath = absPath.replace(/\.[^/.]+$/, ".jpg")
  try {
    fs.writeFileSync(outputJpgAbsPath, buffer)
  } catch (e) {
    outputJpgAbsPath = absPath.replace(/\.[^/.]+$/, "-compressed.jpg")
    console.error(
      `Error converting ${absPath} to jpg. Saving as ${outputJpgAbsPath}`
    )
    fs.writeFileSync(outputJpgAbsPath, buffer)
  }
}

async function getImagesGreaterThan(maxKb: number) {
  const allFiles = getNonIgnoredFiles(absPathFromRepo())
  const largeFiles = []
  for (const file of allFiles) {
    if (
      !file.endsWith(".png") &&
      !file.endsWith(".jpg") &&
      !file.endsWith(".jpeg") &&
      !file.endsWith(".webp") &&
      !file.endsWith(".gif")
    ) {
      continue
    }
    const stats = await fs.stat(file)
    if (stats.size > maxKb * 1024) {
      largeFiles.push(file)
    }
  }
  return largeFiles
}

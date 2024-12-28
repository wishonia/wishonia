import fs from "fs";

import { list } from "@vercel/blob";



import { absPathFromPublic, getNonIgnoredFiles, relativePathFromPublic } from "@/lib/fileHelper";
import { uploadImageToVercel, vercelImageExists } from "@/lib/imageUploader";





export async function uploadImageToVercelIfNecessary(pathFromPublic: string) {
  let url = await vercelImageExists(pathFromPublic)
  if (url) {
    console.log(`Image already uploaded: ${pathFromPublic}`)
    return
  }
  const buffer = fs.readFileSync(absPathFromPublic(pathFromPublic))
  url = await uploadImageToVercel(buffer, pathFromPublic)
  console.log(`Uploaded: ${url}`)
  return url
}

export async function uploadPublicImagesToVercel() {
  const urls = []
  const imageFiles = getImagesFromPublic()
  for (const pathFromPublic of imageFiles) {
    const url = await uploadImageToVercelIfNecessary(pathFromPublic)
    urls.push(url)
  }
  return urls
}

function getImagesFromPublic() {
  const allFiles = getNonIgnoredFiles(absPathFromPublic(""))
  const imageFiles = []
  for (const file of allFiles) {
    if (
      file.endsWith(".png") ||
      file.endsWith(".jpg") ||
      file.endsWith(".jpeg")
    ) {
      imageFiles.push(file)
    }
  }
  return imageFiles.map(relativePathFromPublic)
}

export async function downloadAllBlobImages() {
  const listBlobResult = await list()
  const blobs = listBlobResult.blobs
  // Loop through array of blobs
  for (const blob of blobs) {
    const url = blob.url
    // Download image from url
    const response = await fetch(url)
    const buffer = await response.text()
    const pathname = relativePathFromPublic(blob.pathname)
    const absPath = absPathFromPublic(pathname)
    if (fs.existsSync(absPath)) {
      console.log(`Image already exists: ${absPath}`)
      continue
    }
    fs.writeFileSync(absPath, buffer)
  }
}
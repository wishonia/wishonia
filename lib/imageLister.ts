import { list } from "@vercel/blob";
import { getRedisClient } from "@/lib/utils/redis"

export async function listImagesOnVercel() {
  const cacheKey = "vercelImages"
  const cachedImages = await getRedisClient().get(cacheKey)
  if (cachedImages) {
    return JSON.parse(cachedImages)
  }
  const listBlobResult = await list()
  const blobs = listBlobResult.blobs
  const urls = []
  for (const blob of blobs) {
    urls.push(blob.url)
  }
  await getRedisClient().set(cacheKey, JSON.stringify(urls))
  return urls
}

export async function getVercelImageUrlFromPath(pathFromPublic: string) {
    const vercelImages = await listImagesOnVercel()
    for (const url of vercelImages) {
        if (url.includes(pathFromPublic)) {
            return url
        }
    }
    return null
}

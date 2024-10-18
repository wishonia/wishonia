import { put } from "@vercel/blob"
export async function uploadImageToVercel(
  buffer: Buffer,
  pathFromPublic: string
) {
  if (pathFromPublic.startsWith("/")) {
    pathFromPublic = pathFromPublic.slice(1)
  }
  const blob = await put(pathFromPublic, buffer, {
    access: "public",
    addRandomSuffix: false,
  })
  return blob.url
}

export async function vercelImageExists(pathFromPublic: string) {
  const url = generateImageUrl(pathFromPublic)
  const response = await fetch(url)
  return response.status === 200 ? url : null
}

function generateImageUrl(pathFromPublic: string) {
  if (pathFromPublic.startsWith("/")) {
    pathFromPublic = pathFromPublic.slice(1)
  }
  return `https://pcpfoetqkuq7jmso.public.blob.vercel-storage.com/${pathFromPublic}`
}

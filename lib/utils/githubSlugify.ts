export function githubSlugify(text: string, userId: string, repoName: string, filePath: string): string {
  // Clean up the file path by removing slashes and file extensions
  const cleanFilePath = filePath
    .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
    .replace(/\.[^/.]+$/, '')   // Remove file extension
    .replace(/\//g, '-')        // Replace remaining slashes with hyphens

  // Slugify the text (file name)
  const baseSlug = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')

  return `${userId}-${repoName}-${cleanFilePath}`
}

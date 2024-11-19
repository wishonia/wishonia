import { Shell } from "@/components/layout/shell"
import { readdir, stat, readFile } from "fs/promises"
import path from "path"
import { FileLink } from "./components/file-link"

interface MarkdownFile {
  path: string
  content: string
  title: string // Extracted from first heading or filename
}

// Helper function to extract title from markdown content
function extractTitle(content: string, fallbackPath: string): string {
  // Try to find the first heading
  const headingMatch = content.match(/^#\s+(.+)$/m)
  if (headingMatch) {
    return headingMatch[1]
  }
  
  // Fallback to filename without extension and path
  const fileName = path.basename(fallbackPath, '.md')
  return fileName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Helper function to recursively get markdown files
async function getMarkdownFiles(dir: string): Promise<MarkdownFile[]> {
  const files = await readdir(dir)
  const markdownFiles: MarkdownFile[] = []

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stats = await stat(filePath)

    if (stats.isDirectory()) {
      const nestedFiles = await getMarkdownFiles(filePath)
      markdownFiles.push(...nestedFiles)
    } else if (file.endsWith('.md')) {
      const content = await readFile(filePath, 'utf-8')
      const relativePath = path.relative(
        path.join(process.cwd(), 'public/globalSolutions/dfda'),
        filePath
      )
      markdownFiles.push({
        path: relativePath,
        content,
        title: extractTitle(content, relativePath)
      })
    }
  }

  return markdownFiles
}

export default async function MarkdownPageListPage() {
  const baseDir = path.join(process.cwd(), 'public/globalSolutions/dfda')
  const markdownFiles = await getMarkdownFiles(baseDir)

  return (
    <Shell>
      <div className="mx-auto max-w-4xl py-8">
        <h1 className="text-3xl font-bold mb-8">Documentation</h1>
        <div className="space-y-4">
          {Object.entries(
            markdownFiles.reduce((acc: Record<string, MarkdownFile[]>, file) => {
              const dirPath = path.dirname(file.path)
              if (!acc[dirPath]) {
                acc[dirPath] = []
              }
              acc[dirPath].push(file)
              return acc
            }, {})
          ).map(([dirPath, files]) => (
            <div key={dirPath} className="border rounded-lg p-4 border-border">
              <h2 className="text-xl font-semibold mb-3">
                {dirPath === '.' ? 'Root' : dirPath}
              </h2>
              <div className="pl-4 space-y-2">
                {files.map((file: MarkdownFile) => (
                  <FileLink key={file.path} file={file} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

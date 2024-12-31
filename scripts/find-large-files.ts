import { readdir, stat } from 'fs/promises'
import { join, relative } from 'path'

async function getAllFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  const items = await readdir(dir, { withFileTypes: true })

  for (const item of items) {
    const path = join(dir, item.name)
    
    if (item.isDirectory()) {
      if (item.name !== 'node_modules' && item.name !== '.next' && !item.name.startsWith('.')) {
        files.push(...(await getAllFiles(path)))
      }
    } else if (item.isFile() && (path.endsWith('.ts') || path.endsWith('.tsx'))) {
      files.push(path)
    }
  }

  return files
}

async function main() {
  const rootDir = process.cwd()
  const files = await getAllFiles(rootDir)
  
  const filesWithSizes = await Promise.all(
    files.map(async (file) => {
      const stats = await stat(file)
      return {
        path: relative(rootDir, file),
        size: stats.size,
        sizeKB: Math.round(stats.size / 1024 * 100) / 100
      }
    })
  )

  const sortedFiles = filesWithSizes
    .sort((a, b) => b.size - a.size)
    .slice(0, 20)

  console.log('\nLargest TypeScript files:')
  console.log('------------------------')
  sortedFiles.forEach((file, i) => {
    console.log(`${i + 1}. ${file.path} (${file.sizeKB} KB)`)
  })
}

main().catch(console.error) 
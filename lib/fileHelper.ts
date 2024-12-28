import fs from "fs"
import path from "path"

import ignore, { Ignore } from "ignore"

export function relativePathFromPublic(absolutePath: string): string {
  // Split the coverImage path into an array of directories
  const pathArray = absolutePath.split(/\/|\\/)
  // Find the index of the 'public' directory
  const publicIndex = pathArray.indexOf("public")
  // If 'public' directory is not found, return the original path
  if (publicIndex === -1) {
    return absolutePath
  }
  // Get the path after the 'public' directory
  return "/" + pathArray.slice(publicIndex + 1).join("/")
}

export function relativePathFromRepo(absolutePath: string): string {
  // Get the absolute path to the repository root
  const repoRoot = path.resolve(__dirname, "../")
  const noRepo = absolutePath.replace(repoRoot, "")
  // fix slashes
  const noRoot = noRepo.replace(/\\/g, "/")
  /// remove leading slash
  return noRoot.startsWith("/") ? noRoot.slice(1) : noRoot
}

function isAbsolute(pathRelativeToRepoRoot: string): boolean {
  // Get the absolute path to the repository root
  const repoRoot = path.resolve(__dirname, "../")

  // Check if the path to the repository root is included in the path
  return pathRelativeToRepoRoot.startsWith(repoRoot)
}

export function absPathFromPublic(pathRelativeToPublic?: string): string {
  if (pathRelativeToPublic && isAbsolute(pathRelativeToPublic)) {
    return pathRelativeToPublic
  }
  // Get the absolute path to the 'public' directory
  const publicDir = path.join(__dirname, "../public")
  if (!pathRelativeToPublic) {
    return publicDir
  }
  // Return the absolute path to the file
  return path.join(publicDir, pathRelativeToPublic)
}

export function absPathFromRepo(pathRelativeToRepo?: string): string {
  if (pathRelativeToRepo && isAbsolute(pathRelativeToRepo)) {
    return pathRelativeToRepo
  }
  // Get the absolute path to the 'public' directory
  const repoDir = path.join(__dirname, "..")
  if (!pathRelativeToRepo) {
    return repoDir
  }
  // Return the absolute path to the file
  return path.join(repoDir, pathRelativeToRepo)
}

function loadGitignore(rootDir: string): Ignore {
  const ig = ignore()
  const gitignorePath = path.join(rootDir, ".gitignore")

  if (fs.existsSync(gitignorePath)) {
    let gitignore = fs.readFileSync(gitignorePath).toString()
    // add .git folder
    gitignore += "\n.git"
    ig.add(gitignore)
  }

  return ig
}

export function getAllFiles(
  absPath: string,
  ig: Ignore,
  arrayOfFiles: string[] = []
): string[] {
  const files = fs.readdirSync(absPath)

  files.forEach((file) => {
    const absFilePath = path.join(absPath, file)
    const relativeFilePath = relativePathFromRepo(absFilePath)

    // Skip file if it matches .gitignore patterns
    if (ig.ignores(relativeFilePath)) {
      return
    }

    if (fs.statSync(absFilePath).isDirectory()) {
      arrayOfFiles = getAllFiles(absFilePath, ig, arrayOfFiles)
    } else {
      arrayOfFiles.push(absFilePath)
    }
  })

  return arrayOfFiles
}

export function getNonIgnoredFiles(absFolderPath?: string): string[] {
  // Get an absolute path to directory above this script
  const rootDir = path.dirname(__dirname)
  const ig = loadGitignore(rootDir)
  if (!absFolderPath) {
    absFolderPath = rootDir
  }
  return getAllFiles(absFolderPath, ig)
}

export function pathToUrl(filePath: string, baseUrl: string): string {
  if (!baseUrl.endsWith("/")) {
    baseUrl = baseUrl + "/"
  }
  const relativeToPublic = relativePathFromPublic(filePath)
  return `${baseUrl}${relativeToPublic}`
}

export function pathToMarkdownUrl(filePath: string): string {
  return pathToUrl(filePath, "https://wishonia.love/md/")
}

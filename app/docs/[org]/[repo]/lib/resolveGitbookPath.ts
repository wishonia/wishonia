export function resolveGitbookPath(path: string, currentPath: string): string {
  // Remove any URL encoding from the path
  path = decodeURIComponent(path)
  
  // Handle .gitbook paths
  if (path.includes('.gitbook/assets/')) {
    // Extract just the filename from the path
    const filename = path.split('/').pop()
    return `.gitbook/assets/${filename}`
  }

  // Handle relative paths
  if (path.startsWith('../') || path.startsWith('./')) {
    const currentDir = currentPath.split('/').slice(0, -1).join('/')
    return new URL(path, `http://base/${currentDir}/`).pathname.slice(1)
  }

  return path
} 
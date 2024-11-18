import { useState, useMemo, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { 
  Search, File, Folder, ChevronRight, FileText, 
  FileCode, FileJson, Image, ExternalLink 
} from 'lucide-react'
import { FileItem, ExistingArticle } from './types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useDebounce } from '@/lib/hooks/useDebounce'
import { searchGithubRepository, fetchFileContent } from '@/app/github/githubActions'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import MarkdownRenderer from "@/components/MarkdownRenderer"

interface Props {
  files: FileItem[]
  repoName: string
  orgName: string
  accessToken: string
  currentPath: string[]
  existingArticles: ExistingArticle[]
  onNavigate: (path: string) => void
  onCreateArticle: (file: FileItem) => void
}

interface FileType {
  value: string
  label: string
}

function truncateFileName(name: string, maxLength: number = 40) {
  if (name.length <= maxLength) return name
  
  const extension = name.split('.').pop()
  const nameWithoutExt = name.slice(0, name.lastIndexOf('.'))
  
  if (!extension) return `${name.slice(0, maxLength)}...`
  
  const truncatedName = nameWithoutExt.slice(0, maxLength - extension.length - 4) // -4 for "..." and "."
  return `${truncatedName}...${extension}`
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase()
  switch(ext) {
    case 'md':
    case 'txt':
      return <FileText className="w-4 h-4" />
    case 'json':
      return <FileJson className="w-4 h-4" />
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'py':
    case 'rb':
    case 'php':
      return <FileCode className="w-4 h-4" />
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'svg':
      return <Image className="w-4 h-4" />
    default:
      return <File className="w-4 h-4" />
  }
}

const formatSize = (bytes?: number) => {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`
}

const getFileType = (file: FileItem) => {
  if (file.type === 'dir') return 'folder'
  const extension = file.name.split('.').pop()?.toLowerCase()
  if (extension === 'md') return 'md'
  return 'other'
}

const STORAGE_KEYS = {
  SEARCH: (repoName: string) => `github-explorer-search-${repoName}`,
  FILE_TYPE: (repoName: string) => `github-explorer-filetype-${repoName}`,
} as const

const fixMarkdownPaths = (
  content: string,
  orgName: string,
  repoName: string,
  filePath: string
): string => {
  // Get the directory path of the current file
  const currentDir = filePath.split('/').slice(0, -1).join('/')
  
  // Base URL for raw GitHub content
  const rawGitHubBase = `https://raw.githubusercontent.com/${orgName}/${repoName}/main`

  // Replace relative image paths
  return content.replace(
    /!\[([^\]]*)\]\((?!http|https)([^)]+)\)/g,
    (match, altText, path) => {
      // Handle different types of relative paths
      let absolutePath
      if (path.startsWith('./')) {
        // Handle ./path/to/image.png
        absolutePath = path.replace('./', `${currentDir}/`)
      } else if (path.startsWith('../')) {
        // Handle ../path/to/image.png
        const dirs = currentDir.split('/')
        const upDirs = path.match(/\.\.\//g)?.length || 0
        const remainingPath = path.replace(/\.\.\//g, '')
        const newBasePath = dirs.slice(0, -upDirs).join('/')
        absolutePath = `${newBasePath}/${remainingPath}`
      } else {
        // Handle relative path without ./ or ../
        absolutePath = `${currentDir}/${path}`
      }

      // Clean up any double slashes and create the full URL
      const cleanPath = absolutePath.replace(/\/+/g, '/')
      return `![${altText}](${rawGitHubBase}${cleanPath})`
    }
  )
}

export function FileBrowser({ 
  files, 
  repoName, 
  orgName,
  accessToken,
  currentPath, 
  existingArticles, 
  onNavigate, 
  onCreateArticle 
}: Props) {
  const [searchTerm, setSearchTerm] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.SEARCH(repoName)) || ''
    }
    return ''
  })
  
  const [selectedFileType, setSelectedFileType] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEYS.FILE_TYPE(repoName)) || 'all'
    }
    return 'all'
  })

  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const debouncedSearch = useDebounce(searchTerm, 500)

  const fileTypes: FileType[] = [
    { value: 'all', label: 'All Files' },
    { value: 'md', label: 'Markdown' },
    { value: 'folder', label: 'Folders' },
    { value: 'other', label: 'Other Files' },
  ]

  useEffect(() => {
    async function performSearch() {
      if (debouncedSearch.length >= 3) {
        setIsSearching(true)
        const results = await searchGithubRepository(
          accessToken,
          orgName,
          repoName,
          debouncedSearch
        )
        setSearchResults(results)
        setIsSearching(false)
      } else {
        setSearchResults([])
      }
    }

    performSearch()
  }, [debouncedSearch, accessToken, orgName, repoName])

  const sortedFiles = useMemo(() => {
    // If we're searching and have search results, use those
    const filesToFilter = searchTerm.length >= 3 ? searchResults : files

    const filtered = filesToFilter.filter(file => {
      const matchesType = selectedFileType === 'all' || getFileType(file) === selectedFileType
      return matchesType
    })
    
    return filtered.sort((a, b) => {
      if (a.type === 'dir' && b.type !== 'dir') return -1
      if (a.type !== 'dir' && b.type === 'dir') return 1
      return a.name.localeCompare(b.name)
    })
  }, [files, searchResults, searchTerm, selectedFileType])

  const getExistingArticle = (filePath: string) => {
    return existingArticles.find(article => 
      article.source.endsWith(filePath)
    )
  }

  const renderFileName = (file: FileItem) => {
    // When searching (3+ chars), show full path
    if (searchTerm.length >= 3) {
      return (
        <div className="flex flex-col">
          <span className="truncate">
            {truncateFileName(file.name)}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {file.path}
          </span>
        </div>
      )
    }
    
    // In regular browsing, just show the name
    return (
      <span className={`truncate ${file.type === 'dir' ? 'font-medium' : ''}`}>
        {truncateFileName(file.name)}
      </span>
    )
  }

  const handleFileClick = async (file: FileItem) => {
    if (file.type === 'dir') {
      onNavigate(searchTerm.length >= 3 ? file.path : file.name)
      return
    }

    try {
      setSelectedFile(file)
      setIsLoading(true)
      let content = await fetchFileContent(accessToken, orgName, repoName, file.path)
      
      // Fix markdown paths if it's a markdown file
      if (isMarkdown(file.name)) {
        content = fixMarkdownPaths(content, orgName, repoName, file.path)
      }
      
      setFileContent(content)
    } catch (error) {
      console.error('Error fetching file content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const closeFileViewer = () => {
    setSelectedFile(null)
    setFileContent(null)
  }

  const isMarkdown = (filename: string) => filename.toLowerCase().endsWith('.md')

  // Save search term to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SEARCH(repoName), searchTerm)
  }, [searchTerm, repoName])

  // Save file type filter to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FILE_TYPE(repoName), selectedFileType)
  }, [selectedFileType, repoName])

  // Clear stored values when unmounting
  useEffect(() => {
    return () => {
      localStorage.removeItem(STORAGE_KEYS.SEARCH(repoName))
      localStorage.removeItem(STORAGE_KEYS.FILE_TYPE(repoName))
    }
  }, [repoName])

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-1 text-sm">
          <Button
            variant="ghost"
            className="h-8 px-2"
            onClick={() => onNavigate('')}
          >
            {repoName}
          </Button>
          {currentPath.map((part, index) => (
            <div key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1" />
              <Button
                variant="ghost"
                className="h-8 px-2"
                onClick={() => onNavigate(currentPath.slice(0, index + 1).join('/'))}
              >
                {part}
              </Button>
            </div>
          ))}
        </div>

        {/* Search and Filter Controls */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files... (min 3 characters for global search)"
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedFileType} onValueChange={setSelectedFileType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select file type" />
            </SelectTrigger>
            <SelectContent>
              {fileTypes.map((type: FileType) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isSearching && (
          <div className="flex items-center justify-center py-4">
            <span className="text-sm text-muted-foreground">Searching repository...</span>
          </div>
        )}

        {/* Search Results or File List */}
        <div className="space-y-1">
          {sortedFiles.map((file) => {
            const existingArticle = getExistingArticle(file.path)
            
            return (
              <div
                key={file.path}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  file.type === 'dir' 
                    ? 'bg-muted/50 hover:bg-muted' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <div 
                  className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                  onClick={() => handleFileClick(file)}
                >
                  {file.type === 'dir' ? (
                    <Folder className="w-4 h-4 shrink-0 text-blue-500" />
                  ) : (
                    <span className="shrink-0">{getFileIcon(file.name)}</span>
                  )}
                  {renderFileName(file)}
                  {file.size !== undefined && (
                    <span className="text-sm text-muted-foreground shrink-0">
                      {formatSize(file.size)}
                    </span>
                  )}
                </div>
                {file.type === 'file' && (
                  <div className="flex items-center gap-2 shrink-0">
                    {existingArticle ? (
                      <Link 
                        href={`/articles/${existingArticle.slug}`}
                        className="flex items-center gap-1"
                      >
                        <Button variant="secondary" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View Article
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onCreateArticle(file)}
                      >
                        Create Article
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          
          {searchTerm.length >= 2 && sortedFiles.length === 0 && !isSearching && (
            <div className="text-center py-4 text-sm text-muted-foreground">
              No files found matching your search
            </div>
          )}
        </div>
      </div>

      {/* File Viewer Modal */}
      <Dialog open={selectedFile !== null} onOpenChange={() => closeFileViewer()}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedFile?.name}</DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-sm text-muted-foreground">Loading file content...</span>
            </div>
          ) : (
            <div className="mt-4">
              {fileContent && selectedFile && (
                isMarkdown(selectedFile.name) ? (
                  <MarkdownRenderer
                    name={selectedFile.name}
                    description={null}
                    featuredImage={null}
                    content={fileContent}
                  />
                ) : (
                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                    <code>{fileContent}</code>
                  </pre>
                )
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

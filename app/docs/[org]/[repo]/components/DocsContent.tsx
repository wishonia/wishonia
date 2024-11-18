'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { getGithubContent } from '../actions'
import { resolveGitbookPath } from '../lib/resolveGitbookPath'
import matter from 'gray-matter'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DocsContentProps {
  org: string
  repo: string
}

function DocHeader({ title, description }: { title: string, description?: string }) {
  return (
    <div className="mb-8 border-b border-border pb-8">
      <h1 className="text-4xl font-bold mb-4">{title}</h1>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

function EditOnGithubButton({ org, repo, path }: { org: string, repo: string, path: string }) {
  const githubUrl = `https://github.com/${org}/${repo}/edit/main/${path}`
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2 mb-8"
      onClick={() => window.open(githubUrl, '_blank')}
    >
      <Github className="h-4 w-4" />
      Edit on GitHub
    </Button>
  )
}

export default function DocsContent({ org, repo }: DocsContentProps) {
  const searchParams = useSearchParams()
  const filePath = searchParams.get('file')
  const [content, setContent] = useState('')
  const [frontmatter, setFrontmatter] = useState<{
    title?: string
    description?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContent() {
      if (!filePath) return

      setIsLoading(true)
      setError(null)
      
      try {
        const rawContent = await getGithubContent(org, repo, filePath)
        // Parse frontmatter
        const { data, content } = matter(rawContent)
        
        // Extract title from first heading if not in frontmatter
        const titleMatch = content.match(/^#\s+(.+)$/m)
        const title = data.title || (titleMatch ? titleMatch[1] : '')
        
        setFrontmatter({
          title,
          description: data.description,
        })
        
        // Remove the first heading since we'll display it in the header
        const contentWithoutTitle = content.replace(/^#\s+.+$/m, '')
        setContent(contentWithoutTitle)
      } catch (err) {
        console.error('Error fetching content:', err)
        setError(err instanceof Error ? err.message : 'Failed to load content')
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [filePath, org, repo])

  if (isLoading) {
    return (
      <div className="p-8 text-foreground">
        <div className="animate-pulse">Loading content...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8 text-destructive">
        <h2 className="text-lg font-semibold">Error loading content</h2>
        <p>{error}</p>
      </div>
    )
  }

  if (!filePath) {
    return (
      <div className="p-8 text-foreground">
        <h1 className="text-2xl font-bold">Welcome to the documentation</h1>
        <p className="mt-4">Select a file from the sidebar to get started.</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {filePath && (
        <EditOnGithubButton org={org} repo={repo} path={filePath} />
      )}
      {frontmatter.title && (
        <DocHeader 
          title={frontmatter.title} 
          description={frontmatter.description} 
        />
      )}
      <div className="prose prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark as any}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
            img({ src, alt, ...props }) {
              if (!src) return null
              const resolvedPath = resolveGitbookPath(src, filePath)
              const rawUrl = `https://raw.githubusercontent.com/${org}/${repo}/main/${resolvedPath}`
              return (
                <img
                  src={rawUrl}
                  alt={alt || ''}
                  className="rounded-lg shadow-md"
                  loading="lazy"
                  {...props}
                />
              )
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
} 
"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import matter from "gray-matter"
import { Github } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

import { Button } from "@/components/ui/button"

import { getGithubContent } from "../actions"
import { resolveGitbookPath } from "../lib/resolveGitbookPath"
import GlobalBrainNetwork from "@/components/landingPage/global-brain-network"

interface DocsContentProps {
  org: string
  repo: string
}

function DocHeader({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  return (
    <div className="mb-8 border-b border-border pb-8">
      <h1 className="mb-4 text-4xl font-bold">{title}</h1>
      {description && (
        <p className="text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

function EditOnGithubButton({
  org,
  repo,
  path,
}: {
  org: string
  repo: string
  path: string
}) {
  const githubUrl = `https://github.com/${org}/${repo}/edit/main/${path}`

  return (
    <Button
      variant="outline"
      size="sm"
      className="mb-8 flex items-center gap-2"
      onClick={() => window.open(githubUrl, "_blank")}
    >
      <Github className="h-4 w-4" />
      Edit on GitHub
    </Button>
  )
}

function resolveRelativePath(
  currentPath: string,
  relativePath: string
): string {
  // Remove .md extension from the relative path if it exists
  relativePath = relativePath.replace(/\.md$/, "")

  // If the path is already absolute (starts with /), just remove leading slash
  if (relativePath.startsWith("/")) {
    return relativePath.slice(1)
  }

  // Get the directory of the current file
  const currentDir = currentPath.split("/").slice(0, -1).join("/")

  // Handle ../ and ./ in the relative path
  const parts = relativePath.split("/")
  const resultParts = currentDir ? currentDir.split("/") : []

  for (const part of parts) {
    if (part === "..") {
      resultParts.pop()
    } else if (part !== ".") {
      resultParts.push(part)
    }
  }

  return resultParts.join("/")
}


function getImageUrl(
  src: string,
  org: string,
  repo: string,
  filePath: string
): string {
  // If it's already an absolute URL (GitHub or otherwise), use it as-is
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return src
  }

  // For relative paths, resolve against the current repo
  const resolvedPath = resolveGitbookPath(src, filePath)
  return `https://raw.githubusercontent.com/${org}/${repo}/main/${resolvedPath}`
}

export default function DocsContent({ org, repo }: DocsContentProps) {
  const searchParams = useSearchParams()
  const filePath = searchParams.get("file")
  const [content, setContent] = useState("")
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
        const cleanPath = filePath.endsWith(".md") ? filePath : `${filePath}.md`

        const rawContent = await getGithubContent(org, repo, cleanPath)
        // Parse frontmatter
        const { data, content } = matter(rawContent)

        // Extract title from first heading if not in frontmatter
        const titleMatch = content.match(/^#\s+(.+)$/m)
        const title = data.title || (titleMatch ? titleMatch[1] : "")

        setFrontmatter({
          title,
          description: data.description,
        })

        // Remove the first heading since we'll display it in the header
        const contentWithoutTitle = content.replace(/^#\s+.+$/m, "")
        setContent(contentWithoutTitle)
      } catch (err) {
        console.error("Error fetching content:", err)
        setError(err instanceof Error ? err.message : "Failed to load content")
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [filePath, org, repo])

  if (isLoading) {
    return (
      <div className="max-w-[500px] mx-auto p-8">
        <GlobalBrainNetwork />
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
    <div className="mx-auto max-w-3xl p-8">
      {filePath && <EditOnGithubButton org={org} repo={repo} path={filePath} />}
      {frontmatter.title && (
        <DocHeader
          title={frontmatter.title}
          description={frontmatter.description}
        />
      )}
      <div className="prose prose-p:text-inherit dark:prose-invert">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "")
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark as any}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
            img({ src, alt, ...props }) {
              if (!src) return null

              const imageUrl = getImageUrl(src, org, repo, filePath || "")

              return (
                <img
                  src={imageUrl}
                  alt={alt || ""}
                  className="rounded-lg shadow-md"
                  loading="lazy"
                  {...props}
                />
              )
            },
            a({ href, children, ...props }) {
              if (!href) return null

              // If it's an absolute URL, return it unchanged with target="_blank"
              if (href.startsWith("http://") || href.startsWith("https://")) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                    {...props}
                  >
                    {children}
                  </a>
                )
              }

              // Only process relative paths
              const absolutePath = resolveRelativePath(filePath || "", href)
              return (
                <a
                  href={`/docs/${org}/${repo}?file=${absolutePath}.md`}
                  className="text-primary hover:text-primary/80"
                  {...props}
                >
                  {children}
                </a>
              )
            },
            details: ({ node, children, ...props }) => {
              // Convert to boolean explicitly
              const isOpen = Boolean(node?.properties?.open)

              return (
                <details
                  className="my-4 rounded-lg border bg-muted/50 p-4"
                  open={isOpen}
                  {...props}
                >
                  {children}
                </details>
              )
            },
            summary: ({ node, children, ...props }) => (
              <summary
                className="cursor-pointer font-medium hover:text-primary"
                {...props}
              >
                {children}
              </summary>
            ),
          }}
          // Enable HTML parsing
          remarkRehypeOptions={{
            allowDangerousHtml: true,
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
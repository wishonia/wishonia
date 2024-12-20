"use client"

import { useEffect } from "react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"

interface MarkdownModalProps {
  isOpen: boolean
  onClose: () => void
  content: string
  title: string
}

export default function MarkdownModal({
  isOpen,
  onClose,
  content,
  title,
}: MarkdownModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-neutral-900/50" onClick={onClose} />
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-background">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="prose prose-neutral max-w-none p-6 dark:prose-invert">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
              components={{
                h1: ({ children }) => (
                  <h1 className="mb-4 mt-8 text-2xl font-bold">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mb-3 mt-6 text-xl font-bold">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mb-2 mt-4 text-lg font-semibold">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="leading-7 [&:not(:first-child)]:mt-4">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="my-4 ml-6 list-disc [&>li]:mt-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-4 ml-6 list-decimal [&>li]:mt-2">
                    {children}
                  </ol>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="mt-4 border-l-4 border-border pl-4 italic">
                    {children}
                  </blockquote>
                ),
                code: ({ node, inline, className, children, ...props }) => {
                  if (inline) {
                    return (
                      <code
                        className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  }
                  return (
                    <code
                      className={`${className} block overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm`}
                      {...props}
                    >
                      {children}
                    </code>
                  )
                },
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-primary underline underline-offset-4 hover:text-primary/80"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
                table: ({ children }) => (
                  <div className="my-6 w-full overflow-y-auto">
                    <table className="w-full border-collapse border border-border">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="border border-border bg-muted px-4 py-2 text-left font-semibold">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="border border-border px-4 py-2">{children}</td>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}
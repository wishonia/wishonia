"use client"

import { motion } from "framer-motion"
import React from "react"
import type { Components } from "react-markdown"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownProps {
  children: React.ReactNode
}

interface NeoBrutalMarkdownProps {
  children: string
}

export function NeoBrutalMarkdown({ children }: NeoBrutalMarkdownProps) {
  const components: Components = {
    h1: ({ children }: MarkdownProps) => (
      <motion.h1
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className="neobrutalist-h1"
      >
        {children}
      </motion.h1>
    ),
    h2: ({ children }: MarkdownProps) => (
      <motion.h2
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className="neobrutalist-h2"
      >
        {children}
      </motion.h2>
    ),
    h3: ({ children }: MarkdownProps) => (
      <h3 className="neobrutalist-h3">{children}</h3>
    ),
    h4: ({ children }: MarkdownProps) => (
      <h4 className="neobrutalist-h4">{children}</h4>
    ),
    h5: ({ children }: MarkdownProps) => (
      <h5 className="neobrutalist-h5">{children}</h5>
    ),
    ul: ({ children }: MarkdownProps) => (
      <ul className="neobrutalist-ul">{children}</ul>
    ),
    ol: ({ children }: MarkdownProps) => (
      <ol className="neobrutalist-ol">{children}</ol>
    ),
    li: ({ children }: MarkdownProps) => (
      <li className="neobrutalist-li">{children}</li>
    ),
    p: ({ children }: MarkdownProps) => (
      <p className="neobrutalist-p">{children}</p>
    ),
    strong: ({ children }: MarkdownProps) => (
      <strong className="neobrutalist-strong">{children}</strong>
    ),
    em: ({ children }: MarkdownProps) => (
      <em className="neobrutalist-em">{children}</em>
    ),
    hr: () => <hr className="neobrutalist-hr" />,
    blockquote: ({ children }: MarkdownProps) => (
      <blockquote className="neobrutalist-blockquote">{children}</blockquote>
    ),
    table: ({ children }: MarkdownProps) => (
      <div className="neobrutalist-table-container">
        <table className="neobrutalist-table">{children}</table>
      </div>
    ),
    thead: ({ children }: MarkdownProps) => (
      <thead className="neobrutalist-thead">{children}</thead>
    ),
    tbody: ({ children }: MarkdownProps) => (
      <tbody className="neobrutalist-tbody">{children}</tbody>
    ),
    tr: ({ children }: MarkdownProps) => (
      <tr className="neobrutalist-tr">{children}</tr>
    ),
    th: ({ children }: MarkdownProps) => (
      <th className="neobrutalist-th">{children}</th>
    ),
    td: ({ children }: MarkdownProps) => (
      <td className="neobrutalist-td">{children}</td>
    ),
    a: ({ children, href }: { children: React.ReactNode; href?: string }) => (
      <a
        href={href}
        className="neobrutalist-link"
        target={href?.startsWith("http") ? "_blank" : undefined}
        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    ),
  }

  return (
    <div className="neobrutalist-markdown-container">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </Markdown>
    </div>
  )
}
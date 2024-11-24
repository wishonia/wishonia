"use client"

import React from "react"
import { motion } from "framer-motion"
import type { Components } from "react-markdown"
import Markdown from "react-markdown"

interface Props {
  content: string
}

interface MarkdownProps {
  children: React.ReactNode
}

const NeoBrutalMarkdown = ({ children }: { children: string }) => {
  const components: Components = {
    // Headers
    h1: ({ children }: MarkdownProps) => (
      <motion.h1
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className="mb-8 mt-12 border-4 border-black bg-[#FF3366] p-6 text-4xl font-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        {children}
      </motion.h1>
    ),
    h2: ({ children }: MarkdownProps) => (
      <motion.h2
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        className="mb-6 mt-10 border-4 border-black bg-[#00CC66] p-4 text-3xl font-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      >
        {children}
      </motion.h2>
    ),
    h3: ({ children }: MarkdownProps) => (
      <h3 className="mb-4 mt-8 border-4 border-black bg-[#FF9900] p-3 text-2xl font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {children}
      </h3>
    ),

    // Lists
    ul: ({ children }: MarkdownProps) => (
      <ul className="mb-6 list-none space-y-2 border-4 border-black bg-[#ffffff] p-4 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {children}
      </ul>
    ),
    ol: ({ children }: MarkdownProps) => (
      <ol className="mb-6 list-decimal space-y-2 border-4 border-black bg-[#FF3366] p-4 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {children}
      </ol>
    ),
    li: ({ children }: MarkdownProps) => (
      <li className="rounded transition-colors hover:bg-black/20">
        {children}
      </li>
    ),

    // Paragraphs and emphasis
    p: ({ children }: MarkdownProps) => (
      <p className="mb-4 border-2 border-black bg-white p-4 leading-relaxed text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        {children}
      </p>
    ),
    strong: ({ children }: MarkdownProps) => (
      <strong className="font-black text-[#000000]">{children}</strong>
    ),
    em: ({ children }: MarkdownProps) => (
      <em className="no-italic font-semibold text-[#00CC66]">{children}</em>
    ),

    // Horizontal rule
    hr: () => <hr className="my-8 border-4 border-black" />,

    // Blockquotes
    blockquote: ({ children }: MarkdownProps) => (
      <blockquote className="mb-6 border-4 border-black bg-[#6633FF] p-4 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {children}
      </blockquote>
    ),
  }

  return <Markdown components={components}>{children}</Markdown>
}

export default function HealthSavingsSharing({ content }: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="prose prose-lg mx-auto max-w-4xl font-mono"
    >
      <NeoBrutalMarkdown>{content}</NeoBrutalMarkdown>
    </motion.article>
  )
}

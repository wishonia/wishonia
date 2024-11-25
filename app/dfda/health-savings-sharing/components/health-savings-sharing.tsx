"use client"

import React from "react"
import { motion } from "framer-motion"

import { NeoBrutalMarkdown } from "@/components/markdown/neo-brutal-markdown"

interface Props {
  content: string
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

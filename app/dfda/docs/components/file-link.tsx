"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

const MarkdownModal = dynamic(
  () => import("@/components/markdown/markdown-modal"),
  {
    ssr: false,
  }
)

interface MarkdownFile {
  path: string
  content: string
  title: string
}

export function FileLink({ file }: { file: MarkdownFile }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="rounded p-2 hover:bg-neutral-50">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full text-left text-primary hover:text-primary/80"
        >
          {file.title}
        </button>
      </div>
      <MarkdownModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={file.content}
        title={file.title}
      />
    </>
  )
}
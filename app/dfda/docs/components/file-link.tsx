'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const MarkdownModal = dynamic(() => import('@/components/markdown-modal'), {
  ssr: false
})

interface MarkdownFile {
  path: string
  content: string
  title: string
}

export function FileLink({ file }: { file: MarkdownFile }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="hover:bg-neutral-50 rounded p-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-primary hover:text-primary/80 text-left w-full"
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
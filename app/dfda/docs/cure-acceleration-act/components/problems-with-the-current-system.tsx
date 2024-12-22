"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createPortal } from "react-dom"
import { NeoBrutalMarkdown } from "@/components/markdown/neo-brutal-markdown"
import { getProblems } from "@/app/dfda/dfdaActions"
import type { ProcessedMarkdownFile } from "@/lib/markdown/get-markdown-files"

interface ProblemCardProps {
  name: string
  description?: string
  icon?: string
  onClick: () => void
}

const ProblemCard = ({ name, description, icon, onClick }: ProblemCardProps) => {

  return (
    <div
      className="rounded-lg border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none cursor-pointer"
      onClick={onClick}
    >
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-xl font-black">{name}</h3>
      <p className="mb-4 font-bold text-gray-700">{description}</p>
    </div>
  )
}

const FullScreenModal = ({ problem, onClose }: { problem: ProcessedMarkdownFile; onClose: () => void }) => {
  return createPortal(
    <div className="fixed inset-0 z-[100] flex flex-col bg-white">
      {/* Sticky header with close button */}
      <div className="sticky top-0 z-10 flex justify-end p-4">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-red-500 font-bold text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none hover:bg-red-600"
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 pb-8 md:px-8">
          <NeoBrutalMarkdown>{problem.content}</NeoBrutalMarkdown>
        </div>
      </div>
    </div>,
    document.body
  )
}

const ProblemsWithCurrentSystem = () => {
  const [problems, setProblems] = useState<ProcessedMarkdownFile[]>([])
  const [selectedProblem, setSelectedProblem] = useState<ProcessedMarkdownFile | null>(null)

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const problemsData = await getProblems()
        setProblems(problemsData)
      } catch (error) {
        console.error("Error loading problems:", error)
      }
    }

    loadProblems()
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-2"
    >
      <div className="mb-6 rounded-lg border-4 border-black bg-red-500 p-4 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-4 text-4xl font-black uppercase tracking-tight">
          Problems With The Current System 🏥
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((problem, index) => (
          <ProblemCard
            key={index}
            name={problem.name}
            description={problem.description}
            icon={problem.metadata?.icon}
            onClick={() => setSelectedProblem(problem)}
          />
        ))}
      </div>

      {selectedProblem && (
        <FullScreenModal
          problem={selectedProblem}
          onClose={() => setSelectedProblem(null)}
        />
      )}
    </motion.section>
  )
}

export default ProblemsWithCurrentSystem

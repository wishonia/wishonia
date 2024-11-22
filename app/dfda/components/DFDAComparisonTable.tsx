"use client"

import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronRight, X } from "lucide-react"
import ReactMarkdown from "react-markdown"

import { comparisonData } from "./dfda-comparison-data"

export default function DFDAComparisonTable() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null)

  const Modal = ({
    item,
    onClose,
  }: {
    item: (typeof comparisonData)[0]
    onClose: () => void
  }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-2 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative my-4 w-full max-w-2xl rounded-xl border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-black bg-white p-4">
          <h3 className="text-lg font-bold">{item.category}</h3>
          <button
            onClick={onClose}
            className="rounded-full border-2 border-black p-1 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          <div className="prose prose-sm max-w-none sm:prose-base lg:prose-lg">
            <ReactMarkdown>{item.details}</ReactMarkdown>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-xl border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:p-6">
        <motion.h1
          className="mb-4 text-center text-2xl font-black sm:text-3xl md:text-4xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ⚔️ FDA 🆚 dFDA
        </motion.h1>

        <motion.h2
          className="mb-6 text-center text-lg font-black sm:text-xl md:text-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Look at all these great features of decentralizing and automating
          clinical research! 🚀
        </motion.h2>

        {/* Mobile View */}
        <div className="block sm:hidden">
          {comparisonData.map((item, index) => (
            <motion.div
              key={index}
              className="mb-4 cursor-pointer rounded-lg border-2 border-black p-4 hover:bg-gray-50"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setSelectedItem(index)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{item.category}</h3>
                <ChevronRight className="h-5 w-5" />
              </div>
              <div className="mt-2 space-y-2 text-sm">
                <div className="text-gray-600">{item.regularFDA}</div>
                <div className="font-medium">{item.decentralizedFDA}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b-4 border-black bg-yellow-300">
                  <th className="p-4 text-left font-black">Category</th>
                  <th className="p-4 text-left font-black">Regular FDA</th>
                  <th className="p-4 text-left font-black">
                    Decentralized FDA
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => (
                  <motion.tr
                    key={index}
                    className="cursor-pointer border-b-2 border-black hover:bg-gray-50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedItem(index)}
                  >
                    <td className="p-4 font-bold">{item.category}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 font-medium">
                        {item.regularFDA}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 font-medium">
                        {item.decentralizedFDA}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 rounded-xl border-2 border-black bg-blue-100 p-4">
          <h3 className="mb-2 font-black">
            💡 Key Benefits of a Decentralized FDA
          </h3>
          <ul className="list-inside list-disc space-y-2 text-sm sm:text-base">
            <li>Faster drug approvals through data-driven decisions</li>
            <li>Transparent process with full accountability</li>
            <li>Lower costs for drug development</li>
            <li>Better representation of real-world patients</li>
          </ul>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem !== null && (
          <Modal
            item={comparisonData[selectedItem]}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

"use client"

import { motion } from "framer-motion"

export interface ListCardProps {
  title: string
  items: string[]
  bgColor: string
}

export default function ListCard({ title, items, bgColor }: ListCardProps) {
  return (
    <details
      className={`group rounded-lg border-2 border-black ${bgColor} p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
    >
      <summary className="cursor-pointer list-none">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">{title}</h3>
          <span className="transform text-xl transition-transform duration-200 group-open:rotate-180">
            ▼
          </span>
        </div>
      </summary>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border-2 border-black bg-white p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
          >
            <p className="font-bold">{item}</p>
          </div>
        ))}
      </motion.div>
    </details>
  )
}

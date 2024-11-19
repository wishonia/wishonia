'use client'

import { motion } from 'framer-motion'

export default function WhySolution() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 rounded-xl border-4 border-black bg-gradient-to-r from-green-400 to-teal-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      <h2 className="text-3xl font-bold mb-4">The Solution: Decentralized Clinical Research</h2>
      <p>
        A decentralized FDA could overcome the perverse incentives and cognitive biases that currently slow medical progress:
      </p>
      <ul className="list-disc ml-6 space-y-2">
        <li>No individual blame for approving treatments that could save many but harm few</li>
        <li>Transparent data collection and analysis</li>
        <li>Incentives aligned with discovering treatments for rare diseases</li>
        <li>Long-term outcome tracking</li>
        <li>Publication of all results, positive and negative</li>
      </ul>
    </motion.section>
  )
} 
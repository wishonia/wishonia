'use client'

import { motion } from 'framer-motion'

export default function MissionSection() {
  return (
    <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-blue-400 to-indigo-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h2 className="text-4xl font-black">The Decentralized FDA</h2>
        <p className="text-2xl font-bold">
          Our mandate is to promote human health and safety by determining the comprehensive positive and negative effects of all foods and drugs.
        </p>
        
        <div className="rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Key Problems We're Solving:</h3>
          <ul className="list-disc ml-6 space-y-2 text-xl">
            <li>No data on unpatentable molecules and natural compounds</li>
            <li>Lack of incentive to discover new applications for off-patent treatments</li>
            <li>Missing long-term outcome data</li>
            <li>Negative results aren't published</li>
            <li>Clinical trials exclude most of the population</li>
          </ul>
        </div>
      </motion.div>
    </section>
  )
} 
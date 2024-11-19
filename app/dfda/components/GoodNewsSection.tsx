'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function GoodNewsSection() {
  return (
    <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-yellow-400 to-amber-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <h2 className="text-4xl font-black uppercase">The Good News!</h2>
        <p className="text-2xl font-bold">There could be billions of cures we don't even know about yet!</p>
        
        <div className="rounded-lg p-6">
          <p className="text-xl mb-4">
            There are over 166 billion possible medicinal molecules, and we've only tested 0.00001% so far.
          </p>
          <Image
            src="https://fdai.earth/wp-content/uploads/2024/03/studied-molecules-chart-no-background.png"
            alt="Studied molecules chart"
            width={800}
            height={400}
            className="rounded-lg"
          />
        </div>

        <div className="rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Clinical Research Cost Trends</h3>
          <Image
            src="https://fdai.earth/wp-content/uploads/2024/03/Cost-to-Develop-A-New-Drug-no-arrows-e1710115343651-1024x742.png"
            alt="Cost trends"
            width={1024}
            height={742}
            className="rounded-lg"
          />
          <p className="text-xl mt-4">
            With automation, we could dramatically reduce these costs and accelerate discovery.
          </p>
        </div>
      </motion.div>
    </section>
  )
} 
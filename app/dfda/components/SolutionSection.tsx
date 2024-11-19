'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function SolutionSection() {
  return (
    <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-green-400 to-teal-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="mb-6 text-4xl font-black uppercase">The Solution: Automated Clinical Research</h2>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Automated Data Collection</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-xl font-semibold mb-2">Import from Wearables & Apps</h4>
              <Image
                src="https://fdai.earth/wp-content/uploads/2024/03/import.gif"
                alt="Data import demonstration"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-2">AI-Powered Data Collection</h4>
              <Image
                src="https://fdai.earth/wp-content/uploads/2024/03/autonomous-data-collection.gif"
                alt="AI data collection"
                width={400}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Automated Analysis</h3>
          <Image
            src="https://fdai.earth/wp-content/uploads/2024/03/root-cause-analysis-4x-small.gif"
            alt="Root cause analysis"
            width={800}
            height={400}
            className="rounded-lg"
          />
        </div>

        <div className="rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Real-Time Decision Support</h3>
          <Image
            src="https://fdai.earth/wp-content/uploads/2024/03/real-time-decision-support-notifications-personalized-app-image.png"
            alt="Decision support interface"
            width={800}
            height={400}
            className="rounded-lg"
          />
        </div>
      </motion.div>
    </section>
  )
} 
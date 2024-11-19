'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ProblemSection() {
  return (
    <section className="space-y-8">
      <div className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-red-400 to-orange-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-6 text-4xl font-black uppercase">The Growing Crisis</h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4">Chronic Disease Epidemic</h3>
            <p className="text-xl mb-4">2 Billion People are SUFFERING from chronic diseases like depression, fibromyalgia, Crohn's disease, and multiple sclerosis.</p>
            <Image
              src="https://fdai.earth/wp-content/uploads/2024/03/correlates-of-disease-incidence-no-title-1024x514.png"
              alt="Disease incidence trends"
              width={1024}
              height={514}
              className="rounded-lg"
            />
          </div>

          <div className="rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4">Chemical Exposure</h3>
            <p className="text-xl mb-4">We only have long-term toxicology data on 2 of over 7000 preservatives, flavorings, emulsifiers, sweeteners, pesticides, contaminants, and herbicides.</p>
            <Image
              src="https://fdai.earth/wp-content/uploads/2024/03/chemicals-in-our-diet.png"
              alt="Chemicals in diet"
              width={800}
              height={400}
              className="rounded-lg"
            />
          </div>

          <div className="rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-4">Research Bottleneck</h3>
            <ul className="list-disc ml-6 space-y-2 text-xl">
              <li>$2.6 billion and 12 years to bring a new drug to market</li>
              <li>Only 30 drugs approved per year</li>
              <li>80% of trials fail due to insufficient participants</li>
              <li>Less than 1% of chronic disease patients participate in research</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 
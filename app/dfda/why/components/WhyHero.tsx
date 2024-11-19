'use client'

import { motion } from 'framer-motion'

export default function WhyHero() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <section className="rounded-xl border-4 border-black bg-gradient-to-r from-yellow-400 to-amber-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl font-bold mb-4">Be Careful What You Wish For</h2>
        <p>
          Imagine you met a magical genie. Imagine you wished for it to fulfill the FDA Congressional Mandate to:
        </p>
        <blockquote className="border-l-4 border-black pl-4 my-4 italic">
          "Ensure the safety and efficacy of all drugs and medical devices"
        </blockquote>
        <p className="font-bold">Q: How could the genie PERFECTLY achieve this? 🤔</p>
        <p className="font-bold">A: Ensure that no one ever takes a new drug again.</p>
        <p>
          That would 100% guarantee that no one ever takes a medication that may or may not be effective.
        </p>
      </section>

      <section className="rounded-xl border-4 border-black bg-gradient-to-r from-red-400 to-orange-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl font-bold mb-4">The Real Goal Is Human Health and Safety</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>☠️ 60 million people die every year because we don't have adequate treatments for them.</li>
          <li>🤒 2.5 billion people suffer from chronic diseases for which we have no cures.</li>
        </ul>
        <p className="mt-4">
          Congress created the FDA to protect and promote human health and safety. Unfortunately, the 1962 efficacy amendment has become a significant obstacle to the work of scientists who are trying to discover new cures.
        </p>
      </section>
    </motion.div>
  )
} 
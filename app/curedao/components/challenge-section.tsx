'use client'

import { motion } from "framer-motion"
import { DollarSignIcon, ClockIcon, PillIcon, BanIcon } from 'lucide-react'

export function ChallengeSection() {
  const challenges = [
    {
      icon: <DollarSignIcon className="w-6 h-6 text-[#ff4895]" />,
      title: "Too Expensive!",
      description: "Clinical trials cost $56M on average, blocking research into thousands of promising treatments"
    },
    {
      icon: <BanIcon className="w-6 h-6 text-[#00ffcc]" />,
      title: "Too Restrictive!",
      description: "97% of patients are excluded from participating in trials for the most promising new treatments"
    },
    {
      icon: <PillIcon className="w-6 h-6 text-[#0088ff]" />,
      title: "Mo' Disease 👉 Mo' Money",
      description: "Companies make way more money from managing chronic diseases than curing them"
    },
    {
      icon: <ClockIcon className="w-6 h-6 text-[#ff8866]" />,
      title: "Too Slow!",
      description: "Bureaucracy delays life-saving treatments by 7-12 years while patients suffer and die"
    }
  ]

  return (
    <section className="container mx-auto px-6 py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          The current system sucks
        </h2>
        <p className="text-neutral-400">
          Over 2 billion people are unnecessarily suffering and dying because we continue to accept a system 
          that is slow, expensive, restrictive, and imprecise.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {challenges.map((challenge, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.2 // Stagger the animations
            }}
            className="bg-[#1d1a27] rounded-3xl p-8 border border-white/10"
          >
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
              {challenge.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{challenge.title}</h3>
            <p className="text-neutral-400">
              {challenge.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
} 
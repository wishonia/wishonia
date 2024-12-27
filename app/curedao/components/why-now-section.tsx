'use client'

import { motion } from 'framer-motion'
import { Brain, Users, Zap } from 'lucide-react'

export function WhyNowSection() {
  const reasons = [
    {
      icon: <Brain className="w-6 h-6 text-[#ff4895]" />,
      title: "Collective Intelligence",
      description: "Harness the insights of a global community to accelerate medical breakthroughs and democratize healthcare innovation."
    },
    {
      icon: <Users className="w-6 h-6 text-[#00ffcc]" />,
      title: "Open Collaboration",
      description: "Build a transparent and forkable framework that enables rapid iteration and improvement of healthcare solutions."
    },
    {
      icon: <Zap className="w-6 h-6 text-[#0088ff]" />,
      title: "Actionable Results",
      description: "Move beyond discussion to create measurable impact through decentralized trials and data-driven decisions."
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
          Why Now?
        </h2>
        <p className="text-neutral-400 text-lg leading-relaxed">
          The cost of chronic disease continues to climb, yet breakthroughs are bottlenecked by outdated systems. 
          By decentralizing clinical research, amplifying patient agency, and fixing incentives, we can accelerate 
          cures and prevent diseases at a fraction of the cost.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {reasons.map((reason, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.5,
              delay: index * 0.2
            }}
            className="bg-[#1d1a27] rounded-3xl p-8 border border-white/10"
          >
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
              {reason.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{reason.title}</h3>
            <p className="text-neutral-400">{reason.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-16 text-center"
      >
        <p className="text-neutral-400 text-lg max-w-3xl mx-auto">
          We are currently drafting the Cure Acceleration Act on GitHub. Over the next few months, 
          we aim to refine this Blueprint collaboratively. Afterward, we'll initiate a global voting 
          period to gather support.
        </p>
      </motion.div>
    </section>
  )
} 
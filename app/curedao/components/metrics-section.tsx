'use client'

import { motion } from 'framer-motion'
import { TrendingDown, Users, Coins, Clock } from 'lucide-react'

export function MetricsSection() {
  const metrics = [
    {
      icon: <TrendingDown className="w-6 h-6 text-[#ff4895]" />,
      title: "Reduction in Clinical Trial Costs",
      value: "95%",
      description: "Decrease in trial costs through decentralization"
    },
    {
      icon: <Users className="w-6 h-6 text-[#00ffcc]" />,
      title: "Global Support Target",
      value: "80M+",
      description: "Votes targeted for the Cure Acceleration Act"
    },
    {
      icon: <Coins className="w-6 h-6 text-[#0088ff]" />,
      title: "Health Savings Generated",
      value: "$2T+",
      description: "Annual healthcare cost reduction potential"
    },
    {
      icon: <Clock className="w-6 h-6 text-[#ff8866]" />,
      title: "Participation in Trials",
      value: "1M+",
      description: "Patients empowered through trial access"
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
          Metrics That Matter
        </h2>
        <p className="text-neutral-400">
          We're building a trackable, transparent, and measurable system to gauge impact
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
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
              {metric.icon}
            </div>
            <div className="text-4xl font-bold text-white mb-2">{metric.value}</div>
            <h3 className="text-lg font-semibold text-white mb-2">{metric.title}</h3>
            <p className="text-neutral-400">{metric.description}</p>
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
          Subscribe to updates, join discussions, and find opportunities to contribute to this transformative mission. 
          Together, we can design a future free of unnecessary suffering.
        </p>
      </motion.div>
    </section>
  )
} 
'use client'

import { motion } from 'framer-motion'
import { Building2Icon, UsersIcon, CoinsIcon } from 'lucide-react'

export function PillarsSection() {
  const pillars = [
    {
      icon: <Building2Icon className="w-6 h-6 text-[#ff4895]" />,
      title: "Decentralized FDA",
      features: [
        "Automate and decentralize trials",
        "Standardize data from diverse sources to enable faster approvals",
        "Reduce costs by 95% to $2 million per trial, enabling more innovations to reach patients",
        "Enable real-time safety monitoring",
        "Leverage AI for automated patient matching"
      ]
    },
    {
      icon: <UsersIcon className="w-6 h-6 text-[#00ffcc]" />,
      title: "Right to Trial",
      features: [
        "Enshrine patient rights to participate in experimental treatment trials",
        "Democratize access to cutting-edge therapies",
        "Collect patient-reported outcomes to drive real-world evidence",
        "Enable remote participation through telemedicine",
        "Provide transparent success rate data"
      ]
    },
    {
      icon: <CoinsIcon className="w-6 h-6 text-[#0088ff]" />,
      title: "50/50 Health Savings Sharing",
      features: [
        "Reward manufacturers for creating cost-saving cures",
        "Share 50% of global health savings with innovators",
        "Create incentives that prioritize health over disease management",
        "Enable transparent calculation of health outcomes",
        "Automate distribution of savings-based payments"
      ]
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
          The Three Pillars of Transformation
        </h2>
        <p className="text-neutral-400">
          Our comprehensive approach to revolutionizing healthcare through decentralization, patient empowerment, and aligned incentives.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {pillars.map((pillar, index) => (
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
              {pillar.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{pillar.title}</h3>
            <ul className="space-y-3">
              {pillar.features.map((feature, featureIndex) => (
                <motion.li 
                  key={featureIndex} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.3,
                    delay: index * 0.2 + featureIndex * 0.1
                  }}
                  className="text-neutral-400 flex items-start"
                >
                  <span className="text-[#00ffcc] mr-2">•</span>
                  <span>{feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  )
} 
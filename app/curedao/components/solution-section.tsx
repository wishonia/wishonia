'use client'

import { motion } from "framer-motion"
import { BuildingIcon, UsersIcon, CoinsIcon } from 'lucide-react'

export function SolutionSection() {
  const pillars = [
    {
      icon: <BuildingIcon className="w-6 h-6 text-[#ff4895]" />,
      title: "A Decentralized Autonomous Algorithmic FDA",
      features: [
        "Reduces trial costs by 95% (from $56M to $2M) through decentralized, automated clinical trials",
        "Enables real-time safety monitoring",
        "Automates patient matching and enrollment",
        "Provides transparent, real-world evidence",
        "Accelerates treatment optimization through AI analysis"
      ]
    },
    {
      icon: <UsersIcon className="w-6 h-6 text-[#00ffcc]" />,
      title: "Universal Trial Access",
      features: [
        "Participate in trials for promising experimental treatments",
        "Access real-world treatment success rates",
        "Contribute their outcomes to help others",
        "Receive personalized treatment recommendations",
        "Join trials remotely through telemedicine"
      ]
    },
    {
      icon: <CoinsIcon className="w-6 h-6 text-[#0088ff]" />,
      title: "Health Savings Sharing Program",
      features: [
        "50/50 split of healthcare savings between treatment developers and society",
        "Rewards for prevention and cures instead of chronic disease management",
        "Transparent calculation of health outcome improvements",
        "Automated distribution of savings-based payments",
        "Incentives for developing affordable treatments"
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
          Disease Eradication in 3 Easy Steps!
        </h2>
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
              delay: index * 0.2 // Stagger the animations
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
                    delay: index * 0.2 + featureIndex * 0.1 // Stagger based on both pillar and feature index
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
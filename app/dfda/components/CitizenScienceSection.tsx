'use client'

import { motion } from 'framer-motion'
import { Microscope, Globe, Search } from 'lucide-react'
import { FeatureBox } from './FeatureBox'

export default function CitizenScienceSection() {
  const features = [
    {
      title: "Create Your Own Studies",
      desc: "Anyone can create a study, become a prestigious scientist, get a link, and invite all their friends to join!",
      color: "bg-purple-400",
      icon: Microscope,
      media: "https://fdai.earth/wp-content/uploads/2024/03/create-study.gif",
      onClick: () => window.location.href = "https://safe.fdai.earth/app/public/#/app/study-creation"
    },
    {
      title: "Global Scale Studies",
      desc: "Studies are published in a Wikipedia for clinical research based on everyone's data, listing the likely effects of every food and drug.",
      color: "bg-indigo-400",
      icon: Globe,
      media: "https://fdai.earth/wp-content/uploads/2024/03/clinipedia-landing.gif",
      onClick: () => window.location.href = "https://studies.fdai.earth/"
    },
    {
      title: "Mega-Studies",
      desc: "Look up your condition and see how different foods, drugs and supplements tend to improve or worsen your condition.",
      color: "bg-violet-400",
      icon: Search,
      media: "https://fdai.earth/wp-content/uploads/2024/03/clinipedia-inflammatory-pain-small.gif",
      onClick: () => window.location.href = "https://studies.fdai.earth/variables/Overall_Mood"
    }
  ]

  return (
    <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-purple-400 to-indigo-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="mb-6 text-4xl font-black uppercase">Citizen Science</h2>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {features.map((feature, index) => (
          <FeatureBox
            key={feature.title}
            title={feature.title}
            desc={feature.desc}
            color={feature.color}
            icon={feature.icon}
            media={feature.media}
            index={index}
            onClick={feature.onClick}
          />
        ))}
      </motion.div>
    </section>
  )
} 
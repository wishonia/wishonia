'use client'

import { motion } from 'framer-motion'
import { Database, Brain, Bell } from 'lucide-react'
import { FeatureBox } from './FeatureBox'

export default function SolutionSection() {
  const features = [
    {
      title: "Automated Data Collection",
      desc: "Import data from wearables and apps while leveraging AI-powered collection methods for comprehensive health insights.",
      color: "bg-green-400",
      icon: Database,
      media: "https://fdai.earth/wp-content/uploads/2024/03/import.gif",
      onClick: () => console.log("Data Collection clicked")
    },
    {
      title: "Automated Analysis",
      desc: "Advanced AI algorithms analyze your health data to identify patterns and potential root causes.",
      color: "bg-teal-400",
      icon: Brain,
      media: "https://fdai.earth/wp-content/uploads/2024/03/root-cause-analysis-4x-small.gif",
      onClick: () => console.log("Analysis clicked")
    },
    {
      title: "Real-Time Decision Support",
      desc: "Get personalized insights and recommendations based on your real-time health data analysis.",
      color: "bg-emerald-400",
      icon: Bell,
      media: "https://fdai.earth/wp-content/uploads/2024/03/real-time-decision-support-notifications-personalized-app-image.png",
      onClick: () => console.log("Decision Support clicked")
    }
  ]

  return (
    <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-green-400 to-teal-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="mb-6 text-4xl font-black uppercase">The Solution: Automated Clinical Research</h2>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
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
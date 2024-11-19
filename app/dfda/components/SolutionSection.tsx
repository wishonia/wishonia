'use client'

import { motion } from 'framer-motion'
import { Database, Brain, Bell } from 'lucide-react'
import { FeatureBox } from './FeatureBox'
import { getSafeUrlWithToken } from '../dfdaActions'
import { useState } from 'react'

export default function SolutionSection() {
  const [isLoading, setIsLoading] = useState(false)

  const handleDigitalTwinSafeClick = async (path: string) => {
    setIsLoading(true)
    const url = await getSafeUrlWithToken('')
    window.open(url, '_blank')
  }
  const features = [
    {
      title: "Automated Data Collection",
      desc: "Import data from wearables and apps while leveraging AI-powered collection methods for comprehensive health insights.",
      color: "bg-green-400",
      icon: Database,
      media: "https://fdai.earth/wp-content/uploads/2024/03/import.gif",
      onClick: () => {
        // go to https://safe.dfda.earth/import in new tab
        handleDigitalTwinSafeClick('/import')
      }
    },
    {
      title: "Automated Analysis",
      desc: "Advanced AI algorithms analyze your health data to identify patterns and potential root causes.",
      color: "bg-teal-400",
      icon: Brain,
      media: "https://fdai.earth/wp-content/uploads/2024/03/root-cause-analysis-4x-small.gif",
      onClick: () => {
        // go to https://safe.dfda.earth/app/public/#/app/studies in new tab
        handleDigitalTwinSafeClick('/studies')
      }
    },
    {
      title: "Real-Time Decision Support",
      desc: "Get personalized insights and recommendations based on your real-time health data analysis.",
      color: "bg-emerald-400",
      icon: Bell,
      media: "https://fdai.earth/wp-content/uploads/2024/03/real-time-decision-support-notifications-personalized-app-image.png",
      onClick: () => {
        // go to https://safe.dfda.earth/app/public/#/app/studies
        window.open('https://safe.dfda.earth/app/public/#/app/studies', '_blank')
      }
    }
  ]

  return (
    <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-green-400 to-teal-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="mb-6 text-4xl font-black uppercase">The Solution: Automated Clinical Research</h2>
      
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
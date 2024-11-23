"use client"

import { useState } from "react"
import { redirect } from "next/navigation"
import { motion } from "framer-motion"
import { Bell, Brain, Database } from "lucide-react"

import { LoadingSpinner } from "@/components/ui/loading-spinner"

import { FeatureBox } from "./FeatureBox"

export default function SolutionSection() {
  const [isLoading, setIsLoading] = useState(false)

  const features = [
    {
      title: "Automated Data Collection",
      desc: "Import data from wearables and apps while leveraging AI-powered collection methods for comprehensive health insights.",
      color: "bg-green-400",
      icon: Database,
      media: "https://fdai.earth/wp-content/uploads/2024/03/import.gif",
      onClick: () => {
        setIsLoading(true)
        redirect(`/dfda/safe/redirect`)
      },
    },
    {
      title: "Automated Analysis",
      desc: "Advanced AI algorithms analyze your health data to identify patterns and potential root causes.",
      color: "bg-teal-400",
      icon: Brain,
      media:
        "https://fdai.earth/wp-content/uploads/2024/03/root-cause-analysis-4x-small.gif",
      onClick: () => {
        setIsLoading(true)
        redirect(`/dfda/safe/redirect`)
      },
    },
    {
      title: "Real-Time Decision Support",
      desc: "Get personalized insights and recommendations based on your real-time health data analysis.",
      color: "bg-emerald-400",
      icon: Bell,
      media:
        "https://fdai.earth/wp-content/uploads/2024/03/real-time-decision-support-notifications-personalized-app-image.png",
      onClick: () => {
        setIsLoading(true)
        redirect(`/dfda/safe/redirect`)
      },
    },
  ]

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-green-400 to-teal-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <h2 className="mb-6 text-4xl font-black uppercase">
        The Solution: Automated Clinical Research
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-8 md:grid-cols-3"
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
"use client"

import { motion } from "framer-motion"

export default function Benefits() {
  const categories = [
    {
      title: "💲 Cheaper",
      items: [
        {
          icon: "💸",
          text: "Eliminates billions in redundant trial infrastructure costs",
        },
        {
          icon: "🚫",
          text: "Removes expensive middlemen and administrative overhead",
        },
        {
          icon: "🌐",
          text: "Enables global price competition through open access",
        },
        {
          icon: "💰",
          text: "Shares cost savings from prevention back to developers",
        },
        {
          icon: "🏥",
          text: "Reduces healthcare spending through earlier intervention",
        },
        {
          icon: "🛠️",
          text: "Cuts development costs by over 90% through shared platform",
        },
        {
          icon: "🔄",
          text: "Eliminates duplicate safety testing across regions",
        },
      ],
    },
    {
      title: "⚡ Faster",
      items: [
        { icon: "⏳", text: "Removes years of administrative delays" },
        {
          icon: "🚀",
          text: "Enables immediate trial participation for interested patients",
        },
        { icon: "🤖", text: "Automates patient matching and enrollment" },
        {
          icon: "🕒",
          text: "Provides real-time safety and efficacy monitoring",
        },
        {
          icon: "🧠",
          text: "Accelerates treatment optimization through AI analysis",
        },
        {
          icon: "🌐",
          text: "Eliminates redundant approval processes across countries",
        },
        {
          icon: "🔄",
          text: "Enables rapid iteration based on real-world evidence",
        },
      ],
    },
    {
      title: "🌟 Better",
      items: [
        {
          icon: "👥",
          text: "Includes all willing patients instead of just 3%",
        },
        {
          icon: "📊",
          text: "Generates real-world evidence across diverse populations",
        },
        {
          icon: "🎯",
          text: "Identifies optimal treatments for specific patient profiles",
        },
        {
          icon: "🚨",
          text: "Catches safety issues earlier through comprehensive monitoring",
        },
        {
          icon: "🔄",
          text: "Enables continuous improvement through global collaboration",
        },
        {
          icon: "🤝",
          text: "Aligns profit incentives with actual health outcomes",
        },
        { icon: "🌍", text: "Democratizes access to promising treatments" },
      ],
    },
  ]

  return (
    <motion.div
      className="border-4 border-black bg-purple-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
      whileHover={{ scale: 1.02 }}
    >
      <h2 className="mb-4 text-3xl font-black">
        🌟 Benefits Over Current System
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {categories.map((category, i) => (
          <div key={i} className="border-2 border-black bg-white p-4">
            <h3 className="mb-3 text-xl font-bold">{category.title}</h3>
            <div className="space-y-2">
              {category.items.map((item, j) => (
                <div
                  key={j}
                  className="p-2 transition-colors hover:bg-purple-100"
                >
                  <span className="mr-2 text-2xl">{item.icon}</span>
                  <span className="font-bold">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

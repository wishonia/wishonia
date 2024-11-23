"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"

interface ProblemCardProps {
  title: string
  description: string
  icon: string
  stats?: string[]
}

const ProblemCard = ({ title, description, icon, stats }: ProblemCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className="rounded-lg border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
      onClick={() => stats && setIsExpanded(!isExpanded)}
    >
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-xl font-black">{title}</h3>
      <p className="mb-4 font-bold text-gray-700">{description}</p>
      {stats && (
        <>
          <button className="mb-2 text-sm font-bold text-gray-600">
            {isExpanded ? "Hide Details ▼" : "More Details ▶"}
          </button>
          <motion.div
            initial={false}
            animate={{ height: isExpanded ? "auto" : 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="rounded-md border-2 border-black bg-red-100 p-2 text-sm font-bold"
                >
                  {stat}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}

const ProblemsWithCurrentSystem = () => {
  const problems = [
    {
      title: "Deadly Delays",
      description: "Life-saving treatments blocked by bureaucratic barriers",
      icon: "⏳ ⚰️",
      stats: [
        "7-12 year average FDA approval delay ⌛",
        "4+ year wait for breakthrough therapies 🕒",
        "3-5 year lag behind Europe/Asia approvals 🌍",
      ],
    },
    {
      title: "Excluded Patients",
      description: "Most people denied access to promising treatments",
      icon: "🚫 🏥",
      stats: [
        "97% of patients excluded from trials ❌",
        "Only 3% qualify for participation 📊",
        "Hundreds of miles travel required 🚗",
      ],
    },
    {
      title: "Astronomical Costs",
      description: "Excessive expenses block treatment development",
      icon: "💸 💰",
      stats: [
        "$2.6B average cost per drug 💵",
        "10-100x price markup for consumers 📈",
        "$41k cost per Phase III trial participant 💳",
      ],
    },
    {
      title: "Profit Over Prevention",
      description: "Financial incentives misaligned with public health",
      icon: "💊 🏦",
      stats: [
        "80% of R&D on $100k+/year drugs 💉",
        "Only 5% spent on prevention 🛡️",
        "3x ROI on prevention ignored 📉",
      ],
    },
    {
      title: "Missing Data",
      description: "Critical health information never collected",
      icon: "🙈 📊",
      stats: [
        "<10% of drugs have real-world data 📱",
        "Negative results never published 🤫",
        "No long-term outcome tracking 📈",
      ],
    },
    {
      title: "Human Cost",
      description: "Massive suffering from systemic failures",
      icon: "💔 😢",
      stats: [
        "60M preventable deaths yearly ⚰️",
        "2.5B suffering from chronic disease 🤒",
        "95% of rare diseases untreated 🏥",
      ],
    },
  ]

  // Additional quick-view problems with enhanced emojis
  const quickProblems = [
    {
      icon: "⏱️ 💀",
      text: "Terminal patients wait 4+ years for breakthrough therapy approvals",
    },
    {
      icon: "🌍 ⏰",
      text: "US approvals lag 3-5 years behind Europe and Asia",
    },
    {
      icon: "🩺 💝",
      text: "Only 5% of healthcare spending goes to preventive care",
    },
    {
      icon: "📊 🔍",
      text: "The system ignores real-world evidence about effective treatments",
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-2"
    >
      <div className="mb-6 rounded-lg border-4 border-black bg-red-200 p-4 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="mb-4 text-4xl font-black uppercase tracking-tight">
          Problems With The Current System 🏥
        </h2>
        <p className="text-xl font-bold">
          Our healthcare system is failing billions of people. Here's why:
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {problems.map((problem, index) => (
          <ProblemCard key={index} {...problem} />
        ))}
      </div>

      <motion.div
        className="rounded-lg border-4 border-black bg-yellow-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        whileHover={{ scale: 1.02 }}
      >
        <h3 className="mb-4 text-2xl font-black">Additional Key Issues</h3>
        <div className="space-y-4">
          {quickProblems.map((problem, i) => (
            <div
              key={i}
              className="border-2 border-black bg-white p-3 transition-colors hover:bg-yellow-100"
            >
              <span className="mr-2 text-2xl">{problem.icon}</span>
              <span className="font-bold">{problem.text}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="rounded-lg border-4 border-black bg-black p-8 text-center text-white shadow-[8px_8px_0px_0px_rgba(255,0,0,1)]">
        <h3 className="mb-4 text-2xl font-black uppercase">
          ☠️ The Real Cost ☠️
        </h3>
        <p className="text-xl font-bold">
          Every year we wait costs{" "}
          <span className="text-red-500">60 million lives</span>. We can't
          afford to maintain this broken system.
        </p>
      </div>
    </motion.section>
  )
}

export default ProblemsWithCurrentSystem

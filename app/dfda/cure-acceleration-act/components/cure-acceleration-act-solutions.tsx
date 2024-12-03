"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface SolutionCardProps {
  title: string
  description: string
  icon: string
  details: string[]
}

const SolutionCard = ({
  title,
  description,
  icon,
  details,
}: SolutionCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className="cursor-pointer rounded-lg border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-2 text-xl font-black">{title}</h3>
      <p className="mb-4 font-bold text-gray-700">{description}</p>
      <button className="mb-2 text-sm font-bold text-gray-600">
        {isExpanded ? "Hide Details ▼" : "Show Details ▶"}
      </button>
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : 0 }}
        className="overflow-hidden"
      >
        <div className="space-y-2">
          {details.map((detail, index) => (
            <div
              key={index}
              className="rounded-md border-2 border-black bg-green-100 p-2 text-sm font-bold"
            >
              {detail}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default function CureAccelerationActSolutions() {
  const solutions = [
    {
      title: "Decentralized FDA",
      description:
        "A Global Decentralized Clinical Trial Platform Automated by an Open-Source Decentralized Autonomous FDA",
      icon: "🤖",
      details: [
        "🧠 Free superintelligent AI doctor analyzing food and drug intake",
        "🎯 Facilitates personalized preventative medicine",
        "📊 Continuous monitoring and analysis of treatment outcomes",
        "🌍 Global collaboration and data sharing",
        "🛡️ Automated safety monitoring and signal detection",
        "💰 Cut clinical trial costs by over 90% with free open infrastructure",
        "⚡ Reduce time-to-market by years through universal trial participation",
        "🌐 Enable real price competition through global access and transparent outcomes",
      ],
    },
    {
      title: "Right to Trial",
      description:
        "Universal access to clinical trials and treatments for all patients",
      icon: "⚖️",
      details: [
        "✅ Guarantees right to try any treatment that passes basic safety testing",
        "🚪 Removes barriers blocking access to effective treatments",
        "👤 Patient autonomy in treatment decisions",
      ],
    },
    {
      title: "50/50 Health Savings Sharing Program",
      description: "Incentivizing cures through shared healthcare cost savings",
      icon: "💰",
      details: [
        "💵 50% of healthcare savings shared with manufacturers",
        "🎯 Incentivizes development of cures and prevention",
        "🎁 Encourages $0 cost treatments to maximize adoption",
        "📊 Data-driven savings calculations",
        "🤝 Win-win for society and manufacturers",
        "💎 Save over $2 trillion annually by incentivizing disease prevention",
        "🏆 Create multi-billion dollar rewards for companies developing actual cures",
      ],
    },
  ]

  return (
    <div className="space-y-8 py-8">
      <h2 className="mb-6 text-3xl font-black">💡 Solutions</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {solutions.map((solution, index) => (
          <SolutionCard
            key={index}
            title={solution.title}
            description={solution.description}
            icon={solution.icon}
            details={solution.details}
          />
        ))}
      </div>
    </div>
  )
}

'use client'

import { GitBranchIcon, VoteIcon, RocketIcon } from 'lucide-react'

export function TimelineSection() {
  const phases = [
    {
      icon: <GitBranchIcon className="w-6 h-6 text-[#ff4895]" />,
      title: "Current Phase (Q1-Q2 2024)",
      items: [
        "Blueprint development on GitHub",
        "Working group formation",
        "Technical specification",
        "Implementation planning",
        "Community building"
      ]
    },
    {
      icon: <VoteIcon className="w-6 h-6 text-[#00ffcc]" />,
      title: "Voting Phase (Q3-Q4 2024)",
      items: [
        "Global outreach campaign",
        "Democratic amendment process",
        "Consensus building",
        "Implementation preparation",
        "Partner alignment"
      ]
    },
    {
      icon: <RocketIcon className="w-6 h-6 text-[#0088ff]" />,
      title: "Implementation Phase (2025+)",
      items: [
        "Platform development",
        "Regulatory integration",
        "Trial migration",
        "Healthcare system transformation",
        "Global scaling"
      ]
    }
  ]

  return (
    <section className="container mx-auto px-6 py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Timeline
        </h2>
        <p className="text-neutral-400">
          Our roadmap to transforming global healthcare
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {phases.map((phase, index) => (
          <div key={index} className="bg-[#1d1a27] rounded-3xl p-8 border border-white/10">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
              {phase.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{phase.title}</h3>
            <ul className="space-y-3">
              {phase.items.map((item, itemIndex) => (
                <li key={itemIndex} className="text-neutral-400 flex items-start">
                  <span className="text-[#00ffcc] mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
} 
'use client'

import { HeartIcon, BeakerIcon, GlobeIcon } from 'lucide-react'

export function ImpactSection() {
  const impacts = [
    {
      icon: <HeartIcon className="w-6 h-6 text-[#ff4895]" />,
      title: "For Patients",
      benefits: [
        { text: "Immediate access to promising treatments", emoji: "⚡" },
        { text: "90% lower treatment costs through global access", emoji: "💰" },
        { text: "AI-powered personalized treatment matching", emoji: "🎯" },
        { text: "Remote participation from anywhere", emoji: "🌍" },
        { text: "Prevention-first approach to health", emoji: "🛡️" }
      ]
    },
    {
      icon: <BeakerIcon className="w-6 h-6 text-[#00ffcc]" />,
      title: "For Researchers",
      benefits: [
        { text: "90% reduction in trial costs", emoji: "📉" },
        { text: "Access to 100% of willing patients", emoji: "🤝" },
        { text: "Real-time effectiveness data", emoji: "📊" },
        { text: "Global research collaboration", emoji: "🔬" },
        { text: "Automated patient matching & monitoring", emoji: "🤖" }
      ]
    },
    {
      icon: <GlobeIcon className="w-6 h-6 text-[#0088ff]" />,
      title: "For Society",
      benefits: [
        { text: "$2+ trillion annual healthcare savings", emoji: "💎" },
        { text: "50% lower insurance premiums", emoji: "✨" },
        { text: "Accelerated cure development", emoji: "🚀" },
        { text: "Universal access to treatments", emoji: "🌟" },
        { text: "Sustainable healthcare system", emoji: "♾️" }
      ]
    }
  ]

  return (
    <section className="container mx-auto px-6 py-24">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          The Impact
        </h2>
        <p className="text-neutral-400">
          Our solution creates value for everyone involved in the healthcare ecosystem
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {impacts.map((impact, index) => (
          <div key={index} className="bg-[#1d1a27] rounded-3xl p-8 border border-white/10">
            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6">
              {impact.icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">{impact.title}</h3>
            <ul className="space-y-4">
              {impact.benefits.map((benefit, benefitIndex) => (
                <li 
                  key={benefitIndex} 
                  className="text-neutral-300 flex items-start group"
                >
                  <span className="mr-3 group-hover:scale-110 
                                 transition-transform duration-300">{benefit.emoji}</span>
                  <span className="group-hover:text-white transition-colors 
                                 duration-300">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
} 
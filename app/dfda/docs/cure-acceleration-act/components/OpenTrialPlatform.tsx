"use client"

import { motion } from "framer-motion"

import DFDACostSavingsTable from "../../../components/DFDACostSavingsTable"
import ListCard from "./ListCard"

export default function OpenTrialPlatform() {
  const sections = [
    {
      title: "🛡️ Transforming Safety and Efficacy",
      items: [
        "🔄 Replace traditional Phase 1-4 trials with continuous real-world evidence",
        "📡 Enable efficient safety testing through remote monitoring",
        "📊 Track safety and effectiveness automatically",
        "🚀 Generate better evidence faster with universal participation",
        "🧬 Identify optimal treatments for specific patient profiles",
      ],
      bgColor: "bg-blue-100",
    },
    {
      title: "🌍 Universal Participation",
      items: [
        "📚 World's largest medical database: 8B+ patients, 100K+ researchers, 1M+ doctors united",
        "🏠 Any patient can participate from home via telemedicine",
        "📱 Patient monitoring through mobile devices",
        "⚡ Automated outcome tracking",
        "🌈 Broader testing with diverse participants",
      ],
      bgColor: "bg-cyan-100",
    },
    {
      title: "🤖 AI-Powered Analysis",
      items: [
        "⚡ AI processes more trial data in 1 hour than all medical journals in history",
        "🧠 Analyzes all available research and patient data",
        "🚨 Provides early warnings of potential safety issues",
        "🎯 Identifies optimal treatments for patients",
        "📈 Monitors population-level health outcomes",
      ],
      bgColor: "bg-green-100",
    },
    {
      title: "💻 Platform Features",
      items: [
        "📊 Handle all trial data collection and real-world outcomes",
        "⚙️ Automate trial recruitment, monitoring, and analysis",
        "🤝 Connect patients and doctors globally",
        "🌐 Share results through open access",
        "💰 From $2.6B trials to $100M cures - 96% cost reduction",
      ],
      bgColor: "bg-purple-100",
    },
    {
      title: "🌐 Global Collaboration",
      items: [
        "🌍 Recognition of international safety data",
        "📝 Harmonized global reporting standards",
        "🤝 Cross-border research collaboration",
        "💎 Transparent pricing across regions",
        "🛡️ Real-time safety monitoring across 195 countries",
      ],
      bgColor: "bg-yellow-100",
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      <h2 className="mb-6 text-3xl font-black">
        Decentralized FDA 🌐💻
      </h2>
      <p className="mb-6 text-xl">
        Global, Open, Decentralized, & Automated Clinical Trials
      </p>
      <div className="space-y-6">
        {sections.map((section, index) => (
          <ListCard
            key={index}
            title={section.title}
            items={section.items}
            bgColor={section.bgColor}
          />
        ))}
        <section className="mt-12">
          <DFDACostSavingsTable />
        </section>
      </div>
    </motion.section>
  )
}

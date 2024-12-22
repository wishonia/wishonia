"use client"

import { motion } from "framer-motion"

export default function UniversalAccess() {
  const sections = [
    {
      title: "🚧 Universal Access to Treatments",
      items: [
        {
          icon: "🌍",
          text: "From 3% to 100% treatment access - first system that leaves no one behind",
        },
        {
          icon: "⚡",
          text: "Access breakthrough cures instantly - no more decade-long waits",
        },
        {
          icon: "🏥",
          text: "Choose any doctor, any clinic, anywhere - true medical freedom",
        },
        {
          icon: "🔐",
          text: "Your data, your choice - full control of your health destiny",
        },
      ],
    },
    {
      title: "🚫 NO ENTITY HAS THE RIGHT TO:",
      items: [
        { icon: "❌", text: "Block informed patient access" },
        { icon: "✈️", text: "Force travel for treatment" },
        { icon: "👨‍⚕️", text: "Prevent doctors from offering treatments" },
        { icon: "🧳", text: "Ban importing medicines from other countries" },
        { icon: "🏠", text: "Interfere with home treatments" },
        { icon: "📱", text: "Block telemedicine access" },
      ],
    },
    {
      title: "💪 DOCTORS HAVE THE RIGHT TO:",
      items: [
        { icon: "🌍", text: "Offer proven treatments anywhere" },
        { icon: "🧳", text: "Import treatments for patients" },
        { icon: "📡", text: "Use remote monitoring" },
        { icon: "🛣", text: "Cross state lines to help patients" },
        {
          icon: "📊",
          text: "Share results through the Decentralized FDA with patient consent",
        },
      ],
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      <h2 className="mb-4 text-3xl font-black">
        ⚖️ Right to Trial ✊
      </h2>
      <p className="mb-6 text-xl">
        The right of patients to participate in clinical trials and access treatments should be a human right. 
      </p>
      <p className="mb-6 text-xl">
        This provision guarantees:
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            className="rounded-lg border-2 border-black bg-white p-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="mb-3 text-xl font-bold">{section.title}</h3>
            <div className="space-y-2">
              {section.items.map((item, j) => (
                <div
                  key={j}
                  className="rounded p-2 transition-colors hover:bg-orange-100"
                >
                  <span className="mr-2 text-2xl">{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

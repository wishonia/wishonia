"use client"

import React from "react"
import { motion } from "framer-motion"

import CostSavingsTable from "../../components/CostSavingsTable"
import ProblemsWithCurrentSystem from "./problems-with-the-current-system"
import Solutions from "./right-to-trial-act-solutions"

// First, let's define the interfaces
interface Section {
  id: string
  title: string
  emoji: string
}

interface NavigationProps {
  sections: Section[]
  activeSection: string
  setActiveSection: (id: string) => void
}

interface ListCardProps {
  title: string
  items: string[]
  bgColor: string
}

const Header = () => (
  <header className="mb-8 border-4 border-black bg-white p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
    <h1 className="mb-4 text-5xl font-black uppercase tracking-tight">
      RIGHT TO TRIAL ACT 🧪💊
    </h1>
    <p className="text-xl font-bold">
      Faster Cures, Lower Costs, Universal Access 🚀🏥
    </p>
  </header>
)

const Navigation = ({
  sections,
  activeSection,
  setActiveSection,
}: NavigationProps) => (
  <nav className="mb-8 flex flex-wrap justify-center gap-4">
    {sections.map((section) => (
      <button
        key={section.id}
        onClick={() => setActiveSection(section.id)}
        className={`border-4 border-black p-4 text-lg font-bold transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${
          activeSection === section.id
            ? "bg-pink-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            : "bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        }`}
      >
        {section.emoji} {section.title}
      </button>
    ))}
  </nav>
)

const ListCard = ({ title, items, bgColor }: ListCardProps) => (
  <details
    className={`group rounded-lg border-2 border-black ${bgColor} p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
  >
    <summary className="cursor-pointer list-none">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{title}</h3>
        <span className="transform text-xl transition-transform duration-200 group-open:rotate-180">
          ▼
        </span>
      </div>
    </summary>

    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-lg border-2 border-black bg-white p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          <p className="font-bold">{item}</p>
        </div>
      ))}
    </motion.div>
  </details>
)

const Overview = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="rounded-lg border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  >
    <h2 className="mb-4 text-3xl font-black">Overview & Findings 📜</h2>
    <h3 className="mb-2 text-xl font-bold">Title 🏷️</h3>
    <p className="mb-4 text-lg">
      This Act may be cited as the "Right to Trial Act" 📋
    </p>
    <ProblemsWithCurrentSystem />
    <Solutions />
  </motion.section>
)

const OpenTrialPlatform = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="rounded-lg border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  >
    <h2 className="mb-4 text-3xl font-black">
      Open Source Global Decentralized Trial Platform 🌐💻
    </h2>
    <div className="space-y-4">
      <ListCard
        title="Global Open Science Revolution 🌍✨"
        items={[
          "World's largest medical database: 8B+ patients, 100K+ researchers, 1M+ doctors united 🚀",
          "AI processes more trial data in 1 hour than all medical journals in history 🤖",
          "From $2.6B trials to $100M cures - 96% cost reduction transforms medicine 💰",
          "Real-time global safety monitoring across 195 countries catches risks instantly 🛡️",
        ]}
        bgColor="bg-blue-200"
      />
      <section className="mt-12">
        <CostSavingsTable />
      </section>
    </div>
  </motion.section>
)

const PatientRights = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="rounded-lg border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  >
    <h2 className="mb-4 text-3xl font-black">Patient Rights 🚪</h2>
    <div className="space-y-4">
      <ListCard
        title="Universal Access to Treatments 🌟"
        items={[
          "From 3% to 100% treatment access - first system that leaves no one behind 🌍",
          "Access breakthrough cures instantly - no more decade-long waits ⚡",
          "Choose any doctor, any clinic, anywhere - true medical freedom 🏥",
          "Your data, your choice - full control of your health destiny 🔐",
        ]}
        bgColor="bg-purple-200"
      />
      <ListCard
        title="No More Artificial Restrictions 🚫"
        items={[
          "Block informed patient access ❌",
          "Force travel for treatment 🚫✈️",
          "Prevent doctors from offering treatments 🚫👨‍⚕️",
          "Ban importing of medicines 🚫🧳",
          "Interfere with home treatment 🚫🏠",
          "Block telemedicine access 🚫📱",
        ]}
        bgColor="bg-red-200"
      />
      <ListCard
        title="Empowering Doctors 👨‍⚕️💪"
        items={[
          "Offer proven treatments anywhere 🌍",
          "Import treatments for patients 🧳",
          "Provide care at home 🏠",
          "Use remote monitoring 📡",
          "Cross state lines to help patients 🚗",
          "Share results through the platform 📊",
        ]}
        bgColor="bg-blue-200"
      />
    </div>
  </motion.section>
)

const FinancialIncentives = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="rounded-lg border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  >
    <h2 className="mb-4 text-3xl font-black">Incentivized Cures 💰</h2>
    <div className="space-y-4">
      <div className="rounded-lg border-2 border-black bg-yellow-200 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="mb-2 text-xl font-bold">
          Healthcare Savings Sharing Program 💰🤝
        </h3>
        <p className="mb-2 text-lg font-bold">
          Win-Win: Manufacturers and Society Split Healthcare Savings 50/50
        </p>

        <div className="mb-4 rounded-lg border-2 border-black bg-white p-3">
          <p className="mb-2 font-bold">
            Example: Age-Related Disease Prevention 🧬
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>Average lifetime healthcare costs: $1.2M per person 📊</li>
            <li>~80% of costs are from age-related diseases ($960k) 👴</li>
            <li>Treatment reduces lifetime costs by $750k per person 📉</li>
            <li>At $10k per treatment, 1 million people can afford it 👥</li>
            <li>Total lifetime savings: $750 billion 💰</li>
            <li>Society keeps: $375 billion in savings 🏥</li>
            <li>Manufacturer receives: $375 billion in rewards 🎯</li>
            <li>
              Additional savings from increased productivity and reduced care
              needs 📈
            </li>
          </ul>
        </div>

        <div className="mb-4 rounded-lg border-2 border-black bg-white p-3">
          <p className="mb-2 font-bold">Massive Economic Benefits 📊</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Government healthcare costs cut in half 📉</li>
            <li>Patients save thousands on treatment costs 💰</li>
            <li>Insurance premiums drop dramatically ⬇️</li>
            <li>Taxpayers save trillions long-term 💎</li>
            <li>Healthcare becomes sustainably affordable 🌟</li>
          </ul>
        </div>

        <p className="mb-2 font-bold">This creates a virtuous cycle:</p>
        <ul className="mb-4 list-inside list-disc space-y-1">
          <li>Lower prices → More patients can afford treatment 💫</li>
          <li>More patients → Higher total savings generated 📈</li>
          <li>Higher savings → Bigger rewards for manufacturers 🎯</li>
          <li>Bigger rewards → More investment in cures 🚀</li>
          <li>More cures → Even more healthcare savings 💰</li>
        </ul>

        <p className="mb-2 font-bold">Eligible Treatments Include:</p>
        <ul className="mb-4 list-inside list-disc space-y-1">
          <li>Age reversal therapies 🧬</li>
          <li>Gene therapies 🧬</li>
          <li>Disease prevention treatments 🛡️</li>
          <li>Regenerative medicine 🔄</li>
          <li>Longevity treatments ⏳</li>
        </ul>

        <p className="mt-2 font-bold">Implementation:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>AI tracks long-term health outcomes 📊</li>
          <li>Transparent savings calculations 🧮</li>
          <li>Independent verification of results ✅</li>
          <li>Automated payment distribution 💸</li>
        </ul>
      </div>
    </div>
  </motion.section>
)

export default function CureAccelerationAct() {
  return (
    <div className="min-h-screen font-mono text-black">
      <Header />
      <main className="space-y-8">
        <Overview />
        <OpenTrialPlatform />
        <PatientRights />
        <FinancialIncentives />
      </main>
    </div>
  )
}
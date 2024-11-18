'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';





// First, let's define the interfaces
interface Section {
  id: string
  title: string
  emoji: string
}

interface CardItem {
  text: string
  emoji: string
}

interface NavigationProps {
  sections: Section[]
  activeSection: string
  setActiveSection: (id: string) => void
}

interface CardProps {
  title: string
  items: CardItem[]
  bgColor: string
}

interface ListCardProps {
  title: string
  items: string[]
  bgColor: string
}

interface OverviewProps {
  problems: CardItem[]
  solutions: CardItem[]
}

const Header = () => (
  <header className="mb-8 border-4 border-black bg-white p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
    <h1 className="mb-4 text-5xl font-black uppercase tracking-tight">
      RIGHT TO TRIAL ACT 🧪💊
    </h1>
    <p className="text-xl font-bold">Faster Cures, Lower Costs, Universal Access 🚀🏥</p>
  </header>
)

const Navigation = ({ sections, activeSection, setActiveSection }: NavigationProps) => (
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

const Card = ({ title, items, bgColor }: CardProps) => (
  <div className={`rounded-lg border-2 border-black ${bgColor} p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
    <h3 className="mb-4 text-xl font-bold">{title}</h3>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <div 
          key={index} 
          className="rounded-lg border-2 border-black bg-white p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          <div className="text-center">
            <span className="text-4xl">{item.emoji}</span>
            <p className="mt-2 font-bold">{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const ListCard = ({ title, items, bgColor }: ListCardProps) => (
  <div className={`rounded-lg border-2 border-black ${bgColor} p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
    <h3 className="mb-4 text-xl font-bold">{title}</h3>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-lg border-2 border-black bg-white p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
        >
          <p className="font-bold">{item}</p>
        </div>
      ))}
    </div>
  </div>
)

const Overview = ({ problems, solutions }: OverviewProps) => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="rounded-lg border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  >
    <h2 className="mb-4 text-3xl font-black">Overview & Findings 📜</h2>
    <h3 className="mb-2 text-xl font-bold">Title 🏷️</h3>
    <p className="mb-4 text-lg">This Act may be cited as the "Right to Trial Act" 📋</p>
    <Card title="Core Problems This Act Solves 🛠️" items={problems} bgColor="bg-red-200" />
    <Card title="The Solution 💡" items={solutions} bgColor="bg-green-200" />
    <ListCard
      title="Economic Impact 📈"
      items={[
        "Cut trial costs by 90% 💰",
        "Save $2 trillion annually 💵",
        "Reduce time-to-market 🏃‍♂️",
        "Multi-billion dollar cure rewards 🎁",
        "Enable real price competition 🏆",
      ]}
      bgColor="bg-blue-200"
    />
  </motion.section>
)

const OpenTrialPlatform = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="rounded-lg border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  >
    <h2 className="mb-4 text-3xl font-black">Open Source Global Decentralized Trial Platform 🌐💻</h2>
    <div className="space-y-4">
      <ListCard
        title="Revolutionary Safety & Efficacy Testing 🔬"
        items={[
          "Real-world evidence replaces outdated trials 📊",
          "24/7 automated safety monitoring 📡",
          "Continuous effectiveness tracking across all healthcare 🏥",
          "10x faster evidence generation 🚀",
          "AI-powered treatment optimization 🎯",
        ]}
        bgColor="bg-purple-200"
      />
      <ListCard
        title="Universal Participation 🌍"
        items={[
          "Broader testing with diverse participants 🧑‍🤝‍🧑",
          "Any patient can participate 🙋‍♂️🙋‍♀️",
          "Home and remote participation via telemedicine 🏠📱",
          "Patient monitoring through mobile devices 📲",
          "Automated outcome tracking 🤖",
          "Direct patient reporting 🗣️",
          "Continuous real-world evidence collection 🔄",
        ]}
        bgColor="bg-orange-200"
      />
      <ListCard
        title="FDAi: Autonomous Agent 🤖"
        items={[
          "Analyzes all available research and patient data 🔍",
          "Quantifies effects of drugs, food, and treatments 📊",
          "Provides early warning of safety issues ⚠️",
          "Identifies optimal treatments for patients 🎯",
          "Monitors population-level health outcomes 📈",
          "Tracks food-drug interactions 🍎💊",
        ]}
        bgColor="bg-cyan-200"
      />
      <ListCard
        title="Cost-Effective System 💰➡️🆓"
        items={[
          "Handle all trial data collection 📊",
          "Track real-world outcomes 📈",
          "Monitor safety automatically 🛡️",
          "Analyze what works best 🔍",
          "Connect patients and doctors 🤝",
          "Share results globally 🌐",
          "Automate trial processes 🤖",
        ]}
        bgColor="bg-green-200"
      />
      <ListCard
        title="Open To Everyone 🌐"
        items={[
          "Access trial data 🔓",
          "Build new analysis tools 🛠️",
          "Create patient apps 📱",
          "Improve the platform 🔧",
          "Add new features ➕",
        ]}
        bgColor="bg-yellow-200"
      />
      <ListCard
        title="Global Collaboration 🌍🤝"
        items={[
          "International safety data recognition 🔐",
          "Harmonized global reporting standards 📋",
          "Cross-border research collaboration 🧪",
          "Transparent pricing across regions 💲",
          "International treatment access 🏥",
        ]}
        bgColor="bg-blue-200"
      />
    </div>
  </motion.section>
)

const UniversalAccess = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="rounded-lg border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
  >
    <h2 className="mb-4 text-3xl font-black">Universal Access to Treatments 🚪</h2>
    <div className="space-y-4">
      <ListCard
        title="Breaking Down All Barriers 🧱💥"
        items={[
          "Access breakthrough treatments immediately 🔬",
          "Participate from anywhere in the world 🌍",
          "Choose any proven global treatment 🌐",
          "Use local doctors or telemedicine 👨‍⚕️📱",
          "Help others by sharing your results 🤝",
        ]}
        bgColor="bg-green-200"
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
    <h2 className="mb-4 text-3xl font-black">Financial Incentives 💰</h2>
    <div className="space-y-4">
      <ListCard
        title="Removing Barriers 🚧➡️🆓"
        items={[
          "No user fees for treatment development 🚫💰",
          "Congressional funding for platform 🏛️💵",
          "Free importation of lower-cost treatments 🌐💊",
        ]}
        bgColor="bg-green-200"
      />
      <div className="rounded-lg border-2 border-black bg-yellow-200 p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="mb-2 text-xl font-bold">Healthcare Savings Sharing Program 💰🤝</h3>
        <p className="mb-2 font-bold text-lg">Win-Win: Manufacturers and Society Split Healthcare Savings 50/50</p>
        
        <div className="mb-4 p-3 bg-white rounded-lg border-2 border-black">
          <p className="font-bold mb-2">Example: Age Reversal Treatment 🧬</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Treatment reduces healthcare costs by $50k per person annually 📉</li>
            <li>At $1k per treatment, 1 million people can afford it 👥</li>
            <li>Total savings: $50 billion per year 💰</li>
            <li>Society keeps: $25 billion in savings 🏥</li>
            <li>Manufacturer receives: $25 billion in rewards 🎯</li>
            <li>More affordable price = more users = more savings for everyone 📈</li>
          </ul>
        </div>

        <div className="mb-4 p-3 bg-white rounded-lg border-2 border-black">
          <p className="font-bold mb-2">Massive Economic Benefits 📊</p>
          <ul className="list-inside list-disc space-y-1">
            <li>Government healthcare costs cut in half 📉</li>
            <li>Patients save thousands on treatment costs 💰</li>
            <li>Insurance premiums drop dramatically ⬇️</li>
            <li>Taxpayers save trillions long-term 💎</li>
            <li>Healthcare becomes sustainably affordable 🌟</li>
          </ul>
        </div>

        <p className="mb-2 font-bold">This creates a virtuous cycle:</p>
        <ul className="list-inside list-disc space-y-1 mb-4">
          <li>Lower prices → More patients can afford treatment 💫</li>
          <li>More patients → Higher total savings generated 📈</li>
          <li>Higher savings → Bigger rewards for manufacturers 🎯</li>
          <li>Bigger rewards → More investment in cures 🚀</li>
          <li>More cures → Even more healthcare savings 💰</li>
        </ul>

        <p className="mb-2 font-bold">Eligible Treatments Include:</p>
        <ul className="list-inside list-disc space-y-1 mb-4">
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
  const [activeSection, setActiveSection] = useState<string>("overview")

  const sections: Section[] = [
    { id: "overview", title: "Overview & Findings", emoji: "📜" },
    { id: "platform", title: "Decentralized Autonomous Trials", emoji: "🌐" },
    { id: "access", title: "Patient Rights", emoji: "🚪" },
    { id: "incentives", title: "Incentivized Cures", emoji: "💰" },
  ]

  const problems: CardItem[] = [
    { text: "Life-saving treatments delayed 7-12 years", emoji: "⏳" },
    { text: "97% of patients denied trial access", emoji: "🚫" },
    { text: "Crushing $2.6B development costs", emoji: "💸" },
    { text: "Focus on expensive drugs, not cures", emoji: "💊" },
    { text: "Years of waiting for breakthrough treatments", emoji: "⌛" },
    { text: "US patients last to access new therapies", emoji: "🐢" },
    { text: "Prevention and cures ignored for profits", emoji: "🏥" },
    { text: "Real-world evidence is ignored", emoji: "🙈" },
  ]

  const solutions: CardItem[] = [
    { text: "Immediate access to safe treatments", emoji: "✅" },
    { text: "Free global trial platform", emoji: "🆓" },
    { text: "Billion-dollar rewards for true cures", emoji: "🏆" },
    { text: "Universal treatment access", emoji: "🚀" },
    { text: "Data-driven treatment decisions", emoji: "📊" },
    { text: "AI-powered safety monitoring", emoji: "🤖" },
  ]

  return (
    <div className="min-h-screen font-mono text-black">
      <Header />
      <Navigation
        sections={sections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />
      <main className="space-y-8">
        {activeSection === "overview" && (
          <Overview problems={problems} solutions={solutions} />
        )}
        {activeSection === "platform" && <OpenTrialPlatform />}
        {activeSection === "access" && <UniversalAccess />}
        {activeSection === "incentives" && <FinancialIncentives />}
      </main>
    </div>
  )
}
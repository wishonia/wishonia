'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, Dna, Pill, Users, Activity, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import CostSavingsTable from './CostSavingsTable'
import PredictorSearchAutocomplete from './PredictorSearchAutocomplete'
import { GlobalVariable } from '@/types/models/all'
import OutcomeSearchAutocomplete from './OutcomeSearchAutocomplete'
import AdvancedTrialSearch from './AdvancedTrialSearch'
import { Robot } from '@phosphor-icons/react'
import { FeatureBox } from './FeatureBox'

const features = [
  {
    title: "Right to Trial Act",
    desc: "Learn about the groundbreaking legislation",
    color: "bg-blue-400",
    icon: Dna,
    media: "https://example.com/right-to-trial.jpg",
    onClick: () => {
      console.log("Right to Trial Act clicked")
      // Add specific behavior here, e.g., navigate to a detailed page
    }
  },
  {
    title: "FDAi Agent",
    desc: "Help us give everyone a free superintelligent doctor",
    color: "bg-green-400",
    icon: Robot,
    media: "https://player.vimeo.com/video/930843979?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
    onClick: () => {
      console.log("FDAi Agent clicked")
      // Add specific behavior here, e.g., open a modal with AI tool demo
    }
  },
  {
    title: "Treatment Database",
    desc: "Explore our comprehensive database",
    color: "bg-purple-400",
    icon: Pill,
    media: "https://vimeo.com/148751763",
    onClick: () => {
      console.log("Treatment Database clicked")
      // Add specific behavior here, e.g., redirect to database search page
    }
  },
  {
    title: "Community Studies",
    desc: "Join ongoing research initiatives",
    color: "bg-red-400",
    icon: Users,
    media: "https://www.dailymotion.com/video/x7tgd2f",
    onClick: () => {
      console.log("Community Studies clicked")
      // Add specific behavior here, e.g., show a list of active studies
    }
  },
  {
    title: "Personal Health Tracking",
    desc: "Monitor your health journey",
    color: "bg-orange-400",
    icon: Activity,
    media: "https://example.com/health-tracking.gif",
    onClick: () => {
      console.log("Personal Health Tracking clicked")
      // Add specific behavior here, e.g., navigate to user's health dashboard
    }
  },
  {
    title: "About dFDA",
    desc: "Learn about our mission and impact",
    color: "bg-indigo-400",
    icon: Info,
    media: "https://example.com/about-dfda.webp",
    onClick: () => {
      console.log("About dFDA clicked")
      // Add specific behavior here, e.g., open a modal with dFDA information
    }
  }
]

const SquigglyPattern = () => (
  <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
    <pattern id="squiggly" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M0 10C5 10 5 0 10 0S15 10 20 10 25 0 30 0 35 10 40 10" stroke="rgba(0,0,0,0.1)" fill="none" />
    </pattern>
    <rect width="100%" height="100%" fill="url(#squiggly)" />
  </svg>
)

export default function HomePage() {
  const onVariableSelect = (variable: GlobalVariable) => {
    const iframe = document.createElement('div')
    iframe.style.position = 'fixed'
    iframe.style.top = '0'
    iframe.style.left = '0'
    iframe.style.width = '100vw'
    iframe.style.height = '100vh'
    iframe.style.backgroundColor = 'rgba(0,0,0,0.75)'
    iframe.style.zIndex = '50'
    iframe.innerHTML = `
      <div class="w-full h-full p-4 relative">
        <button 
          class="absolute top-4 right-4 bg-white rounded-full p-4 hover:bg-gray-100 text-black"
          onclick="this.parentElement.parentElement.remove()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <iframe 
          src="https://studies.dfda.earth/variables/${variable.variableId}"
          class="w-full h-full bg-white rounded-xl"
        ></iframe>
      </div>
    `
    document.body.appendChild(iframe)
  }

  return (
    <div className="">
      <SquigglyPattern />
      <header className="relative mb-12 overflow-hidden rounded-xl border-4 border-black bg-white p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <motion.h1 
          className="mb-4 text-6xl font-black uppercase tracking-tight"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          fda.gov v2 
        </motion.h1>
        <motion.p 
          className="text-xl font-bold"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          🚀Accelerating Discovery Through the Precision Health of the Future 💊
        </motion.p>
      </header>

      <main className="space-y-12">
        <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-pink-400 to-purple-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase">See Effects of Foods🍟 or Drugs💊</h2>
          <div className="flex flex-col gap-4 md:flex-row">
            <PredictorSearchAutocomplete onVariableSelect={onVariableSelect} />
          </div>
        </section>

        <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-pink-400 to-purple-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase">See Most Effective Treatments for your Condition</h2>
          <div className="flex flex-col gap-4 md:flex-row">
            <OutcomeSearchAutocomplete onVariableSelect={onVariableSelect} />
          </div>
        </section>

        <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-green-400 to-emerald-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase">Join Clinical Trials 🔬</h2>
          <p className="mb-6 text-xl font-bold">Find and instantly join trials for the most promising treatments</p>
          <AdvancedTrialSearch />
        </section>

        <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-pink-400 to-purple-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase">Drug Companies: Register Your Treatment 🏢</h2>
          <div className="flex flex-col gap-4">
            <p className="text-xl font-bold">Instantly register your treatment and create a study</p>
            <Link 
              href="/dfda/drug-companies/register-drug"
              className="group inline-flex w-fit items-center gap-2 rounded-xl border-4 border-black bg-white px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              Register Now
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureBox
              key={feature.title}
              {...feature}
              index={index}
            />
          ))}
        </section>

        <section className="mt-12">
          <CostSavingsTable />
        </section>
      </main>


    </div>
  )
}
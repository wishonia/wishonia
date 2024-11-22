"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Robot } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import { Activity, ArrowRight, Info, Pill, Scroll, Users } from "lucide-react"

import { GlobalVariable } from "@/types/models/all"
import VariableSearchAutocomplete from "@/app/dfda/components/VariableSearchAutocomplete"

import { getSafeUrlWithToken } from "../dfdaActions"
import AdvancedTrialSearch from "../trials/components/AdvancedTrialSearch"
import CitizenScienceSection from "./CitizenScienceSection"
import CostSavingsTable from "./CostSavingsTable"
import DFDAComparisonTable from "./DFDAComparisonTable"
import { DFDADisclaimer } from "./DFDADisclaimer"
import { FeatureBox } from "./FeatureBox"
import SolutionSection from "./SolutionSection"

export default function DFDAHomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleDigitalTwinSafeClick = async (path: string) => {
    //setIsLoading(true)
    const url = await getSafeUrlWithToken(path)
    window.open(url, "_blank")
  }

  const features = [
    {
      title: "The Cure Acceleration Act",
      desc: "Help us give people suffering access to the most promising treatments",
      color: "bg-blue-400",
      icon: Scroll,
      media: "https://wiki.dfda.earth/right_to_trial_act_image.jpg",
      onClick: async () => {
        console.log("Right to Trial Act clicked")
        setIsLoading(true)
        router.push("/dfda/right-to-trial-act")
      },
    },
    {
      title: "Your Personal FDAi Agent",
      desc: "Help us give everyone a free superintelligent doctor",
      color: "bg-green-400",
      icon: Robot,
      media:
        "https://player.vimeo.com/video/930843979?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479",
      onClick: () => {
        console.log("FDAi Agent clicked")
        // Add specific behavior here, e.g., open a modal with AI tool demo
        window.open("https://fdai.earth", "_blank")
      },
    },
    {
      title: "Your Digital Twin Safe",
      desc: "Securely store and control your health data",
      color: "bg-purple-400",
      icon: Pill,
      media:
        "https://user-images.githubusercontent.com/2808553/180306571-ac9cc741-6f34-4059-a814-6f8a72ed8322.png",
      onClick: () => {
        handleDigitalTwinSafeClick("intro")
      },
    },
    {
      title: "Clinipedia",
      desc: "The Wikipedia of Clinical Research",
      color: "bg-red-400",
      icon: Users,
      media:
        "https://fdai.earth/wp-content/uploads/2024/03/clinipedia-inflammatory-pain-small.gif",
      onClick: () => {
        console.log("Clinipedia clicked")
        // open studies.dfda.earth in a new tab
        window.open("https://studies.dfda.earth", "_blank")
      },
    },
    {
      title: "Outcome Labels",
      desc: "See how treatments affect specific health outcomes",
      color: "bg-orange-400",
      icon: Activity,
      media: "https://wiki.dfda.earth/assets/outcome-labels.PNG",
      onClick: () => {
        console.log("Outcome Labels clicked")
        // open studies.dfda.earth in a new tab
        window.open("https://studies.dfda.earth", "_blank")
      },
    },
    {
      title: "Why Decentralize the FDA?",
      desc: "Learn about the historical context and need for decentralization",
      color: "bg-yellow-400",
      icon: Info,
      media:
        "https://thinkbynumbers.org/wp-content/uploads/2021/03/news-story-headline-1-1024x563.png",
      href: "/dfda/why",
      onClick: () => {
        // open https://dfda.earth in a new tab
        window.open("https://why.dfda.earth", "_blank")
        console.log("Why dFDA clicked")
      },
    },
  ]

  const onVariableSelect = (variable: GlobalVariable) => {
    const iframe = document.createElement("div")
    iframe.style.position = "fixed"
    iframe.style.top = "0"
    iframe.style.left = "0"
    iframe.style.width = "100vw"
    iframe.style.height = "100vh"
    iframe.style.backgroundColor = "rgba(0,0,0,0.75)"
    iframe.style.zIndex = "50"
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
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-white"></div>
        </div>
      )}
      <header className="relative mb-12 overflow-hidden rounded-xl border-4 border-black bg-white p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <motion.h1
          className="mb-4 text-6xl font-black uppercase tracking-tight"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Let's Upgrade FDA.gov!
        </motion.h1>
        <motion.p
          className="text-xl font-bold"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          🚀 Decentralizing and automating clinical research to determine the
          positive and negative effects of every food and drug in the world! 💊
        </motion.p>
      </header>

      <main className="space-y-12">
        <DFDADisclaimer />
        <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-pink-400 to-purple-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase">
            See Effects of Foods🍟
          </h2>
          <div className="flex flex-col gap-4 md:flex-row">
            <VariableSearchAutocomplete
              onVariableSelect={onVariableSelect}
              searchParams={{
                sort: "-numberOfCorrelationsAsCause",
                isPublic: "1",
                variableCategoryName: "Foods",
                limit: "10",
              }}
              placeholder="Enter Foods🍟"
            />
          </div>
        </section>

        <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-pink-400 to-purple-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase">
            See Effects of Treatments💊
          </h2>
          <div className="flex flex-col gap-4 md:flex-row">
            <VariableSearchAutocomplete
              onVariableSelect={onVariableSelect}
              searchParams={{
                sort: "-numberOfCorrelationsAsCause",
                isPublic: "1",
                variableCategoryName: "Treatments",
                limit: "10",
              }}
              placeholder="Enter treatment 💊"
            />
          </div>
        </section>

        <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-pink-400 to-purple-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase">
            See Most Effective Treatments for your Condition
          </h2>
          <div className="flex flex-col gap-4 md:flex-row">
            <VariableSearchAutocomplete
              onVariableSelect={onVariableSelect}
              searchParams={{
                sort: "-numberOfCorrelationsAsCause",
                isPublic: "1",
                variableCategoryName: "Symptoms",
                limit: "10",
              }}
              placeholder="Enter symptom 🤒"
            />
          </div>
        </section>

        <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-green-400 to-emerald-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase">
            Join Clinical Trials 🔬
          </h2>
          <p className="mb-6 text-xl font-bold">
            Find and instantly join trials for the most promising treatments
          </p>
          <AdvancedTrialSearch />
        </section>

        <section className="relative overflow-visible rounded-xl border-4 border-black bg-gradient-to-r from-pink-400 to-purple-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase">
            🏢 Drug Companies: Create Your Trial 📝
          </h2>
          <div className="flex flex-col gap-4">
            <p className="text-xl font-bold">
              See how easy it could be to instantly register your treatment and
              create a study 📝, automate recruitment 🤖, data collection 📊,
              analysis 🔬, and get your drug to patients ASAP!
            </p>
            <Link
              href="/dfda/drug-companies/register-drug"
              className="group inline-flex w-fit items-center gap-2 rounded-xl border-4 border-black bg-white px-6 py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
            >
              Register Now
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        <DFDAComparisonTable />

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureBox key={feature.title} {...feature} index={index} />
          ))}
        </section>

        {/* <ProblemSection />
        <GoodNewsSection /> */}
        <SolutionSection />
        <CitizenScienceSection />

        <section className="mt-12">
          <CostSavingsTable />
        </section>
      </main>
    </div>
  )
}
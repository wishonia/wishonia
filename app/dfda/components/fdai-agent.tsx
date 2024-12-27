import { ArrowLeft, Brain, Zap, Database, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'

export default function FDAiAgentPage() {
  return (
    <div className="">
      <header className="mb-12 border-4 border-black bg-white p-6 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="mb-4 text-6xl font-black uppercase tracking-tight">FDAi Agent 🤖</h1>
        <p className="text-xl font-bold">AI-Powered Analysis for Better Health Outcomes</p>
      </header>

      <main className="space-y-12">
        <section className="border-4 border-black bg-yellow-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase flex items-center">
            <Brain className="mr-4 h-12 w-12" />
            What is FDAi?
          </h2>
          <p className="text-lg font-bold">
            FDAi is an autonomous agent that continuously analyzes research and patient data to quantify the effects of drugs, food, dietary patterns, and treatments. It provides early safety warnings and finds optimal treatments based on individual patient profiles.
          </p>
        </section>

        <section className="border-4 border-black bg-green-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase flex items-center">
            <Zap className="mr-4 h-12 w-12" />
            Key Features
          </h2>
          <ul className="list-inside list-disc space-y-2 text-lg font-bold">
            <li>Real-time analysis of global health data</li>
            <li>Early detection of safety concerns and side effects</li>
            <li>Personalized treatment recommendations</li>
            <li>Continuous monitoring of health outcomes and drug interactions</li>
            <li>AI-driven meta-analyses of all available research</li>
          </ul>
        </section>

        <section className="border-4 border-black bg-blue-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase flex items-center">
            <Database className="mr-4 h-12 w-12" />
            Data Sources
          </h2>
          <ul className="list-inside list-disc space-y-2 text-lg font-bold">
            <li>Decentralized clinical trials</li>
            <li>Electronic Health Records (EHRs)</li>
            <li>Patient-reported outcomes</li>
            <li>Wearable device data</li>
            <li>Published medical research</li>
            <li>Real-world evidence from healthcare providers</li>
          </ul>
        </section>

        <section className="border-4 border-black bg-red-400 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="mb-6 text-4xl font-black uppercase flex items-center">
            <TrendingUp className="mr-4 h-12 w-12" />
            Impact
          </h2>
          <ul className="list-inside list-disc space-y-2 text-lg font-bold">
            <li>Accelerates identification of effective treatments</li>
            <li>Reduces time and cost of drug development</li>
            <li>Improves patient safety through early warning systems</li>
            <li>Enhances personalized medicine capabilities</li>
            <li>Facilitates evidence-based healthcare decision-making</li>
          </ul>
        </section>

        <section className="text-center">
          <Button className="border-4 border-black bg-purple-500 p-6 text-2xl font-black text-white transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Explore FDAi Insights 🔍
          </Button>
        </section>
      </main>

      <footer className="mt-12 border-t-4 border-black bg-white p-4 text-center font-bold">
        <Link href="/" className="inline-flex items-center font-black text-black hover:underline">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </footer>
    </div>
  )
}
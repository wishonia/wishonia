import React from "react"

import ForkableWorldSection from "@/components/landingPage/ForkableWorldSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import OpenSource from "@/components/pages/opensource"
import { PWARedirect } from "@/components/pwa-redirect";
import InteractiveLandingPage from "@/components/landingPage/interactive-landing-page";
import WorldOptimizationDashboard from "@/components/landingPage/world-optimization-dashboard";
import ManualHero from "@/components/landingPage/ManualHero";
import { headers } from "next/headers"
import DFDAPage from "../dfda/page"

export const revalidate = 3600

export default async function Home() {
  const headersList = headers()
  const host = headersList.get('host') || ''
  if(host.includes('dfda')) {return <DFDAPage />}

  return (
      <main className="mx-auto max-w-7xl">
          <ManualHero/>
          <div id="landing-content">
          <InteractiveLandingPage/>
          <ForkableWorldSection/>
          <HowItWorksSection/>
          <WorldOptimizationDashboard></WorldOptimizationDashboard>
          <OpenSource/>
          <PWARedirect/>
          </div>
      </main>
  )
}

import React from "react"

import ForkableWorldSection from "@/components/landingPage/ForkableWorldSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import OpenSource from "@/components/pages/opensource"
import { PWARedirect } from "@/components/pwa-redirect";
import InteractiveLandingPage from "@/components/landingPage/interactive-landing-page";
import WorldOptimizationDashboard from "@/components/landingPage/world-optimization-dashboard";
import ManualHero from "@/components/landingPage/ManualHero";

export const revalidate = 3600

export default function Home() {
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

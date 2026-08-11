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
      <main className="w-full overflow-x-hidden">
          {/* Outside the column on purpose: these paint their own bg-black and
              must reach the viewport edges, or wide screens show rails of the
              page background beside them. */}
          <InteractiveLandingPage/>
          <div id="landing-content" className="mx-auto w-full max-w-7xl">
          <ForkableWorldSection/>
          <HowItWorksSection/>
          <WorldOptimizationDashboard></WorldOptimizationDashboard>
          <OpenSource/>
          <PWARedirect/>
          </div>
          <ManualHero/>
      </main>
  )
}

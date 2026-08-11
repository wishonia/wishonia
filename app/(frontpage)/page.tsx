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
          {/* InteractiveLandingPage and ManualHero paint their own bg-black, so
              they sit outside the centered column and run the full width of the
              viewport. Inside it, their background stopped at 1280px and left
              rails of the page background down both edges on wide screens. */}
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

import React from "react"

import { getCurrentUser } from "@/lib/session"
import ForkableWorldSection from "@/components/landingPage/ForkableWorldSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import OpenSource from "@/components/pages/opensource"
import { PWARedirect } from "@/components/pwa-redirect"
import GlobalHealthOptimizationAgent from "@/components/landingPage/global-health-optimization-agent";
import GlobalCoordinationAgent from "@/components/landingPage/global-coordination-agent";
import GlobalBrainNetwork from "@/components/landingPage/global-brain-network";
import InteractiveLandingPage from "@/components/landingPage/interactive-landing-page";

export default async function Home() {
  const user = await getCurrentUser()
  return (
      <main>
          {/*<ComplexityVisualization></ComplexityVisualization>*/}
          {/*<h1 className={"center"}>WishocracyExperience</h1>*/}
          {/*<WishocracyExperience/>*/}
          {/*<h1 className={"center"}>DetailedWishocracyExplainer</h1>*/}
          {/*<DetailedWishocracyExplainer/>*/}
          {/*<h1 className={"center"}>RadicalWishocracyReveal</h1>*/}
          {/*<RadicalWishocracyReveal/>*/}
          {/*<Hero/>*/}
          <InteractiveLandingPage/>
          <ForkableWorldSection/>
          <HowItWorksSection user={user}/>
          <div className="min-h-screen font-mono">
              <header
                  className="border-b-8 border-cyan-500 bg-gradient-to-r from-gray-900 via-black to-gray-900 p-4 sm:p-8 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                  <h1 className="relative mb-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-text-shimmer">
                      World Optimization Command Center
                  </h1>
                  <div
                      className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-x"></div>
              </header>
              <main className="flex flex-col p-4 md:flex-row md:flex-wrap justify-center">
                  <GlobalCoordinationAgent></GlobalCoordinationAgent>
                  <GlobalHealthOptimizationAgent></GlobalHealthOptimizationAgent>
              </main>
          </div>
          <div className="w-1/2 mx-auto">
              <GlobalBrainNetwork />
        </div>
          {/*<MetaTodoList/>*/}
          {/*<WishocracyFeatureCards/>*/}
          <OpenSource/>
          <PWARedirect/>
      </main>
  )
}

import React from "react"

import { getCurrentUser } from "@/lib/session"
import ForkableWorldSection from "@/components/landingPage/ForkableWorldSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import OpenSource from "@/components/pages/opensource"
import { PWARedirect } from "@/components/pwa-redirect";
import InteractiveLandingPage from "@/components/landingPage/interactive-landing-page";
import WorldOptimizationDashboard from "@/components/landingPage/world-optimization-dashboard";
import CureDaoHome from "../curedao/page"
import { headers } from "next/headers"
import DFDAPage from "../dfda/page"


export default async function Home() {
  const headersList = headers()
  const host = headersList.get('host') || ''
  if (host.includes('curedao')) {return <CureDaoHome />}
  if(host.includes('dfda')) {return <DFDAPage />}

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
          <WorldOptimizationDashboard></WorldOptimizationDashboard>

          {/*<MetaTodoList/>*/}
          {/*<WishocracyFeatureCards/>*/}
          <OpenSource/>
          <PWARedirect/>
      </main>
  )
}
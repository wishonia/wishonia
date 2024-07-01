import React from "react"

import { getCurrentUser } from "@/lib/session"
import ForkableWorldSection from "@/components/ForkableWorldSection"
import HowItWorksSection from "@/components/HowItWorksSection"
import OpenSource from "@/components/pages/opensource"
import { PWARedirect } from "@/components/pwa-redirect"

export default async function Home() {
  const user = await getCurrentUser()
  return (
    <main>
      {/*<Hero/>*/}
      <ForkableWorldSection />
      <HowItWorksSection user={user} />
      {/*<MetaTodoList/>*/}
      {/*<WishocracyFeatureCards/>*/}
      <OpenSource />
      <PWARedirect />
    </main>
  )
}

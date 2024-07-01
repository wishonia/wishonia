import { getCurrentUser } from "@/lib/session"
import HowItWorksSection from "@/components/HowItWorksSection"
import OpenSource from "@/components/pages/opensource"
import { PWARedirect } from "@/components/pwa-redirect"
import ForkableWorldSection from "@/components/ForkableWorldSection";
import React from "react";

export default async function Home() {
  const user = await getCurrentUser()
  return (
      <main>
          {/*<Hero/>*/}
          <ForkableWorldSection/>
          <HowItWorksSection user={user}/>
          {/*<MetaTodoList/>*/}
          {/*<WishocracyFeatureCards/>*/}
          <OpenSource/>
          <PWARedirect/>
      </main>
  )
}

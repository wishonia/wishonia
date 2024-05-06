import { WishocracyLandingPage } from "@/components/component/wishocracy-landing-page"
import FeatureCards from "@/components/pages/feature-cards"
import Hero from "@/components/pages/hero"
import OpenSource from "@/components/pages/opensource"
import Overview from "@/components/pages/overview"
import { PollWarResearch } from "@/components/pollWarResearch"
import { PWARedirect } from "@/components/pwa-redirect"
import {Poll} from "@/components/poll";

export default function Home() {
  return (
    <main>
{/*      <WishocracyLandingPage />*/}
      <Poll />
{/*       <Hero />
      <FeatureCards />
      <Overview />
      <OpenSource />*/}
      <PWARedirect />
    </main>
  )
}

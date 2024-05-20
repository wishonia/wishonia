import { WishocracyLandingPage } from "@/components/component/wishocracy-landing-page"
import FeatureCards from "@/components/pages/feature-cards"
import Hero from "@/components/pages/hero"
import OpenSource from "@/components/pages/opensource"
import Overview from "@/components/pages/overview"
import { PollWarVsCures } from "@/components/pollWarVsCures"
import { PWARedirect } from "@/components/pwa-redirect"
import {getCurrentUser} from "@/lib/session";
import {PollRandomGlobalProblems} from "@/components/poll-random-global-problems";
import {PollRandomWishingWells} from "@/components/poll-random-wishing-wells";

export default async function Home() {
    const user = await getCurrentUser()
    return (
        <main>
            {/*      <WishocracyLandingPage />*/}
            {/*      <PollRandomWishingWells />*/}
            <PollRandomWishingWells user={user}></PollRandomWishingWells>
            <PollRandomGlobalProblems user={user}></PollRandomGlobalProblems>
            {/*<PollWarResearch user={user}></PollWarResearch>*/}
            {/*<PollRandomGlobalProblems></PollRandomGlobalProblems>*/}
            {/*       <Hero />
      <FeatureCards />
      <Overview />
      <OpenSource />*/}
            <PWARedirect/>
        </main>
    )
}

import FeatureCards from "@/components/pages/feature-cards"
import Hero from "@/components/pages/hero"
import OpenSource from "@/components/pages/opensource"
import { PWARedirect } from "@/components/pwa-redirect"
import {getCurrentUser} from "@/lib/session";
import {PollRandomGlobalProblems} from "@/components/poll-random-global-problems";

export default async function Home() {
    const user = await getCurrentUser()
    return (
        <main>
            <Hero />
            <PollRandomGlobalProblems user={user} />
      <FeatureCards />
      <OpenSource />
            <PWARedirect/>
        </main>
    )
}

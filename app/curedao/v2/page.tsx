import { Footer } from '@/app/curedao/components/footer'
import { GradientBlur } from '@/app/curedao/components/gradient-blur'
import { HeroSection } from '@/app/curedao/components/hero-section'
import {ImprovedFDASection} from "@/app/curedao/components/improved-fda-section";
import { JoinSection } from '@/app/curedao/components/join-section'
import { MetricsSection } from '@/app/curedao/components/metrics-section'
import { NavBar } from '@/app/curedao/components/nav-bar'
import { PillarsSection } from '@/app/curedao/components/pillars-section'
import { WhyNowSection } from '@/app/curedao/components/why-now-section'

export default function CureDAOHomeV2() {
  return (
      <main className="min-h-screen bg-[#13111a] overflow-hidden">
          <NavBar/>
          <HeroSection/>

          <div className="relative">
              <GradientBlur
                  className="absolute right-[10vw] w-[60vw] h-[60vh] -translate-y-1/2"
                  variant="default"
              />
              <PillarsSection/>
          </div>

          <div className="relative">
              <GradientBlur
                  className="absolute right-[10vw] w-[60vw] h-[60vh] -translate-y-1/2"
                  variant="default"
              />
              <ImprovedFDASection/>
          </div>

          <div className="relative">
              <GradientBlur
                  className="absolute left-[5vw] w-[50vw] h-[60vh] -translate-y-1/4"
                  variant="blue-purple"
                  rotationDelay="-7s"
              />
              <WhyNowSection/>
          </div>

          <div className="relative">
              <GradientBlur
                  className="absolute right-[5vw] w-[55vw] h-[65vh] -translate-y-1/3"
                  variant="default"
                  rotationDelay="-12s"
              />
              <MetricsSection/>
          </div>

          <div className="relative">
              <GradientBlur
                  className="absolute left-[10vw] w-[60vw] h-[70vh] -translate-y-1/2"
                  variant="blue-purple"
                  rotationDelay="-18s"
              />
              <JoinSection/>
          </div>

          <Footer/>
      </main>
  )
}


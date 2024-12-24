import { NavBar } from '@/app/curedao/components/nav-bar'
import { HeroSection } from '@/app/curedao/components/hero-section'
import { FailedInnovationSection } from '@/app/curedao/components/failed-innovation-section'
import { OpenSourceSection } from '@/app/curedao/components/open-source-section'
import { DemocratizeSection } from '@/app/curedao/components/democratize-section'
import { CollaborationSection } from '@/app/curedao/components/collaboration-section'
import { CollaboratorsSection } from '@/app/curedao/components/collaborators-section'
import { Footer } from '@/app/curedao/components/footer'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#13111a] overflow-hidden">
      <NavBar />
      <HeroSection />
      <FailedInnovationSection />
      <OpenSourceSection />
      <DemocratizeSection />
      <CollaborationSection />
      <CollaboratorsSection />
      
      <div className="container mx-auto px-4 relative">
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/30 backdrop-blur-sm p-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-color-gradient-rainbow-accent">
            Core Open-Source Framework
          </h2>
          <Image
            src="/placeholder.svg"
            alt="CureDAO Framework Diagram"
            width={1200}
            height={800}
            className="w-full h-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
        </div>
      </div>
      
      <Footer />
    </main>
  )
}


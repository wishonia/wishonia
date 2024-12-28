import { CollaborationSection } from '@/app/curedao/components/collaboration-section'
import { CollaboratorsSection } from '@/app/curedao/components/collaborators-section'
import { DemocratizeSection } from '@/app/curedao/components/democratize-section'
import { DiagramSection } from '@/app/curedao/components/diagram-section'
import { FailedInnovationSection } from '@/app/curedao/components/failed-innovation-section'
import { Footer } from '@/app/curedao/components/footer'
import { GradientBlur } from '@/app/curedao/components/gradient-blur'
import { HeroSection } from '@/app/curedao/components/hero-section'
import { NavBar } from '@/app/curedao/components/nav-bar'
import { OpenSourceSection } from '@/app/curedao/components/open-source-section'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#13111a] overflow-hidden">
      <NavBar />
      <HeroSection />

      <div className="relative">
        <GradientBlur 
          className="absolute right-[10vw] w-[60vw] h-[60vh] -translate-y-1/2" 
          variant="default"
        />
        <DiagramSection />
      </div>
      
      <div className="relative">
        <GradientBlur 
          className="absolute left-[5vw] w-[50vw] h-[60vh] -translate-y-1/4"
          variant="blue-purple"
          rotationDelay="-7s"
        />
        <FailedInnovationSection />
      </div>
      
      <div className="relative">
        <GradientBlur 
          className="absolute right-[5vw] w-[55vw] h-[65vh] -translate-y-1/3"
          variant="default"
          rotationDelay="-12s"
        />
        <OpenSourceSection />
      </div>
      
      <div className="relative">
        <GradientBlur 
          className="absolute left-[10vw] w-[60vw] h-[70vh] -translate-y-1/2"
          variant="blue-purple"
          rotationDelay="-18s"
        />
        <DemocratizeSection />
      </div>
      
      <div className="relative">
        <GradientBlur 
          className="absolute right-[15vw] w-[50vw] h-[60vh] -translate-y-1/4"
          variant="default"
          rotationDelay="-24s"
        />
        <CollaborationSection />
      </div>
      
      <div className="relative">
        <GradientBlur 
          className="absolute left-[20vw] w-[55vw] h-[65vh] -translate-y-1/3"
          variant="blue-purple"
          rotationDelay="-30s"
        />
        <CollaboratorsSection />
      </div>

      <Footer />
    </main>
  )
}


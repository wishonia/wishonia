import { Button } from '@/components/ui/button'
import { HeroBanner } from './hero-banner'

export function HeroSection() {
  return (
    <section className="container mx-auto text-center pt-32 px-6">
      <HeroBanner />
      
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
        A Community Committed to <br />
        Realizing the <br />
        <span className="text-color-gradient-rainbow-accent">
          Precision Health of the Future
        </span>
      </h1>
      
      <p className="max-w-3xl mx-auto text-neutral-400 mb-12 text-lg leading-relaxed">
        CureDAO is an alliance of nonprofits, governments, business, and 
        individuals working to discover how millions of factors like foods, drugs, 
        and supplements affect human health.
      </p>
      
      <Button 
        className="relative px-8 py-3 text-lg text-white border-transparent bg-transparent hover:bg-transparent group"
      >
        <span className="relative z-10">Join Us</span>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff4895] via-[#00ffcc] to-[#ff8866] opacity-70 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute inset-[1px] rounded-full bg-[#13111a] z-0"></div>
      </Button>
    </section>
  )
}


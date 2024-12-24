'use client'

import { Button } from '@/components/ui/button'

export function MissionSection() {
  return (
    <section className="container mx-auto text-center pt-32 px-6">
      <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
        Help Us Create a Blueprint for a <br />
        <span className="text-color-gradient-rainbow-accent">
        World Without Disease
        </span>
      </h1>
      
      <p className="max-w-3xl mx-auto text-neutral-400 mb-12 text-lg leading-relaxed">
        We're harnessing humanity's collective intelligence to 
        determine the policies that will most effectively help to help the billions of people 
        suffering from chronic illness.
      </p>
      
      <Button 
        className="relative px-8 py-3 text-lg text-white border-transparent bg-transparent hover:bg-transparent group"
      >
        <span className="relative z-10">Join the Movement</span>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#ff4895] via-[#00ffcc] to-[#ff8866] opacity-70 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute inset-[1px] rounded-full bg-[#13111a] z-0"></div>
      </Button>
    </section>
  )
} 
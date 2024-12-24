'use client'

import { ContributeToBlueprintButton } from './contribute-to-blueprint-button'

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
      
      <ContributeToBlueprintButton />
    </section>
  )
} 
'use client'

import { GitHubEditButton } from './GitHubEditButton'
import { DFDASignPetitionButton } from './DFDASignPetitionButton'

export function PetitionSection() {
  return (
    <div className="mb-16 text-center">
      <h2 className="text-4xl font-black mb-6 font-mono text-black">Show Your Support</h2>
      <p className="text-xl mb-8 text-black">
        Sign the petition to support the Right to Trial Act and help end the suffering of billions of people.
      </p>
      <div className="inline-flex gap-4 justify-center">
        <DFDASignPetitionButton />
        <GitHubEditButton />
      </div>
    </div>
  )
} 
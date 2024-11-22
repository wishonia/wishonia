"use client"

import { DFDASignPetitionButton } from "./DFDASignPetitionButton"
import { GitHubEditButton } from "./GitHubEditButton"

export function PetitionSection() {
  return (
    <div className="mb-16 text-center">
      <h2 className="mb-6 font-mono text-4xl font-black text-black">
        Show Your Support
      </h2>
      <p className="mb-8 text-xl text-black">
        Sign the petition to support the Right to Trial Act and help end the
        suffering of billions of people.
      </p>
      <div className="flex flex-col items-center gap-4">
        <DFDASignPetitionButton />
        <GitHubEditButton />
      </div>
    </div>
  )
}
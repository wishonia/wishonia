'use client'

import { SignPetitionButton } from './SignPetitionButton'
//import { BackToTopButton } from './BackToTopButton'
//import { GitHubEditButton } from './GitHubEditButton'

export function FloatingPetitionButton() {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex gap-4">
      {/* <GitHubEditButton /> */}
      {/* <SignPetitionButton /> */}
      <BackToTopButton />
    </div>
  )
} 
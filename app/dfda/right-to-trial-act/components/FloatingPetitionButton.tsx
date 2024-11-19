'use client'

import { BackToTopButton } from './BackToTopButton'

export function FloatingPetitionButton() {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2">
      {/* <GitHubEditButton /> */}
      {/* <SignPetitionButton /> */}
      <BackToTopButton />
    </div>
  )
} 
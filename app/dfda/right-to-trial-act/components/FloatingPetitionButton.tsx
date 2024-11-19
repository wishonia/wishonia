'use client'

import { SignPetitionButton } from './SignPetitionButton'

export function FloatingPetitionButton() {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <SignPetitionButton />
    </div>
  )
} 
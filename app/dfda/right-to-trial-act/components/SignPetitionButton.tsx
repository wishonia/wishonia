'use client'

import { useSession, signIn } from 'next-auth/react'
import { NeoBrutalistButton } from '@/components/ui/neo-brutalist-button'

export function SignPetitionButton() {
  const { data: session } = useSession()

  const handleClick = async () => {
    if (!session) {
      signIn()
      return
    }
    // TODO: Implement petition signing
    console.log('Signing petition...')
  }

  return (
    <NeoBrutalistButton 
      onClick={handleClick}
      variant="secondary"
    >
      ✒️ Sign Petition
    </NeoBrutalistButton>
  )
} 
'use client'

import { SignPetitionButton } from '@/app/petitions/components/SignPetitionButton'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { checkPetitionSignature } from '@/app/petitions/petitionActions'

const neoBrutalistStyles = {
  button: "border-4 border-black p-4 text-lg font-bold transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black min-w-[200px] min-h-[60px] rounded-none",
  signed: "border-4 border-black p-4 text-lg font-bold bg-pink-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-pink-500 text-white min-w-[200px] min-h-[60px] rounded-none"
}

export function DFDASignPetitionButton() {
  const { data: session } = useSession()
  const [hasSigned, setHasSigned] = useState(false)

  useEffect(() => {
    let mounted = true

    async function checkSignature() {
      if (!session?.user?.id) {
        if (mounted) setHasSigned(false)
        return
      }
      
      try {
        const hasSignature = await checkPetitionSignature('right-to-trial-act')
        if (mounted) setHasSigned(hasSignature)
      } catch (error) {
        console.error('Failed to check signature status:', error)
        if (mounted) setHasSigned(false)
      }
    }

    checkSignature()

    return () => {
      mounted = false
    }
  }, [session?.user?.id])

  return (
    <SignPetitionButton 
      petitionId="right-to-trial-act"
      hasSigned={hasSigned}
      status="ACTIVE"
      className={neoBrutalistStyles.button}
      signedClassName={neoBrutalistStyles.signed}
      onSignatureChange={() => {
        // Toggle the hasSigned state immediately for better UX
        setHasSigned(prev => !prev)
      }}
    />
  )
} 
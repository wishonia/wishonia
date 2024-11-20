'use client'

import { signPetition } from "@/app/petitions/actions"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { LoginPromptButton } from "@/components/LoginPromptButton"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { PetitionStatus } from "@prisma/client"

interface SignPetitionButtonProps {
  petitionId: string
  hasSigned: boolean
  status?: PetitionStatus
}

export function SignPetitionButton({ 
  petitionId, 
  hasSigned,
  status = 'ACTIVE'
}: SignPetitionButtonProps) {
  const { data: session } = useSession()
  const [signing, setSigning] = useState(false)
  const { toast } = useToast()

  if (hasSigned) {
    return <div className="text-green-600 font-medium">✓ You've signed this petition</div>
  }

  if (!session) {
    return <LoginPromptButton buttonText="Sign in to sign this petition" buttonVariant="default" />
  }

  if (status !== 'ACTIVE') {
    return <div className="text-gray-600">This petition is {status.toLowerCase()}</div>
  }

  return (
    <Button
      size="lg"
      disabled={signing}
      onClick={async () => {
        setSigning(true)
        try {
          await signPetition(petitionId)
          toast({
            title: "Petition signed!",
            description: "Thank you for your support. Check your email for next steps.",
          })
        } catch (error) {
          console.error('Failed to sign petition:', error)
          toast({
            title: "Failed to sign petition",
            description: error instanceof Error ? error.message : 'An unexpected error occurred',
            variant: "destructive",
          })
        } finally {
          setSigning(false)
        }
      }}
    >
      {signing ? 'Signing...' : 'Sign this petition'}
    </Button>
  )
} 
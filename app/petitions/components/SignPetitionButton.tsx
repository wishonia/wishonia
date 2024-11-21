'use client'

import { signPetition, unsignPetition } from "@/app/petitions/petitionActions"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { LoginPromptButton } from "@/components/LoginPromptButton"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { PetitionStatus } from "@prisma/client"
import { cn } from "@/lib/utils"

interface SignPetitionButtonProps {
  petitionId: string
  hasSigned: boolean
  status?: PetitionStatus
  className?: string
  signedClassName?: string
  onSignatureChange?: () => void
}

export function SignPetitionButton({ 
  petitionId, 
  hasSigned: initialHasSigned,
  status = 'ACTIVE',
  className,
  signedClassName,
  onSignatureChange
}: SignPetitionButtonProps) {
  const { data: session } = useSession()
  const [signing, setSigning] = useState(false)
  const [hasSigned, setHasSigned] = useState(initialHasSigned)
  const { toast } = useToast()

  if (!session) {
    return <LoginPromptButton buttonText="Sign in to sign this petition" buttonVariant="default" />
  }

  if (status !== 'ACTIVE') {
    return <div className="text-gray-600">This petition is {status.toLowerCase()}</div>
  }

  const handleClick = async () => {
    setSigning(true)
    try {
      if (hasSigned) {
        await unsignPetition(petitionId)
        setHasSigned(false)
        toast({
          title: "Signature removed",
          description: "You have removed your signature from this petition.",
        })
      } else {
        await signPetition(petitionId)
        setHasSigned(true)
        toast({
          title: "Petition signed!",
          description: "Thank you for your support. Check your email for next steps.",
        })
      }
      onSignatureChange?.()
    } catch (error) {
      console.error('Failed to update petition signature:', error)
      setHasSigned(!hasSigned)
      toast({
        title: `Failed to ${hasSigned ? 'remove' : 'add'} signature`,
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: "destructive",
      })
    } finally {
      setSigning(false)
    }
  }

  return (
    <Button
      size="lg"
      disabled={signing}
      variant={hasSigned ? "outline" : "default"}
      className={cn(className, hasSigned && signedClassName)}
      onClick={handleClick}
    >
      {signing ? (hasSigned ? 'Removing...' : 'Signing...') : 
        (hasSigned ? '✓ Remove signature' : 'Sign this petition')}
    </Button>
  )
} 
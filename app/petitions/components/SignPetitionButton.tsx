"use client"

import { useState } from "react"
import { PetitionStatus } from "@prisma/client"
import { useSession } from "next-auth/react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { LoginPromptButton } from "@/components/LoginPromptButton"
import { signPetition, unsignPetition } from "@/app/petitions/petitionActions"

interface SignPetitionButtonProps {
  petitionId: string
  hasSigned: boolean
  status?: PetitionStatus
  className?: string
  signedClassName?: string
  onSignatureChange?: () => void
  buttonVariant?: "default" | "neobrutalist"
}

export function SignPetitionButton({
  petitionId,
  hasSigned: initialHasSigned,
  status = "ACTIVE",
  className,
  signedClassName, 
  onSignatureChange,
  buttonVariant = "default",
}: SignPetitionButtonProps) {
  const { data: session } = useSession()
  const [signing, setSigning] = useState(false)
  const [hasSigned, setHasSigned] = useState(initialHasSigned)
  const { toast } = useToast()

  if (!session) {
    return (
      <LoginPromptButton
        buttonText="Sign in to Show your support"
        buttonVariant={buttonVariant}
      />
    )
  }

  if (status !== "ACTIVE") {
    return (
      <div className="text-gray-600">
        This petition is {status.toLowerCase()}
      </div>
    )
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
          description:
            "Thank you for your support. Check your email for next steps.",
        })
      }
      onSignatureChange?.()
    } catch (error) {
      console.error("Failed to update petition signature:", error)
      setHasSigned(!hasSigned)
      toast({
        title: `Failed to ${hasSigned ? "remove" : "add"} signature`,
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
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
      variant={buttonVariant}
      className={cn(className, hasSigned && signedClassName)}
      onClick={handleClick}
    >
      {signing
        ? hasSigned
          ? "Removing..."
          : "Signing..."
        : hasSigned
          ? "✓ Remove signature"
          : "Show your support"}
    </Button>
  )
}
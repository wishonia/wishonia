"use client"

import { DFDA_PETITION_ID } from "@/lib/constants"
import { SignPetitionButton } from "@/app/petitions/components/SignPetitionButton"

interface DFDASignPetitionButtonProps {
  hasSigned: boolean
}

export function DFDASignPetitionButton({
  hasSigned,
}: DFDASignPetitionButtonProps) {
  return (
    <SignPetitionButton
      petitionId={DFDA_PETITION_ID}
      hasSigned={hasSigned}
      className="h-14 min-w-[200px] px-8 text-lg font-bold"
      signedClassName="bg-green-600 hover:bg-green-700"
      buttonVariant="neobrutalist"
    />
  )
}
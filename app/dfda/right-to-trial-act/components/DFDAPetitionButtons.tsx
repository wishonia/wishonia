"use client"

import { DFDA_PETITION_ID } from "@/lib/constants"
import { PetitionShareButtons } from "@/app/petitions/components/PetitionShareButtons"

import { DFDASignPetitionButton } from "./DFDASignPetitionButton"
import { GitHubEditButton } from "./GitHubEditButton"

interface DFDAPetitionButtonsProps {
  hasSigned: boolean
  userId?: string
}

export function DFDAPetitionButtons({
  hasSigned,
  userId,
}: DFDAPetitionButtonsProps) {
  return (
    <div className="mt-8 flex justify-center">
      <div className="relative inline-block border-4 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none">
        <div className="flex flex-col items-center gap-4">
          <DFDASignPetitionButton hasSigned={hasSigned} />
          <div className="text-center">OR</div>
          <GitHubEditButton />
          <div className="text-center">OR</div>
          <PetitionShareButtons
            petitionId={DFDA_PETITION_ID}
            userId={userId}
            iconsOnly={true}
          />
          <div className="text-center">
            Just do something! 150,000 people are dying today!
            ☠️
          </div>
        </div>
      </div>
    </div>
  )
}

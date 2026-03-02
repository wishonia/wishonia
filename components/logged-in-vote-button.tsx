"use client"

import React from "react"
import { useSession } from "next-auth/react"

import { postVoteData } from "@/lib/api/postVoteData"
import { Button } from "@/components/ui/button"

interface PollProps {
  data: object
  onButtonClick?: () => void
}
export const LoggedInVoteButton: React.FC<PollProps> = ({
  data,
  onButtonClick,
}) => {
  const { data: session } = useSession()
  if (!session?.user) {
    return null
  }
  const handleClick = async () => {
    try {
      await postVoteData()
      if (onButtonClick) {
        onButtonClick()
      }
    } catch (error) {
      console.error("Error posting vote:", error)
    }
  }
  return (
    <Button
      id="logged-in-vote-button"
      onClick={handleClick}
      className="mt-2 rounded-full p-6 text-xl font-semibold hover:border hover:border-black md:p-8"
    >
      Vote
    </Button>
  )
}

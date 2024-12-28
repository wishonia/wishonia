"use client"

import { User } from "next-auth"
import React from "react"

import { Button } from "@/components/ui/button"
import { postVoteData } from "@/lib/api/postVoteData"

interface PollProps {
  user?: User
  data: object
  onButtonClick?: () => void
}
export const LoggedInVoteButton: React.FC<PollProps> = ({
  user,
  data,
  onButtonClick,
}) => {
  if (!user) {
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

"use client"

import React from "react"
import { User } from "next-auth"

import { postVoteData } from "@/lib/api/postVoteData"
import { Button } from "@/components/ui/button"

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
  const handleClick = () => {
    postVoteData()
    if (onButtonClick) {
      onButtonClick()
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

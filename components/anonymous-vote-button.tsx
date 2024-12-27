"use client"

import React, { useState } from "react"
import { User } from "next-auth"

import { Button } from "@/components/ui/button"
import { UserAuthForm } from "@/components/user/user-auth-form"

interface PollProps {
  user?: User
}
export const AnonymousVoteButton: React.FC<PollProps> = ({ user }) => {
  const [showModal, setShowModal] = useState(false)

  if (user) {
    return null
  }

  const handleVoteButtonClick = () => {
    const currentUrl = window.location.href
    localStorage.setItem("returnUrl", currentUrl)
    setShowModal(true)
  }

  return (
    <div id="not-logged-in-container">
      <div id="vote-button">
        <Button
          onClick={handleVoteButtonClick}
          className="mt-2 rounded-full p-6 text-xl font-semibold hover:border hover:border-black md:p-8"
        >
          Vote
        </Button>
      </div>
      <div className="">
        <div className="px-4 pt-4 text-xs">
          It's necessary to sign in to ensure electoral integrity. Robots don't
          get to vote!
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <UserAuthForm callbackUrl={window.location.href} />
        </div>
      )}
    </div>
  )
}

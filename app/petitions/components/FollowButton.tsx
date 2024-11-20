'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { LoginPromptButton } from '@/components/LoginPromptButton'
import { Button } from '@/components/ui/button'
import { followPetition, unfollowPetition } from '../actions'

export function FollowButton({ 
  petitionId, 
  initialFollowing 
}: { 
  petitionId: string
  initialFollowing: boolean 
}) {
  const { data: session } = useSession()
  const [isFollowing, setIsFollowing] = useState(initialFollowing)
  const [isLoading, setIsLoading] = useState(false)

  if (!session) {
    return <LoginPromptButton buttonText="Sign in to follow" />
  }

  const handleToggleFollow = async () => {
    setIsLoading(true)
    try {
      if (isFollowing) {
        await unfollowPetition(petitionId)
      } else {
        await followPetition(petitionId)
      }
      setIsFollowing(!isFollowing)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      onClick={handleToggleFollow}
      disabled={isLoading}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  )
} 
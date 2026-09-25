"use client"

import * as React from "react"
import { Organization } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Heart, Share2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface OrganizationActionsProps {
  organization: Organization
  isOwner: boolean
  isFollowing: boolean
  userId?: string
}

export function OrganizationActions({ 
  organization, 
  isOwner,
  isFollowing,
  userId 
}: OrganizationActionsProps) {
  const [following, setFollowing] = React.useState(isFollowing)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  const handleFollow = async () => {
    if (!userId) {
      router.push('/signin')
      return
    }
    
    setLoading(true)
    try {
      // Add your follow/unfollow API call here
      setFollowing(!following)
    } catch (error) {
      console.error('Error following organization:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      {/* Owners edit the organization inline in OrganizationInfo. */}
      {!isOwner && (
        <Button
          variant={following ? "secondary" : "default"}
          onClick={handleFollow}
          disabled={loading}
        >
          <Heart className={`h-4 w-4 mr-2 ${following ? "fill-current" : ""}`} />
          {following ? "Following" : "Follow"}
        </Button>
      )}
      
      <Button variant="outline" onClick={() => {
        navigator.clipboard.writeText(window.location.href)
      }}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  )
} 
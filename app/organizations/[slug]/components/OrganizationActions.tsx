"use client"

import * as React from "react"
import { Organization } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Heart, Edit, Share2 } from "lucide-react"
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
      router.push('/login')
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
      {isOwner ? (
        <Button 
          variant="outline"
          onClick={() => router.push(`/organizations/${organization.slug}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      ) : (
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
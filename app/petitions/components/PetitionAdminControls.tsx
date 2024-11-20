'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createPetitionUpdate } from "../actions"
import { UpdatesTimeline } from "./UpdatesTimeline"
import { Petition, PetitionStatusUpdate } from "@prisma/client"

type PetitionWithUpdates = Petition & {
  statusUpdates: PetitionStatusUpdate[]
  _count: {
    signatures: number
  }
}

export function PetitionAdminControls({ petition }: { 
  petition: PetitionWithUpdates
}) {
  const [newUpdate, setNewUpdate] = useState('')
  const [posting, setPosting] = useState(false)

  async function postUpdate() {
    if (!newUpdate.trim()) return
    setPosting(true)
    try {
      await createPetitionUpdate(petition.id, newUpdate)
      setNewUpdate('')
    } catch (error) {
      console.error('Failed to post update:', error)
    } finally {
      setPosting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Post an Update</h2>
        <Textarea
          value={newUpdate}
          onChange={(e) => setNewUpdate(e.target.value)}
          placeholder="Share an update about this petition..."
          className="mb-4"
        />
        <Button 
          onClick={postUpdate}
          disabled={posting || !newUpdate.trim()}
        >
          {posting ? 'Posting...' : 'Post Update'}
        </Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Updates Timeline</h2>
        <UpdatesTimeline updates={petition.statusUpdates} />
      </div>
    </div>
  )
} 
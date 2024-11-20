'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { LoginPromptButton } from '@/components/LoginPromptButton'
import { addComment } from '../petitionActions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PetitionComment, User } from "@prisma/client"

type CommentWithUser = PetitionComment & {
  user: {
    name: string | null
    image: string | null
  }
}

export function Comments({ 
  petitionId, 
  initialComments 
}: { 
  petitionId: string
  initialComments: CommentWithUser[]
}) {
  const { data: session } = useSession()
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!newComment.trim()) return
    
    setIsSubmitting(true)
    try {
      const comment = await addComment(petitionId, newComment)
      setComments([comment, ...comments])
      setNewComment('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      
      {session ? (
        <div className="mb-6">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add your comment..."
            className="mb-2"
          />
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </div>
      ) : (
        <div className="mb-6">
          <LoginPromptButton buttonText="Sign in to comment" />
        </div>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {comment.user.image && (
                <img 
                  src={comment.user.image} 
                  alt=""
                  className="w-6 h-6 rounded-full"
                />
              )}
              <span className="font-medium">{comment.user.name}</span>
              <span className="text-gray-500 text-sm">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
} 
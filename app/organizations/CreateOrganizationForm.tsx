'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import {getOrganization} from "@/app/organizations/organizationActions";

interface CreateOrganizationFormProps {
  userId: string
}

export default function CreateOrganizationForm({ userId }: CreateOrganizationFormProps) {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const organization = await getOrganization(url, userId)
      router.push(`/organizations/${organization.slug}`)
    } catch (error) {
      console.error('Error creating/fetching organization:', error)
      // Handle error (e.g., show error message to user)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">
          Organization URL
        </label>
        <Input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="Enter organization URL"
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          'Create Organization'
        )}
      </Button>
    </form>
  )
}

'use client'

import { PetitionStatus } from "@prisma/client"
import { useRouter, useSearchParams } from "next/navigation"

import { Select } from "@/components/ui/select"

export function PetitionFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <div className="space-y-4">
      <Select
        value={searchParams.get('status') || 'all'}
        onValueChange={(value) => {
          const params = new URLSearchParams(searchParams)
          params.set('status', value)
          router.push(`/petitions?${params.toString()}`)
        }}
      >
        <option value="all">All Petitions</option>
        <option value={PetitionStatus.ACTIVE}>Active</option>
        <option value={PetitionStatus.SUCCESSFUL}>Successful</option>
        <option value={PetitionStatus.CLOSED}>Closed</option>
      </Select>

      {/* Add more filters */}
    </div>
  )
} 
'use client'

import React from 'react'
import ConditionSearchAutocomplete from './ConditionSearchAutocomplete'
import { useRouter } from 'next/navigation'

export default function ConditionSearchSection() {
  const router = useRouter()

  return (
    <div className="max-w-xl mb-8">
      <ConditionSearchAutocomplete 
        onConditionSelect={(condition) => {
          router.push(`/dfda/conditions/${condition}`)
        }}
        placeholder="Search for a condition..."
      />
    </div>
  )
} 
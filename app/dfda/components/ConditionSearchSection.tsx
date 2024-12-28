'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import ConditionSearchAutocomplete from './ConditionSearchAutocomplete'

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
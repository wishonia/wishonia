'use client'

import { Progress } from "@/components/ui/progress"

interface PetitionProgressProps {
  current: number
  target: number
}

export function PetitionProgress({ current, target }: PetitionProgressProps) {
  const percentage = Math.min((current / target) * 100, 100)
  
  return (
    <div className="space-y-2">
      <Progress value={percentage} />
      <div className="flex justify-between text-sm text-gray-600">
        <span>{current.toLocaleString()} signatures</span>
        <span>Target: {target.toLocaleString()}</span>
      </div>
    </div>
  )
} 
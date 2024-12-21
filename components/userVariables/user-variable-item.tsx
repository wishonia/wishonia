"use client"

import Link from "next/link"
import { useState } from "react"

import { UserVariable } from "@/types/models/UserVariable"
import { Skeleton } from "@/components/ui/skeleton"
import { MeasurementButton } from "@/components/measurements/measurement-button"
import { cn } from "@/lib/utils"

interface UserVariableItemProps {
  userVariable: UserVariable
}

export function UserVariableItem({ userVariable }: UserVariableItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div 
      className="neobrutalist-container group"
      onClick={() => setIsExpanded(!isExpanded)}
      role="button"
      aria-expanded={isExpanded}
      aria-controls={`variable-actions-${userVariable.id}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setIsExpanded(!isExpanded)
        }
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {userVariable.imageUrl && (
            <img
              src={userVariable.imageUrl}
              alt=""
              aria-hidden="true"
              className="h-10 w-10 rounded-lg object-cover"
            />
          )}
          <span className="text-lg font-semibold">
            {userVariable.name}
          </span>
        </div>
        <span 
          className="font-black transition-transform duration-200" 
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          ▼
        </span>
      </div>

      {/* Expandable Actions */}
      <div 
        id={`variable-actions-${userVariable.id}`}
        className={cn(
          "grid grid-rows-[0fr] transition-all duration-200",
          isExpanded && "grid-rows-[1fr] mt-4"
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-wrap gap-2">
            <MeasurementButton 
              genericVariable={userVariable}
              aria-label={`Record a measurement for ${userVariable.name}`}
            >
              📝 Record a measurement
            </MeasurementButton>

            <Link
              href={`/dfda/userVariables/${userVariable.variableId}`}
              className="neobrutalist-button"
              onClick={(e) => e.stopPropagation()}
              aria-label={`View history for ${userVariable.name}`}
            >
              📊 History
            </Link>

            <Link
              href={`/dfda/userVariables/${userVariable.variableId}/charts`}
              className="neobrutalist-button"
              onClick={(e) => e.stopPropagation()}
              aria-label={`View charts for ${userVariable.name}`}
            >
              📈 Charts
            </Link>

            <Link
              href={`/dfda/userVariables/${userVariable.id}/settings`}
              className="neobrutalist-button"
              onClick={(e) => e.stopPropagation()}
              aria-label={`View settings for ${userVariable.name}`}
            >
              ⚙️ Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

UserVariableItem.Skeleton = function UserVariableItemSkeleton() {
  return (
    <div className="neobrutalist-container" aria-busy="true">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  )
}

"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { claimOrganization } from "@/app/organizations/organizationActions"
import type { ClaimCheck } from "@/lib/organizationClaim"

interface ClaimOrganizationProps {
  organizationId: string
  check: ClaimCheck
}

export function ClaimOrganization({ organizationId, check }: ClaimOrganizationProps) {
  const [message, setMessage] = React.useState(
    check.allowed ? null : check.reason
  )
  const [pending, startTransition] = React.useTransition()
  const router = useRouter()

  const handleClaim = () => {
    startTransition(async () => {
      const result = await claimOrganization(organizationId)
      if (result.allowed) {
        router.refresh()
      } else {
        setMessage(result.reason)
      }
    })
  }

  return (
    <div className="mt-4 flex flex-col items-start gap-2">
      {check.allowed && (
        <Button onClick={handleClaim} disabled={pending}>
          {pending ? "Claiming..." : "Claim this organization"}
        </Button>
      )}
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </div>
  )
}

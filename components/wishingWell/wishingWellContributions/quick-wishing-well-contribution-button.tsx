"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button, ButtonProps } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface QuickLogButtonProps extends ButtonProps {
  wishingWellId: string
}

export function QuickWishingWellContributionButton({
  wishingWellId,
  ...props
}: QuickLogButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onClick() {
    setIsLoading(true)

    const dateToday = new Date()
    dateToday.setHours(0, 0, 0, 0)

    const response = await fetch(
      `/api/wishingWells/${wishingWellId}/wishingWellContributions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: dateToday,
          count: 1,
        }),
      }
    )

    if (!response?.ok) {
      toast({
        title: "Something went wrong.",
        description: "Your contribution was not logged. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        description: "Your contribution has been logged successfully.",
      })
    }

    setIsLoading(false)

    router.refresh()
  }

  return (
    <Button onClick={onClick} disabled={isLoading} {...props}>
      {isLoading ? (
        <Icons.spinner className="h-4 w-4 animate-spin" />
      ) : (
        <Icons.add className="h-4 w-4" />
      )}
    </Button>
  )
}

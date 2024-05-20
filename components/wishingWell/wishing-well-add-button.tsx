"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button, ButtonProps } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface WishingWellAddButtonProps extends ButtonProps {}

export function WishingWellAddButton({ ...props }: WishingWellAddButtonProps) {
  const router = useRouter()

  async function onClick() {
    router.push(`/wish`)
    router.refresh()
  }

  return (
    <>
      <Button onClick={() => onClick()} {...props}>
        <Icons.add className="mr-2 h-4 w-4" />
        New wishing well
      </Button>
    </>
  )
}

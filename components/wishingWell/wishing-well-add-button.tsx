"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { Icons } from "@/components/icons"
import { Button, ButtonProps } from "@/components/ui/button"

type WishingWellAddButtonProps = ButtonProps

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

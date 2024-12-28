"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { Icons } from "@/components/icons"
import { Button, ButtonProps } from "@/components/ui/button"

type GlobalProblemAddButtonProps = ButtonProps

export function GlobalProblemAddButton({
  ...props
}: GlobalProblemAddButtonProps) {
  const router = useRouter()

  async function onClick() {
    router.push(`/globalProblem`)
    router.refresh()
  }

  return (
    <>
      <Button onClick={() => onClick()} {...props}>
        <Icons.add className="mr-2 h-4 w-4" />
        New problem
      </Button>
    </>
  )
}

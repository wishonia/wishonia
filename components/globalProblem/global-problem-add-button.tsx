"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button, ButtonProps } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface GlobalProblemAddButtonProps extends ButtonProps {}

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

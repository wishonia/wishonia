"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button, ButtonProps } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface GlobalSolutionAddButtonProps extends ButtonProps {}

export function GlobalSolutionAddButton({
  ...props
}: GlobalSolutionAddButtonProps) {
  const router = useRouter()

  async function onClick() {
    router.push(`/globalSolution`)
    router.refresh()
  }

  return (
    <>
      <Button onClick={() => onClick()} {...props}>
        <Icons.add className="mr-2 h-4 w-4" />
        New global solution
      </Button>
    </>
  )
}

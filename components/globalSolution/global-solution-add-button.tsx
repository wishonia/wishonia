"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { Icons } from "@/components/icons"
import { Button, ButtonProps } from "@/components/ui/button"

type GlobalSolutionAddButtonProps = ButtonProps

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

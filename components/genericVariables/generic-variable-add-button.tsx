"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { Button, ButtonProps } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface GlobalVariableAddButtonProps extends ButtonProps {}

export function GenericVariableAddButton({
  ...props
}: GlobalVariableAddButtonProps) {
  const router = useRouter()
  async function onClick() {
    router.push(`/dashboard/globalVariables`)
    router.refresh()
  }

  return (
    <>
      <Button onClick={onClick} {...props}>
        <Icons.add className="mr-2 h-4 w-4" />
        Add New Variable
      </Button>
    </>
  )
}

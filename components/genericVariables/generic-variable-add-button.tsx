"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { Icons } from "@/components/icons"
import { Button, ButtonProps } from "@/components/ui/button"

type GlobalVariableAddButtonProps = ButtonProps

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

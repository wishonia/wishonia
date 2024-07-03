"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

import { GlobalVariable } from "@/types/models/GlobalVariable"
import { UserVariable } from "@/types/models/UserVariable"
import { Button, ButtonProps } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface QuickMeasurementButtonProps extends ButtonProps {
  genericVariable: Pick<
    UserVariable | GlobalVariable,
    | "id"
    | "name"
    | "description"
    | "createdAt"
    | "imageUrl"
    | "combinationOperation"
    | "unitAbbreviatedName"
    | "variableCategoryName"
    | "lastValue"
    | "unitName"
  >
}

export function QuickMeasurementButton({
  genericVariable,
  ...props
}: QuickMeasurementButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  async function onClick() {
    setIsLoading(true)

    const dateToday = new Date()
    dateToday.setHours(0, 0, 0, 0)

    const response = await fetch(`/api/dfda/measurements/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startAt: dateToday,
        value: genericVariable.lastValue,
        variableId: genericVariable.name,
        variableCategoryName: genericVariable.variableCategoryName,
        combinationOperation: genericVariable.combinationOperation,
        unitAbbreviatedName: genericVariable.unitAbbreviatedName,
      }),
    })

    if (!response?.ok) {
      toast({
        title: "Something went wrong.",
        description: "Your userVariable was not measured. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        description: "Your userVariable has been measured successfully.",
      })
    }

    setIsLoading(false)

    router.refresh()
  }

  if (!genericVariable) {
    debugger
  }

  return (
    <Button onClick={onClick} disabled={isLoading} {...props}>
      {isLoading ? (
        <Icons.spinner className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <Icons.add className="h-4 w-4" />
          <span>
            {genericVariable.lastValue} {genericVariable.unitAbbreviatedName}
          </span>
        </>
      )}
    </Button>
  )
}

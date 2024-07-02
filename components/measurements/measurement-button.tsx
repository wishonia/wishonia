"use client"

import React, { useState } from "react"
import { ButtonProps } from "react-day-picker"

import { GlobalVariable } from "@/types/models/GlobalVariable"
import { UserVariable } from "@/types/models/UserVariable"
import { Button } from "@/components/ui/button"
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza"
import { Icons } from "@/components/icons"
import { MeasurementsAddForm } from "@/components/measurements/measurements-add-form"

interface MeasurementButtonProps extends ButtonProps {
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
    | "userId"
    | "variableId"
  >
  variant?:
    | "default"
    | "link"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | null
    | undefined
  size?: "default" | "sm" | "lg" | "icon" | null | undefined
  title?: string
}

export function MeasurementButton({
  genericVariable,
  variant,
  size,
  ...props
}: MeasurementButtonProps) {
  const { ref, ...rest } = props // Destructure out `ref` and spread the rest

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [showMeasurementAlert, setShowMeasurementAlert] =
    React.useState<boolean>(false)

  async function onClick() {
    setShowMeasurementAlert(true)
    //router.refresh();
  }

  return (
    <>
      <Button
        onClick={onClick}
        variant={variant}
        size={size}
        title="Click to record a measurement"
        {...rest}
      >
        <Icons.add className="h-4 w-4" />
        {props.title || ""}
      </Button>
      {isFormOpen && (
        <Credenza>
          <MeasurementsAddForm
            genericVariable={genericVariable}
            setShowMeasurementAlert={setShowMeasurementAlert}
          />
        </Credenza>
      )}
      <Credenza
        open={showMeasurementAlert}
        onOpenChange={setShowMeasurementAlert}
      >
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Record a Measurement</CredenzaTitle>
            <CredenzaDescription>
              This will record a {genericVariable.name} measurement.
            </CredenzaDescription>
          </CredenzaHeader>
          <MeasurementsAddForm
            genericVariable={genericVariable}
            setShowMeasurementAlert={setShowMeasurementAlert}
          />
        </CredenzaContent>
      </Credenza>
    </>
  )
}

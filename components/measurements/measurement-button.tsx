"use client"

import { useState } from "react"
import { UserVariable } from "@/types/models/UserVariable"
import { GlobalVariable } from "@/types/models/GlobalVariable"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza"
import { MeasurementsAddForm } from "@/components/measurements/measurements-add-form"

type GenericVariable = Pick<
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

interface MeasurementButtonProps {
  genericVariable: GenericVariable
  className?: string
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
  children?: React.ReactNode
}

export function MeasurementButton({
  genericVariable,
  className,
  children,
  ...props
}: MeasurementButtonProps) {
  const [showMeasurementAlert, setShowMeasurementAlert] = useState<boolean>(false)

  return (
    <>
      <Button 
        className={cn("neobrutalist-button", className)}
        onClick={(e) => {
          e.stopPropagation()
          setShowMeasurementAlert(true)
        }}
        {...props}
      >
        {children}
      </Button>

      <Credenza
        open={showMeasurementAlert}
        onOpenChange={setShowMeasurementAlert}
      >
        <CredenzaContent className="neobrutalist-container">
          <CredenzaHeader>
            <CredenzaTitle className="neobrutalist-title">
              Record a Measurement
            </CredenzaTitle>
            <CredenzaDescription className="neobrutalist-description">
              This will record a {genericVariable.name} measurement.
            </CredenzaDescription>
          </CredenzaHeader>
          <div className="mt-4">
            <MeasurementsAddForm
              genericVariable={genericVariable}
              setShowMeasurementAlert={setShowMeasurementAlert}
            />
          </div>
        </CredenzaContent>
      </Credenza>
    </>
  )
}

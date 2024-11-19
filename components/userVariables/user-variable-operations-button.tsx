"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { UserVariable } from "@/types/models/UserVariable"
import { Button } from "@/components/ui/button"
import {
  Credenza,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { MeasurementsAddForm } from "@/components/measurements/measurements-add-form"

async function deleteUserVariable(userVariableId: number) {
  const response = await fetch(`/api/userVariables/${userVariableId}`, {
    method: "DELETE",
  })

  if (!response?.ok) {
    toast({
      title: "Something went wrong.",
      description: "Your userVariable was not deleted. Please try again.",
      variant: "destructive",
    })
  } else {
    toast({
      description: "Your userVariable has been deleted successfully.",
    })
  }

  return true
}

interface UserVariableOperationsProps {
  userVariable: UserVariable
  children?: React.ReactNode
}

export function UserVariableOperationsButton({
  userVariable,
  children,
}: UserVariableOperationsProps) {
  const router = useRouter()
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)
  const [showMeasurementAlert, setShowMeasurementAlert] =
    React.useState<boolean>(false)
  const [showDropDown, setShowDropDown] = React.useState<boolean>(false)

  return (
    <>
      <DropdownMenu open={showDropDown} onOpenChange={setShowDropDown}>
        <DropdownMenuTrigger>
          {children ? (
            children
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
              <Icons.ellipsis className="h-4 w-4" />
              <span className="sr-only">Open</span>
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="flex cursor-pointer items-center"
            onSelect={() => {
              setShowMeasurementAlert(true)
              setShowDropDown(false)
            }}
          >
            <Icons.add className="mr-2 h-4 w-4" />
            Record Measurement
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              href={`/dfda/userVariables/${userVariable.id}/settings`}
              className="flex w-full"
            >
              <Icons.settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-red-600 focus:text-red-600"
            onSelect={() => {
              setShowDeleteAlert(true)
              setShowDropDown(false)
            }}
          >
            <Icons.trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Alert */}
      <Credenza
        open={showMeasurementAlert}
        onOpenChange={setShowMeasurementAlert}
      >
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Record a Measurement</CredenzaTitle>
            <CredenzaDescription>
              This will record a {userVariable.name} measurement.
            </CredenzaDescription>
          </CredenzaHeader>
          <MeasurementsAddForm
            genericVariable={userVariable}
            setShowMeasurementAlert={setShowMeasurementAlert}
          />
        </CredenzaContent>
      </Credenza>

      {/* Delete Alert */}
      <Credenza open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>
              Are you sure you want to delete this userVariable?
            </CredenzaTitle>
            <CredenzaDescription>
              This action cannot be undone.
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaFooter className="flex flex-col-reverse">
            <CredenzaClose asChild>
              <Button variant="outline">Cancel</Button>
            </CredenzaClose>
            <Button
              onClick={async (
                event: React.MouseEvent<HTMLButtonElement, MouseEvent>
              ) => {
                event.preventDefault()
                setIsDeleteLoading(true)

                const deleted = await deleteUserVariable(userVariable.id)

                if (deleted) {
                  setIsDeleteLoading(false)
                  setShowDeleteAlert(false)
                  router.refresh()
                }
              }}
              disabled={isDeleteLoading}
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleteLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>Delete</span>
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </>
  )
}

"use client"

import { WishingWell } from "@prisma/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import * as React from "react"

import { Icons } from "@/components/icons"
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

import { WishingWellContributionsAddForm } from "./wishingWellContributions/wishing-well-contributions-add-form"

async function deleteWishingWell(wishingWellId: string) {
  const response = await fetch(`/api/wishingWells/${wishingWellId}`, {
    method: "DELETE",
  })

  if (!response?.ok) {
    toast({
      title: "Something went wrong.",
      description: "Your Wishing Well was not deleted. Please try again.",
      variant: "destructive",
    })
  } else {
    toast({
      description: "Your Wishing Well has been deleted successfully.",
    })
  }

  return true
}

interface WishingWellOperationsProps {
  wishingWell: Pick<WishingWell, "id">
  children?: React.ReactNode
}

export function WishingWellOperations({
  wishingWell,
  children,
}: WishingWellOperationsProps) {
  const router = useRouter()
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false)
  const [isDeleteLoading, setIsDeleteLoading] = React.useState<boolean>(false)
  const [showLogAlert, setShowLogAlert] = React.useState<boolean>(false)
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
              setShowLogAlert(true)
              setShowDropDown(false)
            }}
          >
            <Icons.add className="mr-2 h-4 w-4" />
            Add Log
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              href={`/dashboard/wishingWells/${wishingWell.id}/settings`}
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
      <Credenza open={showLogAlert} onOpenChange={setShowLogAlert}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Contribute to Wishing Well</CredenzaTitle>
            <CredenzaDescription>
              This will create an wishing well contribution.
            </CredenzaDescription>
          </CredenzaHeader>
          <WishingWellContributionsAddForm
            wishingWellId={wishingWell.id}
            setShowLogAlert={setShowLogAlert}
          />
        </CredenzaContent>
      </Credenza>

      {/* Delete Alert */}
      <Credenza open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>
              Are you sure you want to delete this wishingWell?
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

                const deleted = await deleteWishingWell(wishingWell.id)

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

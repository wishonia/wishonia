"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { Robot, Trash } from "@phosphor-icons/react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { clearAllChats } from "@/app/actions"

import LoadingSpinner from "./LoadingSpinner"
import { Button } from "./ui/button"
import { useToast } from "./ui/use-toast"

function ClearAllChats({ userId }: { userId: string }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [isRemovePending, startRemoveTransition] = React.useTransition()
  const { toast } = useToast()
  const router = useRouter()
  return (
    <>
      <Button
        variant="outline"
        className="flex items-center justify-between px-2 py-1"
        onClick={() => router.push("/agents")}
      >
        <span>Agents</span>
        <span>
          <Robot size={18} />
        </span>
      </Button>
      <Button
        variant="outline"
        className="flex items-center justify-between px-2 py-1"
        disabled={isRemovePending}
        onClick={() => setDeleteDialogOpen(true)}
      >
        <span>Clear Chat History</span>
        <span>
          <Trash size={18} />
        </span>
      </Button>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all of
              your chat history and remove the chat data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovePending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isRemovePending}
              onClick={(e) => {
                e.preventDefault()
                startRemoveTransition(async () => {
                  const result = await clearAllChats(userId)
                  if (result && "error" in result) {
                    toast({
                      title: "Error",
                      description: result.error,
                      variant: "destructive",
                    })
                    return
                  }
                  setDeleteDialogOpen(false)
                  router.refresh()
                  router.push("/chat")
                  toast({
                    title: "Chat deleted",
                    description: "Your chat has been successfully deleted.",
                    className: "bg-green-500 text-white",
                  })
                })
              }}
              className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600"
            >
              {isRemovePending && <LoadingSpinner />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default ClearAllChats

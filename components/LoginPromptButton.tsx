"use client"

import React, { useEffect, useState } from "react"
import { VisuallyHidden } from "@radix-ui/themes"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserAuthForm } from "@/components/user/user-auth-form"

interface LoginPromptProps {
  buttonText?: string
  buttonVariant?: "outline" | "default" | "neobrutalist"
  buttonSize?: "default" | "sm" | "lg" | "icon"
}

export function LoginPromptButton({
  buttonText = "Sign in",
  buttonVariant = "outline",
  buttonSize = "default",
}: LoginPromptProps) {
  const [open, setOpen] = useState(false)
  const [callbackUrl, setCallbackUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCallbackUrl(window.location.href)
    } else {
      console.error("window is not defined in LoginPrompt")
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            buttonVariants({ variant: buttonVariant, size: buttonSize })
          )}
        >
          {buttonText}
        </button>
      </DialogTrigger>
      <DialogContent className="mx-auto w-[95%] rounded-lg sm:max-w-[425px]">
        <VisuallyHidden>
          <DialogTitle>Sign In</DialogTitle>
        </VisuallyHidden>
        <UserAuthForm callbackUrl={callbackUrl} />
      </DialogContent>
    </Dialog>
  )
}
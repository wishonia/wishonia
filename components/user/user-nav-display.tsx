import React, { useState } from "react"
import { User } from "next-auth"
import { NavItem } from "@/types"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAccountNav } from "./user-account-nav"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { UserAuthForm } from "@/components/user/user-auth-form"
import {VisuallyHidden} from "@radix-ui/themes";

interface UserNavDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">
  avatarNavItems?: NavItem[]
}

export function UserNavDisplay({ user, avatarNavItems }: UserNavDisplayProps) {
  const [open, setOpen] = useState(false)

  if (user.email === null || user.email === undefined) {
      let callbackUrl = undefined;
        if (typeof window !== "undefined") {
            callbackUrl = window.location.href;
        } else {
            console.error("window is not defined in UserNavDisplay");
        }
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            Sign in
          </button>
        </DialogTrigger>
        <DialogContent>
          <VisuallyHidden>
            <DialogTitle>Sign In</DialogTitle>
          </VisuallyHidden>
          <UserAuthForm callbackUrl={callbackUrl} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <UserAccountNav
      user={{
        name: user.name,
        image: user.image,
        email: user.email,
      }}
      avatarNavItems={avatarNavItems}
    />
  )
}
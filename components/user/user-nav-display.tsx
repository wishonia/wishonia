import Link from "next/link"
import { User } from "next-auth"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { UserAccountNav } from "./user-account-nav"
import {NavItem} from "@/types";
import React from "react";

interface UserNavDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">
    avatarNavItems?: NavItem[]
}

export function UserNavDisplay({ user, avatarNavItems }: UserNavDisplayProps) {
  if (user.email === null || user.email === undefined) {
    return (
      <Link
        href="/signin"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        Sign in
      </Link>
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

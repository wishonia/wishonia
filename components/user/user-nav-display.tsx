import React from "react"
import { NavItem } from "@/types"
import { User } from "next-auth"

import { LoginPromptButton } from "../LoginPromptButton"
import { UserAccountNav } from "./user-account-nav"

interface UserNavDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">
  avatarNavItems?: NavItem[]
  buttonVariant?: "outline" | "neobrutalist"
}

export function UserNavDisplay({
  user,
  avatarNavItems,
  buttonVariant,
}: UserNavDisplayProps) {
  if (!user.email) {
    return (
      <LoginPromptButton
        buttonText="Sign in"
        buttonVariant={buttonVariant}
        buttonSize="sm"
      />
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
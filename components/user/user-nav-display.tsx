import React from "react"
import { User } from "next-auth"
import { NavItem } from "@/types"
import { UserAccountNav } from "./user-account-nav"
import { LoginPromptButton } from "../LoginPromptButton"

interface UserNavDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">
  avatarNavItems?: NavItem[]
}

export function UserNavDisplay({ user, avatarNavItems }: UserNavDisplayProps) {
  if (!user.email) {
    return (
      <LoginPromptButton
        buttonText="Sign in"
        buttonVariant="outline"
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
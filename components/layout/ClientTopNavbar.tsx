"use client"

import { useSession } from "next-auth/react"
import TopNavbar from "./topNavbar"

export function ClientTopNavbar() {
  const { data: session } = useSession()
  if (!session?.user) return null
  return (
    <TopNavbar
      user={{
        name: session.user.name,
        image: session.user.image,
        email: session.user.email,
      }}
    />
  )
}

import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"

export async function getUserIdServer() {
  const session = await getServerSession(authOptions)
  return session?.user?.id
}

// Server actions are public endpoints, so they must take the user from the
// session rather than trust an id sent by the client.
export async function requireUserId() {
  const userId = await getUserIdServer()
  if (!userId) {
    throw new Error("You must be signed in")
  }
  return userId
}

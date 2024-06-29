import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"

export async function getUserIdServer() {
  const session = await getServerSession(authOptions)
  return session?.user?.id
}

import { useSession } from "next-auth/react"

export function useUserIdClient() {
  const { data: session } = useSession()
  return session?.user?.id
}

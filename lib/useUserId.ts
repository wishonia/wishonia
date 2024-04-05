import { useSession } from "next-auth/react";
export function useUserId() {
  const { data: session } = useSession();
  return session?.user?.id;
}
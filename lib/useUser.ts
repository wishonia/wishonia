import { useSession } from "next-auth/react";

export function useUser() {
  const { data: session, status } = useSession();

  const isLoaded = status === "authenticated";
  const isSignedIn = !!session;
  const user = isSignedIn ? session.user : null;

  return { isLoaded, isSignedIn, user };
}

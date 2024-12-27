import { PollWarVsCures } from "@/components/pollWarVsCures"
import { PWARedirect } from "@/components/pwa-redirect"
import { getCurrentUser } from "@/lib/session"

export default async function WarVsCuresPage() {
  const user = await getCurrentUser()
  return (
    <main>
      <PollWarVsCures user={user} />
      <PWARedirect />
    </main>
  )
}

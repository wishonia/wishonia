import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"

export default async function SettingsPage() {
  const user = await getCurrentUser()
  const session = await getServerSession(authOptions)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Debug info */}
      <div className="rounded-lg border p-4">
        <h4 className="mb-2 font-medium">Debug Info</h4>
        <pre className="overflow-auto text-xs">
          {JSON.stringify(
            {
              userId: user?.id,
              email: user?.email,
              sessionId: session?.user?.id,
              sessionEmail: session?.user?.email,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  )
}

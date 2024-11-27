import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

import { ConnectionsList } from "./components/connections-list"

export default async function ConnectionsPage() {
  const user = await getCurrentUser()
  const session = await getServerSession(authOptions)

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  try {

    const connectedAccounts = await prisma.account.findMany({
      where: {
        userId: user.id,
      },
    })

    const accountSummary = {
      count: connectedAccounts.length,
      providers: connectedAccounts.map((acc) => acc.provider),
      accountDetails: connectedAccounts.map((acc) => ({
        id: acc.id,
        provider: acc.provider,
        providerAccountId: acc.providerAccountId,
        userId: acc.userId,
        type: acc.type,
      })),
    }

    console.log("Found connected accounts:", accountSummary)

    return (
      <div className="space-y-6">
        <div className="rounded-lg border p-4">
          <h4 className="mb-2 font-medium">Debug Info</h4>
          <pre className="overflow-auto text-xs">
            {JSON.stringify(
              {
                userId: user?.id,
                email: user?.email,
                sessionId: session?.user?.id,
                sessionEmail: session?.user?.email,
                connectedProviders: connectedAccounts.map(
                  (acc) => acc.provider
                ),
              },
              null,
              2
            )}
          </pre>
        </div>

        <div>
          <h3 className="text-lg font-medium">Social Connections</h3>
          <p className="text-sm text-muted-foreground">
            Connect your accounts to enable social sign-in
          </p>
        </div>

        <ConnectionsList connectedAccounts={connectedAccounts} />
      </div>
    )
  } catch (error) {
    console.error("Error fetching connected accounts:", error)
    throw error
  }
}

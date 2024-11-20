import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

import { NotificationPreferences } from "./components/NotificationPreferences"

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      marketingEmails: true,
      newsletterEmails: true,
      unsubscribeFromAll: true,
      petitionFollows: {
        select: {
          petitionId: true,
          notifyOnComment: true,
          notifyOnMilestone: true,
          notifyOnUpdate: true,
          notifyOnSignature: true,
          emailFrequency: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Email Preferences</h1>

      <div className="space-y-8">
        <NotificationPreferences
          userEmail={user.email}
          marketingEmails={user.marketingEmails}
          newsletterEmails={user.newsletterEmails}
          unsubscribeFromAll={user.unsubscribeFromAll}
          userId={user.id}
        />

        <div className="border-t pt-8">
          <h2 className="mb-4 text-xl font-semibold">Petition Notifications</h2>
          <p className="mb-4 text-sm text-gray-600">
            You can manage individual notification settings for each petition
            you follow. Visit a petition's page to update its specific
            notification preferences.
          </p>
        </div>
      </div>
    </div>
  )
}

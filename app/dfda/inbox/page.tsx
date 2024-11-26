import { getServerSession } from "next-auth/next"

import { getUserIdServer } from "@/lib/api/getUserIdServer"
import { authOptions } from "@/lib/auth"

import { ReminderInbox } from "./components/ReminderInbox"

export default async function InboxPage() {
  const session = await getServerSession(authOptions)
  const userId = await getUserIdServer()

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-6 text-2xl font-bold">Reminder Inbox</h1>
      <ReminderInbox userId={userId} session={session} />
    </div>
  )
}

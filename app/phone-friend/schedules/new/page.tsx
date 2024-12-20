import { requireAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NewScheduleForm } from "../../components/NewScheduleForm"
import prisma from "@/lib/prisma"

export default async function NewSchedulePage({
  searchParams
}: {
  searchParams: { phone?: string }
}) {
  // Include the full path with query params in requireAuth
  const fullPath = `/phone-friend/schedules/new${searchParams.phone ? `?phone=${searchParams.phone}` : ''}`
  const session = await requireAuth(fullPath)

  // Get available agents
  const agents = await prisma.agent.findMany({
    where: {
      userId: session.user.id,
      isActive: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  // Get the phone number from the URL query params
  const phoneNumber = searchParams.phone || ''

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Create New Schedule</h1>
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Details</CardTitle>
          </CardHeader>
          <CardContent>
            <NewScheduleForm agents={agents} initialPhoneNumber={phoneNumber} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
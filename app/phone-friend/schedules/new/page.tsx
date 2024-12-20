import { requireAuth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NewScheduleForm } from "../../components/NewScheduleForm"
import prisma from "@/lib/prisma"

export default async function NewSchedulePage() {
  const session = await requireAuth('/phone-friend')

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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Create New Schedule</h1>
      <div className="max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Details</CardTitle>
          </CardHeader>
          <CardContent>
            <NewScheduleForm agents={agents} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
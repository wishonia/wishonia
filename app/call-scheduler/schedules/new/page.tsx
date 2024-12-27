import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NewScheduleForm } from "../../components/NewScheduleForm"
import prisma from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export default async function NewSchedulePage({
  searchParams
}: {
  searchParams: { phone?: string }
}) {
  const fullPath = `/call-scheduler/schedules/new${searchParams.phone ? `?phone=${searchParams.phone}` : ''}`
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect(`/signin?callbackUrl=${fullPath}`)
  }

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
            <NewScheduleForm 
              agents={agents} 
              initialPhoneNumber={phoneNumber} 
              session={session}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
import { requireAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CallScheduleForm } from "../../../components/CallScheduleForm"

interface SettingsPageProps {
  params: {
    personId: string
  }
}

// Get default agent or create it if it doesn't exist
async function getOrCreateDefaultAgent(userId: string) {
  let agent = await prisma.agent.findFirst({
    where: {
      userId,
      name: 'Heartline Assistant',
      isActive: true
    }
  })

  if (!agent) {
    agent = await prisma.agent.create({
      data: {
        name: 'Heartline Assistant',
        description: 'Default check-in assistant',
        isActive: true,
        initialMessage: "Hi, this is Heartline calling to check in. How are you doing today?",
        prompt: "You are a caring and empathetic AI assistant making a daily check-in call.",
        type: 'SUPERAGENT',
        user: {
          connect: {
            id: userId
          }
        }
      }
    })
  }

  return agent
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const session = await requireAuth('/phone-friend')
  
  // Get the default agent first
  const defaultAgent = await getOrCreateDefaultAgent(session.user.id)

  // Get the person and their existing schedules
  const person = await prisma.person.findFirst({
    where: {
      id: params.personId,
      userId: session.user.id
    },
    include: {
      callSchedules: {
        include: {
          agent: true
        }
      }
    }
  })

  if (!person) {
    redirect('/phone-friend/recipients')
  }

  // Get available agents and put default agent first
  const agents = await prisma.agent.findMany({
    where: {
      userId: session.user.id,
      isActive: true
    },
    select: {
      id: true,
      name: true,
      avatar: true
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Call Settings for {person.name}</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* Existing Schedules */}
        <Card>
          <CardHeader>
            <CardTitle>Current Schedules</CardTitle>
          </CardHeader>
          <CardContent>
            {person.callSchedules.length === 0 ? (
              <p className="text-muted-foreground">
                No schedules set up yet. Add your first schedule below.
              </p>
            ) : (
              <div className="space-y-4">
                {person.callSchedules.map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{schedule.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {schedule.cronExpression}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Agent: {schedule.agent.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add New Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <CallScheduleForm 
              personId={person.id}
              agents={agents}
              defaultAgentId={defaultAgent.id}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
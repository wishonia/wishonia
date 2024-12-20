import { requireAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CallScheduleForm } from "../../../components/CallScheduleForm"
import { CallScheduleCard } from "../../../components/CallScheduleCard"
import { Agent } from "@prisma/client"

interface SettingsPageProps {
  params: {
    personId: string
  }
  searchParams: {
    edit?: string
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

export default async function SettingsPage({ params, searchParams }: SettingsPageProps) {
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
          agent: true,
          person: true
        },
        orderBy: {
          createdAt: 'desc'
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
  }) as Agent[]

  // Find the schedule being edited if edit param is present
  const editingSchedule = searchParams.edit 
    ? person.callSchedules.find(s => s.id === searchParams.edit)
    : null

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
                  <CallScheduleCard key={schedule.id} schedule={schedule} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>
              {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CallScheduleForm 
              personId={person.id}
              agents={agents}
              defaultAgentId={defaultAgent.id}
              editingSchedule={editingSchedule || undefined}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
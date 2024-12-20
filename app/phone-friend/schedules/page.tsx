import { requireAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import { PersonCard } from "../components/PersonCard"
import { Person, CallSchedule, Agent } from "@prisma/client"

type ScheduleWithRelations = CallSchedule & {
  person: Person
  agent: Agent
}

type PersonWithSchedules = {
  person: Person
  schedules: ScheduleWithRelations[]
}

export default async function SchedulesPage() {
  const session = await requireAuth('/phone-friend')

  const schedules = await prisma.callSchedule.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      person: true,
      agent: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Group schedules by person
  const schedulesByPerson = schedules.reduce((acc, schedule) => {
    const personId = schedule.person.id
    if (!acc[personId]) {
      acc[personId] = {
        person: schedule.person,
        schedules: []
      }
    }
    acc[personId].schedules.push(schedule)
    return acc
  }, {} as Record<string, PersonWithSchedules>)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Call Schedules</h1>
        <Link href="/phone-friend/schedules/new">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Schedule
          </Button>
        </Link>
      </div>

      {Object.entries(schedulesByPerson).length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              No schedules found. Add your first call schedule to get started.
            </p>
            <Link href="/phone-friend/schedules/new">
              <Button>Add First Schedule</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(schedulesByPerson).map(([personId, { person, schedules }]) => (
            <PersonCard 
              key={personId} 
              person={person} 
              schedules={schedules} 
            />
          ))}
        </div>
      )}
    </div>
  )
} 
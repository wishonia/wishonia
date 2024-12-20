import { requireAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CallScheduleCard } from "../components/CallScheduleCard"
import { UserPlus } from "lucide-react"
import Link from "next/link"

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
  }, {} as Record<string, { person: any, schedules: any[] }>)

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
            <Card key={personId}>
              <CardHeader>
                <CardTitle>{person.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {person.phoneNumber}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <CallScheduleCard key={schedule.id} schedule={schedule} />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 
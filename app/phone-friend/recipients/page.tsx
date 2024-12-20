import { requireAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { PersonSetupForm } from "../components/PersonSetupForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CallSchedule, Person, Agent } from "@prisma/client"

type ScheduleWithRelations = CallSchedule & {
  person: Person;
  agent: Agent;
}

type RecipientGroup = {
  person: Person;
  schedules: ScheduleWithRelations[];
}

export default async function RecipientsPage() {
  const session = await requireAuth('/phone-friend')

  // Get all call schedules for the current user with related person and agent info
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
  const recipientMap = schedules.reduce<Record<string, RecipientGroup>>((acc, schedule) => {
    const personId = schedule.personId
    if (!acc[personId]) {
      acc[personId] = {
        person: schedule.person,
        schedules: []
      }
    }
    acc[personId].schedules.push(schedule)
    return acc
  }, {})

  const recipients = Object.values(recipientMap)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Recipients</h1>
        <Button asChild>
          <Link href="/phone-friend/recipients/new">Add New Recipient</Link>
        </Button>
      </div>

      {recipients.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recipients.map(({ person, schedules }) => (
            <Card key={person.id}>
              <CardHeader>
                <CardTitle>{person.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Phone: {person.phoneNumber}
                  </p>
                  {person.email && (
                    <p className="text-sm text-muted-foreground">
                      Email: {person.email}
                    </p>
                  )}
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Your Scheduled Calls:</h3>
                    {schedules.length > 0 ? (
                      <div className="space-y-2">
                        {schedules.map((schedule) => (
                          <div key={schedule.id} className="text-sm p-2 bg-muted rounded-lg">
                            <p>{schedule.name}</p>
                            <p className="text-muted-foreground">
                              Agent: {schedule.agent.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No scheduled calls
                      </p>
                    )}
                  </div>

                  <div className="mt-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={`/phone-friend/recipients/${person.id}/settings`}>
                        Manage Your Schedules
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              No recipients found. Add your first recipient to get started.
            </p>
            <PersonSetupForm isLoggedIn={true} />
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
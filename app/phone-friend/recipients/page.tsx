import { requireAuth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RecipientList } from "../components/RecipientList"
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
  }) as ScheduleWithRelations[]

  // Group schedules by person
  const recipientMap = schedules.reduce<Record<string, RecipientGroup>>((acc, schedule: ScheduleWithRelations) => {
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

      <RecipientList recipients={recipients} />
    </div>
  )
} 
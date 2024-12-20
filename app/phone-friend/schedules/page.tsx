import { getServerSession } from "next-auth/next"
import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function SchedulesPage() {
  const session = await getServerSession()
  
  if (!session?.user) {
    redirect('/')
  }

  const schedules = await prisma.callSchedule.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      person: {
        select: {
          name: true,
          phoneNumber: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Call Schedules</h1>
        <Link href="/phone-friend/recipients">
          <Button>Add New Schedule</Button>
        </Link>
      </div>

      {schedules.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground mb-4">
              No call schedules found. Add a recipient to create your first schedule.
            </p>
            <Link href="/phone-friend/recipients">
              <Button>Add Recipient</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {schedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardHeader>
                <CardTitle>{schedule.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Recipient: {schedule.person.name}</p>
                  <p>Phone: {schedule.person.phoneNumber}</p>
                  <p>Status: {schedule.enabled ? 'Active' : 'Paused'}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 
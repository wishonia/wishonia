'use client'

import { useState } from 'react'
import { Person, CallSchedule, Agent } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import { CallScheduleCard } from "./CallScheduleCard"
import { EditPersonDialog } from "./EditPersonDialog"

type ScheduleWithRelations = CallSchedule & {
  agent: Agent
  person: Person
}

interface PersonCardProps {
  person: Person
  schedules: ScheduleWithRelations[]
}

export function PersonCard({ person, schedules }: PersonCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{person.name}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {person.phoneNumber}
              {person.timeZone && ` • ${person.timeZone}`}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <CallScheduleCard key={schedule.id} schedule={schedule} />
          ))}
        </div>
      </CardContent>

      <EditPersonDialog
        person={person}
        open={open}
        onOpenChange={setOpen}
      />
    </Card>
  )
} 
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CallSummaryRecipients } from "./CallSummaryRecipients"
import { addCallSummaryRecipient, removeCallSummaryRecipient } from "../actions"
import { NotifyMethod } from "@prisma/client"

interface CallScheduleCardProps {
  schedule: {
    id: string
    name: string
    cronExpression: string
    person: {
      name: string
    }
    calls: Array<{
      id: string
      callSummaryRecipients: Array<{
        id: string
        person: {
          name: string | null
          email: string | null
          phoneNumber: string | null
        }
        notifyBy: NotifyMethod[]
      }>
    }>
  }
}

export function CallScheduleCard({ schedule }: CallScheduleCardProps) {
  return (
    <Card key={schedule.id}>
      <CardHeader>
        <CardTitle>{schedule.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p>Scheduled for: {schedule.cronExpression}</p>
          <p>Calling: {schedule.person.name}</p>
        </div>

        <CallSummaryRecipients
          recipients={schedule.calls[0]?.callSummaryRecipients.map(r => ({
            id: r.id,
            name: r.person.name || '',
            email: r.person.email || undefined,
            phoneNumber: r.person.phoneNumber || undefined,
            notifyBy: r.notifyBy
          })) || []}
          onAddRecipient={async (recipient) => {
            // Here we would first create a Person record, then link it
            // This is simplified - you'll need to add person creation logic
            await addCallSummaryRecipient(schedule.calls[0].id, {
              personId: 'temp-id', // You'll need to create a person first
              notifyBy: recipient.notifyBy as NotifyMethod[]
            })
          }}
          onRemoveRecipient={async (id) => {
            await removeCallSummaryRecipient(id)
          }}
        />
      </CardContent>
    </Card>
  )
} 
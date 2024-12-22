"use client"

import * as React from "react"
import { Event } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface OrganizationEventsProps {
  events: Event[]
  isOwner: boolean
}

export function OrganizationEvents({ events, isOwner }: OrganizationEventsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Events</h2>
        {isOwner && (
          <Button>Add Event</Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {event.description && (
                <p className="text-muted-foreground">{event.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CallSchedule, Person, Agent } from "@prisma/client"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Edit, Trash2, Power, PowerOff } from "lucide-react"
import { deleteSchedule, updateSchedule } from "../actions"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import { PersonSetupForm } from "./PersonSetupForm"
import { CallScheduleCard } from "./CallScheduleCard"

type ScheduleWithRelations = CallSchedule & {
  person: Person;
  agent: Agent;
}

type RecipientGroup = {
  person: Person;
  schedules: ScheduleWithRelations[];
}

interface RecipientListProps {
  recipients: RecipientGroup[]
}

export function RecipientList({ recipients }: RecipientListProps) {
  if (recipients.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground mb-4">
            No recipients found. Add your first recipient to get started.
          </p>
          <PersonSetupForm isLoggedIn={true} />
        </CardContent>
      </Card>
    )
  }

  return (
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
                      <CallScheduleCard key={schedule.id} schedule={schedule} />
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
  )
} 
'use client'

import { CallSchedule, Person, Agent } from "@prisma/client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CallScheduleForm } from "./CallScheduleForm"
import { Session } from "next-auth"
type ScheduleWithRelations = CallSchedule & {
  person: Person;
  agent: Agent;
}

interface EditScheduleDialogProps {
  schedule: ScheduleWithRelations
  agents: Agent[]
  defaultAgentId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  session: Session
}

export function EditScheduleDialog({ 
  schedule,
  agents,
  defaultAgentId,
  open,
  onOpenChange,
  session
}: EditScheduleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Schedule</DialogTitle>
        </DialogHeader>
        <CallScheduleForm 
          personId={schedule.personId}
          agents={agents}
          defaultAgentId={defaultAgentId}
          editingSchedule={schedule}
          onComplete={() => onOpenChange(false)}
          session={session}
        />
      </DialogContent>
    </Dialog>
  )
} 
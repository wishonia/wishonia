'use client'

import { CallSchedule, Person, Agent } from "@prisma/client"
import { MoreVertical, Edit, Trash2, Power, PowerOff } from "lucide-react"
import { Session } from "next-auth"
import { useState } from "react"
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
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { deleteSchedule, updateSchedule } from "../actions"




import { EditScheduleDialog } from "./EditScheduleDialog"


type ScheduleWithRelations = CallSchedule & {
  person: Person;
  agent: Agent;
}

interface CallScheduleCardProps {
  schedule: ScheduleWithRelations
  session: Session
}

export function CallScheduleCard({ schedule, session }: CallScheduleCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteSchedule(session, schedule.id)
      toast.success("Schedule deleted")
    } catch (error) {
      toast.error("Failed to delete schedule")
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const toggleEnabled = async () => {
    setIsLoading(true)
    try {
      await updateSchedule(session, schedule.id, {
        name: schedule.name,
        time: schedule.cronExpression,
        agentId: schedule.agentId,
        enabled: !schedule.enabled
      })
      toast.success(schedule.enabled ? "Schedule paused" : "Schedule resumed")
    } catch (error) {
      toast.error("Failed to update schedule")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.schedule-actions')) {
      return
    }
    setShowEditDialog(true)
  }

  return (
    <>
      <div 
        className="text-sm p-3 bg-muted rounded-lg relative group cursor-pointer hover:bg-muted/80 transition-colors"
        onClick={handleCardClick}
      >
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity schedule-actions">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleEnabled} disabled={isLoading}>
                {schedule.enabled ? (
                  <>
                    <PowerOff className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Power className="h-4 w-4 mr-2" />
                    Resume
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="pr-8">
          <p className="flex items-center gap-2 font-medium">
            {schedule.name}
            {!schedule.enabled && (
              <span className="text-xs bg-muted-foreground/20 text-muted-foreground px-1.5 py-0.5 rounded">
                Paused
              </span>
            )}
          </p>
          <p className="text-muted-foreground mt-1">
            Agent: {schedule.agent.name}
          </p>
        </div>
      </div>

      <EditScheduleDialog 
        schedule={schedule}
        agents={schedule.agent ? [schedule.agent] : []}
        defaultAgentId={schedule.agentId}
        session={session}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <AlertDialog 
        open={showDeleteDialog} 
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this schedule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 
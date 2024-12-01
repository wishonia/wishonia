"use client"

import { useRouter } from "next/navigation"
import { Measurement } from "@/types/models/Measurement"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import {
  Edit,
  Bell,
  LineChart,
  History,
  Settings,
  Link2,
  Trash2,
  GitFork,
} from "lucide-react"

interface MeasurementMenuProps {
  measurement: Measurement
  onEdit?: (measurement: Measurement) => void
  onDelete?: (measurement: Measurement) => void
}

export function MeasurementMenu({
  measurement,
  onEdit,
  onDelete,
}: MeasurementMenuProps) {
  const router = useRouter()

  const handleViewCharts = () => {
    router.push(`/dfda/userVariables/${measurement.variableId}/charts`)
  }

  const handleVariableSettings = () => {
    router.push(`/dfda/userVariables/${measurement.variableId}/settings`)
  }

  const handleAddReminder = () => {
    router.push(`/dfda/trackingReminders?variableId=${measurement.variableId}`)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          aria-label="Open menu"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="grid gap-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onEdit?.(measurement)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Measurement
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleAddReminder}
          >
            <Bell className="mr-2 h-4 w-4" />
            Add Reminder
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleViewCharts}
          >
            <LineChart className="mr-2 h-4 w-4" />
            View Charts
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <History className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleVariableSettings}
          >
            <Settings className="mr-2 h-4 w-4" />
            Variable Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
          >
            <GitFork className="mr-2 h-4 w-4" />
            Relationships
          </Button>
          {measurement.url && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => window.open(measurement.url, '_blank')}
            >
              <Link2 className="mr-2 h-4 w-4" />
              Open URL
            </Button>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-100"
            onClick={() => onDelete?.(measurement)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
} 
'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface GlobalTask {
  id: string
  name: string
  description?: string | null
  status: string
  estimatedHours?: number | null
  complexity?: 'LOW' | 'MEDIUM' | 'HIGH' | null
  childTasks: { child: GlobalTask }[]
}

interface Props {
  task: GlobalTask
  level: number
}

export function TaskTreeNode({ task, level }: Props) {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = task.childTasks.length > 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
      case 'IN_PROGRESS':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100'
      case 'NOT_STARTED':
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'
    }
  }

  const getComplexityColor = (complexity?: 'LOW' | 'MEDIUM' | 'HIGH' | null) => {
    switch (complexity) {
      case 'LOW':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
      case 'MEDIUM':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100'
      case 'HIGH':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'
    }
  }

  return (
    <div className="w-full">
      <Card className={cn(
        "transition-colors hover:shadow-sm",
        level > 0 && "ml-6 mt-3 first:mt-0"
      )}>
        <div className="flex items-start p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "p-1 h-6 w-6 hover:bg-muted",
              !hasChildren && "invisible"
            )}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>

          <div className="flex-1 ml-2">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="font-medium text-foreground">{task.name}</h3>
              {task.description && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      aria-label={`View description for ${task.name}`}
                      title="View description"
                    >
                      <Info size={14} className="text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm text-foreground">{task.description}</p>
                  </PopoverContent>
                </Popover>
              )}
              <Badge variant="secondary" className={cn(
                "font-normal",
                getStatusColor(task.status)
              )}>
                {task.status}
              </Badge>
              {task.complexity && (
                <Badge variant="secondary" className={cn(
                  "font-normal",
                  getComplexityColor(task.complexity)
                )}>
                  {task.complexity}
                </Badge>
              )}
              {task.estimatedHours && (
                <span className="text-sm text-muted-foreground">
                  ~{task.estimatedHours}h
                </span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {isExpanded && hasChildren && (
        <div className="pl-4 border-l border-border ml-4 mt-1">
          {task.childTasks.map(({ child }) => (
            <TaskTreeNode 
              key={child.id} 
              task={child} 
              level={level + 1} 
            />
          ))}
        </div>
      )}
    </div>
  )
} 
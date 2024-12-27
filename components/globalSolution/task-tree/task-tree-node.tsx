'use client'

import { TaskStatus, TaskComplexity } from '@prisma/client'
import { ChevronRight, ChevronDown, Info } from 'lucide-react'
import { useState } from 'react'

import { generateSubtasks } from '@/app/globalSolutions/[globalSolutionId]/tasks/actions'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils'
import { GlobalTaskWithChildren } from '@/types/globalTask'

interface Props {
  task: GlobalTaskWithChildren
  level: number
  globalSolutionId: string
}

export function TaskTreeNode({ task, level, globalSolutionId }: Props) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasChildren = task.childTasks.length > 0

  const handleGenerateSubtasks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await generateSubtasks(task.id, globalSolutionId)
      // Refresh the page to show new tasks
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate subtasks')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: TaskStatus) => {
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

  const getComplexityColor = (complexity: TaskComplexity) => {
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
              
              {/* Generate Subtasks Button */}
              {!hasChildren && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleGenerateSubtasks}
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Subtasks'}
                </Button>
              )}

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
              {task.priority && (
                <Badge variant="outline" className="font-normal">
                  {task.priority}
                </Badge>
              )}
              {task.isAtomic && (
                <Badge variant="secondary" className="font-normal bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100">
                  Atomic
                </Badge>
              )}
              {task.tags && task.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {task.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="font-normal text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {task.estimatedHours && (
                  <span title="Estimated hours">~{task.estimatedHours}h</span>
                )}
                {task.actualHours && (
                  <span title="Actual hours">{task.actualHours}h</span>
                )}
              </div>
              {task.budget && (
                <span className="text-sm text-muted-foreground" title="Budget">
                  ${task.budget}
                </span>
              )}
              {task.deliverable && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      Deliverable
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <p className="text-sm text-foreground">{task.deliverable}</p>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <p className="text-sm text-destructive mt-1 ml-6">{error}</p>
      )}

      {isExpanded && hasChildren && (
        <div className="pl-4 border-l border-border ml-4 mt-1">
          {task.childTasks.map(({ child }) => (
            <TaskTreeNode 
              key={child.id} 
              task={child} 
              level={level + 1}
              globalSolutionId={globalSolutionId}
            />
          ))}
        </div>
      )}
    </div>
  )
} 
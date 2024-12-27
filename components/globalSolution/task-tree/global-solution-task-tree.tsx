'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { getGlobalSolutionTasks, getGlobalSolution } from '@/app/globalSolutions/[globalSolutionId]/tasks/actions'
import { TaskTreeNode } from '@/components/globalSolution/task-tree/task-tree-node'
import GlobalBrainNetwork from '@/components/landingPage/global-brain-network'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { GlobalTaskWithChildren } from '@/types/globalTask'

interface GlobalSolution {
  id: string
  name: string
  // Add other fields as needed
}

interface Props {
  globalSolutionId: string
}

export default function GlobalSolutionTaskTree({ globalSolutionId }: Props) {
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<GlobalTaskWithChildren[]>([])
  const [solution, setSolution] = useState<GlobalSolution | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [solutionResult, tasksResult] = await Promise.all([
          getGlobalSolution(globalSolutionId),
          getGlobalSolutionTasks(globalSolutionId)
        ])

        if ('error' in tasksResult) {
          throw new Error(tasksResult.error)
        }

        if (!solutionResult) {
          throw new Error('Solution not found')
        }

        setSolution(solutionResult)
        setTasks(tasksResult.tasks)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [globalSolutionId])

  if (loading) {
    return (
      <Card className="mx-auto max-w-4xl">
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="w-64 h-64">
            <GlobalBrainNetwork />
          </div>
          <p className="text-lg text-muted-foreground">
            Decomposing solution to atomic tasks...
          </p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-4xl border-destructive">
        <CardContent className="p-6">
          <p className="text-destructive">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!tasks?.length) {
    return (
      <Card className="mx-auto max-w-4xl">
        <CardContent className="p-6">
          <p className="text-muted-foreground">No tasks found for this solution</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="text-2xl">
          Task Breakdown for{' '}
          {solution ? (
            <Link href={`/globalSolutions/${solution.id}`}>
              <Button 
                variant="link" 
                className="px-0 font-semibold hover:underline text-2xl"
              >
                {solution.name}
              </Button>
            </Link>
          ) : (
            'Loading...'
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskTreeNode 
              key={task.id} 
              task={task} 
              level={0}
              globalSolutionId={globalSolutionId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 
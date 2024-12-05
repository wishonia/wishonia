import GlobalSolutionTaskTree from '@/components/globalSolution/task-tree/global-solution-task-tree'
import { requireAuth } from '@/lib/auth'

interface Props {
  params: {
    globalSolutionId: string
  }
}

export default async function GlobalSolutionTasksPage({ params }: Props) {
  await requireAuth(`/globalSolutions/${params.globalSolutionId}/tasks`)
  return (
    <div className="container mx-auto py-8">
      <GlobalSolutionTaskTree globalSolutionId={params.globalSolutionId} />
    </div>
  )
} 
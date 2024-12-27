import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'

import GlobalSolutionTaskTree from '@/components/globalSolution/task-tree/global-solution-task-tree'
import { authOptions } from '@/lib/auth'

interface Props {
  params: {
    globalSolutionId: string
  }
}

export default async function GlobalSolutionTasksPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect(`/signin?callbackUrl=/globalSolutions/${params.globalSolutionId}/tasks`)
  }
  return (
    <div className="container mx-auto py-8">
      <GlobalSolutionTaskTree globalSolutionId={params.globalSolutionId} />
    </div>
  )
} 
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/db"

export default async function GlobalSolutionProblemsPage({
  params: { globalSolutionId },
}: {
  params: { globalSolutionId: string }
}) {
  const globalSolution = await prisma.globalSolution.findUnique({
    where: { id: globalSolutionId },
  })

  const globalProblemSolutions = await prisma.globalProblemSolution.findMany({
    where: {
      globalSolutionId,
    },
    include: {
      globalProblem: true,
    },
  })

  if (!globalSolution) {
    throw new Error("Global Solution not found")
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            Problems Fixed by{" "}
            <Link 
              href={`/globalSolutions/${globalSolution.id}`}
              className="text-primary hover:underline"
            >
              {globalSolution.name}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {globalProblemSolutions.map((gps) => (
            <Link 
              key={gps.globalProblemId} 
              href={`/globalProblems/${gps.globalProblemId}`}
              className="block hover:bg-muted p-4 rounded-lg transition-colors"
            >
              <h3 className="text-lg font-semibold">{gps.globalProblem.name}</h3>
              {gps.globalProblem.description && (
                <p className="text-muted-foreground mt-2">{gps.globalProblem.description}</p>
              )}
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

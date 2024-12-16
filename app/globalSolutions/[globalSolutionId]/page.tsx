import { GlobalSolutionRenderer } from "@/components/globalSolution/GlobalSolutionRenderer"
import { getGlobalSolution } from "./actions"
import { notFound } from "next/navigation"

export default async function GlobalSolutionPage({ 
  params: { globalSolutionId } 
}: { 
  params: { globalSolutionId: string } 
}) {
  const solution = await getGlobalSolution(globalSolutionId)
  
  if (!solution) {
    notFound()
  }

  return <GlobalSolutionRenderer globalSolution={solution} />
}

import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RocketIcon, GearIcon } from "@radix-ui/react-icons"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { getGlobalSolution } from "@/lib/api/globalSolutions"
import { Shell } from "@/components/layout/shell"
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer"

interface GlobalSolutionPageProps {
  params: { globalSolutionId: string }
}

export async function generateMetadata({
  params,
}: GlobalSolutionPageProps): Promise<Metadata> {
  const globalSolution = await getGlobalSolution(params.globalSolutionId)

  return {
    title: globalSolution?.name || "Not Found",
    description: globalSolution?.description,
  }
}

export default async function GlobalSolutionPage({
  params,
}: GlobalSolutionPageProps) {
  const globalSolution = await getGlobalSolution(params.globalSolutionId)

  if (!globalSolution) {
    notFound()
  }

  return (
    <Shell>
      <div className="mb-6 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="gap-2">
              Solution Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/globalSolutions/${params.globalSolutionId}/tasks`}>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <RocketIcon className="h-4 w-4" />
                View Tasks
              </DropdownMenuItem>
            </Link>
            <Link href={`/globalSolutions/${params.globalSolutionId}/settings`}>
              <DropdownMenuItem className="gap-2 cursor-pointer">
                <GearIcon className="h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <MarkdownRenderer
        name={globalSolution.name}
        featuredImage={globalSolution.featuredImage}
        description={globalSolution.description}
        content={globalSolution.content}
      />
    </Shell>
  )
}

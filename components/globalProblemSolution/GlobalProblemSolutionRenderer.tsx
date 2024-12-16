"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer"
import { Share2, Check, GitBranchPlus, Lightbulb, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import type { GlobalProblemSolution, GlobalProblem, GlobalSolution } from "@prisma/client"

interface GlobalProblemSolutionWithRelations extends GlobalProblemSolution {
  globalProblem: GlobalProblem
  globalSolution: GlobalSolution
}

interface GlobalProblemSolutionRendererProps {
  globalProblemSolution: GlobalProblemSolutionWithRelations
}

export function GlobalProblemSolutionRenderer({
  globalProblemSolution,
}: GlobalProblemSolutionRendererProps) {
  const [isCopiedUrl, setIsCopiedUrl] = useState(false)

  const copyUrlToClipboard = () => {
    const url = window.location.href
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsCopiedUrl(true)
        toast({
          title: "Copied URL to clipboard",
          description: "The page URL has been copied to the clipboard.",
        })
        setTimeout(() => setIsCopiedUrl(false), 3000)
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err)
        toast({
          title: "Failed to copy URL",
          description: "An error occurred while copying the URL.",
          variant: "destructive",
        })
      })
  }

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <MarkdownRenderer
            name={globalProblemSolution.name}
            description={globalProblemSolution.description}
            content={globalProblemSolution.content || ""}
            featuredImage={globalProblemSolution.featuredImage}
          />
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solution Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="flex flex-col space-y-2">

                <Link href={`/globalSolutions/${globalProblemSolution.globalSolutionId}`}>
                  <Button variant="outline" className="w-full">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    {globalProblemSolution.globalSolution.name}
                  </Button>
                </Link>

                <Link href={`/globalProblems/${globalProblemSolution.globalProblemId}`}>
                  <Button variant="outline" className="w-full">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    {globalProblemSolution.globalProblem.name}
                  </Button>
                </Link>

                <Link href={`/globalSolutions/${globalProblemSolution.globalSolutionId}/tasks`}>
                  <Button variant="outline" className="w-full">
                    <GitBranchPlus className="mr-2 h-4 w-4" />
                    Task Decomposition
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={copyUrlToClipboard}
                  className="w-full"
                  disabled={isCopiedUrl}
                >
                  {isCopiedUrl ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied URL!
                    </>
                  ) : (
                    <>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Solution
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
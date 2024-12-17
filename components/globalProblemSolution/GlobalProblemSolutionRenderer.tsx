"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer"
import { 
  Share2, 
  Check, 
  GitBranchPlus, 
  Lightbulb, 
  AlertTriangle, 
  ChevronDown,
  Book,
  Clock,
  Users,
  Target,
  Workflow
} from "lucide-react"
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

const SolutionActions = ({ globalProblemSolution, isCopiedUrl, copyUrlToClipboard }: any) => (
  <Card>
    <CardHeader>
      <CardTitle>Solution Actions</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Link href={`/globalSolutions/${globalProblemSolution.globalSolutionId}`}>
          <Button variant="outline" className="w-full h-auto min-h-[40px] whitespace-normal text-left justify-start">
            <Lightbulb className="mr-2 h-4 w-4 shrink-0" />
            <span className="line-clamp-2">{globalProblemSolution.globalSolution.name}</span>
          </Button>
        </Link>

        <Link href={`/globalProblems/${globalProblemSolution.globalProblemId}`}>
          <Button variant="outline" className="w-full h-auto min-h-[40px] whitespace-normal text-left justify-start">
            <AlertTriangle className="mr-2 h-4 w-4 shrink-0" />
            <span className="line-clamp-2">{globalProblemSolution.globalProblem.name}</span>
          </Button>
        </Link>

        <Link href={`/globalSolutions/${globalProblemSolution.globalSolutionId}/tasks`}>
          <Button variant="outline" className="w-full h-auto min-h-[40px] whitespace-normal text-left justify-start">
            <GitBranchPlus className="mr-2 h-4 w-4 shrink-0" />
            <span>View Task Decomposition</span>
          </Button>
        </Link>

        <Button
          variant="outline"
          onClick={copyUrlToClipboard}
          className="w-full h-auto min-h-[40px] whitespace-normal text-left justify-start"
          disabled={isCopiedUrl}
        >
          {isCopiedUrl ? (
            <>
              <Check className="mr-2 h-4 w-4 shrink-0" />
              <span>Copied URL!</span>
            </>
          ) : (
            <>
              <Share2 className="mr-2 h-4 w-4 shrink-0" />
              <span>Share Solution</span>
            </>
          )}
        </Button>
      </div>
    </CardContent>
  </Card>
)

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
    <div className="container mx-auto px-2 sm:px-4 max-w-6xl">
      <div className="grid gap-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Solution: {globalProblemSolution.name}</h1>
          <p className="text-muted-foreground">
            Exploring how {globalProblemSolution.globalSolution.name} addresses {globalProblemSolution.globalProblem.name}
          </p>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Target className="w-5 h-5" />
                Problem Context
              </CardTitle>
              <CardDescription>Understanding the challenge</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/globalProblems/${globalProblemSolution.globalProblemId}`}>
                <Button variant="outline" className="w-full h-auto min-h-[40px] whitespace-normal text-left justify-start">
                  <AlertTriangle className="mr-2 h-4 w-4 shrink-0" />
                  <span className="line-clamp-2">{globalProblemSolution.globalProblem.name}</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Solution Approach
              </CardTitle>
              <CardDescription>Core solution strategy</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/globalSolutions/${globalProblemSolution.globalSolutionId}`}>
                <Button variant="outline" className="w-full h-auto min-h-[40px] whitespace-normal text-left justify-start">
                  <Lightbulb className="mr-2 h-4 w-4 shrink-0" />
                  <span className="line-clamp-2">{globalProblemSolution.globalSolution.name}</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Workflow className="w-5 h-5" />
                Implementation
              </CardTitle>
              <CardDescription>Task breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/globalSolutions/${globalProblemSolution.globalSolutionId}/tasks`}>
                <Button variant="outline" className="w-full h-auto min-h-[40px] whitespace-normal text-left justify-start">
                  <GitBranchPlus className="mr-2 h-4 w-4 shrink-0" />
                  <span>View Task Decomposition</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Content */}
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="overview">
            <AccordionTrigger className="justify-start">
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                Overview
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <div className="prose prose-sm dark:prose-invert">
                  <MarkdownRenderer
                    name={globalProblemSolution.name}
                    description={globalProblemSolution.description}
                    content={globalProblemSolution.content || ""}
                    featuredImage={globalProblemSolution.featuredImage}
                  />
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="implementation">
            <AccordionTrigger className="justify-start">
              <div className="flex items-center gap-2">
                <Workflow className="w-5 h-5" />
                Implementation Details
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Implementation Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/globalSolutions/${globalProblemSolution.globalSolutionId}/tasks`}>
                        <Button variant="outline" className="w-full">
                          <GitBranchPlus className="mr-2 h-4 w-4" />
                          View Full Task Decomposition
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="impact">
            <AccordionTrigger className="justify-start">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Impact & Metrics
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Problem Impact</CardTitle>
                      <CardDescription>How this solution addresses the problem</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/globalProblems/${globalProblemSolution.globalProblemId}`}>
                        <Button variant="outline" className="w-full">
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          View Problem Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Solution Framework</CardTitle>
                      <CardDescription>Core solution approach</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/globalSolutions/${globalProblemSolution.globalSolutionId}`}>
                        <Button variant="outline" className="w-full">
                          <Lightbulb className="mr-2 h-4 w-4" />
                          View Solution Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Share Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Share This Solution
              </CardTitle>
              <CardDescription>
                Share this solution implementation with others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={copyUrlToClipboard}
                className="w-full h-auto min-h-[40px] whitespace-normal text-left justify-start"
                disabled={isCopiedUrl}
              >
                {isCopiedUrl ? (
                  <>
                    <Check className="mr-2 h-4 w-4 shrink-0" />
                    <span>Copied URL!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="mr-2 h-4 w-4 shrink-0" />
                    <span>Share Solution</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Contribute
              </CardTitle>
              <CardDescription>
                Help improve this solution implementation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={`/globalSolutions/${globalProblemSolution.globalSolutionId}/tasks`}>
                <Button variant="outline" className="w-full">
                  <GitBranchPlus className="mr-2 h-4 w-4" />
                  View Tasks & Contribute
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
} 
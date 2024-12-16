"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import MarkdownRenderer from "@/components/markdown/MarkdownRenderer"
import { Clock, Share2, Check, GitBranchPlus, Settings, Globe, BarChart2 } from "lucide-react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"

interface GlobalSolutionRendererProps {
  globalSolution: {
    id: string
    userId: string
    name: string
    description: string | null
    content: string | null
    featuredImage: string | null
    createdAt: Date
    updatedAt: Date
    averageAllocation: number | null
  }
}

export function GlobalSolutionRenderer({
  globalSolution,
}: GlobalSolutionRendererProps) {
  const [isCopiedUrl, setIsCopiedUrl] = useState(false)
  const estimatedReadingTime = Math.ceil((globalSolution.content?.split(" ").length || 0) / 200)

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
            name={globalSolution.name}
            description={globalSolution.description}
            content={globalSolution.content || ""}
            featuredImage={globalSolution.featuredImage}
          />
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Solution Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Link href={`/globalSolutions/${globalSolution.id}/tasks`}>
                  <Button variant="outline" className="w-full">
                    <GitBranchPlus className="mr-2 h-4 w-4" />
                    Task Decomposition
                  </Button>
                </Link>

                <Link href={`/globalSolutions/${globalSolution.id}/globalProblems`}>
                  <Button variant="outline" className="w-full">
                    <Globe className="mr-2 h-4 w-4" />
                    Related Problems
                  </Button>
                </Link>

                <Link href={`/globalSolutions/${globalSolution.id}/results`}>
                  <Button variant="outline" className="w-full">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Impact Results
                  </Button>
                </Link>

                <Link href={`/globalSolutions/${globalSolution.id}/settings`}>
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Solution Settings
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

              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                {estimatedReadingTime} min read
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 
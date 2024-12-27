"use client"

import {  Share2, Check, Lightbulb, Settings, Users, BarChart2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"



interface GlobalProblemRendererProps {
  globalProblem: {
    id: string
    userId: string
    name: string
    description: string | null
    content: string | null
    featuredImage: string | null
    createdAt: Date
    updatedAt: Date
  }
}

export function GlobalProblemRenderer({
  globalProblem,
}: GlobalProblemRendererProps) {
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
            name={globalProblem.name}
            description={globalProblem.description}
            content={globalProblem.content || ""}
            featuredImage={globalProblem.featuredImage}
          />
        </div>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Problem Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Link href={`/globalProblems/${globalProblem.id}/solutions`}>
                  <Button variant="outline" className="w-full">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    View Solutions
                  </Button>
                </Link>

                <Link href={`/globalProblems/${globalProblem.id}/vote`}>
                  <Button variant="outline" className="w-full">
                    <Users className="mr-2 h-4 w-4" />
                    Vote on Solutions
                  </Button>
                </Link>

                <Link href={`/globalProblems/${globalProblem.id}/impact`}>
                  <Button variant="outline" className="w-full">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Impact Analysis
                  </Button>
                </Link>

                <Link href={`/globalProblems/${globalProblem.id}/settings`}>
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Problem Settings
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
                      Share Problem
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
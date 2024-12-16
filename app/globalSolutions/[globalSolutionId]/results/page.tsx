import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function GlobalSolutionResultsPage({
  params: { globalSolutionId },
}: {
  params: { globalSolutionId: string }
}) {
  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Impact Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Impact results and metrics will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 
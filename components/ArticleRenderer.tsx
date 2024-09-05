import { useState } from "react"
import Image from "next/image"
import { Check, Clock, Copy, Folder, Link2, Tag } from "lucide-react"

import { ReportOutput } from "@/lib/agents/researcher/researcher"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { CustomReactMarkdown } from "@/components/CustomReactMarkdown"
import { generateImage } from "@/app/actions"

function GenerateImageButton({
  onClick,
  disabled,
}: {
  onClick: () => void
  disabled: boolean
}) {
  return (
    <Button onClick={onClick} disabled={disabled}>
      Generate Image
    </Button>
  )
}

export default function ArticleRenderer(props: ReportOutput) {
  const [expandedResult, setExpandedResult] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState("")

  const {
    title,
    description,
    content,
    sources,
    tags,
    category,
    readingTime,
    searchResults,
    featuredImage,
  } = props

  async function handleGenerateImage() {
    setIsGeneratingImage(true)
    try {
      const generatedImageUrl = await generateImage(title)
      if (generatedImageUrl) {
        setImageUrl(generatedImageUrl)
      } else {
        setError("Failed to generate image. Please try again.")
      }
    } catch (err) {
      setError("Failed to generate image. Please try again.")
    } finally {
      setIsGeneratingImage(false)
    }
  }

  const copyToClipboard = () => {
    const markdownContent = `
# ${title}

${description}

---

${content}

## Sources

${sources?.map((source) => `- [${source.title}](${source.url})`).join("\n")}
    `.trim()

    navigator.clipboard
      .writeText(markdownContent)
      .then(() => {
        setIsCopied(true)
        toast({
          title: "Copied to clipboard",
          description:
            "The article content has been copied in Markdown format.",
        })
        setTimeout(() => setIsCopied(false), 3000) // Reset after 3 seconds
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
        toast({
          title: "Failed to copy",
          description: "An error occurred while copying the content.",
          variant: "destructive",
        })
      })
  }

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <Separator className="mx-auto my-4 w-[90%]" />
          <CardContent>
            <CustomReactMarkdown>{content}</CustomReactMarkdown>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Article Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Folder className="h-4 w-4"/>
                <span>{category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4"/>
                <span>{readingTime} min read</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Tag className="h-4 w-4"/>
                {tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                    onClick={copyToClipboard}
                    className="mt-2"
                    disabled={isCopied}
                >
                  {isCopied ? (
                      <>
                        <Check className="mr-2 h-4 w-4"/>
                        Copied!
                      </>
                  ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4"/>
                        Copy as Markdown
                      </>
                  )}
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <GenerateImageButton
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                />
                {imageUrl && (
                    <div className="mb-4">
                      <Image
                          src={imageUrl}
                          alt={title || "Generated image"}
                          width={1024}
                          height={1024}
                          className="h-auto w-full rounded-lg"
                      />
                    </div>
                )}
                {error && (
                    <CardFooter>
                      <p className="text-red-500">{error}</p>
                    </CardFooter>
                )}
              </div>

            </CardContent>
          </Card>

          <Card>
          <CardHeader>
              <CardTitle>Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {sources?.map((source, index) => (
                  <li key={index}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-500 hover:underline"
                    >
                      <Link2 className="h-4 w-4" />
                      <span>{source.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Related Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          {searchResults?.map((result, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-lg font-semibold">
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {result.title}
                </a>
              </h3>
              {result.publishedDate && (
                <p className="text-sm text-muted-foreground">
                  Published on:{" "}
                  {new Date(result.publishedDate).toLocaleDateString()}
                </p>
              )}
              <p className="mt-1">
                {expandedResult === result.id
                  ? result.text
                  : `${result.text.slice(0, 150)}...`}
                {result.text.length > 150 && (
                  <button
                    onClick={() =>
                      setExpandedResult(
                        expandedResult === result.id ? null : result.id
                      )
                    }
                    className="ml-2 text-blue-500 hover:underline"
                  >
                    {expandedResult === result.id ? "Show less" : "Show more"}
                  </button>
                )}
              </p>
              {index < searchResults.length - 1 && (
                <Separator className="my-4" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

import { useState } from "react"
import Image from "next/image"
import { Check, Clock, Copy, Folder, Tag, Loader2, Share2, Twitter, Facebook, Linkedin } from "lucide-react"

import {ArticleWithRelations} from "@/lib/agents/researcher/researcher"
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
import { deleteArticle } from "@/app/researcher/researcherActions"
import { useRouter } from "next/navigation"

import {generateImage} from "@/app/researcher/researcherActions";
import { UrlDisplay } from "./article/UrlDisplay"

function GenerateImageButton({
  onClick,
  disabled,
}: {
  onClick: () => void
  disabled: boolean
}) {
  return (
    <Button onClick={onClick} disabled={disabled} variant="outline" >
      {disabled ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        "Generate Image"
      )}
    </Button>
  )
}

export default function ArticleRenderer({
  article,
  currentUserId
}: {
  article: ArticleWithRelations,
  currentUserId?: string
}) {
  const router = useRouter();
  const [expandedResult, setExpandedResult] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [isCopiedUrl, setIsCopiedUrl] = useState(false)

  const {
    title,
    description,
    content,
    sources,
    tags,
    category,
    searchResults,
    featuredImage,
    userId,
  } = article

  const readingTime = Math.ceil(content.split(' ').length / 200)

  async function handleGenerateImage() {
    setIsGeneratingImage(true)
    try {
      const generatedImageUrl = await generateImage(title, article.id)
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

  const copyUrlToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setIsCopiedUrl(true)
        toast({
          title: "Copied URL to clipboard",
          description:
            "The article URL has been copied to the clipboard.",
        })
        setTimeout(() => setIsCopiedUrl(false), 3000) // Reset after 3 seconds
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

  const shareToTwitter = () => {
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, "_blank");
  }

  const shareToFacebook = () => {
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, "_blank");
  }

  const shareToLinkedIn = () => {
    const url = window.location.href;
    const linkedInUrl = `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    window.open(linkedInUrl, "_blank");
  }

  // Add this function to handle article deletion
  async function handleDeleteArticle() {
    if (!currentUserId) {
      toast({
        title: "Please login to delete articles",
        description: "You must be logged in to delete articles.",
        variant: "destructive",
      });
      return;
    }
    if (confirm("Are you sure you want to delete this article?")) {
      try {
        await deleteArticle(title, currentUserId);
        toast({
          title: "Article deleted",
          description: "The article has been successfully deleted.",
        });
        router.push("/"); // Redirect to home page after deletion
      } catch (error) {
        console.error("Failed to delete article:", error);
        toast({
          title: "Failed to delete article",
          description: "An error occurred while deleting the article.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          {featuredImage && (
            <div className="mx-auto my-4 w-[90%]">
              <Image
                src={featuredImage}
                alt={`Featured image for ${title}`}
                width={1024}
                height={1024}
                className="h-auto w-full rounded-lg"
              />
            </div>
          )}
          <Separator className="mx-auto my-4 w-[90%]" />
          <CardContent>
            <CustomReactMarkdown>{content}</CustomReactMarkdown>
          </CardContent>
          {currentUserId === userId && (
            <CardFooter>
              <Button variant="destructive" onClick={handleDeleteArticle}>
                Delete Article
              </Button>
            </CardFooter>
          )}
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Article Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Folder className="h-4 w-4"/>
                <span>{category?.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4"/>
                <span>{readingTime} min read</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Tag className="h-4 w-4"/>
                {tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag.name}
                    </Badge>
                ))}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                    variant="outline" 
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
                <Button
                    variant="outline" 
                    onClick={copyUrlToClipboard}
                    className="mt-2"
                    disabled={isCopiedUrl}
                >
                  {isCopiedUrl ? (
                      <>
                        <Check className="mr-2 h-4 w-4"/>
                        Copied URL!
                      </>
                  ) : (
                      <>
                        <Share2 className="mr-2 h-4 w-4"/>
                        Copy Sharing URL
                      </>
                  )}
                </Button>
              </div>
              <div className="flex space-x-4 mt-2">
                <Button 
                  variant="outline" 
                  onClick={shareToTwitter}
                  aria-label="Share to Twitter"
                >
                  <Twitter className="mr-2 h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={shareToFacebook}>
                  <Facebook className="mr-2 h-4 w-4" />  
                </Button>
                <Button variant="outline" onClick={shareToLinkedIn}>
                  <Linkedin className="mr-2 h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col space-y-2">
                <GenerateImageButton
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                />
                {imageUrl && (
                    <div className="mt-2">
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
              <div className="space-y-4">
                {sources?.map((source, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-2">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline font-medium break-words"
                        >
                          {source.title}
                        </a>
                        <UrlDisplay url={source.url} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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
                  className="text-blue-500"
                >
                  {result.title}
                </a>
              </h3>
              <UrlDisplay url={result.url} />
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
                    className="ml-2"
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

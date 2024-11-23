"use client"

import { useState } from "react"
import {
  CheckIcon,
  CopyIcon,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ShareButtonsProps {
  petitionId: string
  userId?: string
  iconsOnly?: boolean
}

export function PetitionShareButtons({
  petitionId,
  userId,
  iconsOnly = false,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  let referralUrl = `${process.env.NEXT_PUBLIC_APP_URL}/petitions/${petitionId}`
  if (userId) {
    referralUrl += `?ref=${userId}`
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`,
  }

  const shareButtons = [
    {
      icon: <TwitterIcon className="h-4 w-4" />,
      text: "Twitter",
      tooltip: "Share on Twitter",
      onClick: () => window.open(shareLinks.twitter, "_blank"),
    },
    {
      icon: <FacebookIcon className="h-4 w-4" />,
      text: "Facebook",
      tooltip: "Share on Facebook",
      onClick: () => window.open(shareLinks.facebook, "_blank"),
    },
    {
      icon: <LinkedinIcon className="h-4 w-4" />,
      text: "LinkedIn",
      tooltip: "Share on LinkedIn",
      onClick: () => window.open(shareLinks.linkedin, "_blank"),
    },
    {
      icon: copied ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      ),
      text: copied ? "Copied!" : "Copy Link",
      tooltip: "Copy link to clipboard",
      onClick: handleCopy,
    },
  ]

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-center">
        Share to help us end the suffering of billions of people
      </p>

      <div className="inline-flex flex-wrap justify-center gap-2">
        <TooltipProvider>
          {shareButtons.map((button, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant="neobrutalist"
                  size="sm"
                  onClick={button.onClick}
                >
                  <span className={iconsOnly ? "" : "mr-2"}>{button.icon}</span>
                  {!iconsOnly && button.text}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{button.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  )
}
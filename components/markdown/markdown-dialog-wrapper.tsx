"use client"

import { WishingWell, GlobalProblem, GlobalProblemSolution } from "@prisma/client"

import MarkdownRendererForItem from "@/components/markdown/MarkdownRendererForItem"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

interface MarkdownDialogWrapperProps {
  item: WishingWell | GlobalProblem | GlobalProblemSolution
  children: React.ReactNode
  className?: string
}

export function MarkdownDialogWrapper({
  item,
  children,
  className = "cursor-pointer",
}: MarkdownDialogWrapperProps) {
  return (
    <Dialog defaultOpen={false}>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-full overflow-auto rounded-lg sm:max-w-[600px]">
        <MarkdownRendererForItem item={item} />
      </DialogContent>
    </Dialog>
  )
} 
import { Metadata } from "next"
import { notFound } from "next/navigation"

import {getGlobalWishingWell} from "@/lib/api/wishingWells"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { WishingWellOperations } from "@/components/wishingWell/wishing-well-operations"
import { Icons } from "@/components/icons"
import { Shell } from "@/components/layout/shell"
import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import MarkdownRendererForItem from "@/components/MarkdownRendererForItem";

interface WishingWellPageProps {
  params: { wishingWellId: string }
}

export async function generateMetadata({
  params,
}: WishingWellPageProps): Promise<Metadata> {

  const wishingWell = await getGlobalWishingWell(params.wishingWellId)

  return {
    title: wishingWell?.name || "Not Found",
    description: wishingWell?.description,
  }
}

export default async function WishingWellPage({
  params,
}: WishingWellPageProps) {


  const wishingWell = await getGlobalWishingWell(params.wishingWellId)

  if (!wishingWell) {
    notFound()
  }

  return (
    <Shell>
{/*      <DashboardHeader
        heading={`${wishingWell.name}`}
        text={wishingWell.description}
      >
        <div className="flex flex-col items-stretch gap-2 md:items-end">
          <WishingWellOperations
            wishingWell={{
              id: wishingWell.id,
            }}
          >
            <div
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              <Icons.down className="mr-2 h-4 w-4" />
              Actions
            </div>
          </WishingWellOperations>
        </div>
      </DashboardHeader>*/}
      <MarkdownRendererForItem item={wishingWell}></MarkdownRendererForItem>
    </Shell>
  )
}

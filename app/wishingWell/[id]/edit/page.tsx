import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { prisma } from "@/lib/prisma"

import { WishingWellEditForm } from "./components/wishing-well-edit-form"

interface WishingWellEditPageProps {
  params: {
    id: string
  }
}

export default async function WishingWellEditPage({ params }: WishingWellEditPageProps) {
  const session = await getServerSession()
  
  if (!session?.user) {
    notFound()
  }

  const wishingWell = await prisma.wishingWell.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      name: true,
      description: true,
      content: true,
      images: true,
      featuredImage: true,
      userId: true,
    },
  })

  if (!wishingWell || wishingWell.userId !== session.user.id) {
    notFound()
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Edit WishingWell</h1>
          <p className="text-muted-foreground">
            Update your WishingWell&apos;s details and content.
          </p>
        </div>
        
        <WishingWellEditForm wishingWell={wishingWell} />
      </div>
    </div>
  )
} 
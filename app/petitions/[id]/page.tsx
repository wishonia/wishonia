import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { SignPetitionButton } from "../components/SignPetitionButton"
import { ShareButtons } from "../components/ShareButtons"
import { Comments } from "../components/Comments"
import { FollowButton } from "../components/FollowButton"
import { notFound } from "next/navigation"
import { RepresentativeMessaging } from "../components/RepresentativeMessaging"
import { Suspense } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'

const defaultMessageTemplate = `Dear [REP_NAME],

As your constituent, I am writing to bring your attention to [PETITION_TITLE]. This issue is important to me and many other constituents in your district.

I urge you to take action on this matter.

Sincerely,
[NAME]`

const defaultCallScript = `Hello, my name is [NAME] and I'm a constituent calling about [PETITION_TITLE].

I'm calling to urge [REP_NAME] to take action on this important issue.

This matters to me because it affects our community directly.

Thank you for your time and for passing along my message.`

export default async function PetitionPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const petition = await prisma.petition.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { signatures: true } },
      creator: { select: { name: true } },
      comments: {
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, image: true }
          }
        }
      }
    }
  })

  if (!petition) {
    notFound()
  }

  const [hasUserSigned, isFollowing] = await Promise.all([
    session?.user?.id ? prisma.petitionSignature.findUnique({
      where: {
        petitionId_userId: {
          petitionId: petition.id,
          userId: session.user.id,
        }
      }
    }) : null,
    session?.user?.id ? prisma.petitionFollow.findUnique({
      where: {
        petitionId_userId: {
          petitionId: petition.id,
          userId: session.user.id,
        }
      }
    }) : null
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {petition.imageUrl && (
          <img 
            src={petition.imageUrl} 
            alt={petition.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        
        <h1 className="text-4xl font-bold mb-4">{petition.title}</h1>
        <div className="flex items-center gap-4 text-gray-600 mb-8">
          <span>Created by {petition.creator.name}</span>
          <span>{petition._count.signatures} signatures</span>
        </div>

        <div className="prose max-w-none dark:prose-invert mb-8">
          <MDXRemote source={petition.content} />
        </div>

        <div className="flex items-center gap-4 mb-8">
          <SignPetitionButton 
            petitionId={petition.id}
            hasSigned={!!hasUserSigned}
          />
          <FollowButton
            petitionId={petition.id}
            initialFollowing={!!isFollowing}
          />
        </div>

        {hasUserSigned && (
          <>
            <ShareButtons 
              petitionId={petition.id}
              userId={session!.user.id}
            />
            
            <div className="mt-8">
              <RepresentativeMessaging
                petitionTitle={petition.title}
                defaultMessageTemplate={petition.messageTemplate || defaultMessageTemplate}
                defaultCallScript={petition.callScript || defaultCallScript}
              />
            </div>
          </>
        )}

        <Suspense fallback={<LoadingSpinner />}>
          <Comments
            petitionId={petition.id}
            initialComments={petition.comments}
          />
        </Suspense>
      </div>
    </div>
  )
} 

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const petition = await prisma.petition.findUnique({
    where: { id: params.id },
    select: { 
      title: true, 
      summary: true 
    }
  })

  if (!petition) return {}

  return {
    title: petition.title,
    description: petition.summary,
    openGraph: {
      title: petition.title,
      description: petition.summary,
      type: 'website'
    }
  }
} 
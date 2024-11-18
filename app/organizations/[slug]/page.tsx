import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import OrganizationInfo from '../[slug]/OrganizationInfo'
import { getServerSession } from 'next-auth/next'
import { authOptions } from "@/lib/auth"

export default async function OrganizationPage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  const organization = await prisma.organization.findUnique({
    where: { slug: params.slug },
    include: { owner: true }
  })

  if (!organization) {
    notFound()
  }

  const isOwner = session?.user?.id === organization.ownerId

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{organization.name}</h1>
      <OrganizationInfo organization={organization} isOwner={isOwner} />
    </div>
  )
}

import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"

import { prisma } from "@/lib/prisma"

import { PetitionAdminControls } from "../../components/PetitionAdminControls"

export default async function PetitionAdminPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  const petition = await prisma.petition.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { signatures: true } },
      milestones: true,
      statusUpdates: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!petition || petition.creatorId !== session.user.id) {
    redirect('/petitions')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Petition</h1>
      <PetitionAdminControls petition={petition} />
    </div>
  )
} 
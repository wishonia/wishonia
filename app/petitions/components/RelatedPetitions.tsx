import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Petition, PetitionStatus } from "@prisma/client"

type PetitionWithCount = Petition & {
  _count: {
    signatures: number
  }
}

export async function RelatedPetitions({ 
  currentPetitionId, 
  categoryId 
}: { 
  currentPetitionId: string
  categoryId?: string 
}) {
  const relatedPetitions = await prisma.petition.findMany({
    where: {
      AND: [
        { id: { not: currentPetitionId } },
        categoryId ? { categoryId } : {},
        { status: PetitionStatus.ACTIVE }
      ]
    },
    include: {
      _count: {
        select: { signatures: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 3
  })

  if (relatedPetitions.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Related Petitions</h2>
      <div className="grid gap-4">
        {relatedPetitions.map((petition) => (
          <Link 
            key={petition.id}
            href={`/petitions/${petition.id}`}
            className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <h3 className="font-medium">{petition.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {petition._count.signatures} signatures
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
} 
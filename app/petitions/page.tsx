import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { LoginPromptButton } from "@/components/LoginPromptButton"

export default async function PetitionsPage() {
  const session = await getServerSession()
  const petitions = await prisma.petition.findMany({
    include: {
      _count: {
        select: { signatures: true }
      },
      creator: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Active Petitions</h1>
        {session?.user ? (
          <Link href="/petitions/create">
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Create Petition
            </Button>
          </Link>
        ) : (
          <LoginPromptButton 
            buttonText="Sign in to create petition" 
            buttonVariant="default"
          />
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {petitions.map((petition) => (
          <Link 
            key={petition.id} 
            href={`/petitions/${petition.id}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            {petition.imageUrl && (
              <img 
                src={petition.imageUrl} 
                alt={petition.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{petition.title}</h2>
            <p className="text-gray-600 mb-4">{petition.summary}</p>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{petition._count.signatures} signatures</span>
              <span>Created by {petition.creator.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 
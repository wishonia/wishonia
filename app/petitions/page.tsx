import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { LoginPromptButton } from "@/components/LoginPromptButton"
import { Card, CardContent } from "@/components/ui/card"

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
    <div className="container space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Active Petitions</h1>
        {session?.user ? (
          <Link href="/petitions/create">
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
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
      
      <div className="space-y-6">
        {petitions.map((petition) => (
          <Link 
            key={petition.id} 
            href={`/petitions/${petition.id}`}
          >
            <Card className="hover:bg-muted/50 transition-colors">
              <div className="flex flex-col md:flex-row">
                {petition.imageUrl && (
                  <div className="md:w-1/3">
                    <img 
                      src={petition.imageUrl} 
                      alt={petition.title}
                      className="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                    />
                  </div>
                )}
                <CardContent className={`flex-1 ${petition.imageUrl ? "pt-4 md:pt-6" : "pt-6"}`}>
                  <h2 className="text-2xl font-semibold mb-3">{petition.title}</h2>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{petition.summary}</p>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{petition._count.signatures} signatures</span>
                    <span>Created by {petition.creator.name}</span>
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
} 
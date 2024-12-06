import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { AnalyticsCharts } from "./components/AnalyticsCharts"

export default async function PetitionAnalyticsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession()
  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  const petition = await prisma.petition.findUnique({
    where: { id: params.id },
    include: {
      signatures: {
        orderBy: { signedAt: 'asc' },
        select: {
          signedAt: true,
          referralSource: true,
          referrer: {
            select: { name: true }
          }
        }
      },
      _count: {
        select: { signatures: true }
      }
    }
  })

  if (!petition || petition.creatorId !== session.user.id) {
    redirect('/petitions')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Petition Analytics</h1>
      <div className="grid gap-8">
        <Card className="p-6">
          <AnalyticsCharts data={petition} />
        </Card>
      </div>
    </div>
  )
} 
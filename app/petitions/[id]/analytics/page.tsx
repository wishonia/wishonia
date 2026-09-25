import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"

import { ReferralSourcesChart, SignaturesOverTimeChart } from "./components/AnalyticsCharts"

export default async function PetitionAnalyticsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
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

  // Calculate signatures by day
  const signaturesByDay = petition.signatures.reduce((acc: Record<string, number>, sig) => {
    const day = sig.signedAt.toISOString().split('T')[0]
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {})

  const dailyData = Object.entries(signaturesByDay).map(([date, count]) => ({
    date,
    signatures: count
  }))

  // Calculate referral sources
  const referralSources = petition.signatures.reduce((acc: Record<string, number>, sig) => {
    const source = sig.referralSource?.toLowerCase() || 'direct'
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {})

  const referralData = Object.entries(referralSources).map(([source, count]) => ({
    name: source,
    value: count
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Petition Analytics</h1>

      <div className="grid gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Signatures Over Time</h2>
          <SignaturesOverTimeChart data={dailyData} />
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Referral Sources</h2>
          <ReferralSourcesChart data={referralData} />
        </Card>
      </div>
    </div>
  )
} 
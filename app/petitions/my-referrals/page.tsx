import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"

export default async function MyReferralsPage() {
  const session = await getServerSession()
  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  const referrals = await prisma.petitionSignature.groupBy({
    by: ['petitionId'],
    where: {
      referrerId: session.user.id,
    },
    _count: {
      _all: true
    }
  })

  const petitionsWithReferrals = await prisma.petition.findMany({
    where: {
      id: {
        in: referrals.map(r => r.petitionId)
      }
    },
    include: {
      _count: {
        select: { 
          signatures: true 
        }
      },
      signatures: {
        where: {
          referrerId: session.user.id
        },
        include: {
          user: {
            select: {
              name: true,
              image: true
            }
          }
        },
        orderBy: {
          signedAt: 'desc'
        }
      }
    }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Petition Referrals</h1>
      
      <div className="grid gap-8">
        {petitionsWithReferrals.map((petition) => (
          <Card key={petition.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Link 
                  href={`/petitions/${petition.id}`}
                  className="text-xl font-semibold hover:text-blue-600"
                >
                  {petition.title}
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  {petition.signatures.length} referrals out of {petition._count.signatures} total signatures
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium">Share your referral link:</p>
                <input
                  readOnly
                  className="w-96 p-2 text-sm bg-gray-50 rounded border mt-1"
                  value={`${process.env.NEXT_PUBLIC_APP_URL}/petitions/${petition.id}?ref=${session.user.id}`}
                  onClick={e => e.currentTarget.select()}
                />
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium mb-3">Recent Referrals</h3>
              <div className="space-y-2">
                {petition.signatures.map((signature) => (
                  <div key={signature.id} className="flex items-center gap-3 text-sm">
                    {signature.user.image && (
                      <img 
                        src={signature.user.image} 
                        alt="" 
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span className="font-medium">{signature.user.name}</span>
                    <span className="text-gray-500">
                      signed {new Date(signature.signedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 
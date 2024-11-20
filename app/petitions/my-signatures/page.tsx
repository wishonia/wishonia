import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function MySignaturesPage() {
  const session = await getServerSession()
  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  const signatures = await prisma.petitionSignature.findMany({
    where: { userId: session.user.id },
    include: {
      petition: {
        select: {
          id: true,
          title: true,
          _count: { select: { signatures: true } }
        }
      }
    },
    orderBy: { signedAt: 'desc' }
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Signed Petitions</h1>
      
      <div className="max-w-2xl">
        {signatures.map(({ petition, signedAt }) => (
          <div key={petition.id} className="mb-6 p-6 bg-white rounded-lg shadow">
            <Link 
              href={`/petitions/${petition.id}`}
              className="text-xl font-semibold hover:text-blue-600"
            >
              {petition.title}
            </Link>
            
            <div className="mt-2 flex justify-between text-sm text-gray-600">
              <span>Signed on {new Date(signedAt).toLocaleDateString()}</span>
              <span>{petition._count.signatures} total signatures</span>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Share your referral link:</p>
              <input
                readOnly
                className="w-full p-2 bg-gray-50 rounded border"
                value={`${process.env.NEXT_PUBLIC_APP_URL}/petitions/${petition.id}?ref=${session.user.id}`}
                onClick={e => e.currentTarget.select()}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
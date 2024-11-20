'use client'

import { getServerSession } from "next-auth/next"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card } from "@/components/ui/card"
import { ErrorBoundary } from "react-error-boundary"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

function ErrorFallback({ error, resetErrorBoundary }: { 
  error: Error
  resetErrorBoundary: () => void 
}) {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
      <h2 className="text-red-800 font-medium">Something went wrong:</h2>
      <pre className="text-sm text-red-600 mt-2">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
      >
        Try again
      </button>
    </div>
  )
}

function Chart({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset any state that might have caused the error
      }}
    >
      <div className="h-[400px] relative">
        {children}
      </div>
    </ErrorBoundary>
  )
}

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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Petition Analytics</h1>

      <div className="grid gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Signatures Over Time</h2>
          <Chart>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="signatures" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Chart>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Referral Sources</h2>
          <Chart>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={referralData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {referralData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Chart>
        </Card>
      </div>
    </div>
  )
} 
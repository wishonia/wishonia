'use client'

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

type Signature = {
  signedAt: Date
  referralSource: string | null
  referrer: {
    name: string | null
  } | null
}

export type AnalyticsData = {
  id: string
  signatures: Signature[]
  _count: {
    signatures: number
  }
} & Record<string, any> // To allow for other Prisma fields we don't use

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function AnalyticsCharts({ data }: { data: AnalyticsData }) {
  // Calculate signatures by day
  const signaturesByDay = data.signatures.reduce((acc: Record<string, number>, sig) => {
    const day = formatDate(sig.signedAt)
    acc[day] = (acc[day] || 0) + 1
    return acc
  }, {})

  const dailyData = Object.entries(signaturesByDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date,
      signatures: count
    }))

  // Calculate referral sources
  const referralSources = data.signatures.reduce((acc: Record<string, number>, sig) => {
    const source = sig.referralSource?.toLowerCase() || 'direct'
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {})

  const referralData = Object.entries(referralSources).map(([source, count]) => ({
    name: source,
    value: count
  }))

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Signatures Over Time</h2>
        <Chart>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line type="monotone" dataKey="signatures" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
      </div>

      <div>
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
      </div>
    </div>
  )
} 
import { getServerSession } from "next-auth/next"
import Link from "next/link"

export default async function CognitionPage() {
  const session = await getServerSession()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Cognitive Tests</h1>
      
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Link 
          href="/cognition/reaction-test"
          className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <h2 className="text-xl font-semibold mb-2">Reaction Time Test</h2>
          <p className="text-gray-600">
            Measure your cognitive processing speed with our quick reaction test.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Time: ~2 minutes • Difficulty: Easy
          </p>
        </Link>
        
        {/* Placeholder for future tests */}
        <div className="block p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <h2 className="text-xl font-semibold mb-2 text-gray-400">More Tests Coming Soon</h2>
          <p className="text-gray-400">
            We're developing additional cognitive tests to provide a comprehensive assessment.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">About Cognitive Testing</h2>
        <p className="text-gray-600 mb-4">
          Regular cognitive testing can help track your mental performance over time. 
          Each test measures different aspects of cognitive function, including:
        </p>
        <ul className="list-disc ml-6 text-gray-600">
          <li>Processing speed</li>
          <li>Reaction time</li>
          <li>Pattern recognition</li>
          <li>Working memory</li>
        </ul>
      </div>
    </div>
  )
} 
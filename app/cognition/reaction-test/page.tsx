import ReactionTest from "../components/ReactionTest"

export default async function ReactionTestPage() {
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Reaction Time Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              This test measures your cognitive processing speed through reaction time. 
              When you see the green screen, click as quickly as possible. 
              Multiple attempts will give you a more accurate average.
            </p>
            
            <ReactionTest />
          </div>
        </div>
      </div>
    </div>
  )
} 
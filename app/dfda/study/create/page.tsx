import { Metadata } from 'next'
import CreateStudyForm from '../../components/CreateStudyForm'
import { getUserIdServer } from '@/lib/api/getUserIdServer'

export const metadata: Metadata = {
  title: 'Create Study | Decentralized FDA',
  description: 'Create a new study to analyze the relationship between a predictor and outcome variable',
}

export default async function CreateStudyPage() {
  const userId = await getUserIdServer()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white text-center mb-4">Create a Study</h1>
        <p className="text-gray-200 text-center mb-12 max-w-2xl mx-auto">
          After selecting a predictor and outcome variable, you'll be given a shareable url that you can use to recruit participants. You'll also get a link to the full study which will update in real time as more participants anonymously share their data.
        </p>
        <CreateStudyForm userId={userId} />
      </div>
    </div>
  )
} 
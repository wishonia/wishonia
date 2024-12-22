import { Metadata } from 'next'
import CreateStudyForm from '../components/CreateStudyForm'
import { getUserIdServer } from '@/lib/api/getUserIdServer'

export const metadata: Metadata = {
  title: 'Create Study | Decentralized FDA',
  description: 'Create a new study to analyze the relationship between a predictor and outcome variable',
}

export default async function CreateStudyPage() {
  const userId = await getUserIdServer()
  
  return (
    <div className="min-h-screen">
      <CreateStudyForm userId={userId} />
    </div>
  )
} 
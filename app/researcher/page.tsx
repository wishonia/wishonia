import { authOptions } from '@/lib/auth'
import { ResearchPageContent } from './components/ResearchPageContent'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function ResearcherPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      redirect(`/signin?callbackUrl=/researcher`)
    }
    
    return <ResearchPageContent />
}
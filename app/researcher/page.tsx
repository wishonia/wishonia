import { requireAuth } from '@/lib/auth'
import { ResearchPageContent } from './components/ResearchPageContent'

export default async function ResearcherPage() {
    await requireAuth("/researcher")
    
    return <ResearchPageContent />
}
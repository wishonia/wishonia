import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Study } from '@/types/models/Study'

import StudyCard from '../../components/StudyCard'
import { getStudy } from '../../dfdaActions'

interface StudyPageProps {
  params: {
    studyId: string
  }
}

export async function generateMetadata({ params }: StudyPageProps): Promise<Metadata> {
  try {
    const study = await getStudy(params.studyId)
    
    return {
      title: study.studyText?.studyTitle || `${study.causeVariableName} → ${study.effectVariableName} Study`,
      description: study.studyText?.studyBackground || 'Analyze the relationship between variables in this study.',
    }
  } catch (error) {
    return {
      title: 'Study Not Found',
      description: 'The requested study could not be found.',
    }
  }
}

export default async function StudyPage({ params }: StudyPageProps) {
  let study: Study

  try {
    study = await getStudy(params.studyId)
    debugger
  } catch (error) {
    notFound()
  }

  return (
    <div className="">
      <StudyCard study={study} />
    </div>
  )
}

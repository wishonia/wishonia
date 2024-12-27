'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { LoginPromptButton } from '@/components/LoginPromptButton'
import { Button } from '@/components/ui/button'
import { GlobalVariable } from '@/types/models/GlobalVariable'
import { Study } from '@/types/models/Study'

import { createStudy } from '../dfdaActions'

import OutcomeSearchAutocomplete from './OutcomeSearchAutocomplete'
import StudyCard from './StudyCard'
import VariableSearchAutocomplete from './VariableSearchAutocomplete'






interface CreateStudyFormProps {
  userId?: string
}

type StudyType = {
  value: 'population' | 'cohort' | 'user'
  label: string
  description: string
}

const STUDY_TYPES: StudyType[] = [
  {
    value: 'population',
    label: 'Population Study',
    description: 'Analyze data from all users to find general patterns'
  },
  {
    value: 'cohort',
    label: 'Cohort Study',
    description: 'Study a specific group of participants who meet certain criteria'
  },
  {
    value: 'user',
    label: 'Individual Study',
    description: 'Analyze your personal data only'
  }
]

export default function CreateStudyForm({ userId }: CreateStudyFormProps) {
  const router = useRouter()
  const [predictor, setPredictor] = useState<GlobalVariable | null>(null)
  const [outcome, setOutcome] = useState<GlobalVariable | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdStudy, setCreatedStudy] = useState<Study | null>(null)
  const [studyType, setStudyType] = useState<'population' | 'cohort' | 'user'>('population')

  const handleSubmit = async () => {
    if (!predictor || !outcome || !userId) {
      setError('Please select both a predictor and outcome variable and ensure you are logged in')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await createStudy(
        predictor.name,
        outcome.name,
        studyType,
        userId
      )

      if (response.success && response.study) {
        setCreatedStudy(response.study)
      } else {
        setError('Failed to create study. Please try again.')
      }
    } catch (err) {
      setError('An error occurred while creating the study')
    } finally {
      setIsLoading(false)
    }
  }

  const renderVariableContent = (variable: GlobalVariable | null, type: 'predictor' | 'outcome') => {
    if (variable) {
      return (
        <div className="flex flex-col items-center justify-center p-4">
          <div className="relative w-32 h-32 mb-4">
            <Image
              src={variable.pngUrl || '/placeholder-variable.png'}
              alt={variable.name}
              fill
              className="object-contain"
            />
          </div>
          <h3 className="text-2xl font-bold text-white text-center">
            {variable.name}
          </h3>
          <button 
            onClick={() => type === 'predictor' ? setPredictor(null) : setOutcome(null)}
            className="mt-4 text-white underline hover:no-underline"
          >
            Change {type}
          </button>
        </div>
      )
    }

    return (
      <div className="neobrutalist-container bg-white/90 backdrop-blur">
        {type === 'predictor' ? (
          <VariableSearchAutocomplete 
            searchParams={{
              variableCategoryName: 'Treatments',
            }}
            onVariableSelect={setPredictor} 
            placeholder="Select a predictor variable" 
          />
        ) : (
          <OutcomeSearchAutocomplete onVariableSelect={setOutcome} />
        )}
      </div>
    )
  }

  const renderStudyTypeSelector = () => {
    if (!predictor || !outcome) return null

    return (
      <div className="mt-8 neobrutalist-container bg-white p-6">
        <h3 className="neobrutalist-h3 mb-4">Select Study Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STUDY_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setStudyType(type.value)}
              className={`p-4 rounded-lg border-4 border-black transition-all ${
                studyType === type.value 
                  ? 'bg-black text-white' 
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              <h4 className="font-bold mb-2">{type.label}</h4>
              <p className={`text-sm ${
                studyType === type.value ? 'text-gray-200' : 'text-gray-600'
              }`}>
                {type.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderActionButton = () => {
    if (!predictor || !outcome) return null

    if (!userId) {
      return (
        <div className="mt-8 text-center">
          <LoginPromptButton 
            buttonText="Login to Create Study"
            buttonVariant="neobrutalist"
            buttonSize="lg"
          />
        </div>
      )
    }

    return (
      <div className="mt-8 text-center">
        <Button
          variant="neobrutalist"
          size="lg"
          onClick={handleSubmit}
          disabled={isLoading}
    
        >
          {isLoading ? (
            <>
              <span className="neobrutalist-loading-spinner" />
              Creating Study...
            </>
          ) : (
            'Create Study'
          )}
        </Button>
      </div>
    )
  }

  if (createdStudy) {
    return <StudyCard study={createdStudy} />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="neobrutalist-gradient-container neobrutalist-gradient-purple mb-8">
        <h1 className="text-4xl font-bold text-white text-center mb-4">Create a Study</h1>
        <p className="text-gray-200 text-center mb-12 max-w-2xl mx-auto">
          After selecting a predictor and outcome variable, you'll be given a shareable url that you can use to recruit participants. You'll also get a link to the full study which will update in real time as more participants anonymously share their data.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="neobrutalist-gradient-container neobrutalist-gradient-pink">
          <h2 className="neobrutalist-h2 text-white text-center">
            {predictor ? '' : 'Select'}<br />Predictor<br />Variable
          </h2>
          {renderVariableContent(predictor, 'predictor')}
        </div>

        <div className="neobrutalist-gradient-container neobrutalist-gradient-green">
          <h2 className="neobrutalist-h2 text-white text-center">
            {outcome ? '' : 'Select'}<br />Outcome<br />Variable
          </h2>
          {renderVariableContent(outcome, 'outcome')}
        </div>
      </div>

      {error && (
        <div className="mt-6 neobrutalist-container bg-red-100 text-red-600 text-center font-bold">
          {error}
        </div>
      )}

      {renderStudyTypeSelector()}
      {renderActionButton()}
    </div>
  )
} 
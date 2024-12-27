import { generateObject } from 'ai'

import { getModel } from '@/lib/utils/modelUtils'

import { GeneratedOrganizationSchema, GeneratedPersonSchema } from './schemas'

export async function generateOrganizations(
  topic: string, 
  count: number, 
  type: 'problem' | 'solution', 
  context?: string
) {
  const prompt = `Generate ${count} key organizations ${type === 'problem' ? 'working on' : 'implementing solutions for'} ${topic}.
    ${context ? `Context: ${context}` : ''}
    
    Include:
    - Real organization names and details
    - Their focus level on this ${type} (LOW, MEDIUM, HIGH, PRIMARY)
    - Key achievements in ${type === 'problem' ? 'addressing the problem' : 'implementing the solution'}
    
    Make all data realistic and fact-based.`

  const result = await generateObject({
    model: getModel(),
    schema: GeneratedOrganizationSchema,
    prompt,
  })

  return result.object.organizations
}

export async function generatePeople(
  topic: string, 
  count: number, 
  type: 'problem' | 'solution', 
  context?: string
) {
  const prompt = `Generate ${count} key people ${type === 'problem' ? 'working on' : 'implementing'} ${topic}.
    ${context ? `Context: ${context}` : ''}
    
    Include:
    - Real researchers and experts
    - Their expertise level (BEGINNER, MEDIUM, EXPERT, AUTHORITY)
    - Their role and achievements
    - Key publications related to ${type === 'problem' ? 'the problem' : 'implementing the solution'}
    
    Make all data realistic and fact-based.`

  const result = await generateObject({
    model: getModel(),
    schema: GeneratedPersonSchema,
    prompt,
  })

  return result.object.people
} 
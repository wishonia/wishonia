'use server'

import { generateObject } from 'ai'
import { getModel } from '@/lib/utils/modelUtils'
import {GlobalProblemDashboardData, GlobalProblemDashboardSchema} from "@/lib/schemas/global-problem-dashboard";

export async function generateGlobalProblemDashboard(problemName: string): Promise<GlobalProblemDashboardData> {
  try {
    const prompt = `Generate comprehensive dashboard data about the global problem of ${problemName}. 
      Include factual, well-researched information for:
      
      1. Overview of the problem, current solutions being developed, and key organizations/researchers
      2. Historical timeline of major breakthroughs and developments
      3. Recent news and updates in the field
      4. Active discussion topics and debates
      5. Research funding distribution across different areas
      
      Make all data realistic, fact-based, and properly formatted according to the schema.
      Ensure section titles are exactly: 'Overview', 'Current Solutions', or 'Key Players'.`

    const result = await generateObject({
      model: getModel(),
      schema: GlobalProblemDashboardSchema,
      prompt: prompt,
    })

    return result.object
  } catch (error) {
    console.error('Error generating dashboard data:', error)
    throw new Error('Failed to generate dashboard data')
  }
} 
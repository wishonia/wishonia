import { generateObject } from 'ai'
import { getModel } from '@/lib/utils/modelUtils'
import {GlobalProblemDashboardData, GlobalProblemDashboardSchema} from "@/lib/schemas/global-problem-dashboard";

export async function generateGlobalProblemDashboardData(problemName: string): Promise<GlobalProblemDashboardData> {
  const prompt = `Generate comprehensive dashboard data about the global problem of ${problemName}. 
    Include sections with overviews, current solutions, and key players.
    Include historical timeline events, recent news, discussion topics, and research funding distribution.
    Make all data realistic and fact-based.`

  const result = await generateObject({
    model: getModel(),
    schema: GlobalProblemDashboardSchema,
    prompt: prompt,
  })

  return result.object
} 
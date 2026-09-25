'use server'

import GlobalSolutionDecomposerAgent from '@/lib/agents/taskGenerationAgent'
import { getUserIdServer } from '@/lib/api/getUserIdServer'
import { prisma } from '@/lib/db'
import { buildTaskTree } from '@/lib/tasks/buildTaskTree'
import { GlobalTaskResponse } from '@/types/globalTask'

export async function getGlobalSolutionTasks(globalSolutionId: string): Promise<GlobalTaskResponse> {
  try {
    // Get all tasks for this solution
    const tasks = await prisma.globalTask.findMany({
      where: {
        globalSolutionTasks: {
          some: { globalSolutionId }
        }
      }
    })

    // Get all relationships
    const relationships = await prisma.globalTaskRelation.findMany({
      where: {
        parent: {
          globalSolutionTasks: {
            some: { globalSolutionId }
          }
        }
      },
      select: {
        parentId: true,
        childId: true
      }
    })

    if (tasks.length > 0) {
      return { 
        tasks: buildTaskTree(tasks, relationships)
      }
    }

    // If no tasks exist, generate only the first level
    const userId = await getUserIdServer()
    if (!userId) {
      throw new Error('Authentication required to generate tasks')
    }

    const globalSolution = await prisma.globalSolution.findUnique({
      where: { id: globalSolutionId }
    })

    if (!globalSolution) {
      throw new Error('Global Solution not found')
    }

    // Generate only first level tasks using the agent
    const agent = new GlobalSolutionDecomposerAgent()
    await agent.decomposeAndStore(globalSolution.name, userId, 'single-level')

    // Fetch newly generated tasks and relationships
    const generatedTasks = await prisma.globalTask.findMany({
      where: {
        globalSolutionTasks: {
          some: { globalSolutionId }
        }
      }
    })

    const generatedRelationships = await prisma.globalTaskRelation.findMany({
      where: {
        parent: {
          globalSolutionTasks: {
            some: { globalSolutionId }
          }
        }
      },
      select: {
        parentId: true,
        childId: true
      }
    })

    return { 
      tasks: buildTaskTree(generatedTasks, generatedRelationships)
    }

  } catch (error) {
    console.error('Error in getGlobalSolutionTasks:', error)
    return { 
      error: error instanceof Error ? error.message : 'Failed to fetch/generate tasks',
      tasks: [] 
    }
  }
}

export async function getGlobalSolution(id: string) {
  // Implementation here using your preferred data fetching method
  // (Prisma, API call, etc.)
  try {
    const solution = await prisma.globalSolution.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    })
    return solution
  } catch (error) {
    console.error('Error fetching global solution:', error)
    return null
  }
}

export async function generateSubtasks(taskId: string, globalSolutionId: string) {
  try {
    const userId = await getUserIdServer()
    if (!userId) {
      throw new Error('Authentication required to generate tasks')
    }

    const agent = new GlobalSolutionDecomposerAgent()
    await agent.decomposeTaskAndStore(taskId, userId, globalSolutionId)

    return { success: true }
  } catch (error) {
    console.error('Error generating subtasks:', error)
    throw error
  }
} 
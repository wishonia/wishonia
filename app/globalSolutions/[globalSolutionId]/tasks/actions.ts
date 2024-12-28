'use server'

import { GlobalTask as PrismaGlobalTask } from '@prisma/client'

import GlobalSolutionDecomposerAgent from '@/lib/agents/taskGenerationAgent'
import { getUserIdServer } from '@/lib/api/getUserIdServer'
import { prisma } from '@/lib/db'
import { GlobalTaskWithChildren, GlobalTaskResponse } from '@/types/globalTask'

// Helper to build tree structure from flat data
function buildTaskTree(tasks: PrismaGlobalTask[], relationships: { parentId: string; childId: string }[]): GlobalTaskWithChildren[] {
  // Create a map of child tasks for each parent
  const childrenMap = relationships.reduce((acc, { parentId, childId }) => {
    if (!acc[parentId]) {
      acc[parentId] = []
    }
    acc[parentId].push(childId)
    return acc
  }, {} as Record<string, string[]>)

  // Recursive function to build task with all its descendants
  function buildTaskWithChildren(task: PrismaGlobalTask): GlobalTaskWithChildren {
    const childIds = childrenMap[task.id] || []
    const children = childIds
      .map(childId => tasks.find(t => t.id === childId))
      .filter((child): child is PrismaGlobalTask => child !== undefined)
      .map(child => ({
        child: buildTaskWithChildren(child)
      }))

    return {
      ...task,
      childTasks: children
    }
  }

  // Get root tasks (those with no parents)
  const childIds = new Set(relationships.map(r => r.childId))
  const rootTasks = tasks.filter(task => !childIds.has(task.id))

  // Build complete tree starting from root tasks
  return rootTasks.map(task => buildTaskWithChildren(task))
}

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
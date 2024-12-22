import { GlobalTask as PrismaGlobalTask, TaskStatus, TaskComplexity } from '@prisma/client'
import { z } from 'zod'

// Base Prisma-extended types
export type GlobalTaskWithChildren = PrismaGlobalTask & {
  childTasks: {
    child: GlobalTaskWithChildren
  }[]
}

export type GlobalTaskResponse = {
  tasks: GlobalTaskWithChildren[]
  error?: string
}

// Task Schema for AI Generation
export const TaskSchema = z.object({
  name: z.string().describe('Unique, long, descriptive name for the task specific to its goal to avoid duplication with similar tasks for different goals.'),
  description: z.string().describe('Detailed description of what needs to be done to complete the task.'),
  estimatedHours: z.number().describe('Estimated time to complete the task in hours.'),
  isAtomic: z.boolean().describe('True if this task cannot be meaningfully broken down into smaller tasks, false otherwise.'),
  skills: z.array(z.string()).optional().describe('Array of specific skills required to complete this task.'),
  complexity: z.nativeEnum(TaskComplexity).describe("Assessment of the task's complexity level."),
  status: z.nativeEnum(TaskStatus).default(TaskStatus.NOT_STARTED).describe("Current status of the task"),
  deliverables: z.string().optional().describe('Brief description of the expected outcome or deliverable of the task.'),
  blockingTasks: z.array(z.string()).optional().describe('Array of task names that must be completed before this task can start.'),
})

export type TaskInput = z.infer<typeof TaskSchema>

// Task Hierarchy Schema
export const TaskHierarchySchema: z.ZodType<{
  name: string;
  subtasks?: TaskHierarchy[];
}> = z.object({
  name: z.string().describe('The name of the task'),
  subtasks: z.array(z.lazy(() => TaskHierarchySchema)).optional().describe('Array of subtasks'),
})

export type TaskHierarchy = z.infer<typeof TaskHierarchySchema>

export interface TaskWithHierarchy {
  task: TaskInput;
  parentChain: string[];
} 
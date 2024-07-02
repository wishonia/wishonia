import { openai } from "@ai-sdk/openai"
import { GlobalSolution, PrismaClient, TaskStatus } from "@prisma/client"
import { generateObject } from "ai"
import { z } from "zod"

const prisma = new PrismaClient()

const TaskSchema = z.object({
  name: z.string(),
  description: z.string(),
  content: z.string().optional(),
  //featuredImage: z.string().optional(),
  //priority: z.enum(['High', 'Medium', 'Low']),
  //status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).default('NOT_STARTED'),
  //dueDate: z.string().optional(),
  budget: z.number().optional(),
  //comments: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  blockingTasks: z.array(z.string()).optional(),
  contextUrls: z.array(z.string()).optional(),
})

type TaskInput = z.infer<typeof TaskSchema>

class GlobalSolutionDecomposerAgent {
  async decomposeAndStore(
    globalSolutionName: string,
    userId: string
  ): Promise<string> {
    try {
      const globalSolution = await prisma.globalSolution.findUnique({
        where: { name: globalSolutionName },
      })

      if (!globalSolution) {
        throw new Error(
          `GlobalSolution with name "${globalSolutionName}" not found.`
        )
      }

      const tasks = await this.decomposeIntoTasks(globalSolution)
      await this.storeTasks(tasks, globalSolution.id, userId)

      return `Successfully decomposed GlobalSolution "${globalSolutionName}" into ${tasks.length} tasks.`
    } catch (error) {
      console.error("Error in decomposeAndStore:", error)
      throw error
    }
  }

  private async decomposeIntoTasks(
    globalSolution: GlobalSolution
  ): Promise<TaskInput[]> {
    const schema = z.object({
      tasks: z.array(TaskSchema),
    })

    const prompt = `
      Given the following Global Solution:
      Name: ${globalSolution.name}
      Description: ${globalSolution.description}

      Please decompose this solution into as many Specific, Measurable, Achievable, Relevant, and Time-Bound tasks
      as you can. 
      For each task, provide:
      1. Name (unique)
      2. Description (unique)
      3. Content (optional, more detailed information about the task)
      4. Budget (estimated cost to complete the task in dollars)
      5. Required Skills (array of skills required to complete the task)
      6. Blocking Tasks (optional, array of task names that must be completed before this task)
      7. Context URLs (optional, array of relevant URL strings)

      Ensure that task names and descriptions are unique.
    `

    const result = await generateObject({
      model: openai("gpt-4-turbo"),
      schema,
      prompt,
    })

    return result.object.tasks
  }

  private async storeTasks(
    tasks: TaskInput[],
    globalSolutionId: string,
    userId: string
  ): Promise<void> {
    const createdTasks: Record<string, string> = {}

    for (const task of tasks) {
      let createdTask = await prisma.globalTask.findUnique({
        where: { name: task.name },
      })
      const alreadyExists = createdTask !== null
      if (createdTask) {
        console.log(`Task with name "${task.name}" already exists. Skipping...`)
      } else {
        createdTask = await prisma.globalTask.create({
          data: {
            userId,
            name: task.name,
            description: task.description,
            content: task.content,
            budget: task.budget,
          },
        })
      }

      // Create the relationship between GlobalTask and GlobalSolution
      await prisma.globalSolutionTask.create({
        data: {
          globalSolutionId: globalSolutionId,
          globalTaskId: createdTask.id,
        },
      })

      createdTasks[task.name] = createdTask.id

      if (task.skills && task.skills.length > 0) {
        await this.createSkills(createdTask.id, task.skills)
      }

      if (task.contextUrls && task.contextUrls.length > 0) {
        await this.createContextUrls(createdTask.id, task.contextUrls)
      }
    }

    await this.createTaskDependencies(tasks, createdTasks)
  }

  private async createSkills(taskId: string, skills: string[]): Promise<void> {
    for (const skillName of skills) {
      const skill = await prisma.skill.upsert({
        where: { name: skillName },
        update: {},
        create: { name: skillName },
      })

      await prisma.globalTaskSkill.create({
        data: {
          globalTaskId: taskId,
          skillId: skill.id,
        },
      })
    }
  }

  private async createContextUrls(
    taskId: string,
    urls: string[]
  ): Promise<void> {
    for (const url of urls) {
      await prisma.globalTaskContextUrl.create({
        data: {
          url,
          globalTasks: {
            connect: { id: taskId },
          },
        },
      })
    }
  }

  private async createTaskDependencies(
    tasks: TaskInput[],
    createdTasks: Record<string, string>
  ): Promise<void> {
    for (const task of tasks) {
      if (task.blockingTasks && task.blockingTasks.length > 0) {
        for (const blockingTaskName of task.blockingTasks) {
          if (createdTasks[blockingTaskName]) {
            await prisma.globalTaskDependency.create({
              data: {
                blockingTaskId: createdTasks[blockingTaskName],
                dependentTaskId: createdTasks[task.name],
              },
            })
          }
        }
      }
    }
  }
}

export default GlobalSolutionDecomposerAgent

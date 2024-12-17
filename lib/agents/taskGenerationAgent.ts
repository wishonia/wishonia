import { GlobalSolution, TaskStatus, TaskComplexity } from '@prisma/client';
import { generateObject } from 'ai';
import {z} from 'zod';
import { prisma } from '@/lib/db';
import {getModel} from "@/lib/utils/modelUtils";
import { TaskSchema, TaskHierarchySchema, TaskInput, TaskHierarchy, TaskWithHierarchy } from '@/types/globalTask'

class GlobalSolutionDecomposerAgent {
  private readonly maximumHoursForTask: number;
  private readonly temperature: number;

  constructor(maximumHoursForTask: number = 8, temperature: number = 0.4) {
    this.maximumHoursForTask = maximumHoursForTask;
    this.temperature = temperature;
  }

  async decomposeWithGoogleAI(globalSolutionName: string, userId: string): Promise<string> {
    const globalSolution = await prisma.globalSolution.findUnique({
      where: { name: globalSolutionName },
    });

    if (!globalSolution) {
      throw new Error(`GlobalSolution with name "${globalSolutionName}" not found.`);
    }

    const taskHierarchy = await this.getTaskHierarchyFromGoogleAI(globalSolution);
    await this.storeTaskHierarchy(taskHierarchy, globalSolution.id, userId);

    return `Successfully decomposed GlobalSolution "${globalSolutionName}" into atomic tasks using Google AI.`;
  }

  private async getTaskHierarchyFromGoogleAI(globalSolution: GlobalSolution): Promise<TaskHierarchy> {
    const prompt = `
    Create a comprehensive, deeply nested hierarchical JSON object representing the task breakdown
     for the following goal:
    
    Goal Name: ${globalSolution.name}
    Goal Description: ${globalSolution.description}

    Important Notes:
    - Ensure that the task breakdown is comprehensive and covers all aspects of the goal.
    - Each task should have a 'name' property and an optional 'subtasks' array.
    - Continue nesting subtasks until you reach atomic tasks that cannot be further broken down.

    Example format:
    {
      "name": "Build AI Platform",
      "subtasks": [
        {
          "name": "Design System Architecture",
          "subtasks": [
            {
              "name": "Define Database Schema"
            }
          ]
        },
        {
          "name": "Implement Core Features"
        }
      ]
    }

    Return only the JSON object without any additional explanation.
    `;

    const result = await generateObject({
      model: getModel(),
      schema: TaskHierarchySchema,
      prompt,
    });

    return result.object;
  }

  private async storeTaskHierarchy(taskHierarchy: TaskHierarchy, globalSolutionId: string, userId: string,
     parentTaskId?: string): Promise<void> {
    
    const task = await this.createTask(taskHierarchy.name, globalSolutionId, userId, parentTaskId);

    if (taskHierarchy.subtasks && taskHierarchy.subtasks.length > 0) {
      for (const subtask of taskHierarchy.subtasks) {
        await this.storeTaskHierarchy(subtask, globalSolutionId, userId, task.id);
      }
    }
  }

  private async createTask(taskName: string, globalSolutionId: string, userId: string, parentTaskId?: string): Promise<any> {
    if(!taskName) {
      throw new Error('Task name is required');
    }

    // First check if task already exists
    let task = await prisma.globalTask.findUnique({
      where: { name: taskName }
    });

    // If task doesn't exist, create it with full details
    if (!task) {
      const taskDetails = await this.generateTaskDetails(taskName);
      task = await prisma.globalTask.create({
        data: {
          userId,
          name: taskName,
          description: taskDetails.description,
          status: TaskStatus.NOT_STARTED,
          estimatedHours: taskDetails.estimatedHours,
        },
      });

      if (taskDetails.skills) {
        await this.createSkills(task.id, taskDetails.skills);
      }
    }

    // Create relationship with solution (if it doesn't exist)
    await prisma.globalSolutionTask.upsert({
      where: {
        globalTaskId_globalSolutionId: {
          globalTaskId: task.id,
          globalSolutionId: globalSolutionId
        }
      },
      create: {
        globalSolutionId: globalSolutionId,
        globalTaskId: task.id,
      },
      update: {} // No update needed if it exists
    });

    // Create parent-child relationship (if it doesn't exist)
    if (parentTaskId) {
      await prisma.globalTaskRelation.upsert({
        where: {
          parentId_childId: {
            parentId: parentTaskId,
            childId: task.id
          }
        },
        create: {
          parentId: parentTaskId,
          childId: task.id,
        },
        update: {} // No update needed if it exists
      });
    }

    return task;
  }

  private async generateTaskDetails(taskName: string): Promise<TaskInput> {
    const prompt = `
    Generate detailed information for the following task:
    
    Task Name: ${taskName}

    Provide the following details:
    1. A detailed description of what needs to be done to complete the task.
    2. Estimated time to complete the task in hours.
    3. Whether this task is atomic (cannot be meaningfully broken down into smaller tasks).
    4. An array of specific skills required to complete this task.
    5. Assessment of the task's complexity level (Low, Medium, or High).
    6. A brief description of the expected outcome or deliverable of the task.

    Return the information in a JSON format that matches the TaskSchema.
    `;

    const result = await generateObject({
      model: getModel(),
      schema: TaskSchema,
      prompt,
    });

    return result.object;
  }

  private async decomposeIntoTasks(globalSolution: GlobalSolution | null, taskHierarchy?: TaskWithHierarchy): Promise<TaskInput[]> {

    const hierarchyString = taskHierarchy
        ? `\nTask Hierarchy: ${taskHierarchy.parentChain.join(' > ')} > ${taskHierarchy.task.name}`
        : '';

    let prompt = `
    We're recursively breaking down the goal of "${globalSolution?.name}" into atomic tasks.
    
Decompose the following ${taskHierarchy ? 'Parent Task' : 'Goal'}:
${taskHierarchy ? 'Parent Task' : 'Goal'} Name: ${taskHierarchy ? taskHierarchy.task.name : globalSolution?.name}
${taskHierarchy ? 'Parent Task' : 'Goal'} Description: ${taskHierarchy ? taskHierarchy.task.description : globalSolution?.description}${hierarchyString}

into general, high-level tasks that collectively cover all tasks absolutely required and essential  to completing it.

Important Notes:
- We have a very limited budget, so imagine what this would look like if it was easy and we did the bare minimum work required.
- DO NOT CREATE ANY TASK THAT IS NOT ABSOLUTELY NECESSARY TO COMPLETE THE ${taskHierarchy ? 'PARENT TASK' : 'GOAL'}.
- Generate tasks that are general enough to ensure all necessary aspects of the ${taskHierarchy ? 'parent task' : 'goal'} are covered, even if it means the tasks are broader in scope.
- Each generated task should be comprehensive and act as a parent task for further decomposition.
- Consider the task hierarchy when creating subtasks, ensuring they are appropriately scoped and relevant to their parent tasks.
- Ensure that the task breakdown is comprehensive and covers all aspects of the ${taskHierarchy ? 'parent task' : 'goal'}.
`;
    console.log(prompt);
    const result = await generateObject({
      //model: openai('gpt-4o'),
      model: getModel(),
      schema: z.object({
        tasks: z.array(TaskSchema).optional().describe('Array of tasks that must be completed to achieve the goal'),
      }),
      prompt,
    });

    if(!result.object.tasks) {
      throw new Error('No tasks found in the decomposition.');
    }
    // Log the generated tasks in a bullet-point list
    console.log(`Generated the following tasks::\n${result.object.tasks.map((task, index) => `${index + 1}. ${task.name}`).join('\n')}`);

    return result.object.tasks;
  }


  async decomposeAndStore(globalSolutionName: string, userId: string): Promise<string> {
    const globalSolution = await prisma.globalSolution.findUnique({
      where: { name: globalSolutionName },
    });

    if (!globalSolution) {
      throw new Error(`GlobalSolution with name "${globalSolutionName}" not found.`);
    }

    const tasks = await this.decomposeIntoTasks(globalSolution);
    await this.storeTasksRecursively(tasks.map(task => ({ task, parentChain: [] })), globalSolution.id, userId);

    return `Successfully decomposed GlobalSolution "${globalSolutionName}" into atomic tasks.`;
  }

  private async storeTasksRecursively(tasks: TaskWithHierarchy[], globalSolutionId: string, userId: string, parentTaskId?: string): Promise<void> {
    for (const { task, parentChain } of tasks) {
      let createdTask = await prisma.globalTask.findUnique({
        where: { name: task.name },
      });

      if (!createdTask) {
        createdTask = await prisma.globalTask.create({
          data: {
            userId,
            name: task.name,
            description: task.description,
            status: TaskStatus.NOT_STARTED,
            estimatedHours: task.estimatedHours,
          },
        });

        await prisma.globalSolutionTask.create({
          data: {
            globalSolutionId: globalSolutionId,
            globalTaskId: createdTask.id,
          },
        });

        if (parentTaskId) {
          await prisma.globalTaskRelation.create({
            data: {
              parentId: parentTaskId,
              childId: createdTask.id,
            },
          });
        }

        if (task.skills) {
          await this.createSkills(createdTask.id, task.skills);
        }

        if (task.blockingTasks && task.blockingTasks.length > 0) {
          await this.createTaskDependencies(createdTask.id, task.blockingTasks);
        }
      }

      if (!task.isAtomic && (task.estimatedHours > this.maximumHoursForTask || task.complexity === TaskComplexity.HIGH)) {
        const newParentChain = [...parentChain, task.name];
        const subtasks = await this.decomposeIntoTasks(null, { task, parentChain: newParentChain });
        await this.storeTasksRecursively(
            subtasks.map(subtask => ({ task: subtask, parentChain: newParentChain })),
            globalSolutionId,
            userId,
            createdTask.id
        );
      }
    }
  }

  private async createSkills(taskId: string, skills: string[]): Promise<void> {
    for (const skillName of skills) {
      const skill = await prisma.skill.upsert({
        where: { name: skillName },
        update: {},
        create: { name: skillName },
      });

      await prisma.globalTaskSkill.create({
        data: {
          globalTaskId: taskId,
          skillId: skill.id,
        },
      });
    }
  }

  private async createTaskDependencies(taskId: string, blockingTaskNames: string[]): Promise<void> {
    for (const blockingTaskName of blockingTaskNames) {
      const blockingTask = await prisma.globalTask.findUnique({
        where: { name: blockingTaskName },
      });

      if (blockingTask) {
        await prisma.globalTaskDependency.create({
          data: {
            blockingTaskId: blockingTask.id,
            dependentTaskId: taskId,
          },
        });
      }
    }
  }
}

export default GlobalSolutionDecomposerAgent;
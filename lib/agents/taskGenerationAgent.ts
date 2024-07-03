import { GlobalSolution, TaskStatus } from '@prisma/client';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import {z, ZodSchema} from 'zod';
import { prisma } from '@/lib/db';
import {anthropic} from "@ai-sdk/anthropic";

const TaskSchema: ZodSchema = z.object({
  name: z.string().describe('Unique, long, descriptive name for the task specific to its goal to avoid duplication with similar tasks for different goals.'),
  description: z.string().describe('Detailed description of what needs to be done to complete the task.'),
  estimatedHours: z.number().describe('Estimated time to complete the task in hours.'),
  isAtomic: z.boolean().describe('True if this task cannot be meaningfully broken down into smaller tasks, false otherwise.'),
  skills: z.array(z.string()).optional().describe('Array of specific skills required to complete this task.'),
  complexity: z.enum(['Low', 'Medium', 'High']).describe("Assessment of the task's complexity level."),
  deliverables: z.string().optional().describe('Brief description of the expected  outcome or deliverable of the task.'),
});

type TaskInput = z.infer<typeof TaskSchema>;

interface TaskWithHierarchy {
  task: TaskInput;
  parentChain: string[];
}

class GlobalSolutionDecomposerAgent {
  private readonly breakdownThreshold: number;

  constructor(breakdownThreshold: number = 8) {
    this.breakdownThreshold = breakdownThreshold;
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
      model: anthropic('claude-3-5-sonnet-20240620'),
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

      if (!task.isAtomic && (task.estimatedHours > this.breakdownThreshold || task.complexity === 'High')) {
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
import { GlobalTask as PrismaGlobalTask } from '@prisma/client'

// Our enhanced task type with childTasks
export type GlobalTaskWithChildren = PrismaGlobalTask & {
  childTasks: {
    child: GlobalTaskWithChildren
  }[]
}

export type GlobalTaskResponse = {
  tasks: GlobalTaskWithChildren[]
  error?: string
} 
import { Prisma } from '@prisma/client'

// Raw task type from Prisma
export type PrismaTask = Prisma.GlobalTaskGetPayload<{}>

// Our enhanced task type with childTasks
export interface GlobalTask extends PrismaTask {
  childTasks: { child: GlobalTask }[]
}

export interface GlobalTaskResponse {
  tasks: GlobalTask[]
  error?: string
} 
import * as z from "zod"
import { getAgent } from "@/lib/api/agents"
import { prisma } from "@/lib/db"
import { handleError } from "@/lib/errorHandler"
import { getCurrentUser } from "@/lib/session"
import { agentCreateUpdateSchema } from "@/lib/validations/agent"
import { createAgentDatasource } from "@/lib/agent"

const routeContextSchema = z.object({
  params: z.object({
    agentId: z.string(),
  }),
})

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)
    const {agentId} = params
    const agentData = await prisma.agent.findUnique({
      where: {
        id: agentId,
      },
    })
    return new Response(JSON.stringify(agentData))
  } catch (error) {
    return handleError(error)
  }
}

export async function PATCH(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  try {
    const { params } = routeContextSchema.parse(context)
    const json = await req.json()
    const body = agentCreateUpdateSchema.parse(json)
    const {datasources} = body;
    delete body.datasources;
    let agent = await prisma.agent.update({
      where: {
        id: params.agentId,
      },
      data: {
        name: body.name,
        description: body.description,
        initialMessage: body.initialMessage,
        prompt: body.prompt,
        avatar: body.avatar,
        conversationStarters: body.conversationStarters,
        metadata: body.metadata,
        updatedAt: new Date(),
      },
    })
    if(datasources?.length){
      for(let dataSourceID of datasources){
        await createAgentDatasource(agent.id,dataSourceID)
      }
    }
    return new Response(JSON.stringify(agent), { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 })
    }
    return handleError(error)
  }
}
export async function DELETE(
  req: Request,
  context: z.infer<typeof routeContextSchema>
) {
  const currentUser = await getCurrentUser()
  if (!currentUser || !currentUser.id) {
    return new Response("Unauthorized", { status: 401 })
  }
  try {
    const { params } = routeContextSchema.parse(context)
    const {agentId} = params
    const agent = await getAgent(agentId)
    if (agent?.userId !== currentUser.id) {
      return new Response("Unauthorized", { status: 401 })
    }
    await prisma.agent.delete({
      where: { id: agentId },
    })
    return new Response(`Deleted Agent with id ${agentId}`)
  } catch (error) {
    return handleError(error)
  }
}

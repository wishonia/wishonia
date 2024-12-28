import {SharingLevel} from "@prisma/client";
import { NextResponse } from "next/server"

import { createAgentDatasource } from "@/lib/agent"
import { prisma } from "@/lib/db"
import { handleError } from "@/lib/errorHandler"
import { getCurrentUser } from "@/lib/session"
import { agentCreateUpdateSchema } from "@/lib/validations/agent"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const records = await prisma.agent.findMany({
      where: {
        isActive: true,
        OR: [
          { userId: currentUser.id },
          { sharingLevel: SharingLevel.PUBLISHED }
        ]
      },
    })
    return new Response(JSON.stringify(records))
  } catch (error) {
    return handleError(error)
  }
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !currentUser.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    const json = await req.json()
    const body = agentCreateUpdateSchema.parse(json)
    const agent = await prisma.agent.create({
      data: {
        name: body.name,
        description: body.description,
        initialMessage: body.initialMessage,
        prompt: body.prompt,
        userId: currentUser.id,
        avatar: body.avatar,
        conversationStarters: body.conversationStarters,
        metadata: body.metadata,
        isActive: true,
        sharingLevel: body.sharingLevel,
      },
      select: {
        id: true,
      },
    })
    if(body.datasources?.length){
      for(const dataSourceID of body.datasources){
        await createAgentDatasource(agent.id,dataSourceID)
      }
    }
    return new Response(JSON.stringify(agent))
  } catch (error) {
    return handleError(error, "Could create agent because:", {
      error,
    })
  }
}
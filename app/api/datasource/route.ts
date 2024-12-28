import { DatasourceType } from "@prisma/client";
import { NextResponse } from "next/server";
import * as z from "zod";

import { createAgentDatasource } from "@/lib/agent";
import { createDataSource } from "@/lib/datasource";
import { handleError } from "@/lib/errorHandler";
import { getCurrentUser } from "@/lib/session";


const dataSourceCreateSchema= z.object({
    name: z.string(),
    type: z.string(),
    url: z.string(),
    agentId:z.string().optional()
})

export async function POST(
  req: Request
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return new Response("Unauthorized", { status: 401 })
    }
    const json = await req.json()
    const { name, type, url ,agentId } = dataSourceCreateSchema.parse(json)
    const dataSourceType = type as DatasourceType
    const dataSource = await createDataSource(
      name,
      dataSourceType,
      url,
      user.id
    )
    if(agentId){
     await createAgentDatasource(agentId,dataSource.id)
    }
    return NextResponse.json(dataSource, { status: 201 })
  } catch (error) {
    return handleError(error, "Could not save data-source because:", {
      error,
    })
  }
}


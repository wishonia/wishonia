import * as z from "zod";
import { deleteDataSource } from "@/lib/datasource";
import { handleError } from "@/lib/errorHandler";
import { getCurrentUser } from "@/lib/session";
import { getDataSource } from "@/lib/api/dataSource";

const routeContextSchema = z.object({
    params: z.object({
      dataSourceId: z.string(),
    }),
})

export async function DELETE(
    req: Request,
    context: z.infer<typeof routeContextSchema>
){
  const currentUser = await getCurrentUser()
  if (!currentUser || !currentUser.id) {
    return new Response("Unauthorized", { status: 401 })
  }
  try {
    const { params } = routeContextSchema.parse(context)
    const dataSourceId=params.dataSourceId;
    const deletedDataSource=await getDataSource(dataSourceId);
    if(!deletedDataSource){
      return new Response(`Datasource with id ${dataSourceId} not found`,{status:404})
    }
    if(deletedDataSource.userId!==currentUser.id){
      return new Response(`Unauthorized to delete Datasource with id ${dataSourceId}`,{status:401})
    }
    await deleteDataSource(dataSourceId)
    return new Response(`Deleted Datasource with id ${dataSourceId}`)
  } catch (error) {
    return handleError(error)
  }
}
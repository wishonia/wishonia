import { DatasourceType } from "@prisma/client"

import { prisma } from "@/lib/db"

export async function getOrCreateDataSource(
  name: string,
  type: DatasourceType,
  url: string,
  userId: string
) {
  let dataSource = await prisma.datasource.findFirst({
    where: {
      name: name,
    },
  })
  if (!dataSource) {
    dataSource = await prisma.datasource.create({
      data: {
        name,
        type,
        url,
        userId,
      },
    })
  }
  return dataSource
}
export async function createDataSource(
  name: string,
  type: DatasourceType,
  url: string,
  userId: string
) {
    return await prisma.datasource.create({
      data: {
        name,
        type,
        url,
        userId,
      },
    })
}



export async function deleteDataSource(dataSourceId:string){
   await prisma.agentDatasource.deleteMany({where:{
    datasourceId:dataSourceId
   }})
   await prisma.datasource.delete({
    where:{
      id:dataSourceId
    }
   })
}
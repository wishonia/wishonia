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

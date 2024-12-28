import { Datasource } from "@prisma/client"

import { prisma as db } from "@/lib/db"

// Fetch datasource
export async function getDataSource(dataSourceId: Datasource["id"]) {
  return db.datasource.findFirst({
    where: {
      id: dataSourceId,
    }
  })
}

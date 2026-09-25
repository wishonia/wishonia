import fs from "fs"

import { getPostgresClient, getSchemaName } from "@/lib/db/postgresClient"
import { absPathFromRepo } from "@/lib/fileHelper"

export function readDumpFile(tableName: string) {
  const absPath = absPathFromRepo(`prisma/seeds/${tableName}.json`)
  const jsonData = fs.readFileSync(absPath, "utf-8")
  return JSON.parse(jsonData)
}
export async function loadJsonToDatabase(tableName: string, userId?: string) {
  try {
    const pool = getPostgresClient()
    const data = readDumpFile(tableName)
    const columns = Object.keys(data[0])
    const schema = getSchemaName()
    // The seed dumps leave out the timestamps. createdAt has a column
    // default, but Prisma sets updatedAt in the client, so set it here.
    const { rows: tableColumns } = await pool.query(
      `SELECT column_name FROM information_schema.columns
       WHERE table_schema = $1 AND table_name = $2`,
      [schema, tableName]
    )
    const setUpdatedAt =
      !columns.includes("updatedAt") &&
      tableColumns.some(({ column_name }) => column_name === "updatedAt")
    const insertColumns = setUpdatedAt ? [...columns, "updatedAt"] : columns
    const insertValues = columns.map((_, index) => `$${index + 1}`)
    if (setUpdatedAt) {
      insertValues.push("NOW()")
    }
    const insertQuery = `
            INSERT INTO "${schema}"."${tableName}" (${insertColumns.map((column) => `"${column}"`).join(", ")})
            VALUES (${insertValues.join(", ")})
            ON CONFLICT DO NOTHING
      `

    for (const row of data) {
      if (userId) {
        row.userId = userId
      }
      const values = columns.map((column) => row[column])
      try {
        await pool.query(insertQuery, values)
      } catch (e) {
        debugger
        console.log(`Error importing data for table: ${tableName}`, e)
      }
    }
  } finally {
    // Get the PostgreSQL client
    const pool = getPostgresClient()
    //await pool.end();
  }
}

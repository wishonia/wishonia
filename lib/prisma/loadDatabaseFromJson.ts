import fs from 'fs';
import {absPathFromRepo} from "@/lib/fileHelper";
import {getPostgresClient, getSchemaName} from "@/lib/db/postgresClient";
export function readDumpFile(tableName: string) {
    const absPath = absPathFromRepo(`prisma/seeds/${tableName}.json`);
    const jsonData = fs.readFileSync(absPath, 'utf-8');
    return JSON.parse(jsonData);
}
export async function loadJsonToDatabase(tableName: string, userId?: string) {
    try {
        const pool = getPostgresClient();
        const data = readDumpFile(tableName);
        const columns = Object.keys(data[0]);
        const schema = getSchemaName();
        const insertQuery = `
            INSERT INTO "${schema}"."${tableName}" (${columns.map(column => `"${column}"`).join(', ')})
            VALUES (${columns.map((_, index) => `$${index + 1}`).join(', ')})
            ON CONFLICT DO NOTHING
      `;

        for (const row of data) {
            if(userId)  {row.userId = userId;}
            const values = columns.map(column => row[column]);
            try {
                await pool.query(insertQuery, values);
            } catch (e) {
                debugger
                console.log(`Error importing data for table: ${tableName}`, e);
            }
        }
    } finally {
        // Get the PostgreSQL client
        const pool = getPostgresClient();
        //await pool.end();
    }
}

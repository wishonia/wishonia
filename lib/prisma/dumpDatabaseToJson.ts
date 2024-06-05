import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function dumpDatabaseToJson() {
    try {
        // Get all table names using Prisma introspection
        const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = current_schema()
    `;

        // Loop through each table and export its data
        for (const table of tables) {
            const tableName = table.tablename;

            // Retrieve the column names of the current table
            const columns = await prisma.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = ${tableName}
      `;

            // Construct the SELECT query with explicit casting for unsupported columns
            const selectQuery = columns.map(column => {
                const columnName = column.column_name;
                return `"${columnName}"::text as "${columnName}"`;
            }).join(', ');

            // Retrieve the data from the current table using Prisma
            const data = await prisma.$queryRawUnsafe<Array<any>>(
                `SELECT ${selectQuery} FROM "${tableName}"`
            );

            // Convert the data to JSON format
            const jsonData = JSON.stringify(data, null, 2);

            // Save the data to a file using the file system module
            fs.writeFileSync(`${tableName}.json`, jsonData);

            console.log(`Data exported for table: ${tableName}`);
        }

        console.log('Data exported successfully.');
    } catch (error) {
        console.error('Error exporting data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

export { dumpDatabaseToJson };
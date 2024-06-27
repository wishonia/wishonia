import {PrismaClient} from '@prisma/client';
import fs from 'fs';
import {absPathFromRepo} from "@/lib/fileHelper";
import {createSlug} from "@/lib/stringHelper";
import path from "path";

const prisma = new PrismaClient();

const ignoreTables = ['_prisma_migrations', 'User', 'accounts', 'sessions'];

export function saveJsonToDump(keep: any[], tableName: string, testOnly: boolean) {
    // Convert the data to JSON format
    const jsonData = JSON.stringify(keep, null, 2);

    // Save the data to a file using the file system module
    let absPath = absPathFromRepo(`prisma/seeds/${tableName}.json`)
    if(!testOnly) {
        const date = new Date().toISOString().split('T')[0];
        absPath = absPathFromRepo(`prisma/backups/${date}/${tableName}.json`)
    }
    const folder = path.dirname(absPath);
    if(!fs.existsSync(folder)) {
        fs.mkdirSync(folder, {recursive: true});
    }
    fs.writeFileSync(absPath, jsonData);
}

export async function dumpTableToJson(tableName: string, testOnly: boolean) {
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
        `SELECT ${selectQuery}
         FROM "${tableName}"
        `
    );
    if(!data || data.length === 0) {
        console.log(`No data found for table: ${tableName}`);
        return;
    }
    const keep = [];
    for (const row of data) {
        if(testOnly && row.userId && row.userId !== 'test-user') {
            continue;
        }
        if(testOnly && row.name){
            // convert the name to URL friendly slug and replace the id with it
            row.id = createSlug(row.name)
        }
        if(testOnly) {
            delete row.updatedAt;
            delete row.createdAt;
        }
        keep.push(row);
    }

    // order by id if it exists
    if(keep[0].id) {
        keep.sort((a, b) => a.id.localeCompare(b.id));
    }
    saveJsonToDump(keep, tableName, testOnly);

    console.log(`Data exported for table: ${tableName}`);
}
export async function dumpTestDatabaseToJson() {
    return dumpDatabaseToJson(true);
}

export async function dumpFullDatabaseToJson() {
    return dumpDatabaseToJson(false);
}

async function dumpDatabaseToJson(testOnly = false) {
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
            if(testOnly && ignoreTables.includes(tableName)) {
                continue;
            }
            await dumpTableToJson(tableName, testOnly);
        }

        console.log('Data exported successfully.');
    } catch (error) {
        console.error('Error exporting data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

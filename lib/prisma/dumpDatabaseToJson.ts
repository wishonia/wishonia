import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import {absPathFromRepo} from "@/lib/fileHelper";
import {getPostgresClient, getSchemaName} from "@/lib/db/postgresClient";

const prisma = new PrismaClient();

const ignoreTables = ['_prisma_migrations', 'User', 'accounts', 'sessions'];

export async function dumpTableToJson(tableName: string) {
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
    if(!data || data.length === 0) {
        console.log(`No data found for table: ${tableName}`);
        return;
    }

    // Convert the data to JSON format
    const jsonData = JSON.stringify(data, null, 2);

    // Save the data to a file using the file system module
    const absPath = absPathFromRepo(`prisma/seeds/${tableName}.json`)
    fs.writeFileSync(absPath, jsonData);

    console.log(`Data exported for table: ${tableName}`);
}

export async function dumpDatabaseToJson() {
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
            if(ignoreTables.includes(tableName)) {
                continue;
            }
            await dumpTableToJson(tableName);
        }

        console.log('Data exported successfully.');
    } catch (error) {
        console.error('Error exporting data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

export async function loadJsonToDatabase(filter?: string) {
    try {
        // Get the PostgreSQL client
        const pool = getPostgresClient();

        // Get all JSON files from the prisma/seeds directory
        const seedsDirectory = absPathFromRepo('prisma/seeds');
        const jsonFiles = fs.readdirSync(seedsDirectory).filter(file => file.endsWith('.json'));

        // Loop through each JSON file and import its data
        for (const file of jsonFiles) {
            if(filter && !file.includes(filter)) {
                continue;
            }
            const tableName = file.replace('.json', '');

            // Read the JSON file
            const absPath = absPathFromRepo(`prisma/seeds/${file}`);
            const jsonData = fs.readFileSync(absPath, 'utf-8');

            // Parse the JSON data
            const data = JSON.parse(jsonData);

            // Get the column names from the first object in the data array
            const columns = Object.keys(data[0]);

            // Prepare the INSERT statement with the specified schema
            const schema = getSchemaName();
            const insertQuery = `
        INSERT INTO "${schema}"."${tableName}" (${columns.map(column => `"${column}"`).join(', ')})
        VALUES (${columns.map((_, index) => `$${index + 1}`).join(', ')})
        ON CONFLICT DO NOTHING
      `;

            // Insert the data into the current table using pg
            for (const row of data) {
                const values = columns.map(column => row[column]);
                await pool.query(insertQuery, values);
            }

            console.log(`Data imported for table: ${tableName}`);
        }

        console.log('Data imported successfully.');
    } finally {
        // Get the PostgreSQL client
        const pool = getPostgresClient();
        //await pool.end();
    }
}

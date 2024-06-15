import fs from 'fs';
import {absPathFromRepo} from "@/lib/fileHelper";
import {getPostgresClient, getSchemaName} from "@/lib/db/postgresClient";

export function readDumpFile(file: string) {
    if(!file.endsWith('.json')) {
        file += '.json';
    }
    // Read the JSON file
    const absPath = absPathFromRepo(`prisma/seeds/${file}`);
    const jsonData = fs.readFileSync(absPath, 'utf-8');

    // Parse the JSON data
    return JSON.parse(jsonData);
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
            const data = readDumpFile(file);

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

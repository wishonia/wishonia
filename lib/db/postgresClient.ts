import { Pool } from 'pg';
let pool: Pool | null = null;
function getPostgresClient(): Pool {
    if (pool) {
        return pool;
    }

    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set.');
    }

    pool = new Pool({
        connectionString: databaseUrl
    });

    return pool;
}

function getSchemaName(): string {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set.');
    }

    const parsedUrl = new URL(databaseUrl);
    const schemaParam = parsedUrl.searchParams.get('schema');

    if (schemaParam) {
        return schemaParam;
    }

    // Return a default schema name if not specified in the URL
    return 'public';
}

export function getPostgresConfig() {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set.');
    }
    return {
        connectionString: databaseUrl,
    }
}

export async function backupDatabase() {
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    const { DATABASE_URL } = process.env;

    if (!DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set.');
    }

    const { hostname, pathname } = new URL(DATABASE_URL);
    const databaseName = pathname.split('/')[1];
    const backupFileName = `${databaseName}-backup.sql`;

    await execAsync(`pg_dump -Fc --no-acl --no-owner -h ${hostname} -d ${databaseName} > ${backupFileName}`);
}
export { getPostgresClient, getSchemaName };
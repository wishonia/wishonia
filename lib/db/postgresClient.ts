import { Pool } from 'pg';
import url from 'url';

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

export { getPostgresClient, getSchemaName };
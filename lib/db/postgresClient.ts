import { Pool } from 'pg';
let pool: Pool | null = null;
export function getPostgresClient(): Pool {
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

export function getSchemaName(): string {
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
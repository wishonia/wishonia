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

    const parsedUrl = url.parse(databaseUrl);

    const dbHost = parsedUrl.hostname || 'localhost';
    const dbPort = parseInt(parsedUrl.port || '5432', 10);
    const dbName = parsedUrl.pathname?.slice(1);
    const dbUser = parsedUrl.auth?.split(':')[0];
    const dbPassword = parsedUrl.auth?.split(':')[1];
    //const dbSchema = parsedUrl.query?.split('=')[1] || 'public';

    pool = new Pool({
        host: dbHost,
        port: dbPort,
        database: dbName,
        user: dbUser,
        password: dbPassword,
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
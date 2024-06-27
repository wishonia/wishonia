const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { URL } = require('url');

const DATABASE_URL = process.env.DATABASE_URL;
const url = new URL(DATABASE_URL);

const DB_USER = url.username;
const DB_PASSWORD = url.password;
const DB_HOST = url.hostname;
const DB_PORT = url.port;
const DB_NAME = url.pathname.split('/')[1];
// Define the output path for the backup file
const outputPath = path.join(__dirname, '../dumps', `dump_${new Date().toISOString().replace(/:/g, '-')}.sql`);

// Define the pg_dump command
const command = `PGPASSWORD=${DB_PASSWORD} pg_dump -Fc --no-acl --no-owner -h ${DB_HOST} -U ${DB_USER} ${DB_NAME} > ${outputPath}`;

// Execute the pg_dump command
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: Failed to execute pg_dump command: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Error: Failed to execute pg_dump command: ${stderr}`);
        return;
    }
    console.log(`pg_dump command executed successfully. Backup saved to ${outputPath}`);
});
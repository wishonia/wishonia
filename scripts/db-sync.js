const { Client } = require('pg');
require('dotenv').config({ path: '../.env' });
async function transferData() {
  const sourceClient = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  const destClient = new Client({
    connectionString: process.env.DATABASE_URL_DEST,
  });

  try {
    await sourceClient.connect();
    await destClient.connect();

    // Get all tables in public schema
    const { rows } = await sourceClient.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema='public'
    `);

    // Copy each table from source database to destination database
    for (let row of rows) {
      const tableName = row.table_name;

      // Create table in destination database if it doesn't exist
      await destClient.query(`
        CREATE TABLE IF NOT EXISTS public.${tableName} (LIKE source.public.${tableName} INCLUDING ALL);
      `);

      // Copy data from source to destination
      const { rows: dataRows } = await sourceClient.query(`SELECT * FROM public.${tableName}`);
      for (let dataRow of dataRows) {
        let columns = Object.keys(dataRow).join(',');
        let values = Object.values(dataRow).map(value => `'${value}'`).join(',');
        await destClient.query(`INSERT INTO public.${tableName} (${columns}) VALUES (${values})`);
      }
    }

    console.log('Data transfer completed successfully.');
  } catch (err) {
    console.error('Error during data transfer:', err);
  } finally {
    await sourceClient.end();
    await destClient.end();
  }
}

transferData();
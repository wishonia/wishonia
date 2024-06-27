const fs = require('fs').promises;
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const sourceFolder = process.argv[2] || '../prisma/backups';
const dbUrl = process.env.DATABASE_URL_DEST;

if (!dbUrl) {
  console.error('DATABASE_URL_DEST environment variable is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: dbUrl,
});

async function disableTableConstraints(tableName) {
  const query = `
    ALTER TABLE ${tableName} DISABLE TRIGGER ALL;
  `;
  await pool.query(query);
  console.log(`Constraints disabled for table ${tableName}`);
}

async function enableTableConstraints(tableName) {
  const query = `
    ALTER TABLE ${tableName} ENABLE TRIGGER ALL;
  `;
  await pool.query(query);
  console.log(`Constraints enabled for table ${tableName}`);
}

async function importJsonFiles() {
  try {
    const files = await fs.readdir(sourceFolder);
    const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');

    for (const file of jsonFiles) {
      const filePath = path.join(sourceFolder, file);
      const tableName = path.basename(file, '.json');

      console.log(`Importing ${file} into table ${tableName}...`);

      const jsonContent = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(jsonContent);

      if (!Array.isArray(data)) {
        console.warn(`Skipping ${file}: Content is not an array of objects`);
        continue;
      }

      if (data.length === 0) {
        console.warn(`Skipping ${file}: Empty array`);
        continue;
      }

      const columns = Object.keys(data[0]);
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          ${columns.map(col => `"${col}" JSONB`).join(', ')}
        )
      `;

      await pool.query(createTableQuery);

      await disableTableConstraints(tableName);

      try {
        for (const item of data) {
          const insertQuery = `
            INSERT INTO ${tableName} (${columns.map(col => `"${col}"`).join(', ')})
            VALUES (${columns.map((_, i) => `$${i + 1}`).join(', ')})
          `;
          const values = columns.map(col => JSON.stringify(item[col]));
          await pool.query(insertQuery, values);
        }

        console.log(`Successfully imported ${file}`);
      } finally {
        await enableTableConstraints(tableName);
      }
    }

    console.log('All JSON files have been imported');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

importJsonFiles();
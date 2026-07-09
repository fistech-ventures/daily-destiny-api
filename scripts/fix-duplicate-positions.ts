import { config } from 'dotenv';
import * as path from 'path';
import { Client } from 'pg';

// Load environment variables from the correct env file
config({
  path: path.join(process.cwd(), 'environments', `${process.env.NODE_ENV || 'development'}.env`),
});

async function main() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  try {
    await client.connect();
    console.log('Connected to database.');

    // First, let's see how many duplicates exist
    const duplicates = await client.query(`
      SELECT position, COUNT(*) as count
      FROM articles
      WHERE position IS NOT NULL
      GROUP BY position
      HAVING COUNT(*) > 1
      ORDER BY position
    `);

    if (duplicates.rows.length === 0) {
      console.log('No duplicate positions found. Nothing to fix.');
    } else {
      console.log('Found duplicate positions:');
      for (const row of duplicates.rows) {
        console.log(`  Position ${row.position}: ${row.count} articles`);
      }

      // Renumber all articles with positions sequentially
      const result = await client.query(`
        WITH numbered AS (
          SELECT id,
                 ROW_NUMBER() OVER (ORDER BY position ASC, "createdAt" ASC) - 1 AS new_position
          FROM articles
          WHERE position IS NOT NULL
        )
        UPDATE articles a
        SET position = n.new_position
        FROM numbered n
        WHERE a.id = n.id
        RETURNING a.id, a.position;
      `);

      console.log(`\nFixed ${result.rowCount} articles. All positions are now unique and sequential.`);
    }

    await client.end();
    console.log('\nDone!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();

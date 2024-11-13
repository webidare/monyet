// lib/db.ts
import { Pool } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';

// Check if required environment variables are set
if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

// Create connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false // Required for Vercel Postgres
  },
  connectionTimeoutMillis: 5000, // 5 seconds
  max: 10 // Maximum number of clients in the pool
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Successfully connected to database');
  release();
});

// Export the pool for direct queries
export const sql = pool;

// Export drizzle instance for ORM usage (optional)
export const db = drizzle(pool);

// Helper function for transactions
export async function withTransaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

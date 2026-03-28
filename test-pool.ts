import { Pool } from 'pg';
import 'dotenv/config';

async function testPool() {
  console.log('Testing pool connection (NO SSL):', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  try {
    const client = await pool.connect();
    console.log('Connected successfully to pool');
    const res = await client.query('SELECT NOW()');
    console.log('Result:', res.rows[0]);
    client.release();
    await pool.end();
  } catch (err) {
    console.error('Pool connection error (NO SSL):', err);
    process.exit(1);
  }
}

testPool();

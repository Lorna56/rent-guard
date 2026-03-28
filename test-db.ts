import { Client } from 'pg';
import 'dotenv/config';

async function testConfig() {
  console.log('Testing connection to:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  try {
    await client.connect();
    console.log('Connected successfully');
    const res = await client.query('SELECT NOW()');
    console.log('Result:', res.rows[0]);
    await client.end();
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
}

testConfig();

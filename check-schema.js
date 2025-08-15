// Check database schema for user table
const { Pool } = require('pg');

async function checkSchema() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
  });

  try {
    // Check user table structure
    const userSchema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'user' 
      ORDER BY ordinal_position
    `);
    
    console.log('User table columns:', userSchema.rows);

    // Check api_key table structure
    const apiKeySchema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'api_key' 
      ORDER BY ordinal_position
    `);
    
    console.log('API Key table columns:', apiKeySchema.rows);

    // Check if there are any existing users
    const existingUsers = await pool.query(`SELECT * FROM "user" LIMIT 5`);
    console.log('Existing users:', existingUsers.rows);

    // Check if there are any existing API keys
    const existingKeys = await pool.query(`SELECT * FROM api_key LIMIT 5`);
    console.log('Existing API keys:', existingKeys.rows);
    
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    await pool.end();
  }
}

checkSchema();

// Check link table schema
const { Pool } = require('pg');

async function checkLinkTable() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
  });

  try {
    const schema = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'publishable_api_key_sales_channel' 
      ORDER BY ordinal_position
    `);
    
    console.log('Link table columns:', schema.rows);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkLinkTable();

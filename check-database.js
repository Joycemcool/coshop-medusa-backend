const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
});

async function checkDatabase() {
  try {
    // Check if vendors table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'vendors'
      );
    `);
    
    console.log('Vendors table exists:', tableCheck.rows[0].exists);
    
    if (tableCheck.rows[0].exists) {
      // Count vendors in table
      const countResult = await pool.query('SELECT COUNT(*) FROM vendors;');
      console.log('Number of vendors in table:', countResult.rows[0].count);
      
      // Show all vendors
      const vendors = await pool.query('SELECT id, name, location FROM vendors ORDER BY name;');
      console.log('\nVendors in database:');
      vendors.rows.forEach(vendor => {
        console.log(`  - ${vendor.name} (${vendor.location})`);
      });
    }
    
    // List all tables in the database
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('\nAll tables in database:');
    tablesResult.rows.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    
  } catch (error) {
    console.error('Error checking database:', error.message);
  } finally {
    await pool.end();
  }
}

checkDatabase();

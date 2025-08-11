const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
});

async function checkVendorTables() {
  try {
    // Check vendor table (singular) structure
    console.log('=== VENDOR table (singular) ===');
    const vendorSchema = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'vendor' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    
    console.log('Schema:');
    vendorSchema.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    const vendorCount = await pool.query('SELECT COUNT(*) FROM vendor;');
    console.log(`Records: ${vendorCount.rows[0].count}`);
    
    if (vendorCount.rows[0].count > 0) {
      const vendorSample = await pool.query('SELECT * FROM vendor LIMIT 3;');
      console.log('Sample data:');
      vendorSample.rows.forEach(row => {
        console.log('  ', row);
      });
    }
    
    // Check vendors table (plural) structure
    console.log('\n=== VENDORS table (plural) ===');
    const vendorsSchema = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'vendors' AND table_schema = 'public'
      ORDER BY ordinal_position;
    `);
    
    console.log('Schema:');
    vendorsSchema.rows.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });
    
    const vendorsCount = await pool.query('SELECT COUNT(*) FROM vendors;');
    console.log(`Records: ${vendorsCount.rows[0].count}`);
    
    if (vendorsCount.rows[0].count > 0) {
      const vendorsSample = await pool.query('SELECT * FROM vendors LIMIT 3;');
      console.log('Sample data:');
      vendorsSample.rows.forEach(row => {
        console.log('  ', row);
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkVendorTables();

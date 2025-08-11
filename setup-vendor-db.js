const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function setupVendorTable() {
  console.log('🌾 Setting up vendor table and Nova Scotia data...');
  
  // Use the DATABASE_URL from environment
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop';
  
  const client = new Client({
    connectionString: databaseUrl,
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Read the SQL file
    const sqlFile = path.join(__dirname, 'setup-vendors.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute the SQL
    await client.query(sql);
    console.log('✅ Vendor table created and Nova Scotia vendors inserted');

    // Verify the data
    const result = await client.query('SELECT id, name, location FROM vendor ORDER BY name');
    console.log(`✅ ${result.rows.length} vendors in database:`);
    result.rows.forEach(row => {
      console.log(`   - ${row.name} (${row.location})`);
    });

  } catch (error) {
    console.error('❌ Error setting up vendor table:', error);
  } finally {
    await client.end();
  }
}

setupVendorTable();

const { Pool } = require('pg');

async function addMissingColumns() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
  });

  try {
    console.log('🔧 Adding missing vendor-product columns...');
    
    const columns = [
      { name: 'vendor_id', sql: 'ALTER TABLE product ADD COLUMN IF NOT EXISTS vendor_id VARCHAR;' },
      { name: 'vendor_price', sql: 'ALTER TABLE product ADD COLUMN IF NOT EXISTS vendor_price DECIMAL(10,2);' },
      { name: 'platform_commission', sql: 'ALTER TABLE product ADD COLUMN IF NOT EXISTS platform_commission DECIMAL(5,4) DEFAULT 0.15;' },
      { name: 'vendor_approved', sql: 'ALTER TABLE product ADD COLUMN IF NOT EXISTS vendor_approved BOOLEAN DEFAULT false;' },
      { name: 'vendor_name', sql: 'ALTER TABLE product ADD COLUMN IF NOT EXISTS vendor_name VARCHAR;' },
      { name: 'vendor_sku', sql: 'ALTER TABLE product ADD COLUMN IF NOT EXISTS vendor_sku VARCHAR;' },
      { name: 'organic_certified', sql: 'ALTER TABLE product ADD COLUMN IF NOT EXISTS organic_certified BOOLEAN DEFAULT false;' },
      { name: 'availability_status', sql: 'ALTER TABLE product ADD COLUMN IF NOT EXISTS availability_status VARCHAR DEFAULT \'available\';' },
      { name: 'vendor_notes', sql: 'ALTER TABLE product ADD COLUMN IF NOT EXISTS vendor_notes TEXT;' },
      { name: 'farm_practice', sql: 'ALTER TABLE product ADD COLUMN IF NOT EXISTS farm_practice VARCHAR DEFAULT \'conventional\';' },
      { name: 'minimum_order_quantity', sql: 'ALTER TABLE product ADD COLUMN IF NOT EXISTS minimum_order_quantity INTEGER DEFAULT 1;' },
      { name: 'delivery_available', sql: 'ALTER TABLE product ADD COLUMN IF NOT EXISTS delivery_available BOOLEAN DEFAULT true;' },
      { name: 'pickup_available', sql: 'ALTER TABLE product ADD COLUMN IF NOT EXISTS pickup_available BOOLEAN DEFAULT true;' }
    ];
    
    for (const column of columns) {
      try {
        await pool.query(column.sql);
        console.log('✅ Added column:', column.name);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log('ℹ️  Column already exists:', column.name);
        } else {
          console.error('❌ Error adding column', column.name, ':', error.message);
        }
      }
    }
    
    // Clean up any test data that might cause handle conflicts
    console.log('\n🧹 Cleaning up test data...');
    await pool.query("DELETE FROM product WHERE handle LIKE 'test-%' OR title LIKE 'Test %';");
    console.log('✅ Test data cleaned up');
    
    // Verify columns exist
    console.log('\n🔍 Verifying columns...');
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'product' 
      AND column_name IN ('vendor_id', 'vendor_price', 'vendor_approved', 'vendor_name', 'vendor_sku', 'organic_certified', 'availability_status')
      ORDER BY column_name;
    `);
    
    console.log('✅ Verified columns:', result.rows.map(r => r.column_name).join(', '));
    console.log('\n🎉 Database schema update complete!');
    
  } catch (error) {
    console.error('❌ Failed to update schema:', error.message);
  } finally {
    await pool.end();
  }
}

addMissingColumns();

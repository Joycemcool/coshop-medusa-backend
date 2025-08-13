const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost', 
  database: process.env.POSTGRES_DB || 'medusa_coshop',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
});

async function runMigration() {
  try {
    console.log('🔄 Running featured products migration...');
    
    // Add featured columns to product table
    await pool.query(`
      ALTER TABLE product 
      ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false
    `);
    console.log('✅ Added is_featured column');

    await pool.query(`
      ALTER TABLE product 
      ADD COLUMN IF NOT EXISTS featured_priority INTEGER DEFAULT 0
    `);
    console.log('✅ Added featured_priority column');

    await pool.query(`
      ALTER TABLE product 
      ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP NULL
    `);
    console.log('✅ Added featured_until column');

    // Create index for faster featured product queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_product_featured 
      ON product(is_featured, featured_priority DESC)
    `);
    console.log('✅ Created featured products index');

    // Update some existing products to be featured for testing
    const updateResult = await pool.query(`
      UPDATE product 
      SET is_featured = true, featured_priority = 5 
      WHERE vendor_id IN ('vendor_001', 'vendor_002') 
      AND availability_status = 'available'
      AND id IN (
        SELECT id FROM product 
        WHERE vendor_id IN ('vendor_001', 'vendor_002') 
        AND availability_status = 'available'
        LIMIT 6
      )
    `);
    console.log(`✅ Updated ${updateResult.rowCount} products to be featured`);

    // Verify the update
    const verifyResult = await pool.query(`
      SELECT 
        id, 
        title, 
        vendor_id, 
        is_featured, 
        featured_priority 
      FROM product 
      WHERE is_featured = true 
      ORDER BY featured_priority DESC
    `);
    
    console.log('\n📊 Featured products:');
    verifyResult.rows.forEach(product => {
      console.log(`- ${product.title} (${product.vendor_id}) - Priority: ${product.featured_priority}`);
    });

    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the migration
runMigration()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

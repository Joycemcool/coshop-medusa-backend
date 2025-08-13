const { Pool } = require('pg')

async function addVendorProductColumns() {
  console.log('🔨 Adding vendor-product relationship columns...\n')
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
  })

  try {
    // List of vendor-specific columns to add
    const columns = [
      { name: 'vendor_name', type: 'VARCHAR' },
      { name: 'vendor_sku', type: 'VARCHAR' },
      { name: 'organic_certified', type: 'BOOLEAN', default: 'false' },
      { name: 'harvest_date', type: 'TIMESTAMP' },
      { name: 'expiry_date', type: 'TIMESTAMP' },
      { name: 'storage_instructions', type: 'TEXT' },
      { name: 'nutritional_info', type: 'JSONB' },
      { name: 'farm_practice', type: 'VARCHAR', default: "'conventional'" },
      { name: 'availability_status', type: 'VARCHAR', default: "'available'" },
      { name: 'minimum_order_quantity', type: 'INTEGER', default: '1' },
      { name: 'bulk_pricing', type: 'JSONB' },
      { name: 'seasonal_availability', type: 'JSONB' },
      { name: 'vendor_notes', type: 'TEXT' },
      { name: 'quality_grade', type: 'VARCHAR' },
      { name: 'origin_location', type: 'VARCHAR' },
      { name: 'delivery_available', type: 'BOOLEAN', default: 'true' },
      { name: 'pickup_available', type: 'BOOLEAN', default: 'true' }
    ]
    
    for (const column of columns) {
      try {
        // Check if column exists
        const checkColumn = await pool.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'product' AND column_name = $1
        `, [column.name])
        
        if (checkColumn.rows.length === 0) {
          // Add column if it doesn't exist
          const defaultClause = column.default ? ` DEFAULT ${column.default}` : ''
          await pool.query(`
            ALTER TABLE product ADD COLUMN ${column.name} ${column.type}${defaultClause};
          `)
          console.log(`✅ Added column: ${column.name}`)
        } else {
          console.log(`⏭️  Column already exists: ${column.name}`)
        }
      } catch (error) {
        console.error(`❌ Error adding column ${column.name}:`, error.message)
      }
    }
    
    // Create indexes for better performance
    console.log('\n🔍 Creating indexes...')
    
    const indexes = [
      { name: 'idx_product_vendor_id', column: 'vendor_id' },
      { name: 'idx_product_availability', column: 'availability_status' },
      { name: 'idx_product_approved', column: 'vendor_approved' }
    ]
    
    for (const index of indexes) {
      try {
        await pool.query(`
          CREATE INDEX IF NOT EXISTS ${index.name} ON product(${index.column});
        `)
        console.log(`✅ Created index: ${index.name}`)
      } catch (error) {
        console.log(`⏭️  Index already exists: ${index.name}`)
      }
    }
    
    // Add foreign key constraint to vendor table if it doesn't exist
    console.log('\n🔗 Adding foreign key constraint...')
    try {
      await pool.query(`
        ALTER TABLE product 
        ADD CONSTRAINT fk_product_vendor 
        FOREIGN KEY (vendor_id) REFERENCES vendor(id) 
        ON DELETE SET NULL;
      `)
      console.log('✅ Added foreign key constraint')
    } catch (error) {
      console.log('⏭️  Foreign key constraint already exists or error:', error.message)
    }
    
    // Verify the changes
    console.log('\n✅ Verifying changes...')
    const finalCheck = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'product' 
      AND column_name IN ('vendor_id', 'vendor_price', 'vendor_approved', 'availability_status', 'organic_certified')
      ORDER BY column_name;
    `)
    
    console.log(`✅ Found ${finalCheck.rows.length} vendor-product columns:`)
    finalCheck.rows.forEach(col => {
      console.log(`   - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`)
    })
    
    console.log('\n🎉 Database schema update completed successfully!')
    
  } catch (error) {
    console.error('❌ Database update failed:', error.message)
    console.error(error)
  } finally {
    await pool.end()
  }
}

// Run the script
if (require.main === module) {
  addVendorProductColumns()
    .then(() => {
      console.log('\n✅ Ready to test product-vendor integration!')
      process.exit(0)
    })
    .catch(error => {
      console.error('Script execution failed:', error)
      process.exit(1)
    })
}

module.exports = { addVendorProductColumns }

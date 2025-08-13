export class ProductVendorEnhancement20250813000001 {
  name = 'ProductVendorEnhancement20250813000001'

  public async up(queryRunner: any): Promise<void> {
    // Check if product table exists, if not create it
    const productTableExists = await queryRunner.hasTable('product')
    
    if (!productTableExists) {
      await queryRunner.query(`
        CREATE TABLE product (
          id VARCHAR PRIMARY KEY,
          vendor_id VARCHAR,
          vendor_price DECIMAL(10,2),
          platform_commission DECIMAL(5,4) DEFAULT 0.15,
          vendor_approved BOOLEAN DEFAULT false,
          vendor_name VARCHAR,
          vendor_sku VARCHAR,
          organic_certified BOOLEAN DEFAULT false,
          harvest_date TIMESTAMP,
          expiry_date TIMESTAMP,
          storage_instructions TEXT,
          nutritional_info JSONB,
          farm_practice VARCHAR DEFAULT 'conventional',
          availability_status VARCHAR DEFAULT 'available',
          minimum_order_quantity INTEGER DEFAULT 1,
          bulk_pricing JSONB,
          seasonal_availability JSONB,
          vendor_notes TEXT,
          quality_grade VARCHAR,
          origin_location VARCHAR,
          delivery_available BOOLEAN DEFAULT true,
          pickup_available BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `)
      
      // Create indexes for better performance
      await queryRunner.query(`
        CREATE INDEX idx_product_vendor_id ON product(vendor_id);
      `)
      await queryRunner.query(`
        CREATE INDEX idx_product_availability ON product(availability_status);
      `)
      await queryRunner.query(`
        CREATE INDEX idx_product_approved ON product(vendor_approved);
      `)
    } else {
      // Add vendor-specific columns if they don't exist
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
        const hasColumn = await queryRunner.hasColumn('product', column.name)
        if (!hasColumn) {
          const defaultClause = column.default ? ` DEFAULT ${column.default}` : ''
          await queryRunner.query(`
            ALTER TABLE product ADD COLUMN ${column.name} ${column.type}${defaultClause};
          `)
        }
      }
      
      // Create indexes if they don't exist
      try {
        await queryRunner.query(`
          CREATE INDEX IF NOT EXISTS idx_product_vendor_id ON product(vendor_id);
        `)
        await queryRunner.query(`
          CREATE INDEX IF NOT EXISTS idx_product_availability ON product(availability_status);
        `)
        await queryRunner.query(`
          CREATE INDEX IF NOT EXISTS idx_product_approved ON product(vendor_approved);
        `)
      } catch (error) {
        // Indexes might already exist, continue
        console.log('Some indexes may already exist:', error.message)
      }
    }
    
    // Add foreign key constraint to vendor table if it doesn't exist
    try {
      await queryRunner.query(`
        ALTER TABLE product 
        ADD CONSTRAINT fk_product_vendor 
        FOREIGN KEY (vendor_id) REFERENCES vendor(id) 
        ON DELETE SET NULL;
      `)
    } catch (error) {
      // Constraint might already exist
      console.log('Foreign key constraint may already exist:', error.message)
    }
  }

  public async down(queryRunner: any): Promise<void> {
    // Remove vendor-specific columns
    const vendorColumns = [
      'vendor_name', 'vendor_sku', 'organic_certified', 'harvest_date',
      'expiry_date', 'storage_instructions', 'nutritional_info', 'farm_practice',
      'availability_status', 'minimum_order_quantity', 'bulk_pricing',
      'seasonal_availability', 'vendor_notes', 'quality_grade', 'origin_location',
      'delivery_available', 'pickup_available'
    ]
    
    for (const column of vendorColumns) {
      const hasColumn = await queryRunner.hasColumn('product', column)
      if (hasColumn) {
        await queryRunner.query(`ALTER TABLE product DROP COLUMN ${column};`)
      }
    }
    
    // Drop indexes
    try {
      await queryRunner.query(`DROP INDEX IF EXISTS idx_product_vendor_id;`)
      await queryRunner.query(`DROP INDEX IF EXISTS idx_product_availability;`)
      await queryRunner.query(`DROP INDEX IF EXISTS idx_product_approved;`)
    } catch (error) {
      console.log('Error dropping indexes:', error.message)
    }
    
    // Drop foreign key constraint
    try {
      await queryRunner.query(`
        ALTER TABLE product DROP CONSTRAINT IF EXISTS fk_product_vendor;
      `)
    } catch (error) {
      console.log('Error dropping foreign key:', error.message)
    }
  }
}

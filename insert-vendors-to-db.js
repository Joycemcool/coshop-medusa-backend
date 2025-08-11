const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
});

const vendorData = [
  {
    id: "vendor_001",
    name: "Green Valley Farm",
    email: "farm@greenvalley.com",
    farm_name: "Green Valley Organic Farm",
    location: "Truro, Nova Scotia, Canada",
    description: "Organic vegetables and sustainable farming practices since 1995",
    commission_rate: 0.15,
    category: "Vegetables",
    is_active: true,
  },
  {
    id: "vendor_002", 
    name: "Annapolis Valley Dairy",
    email: "contact@annapolisdairy.com",
    farm_name: "Annapolis Valley Organic Dairy",
    location: "Kentville, Nova Scotia, Canada",
    description: "Fresh organic dairy products from grass-fed cows",
    commission_rate: 0.12,
    category: "Dairy",
    is_active: true,
  },
  {
    id: "vendor_003",
    name: "Sunrise Ranch",
    email: "info@sunriseranch.com", 
    farm_name: "Sunrise Cattle Ranch",
    location: "New Glasgow, Nova Scotia, Canada",
    description: "Premium grass-fed beef and free-range poultry",
    commission_rate: 0.18,
    category: "Meat",
    is_active: true,
  },
  {
    id: "vendor_004",
    name: "Atlantic Coastal Harvest",
    email: "hello@atlanticcoastal.com",
    farm_name: "Atlantic Coastal Harvest Co-op",
    location: "Lunenburg, Nova Scotia, Canada", 
    description: "Fresh seafood and coastal produce delivered daily",
    commission_rate: 0.16,
    category: "Seafood",
    is_active: true,
  },
  {
    id: "vendor_005",
    name: "Maritimes Grains Farm",
    email: "farmers@maritimesgrains.com",
    farm_name: "Maritimes Grains Collective",
    location: "Amherst, Nova Scotia, Canada",
    description: "Organic grains, cereals, and artisan breads",
    commission_rate: 0.14,
    category: "Grains",
    is_active: true,
  },
  {
    id: "vendor_006",
    name: "Acadia Orchards",
    email: "orders@acadiaorchards.com",
    farm_name: "Acadia Fruit Orchards",
    location: "Wolfville, Nova Scotia, Canada",
    description: "Fresh seasonal fruits and handcrafted preserves",
    commission_rate: 0.13,
    category: "Fruits",
    is_active: true,
  },
  {
    id: "vendor_007",
    name: "Bay of Fundy Farm",
    email: "info@bayoffundyfarm.com",
    farm_name: "Bay of Fundy Sustainable Farm",
    location: "Digby, Nova Scotia, Canada",
    description: "Tidal-influenced crops and specialty vegetables",
    commission_rate: 0.17,
    category: "Vegetables",
    is_active: true,
  },
  {
    id: "vendor_008",
    name: "Cape Breton Herbs",
    email: "contact@capebretonherbs.com",
    farm_name: "Cape Breton Herb Garden",
    location: "Sydney, Nova Scotia, Canada",
    description: "Fresh herbs, medicinal plants, and herbal products",
    commission_rate: 0.19,
    category: "Herbs",
    is_active: true,
  },
  {
    id: "vendor_009",
    name: "Gaspereau Valley Vineyard",
    email: "wine@gaspereau.com",
    farm_name: "Gaspereau Valley Organic Vineyard",
    location: "Gaspereau Valley, Nova Scotia, Canada",
    description: "Award-winning wines and farm-to-table experiences",
    commission_rate: 0.20,
    category: "Wine",
    is_active: true,
  }
];

async function insertVendorsToDatabase() {
  try {
    console.log('🗄️ Connecting to database...');
    
    // First, create the vendors table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vendors (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        farm_name VARCHAR(255),
        location VARCHAR(255),
        description TEXT,
        commission_rate DECIMAL(5,4),
        category VARCHAR(100),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    console.log('✅ Vendors table created/verified');
    
    // Clear existing vendors
    await pool.query('DELETE FROM vendors');
    console.log('🗑️ Cleared existing vendors');
    
    // Insert Nova Scotia vendors
    for (let i = 0; i < vendorData.length; i++) {
      const vendor = vendorData[i];
      console.log(`📝 Inserting vendor ${i + 1}/${vendorData.length}: ${vendor.name}`);
      
      await pool.query(`
        INSERT INTO vendors (id, name, email, farm_name, location, description, commission_rate, category, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        vendor.id,
        vendor.name,
        vendor.email,
        vendor.farm_name,
        vendor.location,
        vendor.description,
        vendor.commission_rate,
        vendor.category,
        vendor.is_active
      ]);
    }
    
    console.log('✅ All vendors inserted successfully');
    
    // Verify insertion
    const result = await pool.query('SELECT COUNT(*) as count FROM vendors');
    console.log(`🎉 Total vendors in database: ${result.rows[0].count}`);
    
    // Show all vendors
    const vendors = await pool.query('SELECT id, name, location FROM vendors ORDER BY name');
    console.log('📋 Vendors in database:');
    vendors.rows.forEach(v => {
      console.log(`  - ${v.name} (${v.location})`);
    });
    
  } catch (error) {
    console.error('❌ Error inserting vendors:', error);
  } finally {
    await pool.end();
  }
}

insertVendorsToDatabase();

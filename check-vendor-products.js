// Check products with vendor data
const { Pool } = require('pg');

async function checkVendorProducts() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
  });

  try {
    const result = await pool.query(`
      SELECT p.id, p.title, p.handle, p.thumbnail, pr.vendor_id, v.name as vendor_name, v.is_active
      FROM product p
      LEFT JOIN product pr ON p.id = pr.id  
      LEFT JOIN vendor v ON pr.vendor_id = v.id
      WHERE pr.vendor_id IS NOT NULL
      ORDER BY pr.vendor_id, p.title
      LIMIT 30
    `);
    
    console.log('Products with vendor data:');
    result.rows.forEach(p => {
      console.log(`- ID: ${p.id}`);
      console.log(`  Title: ${p.title}`);
      console.log(`  Handle: ${p.handle}`);
      console.log(`  Vendor: ${p.vendor_id} (${p.vendor_name})`);
      console.log(`  Active: ${p.is_active}`);
      console.log(`  Thumbnail: ${p.thumbnail || 'none'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

checkVendorProducts();

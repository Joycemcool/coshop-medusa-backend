const { Pool } = require('pg');

// Try different possible database configurations
const configs = [
  { connectionString: 'postgres://postgres:supersecretpassword@localhost:5432/coshop_medusa' },
  { connectionString: 'postgres://postgres:password@localhost:5432/coshop_medusa' },
  { connectionString: 'postgres://postgres:admin@localhost:5432/coshop_medusa' },
  { connectionString: 'postgres://postgres:postgres@localhost:5432/coshop_medusa' },
];

async function addTestImage() {
  for (const config of configs) {
    try {
      console.log(`Trying connection: ${config.connectionString}`);
      const pool = new Pool(config);
      
      // Test connection
      await pool.query('SELECT 1');
      console.log('✅ Connected successfully!');
      
      // Check if we have any products
      const products = await pool.query('SELECT id, title FROM product LIMIT 5');
      console.log(`Found ${products.rows.length} products:`);
      products.rows.forEach(p => console.log(`  - ID: ${p.id}, Title: ${p.title}`));
      
      if (products.rows.length > 0) {
        const productId = products.rows[0].id;
        console.log(`\nAdding test image for product ${productId}...`);
        
        // Insert a test image
        const insertResult = await pool.query(`
          INSERT INTO product_images (
            product_id, 
            original_url, 
            medium_url, 
            thumbnail_url, 
            alt_text, 
            file_name, 
            file_size, 
            width, 
            height, 
            created_at, 
            updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
          RETURNING id
        `, [
          productId,
          'http://localhost:9000/custom/uploads/images/original/test-tomatos.png',
          'http://localhost:9000/custom/uploads/images/medium/test-tomatos.png',
          'http://localhost:9000/custom/uploads/images/thumbnail/test-tomatos.png',
          'Fresh Red Tomatoes',
          'test-tomatos.png',
          1024,
          800,
          600
        ]);
        
        console.log(`✅ Added image with ID: ${insertResult.rows[0].id}`);
        
        // Verify the image was added
        const verification = await pool.query(
          'SELECT * FROM product_images WHERE product_id = $1',
          [productId]
        );
        console.log(`✅ Verification: Found ${verification.rows.length} images for product ${productId}`);
      }
      
      await pool.end();
      return productId; // Return the product ID for testing
      
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      continue;
    }
  }
  
  console.log('❌ Could not connect to database with any configuration');
}

addTestImage().then(productId => {
  if (productId) {
    console.log(`\n🎉 Test complete! You can now test with product ID: ${productId}`);
    console.log(`Visit: http://localhost:3000/product/details/${productId}`);
  }
}).catch(console.error);

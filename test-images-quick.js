const { Pool } = require('pg')

async function testImages() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
  })

  try {
    console.log('🔍 Testing image database...')
    
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'product_image'
      )
    `)
    
    if (!tableCheck.rows[0].exists) {
      console.log('❌ product_image table does not exist')
      return
    }
    
    console.log('✅ product_image table exists')
    
    // Get all images
    const allImages = await pool.query('SELECT * FROM product_image')
    console.log(`📸 Total images in database: ${allImages.rows.length}`)
    
    if (allImages.rows.length > 0) {
      console.log('\n📋 Image details:')
      allImages.rows.forEach((img, index) => {
        console.log(`${index + 1}. Product: ${img.product_id}`)
        console.log(`   File: ${img.file_name}`)
        console.log(`   URL: ${img.url}`)
        console.log(`   Primary: ${img.is_primary}`)
        console.log(`   ---`)
      })
    }
    
    // Test specific product
    const productImages = await pool.query(`
      SELECT * FROM product_image 
      WHERE product_id = $1 
      ORDER BY is_primary DESC, sort_order ASC
    `, ['prod_1755116092975_z10hbo8rdc'])
    
    console.log(`\n🎯 Images for product 'prod_1755116092975_z10hbo8rdc': ${productImages.rows.length}`)
    
    if (productImages.rows.length > 0) {
      console.log('✅ SUCCESS! Images found for your product!')
      console.log('\n📸 Your product images:')
      productImages.rows.forEach((img, index) => {
        console.log(`${index + 1}. ${img.file_name} (${img.is_primary ? 'PRIMARY' : 'secondary'})`)
        console.log(`   URL: ${img.url}`)
      })
      
      console.log('\n🚀 Ready for frontend integration!')
      console.log('You can now use these URLs in your ProductDetails page.')
    } else {
      console.log('⚠️ No images found for this product')
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

testImages()

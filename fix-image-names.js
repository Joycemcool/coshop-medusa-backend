const { Pool } = require('pg')

async function fixImageNames() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
  })

  try {
    console.log('🔧 Fixing image names to match actual files...')
    
    // Update the tomatoes image to match the actual file
    await pool.query(`
      UPDATE product_image 
      SET 
        file_name = 'test-tomatos.png',
        mime_type = 'image/png',
        url = 'http://localhost:9000/uploads/images/original/test-tomatos.png',
        thumbnail_url = 'http://localhost:9000/uploads/images/thumbnail/test-tomatos.png',
        medium_url = 'http://localhost:9000/uploads/images/medium/test-tomatos.png'
      WHERE id = 'img_001'
    `)

    // Check what images we have now
    const result = await pool.query('SELECT * FROM product_image ORDER BY created_at')
    console.log('\n📋 Updated images in database:')
    result.rows.forEach((img, index) => {
      console.log(`${index + 1}. ${img.file_name} -> Product: ${img.product_id}`)
      console.log(`   URL: ${img.url}`)
      console.log(`   Primary: ${img.is_primary}`)
      console.log('   ---')
    })
    
    console.log('✅ Image names fixed!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await pool.end()
  }
}

fixImageNames()

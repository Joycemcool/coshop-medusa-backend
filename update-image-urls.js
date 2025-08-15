const { Pool } = require('pg')

async function updateImageUrls() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
  })

  try {
    console.log('🔧 Updating image URLs to use correct endpoint...')
    
    // Update the tomatoes image URLs
    await pool.query(`
      UPDATE product_image 
      SET 
        url = 'http://localhost:9000/custom/uploads/images/original/test-tomatos.png',
        thumbnail_url = 'http://localhost:9000/custom/uploads/images/thumbnail/test-tomatos.png',
        medium_url = 'http://localhost:9000/custom/uploads/images/medium/test-tomatos.png'
      WHERE id = 'img_001'
    `)

    // Update the carrots image URLs too
    await pool.query(`
      UPDATE product_image 
      SET 
        url = 'http://localhost:9000/custom/uploads/images/original/test-carrots.jpg',
        thumbnail_url = 'http://localhost:9000/custom/uploads/images/thumbnail/test-carrots.jpg',
        medium_url = 'http://localhost:9000/custom/uploads/images/medium/test-carrots.jpg'
      WHERE id = 'img_002'
    `)

    // Verify the updates
    const result = await pool.query('SELECT * FROM product_image ORDER BY created_at')
    console.log('\n📋 Updated image URLs:')
    result.rows.forEach((img, index) => {
      console.log(`${index + 1}. ${img.file_name}`)
      console.log(`   URL: ${img.url}`)
      console.log(`   Thumbnail: ${img.thumbnail_url}`)
      console.log('   ---')
    })
    
    console.log('✅ URLs updated!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await pool.end()
  }
}

updateImageUrls()

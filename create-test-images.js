const { Pool } = require('pg')

async function createTestImages() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
  })

  try {
    // Create sample product images for testing
    const testImages = [
      {
        id: 'img_001',
        product_id: 'prod_1755116092975_z10hbo8rdc', // Your existing product
        url: 'http://localhost:9000/uploads/images/original/test-tomatoes.jpg',
        file_name: 'test-tomatoes.jpg',
        file_path: './uploads/images/original/test-tomatoes.jpg',
        file_size: 124567,
        mime_type: 'image/jpeg',
        width: 800,
        height: 600,
        alt_text: 'Fresh organic tomatoes',
        is_primary: true,
        sort_order: 0,
        thumbnail_url: 'http://localhost:9000/uploads/images/thumbnail/test-tomatoes.jpg',
        medium_url: 'http://localhost:9000/uploads/images/medium/test-tomatoes.jpg',
        storage_provider: 'local'
      },
      {
        id: 'img_002',
        product_id: 'prod_1755116092975_z10hbo8rdcr',
        url: 'http://localhost:9000/uploads/images/original/test-carrots.jpg',
        file_name: 'test-carrots.jpg',
        file_path: './uploads/images/original/test-carrots.jpg',
        file_size: 98432,
        mime_type: 'image/jpeg',
        width: 800,
        height: 600,
        alt_text: 'Fresh organic carrots',
        is_primary: true,
        sort_order: 0,
        thumbnail_url: 'http://localhost:9000/uploads/images/thumbnail/test-carrots.jpg',
        medium_url: 'http://localhost:9000/uploads/images/medium/test-carrots.jpg',
        storage_provider: 'local'
      }
    ]

    // First, ensure the product_image table exists (run migration)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "product_image" (
        "id" varchar NOT NULL,
        "product_id" varchar NOT NULL,
        "url" varchar NOT NULL,
        "file_name" varchar NOT NULL,
        "file_path" varchar NOT NULL,
        "file_size" integer NOT NULL,
        "mime_type" varchar NOT NULL,
        "width" integer NULL,
        "height" integer NULL,
        "alt_text" varchar NULL,
        "is_primary" boolean NOT NULL DEFAULT false,
        "sort_order" integer NOT NULL DEFAULT 0,
        "thumbnail_url" varchar NULL,
        "medium_url" varchar NULL,
        "storage_provider" varchar NOT NULL DEFAULT 'local',
        "metadata" text NULL,
        "uploaded_by" varchar NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY ("id")
      );
    `)

    // Insert test images
    for (const image of testImages) {
      await pool.query(`
        INSERT INTO product_image (
          id, product_id, url, file_name, file_path, file_size, mime_type,
          width, height, alt_text, is_primary, sort_order, thumbnail_url,
          medium_url, storage_provider, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, now(), now()
        ) ON CONFLICT (id) DO NOTHING
      `, [
        image.id, image.product_id, image.url, image.file_name, image.file_path,
        image.file_size, image.mime_type, image.width, image.height, image.alt_text,
        image.is_primary, image.sort_order, image.thumbnail_url, image.medium_url,
        image.storage_provider
      ])
    }

    console.log('✅ Test images created successfully!')
    console.log('📁 Images in database:', testImages.length)
    
    // Verify the data
    const result = await pool.query('SELECT * FROM product_image')
    console.log('🔍 Total images in database:', result.rows.length)
    
  } catch (error) {
    console.error('❌ Error creating test images:', error)
  } finally {
    await pool.end()
  }
}

createTestImages()

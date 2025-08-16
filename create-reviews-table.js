const { Pool } = require('pg')

async function createReviewsTable() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
  })

  try {
    console.log('Creating product_reviews table...')
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_reviews (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(255),
        comment TEXT NOT NULL,
        pros TEXT,
        cons TEXT,
        customer_name VARCHAR(255) NOT NULL,
        avatar VARCHAR(500),
        verified BOOLEAN DEFAULT FALSE,
        helpful_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    console.log('Creating indexes...')
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
    `)
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
    `)
    
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at);
    `)

    console.log('✅ Reviews table created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating reviews table:', error)
  } finally {
    await pool.end()
  }
}

createReviewsTable()

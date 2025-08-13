const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
})

async function checkStatusConstraint() {
  try {
    // Check constraint definition
    const constraint = await pool.query(`
      SELECT conname, pg_get_constraintdef(oid) as definition
      FROM pg_constraint 
      WHERE conname = 'product_status_check'
    `)
    
    if (constraint.rows.length > 0) {
      console.log('Product status constraint:')
      console.log(constraint.rows[0].definition)
    }
    
    // Check distinct status values currently in use
    const statuses = await pool.query(`
      SELECT DISTINCT status, COUNT(*) 
      FROM product 
      WHERE status IS NOT NULL 
      GROUP BY status 
      ORDER BY status
    `)
    
    console.log('\nCurrent status values in use:')
    statuses.rows.forEach(row => {
      console.log(`- ${row.status}: ${row.count} products`)
    })
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await pool.end()
  }
}

checkStatusConstraint()

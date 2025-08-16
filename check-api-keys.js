const { Pool } = require('pg')

async function checkApiKeys() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
  })

  try {
    console.log('Checking API keys...')
    
    const result = await pool.query('SELECT id, title FROM publishable_api_key LIMIT 5;')
    console.log('Available API keys:', result.rows)
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await pool.end()
  }
}

checkApiKeys()

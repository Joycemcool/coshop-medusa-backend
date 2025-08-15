// Create an admin API key for Medusa
const { Pool } = require('pg');

async function createAdminApiKey() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
  });

  try {
    // Check if we already have an admin user
    const userResult = await pool.query(`
      SELECT id, email FROM "user" WHERE role = 'admin' LIMIT 1
    `);

    let userId;
    if (userResult.rows.length === 0) {
      console.log('Creating admin user...');
      // Create admin user
      const createUserResult = await pool.query(`
        INSERT INTO "user" (id, email, password_hash, role, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
        RETURNING id
      `, [
        'user_admin', 
        'admin@coshop.com', 
        '$2b$10$XYZ123',  // This is a placeholder, in real setup you'd hash the password
        'admin'
      ]);
      userId = createUserResult.rows[0].id;
    } else {
      userId = userResult.rows[0].id;
      console.log('Found existing admin user:', userResult.rows[0].email);
    }

    // Create API key
    const apiKeyId = `apk_${Date.now()}_admin`;
    const token = `pk_admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await pool.query(`
      INSERT INTO api_key (id, token, redacted, title, type, created_by, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
    `, [apiKeyId, token, token.substr(0, 8) + '...', 'Admin API Key', 'admin', userId]);

    console.log('Admin API Key created:', token);
    console.log('Use this key in your scripts.');
    
    return token;
    
  } catch (error) {
    console.error('Error creating admin API key:', error);
  } finally {
    await pool.end();
  }
}

createAdminApiKey();

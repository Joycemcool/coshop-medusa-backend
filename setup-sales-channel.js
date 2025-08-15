// Create sales channel and link to existing publishable key
const { Pool } = require('pg');

async function createSalesChannelAndLink() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
  });

  try {
    // First, check if a sales channel already exists
    const existingChannels = await pool.query(`SELECT * FROM sales_channel LIMIT 5`);
    console.log('Existing sales channels:', existingChannels.rows);

    let salesChannelId;
    
    if (existingChannels.rows.length === 0) {
      // Create a new sales channel
      salesChannelId = `sc_${Date.now()}_default`;
      await pool.query(`
        INSERT INTO sales_channel (id, name, description, is_disabled, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
      `, [salesChannelId, 'Default Store', 'Main sales channel for the store', false]);
      
      console.log('Created new sales channel:', salesChannelId);
    } else {
      salesChannelId = existingChannels.rows[0].id;
      console.log('Using existing sales channel:', salesChannelId);
    }

    // Now link the publishable key to the sales channel
    const publishableKeyId = 'apk_01K2B4MK53W30Z03J6EJXQQBRP'; // Your existing key ID
    
    // Check if the link already exists
    const existingLink = await pool.query(`
      SELECT * FROM publishable_api_key_sales_channel 
      WHERE publishable_key_id = $1 AND sales_channel_id = $2
    `, [publishableKeyId, salesChannelId]);

    if (existingLink.rows.length === 0) {
      // Create the link with proper ID
      const linkId = `paksc_${Date.now()}`;
      await pool.query(`
        INSERT INTO publishable_api_key_sales_channel (id, publishable_key_id, sales_channel_id, created_at, updated_at)
        VALUES ($1, $2, $3, NOW(), NOW())
      `, [linkId, publishableKeyId, salesChannelId]);
      
      console.log('Successfully linked publishable key to sales channel!');
    } else {
      console.log('Publishable key is already linked to sales channel');
    }

    // Verify the setup
    const verification = await pool.query(`
      SELECT pak.title, pak.token, sc.name as channel_name
      FROM api_key pak
      JOIN publishable_api_key_sales_channel paksc ON pak.id = paksc.publishable_key_id
      JOIN sales_channel sc ON paksc.sales_channel_id = sc.id
      WHERE pak.id = $1
    `, [publishableKeyId]);

    console.log('Verification - Key linked to channels:', verification.rows);
    
  } catch (error) {
    console.error('Error setting up sales channel:', error);
  } finally {
    await pool.end();
  }
}

createSalesChannelAndLink();

const { Pool } = require('pg');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
});

async function updateVendorDescriptions() {
  try {
    console.log('Updating vendor farm descriptions...');
    
    const vendorUpdates = [
      {
        name: 'Acadia Orchards',
        farm_description: 'A family-run orchard specializing in organic apples, pears, and seasonal fruits. Located in the beautiful Acadia region, we use sustainable farming practices passed down through generations.'
      },
      {
        name: 'Annapolis Valley Dairy',
        farm_description: 'Certified organic dairy farm producing fresh milk, cheese, and yogurt. Our pasture-raised cows graze on nutrient-rich grasses in the fertile Annapolis Valley.'
      },
      {
        name: 'Atlantic Coastal Harvest',
        farm_description: 'A cooperative of coastal farmers bringing you the freshest seafood and ocean vegetables. We work with local fishermen and seaweed harvesters to provide sustainable ocean-to-table products.'
      },
      {
        name: 'Bay of Fundy Farm',
        farm_description: 'Sustainable farming near the famous Bay of Fundy. We specialize in root vegetables and hardy greens that thrive in our unique coastal climate and mineral-rich soil.'
      },
      {
        name: 'Cape Breton Herbs',
        farm_description: 'Artisanal herb garden nestled in Cape Breton\'s pristine landscape. We grow over 30 varieties of culinary and medicinal herbs using traditional organic methods.'
      },
      {
        name: 'Gaspereau Valley Vineyard',
        farm_description: 'Organic vineyard and farm producing premium grapes and seasonal vegetables. Our terroir-driven approach creates exceptional produce with unique maritime flavors.'
      },
      {
        name: 'Joyce Ding',
        farm_description: 'Small-scale organic farm focused on high-quality vegetables and herbs. We use regenerative farming practices to grow nutrient-dense produce for our local community.'
      },
      {
        name: 'Maritimes Grains Farm',
        farm_description: 'Grain collective producing organic wheat, oats, and barley. We work with multiple farms across the Maritimes to provide locally-grown, stone-milled grains and flours.'
      },
      {
        name: 'Sunrise Ranch',
        farm_description: 'Grass-fed cattle ranch committed to ethical and sustainable farming. Our cattle roam freely on pastures, producing the highest quality beef and dairy products.'
      },
      {
        name: 'Test farmer name',
        farm_description: 'This is a test farm for development purposes. We grow a variety of test vegetables and products for quality assurance and system testing.'
      }
    ];

    for (const vendor of vendorUpdates) {
      const result = await pool.query(
        'UPDATE vendor SET farm_description = $1 WHERE name = $2',
        [vendor.farm_description, vendor.name]
      );
      
      if (result.rowCount > 0) {
        console.log(`✓ Updated ${vendor.name}`);
      } else {
        console.log(`✗ Could not find vendor: ${vendor.name}`);
      }
    }

    console.log('\nVendor descriptions updated successfully!');
    
    // Display current vendors with descriptions
    const vendors = await pool.query('SELECT name, farm_name, farm_description FROM vendor ORDER BY name');
    console.log('\nCurrent vendors:');
    vendors.rows.forEach(vendor => {
      console.log(`\n${vendor.name} (${vendor.farm_name || 'No farm name'})`);
      console.log(`Description: ${vendor.farm_description || 'No description'}`);
    });

  } catch (error) {
    console.error('Error updating vendor descriptions:', error);
  } finally {
    await pool.end();
  }
}

updateVendorDescriptions();

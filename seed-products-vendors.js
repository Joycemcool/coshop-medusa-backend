const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
});

// Product templates for different types of farms
const productTemplates = {
  'orchard': [
    { name: 'Organic Red Apples', price: 4.99, description: 'Fresh, crispy organic red apples grown without pesticides.' },
    { name: 'Honeycrisp Apples', price: 5.49, description: 'Sweet and juicy honeycrisp apples, perfect for snacking.' },
    { name: 'Apple Cider', price: 7.99, description: 'Fresh pressed apple cider made from our own apples.' }
  ],
  'dairy': [
    { name: 'Organic Whole Milk', price: 3.99, description: 'Fresh organic whole milk from grass-fed cows.' },
    { name: 'Artisan Cheese', price: 12.99, description: 'Handcrafted artisan cheese made with traditional methods.' },
    { name: 'Farm Fresh Butter', price: 6.49, description: 'Creamy butter churned from fresh cream.' }
  ],
  'herbs': [
    { name: 'Fresh Basil', price: 2.99, description: 'Aromatic fresh basil perfect for cooking and garnishing.' },
    { name: 'Dried Oregano', price: 4.49, description: 'Premium dried oregano with intense flavor.' },
    { name: 'Herb Seasoning Mix', price: 7.99, description: 'Blend of our finest herbs for all-purpose seasoning.' }
  ],
  'vegetables': [
    { name: 'Organic Tomatoes', price: 3.49, description: 'Vine-ripened organic tomatoes bursting with flavor.' },
    { name: 'Fresh Lettuce', price: 2.99, description: 'Crisp and fresh lettuce perfect for salads.' },
    { name: 'Farm Carrots', price: 2.49, description: 'Sweet and crunchy carrots grown in rich soil.' }
  ],
  'grains': [
    { name: 'Organic Wheat Flour', price: 8.99, description: 'Stone-ground organic wheat flour for baking.' },
    { name: 'Wild Rice', price: 12.49, description: 'Premium wild rice with nutty flavor and texture.' },
    { name: 'Quinoa', price: 9.99, description: 'Protein-rich quinoa perfect for healthy meals.' }
  ],
  'vineyard': [
    { name: 'Chardonnay Wine', price: 24.99, description: 'Elegant Chardonnay with crisp finish and floral notes.' },
    { name: 'Red Wine Blend', price: 28.99, description: 'Rich red wine blend with complex flavors and smooth finish.' },
    { name: 'Grape Juice', price: 6.99, description: 'Pure grape juice made from our finest grapes.' }
  ],
  'default': [
    { name: 'Seasonal Vegetables', price: 4.99, description: 'Fresh seasonal vegetables grown with care.' },
    { name: 'Farm Fresh Eggs', price: 5.99, description: 'Free-range eggs from happy, healthy chickens.' },
    { name: 'Organic Honey', price: 11.99, description: 'Pure organic honey harvested from our beehives.' }
  ]
};

function getProductCategory(farmName, vendorName) {
  const name = (farmName + ' ' + vendorName).toLowerCase();
  if (name.includes('orchard') || name.includes('apple')) return 'orchard';
  if (name.includes('dairy')) return 'dairy';
  if (name.includes('herb')) return 'herbs';
  if (name.includes('vineyard') || name.includes('wine')) return 'vineyard';
  if (name.includes('grain')) return 'grains';
  if (name.includes('vegetable') || name.includes('harvest') || name.includes('coastal')) return 'vegetables';
  return 'default';
}

async function seedProductsForVendors() {
  try {
    console.log('🌱 Starting to seed products for vendors...\n');

    // Get all vendors
    const vendorsResult = await pool.query('SELECT id, name, farm_name FROM vendors WHERE is_active = true ORDER BY name;');
    console.log(`📋 Found ${vendorsResult.rows.length} active vendors\n`);

    let totalProductsCreated = 0;
    let totalFeaturedProducts = 0;

    for (const vendor of vendorsResult.rows) {
      console.log(`🚜 Creating products for: ${vendor.farm_name || vendor.name}`);
      
      // Determine product category based on vendor name
      const category = getProductCategory(vendor.farm_name || '', vendor.name || '');
      const products = productTemplates[category] || productTemplates.default;
      
      console.log(`   Category: ${category}`);

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const isFeatured = Math.random() > 0.5; // 50% chance of being featured
        const featuredPriority = isFeatured ? Math.floor(Math.random() * 10) + 1 : null;
        
        // Create product with a unique handle
        const handle = `${product.name.toLowerCase().replace(/\s+/g, '-')}-${vendor.id}-${i}`;
        
        const insertResult = await pool.query(`
          INSERT INTO product (
            id,
            title, 
            description, 
            handle, 
            status, 
            vendor_id,
            vendor_price,
            is_featured,
            featured_priority,
            created_at,
            updated_at,
            discountable,
            is_giftcard
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), true, false)
          RETURNING id, title, is_featured;
        `, [
          `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Generate unique ID
          product.name,
          product.description,
          handle,
          'published',
          vendor.id,
          product.price,
          isFeatured,
          featuredPriority
        ]);

        const createdProduct = insertResult.rows[0];
        totalProductsCreated++;
        
        if (isFeatured) {
          totalFeaturedProducts++;
          console.log(`   ✨ ${createdProduct.title} (FEATURED - Priority: ${featuredPriority})`);
        } else {
          console.log(`   📦 ${createdProduct.title}`);
        }
      }
      console.log('');
    }

    console.log('🎉 Product seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Total products created: ${totalProductsCreated}`);
    console.log(`   - Featured products: ${totalFeaturedProducts}`);
    console.log(`   - Regular products: ${totalProductsCreated - totalFeaturedProducts}`);

  } catch (error) {
    console.error('❌ Error seeding products:', error);
  } finally {
    await pool.end();
  }
}

// Run the seeding
seedProductsForVendors();

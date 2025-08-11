const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:9000';

// Define vendor data - All located in Nova Scotia, Canada
const vendorData = [
  {
    id: "vendor_001",
    name: "Green Valley Farm",
    email: "farm@greenvalley.com",
    farm_name: "Green Valley Organic Farm",
    location: "Truro, Nova Scotia, Canada",
    description: "Organic vegetables and sustainable farming practices since 1995",
    commission_rate: 0.15,
    category: "Vegetables",
    is_active: true,
  },
  {
    id: "vendor_002", 
    name: "Annapolis Valley Dairy",
    email: "contact@annapolisdairy.com",
    farm_name: "Annapolis Valley Organic Dairy",
    location: "Kentville, Nova Scotia, Canada",
    description: "Fresh organic dairy products from grass-fed cows",
    commission_rate: 0.12,
    category: "Dairy",
    is_active: true,
  },
  {
    id: "vendor_003",
    name: "Sunrise Ranch",
    email: "info@sunriseranch.com", 
    farm_name: "Sunrise Cattle Ranch",
    location: "New Glasgow, Nova Scotia, Canada",
    description: "Premium grass-fed beef and free-range poultry",
    commission_rate: 0.18,
    category: "Meat",
    is_active: true,
  },
  {
    id: "vendor_004",
    name: "Atlantic Coastal Harvest",
    email: "hello@atlanticcoastal.com",
    farm_name: "Atlantic Coastal Harvest Co-op",
    location: "Lunenburg, Nova Scotia, Canada", 
    description: "Fresh seafood and coastal produce delivered daily",
    commission_rate: 0.16,
    category: "Seafood",
    is_active: true,
  },
  {
    id: "vendor_005",
    name: "Maritimes Grains Farm",
    email: "farmers@maritimesgrains.com",
    farm_name: "Maritimes Grains Collective",
    location: "Amherst, Nova Scotia, Canada",
    description: "Organic grains, cereals, and artisan breads",
    commission_rate: 0.14,
    category: "Grains",
    is_active: true,
  },
  {
    id: "vendor_006",
    name: "Acadia Orchards",
    email: "orders@acadiaorchards.com",
    farm_name: "Acadia Fruit Orchards",
    location: "Wolfville, Nova Scotia, Canada",
    description: "Fresh seasonal fruits and handcrafted preserves",
    commission_rate: 0.13,
    category: "Fruits",
    is_active: true,
  },
  {
    id: "vendor_007",
    name: "Bay of Fundy Farm",
    email: "info@bayoffundyfarm.com",
    farm_name: "Bay of Fundy Sustainable Farm",
    location: "Digby, Nova Scotia, Canada",
    description: "Tidal-influenced crops and specialty vegetables",
    commission_rate: 0.17,
    category: "Vegetables",
    is_active: true,
  },
  {
    id: "vendor_008",
    name: "Cape Breton Herbs",
    email: "contact@capebretonherbs.com",
    farm_name: "Cape Breton Herb Garden",
    location: "Sydney, Nova Scotia, Canada",
    description: "Fresh herbs, medicinal plants, and herbal products",
    commission_rate: 0.19,
    category: "Herbs",
    is_active: true,
  },
  {
    id: "vendor_009",
    name: "Gaspereau Valley Vineyard",
    email: "wine@gaspereau.com",
    farm_name: "Gaspereau Valley Organic Vineyard",
    location: "Gaspereau Valley, Nova Scotia, Canada",
    description: "Award-winning wines and farm-to-table experiences",
    commission_rate: 0.20,
    category: "Wine",
    is_active: true,
  }
];

async function recreateVendors() {
  console.log('🌾 Recreating vendors with Nova Scotia locations...');
  
  try {
    // First try to get admin token
    const loginResponse = await fetch(`${API_BASE_URL}/auth/user/emailpass`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@coshop.com',
        password: 'supersecret123'
      })
    });
    
    if (!loginResponse.ok) {
      console.error('❌ Failed to login as admin');
      return;
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.token;
    console.log('✅ Admin login successful');
    
    // Get existing vendors first
    const vendorsResponse = await fetch(`${API_BASE_URL}/admin/vendors`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!vendorsResponse.ok) {
      console.error('❌ Failed to get existing vendors');
      return;
    }
    
    const existingVendors = await vendorsResponse.json();
    console.log(`📋 Found ${existingVendors.vendors?.length || 0} existing vendors`);
    
    // Delete existing vendors first
    if (existingVendors.vendors && existingVendors.vendors.length > 0) {
      console.log('🗑️ Deleting existing vendors...');
      for (const vendor of existingVendors.vendors) {
        try {
          const deleteResponse = await fetch(`${API_BASE_URL}/admin/vendors/${vendor.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (deleteResponse.ok) {
            console.log(`✅ Deleted vendor: ${vendor.name}`);
          } else {
            console.log(`⚠️ Could not delete vendor ${vendor.name} (might not support deletion)`);
          }
        } catch (error) {
          console.log(`⚠️ Error deleting vendor ${vendor.name}:`, error.message);
        }
      }
    }
    
    console.log('🌾 Creating new Nova Scotia vendors...');
    
    // Create vendors with Nova Scotia data
    for (let i = 0; i < vendorData.length; i++) {
      const vendor = vendorData[i];
      console.log(`🌾 Creating vendor ${i + 1}/${vendorData.length}: ${vendor.name}`);
      
      try {
        const response = await fetch(`${API_BASE_URL}/admin/vendors`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(vendor)
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log(`✅ Created vendor: ${vendor.name} -> ${vendor.location}`);
        } else {
          const error = await response.text();
          console.error(`❌ Failed to create vendor ${vendor.name}:`, error);
        }
      } catch (error) {
        console.error(`❌ Error creating vendor ${vendor.name}:`, error);
      }
    }
    
    console.log('🎉 Vendor recreation process completed');
    
    // Verify new vendors
    console.log('🔍 Verifying new vendors...');
    const newVendorsResponse = await fetch(`${API_BASE_URL}/admin/vendors`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (newVendorsResponse.ok) {
      const newVendorsData = await newVendorsResponse.json();
      console.log(`✅ Total vendors in database: ${newVendorsData.vendors?.length || 0}`);
      console.log('📍 Nova Scotia locations:');
      newVendorsData.vendors?.forEach(v => {
        console.log(`   - ${v.name}: ${v.location}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error in vendor recreation process:', error);
  }
}

recreateVendors();

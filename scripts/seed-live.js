/**
 * Live Co-Shop Marketplace Seeder
 * Actually creates vendor data using your current API endpoints
 */

const API_BASE_URL = 'http://localhost:9000';

// Login credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@coshop.com',
  password: 'supersecret123'
};

// Enhanced vendor data for Co-Shop Farm Experience Marketplace
const VENDORS_TO_CREATE = [
  // 1. Farm Experiences (Adventure & Activities)
  {
    name: "Sunset Ridge Adventure Farm",
    email: "adventures@sunsetridge.com",
    farm_name: "Sunset Ridge Adventure Farm",
    farm_description: "Horseback riding, farm tours, and outdoor adventures. Perfect for families and groups seeking authentic farm experiences.",
    location: "Sonoma County, California",
    commission_rate: 0.20,
    is_active: true,
    category: "experiences",
    services: ["horseback riding", "farm tours", "team building", "educational visits"]
  },
  {
    name: "Golden Valley Ranch",
    email: "info@goldenvalleyranch.com", 
    farm_name: "Golden Valley Ranch & Experience Center",
    farm_description: "Interactive farm experiences including animal feeding, tractor rides, and seasonal festivals. Educational programs for schools.",
    location: "Paso Robles, California",
    commission_rate: 0.18,
    is_active: true,
    category: "experiences",
    services: ["animal interactions", "tractor rides", "seasonal festivals", "school programs"]
  },

  // 2. Vegetable Farms (Fresh Produce)
  {
    name: "Green Earth Organic",
    email: "harvest@greenearth.com",
    farm_name: "Green Earth Organic Farms",
    farm_description: "Certified organic vegetables, herbs, and seasonal produce. Farm-to-table freshness with sustainable farming practices.",
    location: "Salinas Valley, California",
    commission_rate: 0.15,
    is_active: true,
    category: "vegetables",
    services: ["fresh produce", "CSA boxes", "pick-your-own", "farmers markets"]
  },
  {
    name: "Heritage Vegetable Co.",
    email: "orders@heritageveg.com",
    farm_name: "Heritage Vegetable Company",
    farm_description: "Heirloom and specialty vegetables grown using traditional methods. Unique varieties for restaurants and home cooks.",
    location: "Santa Barbara County, California", 
    commission_rate: 0.16,
    is_active: true,
    category: "vegetables",
    services: ["heirloom varieties", "restaurant supply", "specialty produce", "seed sales"]
  },

  // 3. Meat Farms (Livestock & Butcher)
  {
    name: "Prairie Wind Livestock",
    email: "orders@prairiewind.com",
    farm_name: "Prairie Wind Livestock Farm",
    farm_description: "Grass-fed beef and free-range poultry. Humane treatment and sustainable grazing practices. Custom processing available.",
    location: "Central Valley, California",
    commission_rate: 0.22,
    is_active: true,
    category: "meat",
    services: ["grass-fed beef", "free-range poultry", "custom processing", "bulk orders"]
  },
  {
    name: "Mountain Meadow Meats",
    email: "contact@mountainmeadow.com",
    farm_name: "Mountain Meadow Meat Company", 
    farm_description: "Premium lamb, pork, and specialty meats. Family ranch with three generations of livestock expertise.",
    location: "Mendocino County, California",
    commission_rate: 0.20,
    is_active: false, // Pending approval
    category: "meat",
    services: ["premium lamb", "heritage pork", "specialty cuts", "farm visits"]
  },

  // 4. Farm Stays (Accommodation & Retreats)
  {
    name: "Willow Creek Farm Stay",
    email: "bookings@willowcreek.com",
    farm_name: "Willow Creek Farm Stay & Cottages",
    farm_description: "Charming farm cottages for peaceful retreats. Wake up to roosters, enjoy farm-fresh breakfast, and experience rural tranquility.",
    location: "Wine Country, California",
    commission_rate: 0.25,
    is_active: true,
    category: "accommodation",
    services: ["cottage rentals", "farm breakfast", "wine tours", "romantic getaways"]
  },
  {
    name: "Rustic Oak Farm Retreat",
    email: "stay@rustickoak.com",
    farm_name: "Rustic Oak Farm Retreat Center",
    farm_description: "Luxury farm accommodation with spa services, yoga retreats, and farm-to-table dining. Perfect for wellness escapes.",
    location: "Big Sur, California",
    commission_rate: 0.28,
    is_active: true,
    category: "accommodation", 
    services: ["luxury accommodation", "spa services", "yoga retreats", "farm dining"]
  }
];

class MarketplaceSeeder {
  constructor() {
    this.token = null;
  }

  async login() {
    console.log('🔑 Logging in as admin...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/user/emailpass`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ADMIN_CREDENTIALS)
      });

      if (response.ok) {
        const data = await response.json();
        this.token = data.token;
        console.log('✅ Admin login successful');
        return true;
      } else {
        console.error('❌ Login failed:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Login error:', error.message);
      return false;
    }
  }

  async createVendor(vendorData) {
    if (!this.token) {
      throw new Error('Not authenticated. Please login first.');
    }

    console.log(`📝 Creating vendor: ${vendorData.name}...`);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/vendors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(vendorData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Created: ${vendorData.name} (ID: ${result.vendor.id})`);
        return result.vendor;
      } else {
        const error = await response.text();
        console.error(`❌ Failed to create ${vendorData.name}:`, error);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error creating ${vendorData.name}:`, error.message);
      return null;
    }
  }

  async listVendors() {
    console.log('📋 Fetching current vendors...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/vendors`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`📊 Current vendors in system: ${data.vendors.length}`);
        data.vendors.forEach((vendor, index) => {
          console.log(`${index + 1}. ${vendor.name} (${vendor.email}) - ${vendor.is_active ? 'Active' : 'Pending'}`);
        });
        return data.vendors;
      } else {
        console.error('❌ Failed to fetch vendors:', response.status);
        return [];
      }
    } catch (error) {
      console.error('❌ Error fetching vendors:', error.message);
      return [];
    }
  }

  async seedAll() {
    console.log('🌱 Starting Co-Shop Marketplace Seeding...\n');

    // Step 1: Login
    const loginSuccess = await this.login();
    if (!loginSuccess) {
      console.log('❌ Seeding aborted due to login failure');
      return;
    }

    // Step 2: Show current state
    console.log('\n📊 Before seeding:');
    await this.listVendors();

    // Step 3: Create new vendors
    console.log('\n🏪 Creating new vendors...');
    let successCount = 0;
    
    for (const vendorData of VENDORS_TO_CREATE) {
      const result = await this.createVendor(vendorData);
      if (result) {
        successCount++;
      }
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Step 4: Show final state
    console.log('\n📊 After seeding:');
    await this.listVendors();

    // Step 5: Summary
    console.log('\n🎉 Co-Shop Farm Experience Marketplace Seeding Complete!');
    console.log(`✅ Successfully created: ${successCount}/${VENDORS_TO_CREATE.length} farm partners`);
    console.log('\n🏪 Farm Categories Added:');
    console.log('� Experiences: Adventure farms with horseback riding & tours');
    console.log('🥕 Vegetables: Organic produce & farm-fresh vegetables'); 
    console.log('🥩 Meat: Grass-fed livestock & premium meat products');
    console.log('🏡 Accommodation: Farm stays, cottages & retreat centers');
    console.log('\n💡 Test these farm partners at: http://localhost:3000/test-backend');
  }
}

// Test connection function
async function testConnection() {
  console.log('🔍 Testing API connection...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/store/test`, {
      headers: {
        'x-publishable-api-key': 'pk_7733e352d0f19809a78038c1f0ce5c31bf9a3c5dd90da3bb63f0e46242635e82'
      }
    });
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API connection successful:', data.message);
      return true;
    } else {
      console.log('❌ API connection failed:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ API connection error:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🚀 Co-Shop Marketplace Seeder\n');
  
  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.log('💡 Make sure your MedusaJS server is running: npx medusa develop');
    return;
  }

  // Run the seeder
  const seeder = new MarketplaceSeeder();
  await seeder.seedAll();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { MarketplaceSeeder, VENDORS_TO_CREATE };

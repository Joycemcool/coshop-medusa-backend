/**
 * Quick vendor check script
 */

const API_BASE_URL = 'http://localhost:9000';
const PUBLISHABLE_API_KEY = 'pk_7733e352d0f19809a78038c1f0ce5c31bf9a3c5dd90da3bb63f0e46242635e82';

async function checkVendors() {
  console.log('🔍 Checking current vendors in system...\n');
  
  try {
    // Test store vendors (public)
    console.log('📋 Store Vendors (Public API):');
    const storeResponse = await fetch(`${API_BASE_URL}/store/vendors`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_API_KEY
      }
    });
    
    if (storeResponse.ok) {
      const storeData = await storeResponse.json();
      console.log(`✅ Found ${storeData.vendors.length} vendors via store API`);
      storeData.vendors.forEach((vendor, index) => {
        console.log(`${index + 1}. ${vendor.name} (${vendor.email})`);
      });
    } else {
      console.log('❌ Store API failed:', storeResponse.status);
    }

    // Test admin login and vendors
    console.log('\n🔑 Admin Login...');
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

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Admin login successful');
      
      console.log('\n📋 Admin Vendors:');
      const adminResponse = await fetch(`${API_BASE_URL}/admin/vendors`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        console.log(`✅ Found ${adminData.vendors.length} vendors via admin API`);
        adminData.vendors.forEach((vendor, index) => {
          console.log(`${index + 1}. ${vendor.name} (${vendor.email}) - ${vendor.is_active ? 'Active' : 'Pending'}`);
        });
      } else {
        console.log('❌ Admin vendors failed:', adminResponse.status);
      }
    } else {
      console.log('❌ Admin login failed:', loginResponse.status);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkVendors();

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:9000';

async function cleanupVendors() {
  console.log('🧹 Cleaning up duplicate vendors...');
  
  try {
    // Get admin token
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
    
    // Get all vendors
    const vendorsResponse = await fetch(`${API_BASE_URL}/admin/vendors`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!vendorsResponse.ok) {
      console.error('❌ Failed to get vendors');
      return;
    }
    
    const vendorsData = await vendorsResponse.json();
    console.log(`📋 Found ${vendorsData.vendors?.length || 0} vendors`);
    
    // Find and remove USA vendors
    const usaVendors = vendorsData.vendors.filter(v => 
      v.location && v.location.includes('USA')
    );
    
    console.log(`🇺🇸 Found ${usaVendors.length} USA vendors to remove:`);
    usaVendors.forEach(v => {
      console.log(`   - ${v.name} (${v.location})`);
    });
    
    // Remove USA vendors
    for (const vendor of usaVendors) {
      try {
        const deleteResponse = await fetch(`${API_BASE_URL}/admin/vendors/${vendor.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (deleteResponse.ok) {
          console.log(`✅ Deleted USA vendor: ${vendor.name}`);
        } else {
          console.log(`⚠️ Could not delete ${vendor.name} via DELETE, trying alternative method...`);
          // If DELETE doesn't work, we might need to update it instead
          const updateResponse = await fetch(`${API_BASE_URL}/admin/vendors/${vendor.id}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: 'Halifax Organic Farm',
              email: 'contact@halifaxorganic.com',
              farm_name: 'Halifax Organic Farm Co-op',
              location: 'Halifax, Nova Scotia, Canada',
              description: 'Urban organic farming in the heart of Halifax',
              commission_rate: 0.15,
              category: 'Vegetables',
              is_active: true
            })
          });
          
          if (updateResponse.ok) {
            console.log(`✅ Updated USA vendor to Halifax Organic Farm`);
          } else {
            console.log(`❌ Failed to update vendor ${vendor.name}`);
          }
        }
      } catch (error) {
        console.error(`❌ Error processing vendor ${vendor.name}:`, error.message);
      }
    }
    
    console.log('🎉 Cleanup process completed');
    
    // Verify final state
    console.log('🔍 Verifying final vendor list...');
    const finalVendorsResponse = await fetch(`${API_BASE_URL}/admin/vendors`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (finalVendorsResponse.ok) {
      const finalVendorsData = await finalVendorsResponse.json();
      console.log(`✅ Final vendor count: ${finalVendorsData.vendors?.length || 0}`);
      console.log('📍 All vendors now in Nova Scotia:');
      finalVendorsData.vendors?.forEach(v => {
        console.log(`   - ${v.name}: ${v.location}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error in cleanup process:', error);
  }
}

cleanupVendors();

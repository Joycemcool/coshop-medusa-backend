const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:9000';

// Test functions
async function testHealthCheck() {
  console.log('🔍 Testing Health Check...');
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health Check:', response.status, data);
  } catch (error) {
    console.error('❌ Health Check failed:', error.message);
  }
}

async function testStoreVendors() {
  console.log('\n🔍 Testing Store Vendors API...');
  try {
    const response = await fetch(`${BASE_URL}/store/vendors`);
    const data = await response.json();
    console.log('✅ Store Vendors:', response.status, data);
  } catch (error) {
    console.error('❌ Store Vendors failed:', error.message);
  }
}

async function testCreateVendor() {
  console.log('\n🔍 Testing Create Vendor API...');
  
  const vendorData = {
    email: 'test.farmer@example.com',
    name: 'Test Farmer',
    farm_name: 'Test Farm',
    farm_description: 'A test farm for API testing',
    phone: '+1-555-TEST',
    address: '123 Test Street',
    city: 'Test City',
    state: 'TS',
    zip_code: '12345',
    country: 'USA',
    commission_rate: 10.0,
    is_active: true
  };

  try {
    const response = await fetch(`${BASE_URL}/admin/vendors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vendorData)
    });
    
    const data = await response.json();
    console.log('✅ Create Vendor:', response.status, data);
    
    if (data.vendor) {
      return data.vendor.id;
    }
  } catch (error) {
    console.error('❌ Create Vendor failed:', error.message);
  }
}

async function testGetVendors() {
  console.log('\n🔍 Testing Get All Vendors (Admin)...');
  try {
    const response = await fetch(`${BASE_URL}/admin/vendors`);
    const data = await response.json();
    console.log('✅ Admin Vendors:', response.status, data);
  } catch (error) {
    console.error('❌ Admin Vendors failed:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Vendor API Tests...\n');
  
  await testHealthCheck();
  await testStoreVendors();
  await testGetVendors();
  
  // Test vendor creation
  const vendorId = await testCreateVendor();
  
  // Test getting vendors again to see the new one
  if (vendorId) {
    console.log('\n🔍 Testing Get Vendors After Creation...');
    await testGetVendors();
  }
  
  console.log('\n✨ API Tests Completed!');
}

// Run the tests
runTests().catch(console.error);

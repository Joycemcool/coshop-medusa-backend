// Simple test script to debug authentication issues
const fetch = require('node-fetch');

async function testAuthentication() {
    const baseUrl = 'http://localhost:9000';
    
    console.log('🔧 Testing Co-Shop Vendor API Authentication...\n');
    
    // Test 1: Health check
    console.log('1. Testing Health Check...');
    try {
        const healthResponse = await fetch(`${baseUrl}/health`);
        console.log(`   Status: ${healthResponse.status}`);
        const healthData = await healthResponse.text();
        console.log(`   Response: ${healthData}\n`);
    } catch (error) {
        console.log(`   Error: ${error.message}\n`);
    }
    
    // Test 2: Store vendors (no auth needed)
    console.log('2. Testing Store Vendors (No Auth)...');
    try {
        const storeResponse = await fetch(`${baseUrl}/store/vendors`);
        console.log(`   Status: ${storeResponse.status}`);
        const storeData = await storeResponse.text();
        console.log(`   Response: ${storeData}\n`);
    } catch (error) {
        console.log(`   Error: ${error.message}\n`);
    }
    
    // Test 3: Admin authentication
    console.log('3. Testing Admin Authentication...');
    try {
        const authResponse = await fetch(`${baseUrl}/auth/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@coshop.com',
                password: 'supersecret123'
            })
        });
        
        console.log(`   Status: ${authResponse.status}`);
        const authData = await authResponse.text();
        console.log(`   Response: ${authData}`);
        
        // Get cookies from headers
        const cookies = authResponse.headers.get('set-cookie');
        console.log(`   Cookies: ${cookies}\n`);
        
        if (authResponse.status === 200 && cookies) {
            // Test 4: Admin vendors with authentication
            console.log('4. Testing Admin Vendors (With Auth)...');
            const adminResponse = await fetch(`${baseUrl}/admin/vendors`, {
                headers: {
                    'Cookie': cookies
                }
            });
            
            console.log(`   Status: ${adminResponse.status}`);
            const adminData = await adminResponse.text();
            console.log(`   Response: ${adminData}\n`);
        }
        
    } catch (error) {
        console.log(`   Error: ${error.message}\n`);
    }
    
    // Test 5: Check if admin users endpoint works
    console.log('5. Testing Admin Users Endpoint...');
    try {
        const usersResponse = await fetch(`${baseUrl}/admin/users`);
        console.log(`   Status: ${usersResponse.status}`);
        const usersData = await usersResponse.text();
        console.log(`   Response: ${usersData.substring(0, 200)}...\n`);
    } catch (error) {
        console.log(`   Error: ${error.message}\n`);
    }
}

testAuthentication().catch(console.error);

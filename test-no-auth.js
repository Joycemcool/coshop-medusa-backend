// Test without authentication first
const fetch = require('node-fetch');

async function testWithoutAuth() {
    const baseUrl = 'http://localhost:9000';
    
    console.log('🔧 Testing APIs without Authentication...\n');
    
    // Test 1: Health check
    console.log('1. Health Check...');
    try {
        const response = await fetch(`${baseUrl}/health`);
        console.log(`   Status: ${response.status}`);
        const data = await response.text();
        console.log(`   Response: ${data}\n`);
    } catch (error) {
        console.log(`   Error: ${error.message}\n`);
    }
    
    // Test 2: Store vendors (should work without auth)
    console.log('2. Store Vendors (No Auth Required)...');
    try {
        const response = await fetch(`${baseUrl}/store/vendors`);
        console.log(`   Status: ${response.status}`);
        const data = await response.text();
        console.log(`   Response: ${data}\n`);
    } catch (error) {
        console.log(`   Error: ${error.message}\n`);
    }
    
    // Test 3: Try some built-in MedusaJS endpoints
    console.log('3. Built-in Store Products...');
    try {
        const response = await fetch(`${baseUrl}/store/products`);
        console.log(`   Status: ${response.status}`);
        const data = await response.text();
        console.log(`   Response: ${data.substring(0, 200)}...\n`);
    } catch (error) {
        console.log(`   Error: ${error.message}\n`);
    }
    
    // Test 4: Check if our API routes are even being registered
    console.log('4. Testing Route Registration...');
    const testRoutes = [
        '/store/vendors',
        '/admin/vendors',
        '/store/products',
        '/admin/products'
    ];
    
    for (const route of testRoutes) {
        try {
            const response = await fetch(`${baseUrl}${route}`);
            console.log(`   ${route}: ${response.status} ${response.statusText}`);
        } catch (error) {
            console.log(`   ${route}: Error - ${error.message}`);
        }
    }
}

testWithoutAuth().catch(console.error);

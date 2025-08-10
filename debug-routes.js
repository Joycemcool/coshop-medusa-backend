// Test what's actually happening with our routes
const fetch = require('node-fetch');

async function debugRoutes() {
    const baseUrl = 'http://localhost:9000';
    
    console.log('🔍 Debugging Co-Shop API Routes...\n');
    
    // Test various endpoints with full debugging
    const endpoints = [
        { method: 'GET', url: '/health' },
        { method: 'GET', url: '/store/test' },
        { method: 'GET', url: '/store/vendors' },
        { method: 'GET', url: '/store/products' }
    ];
    
    for (const endpoint of endpoints) {
        console.log(`\n📡 Testing: ${endpoint.method} ${endpoint.url}`);
        try {
            const options = {
                method: endpoint.method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-publishable-api-key': 'pk_7733e352d0f19809a78038c1f0ce5c31bf9a3c5dd90da3bb63f0e46242635e82'
                }
            };
            
            const response = await fetch(`${baseUrl}${endpoint.url}`, options);
            
            console.log(`   Status: ${response.status} ${response.statusText}`);
            console.log(`   Headers:`, Object.fromEntries(response.headers.entries()));
            
            const contentType = response.headers.get('content-type');
            let responseData;
            
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }
            
            console.log(`   Response:`, responseData);
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
    }
}

debugRoutes().catch(console.error);

// Test JWT token authentication
const fetch = require('node-fetch');

async function testJWTAuthentication() {
    const baseUrl = 'http://localhost:9000';
    
    console.log('🔧 Testing JWT Token Authentication...\n');
    
    // Step 1: Get JWT token
    console.log('1. Getting JWT Token...');
    try {
        const authResponse = await fetch(`${baseUrl}/auth/user/emailpass`, {
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
        
        if (authResponse.status === 200) {
            const authData = await authResponse.json();
            const token = authData.token;
            console.log(`   Token: ${token.substring(0, 50)}...\n`);
            
            // Step 2: Test admin endpoints with JWT token
            console.log('2. Testing Admin Endpoints with JWT Token...');
            
            const adminResponse = await fetch(`${baseUrl}/admin/vendors`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(`   Status: ${adminResponse.status}`);
            const adminData = await adminResponse.text();
            console.log(`   Response: ${adminData}\n`);
            
            // Step 3: Try creating a vendor
            if (adminResponse.status === 200) {
                console.log('3. Testing Create Vendor...');
                const createResponse = await fetch(`${baseUrl}/admin/vendors`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: 'test.farmer@example.com',
                        name: 'Test Farmer',
                        farm_name: 'Test Farm',
                        farm_description: 'A test farm for demonstration',
                        phone: '+1-555-TEST',
                        address: '123 Test Street',
                        city: 'Test City',
                        state: 'CA',
                        zip_code: '12345',
                        country: 'USA',
                        commission_rate: 10.0,
                        is_active: true
                    })
                });
                
                console.log(`   Status: ${createResponse.status}`);
                const createData = await createResponse.text();
                console.log(`   Response: ${createData}`);
            }
        }
        
    } catch (error) {
        console.log(`   Error: ${error.message}`);
    }
}

testJWTAuthentication().catch(console.error);

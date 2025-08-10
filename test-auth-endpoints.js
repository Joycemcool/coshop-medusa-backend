// Test different authentication endpoints
const fetch = require('node-fetch');

async function testDifferentAuthEndpoints() {
    const baseUrl = 'http://localhost:9000';
    const credentials = {
        email: 'admin@coshop.com',
        password: 'supersecret123'
    };
    
    console.log('🔧 Testing Different Authentication Endpoints...\n');
    
    // Try different auth endpoints
    const authEndpoints = [
        '/auth/session',
        '/auth/user/emailpass',
        '/admin/auth',
        '/admin/auth/session',
        '/admin/auth/login',
        '/app/login'
    ];
    
    for (const endpoint of authEndpoints) {
        console.log(`Testing: POST ${endpoint}`);
        try {
            const response = await fetch(`${baseUrl}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
            
            console.log(`   Status: ${response.status}`);
            const data = await response.text();
            console.log(`   Response: ${data.substring(0, 100)}...`);
            
            const cookies = response.headers.get('set-cookie');
            if (cookies) {
                console.log(`   Cookies: ${cookies.substring(0, 50)}...`);
            }
            console.log('');
            
        } catch (error) {
            console.log(`   Error: ${error.message}\n`);
        }
    }
}

testDifferentAuthEndpoints().catch(console.error);

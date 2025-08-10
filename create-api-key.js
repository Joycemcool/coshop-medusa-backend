// Create API key programmatically
const fetch = require('node-fetch');

async function createAPIKey() {
    const baseUrl = 'http://localhost:9000';
    
    console.log('🔑 Creating Publishable API Key...\n');
    
    // Step 1: Get JWT token
    console.log('1. Getting admin JWT token...');
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
    
    if (authResponse.status !== 200) {
        console.log('❌ Failed to get JWT token');
        return;
    }
    
    const authData = await authResponse.json();
    const token = authData.token;
    console.log('✅ Got JWT token');
    
    // Step 2: Create publishable API key
    console.log('2. Creating publishable API key...');
    const keyResponse = await fetch(`${baseUrl}/admin/api-keys`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: 'Co-Shop Store Key',
            type: 'publishable'
        })
    });
    
    console.log(`   Status: ${keyResponse.status}`);
    
    if (keyResponse.status === 201 || keyResponse.status === 200) {
        const keyData = await keyResponse.json();
        console.log('✅ API Key created successfully!');
        console.log('📋 Copy this key for your frontend:');
        console.log(`   ${keyData.api_key ? keyData.api_key.token : keyData.token}`);
        return keyData;
    } else {
        const errorData = await keyResponse.text();
        console.log('❌ Failed to create API key');
        console.log(`   Error: ${errorData}`);
    }
}

createAPIKey().catch(console.error);

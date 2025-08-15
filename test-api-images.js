// Test script to add images via our API
const fetch = require('node-fetch');

async function addTestImageViaAPI() {
  try {
    console.log('🔍 Checking backend health...');
    const healthResponse = await fetch('http://localhost:9000/health');
    console.log(`Backend status: ${healthResponse.status}`);
    
    // Test our image API for product 1
    console.log('\n🔍 Testing image API for product 1...');
    const response = await fetch('http://localhost:9000/custom/products/1/images-direct');
    const data = await response.json();
    console.log('Current images for product 1:', data);
    
    // Try a few different product IDs
    for (let productId = 1; productId <= 10; productId++) {
      try {
        const testResponse = await fetch(`http://localhost:9000/custom/products/${productId}/images-direct`);
        const testData = await testResponse.json();
        console.log(`Product ${productId}: ${testData.count} images`);
        
        if (testData.count > 0) {
          console.log(`✅ Found images for product ${productId}:`, testData.data[0]);
          return productId; // Return the first product with images
        }
      } catch (error) {
        console.log(`❌ Error checking product ${productId}:`, error.message);
      }
    }
    
    console.log('\n🔍 No existing images found. Let\'s add a test image manually to product 1...');
    
    // Use our direct database API to add an image
    const addImageResponse = await fetch('http://localhost:9000/custom/products/1/images-direct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        original_url: 'http://localhost:9000/custom/uploads/images/original/test-tomatos.png',
        medium_url: 'http://localhost:9000/custom/uploads/images/medium/test-tomatos.png',
        thumbnail_url: 'http://localhost:9000/custom/uploads/images/thumbnail/test-tomatos.png',
        alt_text: 'Fresh Red Tomatoes',
        file_name: 'test-tomatos.png',
        file_size: 1024,
        width: 800,
        height: 600
      })
    });
    
    if (addImageResponse.ok) {
      const addResult = await addImageResponse.json();
      console.log('✅ Added test image:', addResult);
      return 1;
    } else {
      console.log('❌ Failed to add image:', await addImageResponse.text());
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addTestImageViaAPI().then(productId => {
  if (productId) {
    console.log(`\n🎉 Success! You can test with product ID: ${productId}`);
    console.log(`Frontend URL: http://localhost:3000/product/details/${productId}`);
    console.log(`API URL: http://localhost:9000/custom/products/${productId}/images-direct`);
  } else {
    console.log('\n❌ Could not find or create test images');
  }
}).catch(console.error);

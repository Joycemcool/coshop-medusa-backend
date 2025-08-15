// Test script for image upload functionality
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function testImageUpload() {
  const baseUrl = 'http://localhost:9000';
  
  // Test 1: Upload an image (using base64 for simplicity)
  console.log('Testing image upload...');
  
  // Create a simple test image in base64 (1x1 pixel PNG)
  const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAHFfKRKOgAAAABJRU5ErkJggg==';
  
  const uploadData = {
    image_data: testImageBase64,
    file_name: 'test-image.png',
    mime_type: 'image/png',
    alt_text: 'Test image',
    is_primary: true
  };

  try {
    const response = await fetch(`${baseUrl}/custom/products/test-product-123/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(uploadData)
    });

    const result = await response.json();
    console.log('Upload Response:', result);

    if (result.success) {
      console.log('✅ Image upload successful!');
      
      // Test 2: Get product images
      console.log('\nTesting get product images...');
      const getResponse = await fetch(`${baseUrl}/custom/products/test-product-123/images`);
      const getResult = await getResponse.json();
      console.log('Get Images Response:', getResult);
      
      if (getResult.success) {
        console.log('✅ Get images successful!');
        console.log(`Found ${getResult.data.length} images for the product`);
      } else {
        console.log('❌ Get images failed:', getResult.error);
      }
    } else {
      console.log('❌ Image upload failed:', result.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test database connection
async function testDatabaseConnection() {
  console.log('Testing database connection...');
  try {
    const response = await fetch('http://localhost:9000/admin/auth');
    console.log('✅ Backend server is responding');
  } catch (error) {
    console.log('❌ Backend server not responding:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Image Upload System Tests\n');
  
  await testDatabaseConnection();
  console.log('');
  await testImageUpload();
  
  console.log('\n📋 Summary:');
  console.log('- Backend server: Running on http://localhost:9000');
  console.log('- Image upload endpoint: POST /custom/products/{product_id}/images');
  console.log('- Get images endpoint: GET /custom/products/{product_id}/images');
  console.log('- Image serving endpoint: GET /custom/uploads/images/{size}/{filename}');
  console.log('- Upload directory: ./uploads/images');
}

runTests();

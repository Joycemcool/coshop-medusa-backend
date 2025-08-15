// Test script to test image upload endpoint
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');
const path = require('path');

async function testImageUpload() {
  try {
    console.log('🧪 Testing image upload endpoint...');
    
    // Use an existing test image
    const imagePath = path.join(__dirname, 'uploads', 'images', 'original', 'test-tomatos.png');
    
    if (!fs.existsSync(imagePath)) {
      console.error('❌ Test image not found:', imagePath);
      return;
    }
    
    // Create form data
    const form = new FormData();
    form.append('image', fs.createReadStream(imagePath));
    
    console.log('📤 Uploading test image...');
    
    // Make upload request
    const response = await fetch('http://localhost:9000/custom/upload/image', {
      method: 'POST',
      body: form
    });
    
    console.log('📬 Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Upload successful!');
      console.log('📋 Response:', JSON.stringify(result, null, 2));
      
      // Check if files were created
      const filename = result.data.file_name;
      const originalPath = path.join(__dirname, 'uploads', 'images', 'original', filename);
      const mediumPath = path.join(__dirname, 'uploads', 'images', 'medium', filename);
      const thumbnailPath = path.join(__dirname, 'uploads', 'images', 'thumbnail', filename);
      
      console.log('🔍 Checking created files...');
      console.log('📁 Original exists:', fs.existsSync(originalPath));
      console.log('📁 Medium exists:', fs.existsSync(mediumPath));
      console.log('📁 Thumbnail exists:', fs.existsSync(thumbnailPath));
      
    } else {
      const error = await response.text();
      console.error('❌ Upload failed:', error);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testImageUpload();

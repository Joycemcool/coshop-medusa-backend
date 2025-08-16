const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateImageVariants() {
  console.log('🖼️ Generating image variants...');
  
  const originalDir = path.join(__dirname, 'uploads', 'images', 'original');
  const mediumDir = path.join(__dirname, 'uploads', 'images', 'medium');
  const thumbnailDir = path.join(__dirname, 'uploads', 'images', 'thumbnail');
  
  // Ensure directories exist
  [mediumDir, thumbnailDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log('📁 Created directory:', dir);
    }
  });
  
  // Get all images from original folder
  const files = fs.readdirSync(originalDir).filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );
  
  console.log(`📸 Found ${files.length} images to process`);
  
  for (const file of files) {
    const originalPath = path.join(originalDir, file);
    const mediumPath = path.join(mediumDir, file);
    const thumbnailPath = path.join(thumbnailDir, file);
    
    try {
      console.log(`Processing: ${file}`);
      
      // Create medium size (400px width)
      await sharp(originalPath)
        .resize(400, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .jpeg({ quality: 85 })
        .toFile(mediumPath);
      
      // Create thumbnail (150x150)
      await sharp(originalPath)
        .resize(150, 150, { 
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);
      
      console.log(`✅ Generated variants for: ${file}`);
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log('🎉 Image variant generation complete!');
}

generateImageVariants().catch(console.error);

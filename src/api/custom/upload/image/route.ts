import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import formidable from 'formidable'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'

// Real image upload endpoint
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    console.log('📤 Image upload request received')
    
    // Create upload directories
    const uploadDir = path.join(process.cwd(), 'uploads', 'images')
    const originalDir = path.join(uploadDir, 'original')
    const mediumDir = path.join(uploadDir, 'medium')
    const thumbnailDir = path.join(uploadDir, 'thumbnail')
    
    // Ensure directories exist
    const dirs = [originalDir, mediumDir, thumbnailDir];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
        console.log('📁 Created directory:', dir)
      }
    })

    // Parse form data
    const form = formidable({
      uploadDir: originalDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      filename: (name, ext, part) => {
        // Temporary filename - will be renamed after parsing
        const timestamp = Date.now()
        const randomNum = Math.floor(Math.random() * 1000)
        return `temp-${timestamp}-${randomNum}${ext}`
      }
    })

    const [fields, files] = await form.parse(req as any)
    console.log('📋 Parsed fields:', fields)
    console.log('📎 Parsed files:', Object.keys(files))

    const imageFile = Array.isArray(files.image) ? files.image[0] : files.image
    
    if (!imageFile) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      })
    }

    // Extract farmer and product IDs from form fields
    const farmerId = Array.isArray(fields.farmerId) ? fields.farmerId[0] : fields.farmerId
    const productId = Array.isArray(fields.productId) ? fields.productId[0] : fields.productId
    const imageName = Array.isArray(fields.imageName) ? fields.imageName[0] : fields.imageName
    
    console.log('🖼️ Processing image:', imageFile.originalFilename)
    console.log('�‍🌾 Farmer ID:', farmerId)
    console.log('📦 Product ID:', productId)
    console.log('🏷️ Image Name:', imageName)

    // Generate proper filename using naming convention
    const fileExtension = path.extname(imageFile.originalFilename || '').toLowerCase()
    const baseImageName = imageName || path.basename(imageFile.originalFilename || '', fileExtension)
    
    let finalFilename: string
    if (farmerId && productId) {
      // Use farmer-product naming convention: farmer{farmerId}-product{productId}-{imageName}.{ext}
      finalFilename = `farmer-${farmerId}-product-${productId}-${baseImageName}${fileExtension}`
    } else if (farmerId) {
      // Use farmer naming convention: farmer{farmerId}-{imageName}.{ext}
      finalFilename = `farmer-${farmerId}-${baseImageName}${fileExtension}`
    } else {
      // Fallback to timestamp naming
      const timestamp = Date.now()
      finalFilename = `${timestamp}-${baseImageName}${fileExtension}`
    }

    console.log('📝 Generated filename:', finalFilename)

    // Rename the uploaded file to use proper convention
    const finalPath = path.join(originalDir, finalFilename)
    fs.renameSync(imageFile.filepath, finalPath)
    console.log('💾 Renamed file to:', finalPath)

    // Get image metadata
    const metadata = await sharp(finalPath).metadata()
    console.log('📐 Image dimensions:', metadata.width, 'x', metadata.height)

    // Create paths for variants using the final filename
    const mediumPath = path.join(mediumDir, finalFilename)
    const thumbnailPath = path.join(thumbnailDir, finalFilename)

    // Create medium size (400px width)
    await sharp(finalPath)
      .resize(400, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 85 })
      .toFile(mediumPath)
    console.log('📷 Created medium image:', mediumPath)

    // Create thumbnail (150x150)
    await sharp(finalPath)
      .resize(150, 150, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath)
    console.log('🖼️ Created thumbnail:', thumbnailPath)

    // Generate URLs
    const baseUrl = 'http://localhost:9000/custom/uploads/images'
    
    const imageData = {
      id: `img_${Date.now()}`,
      url: `${baseUrl}/original/${finalFilename}`,
      original_url: `${baseUrl}/original/${finalFilename}`,
      medium_url: `${baseUrl}/medium/${finalFilename}`,
      thumbnail_url: `${baseUrl}/thumbnail/${finalFilename}`,
      alt_text: path.basename(imageFile.originalFilename || '', path.extname(imageFile.originalFilename || '')),
      file_name: finalFilename,
      file_size: imageFile.size,
      width: metadata.width || 0,
      height: metadata.height || 0,
      mime_type: imageFile.mimetype,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('✅ Image upload successful:', imageData.file_name)

    res.status(200).json({
      success: true,
      data: imageData,
      message: 'Image uploaded successfully'
    })

  } catch (error) {
    console.error('❌ Image upload error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload image'
    })
  }
}

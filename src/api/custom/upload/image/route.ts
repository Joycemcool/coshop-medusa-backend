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
        // Generate unique filename
        const timestamp = Date.now()
        const randomNum = Math.floor(Math.random() * 1000)
        const originalName = part.originalFilename || 'image'
        const nameWithoutExt = path.basename(originalName, path.extname(originalName))
        return `${nameWithoutExt}-${timestamp}-${randomNum}${ext}`
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

    console.log('🖼️ Processing image:', imageFile.originalFilename)
    console.log('💾 Saved to:', imageFile.filepath)

    // Get image metadata
    const metadata = await sharp(imageFile.filepath).metadata()
    console.log('📐 Image dimensions:', metadata.width, 'x', metadata.height)

    // Create filename for variants
    const filename = path.basename(imageFile.filepath)
    const mediumPath = path.join(mediumDir, filename)
    const thumbnailPath = path.join(thumbnailDir, filename)

    // Create medium size (400px width)
    await sharp(imageFile.filepath)
      .resize(400, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .jpeg({ quality: 85 })
      .toFile(mediumPath)
    console.log('📷 Created medium image:', mediumPath)

    // Create thumbnail (150x150)
    await sharp(imageFile.filepath)
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
      url: `${baseUrl}/original/${filename}`,
      original_url: `${baseUrl}/original/${filename}`,
      medium_url: `${baseUrl}/medium/${filename}`,
      thumbnail_url: `${baseUrl}/thumbnail/${filename}`,
      alt_text: path.basename(imageFile.originalFilename || '', path.extname(imageFile.originalFilename || '')),
      file_name: filename,
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

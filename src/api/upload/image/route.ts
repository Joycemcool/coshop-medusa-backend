import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import sharp from 'sharp'

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'images', 'original')
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const timestamp = Date.now()
    const randomNum = Math.floor(Math.random() * 1000)
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
    const filename = `${name}-${timestamp}-${randomNum}${ext}`
    
    cb(null, filename)
  }
})

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
})

// Helper function to create image variants
const createImageVariants = async (originalPath: string, filename: string) => {
  const nameWithoutExt = path.basename(filename, path.extname(filename))
  const ext = path.extname(filename)
  
  const mediumDir = path.join(process.cwd(), 'uploads', 'images', 'medium')
  const thumbnailDir = path.join(process.cwd(), 'uploads', 'images', 'thumbnail')
  
  // Create directories if they don't exist
  if (!fs.existsSync(mediumDir)) {
    fs.mkdirSync(mediumDir, { recursive: true })
  }
  if (!fs.existsSync(thumbnailDir)) {
    fs.mkdirSync(thumbnailDir, { recursive: true })
  }
  
  const mediumPath = path.join(mediumDir, filename)
  const thumbnailPath = path.join(thumbnailDir, filename)
  
  // Create medium size (400px width)
  await sharp(originalPath)
    .resize(400, null, { 
      withoutEnlargement: true,
      fit: 'inside'
    })
    .jpeg({ quality: 85 })
    .toFile(mediumPath)
  
  // Create thumbnail (150px width)
  await sharp(originalPath)
    .resize(150, 150, { 
      fit: 'cover',
      position: 'center'
    })
    .jpeg({ quality: 80 })
    .toFile(thumbnailPath)
  
  return {
    medium: mediumPath,
    thumbnail: thumbnailPath
  }
}

// Single file upload endpoint
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // Use multer middleware
    const uploadSingle = upload.single('image')
    
    await new Promise<void>((resolve, reject) => {
      uploadSingle(req as any, res as any, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })

    const file = (req as any).file
    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      })
    }

    console.log('File uploaded:', file)

    // Get image dimensions
    const metadata = await sharp(file.path).metadata()
    
    // Create image variants
    const variants = await createImageVariants(file.path, file.filename)
    
    // Generate URLs
    const baseUrl = process.env.IMAGE_BASE_URL || 'http://localhost:9000/custom/uploads/images'
    
    const imageData = {
      id: `img_${Date.now()}`,
      original_url: `${baseUrl}/original/${file.filename}`,
      medium_url: `${baseUrl}/medium/${file.filename}`,
      thumbnail_url: `${baseUrl}/thumbnail/${file.filename}`,
      alt_text: path.basename(file.originalname, path.extname(file.originalname)),
      file_name: file.filename,
      file_size: file.size,
      width: metadata.width || 0,
      height: metadata.height || 0,
      mime_type: file.mimetype,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    res.status(200).json({
      success: true,
      data: imageData,
      message: 'Image uploaded successfully'
    })

  } catch (error) {
    console.error('Image upload error:', error)
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload image'
    })
  }
}

import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import path from "path"
import fs from "fs"

// Serve uploaded images
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { size, filename } = req.params
    
    if (!size || !filename) {
      return res.status(400).json({
        success: false,
        error: "Size and filename are required"
      })
    }

    // Validate size parameter
    const allowedSizes = ['original', 'thumbnail', 'medium']
    if (!allowedSizes.includes(size)) {
      return res.status(400).json({
        success: false,
        error: `Invalid size. Allowed sizes: ${allowedSizes.join(', ')}`
      })
    }

    // Build file path - handle both absolute and relative paths
    const baseDir = process.cwd() // Get current working directory
    const uploadDir = path.join(baseDir, "uploads", "images")
    const filePath = path.join(uploadDir, size, filename)
    
    console.log('🔍 Looking for image at:', filePath)
    console.log('📁 Upload directory:', uploadDir)
    console.log('📝 Requested size:', size, 'filename:', filename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('❌ File not found:', filePath)
      return res.status(404).json({
        success: false,
        error: "Image not found",
        path: filePath
      })
    }

    console.log('✅ File found, serving:', filePath)

    // Get file stats
    const stats = fs.statSync(filePath)
    
    // Set appropriate headers
    const ext = path.extname(filename).toLowerCase()
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    }
    
    const mimeType = mimeTypes[ext] || 'application/octet-stream'
    
    res.setHeader('Content-Type', mimeType)
    res.setHeader('Content-Length', stats.size)
    res.setHeader('Cache-Control', 'public, max-age=31536000') // Cache for 1 year
    res.setHeader('ETag', `"${stats.mtime.getTime()}-${stats.size}"`)
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    // Stream the file
    const fileStream = fs.createReadStream(filePath)
    fileStream.pipe(res)

  } catch (error) {
    console.error('❌ Error serving image:', error)
    res.status(500).json({
      success: false,
      error: error.message || "Failed to serve image",
      details: error.toString()
    })
  }
}

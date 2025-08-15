import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ImageUploadService from "../../../../../services/image-upload"

// Define proper types for the request
interface ImageUploadRequest extends MedusaRequest {
  file?: any
  files?: any[]
  body: {
    alt_text?: string
    is_primary?: string | boolean
    uploaded_by?: string
    image_data?: string
    file_name?: string
    mime_type?: string
    [key: string]: any
  }
  user?: {
    id: string
  }
}

// Upload single image for a product
export const POST = async (req: ImageUploadRequest, res: MedusaResponse) => {
  try {
    // For now, we'll handle file upload without multer middleware
    // This can be enhanced later with proper file upload handling
    
    const { product_id } = req.params
    const { alt_text, is_primary } = req.body

    // Mock file data for testing - in real implementation, this would come from multipart form data
    if (!req.body.image_data) {
      return res.status(400).json({
        success: false,
        error: "No image data provided. Please provide image_data in base64 format or implement file upload middleware."
      })
    }

    if (!product_id) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required"
      })
    }

    const imageUploadService: ImageUploadService = req.scope.resolve("imageUploadService")

    // For now, create a mock file buffer from base64 (this is for testing)
    let fileBuffer: Buffer
    let fileName = 'uploaded-image.jpg'
    let mimeType = 'image/jpeg'

    try {
      // If image_data is base64, convert it
      if (typeof req.body.image_data === 'string') {
        const base64Data = req.body.image_data.replace(/^data:image\/\w+;base64,/, '')
        fileBuffer = Buffer.from(base64Data, 'base64')
        fileName = req.body.file_name || fileName
        mimeType = req.body.mime_type || mimeType
      } else {
        throw new Error('Invalid image data format')
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: "Invalid image data format. Please provide base64 encoded image data."
      })
    }

    const uploadedImage = await imageUploadService.uploadProductImage({
      productId: product_id,
      file: fileBuffer,
      fileName: fileName,
      mimeType: mimeType,
      altText: alt_text,
      isPrimary: is_primary === 'true' || is_primary === true,
      uploadedBy: req.user?.id || req.body.uploaded_by
    })

    res.status(201).json({
      success: true,
      data: uploadedImage,
      message: "Image uploaded successfully"
    })

  } catch (error) {
    console.error('Error uploading image:', error)
    res.status(500).json({
      success: false,
      error: error.message || "Failed to upload image"
    })
  }
}

// Get all images for a product
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { product_id } = req.params

    if (!product_id) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required"
      })
    }

    const imageUploadService: ImageUploadService = req.scope.resolve("imageUploadService")
    const images = await imageUploadService.getProductImages(product_id)

    res.status(200).json({
      success: true,
      data: images,
      count: images.length
    })
  } catch (error) {
    console.error('Error fetching product images:', error)
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch product images"
    })
  }
}

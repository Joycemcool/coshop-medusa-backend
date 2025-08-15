import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ImageUploadService from "../../../../../../services/image-upload"

// Get specific image
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { product_id, image_id } = req.params

    if (!product_id || !image_id) {
      return res.status(400).json({
        success: false,
        error: "Product ID and Image ID are required"
      })
    }

    const imageUploadService: ImageUploadService = req.scope.resolve("imageUploadService")
    const image = await imageUploadService.retrieve(image_id)

    // Verify the image belongs to the specified product
    if (image.product_id !== product_id) {
      return res.status(404).json({
        success: false,
        error: "Image not found for this product"
      })
    }

    res.status(200).json({
      success: true,
      data: image
    })
  } catch (error) {
    console.error('Error fetching image:', error)
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch image"
    })
  }
}

// Delete specific image
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { product_id, image_id } = req.params

    if (!product_id || !image_id) {
      return res.status(400).json({
        success: false,
        error: "Product ID and Image ID are required"
      })
    }

    const imageUploadService: ImageUploadService = req.scope.resolve("imageUploadService")
    
    // First verify the image belongs to the product
    const image = await imageUploadService.retrieve(image_id)
    if (image.product_id !== product_id) {
      return res.status(404).json({
        success: false,
        error: "Image not found for this product"
      })
    }

    const result = await imageUploadService.deleteProductImage(image_id)

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: result
    })
  } catch (error) {
    console.error('Error deleting image:', error)
    res.status(500).json({
      success: false,
      error: error.message || "Failed to delete image"
    })
  }
}

// Update image metadata
export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { product_id, image_id } = req.params
    const { alt_text, is_primary } = req.body as any

    if (!product_id || !image_id) {
      return res.status(400).json({
        success: false,
        error: "Product ID and Image ID are required"
      })
    }

    const imageUploadService: ImageUploadService = req.scope.resolve("imageUploadService")
    
    // First verify the image belongs to the product
    const image = await imageUploadService.retrieve(image_id)
    if (image.product_id !== product_id) {
      return res.status(404).json({
        success: false,
        error: "Image not found for this product"
      })
    }

    // If setting as primary, use the dedicated method
    if (is_primary === true || is_primary === 'true') {
      const updatedImages = await imageUploadService.setPrimaryImage(product_id, image_id)
      return res.status(200).json({
        success: true,
        message: "Image set as primary",
        data: updatedImages
      })
    }

    // For other updates, we'd need to add an update method to the service
    // For now, return a message about what's supported
    res.status(200).json({
      success: true,
      message: "Image metadata update endpoint - currently supports setting primary image",
      note: "To set as primary, send { is_primary: true }"
    })

  } catch (error) {
    console.error('Error updating image:', error)
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update image"
    })
  }
}

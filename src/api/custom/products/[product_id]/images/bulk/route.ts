import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import ImageUploadService from "../../../../../../services/image-upload"

// Update image order for a product
export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const { product_id } = req.params
    const { image_orders } = req.body as any

    if (!product_id) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required"
      })
    }

    if (!image_orders || !Array.isArray(image_orders)) {
      return res.status(400).json({
        success: false,
        error: "image_orders array is required with format: [{ id: string, sortOrder: number }]"
      })
    }

    const imageUploadService: ImageUploadService = req.scope.resolve("imageUploadService")
    const updatedImages = await imageUploadService.updateImageOrder(product_id, image_orders)

    res.status(200).json({
      success: true,
      message: "Image order updated successfully",
      data: updatedImages
    })
  } catch (error) {
    console.error('Error updating image order:', error)
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update image order"
    })
  }
}

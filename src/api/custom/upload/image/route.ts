import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Simple image upload endpoint
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    // For now, return a mock response to test the flow
    // In production, this would handle actual file upload
    const mockImageData = {
      id: `img_${Date.now()}`,
      url: 'http://localhost:9000/custom/uploads/images/original/test-tomatos.png',
      medium_url: 'http://localhost:9000/custom/uploads/images/medium/test-tomatos.png',
      thumbnail_url: 'http://localhost:9000/custom/uploads/images/thumbnail/test-tomatos.png',
      alt_text: 'Uploaded Image',
      file_name: `upload_${Date.now()}.png`,
      file_size: 1024,
      width: 800,
      height: 600,
      mime_type: 'image/png',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    res.status(200).json({
      success: true,
      data: mockImageData,
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

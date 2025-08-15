import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Pool } from 'pg'

// GET all images for a product
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  let pool
  
  try {
    const { product_id } = req.params

    if (!product_id) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required"
      })
    }

    // Create fresh pool connection
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
    })

    console.log(`Fetching images for product: ${product_id}`)

    // Query database directly
    const result = await pool.query(`
      SELECT id, product_id, url, file_name, file_size, mime_type, 
             width, height, alt_text, is_primary, sort_order, 
             thumbnail_url, medium_url, storage_provider, created_at
      FROM product_image 
      WHERE product_id = $1 
      ORDER BY is_primary DESC, sort_order ASC
    `, [product_id])

    console.log(`Found ${result.rows.length} images`)

    return res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length,
      message: `Found ${result.rows.length} images for product ${product_id}`
    })

  } catch (error) {
    console.error('Error fetching product images:', error)
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch product images",
      details: error.toString()
    })
  } finally {
    if (pool) {
      try {
        await pool.end()
      } catch (closeError) {
        console.error('Error closing pool:', closeError)
      }
    }
  }
}

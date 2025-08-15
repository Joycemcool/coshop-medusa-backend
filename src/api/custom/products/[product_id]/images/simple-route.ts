import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Pool } from 'pg'

// Create a simple database connection function
const createPool = () => new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
})

// Get all images for a product - SIMPLE VERSION
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  let pool;
  
  try {
    const { product_id } = req.params

    if (!product_id) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required"
      })
    }

    // Create fresh database connection
    pool = createPool()

    // Direct database query - no service dependency
    const result = await pool.query(`
      SELECT * FROM product_images 
      WHERE product_id = $1 
      ORDER BY created_at DESC
    `, [product_id])

    res.status(200).json({
      success: true,
      data: result.rows,
      count: result.rows.length,
      message: `Found ${result.rows.length} images for product ${product_id}`
    })

  } catch (error) {
    console.error('Error fetching product images:', error)
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch product images"
    })
  } finally {
    // Always close the pool
    if (pool) {
      await pool.end()
    }
  }
}

// Add an image to a product - SIMPLE VERSION
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  let pool;
  
  try {
    const { product_id } = req.params
    const body = req.body as {
      original_url?: string
      medium_url?: string
      thumbnail_url?: string
      alt_text?: string
      file_name?: string
      file_size?: number
      width?: number
      height?: number
    }
    
    const { 
      original_url, 
      medium_url, 
      thumbnail_url, 
      alt_text, 
      file_name, 
      file_size, 
      width, 
      height 
    } = body

    if (!product_id) {
      return res.status(400).json({
        success: false,
        error: "Product ID is required"
      })
    }

    if (!original_url) {
      return res.status(400).json({
        success: false,
        error: "original_url is required"
      })
    }

    // Create fresh database connection
    pool = createPool()

    // Insert new image
    const result = await pool.query(`
      INSERT INTO product_images (
        product_id, 
        original_url, 
        medium_url, 
        thumbnail_url, 
        alt_text, 
        file_name, 
        file_size, 
        width, 
        height, 
        created_at, 
        updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `, [
      product_id,
      original_url,
      medium_url || original_url,
      thumbnail_url || original_url,
      alt_text || '',
      file_name || 'image.png',
      file_size || 0,
      width || 0,
      height || 0
    ])

    res.status(201).json({
      success: true,
      data: result.rows[0],
      message: `Added image for product ${product_id}`
    })

  } catch (error) {
    console.error('Error adding product image:', error)
    res.status(500).json({
      success: false,
      error: error.message || "Failed to add product image"
    })
  } finally {
    // Always close the pool
    if (pool) {
      await pool.end()
    }
  }
}

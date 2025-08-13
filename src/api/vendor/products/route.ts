import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Pool } from 'pg'

interface ProductCreateRequest {
  title: string
  description?: string
  vendor_price: number
  vendor_sku?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  thumbnail?: string
  images?: string[]
  tags?: string[]
  organic_certified?: boolean
  harvest_date?: string
  expiry_date?: string
  storage_instructions?: string
  nutritional_info?: any
  farm_practice?: string
  availability_status?: string
  minimum_order_quantity?: number
  bulk_pricing?: any
  seasonal_availability?: any
  vendor_notes?: string
  quality_grade?: string
  origin_location?: string
  delivery_available?: boolean
  pickup_available?: boolean
}

// GET /vendor/products - List all products for authenticated vendor
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    const vendorId = req.query.vendor_id as string
    
    if (!vendorId) {
      return res.status(401).json({
        message: "Vendor ID required"
      })
    }

    // Direct database query for now
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
    })

    const result = await pool.query(`
      SELECT 
        p.id, p.title, p.description, p.handle, p.status, p.thumbnail,
        p.created_at, p.updated_at, p.weight, p.length, p.height, p.width,
        pr.vendor_id, pr.vendor_price, pr.vendor_sku, pr.platform_commission,
        pr.vendor_approved, pr.vendor_name, pr.organic_certified, pr.harvest_date,
        pr.expiry_date, pr.storage_instructions, pr.nutritional_info, pr.farm_practice,
        pr.availability_status, pr.minimum_order_quantity, pr.bulk_pricing,
        pr.seasonal_availability, pr.vendor_notes, pr.quality_grade,
        pr.origin_location, pr.delivery_available, pr.pickup_available,
        v.name as vendor_display_name, v.farm_name
      FROM product p
      LEFT JOIN product pr ON p.id = pr.id
      LEFT JOIN vendor v ON pr.vendor_id = v.id
      WHERE pr.vendor_id = $1 AND p.status != 'deleted'
      ORDER BY p.created_at DESC
    `, [vendorId])
    
    const products = result.rows.map(row => ({
      ...row,
      vendor_price: parseFloat(row.vendor_price || 0),
      platform_commission: parseFloat(row.platform_commission || 0),
      nutritional_info: row.nutritional_info ? JSON.parse(row.nutritional_info) : null,
      bulk_pricing: row.bulk_pricing ? JSON.parse(row.bulk_pricing) : null,
      seasonal_availability: row.seasonal_availability ? JSON.parse(row.seasonal_availability) : null
    }))

    await pool.end()
    
    res.json({
      products,
      count: products.length
    })
  } catch (error) {
    console.error("Error fetching vendor products:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    })
  }
}

// POST /vendor/products - Create new product for vendor
export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  console.log("POST /vendor/products called")
  console.log("Request body:", req.body)
  
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    const body = req.body as ProductCreateRequest & { vendor_id: string }
    const vendorId = body.vendor_id
    
    console.log("Vendor ID:", vendorId)
    console.log("Title:", body.title)
    console.log("Price:", body.vendor_price)
    
    if (!vendorId) {
      return res.status(401).json({
        message: "Vendor ID required"
      })
    }

    // Validate required fields
    const { title, vendor_price } = body
    if (!title || !vendor_price) {
      return res.status(400).json({
        message: "Title and vendor_price are required"
      })
    }

    // Direct database operations
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
    })
    
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      // Get vendor information
      const vendorResult = await client.query('SELECT * FROM vendor WHERE id = $1', [vendorId])
      if (vendorResult.rows.length === 0) {
        throw new Error('Vendor not found')
      }
      const vendor = vendorResult.rows[0]
      
      // Generate product ID and handle
      const productId = `prod_${Date.now()}`
      const handle = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`
      const now = new Date()
      
      // Insert product with all data in single query
      await client.query(`
        INSERT INTO product (
          id, title, description, handle, status, weight, length, height, width,
          thumbnail, vendor_id, vendor_price, vendor_sku, 
          platform_commission, vendor_approved, vendor_name, organic_certified, 
          harvest_date, expiry_date, storage_instructions, nutritional_info, 
          farm_practice, availability_status, minimum_order_quantity, bulk_pricing,
          seasonal_availability, vendor_notes, quality_grade, origin_location, 
          delivery_available, pickup_available, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33
        )
      `, [
        productId, title, body.description || '', handle,
        'draft', body.weight || null, body.length || null, body.height || null, body.width || null,
        body.thumbnail || null,
        vendorId, body.vendor_price, body.vendor_sku || null,
        vendor.commission_rate || 0.15, false, vendor.name,
        body.organic_certified || false, body.harvest_date || null, body.expiry_date || null,
        body.storage_instructions || null, body.nutritional_info ? JSON.stringify(body.nutritional_info) : null,
        body.farm_practice || 'conventional', body.availability_status || 'available',
        body.minimum_order_quantity || 1, body.bulk_pricing ? JSON.stringify(body.bulk_pricing) : null,
        body.seasonal_availability ? JSON.stringify(body.seasonal_availability) : null,
        body.vendor_notes || null, body.quality_grade || null, body.origin_location || null,
        body.delivery_available !== false, body.pickup_available !== false, now, now
      ])
        body.quality_grade || '', body.origin_location || vendor.location || '',
        body.delivery_available !== false, body.pickup_available !== false,
        now, now
      
      await client.query('COMMIT')
      
      // Fetch the created product
      const productResult = await client.query(`
        SELECT 
          id, title, description, handle, status, thumbnail,
          created_at, updated_at, vendor_id, vendor_price, vendor_sku, 
          vendor_approved, organic_certified, availability_status
        FROM product
        WHERE id = $1
      `, [productId])
      
      const product = productResult.rows[0]
      
      res.status(201).json({
        product: {
          ...product,
          vendor_price: parseFloat(product.vendor_price || 0)
        },
        message: "Product created successfully"
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
      await pool.end()
    }
  } catch (error) {
    console.error("Error creating product:", error)
    console.error("Error stack:", error.stack)
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      detail: error.detail
    })
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      details: error.detail || error.code
    })
  }
}

// Handle preflight OPTIONS request
export const OPTIONS = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.status(200).end()
}

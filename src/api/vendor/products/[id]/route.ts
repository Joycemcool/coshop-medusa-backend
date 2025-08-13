import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Pool } from 'pg'

interface ProductUpdateRequest {
  title?: string
  description?: string
  vendor_price?: number
  vendor_sku?: string
  weight?: number
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

// GET /vendor/products/[id] - Get single product by ID
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    const productId = req.params.id as string
    const vendorId = req.query.vendor_id as string
    
    if (!vendorId) {
      return res.status(401).json({
        message: "Vendor ID required"
      })
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
    })

    const result = await pool.query(`
      SELECT 
        p.id, p.title, p.description, p.handle, p.status, p.thumbnail,
        p.created_at, p.updated_at, p.weight, p.length, p.height, p.width,
        p.tags, p.images,
        pr.vendor_id, pr.vendor_price, pr.vendor_sku, pr.platform_commission,
        pr.vendor_approved, pr.vendor_name, pr.organic_certified, pr.harvest_date,
        pr.expiry_date, pr.storage_instructions, pr.nutritional_info, pr.farm_practice,
        pr.availability_status, pr.minimum_order_quantity, pr.bulk_pricing,
        pr.seasonal_availability, pr.vendor_notes, pr.quality_grade,
        pr.origin_location, pr.delivery_available, pr.pickup_available,
        v.name as vendor_display_name, v.farm_name, v.location, v.category
      FROM product p
      LEFT JOIN product pr ON p.id = pr.id
      LEFT JOIN vendor v ON pr.vendor_id = v.id
      WHERE p.id = $1 AND pr.vendor_id = $2
    `, [productId, vendorId])
    
    await pool.end()
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found"
      })
    }
    
    const product = result.rows[0]
    const formattedProduct = {
      ...product,
      vendor_price: parseFloat(product.vendor_price || 0),
      platform_commission: parseFloat(product.platform_commission || 0),
      nutritional_info: product.nutritional_info ? JSON.parse(product.nutritional_info) : null,
      bulk_pricing: product.bulk_pricing ? JSON.parse(product.bulk_pricing) : null,
      seasonal_availability: product.seasonal_availability ? JSON.parse(product.seasonal_availability) : null,
      tags: product.tags ? JSON.parse(product.tags) : [],
      images: product.images ? JSON.parse(product.images) : []
    }
    
    res.json({
      product: formattedProduct
    })
  } catch (error) {
    console.error("Error fetching product:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    })
  }
}

// PUT /vendor/products/[id] - Update product
export const PUT = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    const productId = req.params.id as string
    const body = req.body as ProductUpdateRequest & { vendor_id: string }
    const vendorId = body.vendor_id
    
    console.log("PUT request params:", req.params)
    console.log("Product ID:", productId)
    console.log("Vendor ID:", vendorId)
    
    if (!productId) {
      return res.status(400).json({
        message: "Product ID is required",
        error: "Missing product ID in request parameters"
      })
    }
    
    if (!vendorId) {
      return res.status(401).json({
        message: "Vendor ID required"
      })
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
    })
    
    const client = await pool.connect()
    
    try {
      await client.query('BEGIN')
      
      // Verify product belongs to vendor
      const checkResult = await client.query(`
        SELECT pr.vendor_id FROM product p
        LEFT JOIN product pr ON p.id = pr.id
        WHERE p.id = $1
      `, [productId])
      
      if (checkResult.rows.length === 0 || checkResult.rows[0].vendor_id !== vendorId) {
        throw new Error('Product not found or access denied')
      }
      
      // Update main product fields
      const productFields = ['title', 'description', 'weight', 'tags', 'images']
      const productUpdates: string[] = []
      const productValues: any[] = []
      let productParamCount = 1
      
      productFields.forEach(field => {
        if (body[field] !== undefined) {
          productUpdates.push(`${field} = $${productParamCount}`)
          if (field === 'tags' || field === 'images') {
            productValues.push(JSON.stringify(body[field] || []))
          } else {
            productValues.push(body[field])
          }
          productParamCount++
        }
      })
      
      if (productUpdates.length > 0) {
        productUpdates.push(`updated_at = $${productParamCount}`)
        productValues.push(new Date())
        productValues.push(productId)
        
        await client.query(`
          UPDATE product SET ${productUpdates.join(', ')}
          WHERE id = $${productParamCount + 1}
        `, productValues)
      }
      
      // Update vendor-specific product fields
      const vendorFields = [
        'vendor_price', 'vendor_sku', 'organic_certified', 'harvest_date',
        'expiry_date', 'storage_instructions', 'nutritional_info', 'farm_practice',
        'availability_status', 'minimum_order_quantity', 'bulk_pricing',
        'seasonal_availability', 'vendor_notes', 'quality_grade', 'origin_location',
        'delivery_available', 'pickup_available'
      ]
      
      const vendorUpdates: string[] = []
      const vendorValues: any[] = []
      let vendorParamCount = 1
      
      vendorFields.forEach(field => {
        if (body[field] !== undefined) {
          vendorUpdates.push(`${field} = $${vendorParamCount}`)
          if (field === 'nutritional_info' || field === 'bulk_pricing' || field === 'seasonal_availability') {
            vendorValues.push(JSON.stringify(body[field] || {}))
          } else {
            vendorValues.push(body[field])
          }
          vendorParamCount++
        }
      })
      
      if (vendorUpdates.length > 0) {
        vendorUpdates.push(`updated_at = $${vendorParamCount}`)
        vendorValues.push(new Date())
        vendorValues.push(productId)
        
        await client.query(`
          UPDATE product SET ${vendorUpdates.join(', ')}
          WHERE id = $${vendorParamCount + 1}
        `, vendorValues)
      }
      
      await client.query('COMMIT')
      
      // Fetch updated product
      const updatedResult = await client.query(`
        SELECT 
          p.id, p.title, p.description, p.handle, p.status, p.thumbnail,
          p.created_at, p.updated_at, p.weight,
          pr.vendor_id, pr.vendor_price, pr.vendor_sku, pr.vendor_approved,
          pr.availability_status, pr.organic_certified
        FROM product p
        LEFT JOIN product pr ON p.id = pr.id
        WHERE p.id = $1
      `, [productId])
      
      const product = updatedResult.rows[0]
      
      res.json({
        product: {
          ...product,
          vendor_price: parseFloat(product.vendor_price || 0)
        },
        message: "Product updated successfully"
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
      await pool.end()
    }
  } catch (error) {
    console.error("Error updating product:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    })
  }
}

// DELETE /vendor/products/[id] - Delete product (soft delete)
export const DELETE = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    
    const productId = req.params.id as string
    const vendorId = req.query.vendor_id as string
    
    if (!vendorId) {
      return res.status(401).json({
        message: "Vendor ID required"
      })
    }

    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
    })
    
    // Verify product belongs to vendor and delete it
    const result = await pool.query(`
      DELETE FROM product 
      WHERE id = $1 AND id IN (
        SELECT p.id FROM product p
        LEFT JOIN product pr ON p.id = pr.id
        WHERE pr.vendor_id = $2
      )
      RETURNING id
    `, [productId, vendorId])
    
    await pool.end()
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found or access denied"
      })
    }
    
    res.json({
      message: "Product deleted successfully",
      deleted: true
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message
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

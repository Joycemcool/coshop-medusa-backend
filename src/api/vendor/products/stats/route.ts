import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Pool } from 'pg'

// GET /vendor/products/stats - Get product statistics for authenticated vendor
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

    // Direct database query for stats
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
    })

    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_products,
        COUNT(CASE WHEN p.status = 'published' THEN 1 END) as published_products,
        COUNT(CASE WHEN p.availability_status = 'available' THEN 1 END) as available_products,
        COUNT(CASE WHEN p.availability_status = 'limited' THEN 1 END) as limited_stock,
        COUNT(CASE WHEN p.availability_status = 'out-of-season' THEN 1 END) as out_of_season,
        AVG(p.vendor_price) as avg_price
      FROM product p
      WHERE p.vendor_id = $1 AND p.status != 'rejected'
    `, [vendorId])

    await pool.end()
    
    const stats = result.rows[0]
    const responseData = {
      total_products: parseInt(stats.total_products || 0),
      published_products: parseInt(stats.published_products || 0),
      available_products: parseInt(stats.available_products || 0),
      limited_stock: parseInt(stats.limited_stock || 0),
      out_of_season: parseInt(stats.out_of_season || 0),
      avg_price: parseFloat(stats.avg_price || 0)
    }

    res.status(200).json(responseData)
  } catch (error) {
    console.error('Get vendor stats error:', error)
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

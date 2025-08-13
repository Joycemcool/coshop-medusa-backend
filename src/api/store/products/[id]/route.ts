import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Pool } from 'pg'

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id } = req.params
    console.log(`Store product by ID request received for: ${id}`)
    
    // Set CORS headers for frontend access
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-publishable-api-key')
    
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
        v.name as vendor_display_name, v.farm_name, v.farm_description, 
        v.farm_logo, v.location as vendor_location, v.phone as vendor_phone,
        v.email as vendor_email, v.address as vendor_address, v.city as vendor_city,
        v.state as vendor_state, v.country as vendor_country
      FROM product p
      LEFT JOIN product pr ON p.id = pr.id
      LEFT JOIN vendor v ON pr.vendor_id = v.id
      WHERE p.id = $1 AND p.status = 'published' AND v.is_active = true
    `, [id])
    
    if (result.rows.length === 0) {
      await pool.end()
      return res.status(404).json({ error: "Product not found" })
    }
    
    const product = result.rows[0]
    
    // Parse JSON fields
    const formattedProduct = {
      ...product,
      vendor_price: parseFloat(product.vendor_price || 0),
      platform_commission: parseFloat(product.platform_commission || 0),
      nutritional_info: product.nutritional_info ? JSON.parse(product.nutritional_info) : null,
      bulk_pricing: product.bulk_pricing ? JSON.parse(product.bulk_pricing) : null,
      seasonal_availability: product.seasonal_availability ? JSON.parse(product.seasonal_availability) : null
    }
    
    console.log("Store product retrieved:", product.title)
    
    await pool.end()
    
    res.json({
      product: formattedProduct
    })
  } catch (error) {
    console.error("Store product by ID error:", error)
    res.status(500).json({ error: error.message })
  }
}

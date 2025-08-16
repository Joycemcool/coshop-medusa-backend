import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Pool } from 'pg'

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    
    const { id } = req.params as { id: string }
    
    if (!id) {
      return res.status(400).json({ error: "Product ID is required" })
    }
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
    })

    // Query to get product with vendor information
    const productQuery = `
      SELECT 
        p.id, p.title, p.description, p.thumbnail,
        p.vendor_price, p.vendor_sku, p.vendor_notes, p.vendor_id,
        p.vendor_name, p.vendor_approved,
        p.weight, p.length, p.height, p.width,
        p.created_at, p.updated_at,
        v.name as vendor_display_name, v.farm_name, v.location, v.category
      FROM product p
      LEFT JOIN vendor v ON p.vendor_id = v.id
      WHERE p.id = $1
    `
    
    const result = await pool.query(productQuery, [id])
    await pool.end()
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" })
    }
    
    const product = result.rows[0]
    
    res.json({
      success: true,
      product: product
    })
  } catch (error) {
    console.error("Get product error:", error)
    res.status(500).json({ error: error.message })
  }
}

export async function OPTIONS(req: MedusaRequest, res: MedusaResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.status(200).end()
}

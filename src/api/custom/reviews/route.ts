import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Pool } from 'pg'

interface ReviewCreateRequest {
  product_id: string
  user_id?: string
  rating: number
  title?: string
  comment: string
  pros?: string
  cons?: string
  customer_name: string
  avatar?: string
  verified?: boolean
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    console.log('Custom reviews request received')
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-publishable-api-key')
    
    const { product_id } = req.query as { product_id?: string }
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
    })

    let query = `
      SELECT 
        r.id, r.product_id, r.user_id, r.rating, r.title, r.comment, 
        r.pros, r.cons, r.customer_name, r.avatar, r.verified,
        r.helpful_count, r.created_at, r.updated_at
      FROM product_reviews r
      WHERE 1=1
    `
    
    const params: string[] = []
    
    if (product_id) {
      query += ` AND r.product_id = $1`
      params.push(product_id)
    }
    
    query += ` ORDER BY r.created_at DESC`
    
    const result = await pool.query(query, params)
    await pool.end()
    
    console.log(`Retrieved ${result.rows.length} reviews`)
    
    res.json({
      success: true,
      reviews: result.rows,
      total: result.rows.length
    })
  } catch (error) {
    console.error("Get reviews error:", error)
    res.status(500).json({ error: error.message })
  }
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  try {
    console.log('Create review request received')
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-publishable-api-key')
    
    const { 
      product_id, 
      user_id, 
      rating, 
      title, 
      comment, 
      pros, 
      cons, 
      customer_name, 
      avatar, 
      verified 
    } = req.body as ReviewCreateRequest
    
    // Validate required fields
    if (!product_id || !rating || !comment || !customer_name) {
      return res.status(400).json({ 
        error: "Missing required fields: product_id, rating, comment, customer_name" 
      })
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        error: "Rating must be between 1 and 5" 
      })
    }
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
    })

    const result = await pool.query(`
      INSERT INTO product_reviews 
      (product_id, user_id, rating, title, comment, pros, cons, customer_name, avatar, verified, helpful_count, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, NOW(), NOW())
      RETURNING *
    `, [
      product_id,
      user_id || null,
      rating,
      title || null,
      comment,
      pros || null,
      cons || null,
      customer_name,
      avatar || null,
      verified || false
    ])
    
    await pool.end()
    
    console.log("Review created successfully:", result.rows[0])
    
    res.status(201).json({
      success: true,
      review: result.rows[0]
    })
  } catch (error) {
    console.error("Create review error:", error)
    res.status(500).json({ error: error.message })
  }
}

export async function OPTIONS(req: MedusaRequest, res: MedusaResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-publishable-api-key')
  res.status(200).end()
}

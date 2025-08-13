import type { Request, Response } from "express";
import { Pool } from 'pg';

// Database connection (using same config as other endpoints)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
});

export async function GET(req: Request, res: Response) {
  // Add CORS headers
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  try {
    console.log('GET /vendor/products/featured called');

    // Get featured products with business logic
    const query = `
      SELECT 
        p.*,
        v.name as vendor_name,
        v.farm_name,
        v.farm_description,
        v.location as vendor_location
      FROM product p
      LEFT JOIN vendor v ON p.vendor_id = v.id
      WHERE p.vendor_id IS NOT NULL 
        AND p.status = 'published'
        AND v.is_active = true
        AND p.is_featured = true
        AND (p.featured_until IS NULL OR p.featured_until > NOW())
      ORDER BY p.featured_priority DESC, p.created_at DESC
      LIMIT 12
    `;

    const result = await pool.query(query);
    const products = result.rows;

    console.log(`Found ${products.length} featured products`);

    res.status(200).json({
      products: products,
      count: products.length
    });

  } catch (error) {
    console.error('Error fetching featured products:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req: Request, res: Response) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.status(200).end();
}

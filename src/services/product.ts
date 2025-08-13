import { Pool } from 'pg'

type ProductData = {
  id?: string
  title: string
  description?: string
  vendor_id: string
  vendor_price: number
  vendor_sku?: string
  handle?: string
  status?: string
  weight?: number
  length?: number
  height?: number
  width?: number
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  collection_id?: string
  type_id?: string
  tags?: any[]
  images?: any[]
  thumbnail?: string
  categories?: any[]
  options?: any[]
  variants?: any[]
  platform_commission?: number
  vendor_approved?: boolean
  vendor_name?: string
  organic_certified?: boolean
  harvest_date?: Date
  expiry_date?: Date
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

export default class ProductService {
  protected readonly container_
  private pool: Pool

  constructor(container) {
    this.container_ = container
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
    })
  }

  // Get all products for a specific vendor
  async listByVendor(vendorId: string) {
    try {
      const result = await this.pool.query(`
        SELECT 
          p.id, p.title, p.description, p.handle, p.status, p.thumbnail,
          p.created_at, p.updated_at, p.weight, p.length, p.height, p.width,
          pr.vendor_id, pr.vendor_price, pr.vendor_sku, pr.platform_commission,
          pr.vendor_approved, pr.vendor_name, pr.organic_certified, pr.harvest_date,
          pr.expiry_date, pr.storage_instructions, pr.nutritional_info, pr.farm_practice,
          pr.availability_status, pr.minimum_order_quantity, pr.bulk_pricing,
          pr.seasonal_availability, pr.vendor_notes, pr.quality_grade,
          pr.origin_location, pr.delivery_available, pr.pickup_available,
          v.name as vendor_name, v.farm_name
        FROM product p
        LEFT JOIN product pr ON p.id = pr.id
        LEFT JOIN vendor v ON pr.vendor_id = v.id
        WHERE pr.vendor_id = $1 AND p.status = 'published'
        ORDER BY p.created_at DESC
      `, [vendorId])
      
      return result.rows.map(row => ({
        ...row,
        vendor_price: parseFloat(row.vendor_price || 0),
        platform_commission: parseFloat(row.platform_commission || 0),
        nutritional_info: row.nutritional_info ? JSON.parse(row.nutritional_info) : null,
        bulk_pricing: row.bulk_pricing ? JSON.parse(row.bulk_pricing) : null,
        seasonal_availability: row.seasonal_availability ? JSON.parse(row.seasonal_availability) : null
      }))
    } catch (error) {
      console.error('Error fetching vendor products:', error)
      return []
    }
  }

  // Get single product with vendor information
  async retrieve(productId: string) {
    try {
      const result = await this.pool.query(`
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
        WHERE p.id = $1
      `, [productId])
      
      if (result.rows.length === 0) {
        throw new Error(`Product with id ${productId} not found`)
      }
      
      const product = result.rows[0]
      return {
        ...product,
        vendor_price: parseFloat(product.vendor_price || 0),
        platform_commission: parseFloat(product.platform_commission || 0),
        nutritional_info: product.nutritional_info ? JSON.parse(product.nutritional_info) : null,
        bulk_pricing: product.bulk_pricing ? JSON.parse(product.bulk_pricing) : null,
        seasonal_availability: product.seasonal_availability ? JSON.parse(product.seasonal_availability) : null,
        tags: product.tags ? JSON.parse(product.tags) : [],
        images: product.images ? JSON.parse(product.images) : []
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      throw new Error(`Product with id ${productId} not found`)
    }
  }

  // Create product with vendor information
  async create(productData: ProductData) {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      
      // Generate product ID and handle
      const productId = productData.id || `prod_${Date.now()}`
      const handle = productData.handle || productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const now = new Date()
      
      // Insert into main product table
      await client.query(`
        INSERT INTO product (
          id, title, description, handle, status, weight, length, height, width,
          thumbnail, tags, images, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      `, [
        productId, productData.title, productData.description, handle,
        productData.status || 'draft', productData.weight, productData.length,
        productData.height, productData.width, productData.thumbnail,
        JSON.stringify(productData.tags || []), JSON.stringify(productData.images || []),
        now, now
      ])
      
      // Insert vendor-specific product data
      await client.query(`
        INSERT INTO product (
          id, vendor_id, vendor_price, vendor_sku, platform_commission,
          vendor_approved, vendor_name, organic_certified, harvest_date, expiry_date,
          storage_instructions, nutritional_info, farm_practice, availability_status,
          minimum_order_quantity, bulk_pricing, seasonal_availability, vendor_notes,
          quality_grade, origin_location, delivery_available, pickup_available,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
        )
        ON CONFLICT (id) DO UPDATE SET
          vendor_id = EXCLUDED.vendor_id,
          vendor_price = EXCLUDED.vendor_price,
          vendor_sku = EXCLUDED.vendor_sku,
          platform_commission = EXCLUDED.platform_commission,
          vendor_approved = EXCLUDED.vendor_approved,
          vendor_name = EXCLUDED.vendor_name,
          organic_certified = EXCLUDED.organic_certified,
          harvest_date = EXCLUDED.harvest_date,
          expiry_date = EXCLUDED.expiry_date,
          storage_instructions = EXCLUDED.storage_instructions,
          nutritional_info = EXCLUDED.nutritional_info,
          farm_practice = EXCLUDED.farm_practice,
          availability_status = EXCLUDED.availability_status,
          minimum_order_quantity = EXCLUDED.minimum_order_quantity,
          bulk_pricing = EXCLUDED.bulk_pricing,
          seasonal_availability = EXCLUDED.seasonal_availability,
          vendor_notes = EXCLUDED.vendor_notes,
          quality_grade = EXCLUDED.quality_grade,
          origin_location = EXCLUDED.origin_location,
          delivery_available = EXCLUDED.delivery_available,
          pickup_available = EXCLUDED.pickup_available,
          updated_at = EXCLUDED.updated_at
      `, [
        productId, productData.vendor_id, productData.vendor_price, productData.vendor_sku,
        productData.platform_commission || 0, productData.vendor_approved || false,
        productData.vendor_name, productData.organic_certified || false,
        productData.harvest_date, productData.expiry_date, productData.storage_instructions,
        JSON.stringify(productData.nutritional_info || {}), productData.farm_practice,
        productData.availability_status || 'available', productData.minimum_order_quantity || 1,
        JSON.stringify(productData.bulk_pricing || {}), JSON.stringify(productData.seasonal_availability || {}),
        productData.vendor_notes, productData.quality_grade, productData.origin_location,
        productData.delivery_available !== false, productData.pickup_available !== false,
        now, now
      ])
      
      await client.query('COMMIT')
      
      // Return the created product
      return await this.retrieve(productId)
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Error creating product:', error)
      throw new Error('Failed to create product')
    } finally {
      client.release()
    }
  }

  // Update product
  async update(productId: string, productData: Partial<ProductData>) {
    const client = await this.pool.connect()
    try {
      await client.query('BEGIN')
      
      // Update main product fields
      const productFields = ['title', 'description', 'handle', 'status', 'weight', 'length', 'height', 'width', 'thumbnail', 'tags', 'images']
      const productUpdates: string[] = []
      const productValues: any[] = []
      let productParamCount = 1
      
      productFields.forEach(field => {
        if (productData[field] !== undefined) {
          productUpdates.push(`${field} = $${productParamCount}`)
          if (field === 'tags' || field === 'images') {
            productValues.push(JSON.stringify(productData[field] || []))
          } else {
            productValues.push(productData[field])
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
        'vendor_id', 'vendor_price', 'vendor_sku', 'platform_commission',
        'vendor_approved', 'vendor_name', 'organic_certified', 'harvest_date',
        'expiry_date', 'storage_instructions', 'nutritional_info', 'farm_practice',
        'availability_status', 'minimum_order_quantity', 'bulk_pricing',
        'seasonal_availability', 'vendor_notes', 'quality_grade', 'origin_location',
        'delivery_available', 'pickup_available'
      ]
      
      const vendorUpdates: string[] = []
      const vendorValues: any[] = []
      let vendorParamCount = 1
      
      vendorFields.forEach(field => {
        if (productData[field] !== undefined) {
          vendorUpdates.push(`${field} = $${vendorParamCount}`)
          if (field === 'nutritional_info' || field === 'bulk_pricing' || field === 'seasonal_availability') {
            vendorValues.push(JSON.stringify(productData[field] || {}))
          } else {
            vendorValues.push(productData[field])
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
      
      // Return the updated product
      return await this.retrieve(productId)
    } catch (error) {
      await client.query('ROLLBACK')
      console.error('Error updating product:', error)
      throw new Error('Failed to update product')
    } finally {
      client.release()
    }
  }

  // Delete product (soft delete)
  async delete(productId: string) {
    try {
      await this.pool.query('UPDATE product SET status = $1, updated_at = $2 WHERE id = $3', [
        'deleted', new Date(), productId
      ])
      return { deleted: true }
    } catch (error) {
      console.error('Error deleting product:', error)
      return { deleted: false }
    }
  }

  // Get products by category
  async listByCategory(category: string, vendorId?: string) {
    try {
      let query = `
        SELECT 
          p.id, p.title, p.description, p.handle, p.status, p.thumbnail,
          p.created_at, p.updated_at,
          pr.vendor_id, pr.vendor_price, pr.availability_status,
          v.name as vendor_name, v.farm_name, v.category
        FROM product p
        LEFT JOIN product pr ON p.id = pr.id
        LEFT JOIN vendor v ON pr.vendor_id = v.id
        WHERE p.status = 'published' AND v.category = $1
      `
      const params = [category]
      
      if (vendorId) {
        query += ' AND pr.vendor_id = $2'
        params.push(vendorId)
      }
      
      query += ' ORDER BY p.created_at DESC'
      
      const result = await this.pool.query(query, params)
      
      return result.rows.map(row => ({
        ...row,
        vendor_price: parseFloat(row.vendor_price || 0)
      }))
    } catch (error) {
      console.error('Error fetching products by category:', error)
      return []
    }
  }

  // Search products
  async search(query: string, vendorId?: string) {
    try {
      let searchQuery = `
        SELECT 
          p.id, p.title, p.description, p.handle, p.status, p.thumbnail,
          p.created_at, p.updated_at,
          pr.vendor_id, pr.vendor_price, pr.availability_status,
          v.name as vendor_name, v.farm_name
        FROM product p
        LEFT JOIN product pr ON p.id = pr.id
        LEFT JOIN vendor v ON pr.vendor_id = v.id
        WHERE p.status = 'published' AND (
          p.title ILIKE $1 OR 
          p.description ILIKE $1 OR
          pr.vendor_notes ILIKE $1
        )
      `
      const params = [`%${query}%`]
      
      if (vendorId) {
        searchQuery += ' AND pr.vendor_id = $2'
        params.push(vendorId)
      }
      
      searchQuery += ' ORDER BY p.created_at DESC'
      
      const result = await this.pool.query(searchQuery, params)
      
      return result.rows.map(row => ({
        ...row,
        vendor_price: parseFloat(row.vendor_price || 0)
      }))
    } catch (error) {
      console.error('Error searching products:', error)
      return []
    }
  }

  // Get vendor's product statistics
  async getVendorStats(vendorId: string) {
    try {
      const result = await this.pool.query(`
        SELECT 
          COUNT(*) as total_products,
          COUNT(CASE WHEN p.status = 'published' THEN 1 END) as published_products,
          COUNT(CASE WHEN pr.availability_status = 'available' THEN 1 END) as available_products,
          COUNT(CASE WHEN pr.availability_status = 'limited' THEN 1 END) as limited_stock,
          COUNT(CASE WHEN pr.availability_status = 'out-of-season' THEN 1 END) as out_of_season,
          AVG(pr.vendor_price) as avg_price
        FROM product p
        LEFT JOIN product pr ON p.id = pr.id
        WHERE pr.vendor_id = $1 AND p.status != 'deleted'
      `, [vendorId])
      
      const stats = result.rows[0]
      return {
        ...stats,
        total_products: parseInt(stats.total_products || 0),
        published_products: parseInt(stats.published_products || 0),
        available_products: parseInt(stats.available_products || 0),
        limited_stock: parseInt(stats.limited_stock || 0),
        out_of_season: parseInt(stats.out_of_season || 0),
        avg_price: parseFloat(stats.avg_price || 0)
      }
    } catch (error) {
      console.error('Error fetching vendor stats:', error)
      return {
        total_products: 0,
        published_products: 0,
        available_products: 0,
        limited_stock: 0,
        out_of_season: 0,
        avg_price: 0
      }
    }
  }

  // Approve vendor product
  async approveProduct(productId: string) {
    return await this.update(productId, { vendor_approved: true })
  }

  // List products needing approval
  async listPendingApproval() {
    try {
      const result = await this.pool.query(`
        SELECT 
          p.id, p.title, p.description, p.thumbnail, p.created_at,
          pr.vendor_id, pr.vendor_price, pr.vendor_approved,
          v.name as vendor_name, v.farm_name
        FROM product p
        LEFT JOIN product pr ON p.id = pr.id
        LEFT JOIN vendor v ON pr.vendor_id = v.id
        WHERE pr.vendor_approved = false AND p.status = 'draft'
        ORDER BY p.created_at DESC
      `)
      
      return result.rows.map(row => ({
        ...row,
        vendor_price: parseFloat(row.vendor_price || 0)
      }))
    } catch (error) {
      console.error('Error fetching pending products:', error)
      return []
    }
  }
}

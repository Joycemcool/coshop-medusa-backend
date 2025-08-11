import { Pool } from 'pg'

type VendorData = {
  id?: string
  email: string
  name: string
  description?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country?: string
  farm_name?: string
  farm_description?: string
  farm_logo?: string
  location?: string
  category?: string
  services?: string
  is_active?: boolean
  commission_rate?: number
  verified_at?: Date
}

export default class VendorService {
  protected readonly container_
  private pool: Pool

  constructor(container) {
    this.container_ = container
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop'
    })
  }

  // Get vendors from the MedusaJS vendor table
  async list() {
    try {
      const result = await this.pool.query(`
        SELECT id, name, email, phone, address, city, state, zip_code, country,
               farm_name, farm_description, farm_logo, location, description,
               is_active, commission_rate, category, services,
               created_at, updated_at
        FROM vendor 
        WHERE is_active = true
        ORDER BY name
      `)
      
      return result.rows.map(row => ({
        ...row,
        commission_rate: parseFloat(row.commission_rate || 0),
        services: row.services ? JSON.parse(row.services) : []
      }))
    } catch (error) {
      console.error('Error fetching vendors from database:', error)
      return []
    }
  }

  // Get vendor by ID from the MedusaJS vendor table
  async retrieve(id: string) {
    try {
      const result = await this.pool.query(`
        SELECT id, name, email, phone, address, city, state, zip_code, country,
               farm_name, farm_description, farm_logo, location, description,
               is_active, commission_rate, category, services,
               created_at, updated_at
        FROM vendor 
        WHERE id = $1
      `, [id])
      
      if (result.rows.length === 0) {
        throw new Error(`Vendor with id ${id} not found`)
      }
      
      const vendor = result.rows[0]
      return {
        ...vendor,
        commission_rate: parseFloat(vendor.commission_rate || 0),
        services: vendor.services ? JSON.parse(vendor.services) : []
      }
    } catch (error) {
      console.error('Error fetching vendor from database:', error)
      throw new Error(`Vendor with id ${id} not found`)
    }
  }

  // Create vendor in the MedusaJS vendor table
  async create(vendorData: VendorData) {
    try {
      const id = vendorData.id || `vendor_${Date.now()}`
      const now = new Date()
      
      const result = await this.pool.query(`
        INSERT INTO vendor (
          id, name, email, phone, address, city, state, zip_code, country,
          farm_name, farm_description, farm_logo, location, description,
          is_active, commission_rate, category, services, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
        ) RETURNING *
      `, [
        id, vendorData.name, vendorData.email, vendorData.phone, vendorData.address,
        vendorData.city, vendorData.state, vendorData.zip_code, vendorData.country,
        vendorData.farm_name, vendorData.farm_description, vendorData.farm_logo,
        vendorData.location, vendorData.description, vendorData.is_active !== false,
        vendorData.commission_rate || 0, vendorData.category,
        vendorData.services ? JSON.stringify(vendorData.services) : null,
        now, now
      ])
      
      const vendor = result.rows[0]
      return {
        ...vendor,
        commission_rate: parseFloat(vendor.commission_rate || 0),
        services: vendor.services ? JSON.parse(vendor.services) : []
      }
    } catch (error) {
      console.error('Error creating vendor in database:', error)
      throw new Error('Failed to create vendor')
    }
  }

  // Update vendor in the MedusaJS vendor table
  async update(id: string, vendorData: Partial<VendorData>) {
    try {
      const updates: string[] = []
      const values: any[] = []
      let paramCount = 1
      
      Object.keys(vendorData).forEach(key => {
        if (vendorData[key] !== undefined) {
          updates.push(`${key} = $${paramCount}`)
          if (key === 'services' && Array.isArray(vendorData[key])) {
            values.push(JSON.stringify(vendorData[key]))
          } else {
            values.push(vendorData[key])
          }
          paramCount++
        }
      })
      
      updates.push(`updated_at = $${paramCount}`)
      values.push(new Date())
      values.push(id)
      
      const result = await this.pool.query(`
        UPDATE vendor SET ${updates.join(', ')}
        WHERE id = $${paramCount + 1}
        RETURNING *
      `, values)
      
      if (result.rows.length === 0) {
        throw new Error(`Vendor with id ${id} not found`)
      }
      
      const vendor = result.rows[0]
      return {
        ...vendor,
        commission_rate: parseFloat(vendor.commission_rate || 0),
        services: vendor.services ? JSON.parse(vendor.services) : []
      }
    } catch (error) {
      console.error('Error updating vendor in database:', error)
      throw new Error('Failed to update vendor')
    }
  }

  // Delete vendor (soft delete)
  async delete(id: string) {
    try {
      await this.pool.query('UPDATE vendor SET is_active = false WHERE id = $1', [id])
      return { deleted: true }
    } catch (error) {
      console.error('Error deleting vendor from database:', error)
      return { deleted: false }
    }
  }

  // Additional methods for compatibility
  async getByEmail(email: string) {
    try {
      const result = await this.pool.query('SELECT * FROM vendor WHERE email = $1', [email])
      if (result.rows.length === 0) return null
      
      const vendor = result.rows[0]
      return {
        ...vendor,
        commission_rate: parseFloat(vendor.commission_rate || 0),
        services: vendor.services ? JSON.parse(vendor.services) : []
      }
    } catch (error) {
      console.error('Error fetching vendor by email:', error)
      return null
    }
  }

  async approveVendor(id: string) {
    return await this.update(id, { is_active: true, verified_at: new Date() })
  }

  async search(query: string) {
    try {
      const result = await this.pool.query(`
        SELECT * FROM vendor 
        WHERE is_active = true AND (
          name ILIKE $1 OR 
          farm_name ILIKE $1 OR 
          description ILIKE $1
        )
        ORDER BY name
      `, [`%${query}%`])
      
      return result.rows.map(row => ({
        ...row,
        commission_rate: parseFloat(row.commission_rate || 0),
        services: row.services ? JSON.parse(row.services) : []
      }))
    } catch (error) {
      console.error('Error searching vendors:', error)
      return []
    }
  }

  async listByCategory(category: string) {
    try {
      const result = await this.pool.query(`
        SELECT * FROM vendor 
        WHERE is_active = true AND category = $1
        ORDER BY name
      `, [category])
      
      return result.rows.map(row => ({
        ...row,
        commission_rate: parseFloat(row.commission_rate || 0),
        services: row.services ? JSON.parse(row.services) : []
      }))
    } catch (error) {
      console.error('Error fetching vendors by category:', error)
      return []
    }
  }

  async listActive() {
    return await this.list()
  }
}

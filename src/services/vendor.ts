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
  is_active?: boolean
  commission_rate?: number
  category?: string
  location?: string
  services?: string[]
}

// In-memory storage for vendors (will be replaced by database later)
const VENDOR_STORAGE = new Map<string, any>();

export default class VendorService {
  protected readonly container_

  constructor(container) {
    this.container_ = container
  }

  // Create a new vendor
  async create(vendorData: VendorData) {
    const vendor = {
      id: vendorData.id || `vendor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...vendorData,
      is_active: vendorData.is_active ?? true,
      commission_rate: vendorData.commission_rate ?? 0,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    VENDOR_STORAGE.set(vendor.id, vendor);
    console.log(`✅ Created vendor: ${vendor.name} (Total: ${VENDOR_STORAGE.size})`);
    return vendor
  }

  // Retrieve a vendor by ID  
  async retrieve(id: string) {
    const vendor = VENDOR_STORAGE.get(id);
    if (!vendor) {
      throw new Error(`Vendor with id ${id} not found`)
    }
    return vendor
  }

  // List all vendors
  async list(filters = {}) {
    const { Client } = require('pg');
    const client = new Client({
      connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medusa_coshop',
    });
    
    try {
      await client.connect();
      
      // Build WHERE clause from filters
      let whereClause = 'WHERE 1=1';
      const queryParams: any[] = [];
      let paramCount = 1;
      
      Object.entries(filters).forEach(([key, value]) => {
        whereClause += ` AND ${key} = $${paramCount}`;
        queryParams.push(value);
        paramCount++;
      });
      
      const query = `SELECT * FROM vendor ${whereClause} ORDER BY name`;
      const result = await client.query(query, queryParams);
      
      console.log(`📋 Retrieved ${result.rows.length} vendors from database`);
      return result.rows;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      return [];
    } finally {
      await client.end();
    }
  }

  // Update a vendor
  async update(id: string, updateData: Partial<VendorData>) {
    const vendor = VENDOR_STORAGE.get(id);
    if (!vendor) {
      throw new Error(`Vendor with id ${id} not found`);
    }
    
    const updatedVendor = {
      ...vendor,
      ...updateData,
      updated_at: new Date()
    }
    
    VENDOR_STORAGE.set(id, updatedVendor);
    return updatedVendor
  }

  // Delete a vendor
  async delete(id: string) {
    const deleted = VENDOR_STORAGE.delete(id);
    if (!deleted) {
      throw new Error(`Vendor with id ${id} not found`);
    }
    return { id, deleted: true }
  }

  // Find vendor by email
  async getByEmail(email: string) {
    const vendors = Array.from(VENDOR_STORAGE.values());
    return vendors.find(v => v.email === email) || null
  }

  // Approve a vendor
  async approveVendor(id: string) {
    return await this.update(id, { 
      is_active: true 
    })
  }

  // Search vendors
  async search(query: string) {
    const vendors = Array.from(VENDOR_STORAGE.values());
    return vendors.filter(vendor => 
      vendor.name.toLowerCase().includes(query.toLowerCase()) ||
      vendor.farm_name?.toLowerCase().includes(query.toLowerCase()) ||
      vendor.description?.toLowerCase().includes(query.toLowerCase())
    )
  }

  // Get vendors by category
  async listByCategory(category: string) {
    return await this.list({ category })
  }

  // Get active vendors only
  async listActive() {
    return await this.list({ is_active: true })
  }
}

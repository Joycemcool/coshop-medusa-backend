import { Vendor } from "../models/vendor"

type VendorData = {
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
}

type VendorType = {
  id: string
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
  is_active: boolean
  commission_rate: number
  verified_at?: Date
  created_at: Date
  updated_at: Date
}

export default class VendorService {
  private vendors: VendorType[] = [] // In-memory storage for now

  async create(vendorData: VendorData): Promise<VendorType> {
    const vendor: VendorType = {
      id: `vendor_${Date.now()}`,
      email: vendorData.email,
      name: vendorData.name,
      description: vendorData.description,
      phone: vendorData.phone,
      address: vendorData.address,
      city: vendorData.city,
      state: vendorData.state,
      zip_code: vendorData.zip_code,
      country: vendorData.country,
      farm_name: vendorData.farm_name,
      farm_description: vendorData.farm_description,
      farm_logo: vendorData.farm_logo,
      is_active: vendorData.is_active ?? true,
      commission_rate: vendorData.commission_rate ?? 0,
      created_at: new Date(),
      updated_at: new Date()
    }
    
    this.vendors.push(vendor)
    return vendor
  }

  async retrieve(id: string): Promise<VendorType> {
    const vendor = this.vendors.find(v => v.id === id)
    if (!vendor) {
      throw new Error(`Vendor with id ${id} not found`)
    }
    return vendor
  }

  async list(): Promise<VendorType[]> {
    return this.vendors
  }

  async update(id: string, update: Partial<VendorData>): Promise<VendorType> {
    const vendor = await this.retrieve(id)
    Object.assign(vendor, update)
    vendor.updated_at = new Date()
    return vendor
  }

  async delete(id: string): Promise<void> {
    const index = this.vendors.findIndex(v => v.id === id)
    if (index !== -1) {
      this.vendors.splice(index, 1)
    }
  }

  async getByEmail(email: string): Promise<VendorType | null> {
    return this.vendors.find(v => v.email === email) || null
  }

  async approveVendor(id: string): Promise<VendorType> {
    return this.update(id, { 
      verified_at: new Date(),
      is_active: true 
    } as any)
  }
}

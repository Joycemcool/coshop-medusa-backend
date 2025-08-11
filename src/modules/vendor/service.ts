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

export default class VendorService {
  protected readonly container_

  constructor(container) {
    this.container_ = container
  }

  // Create a new vendor
  async create(vendorData: VendorData) {
    const vendorRepo = this.container_.resolve("vendorRepository")
    return await vendorRepo.create(vendorData)
  }

  // Retrieve a vendor by ID
  async retrieve(id: string, options = {}) {
    const vendorRepo = this.container_.resolve("vendorRepository")
    return await vendorRepo.findOne({ where: { id }, ...options })
  }

  // List all vendors
  async list(options = {}) {
    const vendorRepo = this.container_.resolve("vendorRepository")
    return await vendorRepo.find(options)
  }

  // Update a vendor
  async update(id: string, update: Partial<VendorData>) {
    const vendorRepo = this.container_.resolve("vendorRepository")
    await vendorRepo.update({ id }, update)
    return await this.retrieve(id)
  }

  // Delete a vendor
  async delete(id: string) {
    const vendorRepo = this.container_.resolve("vendorRepository")
    return await vendorRepo.delete({ id })
  }

  // Find vendor by email
  async getByEmail(email: string) {
    const vendorRepo = this.container_.resolve("vendorRepository")
    return await vendorRepo.findOne({ where: { email } })
  }

  // Approve a vendor
  async approveVendor(id: string) {
    return await this.update(id, { 
      is_active: true 
    })
  }
}

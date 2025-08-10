import { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/framework/http"

/**
 * Sample script to create demo vendors/farmers
 * Run with: npx medusa exec src/scripts/create-vendors.ts
 */

const vendors = [
  {
    email: "green.acres@example.com",
    name: "John Smith",
    farm_name: "Green Acres Farm",
    farm_description: "Organic vegetables and fresh produce grown with sustainable farming practices.",
    phone: "+1-555-0123",
    address: "123 Farm Road",
    city: "Farmville",
    state: "CA",
    zip_code: "95123",
    country: "USA",
    commission_rate: 10.0,
    is_active: true,
    verified_at: new Date()
  },
  {
    email: "sunny.hills@example.com",
    name: "Maria Garcia",
    farm_name: "Sunny Hills Orchard",
    farm_description: "Premium fruits including apples, oranges, and seasonal berries.",
    phone: "+1-555-0456",
    address: "456 Orchard Lane",
    city: "Fruitland",
    state: "FL",
    zip_code: "33101",
    country: "USA",
    commission_rate: 8.5,
    is_active: true,
    verified_at: new Date()
  },
  {
    email: "heritage.dairy@example.com",
    name: "David Wilson",
    farm_name: "Heritage Dairy Farm",
    farm_description: "Grass-fed dairy products including milk, cheese, and yogurt.",
    phone: "+1-555-0789",
    address: "789 Pasture Way",
    city: "Dairytown",
    state: "WI",
    zip_code: "53001",
    country: "USA",
    commission_rate: 12.0,
    is_active: true,
    verified_at: new Date()
  }
]

export default async function createVendors(req: MedusaRequest, res: MedusaResponse) {
  const vendorService = req.scope.resolve("vendorService")
  
  console.log("Creating sample vendors...")
  
  for (const vendorData of vendors) {
    try {
      // Check if vendor already exists
      const existingVendor = await vendorService.getByEmail(vendorData.email)
      
      if (existingVendor) {
        console.log(`Vendor ${vendorData.farm_name} already exists, skipping...`)
        continue
      }
      
      const vendor = await vendorService.create(vendorData)
      console.log(`✓ Created vendor: ${vendor.farm_name} (${vendor.email})`)
      
    } catch (error) {
      console.error(`✗ Failed to create vendor ${vendorData.farm_name}:`, error.message)
    }
  }
  
  console.log("Vendor creation completed!")
  
  // Return success response
  res.json({
    message: "Sample vendors created successfully",
    vendors: vendors.map(v => ({ farm_name: v.farm_name, email: v.email }))
  })
}

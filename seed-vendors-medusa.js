const { initialize } = require("@medusajs/medusa")

const novaSocitaVendors = [
  {
    id: "vendor_001",
    name: "Green Valley Farm",
    email: "farm@greenvalley.com",
    farm_name: "Green Valley Organic Farm",
    description: "Organic vegetables and sustainable farming practices since 1995",
    commission_rate: 0.15,
    is_active: true,
  },
  {
    id: "vendor_002", 
    name: "Annapolis Valley Dairy",
    email: "contact@annapolisdairy.com",
    farm_name: "Annapolis Valley Organic Dairy",
    description: "Fresh organic dairy products from grass-fed cows",
    commission_rate: 0.12,
    is_active: true,
  },
  {
    id: "vendor_003",
    name: "Sunrise Ranch",
    email: "info@sunriseranch.com", 
    farm_name: "Sunrise Cattle Ranch",
    description: "Premium grass-fed beef and free-range poultry",
    commission_rate: 0.18,
    is_active: true,
  },
  {
    id: "vendor_004",
    name: "Atlantic Coastal Harvest",
    email: "hello@atlanticcoastal.com",
    farm_name: "Atlantic Coastal Harvest Co-op",
    description: "Fresh seafood and coastal produce delivered daily",
    commission_rate: 0.16,
    is_active: true,
  },
  {
    id: "vendor_005",
    name: "Maritimes Grains Farm",
    email: "farmers@maritimesgrains.com",
    farm_name: "Maritimes Grains Collective",
    description: "Organic grains, cereals, and artisan breads",
    commission_rate: 0.14,
    is_active: true,
  },
  {
    id: "vendor_006",
    name: "Acadia Orchards",
    email: "orders@acadiaorchards.com",
    farm_name: "Acadia Fruit Orchards",
    description: "Fresh seasonal fruits and handcrafted preserves",
    commission_rate: 0.13,
    is_active: true,
  },
  {
    id: "vendor_007",
    name: "Bay of Fundy Farm",
    email: "info@bayoffundyfarm.com",
    farm_name: "Bay of Fundy Sustainable Farm",
    description: "Tidal-influenced crops and specialty vegetables",
    commission_rate: 0.17,
    is_active: true,
  },
  {
    id: "vendor_008",
    name: "Cape Breton Herbs",
    email: "contact@capebretonherbs.com",
    farm_name: "Cape Breton Herb Garden",
    description: "Fresh herbs, medicinal plants, and herbal products",
    commission_rate: 0.19,
    is_active: true,
  },
  {
    id: "vendor_009",
    name: "Gaspereau Valley Vineyard",
    email: "wine@gaspereau.com",
    farm_name: "Gaspereau Valley Organic Vineyard",
    description: "Award-winning wines and farm-to-table experiences",
    commission_rate: 0.20,
    is_active: true,
  }
]

async function seedVendors() {
  try {
    console.log("Initializing MedusaJS...")
    const { container } = await initialize()
    
    console.log("Getting vendor service...")
    const vendorService = container.resolve("vendorService")
    
    console.log("Creating vendors...")
    for (const vendorData of novaSocitaVendors) {
      try {
        const vendor = await vendorService.create(vendorData)
        console.log(`✅ Created vendor: ${vendor.name}`)
      } catch (error) {
        console.log(`⚠️ Vendor ${vendorData.name} might already exist:`, error.message)
      }
    }
    
    console.log("🎉 Vendor seeding completed!")
    
    // List all vendors to verify
    const vendors = await vendorService.list()
    console.log(`📋 Total vendors: ${vendors.length}`)
    vendors.forEach(vendor => {
      console.log(`  - ${vendor.name} (${vendor.email})`)
    })
    
  } catch (error) {
    console.error("Error seeding vendors:", error)
  } finally {
    process.exit(0)
  }
}

seedVendors()

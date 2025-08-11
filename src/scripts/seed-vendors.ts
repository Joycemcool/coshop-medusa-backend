import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function seedVendors({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  
  logger.info("Seeding vendor data...");

  // Get the vendor service
  const vendorService = container.resolve("vendorService") as any;
  
  // Define vendor data
  const vendorData = [
    {
      id: "vendor_001",
      name: "Green Valley Farm",
      email: "farm@greenvalley.com",
      farm_name: "Green Valley Organic Farm",
      location: "California, USA",
      description: "Organic vegetables and sustainable farming practices since 1995",
      commission_rate: 0.15,
      category: "Vegetables",
      is_active: true,
    },
    {
      id: "vendor_002", 
      name: "Mountain View Dairy",
      email: "contact@mountaindairy.com",
      farm_name: "Mountain View Organic Dairy",
      location: "Vermont, USA",
      description: "Fresh organic dairy products from grass-fed cows",
      commission_rate: 0.12,
      category: "Dairy",
      is_active: true,
    },
    {
      id: "vendor_003",
      name: "Sunset Ranch",
      email: "info@sunsetranch.com", 
      farm_name: "Sunset Cattle Ranch",
      location: "Texas, USA",
      description: "Premium grass-fed beef and free-range poultry",
      commission_rate: 0.18,
      category: "Meat",
      is_active: true,
    },
    {
      id: "vendor_004",
      name: "Coastal Harvest",
      email: "hello@coastalharvest.com",
      farm_name: "Coastal Harvest Co-op",
      location: "Oregon, USA", 
      description: "Fresh seafood and coastal produce delivered daily",
      commission_rate: 0.16,
      category: "Seafood",
      is_active: true,
    },
    {
      id: "vendor_005",
      name: "Prairie Grains Farm",
      email: "farmers@prairegrains.com",
      farm_name: "Prairie Grains Collective",
      location: "Kansas, USA",
      description: "Organic grains, cereals, and artisan breads",
      commission_rate: 0.14,
      category: "Grains",
      is_active: true,
    },
    {
      id: "vendor_006",
      name: "Hilltop Orchards",
      email: "orders@hilltoporchards.com",
      farm_name: "Hilltop Fruit Orchards",
      location: "Washington, USA",
      description: "Fresh seasonal fruits and handcrafted preserves",
      commission_rate: 0.13,
      category: "Fruits",
      is_active: true,
    },
    {
      id: "vendor_007",
      name: "Desert Bloom Farm",
      email: "info@desertbloom.com",
      farm_name: "Desert Bloom Sustainable Farm",
      location: "Arizona, USA",
      description: "Drought-resistant crops and desert-adapted vegetables",
      commission_rate: 0.17,
      category: "Vegetables",
      is_active: true,
    },
    {
      id: "vendor_008",
      name: "Riverside Herbs",
      email: "contact@riversideherbs.com",
      farm_name: "Riverside Herb Garden",
      location: "Colorado, USA",
      description: "Fresh herbs, medicinal plants, and herbal products",
      commission_rate: 0.19,
      category: "Herbs",
      is_active: true,
    },
    {
      id: "vendor_009",
      name: "Valley View Vineyard",
      email: "wine@valleyview.com",
      farm_name: "Valley View Organic Vineyard",
      location: "California, USA",
      description: "Organic wines and farm-to-table experiences",
      commission_rate: 0.20,
      category: "Wine",
      is_active: true,
    }
  ];

  try {
    // Check if vendors already exist and create only missing ones
    for (const vendor of vendorData) {
      try {
        const existing = await vendorService.retrieve(vendor.id);
        if (existing) {
          logger.info(`Vendor ${vendor.name} already exists, skipping...`);
          continue;
        }
      } catch (error) {
        // Vendor doesn't exist, create it
      }
      
      logger.info(`Creating vendor: ${vendor.name}`);
      await vendorService.create(vendor);
    }
    
    logger.info(`Finished seeding ${vendorData.length} vendors.`);
  } catch (error) {
    logger.error("Error seeding vendors:", error);
    throw error;
  }
}

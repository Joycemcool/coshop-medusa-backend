import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function seedVendors({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  
  logger.info("Seeding vendor data...");

  // Get the vendor service
  const vendorService = container.resolve("vendorService") as any;
  
  // Define vendor data - All located in Nova Scotia, Canada
  const vendorData = [
    {
      id: "vendor_001",
      name: "Green Valley Farm",
      email: "farm@greenvalley.com",
      farm_name: "Green Valley Organic Farm",
      location: "Truro, Nova Scotia, Canada",
      description: "Organic vegetables and sustainable farming practices since 1995",
      commission_rate: 0.15,
      category: "Vegetables",
      is_active: true,
    },
    {
      id: "vendor_002", 
      name: "Annapolis Valley Dairy",
      email: "contact@annapolisdairy.com",
      farm_name: "Annapolis Valley Organic Dairy",
      location: "Kentville, Nova Scotia, Canada",
      description: "Fresh organic dairy products from grass-fed cows",
      commission_rate: 0.12,
      category: "Dairy",
      is_active: true,
    },
    {
      id: "vendor_003",
      name: "Sunrise Ranch",
      email: "info@sunriseranch.com", 
      farm_name: "Sunrise Cattle Ranch",
      location: "New Glasgow, Nova Scotia, Canada",
      description: "Premium grass-fed beef and free-range poultry",
      commission_rate: 0.18,
      category: "Meat",
      is_active: true,
    },
    {
      id: "vendor_004",
      name: "Atlantic Coastal Harvest",
      email: "hello@atlanticcoastal.com",
      farm_name: "Atlantic Coastal Harvest Co-op",
      location: "Lunenburg, Nova Scotia, Canada", 
      description: "Fresh seafood and coastal produce delivered daily",
      commission_rate: 0.16,
      category: "Seafood",
      is_active: true,
    },
    {
      id: "vendor_005",
      name: "Maritimes Grains Farm",
      email: "farmers@maritimesgrains.com",
      farm_name: "Maritimes Grains Collective",
      location: "Amherst, Nova Scotia, Canada",
      description: "Organic grains, cereals, and artisan breads",
      commission_rate: 0.14,
      category: "Grains",
      is_active: true,
    },
    {
      id: "vendor_006",
      name: "Acadia Orchards",
      email: "orders@acadiaorchards.com",
      farm_name: "Acadia Fruit Orchards",
      location: "Wolfville, Nova Scotia, Canada",
      description: "Fresh seasonal fruits and handcrafted preserves",
      commission_rate: 0.13,
      category: "Fruits",
      is_active: true,
    },
    {
      id: "vendor_007",
      name: "Bay of Fundy Farm",
      email: "info@bayoffundyfarm.com",
      farm_name: "Bay of Fundy Sustainable Farm",
      location: "Digby, Nova Scotia, Canada",
      description: "Tidal-influenced crops and specialty vegetables",
      commission_rate: 0.17,
      category: "Vegetables",
      is_active: true,
    },
    {
      id: "vendor_008",
      name: "Cape Breton Herbs",
      email: "contact@capebretonherbs.com",
      farm_name: "Cape Breton Herb Garden",
      location: "Sydney, Nova Scotia, Canada",
      description: "Fresh herbs, medicinal plants, and herbal products",
      commission_rate: 0.19,
      category: "Herbs",
      is_active: true,
    },
    {
      id: "vendor_009",
      name: "Gaspereau Valley Vineyard",
      email: "wine@gaspereau.com",
      farm_name: "Gaspereau Valley Organic Vineyard",
      location: "Gaspereau Valley, Nova Scotia, Canada",
      description: "Award-winning wines and farm-to-table experiences",
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

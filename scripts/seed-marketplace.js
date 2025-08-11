/**
 * Co-Shop Marketplace Seed Script
 * Creates realistic vendor and product data for development/testing
 */

const { createRequire } = require('module');
const require = createRequire(import.meta.url);

// Sample vendor data for multi-vendor marketplace
const VENDOR_DATA = [
  {
    name: "Green Valley Organic Farm",
    email: "contact@greenvalley.com",
    phone: "(555) 123-4567",
    farm_name: "Green Valley Organic Farm",
    farm_description: "Family-owned organic farm specializing in fresh vegetables and herbs. Certified organic since 2015.",
    location: "Sonoma County, California",
    commission_rate: 0.15,
    is_active: true,
    category: "vegetables"
  },
  {
    name: "Sunrise Citrus Grove",
    email: "orders@sunrisecitrus.com", 
    phone: "(555) 234-5678",
    farm_name: "Sunrise Citrus Grove",
    farm_description: "Premium citrus fruits grown in the sunny valleys of California. Three generations of citrus expertise.",
    location: "Orange County, California",
    commission_rate: 0.12,
    is_active: true,
    category: "fruits"
  },
  {
    name: "Happy Hen Farm",
    email: "info@happyhen.com",
    phone: "(555) 345-6789", 
    farm_name: "Happy Hen Farm",
    farm_description: "Pasture-raised chickens providing fresh eggs and dairy products. Committed to animal welfare.",
    location: "Petaluma, California",
    commission_rate: 0.18,
    is_active: true,
    category: "dairy"
  },
  {
    name: "Mountain View Berries",
    email: "sales@mountainberries.com",
    phone: "(555) 456-7890",
    farm_name: "Mountain View Berry Farm", 
    farm_description: "Seasonal berries including strawberries, blueberries, and blackberries. Pick-your-own available.",
    location: "Watsonville, California",
    commission_rate: 0.20,
    is_active: true,
    category: "fruits"
  },
  {
    name: "Artisan Herb Gardens",
    email: "hello@artisanherbs.com",
    phone: "(555) 567-8901",
    farm_name: "Artisan Herb Gardens",
    farm_description: "Specialty herbs and microgreens for restaurants and home cooks. Hydroponic growing methods.",
    location: "San Mateo, California", 
    commission_rate: 0.25,
    is_active: false, // Pending approval
    category: "herbs"
  }
];

// Sample product data linked to vendors
const PRODUCT_DATA = [
  // Green Valley Organic Farm products
  {
    vendor_email: "contact@greenvalley.com",
    title: "Organic Mixed Greens",
    description: "Fresh organic lettuce, spinach, and arugula mix. Perfect for salads.",
    price: 8.99,
    category: "Vegetables",
    inventory: 50,
    unit: "bag (5 oz)",
    seasonal: false
  },
  {
    vendor_email: "contact@greenvalley.com", 
    title: "Heirloom Tomatoes",
    description: "Colorful heirloom tomatoes in various sizes. Grown without pesticides.",
    price: 12.50,
    category: "Vegetables", 
    inventory: 30,
    unit: "lb",
    seasonal: true
  },
  {
    vendor_email: "contact@greenvalley.com",
    title: "Fresh Basil",
    description: "Aromatic fresh basil perfect for pasta, pizza, and cooking.",
    price: 4.99,
    category: "Herbs",
    inventory: 25,
    unit: "bunch",
    seasonal: false
  },

  // Sunrise Citrus Grove products
  {
    vendor_email: "orders@sunrisecitrus.com",
    title: "Navel Oranges",
    description: "Sweet and juicy navel oranges. Perfect for eating fresh or juicing.",
    price: 6.99,
    category: "Fruits",
    inventory: 100,
    unit: "lb", 
    seasonal: true
  },
  {
    vendor_email: "orders@sunrisecitrus.com",
    title: "Meyer Lemons", 
    description: "Thin-skinned Meyer lemons with sweet, floral flavor.",
    price: 8.99,
    category: "Fruits",
    inventory: 75,
    unit: "lb",
    seasonal: true
  },

  // Happy Hen Farm products
  {
    vendor_email: "info@happyhen.com",
    title: "Free-Range Eggs",
    description: "Fresh eggs from pasture-raised hens. Rich, golden yolks.",
    price: 6.50,
    category: "Dairy & Eggs",
    inventory: 40,
    unit: "dozen",
    seasonal: false
  },
  {
    vendor_email: "info@happyhen.com", 
    title: "Farmhouse Butter",
    description: "Creamy artisan butter made from grass-fed cow cream.",
    price: 9.99,
    category: "Dairy & Eggs",
    inventory: 20,
    unit: "8 oz",
    seasonal: false
  },

  // Mountain View Berries products
  {
    vendor_email: "sales@mountainberries.com",
    title: "Strawberry Basket",
    description: "Sweet, locally-grown strawberries. Peak season freshness.",
    price: 7.99,
    category: "Fruits", 
    inventory: 60,
    unit: "basket (1 lb)",
    seasonal: true
  },
  {
    vendor_email: "sales@mountainberries.com",
    title: "Blueberry Pint",
    description: "Plump, antioxidant-rich blueberries. Great for baking or snacking.",
    price: 5.99,
    category: "Fruits",
    inventory: 45,
    unit: "pint",
    seasonal: true
  }
];

// Categories for organization
const CATEGORIES = [
  { name: "Vegetables", description: "Fresh vegetables and produce" },
  { name: "Fruits", description: "Seasonal and year-round fruits" }, 
  { name: "Dairy & Eggs", description: "Farm-fresh dairy products and eggs" },
  { name: "Herbs", description: "Fresh herbs and seasonings" },
  { name: "Seasonal", description: "Limited-time seasonal products" }
];

async function seedMarketplace() {
  console.log('🌱 Starting Co-Shop Marketplace Seeding...\n');

  try {
    // Note: This is a template script
    // In a real implementation, you would:
    
    console.log('📊 Seeding Data Summary:');
    console.log(`- Vendors: ${VENDOR_DATA.length}`);
    console.log(`- Products: ${PRODUCT_DATA.length}`); 
    console.log(`- Categories: ${CATEGORIES.length}\n`);

    console.log('🏪 Vendors to create:');
    VENDOR_DATA.forEach((vendor, index) => {
      console.log(`${index + 1}. ${vendor.name} (${vendor.category})`);
      console.log(`   📧 ${vendor.email}`);
      console.log(`   📍 ${vendor.location}`);
      console.log(`   💰 Commission: ${vendor.commission_rate * 100}%`);
      console.log(`   ✅ Status: ${vendor.is_active ? 'Active' : 'Pending Approval'}\n`);
    });

    console.log('🛒 Products to create:');
    PRODUCT_DATA.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - $${product.price}`);
      console.log(`   📦 ${product.inventory} ${product.unit} available`);
      console.log(`   🏪 Vendor: ${product.vendor_email}`);
      console.log(`   🔄 ${product.seasonal ? 'Seasonal' : 'Year-round'}\n`);
    });

    console.log('📋 Categories:');
    CATEGORIES.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name}: ${category.description}`);
    });

    console.log('\n✅ Seed data template ready!');
    console.log('💡 To implement: Connect this script to your VendorService and MedusaJS product creation APIs');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Export data for use in other scripts
module.exports = {
  VENDOR_DATA,
  PRODUCT_DATA, 
  CATEGORIES,
  seedMarketplace
};

// Run if called directly
if (require.main === module) {
  seedMarketplace();
}

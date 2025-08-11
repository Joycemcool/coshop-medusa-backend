import { Migration } from "@mikro-orm/migrations"

export class Migration20250811000001 extends Migration {
  async up(): Promise<void> {
    // First ensure the vendor table exists (it should from the model)
    this.addSql(`
      CREATE TABLE IF NOT EXISTS "vendor" (
        "id" varchar NOT NULL,
        "email" varchar NOT NULL,
        "name" varchar NOT NULL,
        "description" text NULL,
        "phone" varchar NULL,
        "address" varchar NULL,
        "city" varchar NULL,
        "state" varchar NULL,
        "zip_code" varchar NULL,
        "country" varchar NULL,
        "farm_name" varchar NULL,
        "farm_description" text NULL,
        "farm_logo" varchar NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "commission_rate" numeric NOT NULL DEFAULT 0,
        "verified_at" timestamptz NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY ("id")
      );
    `)

    // Insert Nova Scotia vendor data
    this.addSql(`
      INSERT INTO "vendor" (
        "id", "name", "email", "farm_name", "description", 
        "commission_rate", "is_active", "created_at", "updated_at"
      ) VALUES 
        ('vendor_001', 'Green Valley Farm', 'farm@greenvalley.com', 'Green Valley Organic Farm', 'Organic vegetables and sustainable farming practices since 1995', 0.15, true, now(), now()),
        ('vendor_002', 'Annapolis Valley Dairy', 'contact@annapolisdairy.com', 'Annapolis Valley Organic Dairy', 'Fresh organic dairy products from grass-fed cows', 0.12, true, now(), now()),
        ('vendor_003', 'Sunrise Ranch', 'info@sunriseranch.com', 'Sunrise Cattle Ranch', 'Premium grass-fed beef and free-range poultry', 0.18, true, now(), now()),
        ('vendor_004', 'Atlantic Coastal Harvest', 'hello@atlanticcoastal.com', 'Atlantic Coastal Harvest Co-op', 'Fresh seafood and coastal produce delivered daily', 0.16, true, now(), now()),
        ('vendor_005', 'Maritimes Grains Farm', 'farmers@maritimesgrains.com', 'Maritimes Grains Collective', 'Organic grains, cereals, and artisan breads', 0.14, true, now(), now()),
        ('vendor_006', 'Acadia Orchards', 'orders@acadiaorchards.com', 'Acadia Fruit Orchards', 'Fresh seasonal fruits and handcrafted preserves', 0.13, true, now(), now()),
        ('vendor_007', 'Bay of Fundy Farm', 'info@bayoffundyfarm.com', 'Bay of Fundy Sustainable Farm', 'Tidal-influenced crops and specialty vegetables', 0.17, true, now(), now()),
        ('vendor_008', 'Cape Breton Herbs', 'contact@capebretonherbs.com', 'Cape Breton Herb Garden', 'Fresh herbs, medicinal plants, and herbal products', 0.19, true, now(), now()),
        ('vendor_009', 'Gaspereau Valley Vineyard', 'wine@gaspereau.com', 'Gaspereau Valley Organic Vineyard', 'Award-winning wines and farm-to-table experiences', 0.20, true, now(), now())
      ON CONFLICT (id) DO NOTHING;
    `)
  }

  async down(): Promise<void> {
    // Remove the inserted vendor data
    this.addSql(`DELETE FROM "vendor" WHERE "id" IN (
      'vendor_001', 'vendor_002', 'vendor_003', 'vendor_004', 'vendor_005',
      'vendor_006', 'vendor_007', 'vendor_008', 'vendor_009'
    );`)
  }
}

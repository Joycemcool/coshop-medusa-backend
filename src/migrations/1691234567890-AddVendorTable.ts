import { Migration } from '@mikro-orm/migrations';

export class AddVendorTable1691234567890 extends Migration {

  async up(): Promise<void> {
    this.addSql('CREATE TABLE IF NOT EXISTS "vendor" ("id" varchar(255) NOT NULL, "name" varchar(255) NOT NULL, "email" varchar(255) NOT NULL, "phone" varchar(255) NULL, "address" varchar(255) NULL, "city" varchar(255) NULL, "state" varchar(255) NULL, "zip_code" varchar(255) NULL, "country" varchar(255) NULL, "farm_name" varchar(255) NULL, "farm_description" text NULL, "farm_logo" varchar(255) NULL, "location" varchar(255) NULL, "description" text NULL, "is_active" boolean NOT NULL DEFAULT true, "commission_rate" numeric(5,4) NULL DEFAULT 0, "category" varchar(255) NULL, "services" text NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), CONSTRAINT "vendor_pkey" PRIMARY KEY ("id"));');
    
    this.addSql('CREATE INDEX IF NOT EXISTS "vendor_email_index" ON "vendor" ("email");');
    this.addSql('CREATE INDEX IF NOT EXISTS "vendor_is_active_index" ON "vendor" ("is_active");');
    this.addSql('CREATE INDEX IF NOT EXISTS "vendor_category_index" ON "vendor" ("category");');
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS "vendor";');
  }

}

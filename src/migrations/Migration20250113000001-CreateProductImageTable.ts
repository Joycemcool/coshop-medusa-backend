import { Migration } from "@mikro-orm/migrations"

export class Migration20250113000001 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE "product_image" (
        "id" varchar NOT NULL,
        "product_id" varchar NOT NULL,
        "url" varchar NOT NULL,
        "file_name" varchar NOT NULL,
        "file_path" varchar NOT NULL,
        "file_size" integer NOT NULL,
        "mime_type" varchar NOT NULL,
        "width" integer NULL,
        "height" integer NULL,
        "alt_text" varchar NULL,
        "is_primary" boolean NOT NULL DEFAULT false,
        "sort_order" integer NOT NULL DEFAULT 0,
        "thumbnail_url" varchar NULL,
        "medium_url" varchar NULL,
        "storage_provider" varchar NOT NULL DEFAULT 'local',
        "metadata" text NULL,
        "uploaded_by" varchar NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        PRIMARY KEY ("id")
      );
    `)

    // Create indexes for better query performance
    this.addSql(`
      CREATE INDEX "IDX_product_image_product_id" ON "product_image" ("product_id");
    `)
    
    this.addSql(`
      CREATE INDEX "IDX_product_image_is_primary" ON "product_image" ("is_primary");
    `)

    this.addSql(`
      CREATE INDEX "IDX_product_image_sort_order" ON "product_image" ("sort_order");
    `)
  }

  async down(): Promise<void> {
    this.addSql(`DROP INDEX "IDX_product_image_sort_order";`)
    this.addSql(`DROP INDEX "IDX_product_image_is_primary";`)
    this.addSql(`DROP INDEX "IDX_product_image_product_id";`)
    this.addSql(`DROP TABLE "product_image";`)
  }
}

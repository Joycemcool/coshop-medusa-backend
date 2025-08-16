import { Migration } from '@mikro-orm/migrations'

export class Migration20250816000001 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS product_reviews (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255),
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        title VARCHAR(255),
        comment TEXT NOT NULL,
        pros TEXT,
        cons TEXT,
        customer_name VARCHAR(255) NOT NULL,
        avatar VARCHAR(500),
        verified BOOLEAN DEFAULT FALSE,
        helpful_count INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
    `)

    this.addSql(`
      CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at);
    `)
  }

  async down(): Promise<void> {
    this.addSql(`DROP TABLE IF EXISTS product_reviews;`)
  }
}

-- Add featured product functionality to existing schema
-- Run this migration on your database

-- Add featured columns to product table
ALTER TABLE product ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE product ADD COLUMN IF NOT EXISTS featured_priority INTEGER DEFAULT 0;
ALTER TABLE product ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP NULL;

-- Create index for faster featured product queries
CREATE INDEX IF NOT EXISTS idx_product_featured ON product(is_featured, featured_priority DESC);

-- Update some existing products to be featured for testing
UPDATE product 
SET is_featured = true, featured_priority = 5 
WHERE vendor_id IN ('vendor_001', 'vendor_002') 
AND availability_status = 'available'
LIMIT 6;

-- Verify the update
SELECT 
  id, 
  title, 
  vendor_id, 
  is_featured, 
  featured_priority 
FROM product 
WHERE is_featured = true 
ORDER BY featured_priority DESC;

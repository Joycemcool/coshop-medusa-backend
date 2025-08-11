-- Create vendor table for Co-Shop
CREATE TABLE IF NOT EXISTS vendor (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255),
    address VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip_code VARCHAR(255),
    country VARCHAR(255),
    farm_name VARCHAR(255),
    farm_description TEXT,
    farm_logo VARCHAR(255),
    location VARCHAR(255),
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    commission_rate DECIMAL(5,4) DEFAULT 0,
    category VARCHAR(255),
    services TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS vendor_email_index ON vendor (email);
CREATE INDEX IF NOT EXISTS vendor_is_active_index ON vendor (is_active);
CREATE INDEX IF NOT EXISTS vendor_category_index ON vendor (category);

-- Insert Nova Scotia vendors
INSERT INTO vendor (id, name, email, farm_name, location, description, commission_rate, category, is_active) VALUES
('vendor_001', 'Green Valley Farm', 'farm@greenvalley.com', 'Green Valley Organic Farm', 'Truro, Nova Scotia, Canada', 'Organic vegetables and sustainable farming practices since 1995', 0.15, 'Vegetables', true),
('vendor_002', 'Annapolis Valley Dairy', 'contact@annapolisdairy.com', 'Annapolis Valley Organic Dairy', 'Kentville, Nova Scotia, Canada', 'Fresh organic dairy products from grass-fed cows', 0.12, 'Dairy', true),
('vendor_003', 'Sunrise Ranch', 'info@sunriseranch.com', 'Sunrise Cattle Ranch', 'New Glasgow, Nova Scotia, Canada', 'Premium grass-fed beef and free-range poultry', 0.18, 'Meat', true),
('vendor_004', 'Atlantic Coastal Harvest', 'hello@atlanticcoastal.com', 'Atlantic Coastal Harvest Co-op', 'Lunenburg, Nova Scotia, Canada', 'Fresh seafood and coastal produce delivered daily', 0.16, 'Seafood', true),
('vendor_005', 'Maritimes Grains Farm', 'farmers@maritimesgrains.com', 'Maritimes Grains Collective', 'Amherst, Nova Scotia, Canada', 'Organic grains, cereals, and artisan breads', 0.14, 'Grains', true),
('vendor_006', 'Acadia Orchards', 'orders@acadiaorchards.com', 'Acadia Fruit Orchards', 'Wolfville, Nova Scotia, Canada', 'Fresh seasonal fruits and handcrafted preserves', 0.13, 'Fruits', true),
('vendor_007', 'Bay of Fundy Farm', 'info@bayoffundyfarm.com', 'Bay of Fundy Sustainable Farm', 'Digby, Nova Scotia, Canada', 'Tidal-influenced crops and specialty vegetables', 0.17, 'Vegetables', true),
('vendor_008', 'Cape Breton Herbs', 'contact@capebretonherbs.com', 'Cape Breton Herb Garden', 'Sydney, Nova Scotia, Canada', 'Fresh herbs, medicinal plants, and herbal products', 0.19, 'Herbs', true),
('vendor_009', 'Gaspereau Valley Vineyard', 'wine@gaspereau.com', 'Gaspereau Valley Organic Vineyard', 'Gaspereau Valley, Nova Scotia, Canada', 'Award-winning wines and farm-to-table experiences', 0.20, 'Wine', true)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    location = EXCLUDED.location,
    description = EXCLUDED.description,
    updated_at = NOW();

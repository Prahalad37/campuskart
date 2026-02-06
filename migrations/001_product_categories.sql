-- Phase 1: Add Product Categories and Vendor Verification
-- Run this in Supabase SQL Editor

-- Step 1: Add category column to products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'general',
ADD COLUMN IF NOT EXISTS is_official_vendor BOOLEAN DEFAULT false;

-- Create index for category filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_official ON products(is_official_vendor);

-- Step 2: Create product_variants table for size options
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    variant_type VARCHAR(20) NOT NULL, -- 'size' or 'custom'
    size VARCHAR(10), -- 'S', 'M', 'L', 'XL', '32', '34', etc.
    price_modifier DECIMAL(10,2) DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);

-- Step 3: Create measurement_rules table for custom measurements
CREATE TABLE IF NOT EXISTS measurement_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    measurement_name VARCHAR(50) NOT NULL, -- 'chest', 'waist', 'height', 'sleeve', etc.
    unit VARCHAR(10) DEFAULT 'cm',
    min_value DECIMAL(10,2) DEFAULT 0,
    max_value DECIMAL(10,2) DEFAULT 200,
    instruction TEXT, -- How to measure this
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_measurement_product ON measurement_rules(product_id);

-- Step 4: Update existing products with categories
-- Categorize existing uniform products
UPDATE products 
SET category = 'uniform' 
WHERE LOWER(name) LIKE '%uniform%' 
   OR LOWER(name) LIKE '%shirt%' 
   OR LOWER(name) LIKE '%pant%'
   OR LOWER(name) LIKE '%blazer%'
   OR LOWER(name) LIKE '%tie%';

-- Categorize shoes
UPDATE products 
SET category = 'shoes' 
WHERE LOWER(name) LIKE '%shoe%' 
   OR LOWER(name) LIKE '%boot%';

-- Categorize stationery
UPDATE products 
SET category = 'stationery' 
WHERE LOWER(name) LIKE '%pen%' 
   OR LOWER(name) LIKE '%pencil%' 
   OR LOWER(name) LIKE '%eraser%'
   OR LOWER(name) LIKE '%ruler%';

-- Categorize notebooks
UPDATE products 
SET category = 'notebook' 
WHERE LOWER(name) LIKE '%notebook%' 
   OR LOWER(name) LIKE '%diary%'
   OR LOWER(name) LIKE '%register%';

-- Categorize bottles
UPDATE products 
SET category = 'bottle' 
WHERE LOWER(name) LIKE '%bottle%' 
   OR LOWER(name) LIKE '%flask%';

-- Categorize bags
UPDATE products 
SET category = 'bag' 
WHERE LOWER(name) LIKE '%bag%' 
   OR LOWER(name) LIKE '%backpack%';

-- Step 5: Mark official vendors (you can update this based on your data)
UPDATE products 
SET is_official_vendor = true 
WHERE id IN (
    -- Add IDs of products from official vendors here
    -- For now, marking all existing products as official
    SELECT id FROM products LIMIT 100
);

-- Step 6: Add sample size variants for uniform products
-- Example: Add sizes for uniform items
INSERT INTO product_variants (product_id, variant_type, size, price_modifier, stock_quantity)
SELECT 
    id as product_id,
    'size' as variant_type,
    unnest(ARRAY['S', 'M', 'L', 'XL', 'XXL']) as size,
    0 as price_modifier,
    50 as stock_quantity
FROM products 
WHERE category = 'uniform'
ON CONFLICT DO NOTHING;

-- Step 7: Add sample measurement rules for uniform customization
-- Example: Add chest, waist, height measurements for uniforms
INSERT INTO measurement_rules (product_id, measurement_name, unit, min_value, max_value, instruction, display_order)
SELECT 
    id as product_id,
    'Chest' as measurement_name,
    'cm' as unit,
    60 as min_value,
    150 as max_value,
    'Measure around the fullest part of chest' as instruction,
    1 as display_order
FROM products 
WHERE category = 'uniform' AND (LOWER(name) LIKE '%shirt%' OR LOWER(name) LIKE '%blazer%')
ON CONFLICT DO NOTHING;

INSERT INTO measurement_rules (product_id, measurement_name, unit, min_value, max_value, instruction, display_order)
SELECT 
    id as product_id,
    'Waist' as measurement_name,
    'cm' as unit,
    50 as min_value,
    120 as max_value,
    'Measure around natural waistline' as instruction,
    2 as display_order
FROM products 
WHERE category = 'uniform' AND LOWER(name) LIKE '%pant%'
ON CONFLICT DO NOTHING;

INSERT INTO measurement_rules (product_id, measurement_name, unit, min_value, max_value, instruction, display_order)
SELECT 
    id as product_id,
    'Height' as measurement_name,
    'cm' as unit,
    100 as min_value,
    200 as max_value,
    'Total height from shoulder to desired length' as instruction,
    3 as display_order
FROM products 
WHERE category = 'uniform'
ON CONFLICT DO NOTHING;

-- Verification Query: Check the results
SELECT 
    category,
    COUNT(*) as product_count,
    SUM(CASE WHEN is_official_vendor THEN 1 ELSE 0 END) as official_count
FROM products
GROUP BY category
ORDER BY product_count DESC;

SELECT 
    p.name,
    p.category,
    p.is_official_vendor,
    COUNT(DISTINCT pv.id) as variant_count,
    COUNT(DISTINCT mr.id) as measurement_count
FROM products p
LEFT JOIN product_variants pv ON p.id = pv.product_id
LEFT JOIN measurement_rules mr ON p.id = mr.product_id
GROUP BY p.id, p.name, p.category, p.is_official_vendor
ORDER BY p.category, p.name
LIMIT 20;

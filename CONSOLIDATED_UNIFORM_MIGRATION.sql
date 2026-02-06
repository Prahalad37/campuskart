-- ============================================
-- CONSOLIDATED MIGRATION: Uniform Products Catalog
-- Run this entire script in Supabase SQL Editor
-- ============================================

-- Step 1: Create uniform_products table
-- ============================================
CREATE TABLE IF NOT EXISTS uniform_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_uniform_products_school ON uniform_products(school_id);
CREATE INDEX IF NOT EXISTS idx_uniform_products_day ON uniform_products(day_of_week);
CREATE INDEX IF NOT EXISTS idx_uniform_products_product ON uniform_products(product_id);

-- Enable RLS
ALTER TABLE uniform_products ENABLE ROW LEVEL SECURITY;

-- Step 2: Create RLS Policy (with safe check)
-- ============================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE policyname = 'Public read access' 
        AND tablename = 'uniform_products'
    ) THEN
        CREATE POLICY "Public read access" ON uniform_products FOR SELECT USING (true);
    END IF;
END $$;

-- Step 3: Insert Sample Uniform Products
-- ============================================
INSERT INTO products (name, price, category, image_url, description) VALUES
('White School Shirt with Crest', 450, 'Uniform', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop', 'Official school shirt with embroidered school crest, premium cotton fabric'),
('Navy Blue School Pants', 650, 'Uniform', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop', 'Formal navy blue pants, wrinkle-resistant fabric'),
('Black Formal Shoes', 850, 'Uniform', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'Polished black school shoes, comfortable for all-day wear'),
('House T-Shirt (Multi-Color)', 350, 'Sports Uniform', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 'House T-shirt available in Red, Blue, Green, Yellow'),
('White Sports Shorts', 400, 'Sports Uniform', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop', 'Comfortable white sports shorts with elastic waist'),
('Sports Shoes', 1200, 'Sports Uniform', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 'Quality sports shoes for athletics'),
('Casual Collared T-Shirt', 300, 'Activity Wear', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=400&fit=crop', 'Smart casual collared T-shirt'),
('Denim Jeans', 550, 'Activity Wear', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', 'Comfortable denim jeans'),
('Casual Sneakers', 900, 'Activity Wear', 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop', 'Stylish casual sneakers')
ON CONFLICT DO NOTHING;

-- Step 4: Link Products to Days for DPS Rohini
-- ============================================

-- Monday: Regular Uniform
INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT s.id, 'monday', p.id, 1, true 
FROM schools s 
CROSS JOIN products p 
WHERE s.slug = 'dps-rohini' AND p.name = 'White School Shirt with Crest'
ON CONFLICT DO NOTHING;

INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT s.id, 'monday', p.id, 2, true 
FROM schools s 
CROSS JOIN products p 
WHERE s.slug = 'dps-rohini' AND p.name = 'Navy Blue School Pants'
ON CONFLICT DO NOTHING;

INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT s.id, 'monday', p.id, 3, true 
FROM schools s 
CROSS JOIN products p 
WHERE s.slug = 'dps-rohini' AND p.name = 'Black Formal Shoes'
ON CONFLICT DO NOTHING;

-- Tuesday: Sports Uniform
INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT s.id, 'tuesday', p.id, 1, true 
FROM schools s 
CROSS JOIN products p 
WHERE s.slug = 'dps-rohini' AND p.name = 'House T-Shirt (Multi-Color)'
ON CONFLICT DO NOTHING;

INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT s.id, 'tuesday', p.id, 2, true 
FROM schools s 
CROSS JOIN products p 
WHERE s.slug = 'dps-rohini' AND p.name = 'White Sports Shorts'
ON CONFLICT DO NOTHING;

INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT s.id, 'tuesday', p.id, 3, true 
FROM schools s 
CROSS JOIN products p 
WHERE s.slug = 'dps-rohini' AND p.name = 'Sports Shoes'
ON CONFLICT DO NOTHING;

-- Wednesday, Thursday, Friday: Same as Monday
INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT s.id, 'wednesday', p.id, display_order, is_required
FROM uniform_products up
JOIN schools s ON s.id = up.school_id
JOIN products p ON p.id = up.product_id
WHERE s.slug = 'dps-rohini' AND up.day_of_week = 'monday'
ON CONFLICT DO NOTHING;

INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT s.id, 'thursday', p.id, display_order, is_required
FROM uniform_products up
JOIN schools s ON s.id = up.school_id
JOIN products p ON p.id = up.product_id
WHERE s.slug = 'dps-rohini' AND up.day_of_week = 'monday'
ON CONFLICT DO NOTHING;

INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT s.id, 'friday', p.id, display_order, is_required
FROM uniform_products up
JOIN schools s ON s.id = up.school_id
JOIN products p ON p.id = up.product_id
WHERE s.slug = 'dps-rohini' AND up.day_of_week = 'monday'
ON CONFLICT DO NOTHING;

-- Saturday: Activity Dress
INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT s.id, 'saturday', p.id, 1, true 
FROM schools s 
CROSS JOIN products p 
WHERE s.slug = 'dps-rohini' AND p.name = 'Casual Collared T-Shirt'
ON CONFLICT DO NOTHING;

INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT s.id, 'saturday', p.id, 2, true 
FROM schools s 
CROSS JOIN products p 
WHERE s.slug = 'dps-rohini' AND p.name = 'Denim Jeans'
ON CONFLICT DO NOTHING;

INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT s.id, 'saturday', p.id, 3, true 
FROM schools s 
CROSS JOIN products p 
WHERE s.slug = 'dps-rohini' AND p.name = 'Casual Sneakers'
ON CONFLICT DO NOTHING;

-- ============================================
-- Verification Query
-- ============================================
-- SELECT day_of_week, COUNT(*) as product_count
-- FROM uniform_products up
-- JOIN schools s ON s.id = up.school_id
-- WHERE s.slug = 'dps-rohini'
-- GROUP BY day_of_week
-- ORDER BY day_of_week;

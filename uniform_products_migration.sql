-- Uniform Product Catalog - Database Migration
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Create uniform_products table
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

-- Allow public read access
CREATE POLICY "Public read access" ON uniform_products FOR SELECT USING (true);

-- ============================================
-- 2. Insert Sample Uniform Products
-- ============================================

-- Monday - Regular Uniform Products
INSERT INTO products (name, price, category, image_url, description) VALUES
('White School Shirt with Crest', 450, 'Uniform', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop', 'Official school shirt with embroidered school crest, premium cotton fabric'),
('Navy Blue School Pants', 650, 'Uniform', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop', 'Formal navy blue pants, wrinkle-resistant fabric'),
('Black Formal Shoes', 850, 'Uniform', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'Polished black school shoes, comfortable for all-day wear')
ON CONFLICT DO NOTHING;

-- Tuesday - Sports Uniform Products
INSERT INTO products (name, price, category, image_url, description) VALUES
('House T-Shirt (Multi-Color)', 350, 'Sports Uniform', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', 'House T-shirt available in Red, Blue, Green, Yellow - specify color in notes'),
('White Sports Shorts', 400, 'Sports Uniform', 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop', 'Comfortable white sports shorts with elastic waist'),
('Sports Shoes', 1200, 'Sports Uniform', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', 'Quality sports shoes for athletics and physical education')
ON CONFLICT DO NOTHING;

-- Wednesday/Thursday/Friday - Regular Uniform (same as Monday)
-- Saturday - Activity Dress
INSERT INTO products (name, price, category, image_url, description) VALUES
('Casual Collared T-Shirt', 300, 'Activity Wear', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&h=400&fit=crop', 'Smart casual collared T-shirt for activity days'),
('Denim Jeans', 550, 'Activity Wear', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop', 'Comfortable denim jeans for casual wear'),
('Casual Sneakers', 900, 'Activity Wear', 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=400&h=400&fit=crop', 'Stylish casual sneakers for activity days')
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. Link Products to Days for DPS Rohini
-- ============================================

-- Monday - Regular Uniform
INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT 
  s.id as school_id,
  'monday' as day_of_week,
  p.id as product_id,
  CASE 
    WHEN p.name LIKE '%Shirt%' THEN 1
    WHEN p.name LIKE '%Pants%' THEN 2
    WHEN p.name LIKE '%Black Formal%' THEN 3
  END as display_order,
  true as is_required
FROM schools s
CROSS JOIN products p
WHERE s.slug = 'dps-rohini' 
  AND p.category = 'Uniform'
  AND p.name IN ('White School Shirt with Crest', 'Navy Blue School Pants', 'Black Formal Shoes')
ON CONFLICT DO NOTHING;

-- Tuesday - Sports Uniform
INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT 
  s.id as school_id,
  'tuesday' as day_of_week,
  p.id as product_id,
  CASE 
    WHEN p.name LIKE '%T-Shirt%' THEN 1
    WHEN p.name LIKE '%Shorts%' THEN 2
    WHEN p.name LIKE '%Sports Shoes%' THEN 3
  END as display_order,
  true as is_required
FROM schools s
CROSS JOIN products p
WHERE s.slug = 'dps-rohini' 
  AND p.category = 'Sports Uniform'
ON CONFLICT DO NOTHING;

-- Wednesday - Regular Uniform (same as Monday)
INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT 
  s.id as school_id,
  'wednesday' as day_of_week,
  p.id as product_id,
  CASE 
    WHEN p.name LIKE '%Shirt%' THEN 1
    WHEN p.name LIKE '%Pants%' THEN 2
    WHEN p.name LIKE '%Black Formal%' THEN 3
  END as display_order,
  true as is_required
FROM schools s
CROSS JOIN products p
WHERE s.slug = 'dps-rohini' 
  AND p.category = 'Uniform'
  AND p.name IN ('White School Shirt with Crest', 'Navy Blue School Pants', 'Black Formal Shoes')
ON CONFLICT DO NOTHING;

-- Thursday - Regular Uniform (same as Monday)
INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT 
  s.id as school_id,
  'thursday' as day_of_week,
  p.id as product_id,
  CASE 
    WHEN p.name LIKE '%Shirt%' THEN 1
    WHEN p.name LIKE '%Pants%' THEN 2
    WHEN p.name LIKE '%Black Formal%' THEN 3
  END as display_order,
  true as is_required
FROM schools s
CROSS JOIN products p
WHERE s.slug = 'dps-rohini' 
  AND p.category = 'Uniform'
  AND p.name IN ('White School Shirt with Crest', 'Navy Blue School Pants', 'Black Formal Shoes')
ON CONFLICT DO NOTHING;

-- Friday - Regular Uniform (same as Monday)
INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT 
  s.id as school_id,
  'friday' as day_of_week,
  p.id as product_id,
  CASE 
    WHEN p.name LIKE '%Shirt%' THEN 1
    WHEN p.name LIKE '%Pants%' THEN 2
    WHEN p.name LIKE '%Black Formal%' THEN 3
  END as display_order,
  true as is_required
FROM schools s
CROSS JOIN products p
WHERE s.slug = 'dps-rohini' 
  AND p.category = 'Uniform'
  AND p.name IN ('White School Shirt with Crest', 'Navy Blue School Pants', 'Black Formal Shoes')
ON CONFLICT DO NOTHING;

-- Saturday - Activity Dress
INSERT INTO uniform_products (school_id, day_of_week, product_id, display_order, is_required)
SELECT 
  s.id as school_id,
  'saturday' as day_of_week,
  p.id as product_id,
  CASE 
    WHEN p.name LIKE '%T-Shirt%' THEN 1
    WHEN p.name LIKE '%Jeans%' THEN 2
    WHEN p.name LIKE '%Sneakers%' THEN 3
  END as display_order,
  true as is_required
FROM schools s
CROSS JOIN products p
WHERE s.slug = 'dps-rohini' 
  AND p.category = 'Activity Wear'
ON CONFLICT DO NOTHING;

-- ============================================
-- DONE! Uniform products ready for display
-- ============================================

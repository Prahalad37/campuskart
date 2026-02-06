-- Enhanced School Landing Page - Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Update schools table with branding fields
-- ============================================

ALTER TABLE schools ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS banner_url TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS slogan TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '{"achievements": [], "specializations": [], "established": ""}'::jsonb;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS uniform_schedule JSONB DEFAULT '{}'::jsonb;

-- ============================================
-- 2. Create product_bundles table
-- ============================================

CREATE TABLE IF NOT EXISTS product_bundles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  bundle_type TEXT CHECK (bundle_type IN ('standard', 'sports', 'premium')),
  discount_percent INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_bundles_school_id ON product_bundles(school_id);
CREATE INDEX IF NOT EXISTS idx_product_bundles_class_id ON product_bundles(class_id);

-- ============================================
-- 3. Create bundle_items junction table
-- ============================================

CREATE TABLE IF NOT EXISTS bundle_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bundle_id UUID REFERENCES product_bundles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle_id ON bundle_items(bundle_id);
CREATE INDEX IF NOT EXISTS idx_bundle_items_product_id ON bundle_items(product_id);

-- ============================================
-- 4. Add category column to products (if not exists)
-- ============================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;

-- ============================================
-- 5. Rename image to image_url in products (if needed)
-- ============================================

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'products' AND column_name = 'image') THEN
    ALTER TABLE products RENAME COLUMN image TO image_url;
  END IF;
END $$;

-- ============================================
-- 6. Sample Data: Update Delhi Public School
-- ============================================

UPDATE schools
SET 
  logo_url = 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=200&fit=crop',
  banner_url = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop',
  slogan = 'Excellence in Education Since 1985',
  highlights = '{
    "achievements": ["CBSE Board Topper 2023", "Best Infrastructure Award 2022", "100% Pass Rate"],
    "specializations": ["STEM Education", "Sports Academy", "Music & Arts"],
    "established": "1985"
  }'::jsonb,
  uniform_schedule = '{
    "monday": {
      "type": "Regular",
      "description": "White shirt with school crest, navy blue pants/skirt, black shoes",
      "icon": "📘"
    },
    "tuesday": {
      "type": "Sports",
      "description": "House T-shirt (Red/Blue/Green/Yellow), white shorts, sports shoes",
      "icon": "⚽"
    },
    "wednesday": {
      "type": "Regular",
      "description": "White shirt with school crest, navy blue pants/skirt, black shoes",
      "icon": "📘"
    },
    "thursday": {
      "type": "Regular",
      "description": "White shirt with school crest, navy blue pants/skirt, black shoes",
      "icon": "📘"
    },
    "friday": {
      "type": "Regular",
      "description": "White shirt with school crest, navy blue pants/skirt, black shoes",
      "icon": "📘"
    },
    "saturday": {
      "type": "Activity",
      "description": "Smart casuals - collared T-shirt, jeans/trousers, casual shoes",
      "icon": "🎨"
    }
  }'::jsonb
WHERE slug = 'dps-rohini';

-- ============================================
-- 7. Sample Product Bundles
-- ============================================

-- Insert a standard bundle for Class 1
INSERT INTO product_bundles (name, description, school_id, class_id, bundle_type, discount_percent)
SELECT 
  'Class 1 Standard Package',
  'Everything your child needs to start Class 1 - Complete stationery set',
  s.id,
  c.id,
  'standard',
  10
FROM schools s
JOIN classes c ON c.school_id = s.id
WHERE s.slug = 'dps-rohini' AND c.name LIKE '%Class 1%'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Insert a sports bundle for Class 1
INSERT INTO product_bundles (name, description, school_id, class_id, bundle_type, discount_percent)
SELECT 
  'Class 1 Sports Package',
  'Sports essentials for active students - includes sports uniform and equipment',
  s.id,
  c.id,
  'sports',
  15
FROM schools s
JOIN classes c ON c.school_id = s.id
WHERE s.slug = 'dps-rohini' AND c.name LIKE '%Class 1%'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Note: Bundle items will be added via admin interface
-- or you can manually link products to bundles using bundle_items table

-- ============================================
-- 8. Enable RLS for new tables
-- ============================================

ALTER TABLE product_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON product_bundles FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bundle_items FOR SELECT USING (true);

-- ============================================
-- DONE! Schema ready for enhanced school pages
-- ============================================

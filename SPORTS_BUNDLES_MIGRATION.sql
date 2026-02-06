-- ============================================
-- SPORTS BUNDLES MIGRATION
-- Run AFTER uniform_products migration
-- ============================================

-- Step 1: Create Sports Bundle Products (if not exists)
-- ============================================
INSERT INTO products (name, price, category, image_url, description) VALUES
('Complete Sports Kit', 2500, 'Sports Bundle', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop', 'Full sports uniform package with house T-shirt, shorts, and shoes'),
('Athletics Starter Pack', 1800, 'Sports Bundle', 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop', 'Essential athletics kit for beginners'),
('Swimming Package', 2200, 'Sports Bundle', 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=600&h=400&fit=crop', 'Complete swimming gear including costume, goggles, and cap')
ON CONFLICT DO NOTHING;

-- Step 2: Create Product Bundles
-- ============================================
INSERT INTO product_bundles (school_id, name, description, discount_percent, is_active, image_url)
SELECT 
  s.id,
  'Complete Sports Uniform Set',
  'Everything you need for sports day! Includes house T-shirt, white sports shorts, sports shoes, and sports socks.',
  15,
  true,
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop'
FROM schools s
WHERE s.slug = 'dps-rohini'
ON CONFLICT DO NOTHING;

INSERT INTO product_bundles (school_id, name, description, discount_percent, is_active, image_url)
SELECT 
  s.id,
  'Regular Uniform Complete Set',
  'Full formal uniform package with shirt, pants, belt, tie, and formal shoes.',
  12,
  true,
  'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=400&fit=crop'
FROM schools s
WHERE s.slug = 'dps-rohini'
ON CONFLICT DO NOTHING;

INSERT INTO product_bundles (school_id, name, description, discount_percent, is_active, image_url)
SELECT 
  s.id,
  'Activity Day Bundle',
  'Perfect for Saturdays! Casual T-shirt, jeans, sneakers, and school bag.',
  10,
  true,
  'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&h=400&fit=crop'
FROM schools s
WHERE s.slug = 'dps-rohini'
ON CONFLICT DO NOTHING;

-- Step 3: Add Bundle Items (Products in each bundle)
-- ============================================

-- Sports Uniform Bundle Items
DO $$
DECLARE
  v_bundle_id UUID;
  v_product_id UUID;
BEGIN
  -- Get bundle ID
  SELECT pb.id INTO v_bundle_id
  FROM product_bundles pb
  JOIN schools s ON s.id = pb.school_id
  WHERE s.slug = 'dps-rohini' AND pb.name = 'Complete Sports Uniform Set';

  -- Add House T-Shirt
  SELECT id INTO v_product_id FROM products WHERE name = 'House T-Shirt (Multi-Color)';
  INSERT INTO bundle_items (bundle_id, product_id, quantity)
  VALUES (v_bundle_id, v_product_id, 1)
  ON CONFLICT DO NOTHING;

  -- Add White Sports Shorts
  SELECT id INTO v_product_id FROM products WHERE name = 'White Sports Shorts';
  INSERT INTO bundle_items (bundle_id, product_id, quantity)
  VALUES (v_bundle_id, v_product_id, 1)
  ON CONFLICT DO NOTHING;

  -- Add Sports Shoes
  SELECT id INTO v_product_id FROM products WHERE name = 'Sports Shoes';
  INSERT INTO bundle_items (bundle_id, product_id, quantity)
  VALUES (v_bundle_id, v_product_id, 1)
  ON CONFLICT DO NOTHING;
END $$;

-- Regular Uniform Bundle Items
DO $$
DECLARE
  v_bundle_id UUID;
  v_product_id UUID;
BEGIN
  -- Get bundle ID
  SELECT pb.id INTO v_bundle_id
  FROM product_bundles pb
  JOIN schools s ON s.id = pb.school_id
  WHERE s.slug = 'dps-rohini' AND pb.name = 'Regular Uniform Complete Set';

  -- Add White School Shirt
  SELECT id INTO v_product_id FROM products WHERE name = 'White School Shirt with Crest';
  INSERT INTO bundle_items (bundle_id, product_id, quantity)
  VALUES (v_bundle_id, v_product_id, 2)
  ON CONFLICT DO NOTHING;

  -- Add Navy Blue Pants
  SELECT id INTO v_product_id FROM products WHERE name = 'Navy Blue School Pants';
  INSERT INTO bundle_items (bundle_id, product_id, quantity)
  VALUES (v_bundle_id, v_product_id, 2)
  ON CONFLICT DO NOTHING;

  -- Add Formal Shoes
  SELECT id INTO v_product_id FROM products WHERE name = 'Black Formal Shoes';
  INSERT INTO bundle_items (bundle_id, product_id, quantity)
  VALUES (v_bundle_id, v_product_id, 1)
  ON CONFLICT DO NOTHING;
END $$;

-- Activity Day Bundle Items
DO $$
DECLARE
  v_bundle_id UUID;
  v_product_id UUID;
BEGIN
  -- Get bundle ID
  SELECT pb.id INTO v_bundle_id
  FROM product_bundles pb
  JOIN schools s ON s.id = pb.school_id
  WHERE s.slug = 'dps-rohini' AND pb.name = 'Activity Day Bundle';

  -- Add Casual T-Shirt
  SELECT id INTO v_product_id FROM products WHERE name = 'Casual Collared T-Shirt';
  INSERT INTO bundle_items (bundle_id, product_id, quantity)
  VALUES (v_bundle_id, v_product_id, 1)
  ON CONFLICT DO NOTHING;

  -- Add Jeans
  SELECT id INTO v_product_id FROM products WHERE name = 'Denim Jeans';
  INSERT INTO bundle_items (bundle_id, product_id, quantity)
  VALUES (v_bundle_id, v_product_id, 1)
  ON CONFLICT DO NOTHING;

  -- Add Casual Sneakers
  SELECT id INTO v_product_id FROM products WHERE name = 'Casual Sneakers';
  INSERT INTO bundle_items (bundle_id, product_id, quantity)
  VALUES (v_bundle_id, v_product_id, 1)
  ON CONFLICT DO NOTHING;
END $$;

-- ============================================
-- Verification Query
-- ============================================
-- SELECT 
--   pb.name as bundle_name,
--   pb.discount_percent,
--   COUNT(bi.id) as item_count
-- FROM product_bundles pb
-- JOIN schools s ON s.id = pb.school_id
-- LEFT JOIN bundle_items bi ON bi.bundle_id = pb.id
-- WHERE s.slug = 'dps-rohini'
-- GROUP BY pb.id, pb.name, pb.discount_percent
-- ORDER BY pb.name;

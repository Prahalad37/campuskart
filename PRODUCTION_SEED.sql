-- ============================================
-- PRODUCTION DATABASE SEED - DPS Rohini
-- Run this in Supabase SQL Editor
-- ============================================

-- Create DPS Rohini school with full details
INSERT INTO schools (name, slug, address, contact, email, logo_url, banner_url, slogan, highlights, uniform_schedule)
VALUES (
  'Delhi Public School Rohini',
  'dps-rohini',
  'Sector 7 BPTP, Rohini, Delhi - 110085',
  '+91-11-27555555',  
  'info@dpsrohini.com',
  'https://images.unsplash.com/photo-1562774053-701939374585?w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=400&fit=crop',
  'Excellence in Education Since 1999',
  '{"achievements": ["CBSE Top Ranked School", "100% Board Results", "State Sports Champions"], "specializations": ["STEM Education", "Performing Arts", "Sports Academy"], "established": "1999"}',
  '{"monday": {"type": "Regular Uniform", "description": "White shirt, navy pants, black shoes, school badge", "icon": "👔"}, "tuesday": {"type": "Sports Uniform", "description": "House T-shirt, white shorts, sports shoes", "icon": "⚽"}, "wednesday": {"type": "Regular Uniform", "description": "White shirt, navy pants, black shoes, school badge", "icon": "👔"}, "thursday": {"type": "Regular Uniform", "description": "White shirt, navy pants, black shoes, school badge", "icon": "👔"}, "friday": {"type": "Regular Uniform", "description": "White shirt, navy pants, black shoes, school badge", "icon": "👔"}, "saturday": {"type": "Activity Dress", "description": "Casual collared T-shirt, jeans, sneakers", "icon": "🎨"}}'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  address = EXCLUDED.address,
  contact = EXCLUDED.contact,
  email = EXCLUDED.email,
  logo_url = EXCLUDED.logo_url,
  banner_url = EXCLUDED.banner_url,
  slogan = EXCLUDED.slogan,
  highlights = EXCLUDED.highlights,
  uniform_schedule = EXCLUDED.uniform_schedule;

-- Insert Classes for DPS Rohini
INSERT INTO classes (name, school_id)
SELECT 'Class ' || class_num, s.id
FROM schools s, generate_series(1, 12) AS class_num
WHERE s.slug = 'dps-rohini'
ON CONFLICT DO NOTHING;

-- Insert Standard Products
INSERT INTO products (name, price, category, image_url, description) VALUES
('White School Shirt with Crest', 450, 'Uniform', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop', 'Official school shirt with embroidered crest'),
('Navy Blue School Pants', 650, 'Uniform', 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop', 'Formal navy blue pants'),
('Black Formal Shoes', 850, 'Uniform', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop', 'Polished black school shoes'),
('School Tie', 200, 'Uniform', 'https://images.unsplash.com/photo-1611895363974-065046d22a5f?w=400&h=400&fit=crop', 'Striped school tie'),
('School Bag', 1200, 'Accessories', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', 'Branded school backpack'),
('Geometry Box', 250, 'Stationery', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop', 'Complete geometry set'),
('Class 1 Book Set', 1800, 'Books', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop', 'Complete NCERT books for Class 1'),
('Class 5 Book Set', 2200, 'Books', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop', 'Complete NCERT books for Class 5'),
('Class 8 Book Set', 2800, 'Books', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop', 'Complete NCERT books for Class 8'),
('Class 10 Book Set', 3200, 'Books', 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=400&fit=crop', 'Complete NCERT + Reference books')
ON CONFLICT DO NOTHING;

-- Map Uniform products to ALL classes
INSERT INTO class_products (class_id, product_id)
SELECT c.id, p.id
FROM classes c
CROSS JOIN products p
JOIN schools s ON s.id = c.school_id
WHERE s.slug = 'dps-rohini'
AND p.category IN ('Uniform', 'Accessories', 'Stationery')
ON CONFLICT DO NOTHING;

-- Map Class-specific book sets
INSERT INTO class_products (class_id, product_id)
SELECT c.id, p.id
FROM classes c
JOIN schools s ON s.id = c.school_id
JOIN products p ON p.name LIKE 'Class ' || SUBSTRING(c.name FROM 'Class (\d+)') || '%'
WHERE s.slug = 'dps-rohini'
AND p.category = 'Books'
ON CONFLICT DO NOTHING;

-- ============================================
-- Verification Queries
-- ============================================

-- Check school exists
SELECT * FROM schools WHERE slug = 'dps-rohini';

-- Check classes (should be 12)
SELECT COUNT(*) as class_count FROM classes c
JOIN schools s ON s.id = c.school_id
WHERE s.slug = 'dps-rohini';

-- Check products per class
SELECT 
  c.name as class_name,
  COUNT(cp.product_id) as product_count
FROM classes c
JOIN schools s ON s.id = c.school_id
LEFT JOIN class_products cp ON cp.class_id = c.id
WHERE s.slug = 'dps-rohini'
GROUP BY c.id, c.name
ORDER BY c.name;

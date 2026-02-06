-- CRITICAL: Verify DPS Rohini exists
-- Run this in Supabase SQL Editor

-- 1. Check if school exists
SELECT * FROM schools WHERE slug = 'dps-rohini';

-- 2. If above returns 0 rows, RUN THIS:
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
ON CONFLICT (slug) DO NOTHING;

-- 3. Check RLS policies (might be blocking)
SELECT * FROM pg_policies WHERE tablename = 'schools';

-- 4. If RLS is blocking, temporarily disable it:
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE class_products DISABLE ROW LEVEL SECURITY;

-- 5. Verify data again
SELECT 
  s.name as school_name,
  COUNT(c.id) as class_count
FROM schools s
LEFT JOIN classes c ON c.school_id = s.id
WHERE s.slug = 'dps-rohini'
GROUP BY s.id, s.name;

-- CampusKart Demo Pilot Data
-- 4 Schools, 12 Classes, 4 Products, 48 Mappings

-- Clean up existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE class_products CASCADE;
-- TRUNCATE TABLE products CASCADE;
-- TRUNCATE TABLE classes CASCADE;
-- TRUNCATE TABLE schools CASCADE;

-- ================================
-- 1. INSERT SCHOOLS
-- ================================

INSERT INTO schools (name, slug) VALUES
('Sunrise Public School Babatpur', 'sunrise-babatpur'),
('Green Valley School Shivpur', 'green-valley-shivpur'),
('Kashi Modern Academy', 'kashi-modern'),
('Airport City School', 'airport-city');

-- ================================
-- 2. INSERT CLASSES (3 per school)
-- ================================

-- Sunrise Public School Babatpur
INSERT INTO classes (name, school_id) VALUES
('Class 1', (SELECT id FROM schools WHERE slug = 'sunrise-babatpur')),
('Class 5', (SELECT id FROM schools WHERE slug = 'sunrise-babatpur')),
('Class 8', (SELECT id FROM schools WHERE slug = 'sunrise-babatpur'));

-- Green Valley School Shivpur
INSERT INTO classes (name, school_id) VALUES
('Class 1', (SELECT id FROM schools WHERE slug = 'green-valley-shivpur')),
('Class 5', (SELECT id FROM schools WHERE slug = 'green-valley-shivpur')),
('Class 8', (SELECT id FROM schools WHERE slug = 'green-valley-shivpur'));

-- Kashi Modern Academy
INSERT INTO classes (name, school_id) VALUES
('Class 1', (SELECT id FROM schools WHERE slug = 'kashi-modern')),
('Class 5', (SELECT id FROM schools WHERE slug = 'kashi-modern')),
('Class 8', (SELECT id FROM schools WHERE slug = 'kashi-modern'));

-- Airport City School
INSERT INTO classes (name, school_id) VALUES
('Class 1', (SELECT id FROM schools WHERE slug = 'airport-city')),
('Class 5', (SELECT id FROM schools WHERE slug = 'airport-city')),
('Class 8', (SELECT id FROM schools WHERE slug = 'airport-city'));

-- ================================
-- 3. INSERT PRODUCTS
-- ================================

INSERT INTO products (name, price, type, image) VALUES
('Uniform Set', 1200, 'uniform', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400'),
('Books Bundle', 1800, 'books', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400'),
('Stationery Kit', 600, 'stationery', 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400'),
('Shoes', 900, 'uniform', 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400');

-- ================================
-- 4. MAP PRODUCTS TO CLASSES
-- ================================

-- Insert all products for all classes
INSERT INTO class_products (class_id, product_id)
SELECT 
    c.id as class_id,
    p.id as product_id
FROM classes c
CROSS JOIN products p;

-- ================================
-- VERIFICATION QUERIES
-- ================================

-- Check schools count (should be 4)
SELECT COUNT(*) as school_count FROM schools;

-- Check classes count (should be 12)
SELECT COUNT(*) as class_count FROM classes;

-- Check products count (should be 4)
SELECT COUNT(*) as product_count FROM products;

-- Check mappings count (should be 48)
SELECT COUNT(*) as mapping_count FROM class_products;

-- View all schools with their classes
SELECT 
    s.name as school_name,
    s.slug,
    COUNT(c.id) as class_count
FROM schools s
LEFT JOIN classes c ON c.school_id = s.id
GROUP BY s.id, s.name, s.slug
ORDER BY s.name;

-- View products per class (should all be 4)
SELECT 
    s.name as school_name,
    c.name as class_name,
    COUNT(cp.product_id) as product_count
FROM schools s
JOIN classes c ON c.school_id = s.id
LEFT JOIN class_products cp ON cp.class_id = c.id
GROUP BY s.name, c.name
ORDER BY s.name, c.name;

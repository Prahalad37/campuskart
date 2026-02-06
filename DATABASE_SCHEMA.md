# CampusKart Database Schema

This document describes the Supabase database schema for CampusKart.

## Tables

### schools
Stores information about educational institutions.

```sql
CREATE TABLE schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  address TEXT,
  contact TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster slug lookups
CREATE INDEX idx_schools_slug ON schools(slug);
```

### classes
Stores class/grade information for each school.

```sql
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade TEXT,
  section TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster school queries
CREATE INDEX idx_classes_school_id ON classes(school_id);
```

### products
Stores all available products.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  image TEXT,
  type TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### class_products
Junction table linking classes to their required products.

```sql
CREATE TABLE class_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX idx_class_products_class_id ON class_products(class_id);
CREATE INDEX idx_class_products_product_id ON class_products(product_id);

-- Ensure unique class-product combinations
CREATE UNIQUE INDEX idx_class_products_unique ON class_products(class_id, product_id);
```

### orders
Stores customer orders.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  total INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  class_id UUID REFERENCES classes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for status queries
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_class_id ON orders(class_id);
```

## Sample Data

### Insert sample school
```sql
INSERT INTO schools (name, slug, address, contact, email) VALUES
('Delhi Public School', 'dps-rohini', 'Sector 24, Rohini, New Delhi - 110085', '011-2345-6789', 'info@dps-rohini.edu.in'),
('Modern School', 'modern-vasant-vihar', 'Barakhamba Road, New Delhi - 110001', '011-9876-5432', 'info@modernschool.edu.in');
```

### Insert sample classes
```sql
INSERT INTO classes (school_id, name, grade, section) 
SELECT id, 'Class 1A', '1', 'A' FROM schools WHERE slug = 'dps-rohini'
UNION ALL
SELECT id, 'Class 1B', '1', 'B' FROM schools WHERE slug = 'dps-rohini'
UNION ALL
SELECT id, 'Class 2A', '2', 'A' FROM schools WHERE slug = 'dps-rohini';
```

### Insert sample products
```sql
INSERT INTO products (name, price, type, description) VALUES
('Notebook Set (6 pcs)', 250, 'stationery', 'Set of 6 ruled notebooks'),
('Pencil Box Kit', 350, 'stationery', 'Complete pencil box with essentials'),
('School Bag', 1200, 'bag', 'Standard school bag - Blue'),
('Water Bottle', 300, 'accessories', 'Insulated water bottle - 750ml'),
('Geometry Box', 180, 'stationery', 'Complete geometry instruments set');
```

### Link products to classes
```sql
-- Example: Link products to Class 1A
INSERT INTO class_products (class_id, product_id, quantity)
SELECT c.id, p.id, 1
FROM classes c, products p
WHERE c.name = 'Class 1A' 
  AND c.school_id IN (SELECT id FROM schools WHERE slug = 'dps-rohini')
  AND p.name IN ('Notebook Set (6 pcs)', 'Pencil Box Kit', 'School Bag', 'Water Bottle');
```

## Row Level Security (RLS)

For production, enable RLS policies:

```sql
-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to schools, classes, products
CREATE POLICY "Public read access" ON schools FOR SELECT USING (true);
CREATE POLICY "Public read access" ON classes FOR SELECT USING (true);
CREATE POLICY "Public read access" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access" ON class_products FOR SELECT USING (true);

-- Allow public insert for orders
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
```

## Setup Instructions

1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor in your Supabase dashboard
3. Run the CREATE TABLE statements above
4. Insert sample data for testing
5. Enable RLS policies for production
6. Copy your project URL and anon key
7. Add them to `.env.local` file in your Next.js project

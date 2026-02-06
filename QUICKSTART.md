# Quick Start Guide - Supabase Setup

Follow these steps to get your CampusKart application running with Supabase.

## Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Supabase account created (free tier is fine)

## Setup Steps

### 1. Install Dependencies
```bash
cd Campus_Kart
npm install
```

### 2. Create Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Fill in:
   - **Name**: CampusKart (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select closest to your location
   - **Pricing Plan**: Free tier is sufficient for development
4. Click "Create new project"
5. Wait 1-2 minutes for project initialization

### 3. Set Up Database Tables

1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy the entire contents of `DATABASE_SCHEMA.md` (all the CREATE TABLE statements)
4. Paste into the SQL editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. Verify all tables were created successfully

### 4. Add Sample Data

Still in the SQL Editor, run these queries one by one:

#### Add Sample Schools
```sql
INSERT INTO schools (name, slug, address, contact, email) VALUES
('Delhi Public School', 'dps-rohini', 'Sector 24, Rohini, New Delhi - 110085', '011-2345-6789', 'info@dps-rohini.edu.in'),
('Modern School', 'modern-vasant-vihar', 'Barakhamba Road, New Delhi - 110001', '011-9876-5432', 'info@modernschool.edu.in');
```

#### Add Sample Classes
```sql
INSERT INTO classes (school_id, name, grade, section) 
SELECT id, 'Class 1A', '1', 'A' FROM schools WHERE slug = 'dps-rohini'
UNION ALL
SELECT id, 'Class 1B', '1', 'B' FROM schools WHERE slug = 'dps-rohini'
UNION ALL
SELECT id, 'Class 2A', '2', 'A' FROM schools WHERE slug = 'dps-rohini'
UNION ALL
SELECT id, 'Class 2B', '2', 'B' FROM schools WHERE slug = 'dps-rohini';
```

#### Add Sample Products
```sql
INSERT INTO products (name, price, type, description) VALUES
('Notebook Set (6 pcs)', 250, 'stationery', 'Set of 6 ruled notebooks - 200 pages each'),
('Pencil Box Kit', 350, 'stationery', 'Complete pencil box with HB pencils, eraser, sharpener, and ruler'),
('School Bag', 1200, 'bag', 'Standard school bag - Navy Blue with multiple compartments'),
('Water Bottle', 300, 'accessories', 'Insulated water bottle - 750ml capacity'),
('Geometry Box', 180, 'stationery', 'Complete geometry instruments set with compass, protractor, and set squares'),
('Art Supply Kit', 450, 'art', 'Crayons, sketch pens, and drawing book'),
('Sports Shoes', 1500, 'footwear', 'White sports shoes for PE class - Multiple sizes'),
('Uniform Set', 800, 'uniform', 'Complete uniform set - Shirt and trousers/skirt');
```

#### Link Products to Classes
```sql
-- Link products to Class 1A
INSERT INTO class_products (class_id, product_id, quantity)
SELECT c.id, p.id, 1
FROM classes c
CROSS JOIN products p
WHERE c.name = 'Class 1A' 
  AND c.school_id IN (SELECT id FROM schools WHERE slug = 'dps-rohini')
  AND p.name IN ('Notebook Set (6 pcs)', 'Pencil Box Kit', 'School Bag', 'Water Bottle', 'Geometry Box');

-- Link products to Class 1B (same as 1A)
INSERT INTO class_products (class_id, product_id, quantity)
SELECT c.id, p.id, 1
FROM classes c
CROSS JOIN products p
WHERE c.name = 'Class 1B' 
  AND c.school_id IN (SELECT id FROM schools WHERE slug = 'dps-rohini')
  AND p.name IN ('Notebook Set (6 pcs)', 'Pencil Box Kit', 'School Bag', 'Water Bottle', 'Geometry Box');

-- Link products to Class 2A (includes art supplies)
INSERT INTO class_products (class_id, product_id, quantity)
SELECT c.id, p.id, 1
FROM classes c
CROSS JOIN products p
WHERE c.name = 'Class 2A' 
  AND c.school_id IN (SELECT id FROM schools WHERE slug = 'dps-rohini')
  AND p.name IN ('Notebook Set (6 pcs)', 'Pencil Box Kit', 'School Bag', 'Water Bottle', 'Geometry Box', 'Art Supply Kit');
```

### 5. Get Your Supabase Credentials

1. In Supabase dashboard, click **Settings** (left sidebar)
2. Click **API** tab
3. You'll see:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Project API keys** → **anon/public** key

### 6. Configure Environment Variables

1. In your project root (`Campus_Kart`), create `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` and update:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. Replace the placeholder values with your actual credentials from Step 5

### 7. Start Development Server

```bash
npm run dev
```

### 8. Test the Application

Open your browser and test these URLs:

1. **Landing Page**: [http://localhost:3000](http://localhost:3000)
   - Should show QR entry screen
   - Click "Start Demo Scan" → should redirect to school page

2. **School Page**: [http://localhost:3000/s/dps-rohini](http://localhost:3000/s/dps-rohini)
   - Should load school data from Supabase
   - Should display "Delhi Public School"
   - Should show classes: Class 1A, Class 1B, Class 2A, Class 2B
   - Select a class and click "Continue"

## Verification Checklist

- [ ] Dependencies installed successfully
- [ ] Supabase project created
- [ ] All database tables created
- [ ] Sample data inserted
- [ ] Environment variables configured
- [ ] Development server running
- [ ] Landing page loads
- [ ] School page displays real data from Supabase
- [ ] Classes are shown dynamically
- [ ] Can select a class

## Troubleshooting

### Issue: "School not found" error
**Solution**: 
- Check that sample data was inserted correctly
- Verify the slug in URL matches the slug in database (`dps-rohini`)
- Check Supabase credentials in `.env.local`

### Issue: No classes showing
**Solution**:
- Verify classes were inserted with correct `school_id`
- Check browser console for errors
- Verify Supabase credentials

### Issue: Environment variables not working
**Solution**:
- Restart development server after changing `.env.local`
- Ensure file is named exactly `.env.local` (not `.env.local.txt`)
- Check that variables start with `NEXT_PUBLIC_`

### Issue: TypeScript errors
**Solution**:
```bash
npm run type-check
```
Should show no errors. If errors exist, check imports and type definitions.

## Next Steps

Once everything is working:

1. **Customize data**: Add your own schools, classes, and products in Supabase
2. **Enable RLS**: Set up Row Level Security policies (see DATABASE_SCHEMA.md)
3. **Deploy**: Push to GitHub and deploy on Vercel
4. **Add features**: Implement remaining pages (products, checkout)

## Need Help?

- Check `README.md` for detailed documentation
- Review `DATABASE_SCHEMA.md` for database structure
- Check `walkthrough.md` for implementation details

## Production Deployment

When ready for production:

1. Enable Row Level Security in Supabase
2. Add production environment variables to Vercel
3. Update `NEXT_PUBLIC_APP_URL` to your production domain
4. Test all features thoroughly
5. Deploy!

---

**Estimated setup time**: 15-20 minutes

Good luck! 🚀

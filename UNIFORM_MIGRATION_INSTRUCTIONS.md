# Uniform Products Migration - Setup Instructions

## Quick Start

You need to run the SQL migration to enable uniform products display on the school landing page.

### Option 1: Supabase Dashboard (Recommended)

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (`ahvxkmwridwwfwdpfgti`)
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire contents of `CONSOLIDATED_UNIFORM_MIGRATION.sql`
6. Paste into the SQL editor
7. Click **Run** button
8. Wait for success message

### Option 2: Copy SQL Directly

```sql
-- Open Supabase SQL Editor and paste this entire block:

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

/* ... rest of the SQL from CONSOLIDATED_UNIFORM_MIGRATION.sql ... */
```

## What This Migration Does

1. ✅ **Creates `uniform_products` table** - Links products to specific weekdays
2. ✅ **Adds sample products** - 9 uniform items (shirts, pants, shoes, etc.)
3. ✅ **Links products to days** - Monday-Saturday uniform schedule for DPS Rohini
4. ✅ **Sets up RLS policies** - Public read access for the table

## After Migration

Once migration completes:

1. Navigate to http://localhost:3000
2. Click **"Start Demo Scan"** button
3. You'll be redirected to http://localhost:3000/s/dps-rohini
4. Scroll to **"Weekly Uniform Schedule"**
5. Click different days (Mon, Tue, Wed, etc.)
6. You should see **product cards with images, prices, and "Add to Cart" buttons**

## Verification

Run this query in Supabase to verify data:

```sql
SELECT day_of_week, COUNT(*) as product_count
FROM uniform_products up
JOIN schools s ON s.id = up.school_id
WHERE s.slug = 'dps-rohini'
GROUP BY day_of_week
ORDER BY day_of_week;
```

**Expected output:**
- monday: 3 products
- tuesday: 3 products  
- wednesday: 3 products
- thursday: 3 products
- friday: 3 products
- saturday: 3 products

## Troubleshooting

### Issue: Table already exists
**Solution:** The migration is idempotent (safe to run multiple times). It uses `IF NOT EXISTS` and `ON CONFLICT DO NOTHING`.

### Issue: No products showing on page
**Checklist:**
1. ✅ Migration ran successfully
2. ✅ Verification query returns data
3. ✅ Hard refresh page (Cmd+Shift+R)
4. ✅ Check browser console for errors

### Issue: Images not loading
The migration uses Unsplash CDN URLs. If images don't load, check your internet connection.

## Next Steps

After uniform products are working:

1. **Sports Bundles** - Add complete sports uniform packages
2. **Product Bundles Display** - Show discounted bundle offers
3. **Bundle Detail Modal** - Click to expand bundle details
4. **Admin Interface** - Manage products through admin panel

---

**Need help?** Check the browser console (F12) for any errors.

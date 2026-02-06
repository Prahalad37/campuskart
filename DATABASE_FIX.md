# 🔧 CRITICAL FIX NEEDED - Database Seeding

## Issue Found
❌ **School page shows "School Not Found"**  
**URL:** https://campuskart-nine.vercel.app/s/dps-rohini  
**Cause:** Database has no DPS Rohini school data

## Fix Steps (2 minutes)

### Step 1: Open Supabase SQL Editor
Already opened: https://supabase.com/dashboard/project/ahvxkmwridwwfwdpfgti/sql/new

### Step 2: Run PRODUCTION_SEED.sql

1. Open file: `PRODUCTION_SEED.sql`
2. Copy entire contents
3. Paste in Supabase SQL Editor
4. Click "Run"

Wait for "Success" ✅

### Step 3: Verify

Test these URLs:
- https://campuskart-nine.vercel.app/s/dps-rohini (should load school page)
- School banner should appear
- Classes should show
- Products should display

## What Gets Created

**DPS Rohini School:**
- Name, address, contact
- Logo and banner images
- School highlights
- Weekly uniform schedule

**12 Classes:** Class 1 through Class 12

**10 Products:**
- Uniforms (shirt, pants, shoes, tie)
- Books (Class 1, 5, 8, 10)
- Accessories (bag, geometry box)

**Product Mappings:** All classes get uniforms + class-specific books

## After Seeding

Everything will work:
- ✅ Homepage → Demo scan
- ✅ School page loads
- ✅ Uniform schedule displays
- ✅ Class selection works
- ✅ Products show in classes
- ✅ Add to cart functional
- ✅ Checkout works

Run karo aur test karo! 🚀

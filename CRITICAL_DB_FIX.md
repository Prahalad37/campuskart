# 🔥 CRITICAL FIX - DPS Rohini Not Showing

## Issue
School page at https://campuskart-nine.vercel.app/s/dps-rohini shows "School Not Found"

## Root Cause
The PRODUCTION_SEED.sql was created but **USER DIDN'T RUN IT IN SUPABASE!**

## Immediate Fix Required

### Step 1: Verify Database (Check First)
Run this in Supabase SQL Editor:
```sql
SELECT * FROM schools WHERE slug = 'dps-rohini';
```

**If returns 0 rows** → Database is empty, need to run seed!

### Step 2: Run PRODUCTION_SEED.sql
1. Open: https://supabase.com/dashboard/project/ahvxkmwridwwfwdpfgti/sql/new
2. Copy ALL contents of `PRODUCTION_SEED.sql`
3. Paste in SQL editor
4. Click "Run"
5. Wait for "Success" message

### Step 3: Verify Data Created
```sql
-- Should return 1 row
SELECT COUNT(*) FROM schools WHERE slug = 'dps-rohini';

-- Should return 12 rows
SELECT COUNT(*) FROM classes c 
JOIN schools s ON s.id = c.school_id 
WHERE s.slug = 'dps-rohini';

-- Should return 10 rows
SELECT COUNT(*) FROM products;
```

### Step 4: Test Again
Visit: https://campuskart-nine.vercel.app/s/dps-rohini

Should now show:
✅ School name: "Delhi Public School Rohini"
✅ School logo and banner
✅ Weekly uniform schedule
✅ 12 classes (Class 1-12)

## Why This Happened
SQL file was created but Supabase SQL wasn't executed. The file just exists locally - data isn't in database yet!

**RUN THE SQL NOW!** 🚨

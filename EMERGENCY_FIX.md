# 🔴 EMERGENCY FIX - School Still Not Showing

## Problem
After all fixes, school page STILL shows "School Not Found"

## Root Cause Analysis

There are 3 possible issues:

### 1. Wrong Supabase API Key in Vercel ❌
**Most Likely!**

Your `.env.local` has **DIFFERENT** key than production needs!

**Local (.env.local):**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_stRnCH6ir9pwMJjfQ3mhYw_w8-ENgca
```

**Production (.env.production):**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhrbXdyaWR3d2Z3ZHBmZ3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MTM2MzQsImV4cCI6MjA1Mzk4OTYzNH0.RiYAymr5ZiGOpnS-AK_9GhVdPQFwLNu-YJG-0nJB1MI
```

**FIX NOW:**

1. Open Vercel env vars (already open)
2. Find `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **CHANGE THE VALUE TO:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhrbXdyaWR3d2Z3ZHBmZ3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MTM2MzQsImV4cCI6MjA1Mzk4OTYzNH0.RiYAymr5ZiGOpnS-AK_9GhVdPQFwLNu-YJG-0nJB1MI
```

4. Click "Save"
5. **REDEPLOY!**

---

### 2. Database Not Actually Seeded ❌

Verify in Supabase:
```sql
SELECT * FROM schools WHERE slug = 'dps-rohini';
```

If returns 0 rows → Run `PRODUCTION_SEED.sql` again!

---

### 3. Supabase RLS Blocking Requests ❌

Check if Row Level Security is too strict.

**Quick Test:**
```sql
-- Disable RLS temporarily
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```

Then test: https://campuskart-nine.vercel.app/s/dps-rohini

---

## MOST LIKELY FIX

**The API key in Vercel is WRONG!**

**ACTION:**
1. Vercel env vars page (already open)
2. Click edit on `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
3. Paste: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhrbXdyaWR3d2Z3ZHBmZ3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MTM2MzQsImV4cCI6MjA1Mzk4OTYzNH0.RiYAymr5ZiGOpnS-AK_9GhVdPQFwLNu-YJG-0nJB1MI`
4. Save
5. Redeploy

**DO THIS NOW!** 🚨

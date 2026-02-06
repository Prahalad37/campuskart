# 🔍 SYSTEMATIC DEBUG - Step by Step

## Test 1: Localhost ✅ or ❌
**Open:** http://localhost:3000/s/dps-rohini

**If shows school data** → Code is fine, production deployment issue
**If shows "School Not Found"** → Database or API key issue

---

## Test 2: Database Check
**Open:** Supabase Table Editor (already opened)

**Run in SQL Editor:**
```sql
SELECT * FROM schools WHERE slug = 'dps-rohini';
```

**If returns 0 rows** → Database NOT seeded! Run `VERIFY_DB.sql`
**If returns 1 row** → Data exists, check RLS

---

## Test 3: RLS (Row Level Security) Check

RLS might be BLOCKING requests!

**Run in Supabase SQL:**
```sql
ALTER TABLE schools DISABLE ROW LEVEL SECURITY;
ALTER TABLE classes DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```

Then test: https://campuskart-nine.vercel.app/s/dps-rohini

**If works now** → RLS was the problem
**Still doesn't work** → API key or environment variable issue

---

## Test 4: Direct Supabase Test

I've created `/tmp/test_supabase.js` - check the output!

**If shows ✅** → Supabase connection works
**If shows ❌** → API key or permissions problem

---

## RESULTS - Tell Me:

1. **Localhost:** Working or "School Not Found"?
2. **Database query:** How many rows returned?
3. **Node test:** What output did you see?

Based on answers, I'll know EXACT fix! 🎯

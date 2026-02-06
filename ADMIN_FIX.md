# 🔧 Admin Panel "Invalid API Key" Fix

## Issue
All admin pages showing:
- ❌ "Invalid API key"
- ❌ "Failed to load schools/classes/products/orders"

## Root Cause
Vercel deployment either:
1. Still building (not complete yet)
2. Environment variables not loaded
3. Using old cached build

## Solution Steps

### Step 1: Check Deployment Status
Open Vercel dashboard: https://vercel.com/prahalads-projects-216e11ca/campuskart

**Look for:**
- Latest deployment status: "Ready" ✅ or "Building" ⏳
- Commit: "8d1d114 - Fix: Change Button variant..."

### Step 2: If "Building" - Wait
- Takes 2-3 minutes
- Watch for "Building..." → "Ready"
- Then test again

### Step 3: If "Ready" but still errors - Force Refresh
**On production site:**
1. Go to: https://campuskart-nine.vercel.app/admin
2. **Hard refresh:**
   - Mac: `Cmd + Shift + R`
   - Windows: `Ctrl + Shift + R`
3. Clear cache and reload

### Step 4: Verify Environment Variables
Go to: https://vercel.com/prahalads-projects-216e11ca/campuskart/settings/environment-variables

**Must have these 4 variables:**
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_APP_URL
ADMIN_PASS
```

**If missing any:** Add them and redeploy

### Step 5: Test Local First
To verify code works:
```bash
cd /Users/prahalad/Campus_Kart
npm run dev
```
Open: http://localhost:3000/admin

If local works but production doesn't → Deployment issue

---

## Quick Test Commands

### Check if site is up:
```bash
curl -I https://campuskart-nine.vercel.app
```

### Check Supabase connection:
```bash
curl "https://ahvxkmwridwwfwdpfgti.supabase.co/rest/v1/schools?slug=eq.dps-rohini" \
  -H "apikey: YOUR_ANON_KEY"
```

---

## Most Likely Fix

**Wait for deployment to complete!**

Check Vercel dashboard - if it says "Building", just wait 2 minutes.

Deployment complete hone ke baad sab kaam karega! 🚀

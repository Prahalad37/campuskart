# Quick Deployment Guide

## Manual Steps Needed (Browser Quota Exhausted)

Since browser automation is unavailable, please complete these quick steps:

### Step 1: Create GitHub Repo (30 seconds)
The page is already open: https://github.com/new

1. Repository name: **campuskart**
2. Public repo
3. Click "Create repository"

### Step 2: Run These Commands
```bash
cd /Users/prahalad/Campus_Kart
git remote add origin https://github.com/Prahalad37/campuskart.git
git push -u origin main
npm run build
```

### Step 3: Vercel Deployment
1. Go to https://vercel.com
2. Import GitHub repo: Prahalad37/campuskart
3. Add environment variables:
   - NEXT_PUBLIC_SUPABASE_URL = https://ahvxkmwridwwfwdpfgti.supabase.co
   - NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_stRnCH6ir9pwMJjfQ3mhYw_w8-ENgca
   - NEXT_PUBLIC_APP_URL = https://campuskart.vercel.app
   - ADMIN_PASS = 1234
4. Deploy

Total time: ~5 minutes

I'll prepare build verification in parallel.

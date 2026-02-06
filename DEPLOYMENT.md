# CampusKart - Vercel Deployment Guide

## Pre-Deployment Checklist

✅ Production build successful (`npm run build`)
✅ All validation in place
✅ Order status management working
✅ QR routes functional
✅ No demo branding visible to parents

## Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASS=your_admin_password
```

**CRITICAL**: Never commit these to Git. They are in `.env.local` (gitignored).

## Deployment Steps

### Option 1: Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow prompts:
   - Link to existing project or create new
   - Set project name: `campuskart`
   - Set framework: Next.js (auto-detected)

5. Add environment variables when prompted or in dashboard

6. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option 2: GitHub Integration

1. Push code to GitHub repository

2. Go to [vercel.com](https://vercel.com)

3. Click "New Project"

4. Import your GitHub repository

5. Configure:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

6. Add Environment Variables (same as above)

7. Click "Deploy"

## Post-Deployment Testing

Test these URLs on your deployed domain:

1. **Homepage**: `https://your-domain.vercel.app/`
   - Should load CampusKart landing

2. **Admin**: `https://your-domain.vercel.app/admin`
   - Should show password gate
   - Test with ADMIN_PASS

3. **QR Routes** (CRITICAL):
   - `https://your-domain.vercel.app/s/sunrise-babatpur`
   - `https://your-domain.vercel.app/s/green-valley-shivpur`
   - `https://your-domain.vercel.app/s/kashi-modern`
   - `https://your-domain.vercel.app/s/airport-city`
   
   Each should:
   - Display school name
   - Show 3 classes
   - Allow selection and product browsing

4. **Complete Flow**:
   - Scan QR → Select class → Browse products → Add to cart → Checkout → Success

## Domain Setup (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add custom domain: `campuskart.yourdomain.com`
3. Follow DNS configuration instructions
4. QR codes will use production URL

## Monitoring

- Check Vercel Dashboard → Functions for errors
- Monitor Supabase Dashboard → Logs for database issues
- Set up alerts for downtime

## Important Notes

- Environment variables are required for deployment to work
- Supabase URL and keys must match your production project
- ADMIN_PASS secures admin panel
- Build happens automatically on Vercel

## Production Checklist

- [ ] Code pushed to repository
- [ ] Vercel project created
- [ ] Environment variables set
- [ ] Build successful on Vercel
- [ ] All routes tested on live URL
- [ ] QR codes generated with production URLs
- [ ] Demo data inserted in Supabase

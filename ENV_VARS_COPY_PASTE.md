# 🔧 Quick Fix Guide - Add These in Vercel

## Page Already Open: Environment Variables

Copy-paste each variable exactly as shown:

---

### Variable 1
**Name:**
```
NEXT_PUBLIC_SUPABASE_URL
```
**Value:**
```
https://ahvxkmwridwwfwdpfgti.supabase.co
```

---

### Variable 2
**Name:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFodnhrbXdyaWR3d2Z3ZHBmZ3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MTM2MzQsImV4cCI6MjA1Mzk4OTYzNH0.RiYAymr5ZiGOpnS-AK_9GhVdPQFwLNu-YJG-0nJB1MI
```

---

### Variable 3
**Name:**
```
NEXT_PUBLIC_APP_URL
```
**Value:**
```
https://campuskart.vercel.app
```

---

### Variable 4
**Name:**
```
ADMIN_PASS
```
**Value:**
```
1234
```

---

## After Adding All 4

1. **Save** all variables
2. Go to **Deployments** tab
3. Click **⋯** on latest deployment
4. Click **Redeploy**
5. Wait 2-3 minutes

## Test After Redeploy

```
https://campuskart.vercel.app/s/dps-rohini
https://campuskart.vercel.app/admin
```

Both should work! ✅

# 📱 QR Code Testing Guide - Android

## ✅ QR Code Generator

I've created: **`generate-qr.html`** (already open in browser)

## 📋 Step-by-Step Testing

### Step 1: Download QR Code
1. Page already open in browser
2. Click **"Download PNG"** button
3. Save to Downloads folder

### Step 2: Display QR Code
**Option A - Print:**
- Click "Print All" button
- Print the page

**Option B - Display on PC:**
- Keep the browser tab open
- Display on your computer screen

**Option C - Transfer to Another Device:**
- AirDrop to iPad/another phone
- Display full screen

### Step 3: Open Production on Android
1. Open Chrome/browser on your Android phone
2. Go to: `https://campuskart-nine.vercel.app`
3. You should see the homepage with QR scanner

### Step 4: Scan QR Code
1. Click **"📷 Scan QR Code"** button
2. Allow camera permission if asked
3. Point camera at the QR code
4. Wait for scan...

### Step 5: Verify
**Expected Result:**
- ✅ Scanner detects QR code
- ✅ Automatically navigates to `/s/dps-rohini`
- ✅ DPS Rohini page loads
- ✅ Shows school banner, name, highlights

---

## 🔧 Troubleshooting

### Scanner Not Working?

**Check 1: Camera Permission**
- Android Settings → Apps → Chrome → Permissions
- Enable Camera permission

**Check 2: HTTPS Required**
- Camera only works on HTTPS
- ✅ Production URL is HTTPS: `campuskart-nine.vercel.app`

**Check 3: Browser Support**
- Use Chrome or Firefox on Android
- Safari might have issues

### QR Code Not Scanning?

**Solution 1: Brightness**
- Increase screen brightness if displaying on PC
- Ensure good lighting if printed

**Solution 2: Distance**
- Hold phone 6-12 inches from QR code
- Try moving closer/farther

**Solution 3: Focus**
- Tap screen to focus camera
- Keep phone steady

---

## 🎯 Alternative Testing

### Test on Localhost (Computer Webcam)
1. Go to: `http://localhost:3000`
2. Click "Scan QR Code"
3. Point webcam at QR code on phone screen

### Test Direct URL (Skip QR)
1. On Android, open: `https://campuskart-nine.vercel.app/s/dps-rohini`
2. Verify page loads correctly
3. This confirms the page works, even if scanner has issues

---

## 📦 Adding More Schools

Edit `generate-qr.html`, find the `schools` array:

```javascript
const schools = [
    {
        name: 'Delhi Public School Rohini',
        slug: 'dps-rohini',
        url: 'https://campuskart-nine.vercel.app/s/dps-rohini'
    },
    // Add new school:
    {
        name: 'St. Xavier\'s School',
        slug: 'st-xaviers',
        url: 'https://campuskart-nine.vercel.app/s/st-xaviers'
    }
];
```

Refresh page → New QR codes generated automatically!

---

## 🚀 Production URLs

**Homepage:** https://campuskart-nine.vercel.app  
**DPS Rohini:** https://campuskart-nine.vercel.app/s/dps-rohini

**QR Code Content:** Same as school URL

---

**Happy Testing! 📱✨**

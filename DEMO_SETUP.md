# Demo Data Setup Instructions

## 1. Execute SQL Script in Supabase

1. Open [Supabase](https://supabase.com)
2. Go to your CampusKart project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the contents of `demo_data.sql` and paste into the editor
6. Click **Run** to execute

## 2. SQL Script Summary

The script will insert:
- **4 Schools**:
  - Sunrise Public School Babatpur (`/s/sunrise-babatpur`)
  - Green Valley School Shivpur (`/s/green-valley-shivpur`)
  - Kashi Modern Academy (`/s/kashi-modern`)
  - Airport City School (`/s/airport-city`)

- **12 Classes** (3 per school):
  - Class 1
  - Class 5
  - Class 8

- **4 Products**:
  - Uniform Set (₹1,200)
  - Books Bundle (₹1,800)
  - Stationery Kit (₹600)
  - Shoes (₹900)

- **48 Mappings**: All products linked to all classes

## 3. Verify Data

After running the script, the verification queries at the bottom will show:
- ✅ School count: 4
- ✅ Class count: 12
- ✅ Product count: 4
- ✅ Mapping count: 48

## 4. Test QR Routes

Visit these URLs to test:
- `http://localhost:3000/s/sunrise-babatpur`
- `http://localhost:3000/s/green-valley-shivpur`
- `http://localhost:3000/s/kashi-modern`
- `http://localhost:3000/s/airport-city`

Each should:
- Display the school name
- Show 3 classes (Class 1, 5, 8)
- Each class should have 4 products when clicked

## 5. Demo Mode Badge

The header now shows a small "Demo Mode" badge (orange) to indicate this is demo/pilot data.

## Notes

- The SQL script includes optional cleanup statements (commented out)
- Uncomment the TRUNCATE statements if you want to clear existing data first
- Product images use Unsplash placeholder images

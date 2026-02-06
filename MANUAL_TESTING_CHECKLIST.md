# 🧪 Manual Testing Checklist - CampusKart Production

**Test URL:** https://campuskart-nine.vercel.app  
**Time:** ~10-15 minutes to complete all tests

Browser automation quota exhausted, so please test these manually!

---

## 1️⃣ Homepage Tests (2 min)

**URL:** https://campuskart-nine.vercel.app

### Check These:
- [ ] CampusKart logo displays
- [ ] "Start Demo Scan" button is visible
- [ ] Button has hover effect
- [ ] Trust badges show (3 indicators)
- [ ] Footer is present

### Test This:
1. Click "Start Demo Scan" button
2. Should navigate to `/s/dps-rohini`
3. Should see scanning animation first

**Expected Result:** Navigates to school page after animation ✅

---

## 2️⃣ School Page Tests (3 min)

**URL:** https://campuskart-nine.vercel.app/s/dps-rohini

### Check These:
- [ ] Page title: "Delhi Public School Rohini"
- [ ] Hero banner image loads
- [ ] School logo displays
- [ ] School slogan: "Excellence in Education Since 1999"
- [ ] Highlights section (3 cards)
- [ ] Uniform schedule widget

### Test Uniform Schedule:
- [ ] Click "Monday" tab → Shows "Regular Uniform"
- [ ] Click "Tuesday" tab → Shows "Sports Uniform"  
- [ ] Click "Wednesday" → "Regular Uniform"
- [ ] Click "Saturday" → "Activity Dress"
- [ ] Each day shows icon and description

### Test Class Selection:
- [ ] 12 classes display (Class 1 to Class 12)
- [ ] Each class is a clickable card
- [ ] Click "Class 1" → Navigate to `/class/[id]`
- [ ] Products should display on class page

**Expected Result:** All elements visible and interactive ✅

---

## 3️⃣ Class Page Tests (2 min)

**URL:** Click any class from school page

### Check These:
- [ ] Class name displays in header
- [ ] "Back to School" button works
- [ ] Product cards display
- [ ] Each product shows:
  - Image
  - Name  
  - Price
  - Category
  - "Add to Cart" button

### Test Add to Cart:
- [ ] Click "Add to Cart" on any product
- [ ] Cart icon in header updates with count
- [ ] Can add multiple products
- [ ] Counter increases with each add

**Expected Result:** Products display, add to cart works ✅

---

## 4️⃣ Cart & Checkout Tests (3 min)

### Cart:
- [ ] Click cart icon in header
- [ ] Navigate to `/checkout`
- [ ] Added products visible in list
- [ ] Quantities correct
- [ ] Total price calculated
- [ ] Can increase/decrease quantities

### Checkout Form:
- [ ] Student name field
- [ ] Parent name field
- [ ] Phone number field
- [ ] Address field
- [ ] All fields required

### Test Submission:
1. Fill all form fields with test data
2. Click "Place Order"
3. Should navigate to `/order-success`
4. Success message displays
5. Order number shown

**Expected Result:** Order placed successfully ✅

---

## 5️⃣ Admin Panel Tests (5 min)

**URL:** https://campuskart-nine.vercel.app/admin

### Login:
- [ ] Login page loads
- [ ] Password field visible
- [ ] Enter password: `1234`
- [ ] Click "Login"
- [ ] Navigate to dashboard

### Dashboard:
- [ ] 4 stat cards display:
  - Total Schools
  - Total Classes  
  - Total Products
  - Total Orders
- [ ] Numbers are correct
- [ ] Navigation menu on left

---

## 6️⃣ Admin - Schools (1 min)

**Navigate:** Click "Schools" in sidebar

### Check These:
- [ ] Schools table loads
- [ ] DPS Rohini displays
- [ ] "Add School" button visible
- [ ] Each row shows: name, slug, actions

### Test Add School:
1. Click "Add School"
2. Fill form:
   - Name: "Test School"
   - Slug: "test-school"
   - Other details
3. Click "Save"
4. New school appears in list

### Test Edit:
- [ ] Click edit icon on a school
- [ ] Form opens with existing data
- [ ] Change name
- [ ] Save
- [ ] Name updates in table

**Expected Result:** CRUD operations work ✅

---

## 7️⃣ Admin - Classes (1 min)

**Navigate:** Click "Classes" in sidebar

### Check These:
- [ ] Classes table loads
- [ ] All 12 classes for DPS Rohini display
- [ ] "Add Class" button visible

### Test Add Class:
1. Click "Add Class"
2. Select school from dropdown
3. Enter class name: "Class 13"
4. Save
5. New class appears

**Expected Result:** Can create/edit classes ✅

---

## 8️⃣ Admin - Products (1 min)

**Navigate:** Click "Products" in sidebar

### Check These:
- [ ] Products grid loads
- [ ] 10 products display
- [ ] Each shows image, name, price, category
- [ ] "Add Product" button visible

### Test Add Product:
1. Click "Add Product"
2. Fill form:
   - Name: "Test Product"
   - Price: 500
   - Category: "Uniform"
   - Image URL: (any URL)
3. Save
4. Product appears in grid

**Expected Result:** Product management works ✅

---

## 9️⃣ Admin - Mappings (1 min)

**Navigate:** Click "Mappings" in sidebar

### Check These:
- [ ] Page loads
- [ ] School dropdown
- [ ] Class dropdown (filters by school)
- [ ] Product checkboxes

### Test Mapping:
1. Select "DPS Rohini" from school dropdown
2. Select "Class 1" from class dropdown
3. Check/uncheck products
4. Click "Save Mappings"
5. Success message appears

**Expected Result:** Can map products to classes ✅

---

## 🔟 Admin - Orders (1 min)

**Navigate:** Click "Orders" in sidebar

### Check if order exists:
- [ ] Orders table loads
- [ ] If you placed an order earlier, it shows here
- [ ] Columns: Date, Customer, Phone, Total, Status
- [ ] Status pill (color-coded)

### Test Order Details:
- [ ] Click on an order row
- [ ] Modal opens
- [ ] Shows customer info
- [ ] Shows ordered items
- [ ] Shows prices and totals
- [ ] Can close modal

**Expected Result:** Orders display correctly ✅

---

## 🎯 Summary Checklist

Mark these off as you test:

### Public Pages
- [ ] Homepage loads and demo scan works
- [ ] School page displays all info
- [ ] Class page shows products
- [ ] Cart and checkout work
- [ ] Order success page displays

### Admin Panel
- [ ] Login works with password `1234`
- [ ] Dashboard shows stats
- [ ] Schools management (CRUD)
- [ ] Classes management (CRUD)
- [ ] Products management (CRUD)
- [ ] Class-product mappings work
- [ ] Orders display correctly

---

## 🐛 Report Issues

If you find any issues, note:
1. **Page:** Which page/feature
2. **Action:** What you did
3. **Expected:** What should happen
4. **Actual:** What actually happened
5. **Console Errors:** Check browser console (F12)

---

## ✅ Success Criteria

All checkboxes should be ✅

If any fail, let me know and I'll fix immediately!

**Ready to test? Start from #1 and work through all sections!** 🚀

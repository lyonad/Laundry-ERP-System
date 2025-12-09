# 🔍 VERIFICATION CHECKLIST - Customer Data Connection

## ✅ Backend Setup

### 1. Database Orders for Customer
```bash
cd backend
node -e "import('./database.js').then(m => { const db = m.default; console.log(db.prepare('SELECT id, createdBy, status FROM orders WHERE createdBy = ?').all('U-PELANGGAN-001')); });"
```

**Expected**: Harus ada 3 orders dengan `createdBy: 'U-PELANGGAN-001'`

### 2. API Filter Test
```bash
# Login as customer first, get the token from browser
# Then check if API returns correct data
```

**Expected**: `/api/orders` dengan auth pelanggan hanya return orders dimana `createdBy = U-PELANGGAN-001`

---

## ✅ Frontend Testing

### Test 1: Customer Login
1. Buka http://localhost:3000/login
2. Login dengan:
   - Username: `testing`
   - Password: `pelanggan123`
3. **Verify**: Redirect ke dashboard

### Test 2: Customer Dashboard
1. Setelah login, cek dashboard pelanggan
2. **Expected**:
   - ✅ Total Belanja: Rp 113,000
   - ✅ Order Aktif: 1 (washing)
   - ✅ Siap Diambil: 1 (ready)
   - ✅ Pesanan Selesai: 0
   - ✅ Tabel "Pesanan Terbaru" menampilkan 3 orders

### Test 3: Customer Orders View
1. Klik "Pesanan Saya" di sidebar
2. **Expected**:
   - ✅ Tabel menampilkan 3 orders
   - ✅ Service names muncul di kolom "Layanan"
   - ✅ Badge status dengan warna berbeda

### Test 4: Admin Can See All Orders
1. Logout dari customer
2. Login sebagai admin (`admin` / `admin123`)
3. Klik "Pesanan"
4. **Expected**:
   - ✅ Kanban board menampilkan SEMUA orders (admin + customer)
   - ✅ Minimal 8 orders (5 dari admin, 3 dari customer)

### Test 5: Real-Time Sync
1. Buka 2 browser/tab
2. Tab 1: Login sebagai admin
3. Tab 2: Login sebagai testing (customer)
4. Tab 1: Update salah satu order customer (pending → washing)
5. Tab 2: **Wait 5 seconds** → status harus update otomatis

---

## 🐛 Common Issues & Solutions

### Issue 1: Customer Dashboard Kosong
**Symptom**: Stat cards semua 0, tabel kosong
**Cause**: Orders tidak punya `createdBy = U-PELANGGAN-001`
**Fix**: Run `node create-customer-orders.js` di backend

### Issue 2: API 401 Unauthorized
**Symptom**: Redirect ke login terus-menerus
**Cause**: Cookie tidak tersimpan atau expired
**Fix**: 
- Clear browser cookies
- Restart backend server
- Login ulang

### Issue 3: Data Tidak Update Real-Time
**Symptom**: Perubahan tidak muncul setelah 5 detik
**Cause**: Auto-refresh tidak jalan atau API error
**Fix**:
- Check browser console untuk errors
- Verify backend running di port 3002
- Check network tab untuk failed requests

### Issue 4: Service Names Tidak Muncul
**Symptom**: Kolom layanan kosong di tabel
**Cause**: Data transformation `items → serviceItems` tidak jalan
**Fix**: Already fixed in CustomerDashboard.tsx, OrdersView.tsx

---

## 🎯 Final Verification

### Customer Account (testing)
Run this query to verify customer has orders:
```javascript
// In browser console after login as customer
fetch('http://localhost:3002/api/orders', { 
  credentials: 'include' 
})
.then(r => r.json())
.then(data => {
  console.log('Customer Orders:', data);
  console.log('Count:', data.length);
  console.log('Should be 3');
});
```

### Check localStorage
```javascript
// In browser console
const user = JSON.parse(localStorage.getItem('user'));
console.log('Current User:', user);
console.log('Role:', user.role);
console.log('ID:', user.id);
// Should show: role: 'pelanggan', id: 'U-PELANGGAN-001'
```

---

## ✅ Success Criteria

- [x] Customer has 3 orders in database
- [x] Backend filter by createdBy works
- [x] Frontend transforms items → serviceItems
- [x] Customer dashboard shows correct stats
- [x] Customer table shows correct orders
- [x] Admin can see all orders
- [x] Real-time updates work
- [x] Role separation enforced

**All checks passed = Data is CONNECTED! ✅**

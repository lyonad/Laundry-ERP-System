# 🎯 QUICK TEST REFERENCE

## Test Accounts
| Role | Username | Password | ID |
|------|----------|----------|-----|
| Admin | `admin` | `admin123` | U-ADMIN-001 |
| Customer | `testing` | `pelanggan123` | U-PELANGGAN-001 |

## Expected Customer Dashboard
```
╔════════════════════════════════════════════════════════════════╗
║                    DASHBOARD PELANGGAN                         ║
╠═══════════════╦═══════════════╦═══════════════╦═══════════════╣
║ Total Belanja ║ Order Aktif   ║ Siap Diambil  ║ Pesanan Selesai║
║ Rp 0 (awal)  ║ 0 (awal)     ║ 0 (awal)     ║ 0 (awal)      ║
╚═══════════════╩═══════════════╩═══════════════╩═══════════════╝

PESANAN TERBARU
┌──────────────────────────────────────────────────────────────────┐
│  Belum ada pesanan (jika belum ada order dari POS)              │
│                                                                  │
│  ATAU (setelah admin buat order via POS):                       │
│  5 orders terbaru dengan service names dan status badges        │
└──────────────────────────────────────────────────────────────────┘

⚠️ PENTING: Dashboard menampilkan data REAL-TIME dari POS
           Tidak ada data bawaan/dummy
```

## Quick Test Commands

### Start System
```powershell
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

### Database Test
```powershell
cd backend
node test-customer-data-flow.cjs
```

**Expected:** Show database structure and order count (bisa 0 jika belum ada order)

### Browser Console Debug
```javascript
// Check user
JSON.parse(localStorage.getItem('user'))

// Test API
fetch('http://localhost:3002/api/orders', {credentials:'include'})
  .then(r => r.json())
  .then(d => console.log('Orders:', d.length, d))
```

## Checklist
- [ ] Backend running on port 3002
- [ ] Frontend running on port 3000
- [ ] Login as `testing` / `pelanggan123`
- [ ] See 4 stat cards (awalnya semua 0 - ini NORMAL)
- [ ] Dashboard kosong jika belum ada order - ini NORMAL
- [ ] Buat order via POS sebagai admin untuk test
- [ ] Login lagi sebagai customer - order sekarang muncul
- [ ] Each order shows service names
- [ ] Status badges are colored correctly
- [ ] No errors in console
- [ ] Auto-refresh works (check console logs every 5s)

## Status Badge Colors
- 🟠 **Menunggu** (pending) - Orange
- 🔵 **Dicuci** (washing) - Blue  
- 🟢 **Siap Diambil** (ready) - Green
- ⚫ **Selesai** (picked_up) - Gray

## If Data Still Empty
1. **NORMAL jika belum ada order!** Dashboard kosong di awal adalah expected behavior
2. **Test dengan buat order:**
   - Login sebagai admin (admin/admin123)
   - Buka Kasir (POS)
   - Pilih customer "Software Testing"
   - Tambah layanan, checkout
   - Logout, login sebagai customer
   - Order sekarang muncul di dashboard
3. Check browser console (F12)
4. Check Network tab → /api/orders (array kosong = belum ada order)
5. Run: `node test-customer-data-flow.cjs` in backend folder
6. Paste contents of `debug-customer-data.js` in browser console

## Success = All Green ✅
```
✅ Login successful
✅ Dashboard shows 4 stat cards (semua 0 jika belum ada order - NORMAL)
✅ Setelah buat order via POS, stats update otomatis
✅ "Pesanan Terbaru" shows orders dengan service names
✅ "Pesanan Saya" shows all customer orders
✅ Status badges colored correctly
✅ No console errors
✅ Auto-refresh working
✅ Data real-time dari database (TIDAK ADA dummy data)
```

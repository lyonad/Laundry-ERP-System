# 🧪 Panduan Testing - Sistem ERP Laundry

## 📋 Prerequisites

### Server Status
1. **Backend**: http://localhost:3002
   ```bash
   cd backend
   npm start
   ```

2. **Frontend**: http://localhost:3000
   ```bash
   npm run dev
   ```

### Akun Test
| Role | Username | Password | User ID |
|------|----------|----------|---------|
| Admin | admin | admin123 | U-ADMIN-001 |
| Pelanggan | testing | pelanggan123 | U-PELANGGAN-001 |

---

## ✅ Test Suite

### Test 1: Customer Login & Dashboard Access
**Tujuan**: Memverifikasi pelanggan hanya bisa akses fitur yang diizinkan

#### Steps:
1. Buka http://localhost:3000
2. Login dengan:
   - Username: `testing`
   - Password: `pelanggan123`
3. **Verify**: Redirect ke dashboard pelanggan

#### Expected Results:
- ✅ Melihat "Selamat Datang, Software Testing! 👋"
- ✅ Melihat 3 stat cards:
  - Total Belanja: Rp 113,000 (50k + 35k + 28k)
  - Order Aktif: 2 (pending + washing)
  - Pesanan Selesai: 1 (picked_up)
- ✅ Melihat tabel "Pesanan Terbaru Anda" dengan 3 order
- ✅ Sidebar hanya menampilkan 2 menu:
  - Dashboard
  - Pesanan Saya
- ✅ **TIDAK** ada menu: Kasir, Inventory, Pelanggan

---

### Test 2: Customer Orders View
**Tujuan**: Memverifikasi pelanggan bisa melihat order mereka dalam format table

#### Steps:
1. Dari dashboard pelanggan, klik "Pesanan Saya" di sidebar
2. **Verify**: Melihat tabel order (bukan Kanban)

#### Expected Results:
- ✅ Header: "Pesanan Saya"
- ✅ Tabel dengan kolom: ID Order, Tanggal, Layanan, Status, Total
- ✅ Melihat 3 test order
- ✅ **TIDAK** ada tombol update status
- ✅ **TIDAK** ada Kanban board

---

### Test 3: Admin Login & Full Access
**Tujuan**: Memverifikasi admin punya akses ke semua fitur

#### Steps:
1. Logout dari akun pelanggan
2. Login dengan:
   - Username: `admin`
   - Password: `admin123`
3. **Verify**: Redirect ke admin dashboard

#### Expected Results:
- ✅ Melihat dashboard analytics penuh (bukan customer dashboard)
- ✅ Melihat chart pendapatan mingguan
- ✅ Sidebar menampilkan 5 menu:
  - Dashboard
  - Kasir
  - Pesanan
  - Pelanggan
  - Inventory

---

### Test 4: Admin Orders Management (Kanban)
**Tujuan**: Memverifikasi admin bisa update status order via Kanban

#### Steps:
1. Tetap login sebagai admin
2. Klik "Pesanan" di sidebar
3. **Verify**: Melihat Kanban board dengan 4 kolom
4. Klik tombol "Mulai Cuci" pada order pending
5. **Verify**: Order pindah ke kolom "Dalam Proses"

#### Expected Results:
- ✅ Muncul toast "Status order berhasil diupdate!"
- ✅ Order pindah kolom dalam max 5 detik (auto-refresh)

---

### Test 5: Real-Time Updates (2 Browser Tabs)
**Tujuan**: Memverifikasi auto-refresh bekerja untuk real-time sync

#### Setup:
1. Buka **2 tab browser** (atau 2 browser berbeda)
2. **Tab 1**: Login sebagai `admin`
3. **Tab 2**: Login sebagai `testing` (pelanggan)

#### Steps:
1. **Tab 2** (Pelanggan): Buka "Pesanan Saya", catat status order
2. **Tab 1** (Admin): Buka "Pesanan", update status salah satu order
3. **Tab 2** (Pelanggan): **TUNGGU MAX 5 DETIK**, jangan refresh manual
4. **Verify**: Status order otomatis berubah di Tab 2

#### Expected Results:
- ✅ Perubahan status terlihat di Tab 2 dalam 5 detik
- ✅ Badge status berubah warna
- ✅ Tidak perlu refresh manual (F5)

---

## ✨ Success Criteria

Semua test suite **PASS** dengan hasil:
- ✅ Admin bisa akses semua fitur
- ✅ Pelanggan hanya bisa akses Dashboard, Pesanan Saya, Notifikasi, Pengaturan
- ✅ Order updates real-time sync antara admin dan pelanggan
- ✅ Data konsisten dan akurat

**SELAMAT TESTING! 🚀**

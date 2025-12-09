# 🎬 Demo Guide - Sistem ERP Laundry

## 📸 Screenshot & Walkthrough Guide

Panduan lengkap cara menggunakan setiap fitur dengan step-by-step instructions.

---

## 🏠 Dashboard

**URL**: http://localhost:3001

### Fitur yang Terlihat:
1. **4 Cards Statistik**:
   - Total Pendapatan (Bulan ini)
   - Pelanggan Baru
   - Order Aktif
   - Stok Kritis

2. **Grafik Pendapatan Mingguan**:
   - Bar chart 7 hari terakhir
   - Hover untuk detail per hari
   - Highlight hari tertinggi (orange)

3. **Tabel Order Terkini**:
   - 5 order terakhir
   - Status dengan badge berwarna
   - Nama customer & total

### Yang Bisa Dilakukan:
- ✅ Monitor pendapatan real-time
- ✅ Cek order yang butuh attention
- ✅ Alert inventory low stock
- ✅ Analisa trend penjualan

---

## 💰 Kasir & Transaksi (POS)

**Menu**: Klik "Kasir & Transaksi" di sidebar

### Step-by-Step Checkout:

#### 1. Pilih Layanan
- Scroll katalog layanan
- Filter berdasarkan kategori (Semua/Kiloan/Satuan/Express)
- Search layanan dengan search bar
- Klik card untuk add to cart

#### 2. Keranjang Belanja
Di sidebar kanan:
- Lihat items yang dipilih
- Adjust quantity dengan +/- button
- Lihat subtotal per item
- Total otomatis calculate

#### 3. Pilih Customer
- Dropdown "Pelanggan"
- Pilih member existing ATAU
- Pilih "Tamu (Guest)"
- Member otomatis dapat poin!

#### 4. Pilih Pembayaran
- Tunai (Cash)
- QRIS Scan
- Kartu Debit/Kredit

#### 5. Checkout
- Klik "Bayar Sekarang"
- Alert sukses muncul
- Cart otomatis reset
- Order masuk ke sistem!

### Tips:
💡 Member dapat 1 poin per Rp 10,000  
💡 Badge "Express" & "Satuan" di card layanan  
💡 Real-time total calculation  

---

## 📦 Inventory & Stok

**Menu**: Klik "Inventory & Stok"

### Yang Terlihat:
1. **3 Stats Cards**:
   - Total Item (jumlah jenis barang)
   - Perlu Restock (low stock alert)
   - Supplier Aktif (jumlah supplier)

2. **Tabel Inventory**:
   - Kode barang
   - Nama & harga
   - Stock bar (visual)
   - Status badge (Aman/Menipis)
   - Info supplier

### Aksi yang Bisa Dilakukan:

#### Restock Barang:
1. Klik tombol "Restock" di item
2. Dialog muncul
3. Input jumlah restock
4. Klik "Restock"
5. Stock otomatis update!

#### Hubungi Supplier:
1. Klik tombol "Supplier"
2. Dialog menampilkan:
   - Nama supplier
   - Nomor kontak
   - Barang yang akan direstock
3. Klik "Chat WhatsApp" (akan redirect ke WA)

### Alert System:
⚠️ Badge merah "Menipis" jika stock < minStock  
✅ Badge hijau "Aman" jika stock adequate  
📊 Progress bar visual untuk quick check  

---

## 📋 Manajemen Pesanan

**Menu**: Klik "Manajemen Pesanan"

### Kanban Board (4 Kolom):

#### 1. Antrian / Pending (Orange)
- Order baru masuk
- Belum diproses
- Icon: ⏰ Clock

#### 2. Sedang Dicuci (Blue)
- Order dalam proses
- Sedang dikerjakan
- Icon: 🔄 Loading spinner

#### 3. Siap Diambil (Green)
- Order selesai
- Menunggu pickup
- Icon: ✅ Check circle

#### 4. Selesai (Gray)
- Customer sudah ambil
- Transaksi complete
- Icon: 🛍️ Shopping bag

### Info di Card Order:
- Order ID (badge)
- Nama customer
- List items
- Payment method
- Total harga
- Tanggal order

### Workflow:
Order baru → Pending → Washing → Ready → Picked Up ✅

---

## 👥 Data Pelanggan

**Menu**: Klik "Data Pelanggan"

### Yang Terlihat:
- Search bar (cari nama/nomor HP)
- Button "Member Baru"
- Tabel member dengan:
  - ID member
  - Avatar & info
  - Total transaksi
  - Poin reward
  - Masa berlaku
  - Action delete

### Tambah Member Baru:
1. Klik "Member Baru"
2. Dialog form muncul
3. Isi:
   - Nama lengkap
   - Nomor HP
4. Klik "Simpan"
5. Member added!

### Member Benefits:
- ⭐ Dapat poin per transaksi
- 💰 Track total spending
- 📅 Masa berlaku membership
- 🎁 Reward system ready

### Hapus Member:
1. Klik icon trash 🗑️
2. Konfirmasi delete
3. Member removed from database

---

## 🎯 Use Cases & Scenarios

### Scenario 1: Transaksi Customer Baru
```
1. Customer datang dengan cucian 3kg
2. Kasir buka POS
3. Pilih "Cuci Komplit" (3x qty)
4. Pilih "Tamu (Guest)"
5. Pilih "Tunai"
6. Bayar → Transaksi sukses!
7. Order masuk ke "Pending"
```

### Scenario 2: Restock Inventory
```
1. Dashboard alert "2 Stok Kritis"
2. Buka Inventory
3. Lihat "Parfum Sakura" low stock
4. Klik "Restock"
5. Input: 10 liter
6. Confirm → Stock updated!
7. Alert hilang dari dashboard
```

### Scenario 3: Track Order
```
1. Order TRX-681 masuk
2. Lihat di board "Pending"
3. Mulai cuci → move to "Washing"
4. Selesai cuci → move to "Ready"
5. Customer pickup → move to "Picked Up"
6. Done! ✅
```

### Scenario 4: Tambah Member
```
1. Customer jadi member
2. Buka "Data Pelanggan"
3. Klik "Member Baru"
4. Isi nama & HP
5. Save → Member active!
6. Next order dapat poin otomatis
```

---

## 🎨 UI Elements Guide

### Badge Colors:
- 🟠 **Orange**: Pending status
- 🔵 **Blue**: Processing/Washing
- 🟢 **Green**: Ready/Success
- ⚪ **Gray**: Completed/Inactive
- 🔴 **Red**: Alert/Low stock

### Icons Meaning:
- 🏠 Dashboard
- 💰 POS/Kasir
- 📦 Inventory
- 📋 Orders
- 👥 Customers
- ⏰ Pending
- 🔄 Processing
- ✅ Complete
- 🗑️ Delete
- ⚙️ Settings

### Button Types:
- **Primary** (Orange): Main actions
- **Secondary** (Gray): Cancel/Back
- **Ghost**: Subtle actions
- **Icon**: Quick actions

---

## 📱 Mobile Experience

### Responsive Breakpoints:
- 📱 **Mobile** (<768px): Single column, hamburger menu
- 💻 **Tablet** (768-1024px): 2 columns, sidebar visible
- 🖥️ **Desktop** (>1024px): Full layout, sidebar permanent

### Mobile Features:
- ✅ Swipe navigation
- ✅ Touch-friendly buttons
- ✅ Optimized forms
- ✅ Responsive tables
- ✅ Mobile menu

---

## 🔍 Search & Filter

### Dashboard:
- No search (stats only)

### POS:
- ✅ Search layanan by name
- ✅ Filter by category (Kiloan/Satuan/Express)

### Inventory:
- No search (scroll table)

### Orders:
- ✅ Filter by status (via Kanban columns)

### Customers:
- ✅ Search by nama
- ✅ Search by nomor HP

---

## ⚡ Keyboard Shortcuts (Future)

Coming in v1.1:
- `Ctrl + K` - Quick search
- `Ctrl + N` - New order
- `Ctrl + I` - Go to Inventory
- `Esc` - Close dialog
- `Tab` - Navigate forms

---

## 🎓 Training Tips

### For Kasir (POS Staff):
1. Hafal layanan & harga
2. Confirm customer detail
3. Check payment method
4. Print/note transaction ID
5. Inform ready time

### For Inventory Manager:
1. Daily stock check
2. Alert monitoring
3. Restock sebelum habis
4. Supplier relationship
5. Track usage patterns

### For Admin/Owner:
1. Monitor dashboard daily
2. Review order flow
3. Check revenue trends
4. Member growth tracking
5. Inventory optimization

---

## 🎬 Demo Data

### Test dengan Data Ini:

**New Order Test**:
- Customer: "John Doe"
- Service: Cuci Komplit (2kg)
- Payment: QRIS
- Expected: Order TRX-xxx di Pending

**Restock Test**:
- Item: Parfum Sakura
- Quantity: +5 liter
- Expected: Stock 3→8, alert hilang

**New Member Test**:
- Name: "Jane Smith"
- Phone: "0812345678"
- Expected: New member di list

---

## 📞 Support & Help

Jika ada yang tidak jelas:
1. Check README.md
2. Check QUICKSTART.md
3. Check API_TESTING.http
4. Open browser console (F12)
5. Check backend logs

---

**Happy Using Sistem ERP Laundry! 🧺✨**

**Tips**: Bookmark halaman ini untuk reference cepat!

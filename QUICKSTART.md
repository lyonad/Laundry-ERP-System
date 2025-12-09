# 🎯 Quick Start Guide - Sistem ERP Laundry

## ⚡ Cara Cepat Memulai (5 Menit)

### 1️⃣ Install Dependencies (2 menit)

```powershell
# Di folder root project
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2️⃣ Jalankan Aplikasi (1 menit)

**Opsi A: Manual (2 Terminal)**

Terminal 1 - Backend:
```powershell
cd backend
npm start
```

Terminal 2 - Frontend:
```powershell
npm run dev
```

**Opsi B: Otomatis (1 Terminal)**

```powershell
.\start.ps1
```

### 3️⃣ Akses Aplikasi

- 🎨 **Frontend**: http://localhost:3001
- 🔌 **Backend API**: http://localhost:3002
- 📊 **Health Check**: http://localhost:3002/api/health

---

## 🎮 Fitur yang Bisa Langsung Dicoba

### Dashboard
✅ Lihat statistik pendapatan bulan ini  
✅ Monitor order aktif  
✅ Cek inventory yang kritis  
✅ Grafik pendapatan mingguan

### Point of Sale (Kasir)
1. Pilih layanan laundry dari katalog
2. Tambah ke keranjang
3. Pilih customer (atau Guest)
4. Pilih metode pembayaran
5. Klik "Bayar Sekarang"
6. ✅ Transaksi berhasil!

### Inventory Management
✅ Lihat semua stok barang  
✅ Alert untuk barang yang low stock  
✅ Restock barang dengan klik tombol  
✅ Hubungi supplier langsung

### Manajemen Pesanan
✅ Lihat order dalam bentuk Kanban board  
✅ 4 Status: Pending → Washing → Ready → Picked Up  
✅ Drag & drop untuk update status (coming soon)

### Data Pelanggan
✅ Tambah member baru  
✅ Lihat history transaksi  
✅ Sistem poin otomatis  
✅ Delete member

---

## 📱 Fitur Mobile Responsive

Aplikasi full responsive! Coba buka di:
- 📱 Smartphone (Chrome/Safari)
- 💻 Tablet (iPad/Android)
- 🖥️ Desktop (Semua browser modern)

---

## 🔥 Demo Data

Aplikasi sudah include data demo:

### Services (Layanan)
- Cuci Komplit (Rp 7,000/kg)
- Setrika Saja (Rp 4,000/kg)
- Bed Cover S & L
- Jas/Blazer
- Express 3 Jam
- Dan lainnya...

### Members
- Budi Santoso (150 poin)
- Siti Aminah (20 poin)
- Rudi Hermawan (540 poin)
- Dewi Lestari (80 poin)

### Inventory
- Deterjen Liquid Premium
- Parfum Laundry Sakura (⚠️ Low Stock!)
- Plastik Packing
- Hanger Kawat
- Label Tag Anti Air

### Orders
Sample orders dengan berbagai status

---

## 🛠️ Troubleshooting Cepat

### ❌ Port 3001/3002 sudah dipakai?
```powershell
# Cari proses yang pakai port
netstat -ano | findstr :3001
netstat -ano | findstr :3002

# Kill process
taskkill /PID <ProcessID> /F
```

### ❌ npm install error?
```powershell
# Clear cache dan retry
npm cache clean --force
npm install
```

### ❌ Frontend tidak connect ke backend?
- Pastikan backend running di http://localhost:3002
- Check file `src/api/api.ts` → API_BASE_URL
- Cek browser console untuk error

### ❌ Database error?
```powershell
# Delete database dan restart
cd backend
del laundry.db
npm start
```

---

## 🎯 Testing Checklist

Coba fitur ini untuk test lengkap:

- [ ] Dashboard load dengan data
- [ ] Buat order baru di POS
- [ ] Check order muncul di Orders view
- [ ] Update status order
- [ ] Tambah member baru
- [ ] Restock inventory item
- [ ] Lihat stats dashboard update

---

## 📚 Dokumentasi Lengkap

- **README.md** - Overview & instalasi
- **API_TESTING.http** - Test API endpoints
- **DEPLOYMENT.md** - Deploy ke production
- **CONTRIBUTING.md** - Panduan kontribusi
- **CHANGELOG.md** - Version history

---

## 💡 Tips & Tricks

### Keyboard Shortcuts (Coming Soon)
- `Ctrl + K` - Search
- `Ctrl + N` - New order
- `Ctrl + I` - Inventory
- `Esc` - Close dialog

### Best Practices
1. Selalu backup database sebelum update
2. Test di development sebelum production
3. Monitor low stock inventory
4. Review pending orders regularly
5. Update member points after transactions

---

## 🆘 Butuh Bantuan?

1. **Check Documentation** - README.md & docs lainnya
2. **API Documentation** - API_TESTING.http
3. **Backend Logs** - Check terminal backend
4. **Browser Console** - F12 untuk debug frontend
5. **Open Issue** - Report bugs di GitHub

---

## 🎉 Selamat Mencoba!

Website ERP Laundry Anda siap digunakan!

**Happy Laundering! 🧺✨**

---

## 📞 Quick Links

- Frontend: http://localhost:3001
- Backend: http://localhost:3002
- Health: http://localhost:3002/api/health

**Version**: 1.0.0  
**Status**: ✅ Production Ready

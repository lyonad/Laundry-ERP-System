# Changelog - Role-Based Access & Real-Time Updates

## 🎯 Tujuan Utama
Memisahkan pengalaman admin dan pelanggan secara lengkap, dengan sinkronisasi data real-time.

## ✅ Perubahan yang Dilakukan

### 1. **Backend - Order Filtering & Notifications (server.js)**

#### Fix Order Filtering untuk Pelanggan
- **Masalah**: Pelanggan tidak bisa melihat order mereka karena filter menggunakan `customerId` (member ID)
- **Solusi**: Update filter untuk mengecek `createdBy` atau `customerId`
```javascript
// Line 488 - GET /api/orders
if (req.user.role === 'pelanggan') {
  query += ' WHERE (createdBy = ? OR customerId = ?)';
  params.push(req.user.id);
  params.push(req.user.id);
}
```

#### Fix Order Creation Tracking
- **Masalah**: Order tidak melacak siapa yang membuat (createdBy)
- **Solusi**: Tambahkan `createdBy` saat membuat order
```javascript
// Line 542 - POST /api/orders
INSERT INTO orders (..., createdBy) VALUES (..., req.user.id)
```

#### Fix Customer Notifications
- **Masalah**: Notifikasi tidak sampai ke pelanggan karena mencari user berdasarkan `customerId` (member ID)
- **Solusi**: Gunakan `createdBy` untuk menemukan user yang tepat
```javascript
// Line 615 - PATCH /api/orders/:id/status
if (order.createdBy) {
  const customer = db.prepare('SELECT id FROM users WHERE id = ?').get(order.createdBy);
  // Send notification to customer
}
```

### 2. **Frontend - Role-Based Routing (App.tsx)**

#### Implementasi Role-Based Component Rendering
- **Admin**: Melihat `DashboardView` (analytics penuh)
- **Pelanggan**: Melihat `CustomerDashboard` (order history)

```typescript
const isAdmin = user?.role === 'admin';

const renderContent = () => {
  // Block customer from admin-only features
  if (!isAdmin && (activeTab === 'pos' || activeTab === 'inventory' || activeTab === 'customers')) {
    setActiveTab('dashboard');
    return null;
  }

  switch (activeTab) {
    case 'dashboard':
      return isAdmin 
        ? <DashboardView setActiveTab={setActiveTab} /> 
        : <CustomerDashboard setActiveTab={setActiveTab} />;
    case 'pos':
      return isAdmin ? <PointOfSale /> : null;
    // ... dst
  }
};
```

#### Header Titles Berbeda per Role
```typescript
if (!isAdmin) {
  switch(activeTab) {
    case 'orders': return 'Pesanan Saya';
    case 'notifications': return 'Notifikasi';
    case 'settings': return 'Pengaturan';
    default: return 'Dashboard Pelanggan';
  }
}
```

### 3. **Frontend - Auto-Refresh untuk Real-Time Updates**

#### CustomerDashboard.tsx
- **Auto-refresh setiap 5 detik** untuk melihat update status order
```typescript
useEffect(() => {
  loadCustomerData();
  const interval = setInterval(() => {
    loadCustomerData();
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

#### OrdersView.tsx
- **Auto-refresh setiap 5 detik** untuk admin dan pelanggan
```typescript
useEffect(() => {
  loadOrders();
  const interval = setInterval(() => {
    loadOrders();
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

#### DashboardView.tsx
- **Auto-refresh setiap 10 detik** untuk admin dashboard
```typescript
useEffect(() => {
  loadDashboardData();
  const interval = setInterval(() => {
    loadDashboardData();
  }, 10000);
  return () => clearInterval(interval);
}, []);
```

### 4. **Sidebar - Role-Based Menu (Sidebar.tsx)**

#### Menu untuk Admin
- Dashboard
- Kasir (POS)
- Pesanan
- Pelanggan
- Inventory

#### Menu untuk Pelanggan
- Dashboard
- Pesanan Saya

```typescript
const adminMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'pos', label: 'Kasir', icon: ShoppingBag },
  { id: 'orders', label: 'Pesanan', icon: Package },
  { id: 'customers', label: 'Pelanggan', icon: Users },
  { id: 'inventory', label: 'Inventory', icon: Box },
];

const customerMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'orders', label: 'Pesanan Saya', icon: Package },
];

const menuItems = isAdmin ? adminMenuItems : customerMenuItems;
```

### 5. **OrdersView - Split Admin/Customer Views**

#### Admin View
- **Kanban Board** dengan drag-drop
- Update status dengan tombol
- Melihat semua order dari semua customer

#### Customer View
- **Simple Table** dengan order history
- Read-only (tidak bisa edit)
- Hanya melihat order sendiri

```typescript
const isAdmin = user?.role === 'admin';

if (!isAdmin) {
  // Render simple table for customers
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID Order</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead>Layanan</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      {/* ... */}
    </Table>
  );
}

// Admin sees Kanban board
return <KanbanBoard />;
```

### 6. **CustomerDashboard - Dashboard Khusus Pelanggan**

Fitur:
- **Welcome Banner** dengan nama pelanggan
- **3 Stat Cards**:
  - Total Belanja (total semua order)
  - Order Aktif (pending + washing)
  - Pesanan Selesai (picked_up)
- **Recent Orders Table** (5 terbaru)
- **Info Cards**:
  - Jam Operasional
  - Program Loyalitas

### 7. **Test Data Creation**

File: `backend/create-test-order.js`
- Membuat 3 test order untuk akun pelanggan
- Status: pending, washing, picked_up
- Terkoneksi dengan user `U-PELANGGAN-001`

## 🧪 Testing

### Akun Test
1. **Admin**
   - Username: `admin`
   - Password: `admin123`
   - Akses: Semua fitur

2. **Pelanggan**
   - Username: `testing`
   - Password: `pelanggan123`
   - Akses: Dashboard, Pesanan Saya, Notifikasi, Pengaturan

### Skenario Test

#### ✅ Test 1: Customer Login & View Orders
1. Login sebagai `testing` / `pelanggan123`
2. Verify hanya 2 menu item (Dashboard, Pesanan Saya)
3. Verify bisa melihat 3 test order di dashboard
4. Klik "Pesanan Saya" → verify melihat tabel order

#### ✅ Test 2: Admin Updates Order Status
1. Login sebagai `admin` / `admin123`
2. Buka "Pesanan" → Kanban board
3. Update status order (e.g., pending → washing)
4. Verify notifikasi dikirim ke pelanggan

#### ✅ Test 3: Real-Time Sync
1. Buka 2 tab browser
2. Tab 1: Login sebagai admin
3. Tab 2: Login sebagai pelanggan
4. Admin update status order
5. **Tunggu max 5 detik** → pelanggan otomatis melihat update

#### ✅ Test 4: Access Control
1. Login sebagai pelanggan
2. Coba akses POS melalui URL direct → blocked
3. Verify tidak ada menu Kasir, Inventory, Pelanggan

## 📊 Database Schema Updates

### orders table
- Added proper use of `createdBy` field (sudah ada di schema)
- Links order to user account (bukan member)

### Flow Explanation
```
User Login (role: pelanggan)
  ↓
User ID: U-PELANGGAN-001
  ↓
Create Order (di backend)
  ↓
orders.createdBy = U-PELANGGAN-001
orders.customerId = M-TEST-001 (optional, jika member)
  ↓
GET /api/orders filter:
  WHERE (createdBy = 'U-PELANGGAN-001' OR customerId = 'U-PELANGGAN-001')
  ↓
Customer melihat order mereka
```

## 🔧 Server Status

### Backend (Port 3002)
```
✅ Database ready for production use
🚀 Server running on http://localhost:3002
```

### Frontend (Port 3000)
```
✅ VITE v6.3.5 ready
➜ Local: http://localhost:3000/
```

## 📝 Notes

1. **TypeScript Warnings**: Ada cosmetic JSX.IntrinsicElements warnings yang tidak mempengaruhi functionality
2. **Auto-Refresh**: Semua komponen utama sekarang auto-refresh untuk real-time updates
3. **Role Separation**: Admin dan pelanggan benar-benar terpisah
4. **Notification System**: Pelanggan sekarang menerima notifikasi real-time tentang status order

## 🚀 Next Steps (Opsional)

1. Tambahkan WebSocket untuk real-time updates tanpa polling
2. Implementasi push notifications
3. Customer dapat buat order sendiri (bukan hanya via admin POS)
4. History transaksi dengan filter tanggal
5. Export laporan PDF

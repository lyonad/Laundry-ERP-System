# 🧺 Sistem ERP Laundry - Production Ready

Sistem manajemen laundry enterprise-grade dengan authentication, role-based access control, dan REST API lengkap. Built with React + TypeScript (frontend) dan Node.js + Express + SQLite (backend).

![Dashboard](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Node](https://img.shields.io/badge/Node.js-Backend-green)
![SQLite](https://img.shields.io/badge/Database-SQLite-orange)
![Auth](https://img.shields.io/badge/Auth-JWT%20%2B%20bcrypt-red)

## 🔐 Quick Start

### Default Login Credentials

**Admin (Pemilik Toko):**
```
Username: admin
Password: admin123
```

**Pelanggan (Test Customer):**
```
Username: testing
Password: pelanggan123
```

⚠️ **Change immediately after first login!**

## 🚀 Fitur Lengkap

### Frontend Views (8 Complete Views)
- ✅ **Authentication System** - Login/logout dengan JWT tokens
- ✅ **Protected Routes** - Auto-redirect untuk unauthorized access
- ✅ **Role-Based UI** - Dynamic menu berdasarkan user role
  - **Admin**: Dashboard, Kasir, Pesanan, Pelanggan, Inventory, Notifikasi, Pengaturan
  - **Pelanggan**: Dashboard, Pesanan Saya, Notifikasi, Pengaturan
- ✅ **Dashboard Overview** 
  - **Admin**: Statistik real-time pendapatan, pelanggan, dan order dengan grafik
  - **Pelanggan**: Total belanja, order aktif, siap diambil, pesanan selesai
- ✅ **Point of Sale (POS)** - Sistem kasir dengan keranjang belanja interaktif (Admin only)
- ✅ **Manajemen Inventory** - Tracking stok bahan baku dengan alert low stock (Admin only)
- ✅ **Manajemen Pesanan** 
  - **Admin**: Kanban board untuk tracking status order
  - **Pelanggan**: Read-only table view dengan filter
- ✅ **Data Pelanggan** - CRUD member dengan sistem poin dan reward (Admin only)
- ✅ **Notifikasi System** - Complete notification center dengan CRUD dan unread count
- ✅ **Pengaturan Lengkap** - 5 tabs: General, Profile, Notifications, Security, System
- ✅ **Auto-Refresh** - Real-time data sync (5s customer, 10s admin)
- ✅ **Responsive Design** - Mobile-friendly interface dengan mobile header
- ✅ **Modern UI** - Shadcn UI components dengan Tailwind CSS

### Backend API (35+ Endpoints)
- ✅ **JWT Authentication** - Secure token-based auth dengan bcrypt password hashing
- ✅ **Role-Based Access Control** - 2 roles: Admin (Pemilik Toko), Pelanggan (Customer)
  - **Admin**: Full access ke semua fitur
  - **Pelanggan**: Limited access (dashboard, orders, notifications, settings)
  - **Order Filtering**: Customer hanya lihat order mereka (`createdBy = userId OR customerId = userId`)
- ✅ **Activity Logging** - Audit trail untuk semua user actions
- ✅ **RESTful API** - 35+ protected endpoints untuk semua entitas
- ✅ **Database SQLite** - Persistent storage dengan relational schema (9 tables)
- ✅ **CRUD Operations** - Create, Read, Update, Delete untuk:
  - Users (Authentication & user management)
  - Services (Layanan laundry - 10 production services)
  - Inventory (Stok barang)
  - Orders (Pesanan dengan createdBy tracking)
  - Members (Pelanggan)
  - Notifications (Sistem notifikasi)
  - Order Items
  - Activity Logs
- ✅ **Statistics API** - Dashboard analytics dan reporting
- ✅ **Data Validation** - Input validation dan error handling
- ✅ **Real-Time Sync** - Auto-refresh mechanism untuk data consistency

## 📋 Prasyarat

- Node.js v18+ 
- npm atau yarn
- Browser modern (Chrome, Firefox, Edge)

## 🛠️ Instalasi

### 1. Clone atau Download Project

```bash
cd "Sistem ERP Laundry"
```

### 2. Install Dependencies Frontend

```bash
npm install
```

### 3. Install Dependencies Backend

```bash
cd backend
npm install
cd ..
```

## 🏃 Menjalankan Aplikasi

### Jalankan Backend (Terminal 1)

```bash
cd backend
npm start
```

Backend akan berjalan di: **http://localhost:3002**

Output yang benar:
```
✅ Fresh database initialized with:
   - 1 Admin user (admin/admin123) - Pemilik Toko
   - 1 Pelanggan user (testing/pelanggan123) - Test Customer
   - 10 Production services
   - 1 Test member (Software Testing)
   - 0 Initial orders (customer melihat data real-time dari POS)
🚀 Server running on http://localhost:3002
```

### Jalankan Frontend (Terminal 2)

```bash
npm run dev
```

Frontend akan berjalan di: **http://localhost:3000**

### 4. Login ke Sistem

1. Buka browser: **http://localhost:3000**
2. Akan redirect otomatis ke **http://localhost:3000/login**
3. Login dengan credentials:
   - **Admin**: Username `admin` / Password `admin123`
   - **Pelanggan**: Username `testing` / Password `pelanggan123`
4. Setelah login sukses, akan redirect ke dashboard

### 5. Verifikasi Customer Login (Optional)

**Customer dashboard akan KOSONG di awal** - ini NORMAL karena tidak ada data order bawaan.

Untuk test customer experience:

1. **Login sebagai Admin** (`admin` / `admin123`)
2. **Buka Kasir (POS)**
3. **Buat order baru:**
   - Pilih Customer: "Software Testing"
   - Tambah layanan (contoh: Cuci Komplit 2kg)
   - Klik "Checkout"
4. **Logout dari admin**
5. **Login sebagai Customer** (`testing` / `pelanggan123`)
6. **Verifikasi dashboard menampilkan order yang baru dibuat**

**Database verification (optional):**
```bash
cd backend
node test-customer-data-flow.cjs
```

**Expected output:**
```
✅ Customer has X orders (X = jumlah order dari POS)
✅ All orders have items - data is complete!
✅ SYSTEM STATUS: Data connection should work
```

**Login sebagai customer dan verifikasi:**
- Dashboard menampilkan 4 stat cards
- Stats dihitung berdasarkan order real-time
- "Pesanan Terbaru" table menampilkan orders dengan service names
- "Pesanan Saya" view menampilkan semua customer orders
- Auto-refresh setiap 5 detik

## 📚 API Documentation

### Authentication

⚠️ **All API endpoints (except login) require authentication!**

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response: {
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User
```http
GET /api/auth/me
Cookie: token=...

Response: {
  "id": "U-ADMIN-001",
  "username": "admin",
  "role": "admin",
  "fullName": "Administrator"
}
```

#### Logout
```http
POST /api/auth/logout
Cookie: token=...
```

### Base URL
```
http://localhost:3002/api
```

### Endpoints (Protected)

#### Authentication (3 endpoints)
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

#### Services (5 endpoints)
- `GET /api/services` - Get all services (Auth required)
- `GET /api/services/:id` - Get service by ID (Auth required)
- `POST /api/services` - Create new service (Admin only)
- `PUT /api/services/:id` - Update service (Admin only)
- `DELETE /api/services/:id` - Delete service (Admin only)

#### Inventory (6 endpoints)
- `GET /api/inventory` - Get all inventory items (Auth required)
- `GET /api/inventory/low-stock` - Get low stock items (Auth required)
- `GET /api/inventory/:id` - Get inventory item by ID (Auth required)
- `POST /api/inventory` - Create new inventory item (Admin only)
- `PUT /api/inventory/:id` - Update inventory item (Admin only)
- `PATCH /api/inventory/:id/stock` - Update stock quantity (Admin only)
- `DELETE /api/inventory/:id` - Delete inventory item (Admin only)

#### Members (5 endpoints)
- `GET /api/members` - Get all members (Auth required)
- `GET /api/members/:id` - Get member by ID (Auth required)
- `POST /api/members` - Create new member (Auth required)
- `PUT /api/members/:id` - Update member (Auth required)
- `PATCH /api/members/:id/points` - Add points to member (Auth required)
- `DELETE /api/members/:id` - Delete member (Admin only)

#### Notifications (5 endpoints)
- `GET /api/notifications` - Get all notifications for current user (Auth required)
- `GET /api/notifications/unread-count` - Get unread notification count (Auth required)
- `PATCH /api/notifications/:id/read` - Mark notification as read (Auth required)
- `PATCH /api/notifications/mark-all-read` - Mark all notifications as read (Auth required)
- `DELETE /api/notifications/:id` - Delete notification (Auth required)

#### Orders (5 endpoints)
- `GET /api/orders` - Get all orders (filtered by role) (Auth required)
- `GET /api/orders/:id` - Get order by ID (Auth required)
- `POST /api/orders` - Create new order (Auth required)
- `PUT /api/orders/:id` - Update order (Auth required)
- `PATCH /api/orders/:id/status` - Update order status (Auth required)
- `DELETE /api/orders/:id` - Delete order (Admin only)

#### Statistics (2 endpoints)
- `GET /api/stats/dashboard` - Get dashboard statistics (Auth required)
- `GET /api/stats/revenue?startDate=&endDate=` - Get revenue by date range (Auth required)

#### Health Check (1 endpoint)
- `GET /api/health` - Check API status (Public)

### Example Request (Create Order)

```javascript
POST /api/orders
Content-Type: application/json

{
  "id": "TRX-123",
  "customerName": "John Doe",
  "customerId": "M-001",
  "items": [
    {
      "serviceId": "1",
      "serviceName": "Cuci Komplit",
      "quantity": 3,
      "price": 7000
    }
  ],
  "total": 21000,
  "status": "pending",
  "date": "2023-12-03",
  "paymentMethod": "tunai"
}
```

## 🗄️ Database Schema

### Users Table
```sql
- id (TEXT PRIMARY KEY)
- username (TEXT UNIQUE)
- email (TEXT UNIQUE)
- password (TEXT) -- bcrypt hashed
- role (TEXT: admin/pelanggan)
- fullName (TEXT)
- phone (TEXT)
- address (TEXT)
- createdAt (TEXT)
- lastLogin (TEXT)
```

### Services Table
```sql
- id (TEXT PRIMARY KEY)
- name (TEXT)
- price (INTEGER)
- unit (TEXT)
- category (TEXT: kiloan/satuan/express)
- icon (TEXT)
- description (TEXT)
- isActive (INTEGER)
```

### Inventory Table
```sql
- id (TEXT PRIMARY KEY)
- code (TEXT UNIQUE)
- name (TEXT)
- stock (INTEGER)
- unit (TEXT)
- minStock (INTEGER)
- supplier (TEXT)
- supplierContact (TEXT)
- price (INTEGER)
- category (TEXT)
```

### Members Table
```sql
- id (TEXT PRIMARY KEY)
- name (TEXT)
- phone (TEXT UNIQUE)
- avatar (TEXT)
- joinDate (TEXT)
- expiryDate (TEXT)
- points (INTEGER)
- totalSpend (INTEGER)
```

### Orders Table
```sql
- id (TEXT PRIMARY KEY)
- customerName (TEXT)
- customerId (TEXT, FK to members)
- createdBy (TEXT, FK to users) -- Tracks who created the order
- total (INTEGER)
- status (TEXT: pending/washing/ready/picked_up)
- date (TEXT)
- paymentMethod (TEXT: tunai/qris/debit)
- createdAt (TEXT)
```

**Order Filtering Logic:**
- **Admin**: Sees ALL orders (no filter)
- **Pelanggan**: Sees orders where `createdBy = userId OR customerId = userId OR customerName matches user fullName`

### Order Items Table
```sql
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- orderId (TEXT, FK to orders)
- serviceId (TEXT, FK to services)
- serviceName (TEXT)
- quantity (INTEGER)
- price (INTEGER)
```

### Notifications Table
```sql
- id (TEXT PRIMARY KEY)
- userId (TEXT, FK to users, nullable for broadcast)
- type (TEXT: info/warning/success/error)
- title (TEXT)
- message (TEXT)
- priority (TEXT: low/medium/high)
- isRead (INTEGER: 0/1)
- createdAt (TEXT)
```

### Activity Logs Table
```sql
- id (INTEGER PRIMARY KEY AUTOINCREMENT)
- userId (TEXT, FK to users)
- action (TEXT)
- details (TEXT)
- createdAt (TEXT)
```

## 📁 Struktur Project

```
Sistem ERP Laundry/
├── backend/                    # Backend API
│   ├── server.js              # Express server (35+ endpoints)
│   ├── database.js            # SQLite database setup & initialization
│   ├── laundry.db            # SQLite database file
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── check-db.js           # Database verification script
│   ├── create-test-order.js  # Test order creation script
│   ├── test-customer-data-flow.cjs  # Customer data flow test
│   └── package.json
│
├── src/                       # Frontend React
│   ├── api/
│   │   └── api.ts            # API client dengan axios
│   ├── components/
│   │   ├── laundry/          # Main application components
│   │   │   ├── DashboardView.tsx      # Admin dashboard
│   │   │   ├── CustomerDashboard.tsx  # Customer dashboard
│   │   │   ├── PointOfSale.tsx        # POS/Cashier system
│   │   │   ├── InventoryView.tsx       # Inventory management
│   │   │   ├── OrdersView.tsx          # Order management
│   │   │   ├── CustomersView.tsx       # Customer/member management
│   │   │   ├── NotificationsView.tsx   # Notification center
│   │   │   ├── SettingsView.tsx        # Settings (5 tabs)
│   │   │   ├── LoginView.tsx           # Login page
│   │   │   ├── Sidebar.tsx             # Navigation sidebar
│   │   │   └── data.ts                 # Static data
│   │   ├── ui/               # Shadcn UI components (50+ components)
│   │   └── figma/
│   │       └── ImageWithFallback.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx               # Main app component with routing
│   ├── main.tsx              # React entry point
│   └── index.css             # Global styles
│
├── public/                    # Static assets
│   └── favicon.svg
│
├── build/                     # Production build output
│
├── package.json              # Frontend dependencies
├── vite.config.ts            # Vite configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── tsconfig.json             # TypeScript configuration
├── start.ps1                 # PowerShell start script
├── test-all-features.ps1     # Feature testing script
├── test-system.ps1           # System testing script
├── API_TESTING.http          # API testing file
├── debug-customer-data.js    # Browser console debug script
├── LICENSE                   # MIT License
└── README.md                 # This file
```

## 🎨 Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript 5.7.2** - Type safety
- **Vite 6.3.5** - Build tool & dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Shadcn UI** - Component library (50+ components)
- **Recharts 2.15.2** - Charts & visualization
- **Lucide React 0.487.0** - Icon library
- **React Router DOM 7.10.0** - Client-side routing
- **React Hook Form 7.55.0** - Form management
- **Sonner 2.0.3** - Toast notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js 4.18.2** - Web framework
- **SQLite** - Database
- **better-sqlite3 9.2.2** - SQLite driver
- **bcryptjs 3.0.3** - Password hashing
- **jsonwebtoken 9.0.2** - JWT authentication
- **cookie-parser 1.4.7** - Cookie parsing
- **cors 2.8.5** - Cross-origin support
- **express-validator 7.3.1** - Input validation

## 🔧 Development

### Build untuk Production

```bash
npm run build
```

Build output akan berada di folder `build/`

### Run Production Build

```bash
npm run preview
```

### Development Scripts

**Backend:**
```bash
cd backend
npm start      # Start server
npm run dev    # Start with watch mode (Node.js --watch)
```

**Frontend:**
```bash
npm run dev    # Start Vite dev server
npm run build  # Build for production
```

### Testing Scripts

**PowerShell Scripts (Windows):**
- `start.ps1` - Start both frontend and backend
- `test-all-features.ps1` - Test all features
- `test-system.ps1` - System testing

**Backend Testing:**
```bash
cd backend
node test-customer-data-flow.cjs  # Test customer data flow
node create-test-order.js          # Create test order
node check-db.js                   # Check database
```

## 🚦 Status Order

1. **Pending** - Order baru masuk, menunggu proses
2. **Washing** - Sedang dalam proses pencucian
3. **Ready** - Siap diambil pelanggan
4. **Picked Up** - Sudah diambil pelanggan

## 💳 Metode Pembayaran

- Tunai (Cash)
- QRIS Scan
- Kartu Debit/Kredit

## 📊 Dashboard Metrics

### Admin Dashboard
- Total Pendapatan Bulan Ini
- Jumlah Pelanggan Baru
- Order Aktif dalam Proses
- Item Inventory Kritis (Low Stock)
- Grafik Pendapatan Mingguan
- Top Services (Layanan Terlaris)

### Customer Dashboard
- Total Belanja
- Order Aktif
- Siap Diambil
- Pesanan Selesai
- Pesanan Terbaru (Table)

## 🔐 Security Features

✅ **Production-Ready Security:**
- ✅ JWT Authentication dengan HTTP-only cookies
- ✅ Password encryption dengan bcrypt (10 salt rounds)
- ✅ Role-based access control (Admin vs Pelanggan)
- ✅ Protected API endpoints dengan middleware
- ✅ Input validation & sanitization
- ✅ SQL injection protection (parameterized queries)
- ✅ XSS protection (HTTP-only cookies)
- ✅ CORS configuration
- ✅ Error handling tanpa sensitive data leak
- ✅ Session expiration (24 hours)
- ✅ Activity logging untuk audit trail

⚠️ **Additional Production Recommendations:**
- Use environment variables untuk secrets (JWT_SECRET, database path)
- Implement rate limiting untuk API endpoints
- Add request logging & monitoring
- Use HTTPS in production
- Regular security audits
- Backup strategy implementation
- Database encryption untuk sensitive data

## 📦 Project Status

**Version:** 2.0.0  
**Status:** ✅ **PRODUCTION READY** (100% Complete)  
**Last Updated:** December 2024

### Completion Checklist
- [x] Backend API (35+ endpoints)
- [x] Frontend Views (8 complete views)
- [x] Authentication & Authorization
- [x] Database Schema (9 tables)
- [x] All CRUD Operations
- [x] Notifications System
- [x] Settings Management (5 tabs)
- [x] Role-Based Access Control
- [x] Testing & Validation
- [x] UI/UX Polish
- [x] Security Implementation
- [x] Responsive Design
- [x] Auto-Refresh Mechanism

### Key Features
- ✅ Complete authentication system dengan JWT
- ✅ Role-based UI dan API access control
- ✅ Real-time dashboard dengan statistics
- ✅ Point of Sale (POS) system
- ✅ Inventory management dengan low stock alerts
- ✅ Order management dengan Kanban board
- ✅ Customer/member management dengan points system
- ✅ Notification center dengan CRUD
- ✅ Comprehensive settings dengan 5 tabs
- ✅ Auto-refresh untuk data consistency
- ✅ Mobile-responsive design
- ✅ Modern UI dengan Shadcn components

## 📝 License

MIT License - Free to use for personal and commercial projects.

## 👨‍💻 Author

Created with ❤️ for Laundry Business Management

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📞 Support

Jika ada pertanyaan atau masalah, silakan buat issue di repository ini.

---

**Happy Laundering! 🧺✨**

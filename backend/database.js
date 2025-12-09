import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'laundry.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  -- Users table for authentication
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin', 'pelanggan')),
    fullName TEXT NOT NULL,
    phone TEXT,
    address TEXT,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    lastLogin TEXT
  );

  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    unit TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('kiloan', 'satuan', 'express')),
    icon TEXT,
    description TEXT,
    isActive INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS inventory (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    unit TEXT NOT NULL,
    minStock INTEGER NOT NULL DEFAULT 0,
    supplier TEXT,
    supplierContact TEXT,
    price INTEGER NOT NULL DEFAULT 0,
    category TEXT NOT NULL,
    lastRestockDate TEXT,
    isActive INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS members (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    avatar TEXT,
    joinDate TEXT NOT NULL,
    expiryDate TEXT NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    totalSpend INTEGER NOT NULL DEFAULT 0,
    isActive INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customerName TEXT NOT NULL,
    customerId TEXT,
    total INTEGER NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('pending', 'washing', 'ready', 'picked_up')),
    date TEXT NOT NULL,
    paymentMethod TEXT NOT NULL CHECK(paymentMethod IN ('tunai', 'qris', 'debit')),
    createdBy TEXT,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES members(id) ON DELETE SET NULL,
    FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId TEXT NOT NULL,
    serviceId TEXT NOT NULL,
    serviceName TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    price INTEGER NOT NULL,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    orderId TEXT NOT NULL,
    amount INTEGER NOT NULL,
    paymentMethod TEXT NOT NULL,
    date TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE
  );

  -- Notifications table
  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    userId TEXT,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    isRead INTEGER DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );

  -- Activity logs
  CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Clear existing data and insert fresh data
const clearData = db.transaction(() => {
  db.prepare('DELETE FROM notifications').run();
  db.prepare('DELETE FROM activity_logs').run();
  db.prepare('DELETE FROM transactions').run();
  db.prepare('DELETE FROM order_items').run();
  db.prepare('DELETE FROM orders').run();
  db.prepare('DELETE FROM members').run();
  db.prepare('DELETE FROM inventory').run();
  db.prepare('DELETE FROM services').run();
  db.prepare('DELETE FROM users').run();
});

// Check if we need to reset
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (userCount.count === 0) {
  console.log('🔄 Initializing fresh database...');
  clearData();

  // Insert admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  db.prepare(`
    INSERT INTO users (id, username, email, password, role, fullName, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('U-ADMIN-001', 'admin', 'admin@laundry.com', adminPassword, 'admin', 'Administrator', '081234567890');

  // Insert 1 test pelanggan user
  const pelangganPassword = bcrypt.hashSync('pelanggan123', 10);
  db.prepare(`
    INSERT INTO users (id, username, email, password, role, fullName, phone, address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run('U-PELANGGAN-001', 'testing', 'testing@customer.com', pelangganPassword, 'pelanggan', 'Software Testing', '081234567890', 'Jl. Test No. 123');

  // Insert default services (production-ready services)
  const insertService = db.prepare(`
    INSERT INTO services (id, name, price, unit, category, icon, description, isActive)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const services = [
    ['SV-001', 'Cuci Komplit', 7000, 'kg', 'kiloan', 'washing-machine', 'Cuci + Gosok + Parfum', 1],
    ['SV-002', 'Setrika Saja', 4000, 'kg', 'kiloan', 'iron', 'Gosok + Parfum', 1],
    ['SV-003', 'Cuci Saja', 5000, 'kg', 'kiloan', 'droplet', 'Hanya Cuci', 1],
    ['SV-004', 'Bed Cover Single', 15000, 'pcs', 'satuan', 'bed', 'Ukuran Single/Twin', 1],
    ['SV-005', 'Bed Cover King', 25000, 'pcs', 'satuan', 'bed', 'Ukuran Queen/King', 1],
    ['SV-006', 'Jas / Blazer', 20000, 'pcs', 'satuan', 'shirt', 'Dry Clean Profesional', 1],
    ['SV-007', 'Boneka Medium', 10000, 'pcs', 'satuan', 'bear', 'Tinggi maksimal 50cm', 1],
    ['SV-008', 'Express 3 Jam', 15000, 'kg', 'express', 'timer', 'Selesai dalam 3 jam', 1],
    ['SV-009', 'Karpet Tebal', 15000, 'm2', 'satuan', 'package', 'Cuci Deep Clean', 1],
    ['SV-010', 'Sepatu Sneakers', 25000, 'pcs', 'satuan', 'boot', 'Deep Cleaning + Treatment', 1],
  ];

  const insertManyServices = db.transaction((services) => {
    for (const service of services) {
      insertService.run(...service);
    }
  });
  insertManyServices(services);

  // Insert 1 test member only
  db.prepare(`
    INSERT INTO members (id, name, phone, avatar, joinDate, expiryDate, points, totalSpend, isActive)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    'M-TEST-001',
    'Software Testing',
    '081234567890',
    'https://api.dicebear.com/7.x/initials/svg?seed=ST',
    '2025-12-03',
    '2026-12-03',
    0,
    0,
    1
  );

  console.log('✅ Fresh database initialized with:');
  console.log('   - 1 Admin user (admin/admin123) - Pemilik Toko');
  console.log('   - 1 Pelanggan user (testing/pelanggan123) - Test Customer');
  console.log('   - 10 Production services');
  console.log('   - 1 Test member (Software Testing)');
  console.log('   - 0 Initial inventory items');
  console.log('   - 0 Initial orders');
}

// Create indexes for better performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date);
  CREATE INDEX IF NOT EXISTS idx_members_phone ON members(phone);
  CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
  CREATE INDEX IF NOT EXISTS idx_inventory_code ON inventory(code);
  CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(userId);
  CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(isRead);
`);

console.log('✅ Database ready for production use');

export default db;

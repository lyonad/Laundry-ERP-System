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

  -- Service Materials (mapping services to inventory items)
  CREATE TABLE IF NOT EXISTS service_materials (
    id TEXT PRIMARY KEY,
    serviceId TEXT NOT NULL,
    inventoryId TEXT NOT NULL,
    quantity REAL NOT NULL DEFAULT 1,
    unit TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (serviceId) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (inventoryId) REFERENCES inventory(id) ON DELETE CASCADE,
    UNIQUE(serviceId, inventoryId)
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
  db.prepare('DELETE FROM service_materials').run();
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

  // Insert default inventory items
  const insertInventory = db.prepare(`
    INSERT INTO inventory (id, code, name, stock, unit, minStock, supplier, supplierContact, price, category, isActive)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const inventoryItems = [
    ['INV-001', 'DTRG-BBP', 'Detergen Bubuk Premium', 50, 'kg', 10, 'Supplier A', '081111111111', 25000, 'Bahan Cuci', 1],
    ['INV-002', 'DTRG-CCT', 'Detergen Cair Konsentrat', 30, 'liter', 5, 'Supplier B', '082222222222', 35000, 'Bahan Cuci', 1],
    ['INV-003', 'PLMBT-PKN', 'Pelembut Pakaian', 25, 'liter', 5, 'Supplier A', '081111111111', 20000, 'Bahan Cuci', 1],
    ['INV-004', 'PMT-PKN', 'Pemutih Pakaian', 20, 'liter', 5, 'Supplier C', '083333333333', 18000, 'Bahan Cuci', 1],
    ['INV-005', 'PRFM-LND', 'Parfum Laundry Premium', 15, 'liter', 3, 'Supplier B', '082222222222', 45000, 'Bahan Cuci', 1],
    ['INV-006', 'DRY-SOLV', 'Dry Clean Solvent', 40, 'liter', 10, 'Supplier D', '084444444444', 60000, 'Bahan Cuci', 1],
    ['INV-007', 'SHMP-KRP', 'Shampoo Karpet', 18, 'liter', 5, 'Supplier C', '083333333333', 28000, 'Bahan Cuci', 1],
    ['INV-008', 'SHOE-CLN', 'Shoe Cleaner & Protector', 25, 'pcs', 5, 'Supplier E', '085555555555', 15000, 'Bahan Cuci', 1],
    ['INV-009', 'STRK-UAP', 'Setrika Uap (Air)', 100, 'liter', 20, 'Supplier A', '081111111111', 5000, 'Bahan Cuci', 1],
    ['INV-010', 'STRCH-KNJ', 'Starch / Kanji', 15, 'kg', 3, 'Supplier B', '082222222222', 12000, 'Bahan Cuci', 1],
  ];
  
  const insertManyInventory = db.transaction((items) => {
    for (const item of items) {
      insertInventory.run(...item);
    }
  });
  insertManyInventory(inventoryItems);

  // Insert default service materials mappings
  const insertServiceMaterial = db.prepare(`
    INSERT INTO service_materials (id, serviceId, inventoryId, quantity, unit)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const serviceMaterials = [
    // Cuci Komplit (per kg)
    ['SM-001', 'SV-001', 'INV-001', 0.05, 'kg'], // 50g detergen bubuk
    ['SM-002', 'SV-001', 'INV-003', 0.03, 'liter'], // 30ml pelembut
    ['SM-003', 'SV-001', 'INV-005', 0.02, 'liter'], // 20ml parfum
    ['SM-004', 'SV-001', 'INV-009', 0.1, 'liter'], // 100ml setrika uap
    ['SM-005', 'SV-001', 'INV-010', 0.01, 'kg'], // 10g kanji

    // Setrika Saja (per kg)
    ['SM-006', 'SV-002', 'INV-009', 0.15, 'liter'], // 150ml setrika uap
    ['SM-007', 'SV-002', 'INV-005', 0.02, 'liter'], // 20ml parfum
    ['SM-008', 'SV-002', 'INV-010', 0.02, 'kg'], // 20g kanji

    // Cuci Saja (per kg)
    ['SM-009', 'SV-003', 'INV-001', 0.05, 'kg'], // 50g detergen bubuk
    ['SM-010', 'SV-003', 'INV-003', 0.03, 'liter'], // 30ml pelembut

    // Bed Cover Single (per pcs)
    ['SM-011', 'SV-004', 'INV-001', 0.15, 'kg'], // 150g detergen
    ['SM-012', 'SV-004', 'INV-003', 0.1, 'liter'], // 100ml pelembut
    ['SM-013', 'SV-004', 'INV-005', 0.05, 'liter'], // 50ml parfum
    ['SM-014', 'SV-004', 'INV-009', 0.3, 'liter'], // 300ml setrika uap

    // Bed Cover King (per pcs)
    ['SM-015', 'SV-005', 'INV-001', 0.25, 'kg'], // 250g detergen
    ['SM-016', 'SV-005', 'INV-003', 0.15, 'liter'], // 150ml pelembut
    ['SM-017', 'SV-005', 'INV-005', 0.08, 'liter'], // 80ml parfum
    ['SM-018', 'SV-005', 'INV-009', 0.5, 'liter'], // 500ml setrika uap

    // Jas / Blazer (per pcs)
    ['SM-019', 'SV-006', 'INV-006', 0.5, 'liter'], // 500ml dry clean solvent
    ['SM-020', 'SV-006', 'INV-009', 0.2, 'liter'], // 200ml setrika uap
    ['SM-021', 'SV-006', 'INV-010', 0.05, 'kg'], // 50g kanji

    // Boneka Medium (per pcs)
    ['SM-022', 'SV-007', 'INV-001', 0.1, 'kg'], // 100g detergen
    ['SM-023', 'SV-007', 'INV-003', 0.05, 'liter'], // 50ml pelembut
    ['SM-024', 'SV-007', 'INV-005', 0.03, 'liter'], // 30ml parfum

    // Express 3 Jam (per kg)
    ['SM-025', 'SV-008', 'INV-002', 0.08, 'liter'], // 80ml detergen cair
    ['SM-026', 'SV-008', 'INV-003', 0.04, 'liter'], // 40ml pelembut
    ['SM-027', 'SV-008', 'INV-005', 0.03, 'liter'], // 30ml parfum
    ['SM-028', 'SV-008', 'INV-009', 0.12, 'liter'], // 120ml setrika uap

    // Karpet Tebal (per m²)
    ['SM-029', 'SV-009', 'INV-007', 0.2, 'liter'], // 200ml shampoo karpet
    ['SM-030', 'SV-009', 'INV-001', 0.1, 'kg'], // 100g detergen
    ['SM-031', 'SV-009', 'INV-004', 0.05, 'liter'], // 50ml pemutih

    // Sepatu Sneakers (per pcs)
    ['SM-032', 'SV-010', 'INV-008', 1, 'pcs'], // 1 pcs shoe cleaner
    ['SM-033', 'SV-010', 'INV-001', 0.05, 'kg'], // 50g detergen
  ];
  
  const insertManyServiceMaterials = db.transaction((materials) => {
    for (const material of materials) {
      insertServiceMaterial.run(...material);
    }
  });
  insertManyServiceMaterials(serviceMaterials);

  console.log('✅ Fresh database initialized with:');
  console.log('   - 1 Admin user (admin/admin123) - Pemilik Toko');
  console.log('   - 1 Pelanggan user (testing/pelanggan123) - Test Customer');
  console.log('   - 10 Production services');
  console.log('   - 1 Test member (Software Testing)');
  console.log('   - 10 Initial inventory items');
  console.log('   - 33 Service-material mappings');
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
  CREATE INDEX IF NOT EXISTS idx_service_materials_service ON service_materials(serviceId);
  CREATE INDEX IF NOT EXISTS idx_service_materials_inventory ON service_materials(inventoryId);
`);

console.log('✅ Database ready for production use');

export default db;

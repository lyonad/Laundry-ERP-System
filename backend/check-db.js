import db from './database.js';

console.log('\n=== CHECKING DATABASE ===\n');

// Check users
const users = db.prepare('SELECT id, username, role, fullName FROM users').all();
console.log('👥 USERS:');
console.log(JSON.stringify(users, null, 2));

// Check orders
const orders = db.prepare('SELECT id, customerName, customerId, createdBy, status, total, date FROM orders').all();
console.log('\n📦 ORDERS:');
console.log(JSON.stringify(orders, null, 2));

// Check order items
const items = db.prepare('SELECT orderId, serviceName, quantity, price FROM order_items').all();
console.log('\n🛒 ORDER ITEMS:');
console.log(JSON.stringify(items, null, 2));

// Check notifications
const notifs = db.prepare('SELECT id, userId, type, title, isRead FROM notifications').all();
console.log('\n🔔 NOTIFICATIONS:');
console.log(JSON.stringify(notifs, null, 2));

console.log('\n=== ANALYSIS ===');
console.log(`Total Users: ${users.length}`);
console.log(`Total Orders: ${orders.length}`);
console.log(`Total Notifications: ${notifs.length}`);

// Check pelanggan's orders
const pelangganOrders = orders.filter(o => 
  o.createdBy === 'U-PELANGGAN-001' || o.customerId === 'U-PELANGGAN-001'
);
console.log(`\nOrders for pelanggan (U-PELANGGAN-001): ${pelangganOrders.length}`);
console.log('Details:', JSON.stringify(pelangganOrders, null, 2));

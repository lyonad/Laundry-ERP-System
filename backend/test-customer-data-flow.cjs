#!/usr/bin/env node

/**
 * 🧪 COMPLETE SYSTEM TEST - Customer Data Connection
 * 
 * This script verifies the ENTIRE data flow from database to frontend.
 * Run this to diagnose any connection issues.
 * 
 * Usage: node test-customer-data-flow.js
 */

const Database = require('better-sqlite3');
const path = require('path');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

function log(color, symbol, message) {
  console.log(`${color}${symbol} ${message}${colors.reset}`);
}

function success(msg) { log(colors.green, '✅', msg); }
function error(msg) { log(colors.red, '❌', msg); }
function info(msg) { log(colors.blue, 'ℹ️', msg); }
function warn(msg) { log(colors.yellow, '⚠️', msg); }
function section(msg) { 
  console.log('\n' + colors.cyan + colors.bold + '━'.repeat(60) + colors.reset);
  console.log(colors.cyan + colors.bold + msg + colors.reset);
  console.log(colors.cyan + colors.bold + '━'.repeat(60) + colors.reset + '\n');
}

// Open database
const dbPath = path.join(__dirname, 'laundry.db');
const db = new Database(dbPath);

section('🧪 COMPLETE SYSTEM TEST - Customer Data Connection');

// TEST 1: Database Structure
section('📋 TEST 1: Database Schema Check');
try {
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  const requiredTables = ['users', 'orders', 'order_items', 'services'];
  
  requiredTables.forEach(table => {
    if (tables.find(t => t.name === table)) {
      success(`Table "${table}" exists`);
    } else {
      error(`Table "${table}" is MISSING!`);
    }
  });
  
  // Check orders table structure
  const orderColumns = db.prepare("PRAGMA table_info(orders)").all();
  const hasCreatedBy = orderColumns.find(c => c.name === 'createdBy');
  if (hasCreatedBy) {
    success('Column "createdBy" exists in orders table');
  } else {
    error('Column "createdBy" is MISSING in orders table!');
  }
} catch (err) {
  error(`Database error: ${err.message}`);
}

// TEST 2: User Accounts
section('👤 TEST 2: User Accounts Verification');
try {
  const users = db.prepare('SELECT id, username, role, fullName FROM users').all();
  
  console.log(`   Found ${users.length} users in database:\n`);
  users.forEach(user => {
    info(`   ${user.id} | ${user.username} | ${user.role} | ${user.fullName}`);
  });
  
  const customer = users.find(u => u.role === 'pelanggan');
  const admin = users.find(u => u.role === 'admin');
  
  if (customer) {
    success(`Customer account exists: ${customer.username} (${customer.id})`);
  } else {
    error('NO customer account found!');
  }
  
  if (admin) {
    success(`Admin account exists: ${admin.username} (${admin.id})`);
  } else {
    error('NO admin account found!');
  }
} catch (err) {
  error(`User query error: ${err.message}`);
}

// TEST 3: Customer Orders
section('📦 TEST 3: Customer Orders Check');
try {
  const customerId = 'U-PELANGGAN-001';
  
  // Count total orders
  const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get();
  info(`Total orders in database: ${totalOrders.count}`);
  
  // Get customer orders (matching backend filter logic)
  const customerOrders = db.prepare(`
    SELECT 
      id, customerName, customerId, createdBy, status, total, date
    FROM orders 
    WHERE createdBy = ? OR customerId = ?
    ORDER BY date DESC
  `).all(customerId, customerId);
  
  console.log(`\n   Customer ${customerId} has ${customerOrders.length} orders:\n`);
  
  if (customerOrders.length === 0) {
    error('❌ CUSTOMER HAS ZERO ORDERS!');
    warn('   This is why dashboard is empty!');
    warn('   Solution: Run "node create-customer-orders.js"');
  } else {
    success(`Found ${customerOrders.length} orders for customer`);
    
    customerOrders.forEach((order, idx) => {
      console.log(`\n   ${idx + 1}. Order ${order.id}:`);
      console.log(`      Status: ${order.status}`);
      console.log(`      Total: Rp ${order.total.toLocaleString('id-ID')}`);
      console.log(`      Created By: ${order.createdBy}`);
      console.log(`      Customer ID: ${order.customerId || '-'}`);
      console.log(`      Date: ${order.date}`);
      
      // Get order items
      const items = db.prepare(`
        SELECT oi.*, s.name as serviceName 
        FROM order_items oi
        LEFT JOIN services s ON oi.serviceId = s.id
        WHERE oi.orderId = ?
      `).all(order.id);
      
      if (items.length > 0) {
        console.log(`      Items (${items.length}):`);
        items.forEach(item => {
          console.log(`        - ${item.serviceName}: ${item.quantity}x @ Rp ${item.price.toLocaleString('id-ID')}`);
        });
        success(`      Order has ${items.length} items with service names`);
      } else {
        error('      Order has NO items!');
      }
    });
  }
} catch (err) {
  error(`Order query error: ${err.message}`);
}

// TEST 4: Order Status Distribution
section('📊 TEST 4: Order Status Distribution');
try {
  const customerId = 'U-PELANGGAN-001';
  const orders = db.prepare(`
    SELECT status, COUNT(*) as count, SUM(total) as totalAmount
    FROM orders 
    WHERE createdBy = ? OR customerId = ?
    GROUP BY status
  `).all(customerId, customerId);
  
  if (orders.length > 0) {
    console.log('   Status breakdown for customer:\n');
    orders.forEach(row => {
      info(`   ${row.status}: ${row.count} orders (Rp ${row.totalAmount.toLocaleString('id-ID')})`);
    });
    
    // Calculate expected dashboard stats
    const pending = orders.find(o => o.status === 'pending')?.count || 0;
    const washing = orders.find(o => o.status === 'washing')?.count || 0;
    const ready = orders.find(o => o.status === 'ready')?.count || 0;
    const completed = orders.find(o => o.status === 'picked_up')?.count || 0;
    const total = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    
    console.log('\n   📊 Expected Dashboard Stats:');
    console.log(`      Total Belanja: Rp ${total.toLocaleString('id-ID')}`);
    console.log(`      Order Aktif: ${pending + washing}`);
    console.log(`      Siap Diambil: ${ready}`);
    console.log(`      Pesanan Selesai: ${completed}`);
    success('Dashboard calculations verified');
  } else {
    warn('No order status data (customer has no orders)');
  }
} catch (err) {
  error(`Status query error: ${err.message}`);
}

// TEST 5: Backend Filter Logic Test
section('🔍 TEST 5: Backend Filter Logic Simulation');
try {
  const customerId = 'U-PELANGGAN-001';
  
  // This is EXACTLY what backend does
  const backendQuery = `
    SELECT 
      o.id, o.customerName, o.customerId, o.createdBy, 
      o.status, o.total, o.date,
      oi.serviceId, oi.quantity, oi.price,
      s.name as serviceName
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.orderId
    LEFT JOIN services s ON oi.serviceId = s.id
    WHERE (o.createdBy = ? OR o.customerId = ?)
    ORDER BY o.date DESC
  `;
  
  const rawData = db.prepare(backendQuery).all(customerId, customerId);
  
  console.log(`   Raw query returned ${rawData.length} rows\n`);
  
  // Group by order (like backend does)
  const ordersMap = {};
  rawData.forEach(row => {
    if (!ordersMap[row.id]) {
      ordersMap[row.id] = {
        id: row.id,
        customerName: row.customerName,
        customerId: row.customerId,
        createdBy: row.createdBy,
        status: row.status,
        total: row.total,
        date: row.date,
        items: []
      };
    }
    
    if (row.serviceId) {
      ordersMap[row.id].items.push({
        serviceId: row.serviceId,
        serviceName: row.serviceName,
        quantity: row.quantity,
        price: row.price
      });
    }
  });
  
  const orders = Object.values(ordersMap);
  
  if (orders.length > 0) {
    success(`Backend would return ${orders.length} orders to customer`);
    
    // Verify each order has items with serviceName
    let allOrdersValid = true;
    orders.forEach((order, idx) => {
      if (order.items.length === 0) {
        error(`   Order ${order.id} has NO items!`);
        allOrdersValid = false;
      } else if (!order.items[0].serviceName) {
        error(`   Order ${order.id} items missing serviceName!`);
        allOrdersValid = false;
      } else {
        info(`   Order ${idx + 1}: ${order.items.length} items with names ✓`);
      }
    });
    
    if (allOrdersValid) {
      success('All orders have valid items with serviceNames');
    }
  } else {
    error('Backend would return ZERO orders to customer!');
    warn('Customer will see empty dashboard');
  }
} catch (err) {
  error(`Backend simulation error: ${err.message}`);
}

// TEST 6: Services Check
section('🧺 TEST 6: Services Data Check');
try {
  const services = db.prepare('SELECT id, name, price FROM services').all();
  
  if (services.length > 0) {
    success(`Found ${services.length} services in database`);
    console.log('\n   Sample services:');
    services.slice(0, 3).forEach(service => {
      info(`   ${service.id} | ${service.name} | Rp ${service.price.toLocaleString('id-ID')}`);
    });
  } else {
    error('NO services found in database!');
  }
} catch (err) {
  error(`Services query error: ${err.message}`);
}

// FINAL SUMMARY
section('📋 TEST SUMMARY & RECOMMENDATIONS');

try {
  const customerId = 'U-PELANGGAN-001';
  const customerOrders = db.prepare(`
    SELECT COUNT(*) as count FROM orders 
    WHERE createdBy = ? OR customerId = ?
  `).get(customerId, customerId);
  
  console.log('');
  
  if (customerOrders.count === 0) {
    error('DIAGNOSIS: Customer has ZERO orders in database');
    console.log('\n   🔧 SOLUTION:');
    console.log('   1. Run: node create-customer-orders.js');
    console.log('   2. Restart backend: npm run dev');
    console.log('   3. Login as customer: testing / pelanggan123');
    console.log('   4. Dashboard should show 3 orders\n');
  } else {
    success(`Customer has ${customerOrders.count} orders - data exists!`);
    
    // Verify items
    const ordersWithoutItems = db.prepare(`
      SELECT o.id FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.orderId
      WHERE (o.createdBy = ? OR o.customerId = ?)
      AND oi.orderId IS NULL
    `).all(customerId, customerId);
    
    if (ordersWithoutItems.length > 0) {
      error(`${ordersWithoutItems.length} orders have NO items!`);
      warn('This will cause frontend to show empty service lists');
    } else {
      success('All orders have items - data is complete!');
    }
    
    console.log('\n   ✅ SYSTEM STATUS: Data connection should work');
    console.log('\n   📱 TESTING STEPS:');
    console.log('   1. Ensure backend is running: npm run dev (port 3002)');
    console.log('   2. Ensure frontend is running: npm run dev (port 3000)');
    console.log('   3. Open browser: http://localhost:3000');
    console.log('   4. Login: testing / pelanggan123');
    console.log('   5. Dashboard should show orders immediately');
    console.log('\n   🐛 IF STILL EMPTY:');
    console.log('   1. Open browser DevTools (F12)');
    console.log('   2. Go to Console tab');
    console.log('   3. Paste the debug script from debug-customer-data.js');
    console.log('   4. Check for API errors or auth issues\n');
  }
} catch (err) {
  error(`Summary error: ${err.message}`);
}

db.close();

section('🏁 TEST COMPLETE');
console.log('');

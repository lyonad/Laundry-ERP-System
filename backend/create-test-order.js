import db from './database.js';

// Create test order for customer account
const createTestOrder = () => {
  try {
    // Create order for pelanggan user
    const orderId = `TEST-${Date.now()}`;
    const customerUserId = 'U-PELANGGAN-001'; // testing account
    const memberIdForTesting = 'M-TEST-001'; // Software Testing member
    
    db.prepare(`
      INSERT INTO orders (id, customerName, customerId, total, status, date, paymentMethod, createdBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      'Software Testing',
      memberIdForTesting,
      50000,
      'pending',
      '2025-12-03',
      'tunai',
      customerUserId
    );
    
    // Add order items
    db.prepare(`
      INSERT INTO order_items (orderId, serviceId, serviceName, quantity, price)
      VALUES (?, ?, ?, ?, ?)
    `).run(orderId, 'SV-001', 'Cuci Komplit', 5, 7000);
    
    db.prepare(`
      INSERT INTO order_items (orderId, serviceId, serviceName, quantity, price)
      VALUES (?, ?, ?, ?, ?)
    `).run(orderId, 'SV-008', 'Express 3 Jam', 1, 15000);
    
    console.log('✅ Test order created successfully!');
    console.log(`   Order ID: ${orderId}`);
    console.log(`   Customer: Software Testing`);
    console.log(`   Created By: ${customerUserId}`);
    console.log(`   Status: pending`);
    console.log(`   Total: Rp 50,000`);
    
    // Create second order with different status
    const orderId2 = `TEST-${Date.now() + 1}`;
    
    db.prepare(`
      INSERT INTO orders (id, customerName, customerId, total, status, date, paymentMethod, createdBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId2,
      'Software Testing',
      memberIdForTesting,
      35000,
      'washing',
      '2025-12-02',
      'qris',
      customerUserId
    );
    
    db.prepare(`
      INSERT INTO order_items (orderId, serviceId, serviceName, quantity, price)
      VALUES (?, ?, ?, ?, ?)
    `).run(orderId2, 'SV-002', 'Setrika Saja', 5, 4000);
    
    db.prepare(`
      INSERT INTO order_items (orderId, serviceId, serviceName, quantity, price)
      VALUES (?, ?, ?, ?, ?)
    `).run(orderId2, 'SV-008', 'Express 3 Jam', 1, 15000);
    
    console.log(`   Order ID: ${orderId2}`);
    console.log(`   Status: washing`);
    console.log(`   Total: Rp 35,000`);
    
    // Create third order - completed
    const orderId3 = `TEST-${Date.now() + 2}`;
    
    db.prepare(`
      INSERT INTO orders (id, customerName, customerId, total, status, date, paymentMethod, createdBy)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId3,
      'Software Testing',
      memberIdForTesting,
      28000,
      'picked_up',
      '2025-11-30',
      'debit',
      customerUserId
    );
    
    db.prepare(`
      INSERT INTO order_items (orderId, serviceId, serviceName, quantity, price)
      VALUES (?, ?, ?, ?, ?)
    `).run(orderId3, 'SV-001', 'Cuci Komplit', 4, 7000);
    
    console.log(`   Order ID: ${orderId3}`);
    console.log(`   Status: picked_up (completed)`);
    console.log(`   Total: Rp 28,000`);
    
  } catch (error) {
    console.error('❌ Failed to create test order:', error.message);
  }
};

createTestOrder();

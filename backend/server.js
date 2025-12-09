import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './database.js';
import { authMiddleware, requireRole, JWT_SECRET } from './middleware/auth.js';

const app = express();
const PORT = 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== AUTH ENDPOINTS ====================

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Get user from database
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    db.prepare('UPDATE users SET lastLogin = ? WHERE id = ?').run(
      new Date().toISOString(),
      user.id
    );

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Log activity
    db.prepare(`
      INSERT INTO activity_logs (userId, action, details)
      VALUES (?, ?, ?)
    `).run(user.id, 'login', `User ${user.username} logged in`);

    // Return user data (without password)
    const { password: _, ...userData } = user;
    res.json({
      message: 'Login successful',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Logout
app.post('/api/auth/logout', authMiddleware, (req, res) => {
  try {
    // Log activity
    db.prepare(`
      INSERT INTO activity_logs (userId, action, details)
      VALUES (?, ?, ?)
    `).run(req.user.id, 'logout', `User ${req.user.username} logged out`);

    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
app.get('/api/auth/me', authMiddleware, (req, res) => {
  try {
    const user = db.prepare('SELECT id, username, email, role, fullName, lastLogin FROM users WHERE id = ?').get(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SERVICES ENDPOINTS ====================

// Get all services (requires auth)
app.get('/api/services', authMiddleware, (req, res) => {
  try {
    const services = db.prepare('SELECT * FROM services').all();
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get service by ID
app.get('/api/services/:id', authMiddleware, (req, res) => {
  try {
    const service = db.prepare('SELECT * FROM services WHERE id = ?').get(req.params.id);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new service
app.post('/api/services', authMiddleware, requireRole('admin'), (req, res) => {
  try {
    const { id, name, price, unit, category, icon, description } = req.body;
    const insert = db.prepare(`
      INSERT INTO services (id, name, price, unit, category, icon, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    insert.run(id, name, price, unit, category, icon, description);
    res.status(201).json({ message: 'Service created successfully', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update service
app.put('/api/services/:id', authMiddleware, requireRole('admin'), (req, res) => {
  try {
    const { name, price, unit, category, icon, description } = req.body;
    const update = db.prepare(`
      UPDATE services 
      SET name = ?, price = ?, unit = ?, category = ?, icon = ?, description = ?
      WHERE id = ?
    `);
    const result = update.run(name, price, unit, category, icon, description, req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete service
app.delete('/api/services/:id', authMiddleware, requireRole('admin'), (req, res) => {
  try {
    const deleteStmt = db.prepare('DELETE FROM services WHERE id = ?');
    const result = deleteStmt.run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== INVENTORY ENDPOINTS ====================

// Get all inventory items
app.get('/api/inventory', authMiddleware, (req, res) => {
  try {
    const inventory = db.prepare('SELECT * FROM inventory ORDER BY name').all();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get low stock items
app.get('/api/inventory/low-stock', authMiddleware, (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM inventory WHERE stock < minStock').all();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get inventory item by ID
app.get('/api/inventory/:id', authMiddleware, (req, res) => {
  try {
    const item = db.prepare('SELECT * FROM inventory WHERE id = ?').get(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new inventory item
app.post('/api/inventory', authMiddleware, requireRole('admin'), (req, res) => {
  try {
    const { id, code, name, stock, unit, minStock, supplier, supplierContact, price, category } = req.body;
    const insert = db.prepare(`
      INSERT INTO inventory (id, code, name, stock, unit, minStock, supplier, supplierContact, price, category)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insert.run(id, code, name, stock, unit, minStock, supplier, supplierContact, price, category);
    res.status(201).json({ message: 'Inventory item created successfully', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update inventory item
app.put('/api/inventory/:id', authMiddleware, requireRole('admin'), (req, res) => {
  try {
    const { code, name, stock, unit, minStock, supplier, supplierContact, price, category } = req.body;
    const update = db.prepare(`
      UPDATE inventory 
      SET code = ?, name = ?, stock = ?, unit = ?, minStock = ?, supplier = ?, supplierContact = ?, price = ?, category = ?
      WHERE id = ?
    `);
    const result = update.run(code, name, stock, unit, minStock, supplier, supplierContact, price, category, req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json({ message: 'Inventory item updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update stock quantity
app.patch('/api/inventory/:id/stock', authMiddleware, requireRole('admin'), (req, res) => {
  try {
    const { quantity, operation } = req.body; // operation: 'add' or 'subtract'
    const item = db.prepare('SELECT stock FROM inventory WHERE id = ?').get(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    const newStock = operation === 'add' ? item.stock + quantity : item.stock - quantity;
    
    if (newStock < 0) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const update = db.prepare('UPDATE inventory SET stock = ? WHERE id = ?');
    update.run(newStock, req.params.id);
    
    res.json({ message: 'Stock updated successfully', newStock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete inventory item
app.delete('/api/inventory/:id', authMiddleware, requireRole('admin'), (req, res) => {
  try {
    const deleteStmt = db.prepare('DELETE FROM inventory WHERE id = ?');
    const result = deleteStmt.run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== MEMBERS ENDPOINTS ====================

// Get all members
app.get('/api/members', authMiddleware, (req, res) => {
  try {
    const members = db.prepare('SELECT * FROM members ORDER BY name').all();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get member by ID
app.get('/api/members/:id', authMiddleware, (req, res) => {
  try {
    const member = db.prepare('SELECT * FROM members WHERE id = ?').get(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new member
app.post('/api/members', authMiddleware, (req, res) => {
  try {
    const { id, name, phone, avatar, joinDate, expiryDate, points, totalSpend } = req.body;
    const insert = db.prepare(`
      INSERT INTO members (id, name, phone, avatar, joinDate, expiryDate, points, totalSpend)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insert.run(id, name, phone, avatar, joinDate, expiryDate, points || 0, totalSpend || 0);
    res.status(201).json({ message: 'Member created successfully', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update member
app.put('/api/members/:id', authMiddleware, (req, res) => {
  try {
    const { name, phone, avatar, joinDate, expiryDate, points, totalSpend } = req.body;
    const update = db.prepare(`
      UPDATE members 
      SET name = ?, phone = ?, avatar = ?, joinDate = ?, expiryDate = ?, points = ?, totalSpend = ?
      WHERE id = ?
    `);
    const result = update.run(name, phone, avatar, joinDate, expiryDate, points, totalSpend, req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ message: 'Member updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add points to member
app.patch('/api/members/:id/points', authMiddleware, (req, res) => {
  try {
    const { points } = req.body;
    const member = db.prepare('SELECT points FROM members WHERE id = ?').get(req.params.id);
    
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const newPoints = member.points + points;
    const update = db.prepare('UPDATE members SET points = ? WHERE id = ?');
    update.run(newPoints, req.params.id);
    
    res.json({ message: 'Points updated successfully', newPoints });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete member
app.delete('/api/members/:id', authMiddleware, requireRole('admin'), (req, res) => {
  try {
    const deleteStmt = db.prepare('DELETE FROM members WHERE id = ?');
    const result = deleteStmt.run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== NOTIFICATIONS ENDPOINTS ====================

// Helper function to create notification
function createNotification(userId, type, title, message, priority = 'medium') {
  const id = `NOTIF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  db.prepare(`
    INSERT INTO notifications (id, userId, type, title, message, priority, isRead, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, 0, datetime('now'))
  `).run(id, userId, type, title, message, priority);
  return id;
}

// Get all notifications for current user
app.get('/api/notifications', authMiddleware, (req, res) => {
  try {
    const notifications = db.prepare(`
      SELECT * FROM notifications 
      WHERE userId = ? OR userId IS NULL
      ORDER BY createdAt DESC
      LIMIT 100
    `).all(req.user.id);
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get unread count
app.get('/api/notifications/unread-count', authMiddleware, (req, res) => {
  try {
    const result = db.prepare(`
      SELECT COUNT(*) as count FROM notifications 
      WHERE (userId = ? OR userId IS NULL) AND isRead = 0
    `).get(req.user.id);
    
    res.json({ count: result.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
app.patch('/api/notifications/:id/read', authMiddleware, (req, res) => {
  try {
    db.prepare('UPDATE notifications SET isRead = 1 WHERE id = ?').run(req.params.id);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all as read
app.patch('/api/notifications/mark-all-read', authMiddleware, (req, res) => {
  try {
    db.prepare(`
      UPDATE notifications SET isRead = 1 
      WHERE userId = ? OR userId IS NULL
    `).run(req.user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete notification
app.delete('/api/notifications/:id', authMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM notifications WHERE id = ?').run(req.params.id);
    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ORDERS ENDPOINTS ====================

// Get all orders with items (Admin: all orders, Pelanggan: own orders only)
app.get('/api/orders', authMiddleware, (req, res) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM orders';
    const params = [];
    
    // If pelanggan role, only show their orders (by createdBy or customerId)
    if (req.user.role === 'pelanggan') {
      const userRecord = db.prepare('SELECT id, fullName, phone FROM users WHERE id = ?').get(req.user.id);
      const userFullName = (userRecord?.fullName || req.user.fullName || '').trim();
      const userPhone = userRecord?.phone ? userRecord.phone.trim() : '';
      const conditions = [];

      // Orders created directly by this user (mobile/online orders)
      conditions.push('createdBy = ?');
      params.push(req.user.id);

      // Orders assigned to this user via name match (common for walk-in members)
      if (userFullName) {
        conditions.push('LOWER(customerName) = LOWER(?)');
        params.push(userFullName);
      }

      // Orders linked via member profiles (matching phone or name)
      let memberIds = [];
      if (userPhone || userFullName) {
        try {
          const memberQuery = db.prepare(`
            SELECT id FROM members
            WHERE (? != '' AND phone = ?)
               OR (? != '' AND LOWER(name) = LOWER(?))
          `);
          memberIds = memberQuery.all(userPhone, userPhone, userFullName, userFullName);
        } catch (memberError) {
          console.error('Failed to fetch member links for user:', memberError.message);
        }
      }

      if (memberIds.length > 0) {
        const placeholders = memberIds.map(() => '?').join(',');
        conditions.push(`customerId IN (${placeholders})`);
        params.push(...memberIds.map((m) => m.id));
      }

      if (conditions.length === 0) {
        // No matching identifiers, short-circuit to empty result
        return res.json([]);
      }

      query += ` WHERE (${conditions.join(' OR ')})`;
      
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
    } else {
      // Admin can see all orders
      if (status) {
        query += ' WHERE status = ?';
        params.push(status);
      }
    }
    
    query += ' ORDER BY date DESC, createdAt DESC';
    
    const orders = db.prepare(query).all(...params);
    
    // Get items for each order
    const ordersWithItems = orders.map(order => {
      const items = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(order.id);
      return { ...order, items };
    });
    
    res.json(ordersWithItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
app.get('/api/orders/:id', authMiddleware, (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const items = db.prepare('SELECT * FROM order_items WHERE orderId = ?').all(req.params.id);
    res.json({ ...order, items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
app.post('/api/orders', authMiddleware, (req, res) => {
  try {
    const { id, customerName, customerId, items, total, status, date, paymentMethod } = req.body;
    
    const createOrder = db.transaction((orderData) => {
      // Insert order
      const insertOrder = db.prepare(`
        INSERT INTO orders (id, customerName, customerId, total, status, date, paymentMethod, createdBy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertOrder.run(id, customerName, customerId, total, status, date, paymentMethod, req.user.id);
      
      // Insert order items
      const insertItem = db.prepare(`
        INSERT INTO order_items (orderId, serviceId, serviceName, quantity, price)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      for (const item of items) {
        insertItem.run(id, item.serviceId, item.serviceName, item.quantity, item.price);
      }
      
      // Update member points and totalSpend if customer is a member
      if (customerId) {
        const pointsToAdd = Math.floor(total / 10000); // 1 point per 10,000 rupiah
        const updateMember = db.prepare(`
          UPDATE members 
          SET points = points + ?, totalSpend = totalSpend + ?
          WHERE id = ?
        `);
        updateMember.run(pointsToAdd, total, customerId);
      }
    });
    
    createOrder({ id, customerName, customerId, items, total, status, date, paymentMethod });
    
    // Create notification for new order (admin only)
    const adminUsers = db.prepare("SELECT id FROM users WHERE role = 'admin'").all();
    adminUsers.forEach(admin => {
      createNotification(
        admin.id,
        'order',
        'Pesanan Baru',
        `Pesanan ${id} dari ${customerName} telah dibuat. Total: Rp ${total.toLocaleString('id-ID')}`,
        'high'
      );
    });
    
    // Create notification for customer when order is created
    // Find customer user account by matching member phone or name
    if (customerId) {
      const member = db.prepare('SELECT * FROM members WHERE id = ?').get(customerId);
      if (member) {
        // Find user account linked to this member (by phone or fullName)
        const customerUser = db.prepare(
          "SELECT id FROM users WHERE role = 'pelanggan' AND (phone = ? OR fullName = ?)"
        ).get(member.phone, member.name);
        
        if (customerUser) {
          createNotification(
            customerUser.id,
            'order',
            'Pesanan Berhasil Dibuat',
            `Pesanan ${id} Anda telah berhasil dibuat. Total: Rp ${total.toLocaleString('id-ID')}. Status: Menunggu diproses.`,
            'high'
          );
        }
      }
    }
    
    res.status(201).json({ message: 'Order created successfully', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status
app.patch('/api/orders/:id/status', authMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    
    // Get order details for notification
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const update = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
    const result = update.run(status, req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Create notification for status change
    const statusMessages = {
      'washing': 'Pesanan Anda sedang dalam proses pencucian',
      'ready': 'Pesanan Anda sudah siap diambil!',
      'picked_up': 'Pesanan Anda sudah selesai. Terima kasih!'
    };
    
    // Find customer user account to notify
    let customerUserId = null;
    
    // Method 1: Check if createdBy is a pelanggan user
    if (order.createdBy) {
      const creatorUser = db.prepare("SELECT id, role FROM users WHERE id = ?").get(order.createdBy);
      if (creatorUser && creatorUser.role === 'pelanggan') {
        customerUserId = creatorUser.id;
      }
    }
    
    // Method 2: If no customer user found via createdBy, try finding via member phone/name
    if (!customerUserId && order.customerId) {
      const member = db.prepare('SELECT * FROM members WHERE id = ?').get(order.customerId);
      if (member) {
        const customerUser = db.prepare(
          "SELECT id FROM users WHERE role = 'pelanggan' AND (phone = ? OR fullName = ?)"
        ).get(member.phone, member.name);
        if (customerUser) {
          customerUserId = customerUser.id;
        }
      }
    }
    
    // Send notification to customer if found
    if (customerUserId) {
      createNotification(
        customerUserId,
        'order',
        status === 'ready' ? 'Siap Diambil!' : 'Update Status Pesanan',
        `Pesanan ${req.params.id}: ${statusMessages[status] || 'Status telah diupdate'}`,
        status === 'ready' ? 'high' : 'medium'
      );
    }
    
    // Notify admins about status change
    if (status === 'picked_up') {
      const adminUsers = db.prepare("SELECT id FROM users WHERE role = 'admin'").all();
      adminUsers.forEach(admin => {
        createNotification(
          admin.id,
          'order',
          'Pesanan Selesai',
          `Pesanan ${req.params.id} dari ${order.customerName} telah diselesaikan`,
          'low'
        );
      });
    }
    
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update entire order
app.put('/api/orders/:id', authMiddleware, (req, res) => {
  try {
    const { customerName, customerId, items, total, status, date, paymentMethod } = req.body;
    
    const updateOrder = db.transaction((orderData) => {
      // Update order
      const update = db.prepare(`
        UPDATE orders 
        SET customerName = ?, customerId = ?, total = ?, status = ?, date = ?, paymentMethod = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      update.run(customerName, customerId, total, status, date, paymentMethod, req.params.id);
      
      // Delete old items
      const deleteItems = db.prepare('DELETE FROM order_items WHERE orderId = ?');
      deleteItems.run(req.params.id);
      
      // Insert new items
      const insertItem = db.prepare(`
        INSERT INTO order_items (orderId, serviceId, serviceName, quantity, price)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      for (const item of items) {
        insertItem.run(req.params.id, item.serviceId, item.serviceName, item.quantity, item.price);
      }
    });
    
    updateOrder({ customerName, customerId, items, total, status, date, paymentMethod });
    
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete order
app.delete('/api/orders/:id', authMiddleware, requireRole('admin'), (req, res) => {
  try {
    const deleteStmt = db.prepare('DELETE FROM orders WHERE id = ?');
    const result = deleteStmt.run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== DASHBOARD STATS ENDPOINTS ====================

// Get dashboard statistics
app.get('/api/stats/dashboard', authMiddleware, (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
    
    // Total revenue this month
    const revenue = db.prepare(`
      SELECT COALESCE(SUM(total), 0) as total 
      FROM orders 
      WHERE date >= ?
    `).get(firstDayOfMonth);
    
    // New customers this month
    const newMembers = db.prepare(`
      SELECT COUNT(*) as count 
      FROM members 
      WHERE joinDate >= ?
    `).get(firstDayOfMonth);
    
    // Active orders
    const activeOrders = db.prepare(`
      SELECT COUNT(*) as count 
      FROM orders 
      WHERE status IN ('pending', 'washing', 'ready')
    `).get();
    
    // Low stock items
    const lowStock = db.prepare(`
      SELECT COUNT(*) as count 
      FROM inventory 
      WHERE stock < minStock
    `).get();
    
    // Weekly revenue for chart
    const weeklyRevenue = db.prepare(`
      SELECT 
        strftime('%w', date) as dayOfWeek,
        SUM(total) as total
      FROM orders
      WHERE date >= date('now', '-7 days')
      GROUP BY dayOfWeek
      ORDER BY date
    `).all();
    
    res.json({
      revenue: revenue.total,
      newMembers: newMembers.count,
      activeOrders: activeOrders.count,
      lowStock: lowStock.count,
      weeklyRevenue
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get revenue by date range
app.get('/api/stats/revenue', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = db.prepare(`
      SELECT date, SUM(total) as total
      FROM orders
      WHERE date BETWEEN ? AND ?
      GROUP BY date
      ORDER BY date
    `);
    const data = query.all(startDate, endDate);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api/health`);
});

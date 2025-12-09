# 🧪 End-to-End Testing Guide

## System Overview

**2 User Roles:**
1. **Admin** (Pemilik Toko) - Full access
2. **Pelanggan** (Customer) - Limited access (own orders only)

---

## 🔐 Authentication Testing

### Test 1: Admin Login
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies-admin.txt

# Expected Response:
{
  "message": "Login successful",
  "user": {
    "id": "U-ADMIN-001",
    "username": "admin",
    "role": "admin",
    "fullName": "Administrator"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Test 2: Pelanggan Login
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testing","password":"pelanggan123"}' \
  -c cookies-pelanggan.txt

# Expected Response:
{
  "message": "Login successful",
  "user": {
    "id": "U-PELANGGAN-001",
    "username": "testing",
    "role": "pelanggan",
    "fullName": "Software Testing"
  },
  "token": "..."
}
```

### Test 3: Get Current User (Admin)
```bash
curl http://localhost:3002/api/auth/me \
  -b cookies-admin.txt

# Expected: Admin user details
```

### Test 4: Get Current User (Pelanggan)
```bash
curl http://localhost:3002/api/auth/me \
  -b cookies-pelanggan.txt

# Expected: Pelanggan user details
```

### Test 5: Invalid Login
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"wrong"}'

# Expected: 401 Unauthorized
{
  "error": "Invalid credentials"
}
```

---

## 📋 Services API Testing

### Test 6: Get All Services (Admin)
```bash
curl http://localhost:3002/api/services \
  -b cookies-admin.txt

# Expected: Array of 10 services
# Status: 200 OK
```

### Test 7: Get All Services (Pelanggan)
```bash
curl http://localhost:3002/api/services \
  -b cookies-pelanggan.txt

# Expected: Array of 10 services
# Status: 200 OK
# Note: Pelanggan can view services
```

### Test 8: Create Service (Admin Only)
```bash
curl -X POST http://localhost:3002/api/services \
  -H "Content-Type: application/json" \
  -b cookies-admin.txt \
  -d '{
    "id": "SV-TEST-001",
    "name": "Test Service",
    "price": 5000,
    "unit": "kg",
    "category": "kiloan",
    "icon": "test",
    "description": "Test description"
  }'

# Expected: 201 Created
{
  "message": "Service created successfully",
  "id": "SV-TEST-001"
}
```

### Test 9: Create Service (Pelanggan - Should Fail)
```bash
curl -X POST http://localhost:3002/api/services \
  -H "Content-Type: application/json" \
  -b cookies-pelanggan.txt \
  -d '{
    "id": "SV-TEST-002",
    "name": "Unauthorized Service",
    "price": 5000,
    "unit": "kg",
    "category": "kiloan"
  }'

# Expected: 403 Forbidden
{
  "error": "Forbidden - Insufficient permissions"
}
```

### Test 10: Delete Service (Admin Only)
```bash
curl -X DELETE http://localhost:3002/api/services/SV-TEST-001 \
  -b cookies-admin.txt

# Expected: 200 OK
{
  "message": "Service deleted successfully"
}
```

---

## 📦 Inventory API Testing

### Test 11: Get All Inventory (Admin)
```bash
curl http://localhost:3002/api/inventory \
  -b cookies-admin.txt

# Expected: Empty array [] (no initial inventory)
# Status: 200 OK
```

### Test 12: Create Inventory Item (Admin Only)
```bash
curl -X POST http://localhost:3002/api/inventory \
  -H "Content-Type: application/json" \
  -b cookies-admin.txt \
  -d '{
    "id": "INV-001",
    "code": "DET-001",
    "name": "Detergen",
    "stock": 100,
    "unit": "kg",
    "minStock": 10,
    "price": 50000,
    "category": "Bahan Cuci",
    "supplier": "PT. Supplier"
  }'

# Expected: 201 Created
```

### Test 13: Update Inventory Stock (Admin Only)
```bash
curl -X PATCH http://localhost:3002/api/inventory/INV-001/stock \
  -H "Content-Type: application/json" \
  -b cookies-admin.txt \
  -d '{
    "quantity": 10,
    "operation": "subtract"
  }'

# Expected: 200 OK
{
  "message": "Stock updated successfully",
  "newStock": 90
}
```

### Test 14: Get Low Stock Items (Admin)
```bash
curl http://localhost:3002/api/inventory/low-stock \
  -b cookies-admin.txt

# Expected: Array of items where stock <= minStock
```

---

## 👥 Members API Testing

### Test 15: Get All Members (Admin)
```bash
curl http://localhost:3002/api/members \
  -b cookies-admin.txt

# Expected: Array with 1 member (Software Testing)
```

### Test 16: Create Member (Admin/Pelanggan can both create)
```bash
curl -X POST http://localhost:3002/api/members \
  -H "Content-Type: application/json" \
  -b cookies-admin.txt \
  -d '{
    "id": "M-TEST-002",
    "name": "Test Customer",
    "phone": "081234567891",
    "joinDate": "2025-12-03",
    "expiryDate": "2026-12-03",
    "points": 0,
    "totalSpend": 0
  }'

# Expected: 201 Created
```

### Test 17: Update Member Points (Admin/Pelanggan)
```bash
curl -X PATCH http://localhost:3002/api/members/M-TEST-001/points \
  -H "Content-Type: application/json" \
  -b cookies-admin.txt \
  -d '{"points": 50}'

# Expected: 200 OK
{
  "message": "Points updated successfully",
  "newPoints": 50
}
```

---

## 🛒 Orders API Testing

### Test 18: Create Order (Admin)
```bash
curl -X POST http://localhost:3002/api/orders \
  -H "Content-Type: application/json" \
  -b cookies-admin.txt \
  -d '{
    "id": "ORD-001",
    "customerName": "Test Customer",
    "customerId": "M-TEST-001",
    "items": [
      {
        "serviceId": "SV-001",
        "serviceName": "Cuci Komplit",
        "quantity": 5,
        "price": 7000
      }
    ],
    "total": 35000,
    "status": "pending",
    "date": "2025-12-03",
    "paymentMethod": "tunai"
  }'

# Expected: 201 Created
```

### Test 19: Get All Orders (Admin - sees all)
```bash
curl http://localhost:3002/api/orders \
  -b cookies-admin.txt

# Expected: Array of ALL orders
```

### Test 20: Get Orders (Pelanggan - sees own only)
```bash
curl http://localhost:3002/api/orders \
  -b cookies-pelanggan.txt

# Expected: Array of orders where customerId = U-PELANGGAN-001
# Note: Only shows orders belonging to logged-in pelanggan
```

### Test 21: Get Order by ID (Admin)
```bash
curl http://localhost:3002/api/orders/ORD-001 \
  -b cookies-admin.txt

# Expected: Full order details with items
```

### Test 22: Update Order Status (Admin/Pelanggan)
```bash
curl -X PATCH http://localhost:3002/api/orders/ORD-001/status \
  -H "Content-Type: application/json" \
  -b cookies-admin.txt \
  -d '{"status": "washing"}'

# Expected: 200 OK
{
  "message": "Order status updated successfully"
}
```

### Test 23: Delete Order (Admin Only)
```bash
curl -X DELETE http://localhost:3002/api/orders/ORD-001 \
  -b cookies-admin.txt

# Expected: 200 OK
{
  "message": "Order deleted successfully"
}
```

### Test 24: Delete Order (Pelanggan - Should Fail)
```bash
curl -X DELETE http://localhost:3002/api/orders/ORD-001 \
  -b cookies-pelanggan.txt

# Expected: 403 Forbidden
```

---

## 📊 Statistics API Testing

### Test 25: Get Dashboard Stats (Admin)
```bash
curl http://localhost:3002/api/stats/dashboard \
  -b cookies-admin.txt

# Expected: Dashboard statistics
{
  "totalRevenue": 0,
  "activeOrders": 0,
  "newMembers": 1,
  "lowStock": 0
}
```

### Test 26: Get Revenue Stats (Admin)
```bash
curl "http://localhost:3002/api/stats/revenue?startDate=2025-12-01&endDate=2025-12-31" \
  -b cookies-admin.txt

# Expected: Revenue breakdown by date
```

---

## 🚫 Unauthorized Access Testing

### Test 27: Access Protected Endpoint Without Login
```bash
curl http://localhost:3002/api/services

# Expected: 401 Unauthorized
{
  "error": "Unauthorized - No token provided"
}
```

### Test 28: Access Admin Endpoint as Pelanggan
```bash
curl -X DELETE http://localhost:3002/api/services/SV-001 \
  -b cookies-pelanggan.txt

# Expected: 403 Forbidden
{
  "error": "Forbidden - Insufficient permissions"
}
```

---

## ✅ Frontend Testing Checklist

### Login Flow
- [ ] Navigate to http://localhost:3000
- [ ] Redirects to /login automatically
- [ ] Login with admin/admin123
- [ ] Redirects to dashboard
- [ ] User info shows in header
- [ ] Logout button works
- [ ] Logout redirects to /login

### Admin Dashboard
- [ ] Dashboard shows statistics
- [ ] All 5 views accessible (Dashboard, POS, Inventory, Orders, Customers)
- [ ] Can create orders in POS
- [ ] Can add inventory items
- [ ] Can view all orders
- [ ] Can update order status
- [ ] Can delete records

### Pelanggan Dashboard
- [ ] Login with testing/pelanggan123
- [ ] Dashboard shows limited view
- [ ] Can view services
- [ ] Can view own orders only
- [ ] Cannot access inventory management
- [ ] Cannot delete orders
- [ ] Cannot see other customers' orders

---

## 🐛 Error Scenarios

### Test 29: Expired Token
```bash
# Wait 24+ hours or manually expire token
curl http://localhost:3002/api/services \
  -b expired-cookies.txt

# Expected: 401 Unauthorized
{
  "error": "Token expired"
}
```

### Test 30: Invalid Token
```bash
curl http://localhost:3002/api/services \
  -H "Cookie: token=invalid-token-here"

# Expected: 401 Unauthorized
{
  "error": "Invalid token"
}
```

---

## 📝 Test Results Summary

| Test # | Endpoint | Role | Expected Result | Status |
|--------|----------|------|-----------------|--------|
| 1 | POST /auth/login | Admin | 200 OK | ✅ |
| 2 | POST /auth/login | Pelanggan | 200 OK | ✅ |
| 3-4 | GET /auth/me | Both | 200 OK | ✅ |
| 5 | POST /auth/login | Invalid | 401 | ✅ |
| 6-7 | GET /services | Both | 200 OK | ✅ |
| 8 | POST /services | Admin | 201 | ✅ |
| 9 | POST /services | Pelanggan | 403 | ✅ |
| 10 | DELETE /services | Admin | 200 | ✅ |
| 11-14 | Inventory | Admin | Various | ✅ |
| 15-17 | Members | Both | Various | ✅ |
| 18-24 | Orders | Various | Various | ✅ |
| 25-26 | Stats | Admin | 200 OK | ✅ |
| 27-28 | Unauthorized | N/A | 401/403 | ✅ |
| 29-30 | Token Errors | N/A | 401 | ✅ |

---

## 🎯 Success Criteria

All tests pass when:

✅ **Authentication:**
- Admin can login and access all features
- Pelanggan can login with limited access
- Invalid credentials rejected
- Token validation works

✅ **Authorization:**
- Admin has full CRUD access
- Pelanggan has read-only + own orders access
- Role restrictions enforced (403 errors)
- Unauthorized access blocked (401 errors)

✅ **Data Isolation:**
- Pelanggan only sees own orders
- Admin sees all data
- No cross-customer data leakage

✅ **API Functionality:**
- All CRUD operations work for Admin
- Services: Create, Read, Update, Delete
- Inventory: Full management
- Orders: Full tracking
- Members: Full management
- Statistics: Accurate reporting

✅ **Frontend Integration:**
- Login page functional
- Protected routes work
- User info displayed correctly
- Role-based UI rendering
- Logout functional

---

## 🔧 Debugging Tips

### Backend Logs
```bash
# View server logs
cd backend
npm start

# Check for errors in console output
```

### Database Inspection
```bash
# Open SQLite database
sqlite3 backend/laundry.db

# Check users table
SELECT * FROM users;

# Check orders table
SELECT * FROM orders;

# Check activity logs
SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 10;
```

### Common Issues

**Issue:** 401 Unauthorized on all requests
- **Solution:** Verify token in cookies, re-login

**Issue:** 403 Forbidden on admin endpoints
- **Solution:** Check user role in JWT token

**Issue:** Pelanggan sees all orders
- **Solution:** Verify backend filtering logic in /api/orders

**Issue:** Frontend not redirecting
- **Solution:** Check react-router-dom installation

---

## 📞 Support

If tests fail:
1. Check backend logs for errors
2. Verify database schema (users table has 2 roles)
3. Test authentication endpoints first
4. Verify CORS settings match frontend URL
5. Check JWT secret is consistent

---

**All 30 tests should pass for production deployment!** ✅

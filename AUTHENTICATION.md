# 🔐 Authentication & User Management Guide

## Default Credentials

### Default Login Credentials

**Admin Account (Pemilik Toko)**
- **Username:** `admin`
- **Password:** `admin123`
- **Role:** Admin (Full Access)

**Pelanggan Account (Test Customer)**
- **Username:** `testing`
- **Password:** `pelanggan123`
- **Role:** Pelanggan (Customer Access)

⚠️ **IMPORTANT:** Change default passwords immediately after first login!

---

## User Roles & Permissions

### 1. Admin (Pemilik Toko)
Full system access - Pemilik toko yang mengelola seluruh operasional:
- ✅ All CRUD operations (Create, Read, Update, Delete)
- ✅ Manage services (layanan laundry)
- ✅ Manage inventory (stok barang)
- ✅ Manage orders (pesanan)
- ✅ Manage customers/members
- ✅ View all statistics and reports
- ✅ Delete any records
- ✅ System configuration

### 2. Pelanggan (Customer)
Limited customer access - Pelanggan yang memesan layanan:
- ✅ View own orders only
- ✅ View available services
- ✅ Create new orders (via POS or self-service)
- ✅ View order status
- ✅ View own profile & points
- ❌ Cannot view other customers' data
- ❌ Cannot access admin features
- ❌ Cannot delete or modify inventory

---

## API Authentication Flow

### 1. Login Request
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "U-ADMIN-001",
    "username": "admin",
    "email": "admin@laundry.com",
    "role": "admin",
    "fullName": "Administrator"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. JWT Token Management
- Token stored in **HTTP-only cookie** (secure)
- Token also returned in response for mobile apps
- Expires in **24 hours**
- Auto-refresh on API calls

### 3. Protected API Calls
All subsequent API calls automatically include credentials:
```javascript
fetch('http://localhost:3002/api/services', {
  credentials: 'include' // Includes auth cookie
})
```

### 4. Logout Request
```http
POST /api/auth/logout
```

---

## Frontend Integration

### 1. Protected Routes
```typescript
// App.tsx automatically protects all routes
<ProtectedRoute>
  <MainApp />
</ProtectedRoute>
```

### 2. Check Authentication Status
```typescript
import { authApi } from '@/api/api';

// Check if user is logged in
try {
  const user = await authApi.getCurrentUser();
  console.log('Logged in as:', user.fullName);
} catch (error) {
  // User not authenticated - redirect to login
}
```

### 3. Logout Function
```typescript
const handleLogout = async () => {
  await authApi.logout();
  localStorage.removeItem('user');
  window.location.href = '/login';
};
```

---

## Adding New Users (via Database)

⚠️ **Currently no UI for user management - use database directly**

### Method 1: Using Node.js Console
```javascript
import bcrypt from 'bcryptjs';
import db from './database.js';

const hashedPassword = bcrypt.hashSync('password123', 10);

db.prepare(`
  INSERT INTO users (id, username, email, password, role, fullName)
  VALUES (?, ?, ?, ?, ?, ?)
`).run(
  'U-KASIR-001',
  'kasir1',
  'kasir1@laundry.com',
  hashedPassword,
  'kasir',
  'Kasir 1'
);
```

### Method 2: SQL Direct
```sql
-- First, hash password using bcrypt (use online tool or Node.js)
-- Example: bcrypt hash of "password123" with salt 10

INSERT INTO users (id, username, email, password, role, fullName)
VALUES (
  'U-KASIR-001',
  'kasir1',
  'kasir1@laundry.com',
  '$2a$10$abcdefghijklmnopqrstuvwxyz123456789',  -- Replace with real hash
  'kasir',
  'Kasir 1'
);
```

---

## Security Features Implemented

### ✅ Password Hashing
- Uses **bcryptjs** with salt rounds: 10
- Passwords never stored in plain text
- Secure comparison using `bcrypt.compare()`

### ✅ JWT Authentication
- Token-based stateless authentication
- Signed with secret key
- Includes user ID, username, role
- Expires after 24 hours

### ✅ HTTP-Only Cookies
- JWT stored in HTTP-only cookie
- Cannot be accessed by JavaScript (XSS protection)
- Secure flag in production (HTTPS only)
- SameSite: lax (CSRF protection)

### ✅ CORS Configuration
- Whitelist specific origins only
- Credentials enabled for cookie sharing
- No wildcard (*) allowed

### ✅ Role-Based Access Control (RBAC)
- Middleware checks user role before API access
- Admin-only routes protected
- Unauthorized access returns 403 Forbidden

### ✅ Activity Logging
- All login/logout events logged
- Includes user ID, action, timestamp
- Audit trail for security monitoring

---

## Security Best Practices

### 🔒 Production Deployment Checklist

1. **Change Default Credentials**
   ```sql
   UPDATE users 
   SET password = '[NEW_HASHED_PASSWORD]'
   WHERE username = 'admin';
   ```

2. **Update JWT Secret**
   ```javascript
   // backend/middleware/auth.js or .env
   const JWT_SECRET = 'YOUR_RANDOM_256BIT_SECRET_KEY_HERE';
   ```

3. **Enable HTTPS**
   - Use SSL/TLS certificate
   - Update cookie secure flag to `true`

4. **Set Environment Variables**
   ```bash
   NODE_ENV=production
   JWT_SECRET=your-production-secret
   ALLOWED_ORIGINS=https://yourdomain.com
   ```

5. **Database Backup**
   - Regular automated backups
   - Encrypted storage
   - Test restore procedures

6. **Rate Limiting**
   - Add rate limiter to login endpoint
   - Prevent brute force attacks
   - Example: max 5 attempts per 15 minutes

7. **Input Validation**
   - Sanitize all user inputs
   - Use express-validator (already installed)
   - Prevent SQL injection

8. **HTTPS Headers**
   ```javascript
   app.use(helmet()); // Install helmet package
   ```

---

## Common Authentication Errors

### Error: "Unauthorized - No token provided"
**Solution:** User not logged in. Redirect to `/login`

### Error: "Token expired"
**Solution:** Session expired after 24 hours. Redirect to `/login`

### Error: "Invalid token"
**Solution:** Token corrupted or JWT secret changed. Clear cookies and redirect to `/login`

### Error: "Forbidden - Insufficient permissions"
**Solution:** User role doesn't have access to this endpoint. Check role-based permissions.

---

## Testing Authentication

### Test Login (cURL)
```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt
```

### Test Protected Endpoint
```bash
curl http://localhost:3002/api/services \
  -b cookies.txt
```

### Test Logout
```bash
curl -X POST http://localhost:3002/api/auth/logout \
  -b cookies.txt
```

---

## Future Enhancements

### Recommended Features to Add:

1. **User Management UI**
   - Admin panel to create/edit/delete users
   - Password reset functionality
   - Role assignment interface

2. **Multi-Factor Authentication (MFA)**
   - SMS/Email OTP
   - Authenticator app (TOTP)

3. **Session Management**
   - View active sessions
   - Force logout from all devices
   - Session timeout warnings

4. **Password Policies**
   - Minimum length requirements
   - Complexity rules
   - Password expiration
   - Password history

5. **Audit Logs UI**
   - View user activity logs
   - Filter by user/action/date
   - Export logs to CSV

6. **API Key Management**
   - Generate API keys for integrations
   - Rate limiting per API key
   - Key rotation

---

## Support & Contact

For authentication issues or security concerns:
- Check logs: `backend/laundry.db` (activity_logs table)
- Review JWT secret configuration
- Verify CORS settings match frontend URL
- Test with default admin credentials first

**Remember:** Security is an ongoing process. Keep dependencies updated and monitor for vulnerabilities!

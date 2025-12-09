# ✅ Production Deployment Checklist

## Pre-Deployment Verification

### ✅ Core Functionality
- [x] Backend server runs successfully on port 3002
- [x] Frontend runs successfully on port 3000
- [x] Database initialized with production data
- [x] Authentication system working (JWT + bcrypt)
- [x] All API endpoints protected (401 for unauthorized)
- [x] Role-based access control implemented
- [x] Login/logout functionality working
- [x] CORS configured for allowed origins
- [x] All 7 frontend views working ⭐
- [x] Notifications system implemented ⭐
- [x] Settings management with 5 tabs ⭐
- [x] No duplicate UI elements ⭐
- [x] All sidebar buttons functional ⭐

### ✅ Database Status
- [x] Users table created
- [x] Activity logs table created
- [x] 1 Admin user: admin/admin123
- [x] 10 Production services loaded
- [x] 1 Test member: Software Testing
- [x] 0 Initial orders (clean slate)
- [x] Indexes created for performance
- [x] Foreign keys enabled

### ✅ Security Features
- [x] Password hashing with bcryptjs (salt: 10)
- [x] JWT tokens with 24h expiration
- [x] HTTP-only cookies (XSS protection)
- [x] CORS whitelist (no wildcards)
- [x] Protected API routes
- [x] Role-based middleware
- [x] Activity logging
- [x] Automatic token validation

### ✅ Documentation
- [x] README.md updated with auth instructions
- [x] AUTHENTICATION.md complete guide created
- [x] CHANGELOG.md version 2.0.0 documented
- [x] API documentation includes auth requirements
- [x] Quick start guide available
- [x] Migration guide for v1 to v2
- [x] EVALUATION.md comprehensive system assessment ⭐
- [x] COMPLETE_REPORT.md final completion report ⭐
- [x] All 13 documentation files complete ⭐

### ✅ Code Quality
- [x] TypeScript compilation successful
- [x] No critical runtime errors
- [x] API client includes credentials
- [x] Error handling implemented
- [x] Console logging for debugging

---

## 🚀 Production Deployment Steps

### 1. Server Setup

#### Install Node.js
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should be v18+
npm --version
```

#### Install Process Manager (PM2)
```bash
npm install -g pm2
```

### 2. Deploy Backend

```bash
# Navigate to backend directory
cd backend

# Install production dependencies
npm install --production

# Set environment variables
export NODE_ENV=production
export JWT_SECRET="your-super-secret-256-bit-key-here"
export PORT=3002

# Start with PM2
pm2 start server.js --name laundry-api

# Save PM2 configuration
pm2 save
pm2 startup
```

### 3. Deploy Frontend

#### Build for Production
```bash
# From project root
npm install
npm run build

# Output will be in 'dist' folder
```

#### Serve with nginx
```bash
sudo apt install nginx

# Create nginx configuration
sudo nano /etc/nginx/sites-available/laundry
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/laundry/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/laundry /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is configured automatically
```

### 5. Database Backup

```bash
# Create backup script
nano backup-db.sh
```

**Backup Script:**
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/laundry"
DB_PATH="/path/to/backend/laundry.db"

mkdir -p $BACKUP_DIR
cp $DB_PATH $BACKUP_DIR/laundry_$DATE.db
find $BACKUP_DIR -name "laundry_*.db" -mtime +7 -delete
```

**Add to crontab:**
```bash
chmod +x backup-db.sh
crontab -e

# Add this line (backup daily at 2 AM)
0 2 * * * /path/to/backup-db.sh
```

### 6. Environment Variables

Create `.env` file in backend directory:
```env
NODE_ENV=production
JWT_SECRET=your-random-256-bit-secret-key
PORT=3002
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Update `backend/middleware/auth.js`:
```javascript
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
```

Update `backend/server.js`:
```javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
```

### 7. Change Default Password

**IMPORTANT:** Change admin password immediately!

```bash
cd backend
node
```

```javascript
const bcrypt = require('bcryptjs');
const db = require('./database.js').default;

const newPassword = 'your-strong-password-here';
const hashedPassword = bcrypt.hashSync(newPassword, 10);

db.prepare('UPDATE users SET password = ? WHERE username = ?')
  .run(hashedPassword, 'admin');

console.log('Password changed successfully!');
```

### 8. Security Hardening

#### Firewall Configuration
```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443

# Block direct access to backend port
sudo ufw deny 3002

sudo ufw enable
```

#### Rate Limiting (Add to backend)
```bash
npm install express-rate-limit
```

**In server.js:**
```javascript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  // ... login logic
});
```

### 9. Monitoring & Logs

#### View PM2 Logs
```bash
pm2 logs laundry-api

# Monitor real-time
pm2 monit
```

#### Setup Log Rotation
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 10. Health Check

```bash
# Test backend
curl http://localhost:3002/api/health

# Test authentication
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

---

## 🔍 Post-Deployment Verification

### Checklist
- [ ] Frontend accessible at https://yourdomain.com
- [ ] Backend API responding at https://yourdomain.com/api
- [ ] Login page working (redirect from root)
- [ ] Admin can login successfully
- [ ] Dashboard loads with data
- [ ] All 5 main views working (Dashboard, POS, Inventory, Orders, Customers)
- [ ] API calls include credentials
- [ ] Logout working properly
- [ ] 401 errors redirect to login
- [ ] HTTPS certificate valid
- [ ] Database backup cron job running
- [ ] PM2 process running
- [ ] Logs rotating properly

---

## 🚨 Troubleshooting

### Issue: 401 Unauthorized on all API calls
**Solution:**
- Check JWT_SECRET is set correctly
- Verify CORS origin matches frontend domain
- Check cookie settings (secure: true for HTTPS)

### Issue: Login successful but redirects to login again
**Solution:**
- Check browser cookies (HTTP-only)
- Verify credentials: 'include' in API calls
- Check CORS credentials: true

### Issue: Database locked error
**Solution:**
```bash
pm2 stop laundry-api
# Wait 5 seconds
pm2 start laundry-api
```

### Issue: High memory usage
**Solution:**
```bash
pm2 restart laundry-api
pm2 set pm2-logrotate:max_size 5M
```

---

## 📊 Performance Optimization

### 1. Enable Compression
```bash
npm install compression
```

```javascript
import compression from 'compression';
app.use(compression());
```

### 2. Cache Static Assets (nginx)
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Database Optimization
```javascript
// Run VACUUM monthly
db.exec('VACUUM');

// Analyze query performance
db.exec('ANALYZE');
```

---

## 🎯 Success Criteria

Your deployment is successful when:

1. ✅ Users can login with admin credentials
2. ✅ All API endpoints return data (not 401/403)
3. ✅ Dashboard shows real-time statistics
4. ✅ POS can create orders
5. ✅ Inventory management working
6. ✅ Orders can be tracked and updated
7. ✅ Customers can be added/edited
8. ✅ Logout redirects to login page
9. ✅ HTTPS certificate valid (green lock)
10. ✅ Database backups running daily

---

## 📞 Support

If you encounter issues:

1. Check PM2 logs: `pm2 logs laundry-api`
2. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify database: `sqlite3 backend/laundry.db "SELECT * FROM users;"`
4. Test API health: `curl http://localhost:3002/api/health`
5. Check JWT secret: Verify it's set in environment

---

## 🎉 Congratulations!

Your production-ready ERP Laundry system is now deployed!

**Next Steps:**
1. Change default admin password
2. Add more users (kasir, owner)
3. Customize services for your business
4. Add inventory items
5. Train staff on POS usage
6. Monitor activity logs

**Important Links:**
- Frontend: https://yourdomain.com
- API Docs: Check README.md
- Auth Guide: Check AUTHENTICATION.md
- Changelog: Check CHANGELOG.md

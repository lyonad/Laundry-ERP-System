# Panduan Deployment Sistem ERP Laundry

## 📦 Deployment ke Production

### Opsi 1: Deploy ke VPS/Server Linux

#### 1. Persiapan Server
```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 untuk process management
sudo npm install -g pm2
```

#### 2. Upload Project ke Server
```bash
# Gunakan Git, SCP, atau FTP untuk upload project
git clone <repository-url>
cd "Sistem ERP Laundry"
```

#### 3. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

#### 4. Build Frontend
```bash
npm run build
```

#### 5. Setup PM2 untuk Backend
```bash
# Buat file ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'laundry-backend',
    script: './backend/server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    }
  }]
}
EOF

# Start dengan PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 6. Setup Nginx sebagai Reverse Proxy
```bash
# Install Nginx
sudo apt install nginx -y

# Buat konfigurasi
sudo nano /etc/nginx/sites-available/laundry-erp

# Isi dengan:
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/Sistem ERP Laundry/dist;
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

# Enable site
sudo ln -s /etc/nginx/sites-available/laundry-erp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 7. Setup SSL dengan Let's Encrypt (Opsional)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

---

### Opsi 2: Deploy ke Heroku

#### 1. Persiapan
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login
```

#### 2. Buat Procfile
```bash
echo "web: cd backend && npm start" > Procfile
```

#### 3. Deploy
```bash
heroku create laundry-erp
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

---

### Opsi 3: Deploy ke Vercel (Frontend) + Railway (Backend)

#### Frontend ke Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Backend ke Railway
1. Sign up di railway.app
2. Create new project
3. Connect GitHub repository
4. Deploy backend folder
5. Add domain

---

### Opsi 4: Docker Deployment

#### 1. Buat Dockerfile untuk Backend
```dockerfile
# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3002
CMD ["npm", "start"]
```

#### 2. Buat Dockerfile untuk Frontend
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. Buat docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=production
    volumes:
      - ./backend/laundry.db:/app/laundry.db
    restart: unless-stopped

  frontend:
    build:
      context: .
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

#### 4. Deploy dengan Docker
```bash
docker-compose up -d
```

---

## 🔐 Security Checklist untuk Production

- [ ] Ganti port default jika diperlukan
- [ ] Setup firewall (UFW/iptables)
- [ ] Aktifkan HTTPS/SSL
- [ ] Gunakan environment variables untuk sensitive data
- [ ] Setup backup database otomatis
- [ ] Implement rate limiting
- [ ] Add authentication & authorization
- [ ] Setup monitoring & logging
- [ ] Regular security updates
- [ ] Backup strategy

---

## 📊 Monitoring & Maintenance

### Backup Database
```bash
# Backup otomatis setiap hari
crontab -e

# Tambahkan:
0 2 * * * cp /path/to/backend/laundry.db /path/to/backups/laundry-$(date +\%Y\%m\%d).db
```

### Monitor dengan PM2
```bash
pm2 monit
pm2 logs laundry-backend
pm2 restart laundry-backend
```

---

## 🚀 Performance Optimization

1. **Enable Gzip Compression** di Nginx
2. **Setup CDN** untuk static assets
3. **Database Indexing** untuk query cepat
4. **Caching** untuk API responses
5. **Load Balancing** untuk high traffic

---

## 📞 Troubleshooting

### Backend tidak bisa connect
- Check firewall: `sudo ufw status`
- Check port: `netstat -tulpn | grep 3002`
- Check logs: `pm2 logs`

### Database error
- Check permissions: `ls -la backend/laundry.db`
- Check path di server.js

### Frontend tidak load
- Check build: `npm run build`
- Check Nginx config: `sudo nginx -t`
- Check logs: `sudo tail -f /var/log/nginx/error.log`

---

**Good luck with deployment! 🚀**

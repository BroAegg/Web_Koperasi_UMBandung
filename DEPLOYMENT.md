# 🚀 Deployment Guide

> Complete deployment guide for Web Koperasi UM Bandung to production

---

## 📋 Pre-Deployment Checklist

### ✅ Code Quality

```bash
# Run all checks
npm run lint          # ✅ No linting errors
npm run type-check   # ✅ No TypeScript errors
npm run test         # ✅ All tests passing
npm run build        # ✅ Build succeeds
```

### ✅ Environment Variables

Ensure `.env.production` has:

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname?schema=public"

# Authentication
JWT_SECRET="your-64-char-random-string"
JWT_EXPIRES_IN="7d"

# Application
NEXT_PUBLIC_APP_URL="https://koperasi.umb.ac.id"
NODE_ENV="production"

# Optional
SENTRY_DSN="your-sentry-dsn"
ANALYTICS_ID="your-ga-id"
```

### ✅ Database

```bash
# Run migrations on production DB
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# (Optional) Seed initial data
npx prisma db seed
```

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Best for**: Quick deployment, automatic HTTPS, serverless

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login

```bash
vercel login
```

#### 3. Configure Project

```bash
vercel
```

Follow prompts:

- Project name: `web-koperasi-umb`
- Framework: `Next.js`
- Build command: `npm run build`
- Output directory: `.next`

#### 4. Set Environment Variables

```bash
# Via CLI
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add NEXT_PUBLIC_APP_URL production

# Or via Vercel Dashboard
# Settings → Environment Variables
```

#### 5. Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### 6. Configure Custom Domain

Vercel Dashboard → Domains → Add Domain → `koperasi.umb.ac.id`

**DNS Configuration:**

```
Type: CNAME
Name: koperasi
Value: cname.vercel-dns.com
```

#### PostgreSQL on Vercel

Use **Vercel Postgres** or external provider:

```bash
# Install Vercel Postgres
vercel link
vercel storage create postgres
```

---

### Option 2: VPS (Ubuntu Server)

**Best for**: Full control, custom requirements

#### 1. Server Requirements

- Ubuntu 22.04 LTS
- Node.js 18.x or higher
- PostgreSQL 14+
- Nginx
- PM2 (process manager)
- SSL certificate (Let's Encrypt)

#### 2. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

#### 3. Create Database

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE web_koperasi_umb;
CREATE USER koperasi_user WITH ENCRYPTED PASSWORD 'your-strong-password';
GRANT ALL PRIVILEGES ON DATABASE web_koperasi_umb TO koperasi_user;
\q
```

#### 4. Clone & Setup Project

```bash
# Create app directory
sudo mkdir -p /var/www/koperasi
sudo chown -R $USER:$USER /var/www/koperasi
cd /var/www/koperasi

# Clone repository
git clone https://github.com/BroAegg/Web_Koperasi_UMBandung.git .

# Install dependencies
npm ci --production

# Create .env
nano .env.production
# Paste environment variables (see above)

# Run migrations
npx prisma migrate deploy
npx prisma generate

# Build application
npm run build
```

#### 5. Configure PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'web-koperasi-umb',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/koperasi',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/koperasi/error.log',
      out_file: '/var/log/koperasi/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
```

Start with PM2:

```bash
# Create log directory
sudo mkdir -p /var/log/koperasi
sudo chown -R $USER:$USER /var/log/koperasi

# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup systemd
# Run the command it outputs

# Check status
pm2 status
pm2 logs web-koperasi-umb
```

#### 6. Configure Nginx

Create `/etc/nginx/sites-available/koperasi`:

```nginx
server {
    listen 80;
    server_name koperasi.umb.ac.id;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name koperasi.umb.ac.id;

    # SSL certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/koperasi.umb.ac.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/koperasi.umb.ac.id/privkey.pem;

    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Logging
    access_log /var/log/nginx/koperasi_access.log;
    error_log /var/log/nginx/koperasi_error.log;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public, immutable";
    }

    # Public files
    location /public {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 60m;
        add_header Cache-Control "public";
    }
}
```

Enable site and restart Nginx:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/koperasi /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### 7. Setup SSL (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d koperasi.umb.ac.id

# Test auto-renewal
sudo certbot renew --dry-run
```

#### 8. Setup Firewall

```bash
# Allow OpenSSH, HTTP, HTTPS
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

---

### Option 3: Docker Deployment

**Best for**: Containerized deployment, consistency

#### 1. Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Set environment
ENV NODE_ENV=production

# Copy necessary files
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["npm", "start"]
```

#### 2. Create docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: koperasi-app
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://koperasi:password@db:5432/web_koperasi_umb
      - JWT_SECRET=${JWT_SECRET}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
    depends_on:
      - db
    restart: unless-stopped
    networks:
      - koperasi-network

  db:
    image: postgres:14-alpine
    container_name: koperasi-db
    environment:
      - POSTGRES_DB=web_koperasi_umb
      - POSTGRES_USER=koperasi
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - koperasi-network

  nginx:
    image: nginx:alpine
    container_name: koperasi-nginx
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - koperasi-network

volumes:
  postgres-data:

networks:
  koperasi-network:
    driver: bridge
```

#### 3. Build & Deploy

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Run migrations
docker-compose exec app npx prisma migrate deploy

# Check status
docker-compose ps
```

---

## 📊 Monitoring & Maintenance

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs web-koperasi-umb --lines 100

# Restart application
pm2 restart web-koperasi-umb

# Reload (zero-downtime)
pm2 reload web-koperasi-umb
```

### Database Backups

```bash
# Create backup script
sudo nano /usr/local/bin/backup-koperasi-db

#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/koperasi"
mkdir -p $BACKUP_DIR

pg_dump -U koperasi_user web_koperasi_umb | gzip > \
  $BACKUP_DIR/koperasi_$TIMESTAMP.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "koperasi_*.sql.gz" -mtime +7 -delete

# Make executable
sudo chmod +x /usr/local/bin/backup-koperasi-db

# Add to crontab (daily at 2 AM)
sudo crontab -e
0 2 * * * /usr/local/bin/backup-koperasi-db
```

### Log Rotation

Create `/etc/logrotate.d/koperasi`:

```
/var/log/koperasi/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

---

## 🔐 Security Best Practices

### 1. Environment Variables

```bash
# Never commit .env files
echo ".env*" >> .gitignore

# Use strong JWT secret (64+ characters)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2. Database Security

```sql
-- Restrict database user permissions
REVOKE ALL ON DATABASE web_koperasi_umb FROM koperasi_user;
GRANT CONNECT ON DATABASE web_koperasi_umb TO koperasi_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO koperasi_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO koperasi_user;
```

### 3. Rate Limiting

Already implemented in tRPC middleware. For additional protection:

```nginx
# In Nginx config
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api {
    limit_req zone=api burst=20 nodelay;
    # ... rest of config
}
```

### 4. Regular Updates

```bash
# Update dependencies (check for security patches)
npm audit
npm audit fix

# Update system packages
sudo apt update && sudo apt upgrade -y

# Update PM2
pm2 update
```

---

## 🚨 Troubleshooting

### Build Fails

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -U koperasi_user -d web_koperasi_umb -h localhost

# Check DATABASE_URL format
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public

# Verify Prisma Client
npx prisma generate
npx prisma db push --preview-feature
```

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs web-koperasi-umb --err

# Check port availability
sudo lsof -i :3000

# Check environment variables
pm2 env 0
```

### High Memory Usage

```bash
# Check memory
free -h

# Restart PM2
pm2 restart web-koperasi-umb

# Optimize PM2 instances
pm2 delete web-koperasi-umb
pm2 start ecosystem.config.js --instances 2
```

---

## 📈 Performance Optimization

### 1. Enable Caching

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizeCss: true,
  },
  compress: true,
  poweredByHeader: false,
}
```

### 2. CDN for Static Assets

Use Cloudflare or similar CDN for:

- Images (`/public/images`)
- Fonts (`/public/fonts`)
- Static assets (`/_next/static`)

### 3. Database Optimization

```sql
-- Create indexes for common queries
CREATE INDEX idx_products_category ON products(category_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_supplier ON products(supplier_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_transactions_date ON transactions(created_at DESC);

-- Analyze tables
ANALYZE products;
ANALYZE orders;
ANALYZE transactions;
```

---

## 📞 Support & Contact

- **Technical Issues**: Create GitHub issue
- **Emergency**: Email ti@umb.ac.id
- **Documentation**: See README.md

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Application loads correctly
- [ ] HTTPS is working
- [ ] Database migrations applied
- [ ] Authentication works
- [ ] All modules accessible
- [ ] Logs are being written
- [ ] Backups are scheduled
- [ ] Monitoring is active
- [ ] SSL certificate auto-renewal works

---

**Deployed successfully! 🚀✨**

_Last Updated: October 25, 2025_

# 🐘 PostgreSQL Setup Guide

## Step-by-Step Setup untuk Web Koperasi UMB

### Prerequisites

- ✅ pgAdmin 4 installed
- ✅ PostgreSQL server running

---

## 1. Create Database via pgAdmin

### Method 1: Using pgAdmin GUI (RECOMMENDED)

1. **Open pgAdmin 4**
2. **Connect to PostgreSQL Server**
   - Expand "Servers" in left panel
   - Right-click "PostgreSQL [version]" → Connect
   - Enter master password jika diminta

3. **Create Database**
   - Right-click "Databases" → Create → Database
   - **Database Name:** `web_koperasi_umb`
   - **Owner:** `postgres` (default)
   - **Encoding:** `UTF8`
   - Click "Save"

4. **Verify Database Created**
   - Database `web_koperasi_umb` should appear in left panel
   - Green icon = ready to use

### Method 2: Using SQL Query Tool

```sql
CREATE DATABASE web_koperasi_umb
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
```

---

## 2. Update Environment Variables

### Update `.env` file:

```bash
# Database (PostgreSQL)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/web_koperasi_umb?schema=public"

# Replace YOUR_PASSWORD with your PostgreSQL password
# Default is usually "postgres" or what you set during installation
```

### Common Connection String Formats:

```bash
# Local PostgreSQL (default port 5432)
DATABASE_URL="postgresql://postgres:password@localhost:5432/web_koperasi_umb?schema=public"

# Custom port
DATABASE_URL="postgresql://postgres:password@localhost:5433/web_koperasi_umb?schema=public"

# Remote server
DATABASE_URL="postgresql://username:password@hostname:5432/web_koperasi_umb?schema=public"
```

---

## 3. Test Connection

```bash
# Method 1: Using Prisma
npx prisma db pull

# If successful, you'll see:
# ✔ Introspected X models and wrote them into prisma/schema.prisma

# Method 2: Using psql (if installed)
psql -U postgres -d web_koperasi_umb

# Should connect and show:
# web_koperasi_umb=#
```

---

## 4. Run Migrations

```bash
# Generate and apply migration
npx prisma migrate dev --name init

# You should see:
# ✔ Generated Prisma Client
# ✔ Your database is now in sync with your schema
```

### What This Does:

1. Creates `prisma/migrations/` folder
2. Generates SQL migration file
3. Applies migration to database
4. Creates all 9 tables:
   - users
   - suppliers
   - categories
   - products
   - stock_movements
   - transactions
   - orders
   - order_items
   - activity_logs

---

## 5. Seed Database

```bash
# Run seed script
npx prisma db seed

# You should see:
# 🌱 Starting database seed...
# 👥 Creating users...
# ✅ Created 4 users
# 📦 Creating categories...
# ✅ Created 4 categories
# 🏢 Creating suppliers...
# ✅ Created 2 suppliers
# 🛍️ Creating products...
# ✅ Created 6 products
# 💰 Creating transactions...
# ✅ Created 5 transactions
# ✨ Seed completed successfully!
```

### Default Users Created:

| Username   | Password    | Role        |
| ---------- | ----------- | ----------- |
| developer  | password123 | DEVELOPER   |
| superadmin | password123 | SUPER_ADMIN |
| admin      | password123 | ADMIN       |
| kasir      | password123 | KASIR       |

**⚠️ IMPORTANT:** Change passwords in production!

---

## 6. Verify in pgAdmin

1. **Expand Database Tree:**

   ```
   Databases → web_koperasi_umb → Schemas → public → Tables
   ```

2. **Check Tables Created:**
   - Right-click any table → View/Edit Data → First 100 Rows
   - Should see seeded data

3. **Check Row Counts:**
   ```sql
   SELECT
     (SELECT COUNT(*) FROM users) as users,
     (SELECT COUNT(*) FROM categories) as categories,
     (SELECT COUNT(*) FROM suppliers) as suppliers,
     (SELECT COUNT(*) FROM products) as products,
     (SELECT COUNT(*) FROM transactions) as transactions;
   ```

---

## Troubleshooting

### Error: "password authentication failed"

**Solution:**

```bash
# Update .env with correct password
DATABASE_URL="postgresql://postgres:CORRECT_PASSWORD@localhost:5432/web_koperasi_umb?schema=public"
```

### Error: "database does not exist"

**Solution:**
Create database first in pgAdmin, then run migration.

### Error: "connection refused"

**Check:**

1. PostgreSQL server running? (Check Windows Services)
2. Correct port? (Default: 5432)
3. Firewall blocking?

### Error: "schema drift detected"

**Solution:**

```bash
# Reset and recreate
npx prisma migrate reset
# Then answer 'yes' to confirm
```

### Port Already in Use

**Find PostgreSQL Port:**

```sql
-- In pgAdmin Query Tool:
SHOW port;
```

---

## Quick Reference Commands

```bash
# Test connection
npx prisma db pull

# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (DEVELOPMENT ONLY!)
npx prisma migrate reset

# Seed database
npx prisma db seed

# Open Prisma Studio (GUI)
npx prisma studio
```

---

## Prisma Studio (Database GUI)

```bash
# Launch Prisma Studio
npx prisma studio

# Opens browser at: http://localhost:5555
# Visual interface to view/edit data
```

**Features:**

- View all tables
- Edit records
- Filter & search
- Export data
- Perfect for development!

---

## Next Steps After Setup

1. ✅ Database created and migrated
2. ✅ Seed data loaded
3. ✅ Test connection successful
4. → Start Phase 1.4: Authentication System
5. → Build login page
6. → Setup NextAuth.js v5

---

## Common PostgreSQL Commands

```sql
-- List all databases
SELECT datname FROM pg_database;

-- Check database size
SELECT pg_size_pretty(pg_database_size('web_koperasi_umb'));

-- List all tables
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check table row counts
SELECT
  schemaname,
  tablename,
  n_live_tup as row_count
FROM pg_stat_user_tables
ORDER BY n_live_tup DESC;

-- Export data (in pgAdmin Query Tool)
COPY users TO 'C:/backup/users.csv' DELIMITER ',' CSV HEADER;
```

---

_Setup Time: ~5 minutes_  
_Difficulty: Easy_ 🟢

Good luck! 🚀

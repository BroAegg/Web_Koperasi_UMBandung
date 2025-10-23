# 🗄️ Database Schema

## Overview

Web Koperasi UMB menggunakan **PostgreSQL** dengan **Prisma ORM** untuk type-safe database access dengan fokus pada performa dan skalabilitas.

## Core Principles

1. **snake_case for database**: Semua nama kolom dan tabel menggunakan `snake_case`
2. **camelCase in code**: TypeScript models menggunakan `camelCase` (auto-mapped by Prisma)
3. **Enums in schema**: Define all enums di Prisma schema, bukan hardcoded strings
4. **Proper migrations**: NEVER use `prisma db push` in production, always use migrations
5. **Indexes**: Add indexes untuk foreign keys dan frequently queried fields
6. **Decimal precision**: Semua monetary values menggunakan `@db.Decimal(15, 2)` untuk precision
7. **Soft deletes**: Gunakan `deleted_at` timestamp untuk soft delete records

## Schema Diagram

```
┌──────────┐
│   User   │──────────┐
└──────────┘          │
     │                │
     │ created_by     │
     ↓                ↓
┌─────────────┐  ┌────────────┐
│ Transaction │  │ ActivityLog│
└─────────────┘  └────────────┘
     │
     │ supplier_id
     ↓
┌──────────┐        ┌──────────┐
│ Supplier │────────│ Product  │
└──────────┘        └──────────┘
                         │
      ┌──────────────────┼──────────────┐
      │                  │              │
      ↓                  ↓              ↓
┌──────────┐       ┌──────────┐   ┌──────────┐
│ Category │       │  Stock   │   │OrderItem │
└──────────┘       │ Movement │   └──────────┘
                   └──────────┘        │
                                       ↓
                                  ┌────────┐
                                  │ Order  │
                                  └────────┘
```

## Tables

### 1. User

**Purpose**: Authentication, authorization, dan user management

| Field      | Type             | Description           | Index |
| ---------- | ---------------- | --------------------- | ----- |
| id         | String (CUID)    | Primary key           | ✓     |
| username   | String (unique)  | Login username        | ✓     |
| email      | String? (unique) | Email address         | ✓     |
| password   | String (hashed)  | Bcrypt hash           |       |
| full_name  | String           | Full name             |       |
| phone      | String?          | Phone number          |       |
| role       | Enum (Role)      | User role             | ✓     |
| is_active  | Boolean          | Account status        | ✓     |
| created_at | DateTime         | Creation timestamp    |       |
| updated_at | DateTime         | Last update timestamp |       |
| deleted_at | DateTime?        | Soft delete timestamp |       |

**Enums**:

```prisma
enum Role {
  DEVELOPER      // Full system access
  SUPER_ADMIN    // All permissions
  ADMIN          // Manage users, products, suppliers
  KASIR          // POS operations
  STAFF          // View-only access
  SUPPLIER       // Supplier portal access
}
```

**Indexes**:

- `username`, `email`, `role`, `is_active`

---

### 2. Supplier

**Purpose**: Data supplier untuk procurement

| Field          | Type          | Description           | Index |
| -------------- | ------------- | --------------------- | ----- |
| id             | String (CUID) | Primary key           | ✓     |
| business_name  | String        | Company name          | ✓     |
| contact_person | String        | Contact person name   |       |
| phone          | String        | Phone number          |       |
| email          | String?       | Email address         |       |
| address        | String?       | Full address          |       |
| is_active      | Boolean       | Supplier status       | ✓     |
| created_at     | DateTime      | Creation timestamp    |       |
| updated_at     | DateTime      | Last update timestamp |       |
| deleted_at     | DateTime?     | Soft delete timestamp |       |

**Indexes**:

- `business_name`, `is_active`

---

### 3. Category

**Purpose**: Product categorization

| Field       | Type          | Description           | Index |
| ----------- | ------------- | --------------------- | ----- |
| id          | String (CUID) | Primary key           | ✓     |
| name        | String        | Category name         | ✓     |
| description | String?       | Category description  |       |
| created_at  | DateTime      | Creation timestamp    |       |
| updated_at  | DateTime      | Last update timestamp |       |
| deleted_at  | DateTime?     | Soft delete timestamp |       |

**Indexes**:

- `name`

---

### 4. Product

**Purpose**: Master data produk untuk inventory dan POS

| Field          | Type          | Description             | Index |
| -------------- | ------------- | ----------------------- | ----- |
| id             | String (CUID) | Primary key             | ✓     |
| sku            | String        | Stock Keeping Unit      | ✓     |
| name           | String        | Product name            | ✓     |
| description    | String?       | Product description     |       |
| category_id    | String (FK)   | Reference to Category   | ✓     |
| supplier_id    | String (FK)   | Reference to Supplier   | ✓     |
| purchase_price | Decimal(15,2) | Harga beli              |       |
| selling_price  | Decimal(15,2) | Harga jual              |       |
| stock          | Int           | Current stock           | ✓     |
| min_stock      | Int           | Min stock alert (def:5) |       |
| image          | String?       | Base64 or URL           |       |
| is_active      | Boolean       | Product status (def:T)  | ✓     |
| created_at     | DateTime      | Creation timestamp      |       |
| updated_at     | DateTime      | Last update timestamp   |       |
| deleted_at     | DateTime?     | Soft delete timestamp   |       |

**Indexes**:

- `sku`, `name`, `category_id`, `supplier_id`, `is_active`, `stock`

---

### 5. StockMovement

**Purpose**: Tracking pergerakan stok (masuk/keluar/adjustment)

| Field      | Type                     | Description              | Index |
| ---------- | ------------------------ | ------------------------ | ----- |
| id         | String (CUID)            | Primary key              | ✓     |
| product_id | String (FK)              | Reference to Product     | ✓     |
| type       | Enum (StockMovementType) | IN/OUT/ADJUSTMENT/RETURN | ✓     |
| quantity   | Int                      | Quantity moved (+ or -)  |       |
| notes      | String?                  | Optional notes           |       |
| created_at | DateTime                 | Movement timestamp       | ✓     |
| created_by | String?                  | User who did movement    |       |

**Enums**:

```prisma
enum StockMovementType {
  IN         // Stock masuk (pembelian)
  OUT        // Stock keluar (penjualan)
  ADJUSTMENT // Koreksi stok (manual)
  RETURN     // Retur barang
}
```

**Indexes**:

- `product_id`, `type`, `created_at`

---

### 6. Transaction

**Purpose**: Semua transaksi keuangan (kas masuk/keluar)

| Field          | Type                       | Description                | Index |
| -------------- | -------------------------- | -------------------------- | ----- |
| id             | String (CUID)              | Primary key                | ✓     |
| type           | Enum (TransactionType)     | CASH_IN/CASH_OUT/etc       | ✓     |
| category       | Enum (TransactionCategory) | SALES/PURCHASE/etc         | ✓     |
| amount         | Decimal(15,2)              | Transaction amount         |       |
| payment_method | Enum (PaymentMethod)       | CASH/BANK_TRANSFER/EWALLET |       |
| description    | String                     | Transaction description    |       |
| notes          | String?                    | Additional notes           |       |
| supplier_id    | String? (FK)               | Reference to Supplier      | ✓     |
| reference_id   | String?                    | Link to Order/etc          |       |
| created_at     | DateTime                   | Transaction timestamp      | ✓     |
| updated_at     | DateTime                   | Last update timestamp      |       |
| deleted_at     | DateTime?                  | Soft delete timestamp      |       |
| created_by_id  | String (FK)                | Reference to User          | ✓     |

**Enums**:

```prisma
enum TransactionType {
  CASH_IN      // Pemasukan kas
  CASH_OUT     // Pengeluaran kas
  TRANSFER     // Transfer antar akun
  ADJUSTMENT   // Penyesuaian/koreksi
}

enum TransactionCategory {
  SALES                // Penjualan produk
  PURCHASE             // Pembelian dari supplier
  OPERATIONAL          // Biaya operasional (listrik, air, dll)
  MEMBER_DEPOSIT       // Simpanan anggota
  MEMBER_WITHDRAWAL    // Penarikan simpanan
  OTHER                // Lain-lain
}

enum PaymentMethod {
  CASH           // Tunai
  BANK_TRANSFER  // Transfer bank
  E_WALLET       // E-wallet (OVO, GoPay, dll)
  OTHER          // Metode lain
}
```

**Indexes**:

- `type`, `category`, `created_at`, `created_by_id`, `supplier_id`

---

### 7. Order

**Purpose**: POS transactions (penjualan di kasir)

| Field          | Type                 | Description                | Index |
| -------------- | -------------------- | -------------------------- | ----- |
| id             | String (CUID)        | Primary key                | ✓     |
| order_number   | String (unique)      | e.g., "ORD-20251024-001"   | ✓     |
| customer_name  | String?              | Optional customer name     |       |
| subtotal       | Decimal(15,2)        | Subtotal before disc/tax   |       |
| discount       | Decimal(15,2)        | Discount amount (def:0)    |       |
| tax            | Decimal(15,2)        | Tax amount (def:0)         |       |
| total          | Decimal(15,2)        | Final total                |       |
| payment_method | Enum (PaymentMethod) | Payment method             |       |
| payment_amount | Decimal(15,2)        | Amount paid by customer    |       |
| change_amount  | Decimal(15,2)        | Kembalian (def:0)          |       |
| status         | Enum (OrderStatus)   | Order status (def:PENDING) | ✓     |
| created_at     | DateTime             | Order timestamp            | ✓     |
| created_by     | String?              | Kasir/user ID              | ✓     |

**Enums**:

```prisma
enum OrderStatus {
  PENDING      // Belum selesai
  PROCESSING   // Sedang diproses
  COMPLETED    // Selesai
  CANCELLED    // Dibatalkan
}
```

**Indexes**:

- `order_number`, `status`, `created_at`, `created_by`

---

### 8. OrderItem

**Purpose**: Line items dalam Order (detail produk yang dibeli)

| Field      | Type          | Description               | Index |
| ---------- | ------------- | ------------------------- | ----- |
| id         | String (CUID) | Primary key               | ✓     |
| order_id   | String (FK)   | Reference to Order        | ✓     |
| product_id | String (FK)   | Reference to Product      | ✓     |
| quantity   | Int           | Quantity ordered          |       |
| price      | Decimal(15,2) | Price per unit (snapshot) |       |
| subtotal   | Decimal(15,2) | quantity × price          |       |

**Cascade Delete**: When Order deleted → OrderItems also deleted

**Indexes**:

- `order_id`, `product_id`

---

### 9. ActivityLog

**Purpose**: Audit trail untuk semua aktivitas penting

| Field       | Type          | Description                    | Index |
| ----------- | ------------- | ------------------------------ | ----- |
| id          | String (CUID) | Primary key                    | ✓     |
| user_id     | String (FK)   | Reference to User              | ✓     |
| role        | Enum (Role)   | User role saat aktivitas       |       |
| action      | String        | CREATE/UPDATE/DELETE/LOGIN/etc |       |
| module      | String        | FINANCIAL/INVENTORY/POS/etc    |       |
| description | String        | Detail aktivitas               |       |
| ip_address  | String?       | IP address user                |       |
| user_agent  | String?       | Browser/device info            |       |
| created_at  | DateTime      | Activity timestamp             | ✓     |

**Indexes**:

- `user_id`, `created_at`

---

## Migration Workflow

### Initial Setup

```bash
# 1. Install dependencies
npm install

# 2. Setup PostgreSQL database
# Create database: web_koperasi_umb

# 3. Configure .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/web_koperasi_umb?schema=public"

# 4. Create initial migration
npx prisma migrate dev --name init

# 5. Generate Prisma Client
npx prisma generate

# 6. Seed database
npx prisma db seed
```

### Making Schema Changes

```bash
# CORRECT ✅ - Always use migrations in development & production
npx prisma migrate dev --name add_new_field

# WRONG ❌ - NEVER use db push in production
npx prisma db push  # Skips migration history!
```

### Reset Database (Development Only!)

```bash
# Delete all data and reset to initial state
npx prisma migrate reset

# This will:
# 1. Drop database
# 2. Create database
# 3. Run all migrations
# 4. Run seed
```

---

## Seeding Data

### Default Users (Created by seed)

| Username   | Password    | Role        | Purpose                        |
| ---------- | ----------- | ----------- | ------------------------------ |
| developer  | password123 | DEVELOPER   | Full system access             |
| superadmin | password123 | SUPER_ADMIN | All administrative permissions |
| admin      | password123 | ADMIN       | Manage products & suppliers    |
| kasir      | password123 | KASIR       | POS operations                 |

**⚠️ IMPORTANT**: Change all default passwords in production!

### Sample Data Included

- **4 Categories**: Makanan, Minuman, Alat Tulis, Elektronik
- **2 Suppliers**: PT Sumber Rezeki, CV Jaya Abadi
- **6 Products**: Indomie, Biskuit Roma, Teh Botol, Aqua, Pulpen, Buku Tulis
- **5 Transactions**: Sample CASH_IN/CASH_OUT transactions

---

## Common Queries

### Get All Active Products with Category & Supplier

```typescript
const products = await prisma.product.findMany({
  where: { is_active: true, deleted_at: null },
  include: {
    category: true,
    supplier: true,
  },
  orderBy: { name: 'asc' },
})
```

### Get Low Stock Products

```typescript
const lowStockProducts = await prisma.product.findMany({
  where: {
    stock: { lte: prisma.product.fields.min_stock },
    is_active: true,
    deleted_at: null,
  },
  include: { category: true },
})
```

### Get Daily Sales Summary

```typescript
const today = new Date()
today.setHours(0, 0, 0, 0)

const dailySales = await prisma.transaction.aggregate({
  where: {
    type: 'CASH_IN',
    category: 'SALES',
    created_at: { gte: today },
    deleted_at: null,
  },
  _sum: { amount: true },
  _count: true,
})
```

### Get User Activity Logs (Last 30 Days)

```typescript
const logs = await prisma.activityLog.findMany({
  where: {
    user_id: userId,
    created_at: {
      gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  },
  orderBy: { created_at: 'desc' },
  take: 100,
})
```

### Create Order with Items (Transaction)

```typescript
const order = await prisma.$transaction(async (tx) => {
  // 1. Create order
  const newOrder = await tx.order.create({
    data: {
      order_number: generateOrderNumber(),
      customer_name: 'John Doe',
      subtotal: 50000,
      discount: 0,
      tax: 0,
      total: 50000,
      payment_method: 'CASH',
      payment_amount: 50000,
      change_amount: 0,
      status: 'COMPLETED',
      created_by: userId,
    },
  })

  // 2. Create order items
  await tx.orderItem.createMany({
    data: orderItems.map((item) => ({
      order_id: newOrder.id,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price,
    })),
  })

  // 3. Update product stocks
  for (const item of orderItems) {
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    })

    // 4. Record stock movement
    await tx.stockMovement.create({
      data: {
        product_id: item.productId,
        type: 'OUT',
        quantity: -item.quantity,
        notes: `Order: ${newOrder.order_number}`,
        created_by: userId,
      },
    })
  }

  return newOrder
})
```

---

## Backup & Restore

### Backup Database

```bash
# PostgreSQL backup
pg_dump -U postgres -d web_koperasi_umb -F c -f backup_$(date +%Y%m%d).dump

# Or using Docker
docker exec postgres pg_dump -U postgres web_koperasi_umb > backup.sql
```

### Restore Database

```bash
# PostgreSQL restore
pg_restore -U postgres -d web_koperasi_umb backup.dump

# Or using SQL file
psql -U postgres -d web_koperasi_umb < backup.sql
```

---

## Performance Tips

1. **Always add indexes** untuk foreign keys dan frequently queried fields
2. **Use `include` sparingly** - only include relations you actually need
3. **Paginate large result sets** - use `take` and `skip`
4. **Use `select` to limit fields** - don't fetch unnecessary data
5. **Use transactions** untuk multiple related operations
6. **Soft delete instead of hard delete** - preserve data integrity
7. **Use `@db.Decimal(15, 2)`** untuk monetary values (precision important!)
8. **Monitor slow queries** dengan Prisma query logging

---

## Database Size Monitoring

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('web_koperasi_umb'));

-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Troubleshooting

### Migration Failed

```bash
# Reset migrations (DEVELOPMENT ONLY!)
npx prisma migrate reset

# Or manually fix:
npx prisma migrate resolve --rolled-back "migration_name"
```

### Schema Out of Sync

```bash
# Generate new migration to sync
npx prisma migrate dev --name fix_schema_drift

# Force regenerate Prisma Client
npx prisma generate --force
```

### Connection Issues

````bash
# Test database connection
npx prisma db pull

# Check connection string in .env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
| action      | String        | e.g., "CREATE_TRANSACTION"     |
| module      | String        | e.g., "FINANCIAL", "INVENTORY" |
| description | String        | Human-readable description     |
| metadata    | Json?         | Optional additional data       |
| created_at  | DateTime      | Action timestamp               |

## Indexes

```prisma
// Important indexes for performance
@@index([user_id])
@@index([created_at])
@@index([type])
@@index([status])
@@index([order_number])
@@index([member_code])
@@index([sku])
````

## Migration Workflow

### 1. Create Migration

```bash
# After modifying schema.prisma
npx prisma migrate dev --name descriptive_name

# Example:
npx prisma migrate dev --name add_supplier_email_field
```

### 2. Apply Migration (Production)

```bash
npx prisma migrate deploy
```

### 3. Reset Database (Development Only!)

```bash
npx prisma migrate reset
```

## Seeding Data

File: `prisma/seed.ts`

```typescript
// Default users
- Super Admin (superadmin@umb.ac.id)
- Koperasi Admin (koperasi@umb.ac.id)
- Kasir (kasir@umb.ac.id)
- Anggota (anggota@umb.ac.id)

// Sample products
- 10 sample products with stock

// Sample members
- 5 sample members
```

Run seed:

```bash
npx prisma db seed
```

## Common Queries

### Get transactions with user info

```typescript
const transactions = await prisma.financialTransaction.findMany({
  include: {
    user: {
      select: { name: true, role: true },
    },
  },
  orderBy: { created_at: 'desc' },
})
```

### Get products with low stock

```typescript
const lowStock = await prisma.product.findMany({
  where: {
    stock_quantity: { lte: prisma.product.fields.min_stock },
  },
})
```

### Get order with items

```typescript
const order = await prisma.order.findUnique({
  where: { id: orderId },
  include: {
    order_items: {
      include: { product: true },
    },
    cashier: {
      select: { name: true },
    },
  },
})
```

## Backup & Restore

### Backup

```bash
pg_dump -U postgres -d koperasi_umb > backup_$(date +%Y%m%d).sql
```

### Restore

```bash
psql -U postgres -d koperasi_umb < backup_20250123.sql
```

---

**Related Documentation:**

- [API Reference](./API-REFERENCE.md) - See how to interact with this data
- [Getting Started](./GETTING-STARTED.md) - Setup database locally
